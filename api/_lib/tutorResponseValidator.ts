import type { ValidatedSignDetail } from '../../mcp/schemas/toolOutputs.js';

/**
 * Última linha de defesa antes de uma resposta gerada sair para o
 * usuário. O modelo nunca fornece evidenceIds — eles são sempre definidos
 * pelo servidor a partir do conjunto recuperado antes da chamada (ver
 * api/assistant.ts). Este validador não confia no texto do modelo para
 * decidir "o que foi usado como evidência"; ele só audita se o TEXTO da
 * resposta contém sinais de invenção (fonte não autorizada, instrução
 * interna revelada, afirmação de validação inexistente).
 *
 * Isto é uma auditoria heurística de texto livre, não uma verificação
 * semântica completa — documentado como tal no relatório da Fase 3A.
 */

const MAX_ANSWER_LENGTH = 4000;

const FORBIDDEN_INTERNAL_PATTERNS: RegExp[] = [
  /REGRAS INVIOL[ÁA]VEIS/i,
  /\[EVID[ÊE]NCIA/i,
  /prompt de sistema/i,
  /system instruction/i,
  /GEMINI_API_KEY/i,
  /voc[êe] [ée] o lvp tutor, assistente/i,
];

const FORBIDDEN_VALIDATION_CLAIM_PATTERNS: RegExp[] = [
  /este sinal (é|está) validado por/i,
  /validado por (um |uma )?(consultor|linguista|professor)/i,
  /confirmado por (um |uma )?(consultor|linguista|professor)/i,
];

export interface ResponseValidationInput {
  answerText: string;
  evidence: readonly ValidatedSignDetail[];
}

export type ResponseValidationFailureReason =
  | 'NO_EVIDENCE'
  | 'EMPTY_ANSWER'
  | 'ANSWER_TOO_LONG'
  | 'INTERNAL_INSTRUCTIONS_LEAKED'
  | 'UNAUTHORIZED_VALIDATION_CLAIM'
  | 'UNAUTHORIZED_SOURCE';

export type ResponseValidationResult =
  | { ok: true }
  | { ok: false; reason: ResponseValidationFailureReason };

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .toLowerCase();
}

/** Extrai candidatos a citação de fonte do texto livre da resposta. */
function extractCitationCandidates(answerText: string): string[] {
  const candidates: string[] = [];

  // Só marcadores de citação deliberados e inequívocos disparam a checagem
  // — "Fonte:" com dois-pontos explícito, ou um ano entre parênteses no
  // estilo acadêmico. Um heurístico mais amplo (ex.: a palavra solta
  // "segundo") gera falsos positivos demais em prosa livre para ser
  // confiável; a defesa estrutural real contra fonte inventada é o gate
  // de evidências antes da chamada ao provedor, não este heurístico.
  const fonteMatches = answerText.matchAll(/fonte[s]?:\s*([^\n.;]{4,120})/gi);
  for (const match of fonteMatches) candidates.push(match[1]);

  const yearParenMatches = answerText.matchAll(/\(([^()]*\b(19|20)\d{2}\b[^()]*)\)/g);
  for (const match of yearParenMatches) candidates.push(match[1]);

  return candidates;
}

function isAuthorizedCitation(candidate: string, authorizedSources: readonly string[]): boolean {
  const normalizedCandidate = normalize(candidate);
  return authorizedSources.some((source) => {
    const normalizedSource = normalize(source);
    return normalizedSource.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedSource);
  });
}

export function validateTutorResponse(input: ResponseValidationInput): ResponseValidationResult {
  const { answerText, evidence } = input;

  // Defesa em profundidade: uma resposta "fundamentada" sem nenhuma
  // evidência nunca deveria chegar aqui (api/assistant.ts recusa antes de
  // chamar o provedor) — se chegar, é rejeitada.
  if (evidence.length === 0) {
    return { ok: false, reason: 'NO_EVIDENCE' };
  }

  if (answerText.trim().length === 0) {
    return { ok: false, reason: 'EMPTY_ANSWER' };
  }

  if (answerText.length > MAX_ANSWER_LENGTH) {
    return { ok: false, reason: 'ANSWER_TOO_LONG' };
  }

  if (FORBIDDEN_INTERNAL_PATTERNS.some((pattern) => pattern.test(answerText))) {
    return { ok: false, reason: 'INTERNAL_INSTRUCTIONS_LEAKED' };
  }

  if (FORBIDDEN_VALIDATION_CLAIM_PATTERNS.some((pattern) => pattern.test(answerText))) {
    return { ok: false, reason: 'UNAUTHORIZED_VALIDATION_CLAIM' };
  }

  const authorizedSources = evidence.flatMap((entry) => entry.sourceCitations);
  const citationCandidates = extractCitationCandidates(answerText);
  const hasUnauthorizedCitation = citationCandidates.some(
    (candidate) => !isAuthorizedCitation(candidate, authorizedSources),
  );
  if (hasUnauthorizedCitation) {
    return { ok: false, reason: 'UNAUTHORIZED_SOURCE' };
  }

  return { ok: true };
}
