/**
 * Códigos e mensagens de recusa/erro da API HTTP do Tutor.
 *
 * NO_VALIDATED_CONTENT_CODE, GENERIC_NO_VALIDATED_CONTENT_MESSAGE e
 * SIGN_SPECIFIC_REFUSAL_MESSAGE são intencionalmente redefinidos aqui com
 * os mesmos valores usados em mcp/errors/safeErrors.ts, em vez de
 * importados de lá: aquele módulo importa McpError do SDK do MCP
 * (@modelcontextprotocol/sdk/types.js), e a API HTTP não pode depender do
 * SDK do protocolo MCP. Duplicar só os literais de string (não lógica)
 * evita essa dependência sem duplicar nenhuma regra de elegibilidade.
 */

export const NO_VALIDATED_CONTENT_CODE = 'NO_VALIDATED_CONTENT';
export const OUT_OF_SCOPE_CODE = 'OUT_OF_SCOPE';
export const INVALID_REQUEST_CODE = 'INVALID_REQUEST';
export const RATE_LIMITED_CODE = 'RATE_LIMITED';
export const PROVIDER_UNAVAILABLE_CODE = 'PROVIDER_UNAVAILABLE';
export const GROUNDING_VALIDATION_FAILED_CODE = 'GROUNDING_VALIDATION_FAILED';
export const INTERNAL_ERROR_CODE = 'INTERNAL_ERROR';

export const GENERIC_NO_VALIDATED_CONTENT_MESSAGE =
  'O LibrasVox ainda não possui conteúdo validado suficiente para responder com segurança sobre esta solicitação.';

export const SIGN_SPECIFIC_REFUSAL_MESSAGE =
  'O LibrasVox ainda não possui conteúdo validado suficiente para responder com segurança sobre este sinal.';

export const OUT_OF_SCOPE_MESSAGE =
  'Essa pergunta está fora do que o LVP Tutor pode responder no momento. Posso ajudar com sinais de Libras, navegação pelo LibrasVox ou uma conversa simples.';

export const PROVIDER_UNAVAILABLE_MESSAGE =
  'O assistente está temporariamente indisponível. Tente novamente em alguns minutos.';

export const RATE_LIMITED_MESSAGE = 'Muitas solicitações. Tente novamente em instantes.';

export const INTERNAL_ERROR_MESSAGE = 'Não foi possível processar sua solicitação no momento.';

/**
 * Mapeia qualquer erro inesperado do repositório/serviços internos para uma
 * forma segura — nunca ecoa err.message/err.stack cru.
 */
export function toSafeInternalMessage(_err: unknown): string {
  return INTERNAL_ERROR_MESSAGE;
}

export type ProviderErrorCategory =
  | 'timeout'
  | 'authentication'
  | 'permission'
  | 'quota'
  | 'model'
  | 'availability';

/**
 * Categoriza um erro do provedor de IA sem nunca repassar sua mensagem
 * crua ao cliente. Usado só para decidir o log server-side sanitizado.
 */
export function categorizeProviderError(err: unknown): ProviderErrorCategory {
  const status = (err as { status?: number } | null)?.status;
  const message =
    err instanceof Error && typeof err.message === 'string' ? err.message.toLowerCase() : '';

  if (message === 'upstream timeout') return 'timeout';
  if (status === 401 || message.includes('api_key') || message.includes('authentication')) return 'authentication';
  if (status === 403 || message.includes('permission') || message.includes('forbidden')) return 'permission';
  if (status === 429 || message.includes('quota') || message.includes('rate limit') || message.includes('exhausted')) {
    return 'quota';
  }
  if (status === 404 || message.includes('model') || message.includes('not found')) return 'model';
  return 'availability';
}
