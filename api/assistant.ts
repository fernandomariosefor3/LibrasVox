import type { VercelRequest, VercelResponse } from '@vercel/node';
import type {
  AssistantResponse,
  AssistantCategory,
  RefusalCode,
  InboundChatMessage,
  ModeId,
} from './_lib/contracts.js';
import { ASSISTANT_MODE_IDS } from './_lib/contracts.js';
import { classifyRequest } from './_lib/requestClassifier.js';
import type { TutorKnowledgeProvider } from './_lib/tutorKnowledgeProvider.js';
import { defaultTutorKnowledgeProvider } from './_lib/inProcessTutorKnowledgeProvider.js';
import { buildGroundedPrompt } from './_lib/groundedPromptBuilder.js';
import { validateTutorResponse } from './_lib/tutorResponseValidator.js';
import { createRateLimiter } from './_lib/rateLimit.js';
import {
  NO_VALIDATED_CONTENT_CODE,
  GENERIC_NO_VALIDATED_CONTENT_MESSAGE,
  SIGN_SPECIFIC_REFUSAL_MESSAGE,
  OUT_OF_SCOPE_MESSAGE,
  PROVIDER_UNAVAILABLE_MESSAGE,
  RATE_LIMITED_MESSAGE,
  INTERNAL_ERROR_MESSAGE,
  categorizeProviderError,
} from './_lib/errors.js';
import type { ValidatedSignDetail } from '../mcp/schemas/toolOutputs.js';

const MAX_MESSAGES = 20;
const HISTORY_WINDOW = 10;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_TOTAL_LENGTH = 10000;

const NAVIGATION_ANSWER =
  'Você pode encontrar isso no menu do LibrasVox: Glossário, Videoaulas, Gramática, Exercícios, Flashcards e Progresso estão todos na navegação principal.';
const SOCIAL_ANSWER = 'Oi! Eu sou o LVP Tutor. Posso ajudar com sinais de Libras validados assim que estiverem disponíveis.';

function buildBaseResponse(corpusVersion: string): AssistantResponse {
  return {
    ok: true,
    answer: '',
    grounded: false,
    evidenceIds: [],
    corpusVersion,
    category: 'out_of_scope',
    refusal: { required: false, code: null, message: null },
    provider: { called: false, name: null },
  };
}

function rejectRequest(
  res: VercelResponse,
  status: number,
  corpusVersion: string,
  code: RefusalCode,
  message: string,
): void {
  const body: AssistantResponse = {
    ...buildBaseResponse(corpusVersion),
    ok: false,
    answer: message,
    category: 'out_of_scope',
    refusal: { required: true, code, message },
  };
  res.status(status).json(body);
}

function isValidModeId(value: unknown): value is ModeId {
  return typeof value === 'string' && (ASSISTANT_MODE_IDS as readonly string[]).includes(value);
}

function isValidMessage(value: unknown): value is InboundChatMessage {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.role !== 'user' && candidate.role !== 'assistant') return false;
  if (typeof candidate.content !== 'string' || candidate.content.trim() === '') return false;
  if (candidate.content.length > MAX_MESSAGE_LENGTH) return false;
  return true;
}

/**
 * Corta o histórico de forma determinística, preservando o fim da
 * conversa. Nesta fase só a última mensagem (do usuário) é efetivamente
 * usada para classificar/responder — nenhum histórico de conversa é
 * enviado ao provedor (cada pergunta é avaliada isoladamente, sem memória
 * de turnos anteriores). O corte existe para limitar o payload aceito e
 * preparar terreno para uma futura fase com contexto multi-turno.
 */
export function truncateHistory(messages: InboundChatMessage[]): InboundChatMessage[] {
  let truncated = messages.slice(-HISTORY_WINDOW);
  if (truncated.length > 0 && truncated[0].role !== 'user') {
    truncated = truncated.slice(1);
  }
  return truncated;
}

/** Decide entre a mensagem de recusa genérica e a específica de sinal, de forma determinística. */
export function isSignSpecificQuestion(text: string): boolean {
  return /sinal\s+(de|do|da)\s+\S/i.test(text) || /como\s+(se\s+)?sinaliz/i.test(text) || /^traduza/i.test(text.trim());
}

const SEARCH_STOPWORDS = new Set([
  'o',
  'a',
  'os',
  'as',
  'de',
  'do',
  'da',
  'dos',
  'das',
  'em',
  'no',
  'na',
  'nos',
  'nas',
  'um',
  'uma',
  'para',
  'com',
  'sem',
  'por',
  'que',
  'qual',
  'quais',
  'como',
  'me',
  'meu',
  'minha',
  'este',
  'esta',
  'isso',
  'e',
  'ou',
  'sinal',
  'sinais',
  'libras',
  'explique',
  'explica',
  'fale',
  'sobre',
  'crie',
  'traduza',
  'movimento',
]);

const DIACRITIC_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

/**
 * searchValidatedSigns exige que o termo buscado seja substring do
 * conteúdo da entrada (haystack.includes(needle)) — não o contrário.
 * Uma pergunta inteira do usuário quase nunca é substring do conteúdo de
 * uma entrada, então extraímos termos curtos e específicos da pergunta
 * (removendo palavras de parada) e buscamos cada um. Isto não é uma
 * decisão de IA — é normalização de texto determinística.
 */
export function extractSearchTerms(text: string): string[] {
  const normalized = text
    .normalize('NFD')
    .replace(DIACRITIC_MARKS, '')
    .toLowerCase();
  const words = normalized.split(/[^a-z0-9]+/).filter((word) => word.length >= 3 && !SEARCH_STOPWORDS.has(word));
  return [...new Set(words)];
}

/** Envelope + status HTTP juntos — cada caminho decide seu próprio status, nunca fixo em 200. */
interface HandlerResult {
  status: number;
  body: AssistantResponse;
}

function ok200(body: AssistantResponse): HandlerResult {
  return { status: 200, body };
}

/**
 * Fábrica do handler HTTP. Aceita um TutorKnowledgeProvider injetado para
 * permitir testes com corpus sintético — em produção, o export default
 * usa sempre defaultTutorKnowledgeProvider (corpus real).
 */
export function createAssistantHandler(provider: TutorKnowledgeProvider = defaultTutorKnowledgeProvider) {
  const checkRateLimit = createRateLimiter();

  async function handleLinguistic(question: string, corpusVersion: string): Promise<HandlerResult> {
    const searchTerms = extractSearchTerms(question);
    const matchesById = new Map<string, ReturnType<TutorKnowledgeProvider['searchValidatedSigns']>[number]>();
    for (const term of searchTerms.length > 0 ? searchTerms : [question]) {
      for (const match of provider.searchValidatedSigns({ query: term })) {
        matchesById.set(match.id, match);
      }
    }
    const matches = [...matchesById.values()];
    const evidenceIds = matches.map((match) => match.id);

    // Gate estrutural: nenhuma importação dinâmica, leitura de chave,
    // montagem de prompt ou chamada ao provedor acontece antes desta
    // checagem.
    if (evidenceIds.length === 0) {
      const message = isSignSpecificQuestion(question) ? SIGN_SPECIFIC_REFUSAL_MESSAGE : GENERIC_NO_VALIDATED_CONTENT_MESSAGE;
      return ok200({
        ok: true,
        answer: message,
        grounded: false,
        evidenceIds: [],
        corpusVersion,
        category: 'linguistic',
        refusal: { required: true, code: NO_VALIDATED_CONTENT_CODE, message },
        provider: { called: false, name: null },
      });
    }

    const evidence = evidenceIds
      .map((id) => provider.getValidatedSign(id))
      .filter((entry): entry is ValidatedSignDetail => entry !== null);

    if (evidence.length === 0) {
      // Defensivo: os ids vieram de uma busca já filtrada por
      // elegibilidade, então isto não deveria acontecer — se acontecer,
      // recusa em segurança.
      return ok200({
        ok: true,
        answer: GENERIC_NO_VALIDATED_CONTENT_MESSAGE,
        grounded: false,
        evidenceIds: [],
        corpusVersion,
        category: 'linguistic',
        refusal: { required: true, code: NO_VALIDATED_CONTENT_CODE, message: GENERIC_NO_VALIDATED_CONTENT_MESSAGE },
        provider: { called: false, name: null },
      });
    }

    const prompt = buildGroundedPrompt(question, evidence);

    let providerCalled = false;
    try {
      // Importação dinâmica só depois do gate de evidências acima.
      const { generateGroundedAnswer } = await import('./_lib/geminiProvider.js');
      const result = await generateGroundedAnswer({
        systemInstruction: prompt.systemInstruction,
        userContent: prompt.userContent,
        onCallStarted: () => {
          providerCalled = true;
        },
      });

      const validation = validateTutorResponse({ answerText: result.answer, evidence });
      if (!validation.ok) {
        console.error(`[ASSISTANT_VALIDATION_FAILED] reason=${validation.reason}`);
        return ok200({
          ok: true,
          answer: GENERIC_NO_VALIDATED_CONTENT_MESSAGE,
          grounded: false,
          evidenceIds: [],
          corpusVersion,
          category: 'linguistic',
          refusal: {
            required: true,
            code: 'GROUNDING_VALIDATION_FAILED',
            message: GENERIC_NO_VALIDATED_CONTENT_MESSAGE,
          },
          provider: { called: true, name: 'gemini' },
        });
      }

      return ok200({
        ok: true,
        answer: result.answer,
        grounded: true,
        evidenceIds,
        corpusVersion,
        category: 'linguistic',
        refusal: { required: false, code: null, message: null },
        provider: { called: true, name: 'gemini' },
      });
    } catch (err) {
      const category = categorizeProviderError(err);
      console.error(`[ASSISTANT_PROVIDER_ERROR] category=${category} called=${providerCalled}`);
      const message = PROVIDER_UNAVAILABLE_MESSAGE;
      return {
        status: 503,
        body: {
          ok: false,
          answer: message,
          grounded: false,
          evidenceIds: [],
          corpusVersion,
          category: 'linguistic',
          refusal: { required: true, code: 'PROVIDER_UNAVAILABLE', message },
          provider: { called: providerCalled, name: providerCalled ? 'gemini' : null },
        },
      };
    }
  }

  function handleCategory(
    category: AssistantCategory,
    question: string,
    corpusVersion: string,
  ): HandlerResult | Promise<HandlerResult> {
    if (category === 'linguistic') return handleLinguistic(question, corpusVersion);

    if (category === 'navigation') {
      return ok200({
        ok: true,
        answer: NAVIGATION_ANSWER,
        grounded: false,
        evidenceIds: [],
        corpusVersion,
        category: 'navigation',
        refusal: { required: false, code: null, message: null },
        provider: { called: false, name: null },
      });
    }

    if (category === 'social') {
      return ok200({
        ok: true,
        answer: SOCIAL_ANSWER,
        grounded: false,
        evidenceIds: [],
        corpusVersion,
        category: 'social',
        refusal: { required: false, code: null, message: null },
        provider: { called: false, name: null },
      });
    }

    return ok200({
      ok: true,
      answer: OUT_OF_SCOPE_MESSAGE,
      grounded: false,
      evidenceIds: [],
      corpusVersion,
      category: 'out_of_scope',
      refusal: { required: true, code: 'OUT_OF_SCOPE', message: OUT_OF_SCOPE_MESSAGE },
      provider: { called: false, name: null },
    });
  }

  return async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    const corpusVersion = provider.getCorpusVersion();

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      rejectRequest(res, 405, corpusVersion, 'INVALID_REQUEST', 'Método não permitido.');
      return;
    }

    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      rejectRequest(res, 415, corpusVersion, 'INVALID_REQUEST', 'Content-Type deve ser application/json.');
      return;
    }

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown';
    const rateLimitResult = checkRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      if (rateLimitResult.retryAfterSeconds !== undefined) {
        res.setHeader('Retry-After', String(rateLimitResult.retryAfterSeconds));
      }
      rejectRequest(res, 429, corpusVersion, 'RATE_LIMITED', RATE_LIMITED_MESSAGE);
      return;
    }

    try {
      const body = req.body as unknown;
      if (!body || typeof body !== 'object') {
        rejectRequest(res, 400, corpusVersion, 'INVALID_REQUEST', 'Corpo da requisição inválido.');
        return;
      }

      const { modeId, messages } = body as { modeId?: unknown; messages?: unknown };

      if (!isValidModeId(modeId)) {
        rejectRequest(res, 400, corpusVersion, 'INVALID_REQUEST', 'modeId inválido.');
        return;
      }

      if (!Array.isArray(messages) || messages.length === 0) {
        rejectRequest(res, 400, corpusVersion, 'INVALID_REQUEST', 'messages deve ser um array não vazio.');
        return;
      }

      if (messages.length > MAX_MESSAGES) {
        rejectRequest(res, 400, corpusVersion, 'INVALID_REQUEST', 'Histórico de mensagens excede o limite permitido.');
        return;
      }

      if (!messages.every(isValidMessage)) {
        rejectRequest(res, 400, corpusVersion, 'INVALID_REQUEST', 'Uma ou mais mensagens têm formato inválido.');
        return;
      }

      const totalLength = (messages as InboundChatMessage[]).reduce((sum, msg) => sum + msg.content.length, 0);
      if (totalLength > MAX_TOTAL_LENGTH) {
        rejectRequest(res, 400, corpusVersion, 'INVALID_REQUEST', 'Payload total excede o limite permitido.');
        return;
      }

      const history = truncateHistory(messages as InboundChatMessage[]);
      const lastMessage = history[history.length - 1];
      if (!lastMessage || lastMessage.role !== 'user') {
        rejectRequest(res, 400, corpusVersion, 'INVALID_REQUEST', 'A última mensagem deve ser do usuário.');
        return;
      }

      const category = classifyRequest(lastMessage.content);
      const result = await handleCategory(category, lastMessage.content, corpusVersion);
      res.status(result.status).json(result.body);
    } catch (err) {
      console.error('[ASSISTANT_INTERNAL_ERROR]', err instanceof Error ? err.name : 'unknown');
      rejectRequest(res, 500, corpusVersion, 'INTERNAL_ERROR', INTERNAL_ERROR_MESSAGE);
    }
  };
}

export default createAssistantHandler();
