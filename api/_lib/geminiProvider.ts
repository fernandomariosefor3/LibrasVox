import { GoogleGenAI } from '@google/genai';

/**
 * Único módulo que conhece o SDK do provedor de IA. api/assistant.ts só
 * importa este módulo dinamicamente depois do gate de evidências — nunca
 * antes. GEMINI_API_KEY só é lida dentro de generateGroundedAnswer, no
 * momento em que a chamada é realmente necessária, nunca no topo do
 * módulo. Nenhuma linha deste arquivo registra a chave, o prompt completo
 * ou as evidências.
 */

const DEFAULT_MODEL = 'gemini-2.5-flash';
const DEFAULT_TIMEOUT_MS = 15000;

export interface GenerateGroundedAnswerParams {
  systemInstruction: string;
  userContent: string;
  /**
   * Chamado exatamente uma vez, imediatamente antes de iniciar a chamada
   * real ao SDK — nunca antes disso (nem por importar o módulo, nem por
   * instanciar o cliente, nem por ler a chave). Permite ao chamador
   * marcar provider.called = true só quando a chamada de fato começou.
   */
  onCallStarted?: () => void;
}

export interface ProviderResult {
  answer: string;
}

export async function generateGroundedAnswer({
  systemInstruction,
  userContent,
  onCallStarted,
}: GenerateGroundedAnswerParams): Promise<ProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not defined in the environment.');
    (err as { status?: number }).status = 401;
    throw err;
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const timeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS || String(DEFAULT_TIMEOUT_MS), 10);

  const ai = new GoogleGenAI({ apiKey });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Upstream timeout')), timeoutMs);
  });

  onCallStarted?.();

  const response = await Promise.race([
    ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: userContent }] }],
      config: { systemInstruction },
    }),
    timeoutPromise,
  ]);

  return { answer: response.text ?? '' };
}
