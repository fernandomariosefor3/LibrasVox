/**
 * Contrato público da API do Tutor. Nenhum tipo aqui é derivado do SDK do
 * MCP nem do SDK do provedor de IA — é a fronteira estável entre o
 * frontend e o gateway server-side.
 */

export type ModeId = 'tutor' | 'translator' | 'practice' | 'culture';

export type AssistantCategory = 'linguistic' | 'navigation' | 'social' | 'out_of_scope';

export type RefusalCode =
  | 'NO_VALIDATED_CONTENT'
  | 'OUT_OF_SCOPE'
  | 'INVALID_REQUEST'
  | 'RATE_LIMITED'
  | 'PROVIDER_UNAVAILABLE'
  | 'GROUNDING_VALIDATION_FAILED'
  | 'INTERNAL_ERROR'
  | null;

export interface AssistantRefusal {
  required: boolean;
  code: RefusalCode;
  message: string | null;
}

export interface AssistantProviderInfo {
  called: boolean;
  name: 'gemini' | null;
}

export interface AssistantResponse {
  ok: boolean;
  answer: string;
  grounded: boolean;
  evidenceIds: string[];
  corpusVersion: string;
  category: AssistantCategory;
  refusal: AssistantRefusal;
  provider: AssistantProviderInfo;
}

export interface InboundChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantRequestBody {
  modeId: ModeId;
  messages: InboundChatMessage[];
}

export const ASSISTANT_MODE_IDS: readonly ModeId[] = ['tutor', 'translator', 'practice', 'culture'];
