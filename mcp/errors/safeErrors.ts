import { McpError } from '@modelcontextprotocol/sdk/types.js';

/**
 * Todo erro e toda mensagem de recusa deste servidor passam por este
 * arquivo. Nada aqui inclui stack trace, caminho local, variável de
 * ambiente ou configuração pessoal.
 */

export const NO_VALIDATED_CONTENT_CODE = 'NO_VALIDATED_CONTENT';

/** Usada pelas tools quando a resposta é genérica (não fala de um sinal específico). */
export const GENERIC_NO_VALIDATED_CONTENT_MESSAGE =
  'O LibrasVox ainda não possui conteúdo validado suficiente para responder com segurança.';

/** Usada pelo prompt safe_tutor_refusal, que fala sobre um sinal específico. */
export const SIGN_SPECIFIC_REFUSAL_MESSAGE =
  'O LibrasVox ainda não possui conteúdo validado suficiente para responder com segurança sobre este sinal.';

/**
 * Código de erro de protocolo para "Resource not found", conforme a
 * convenção documentada do MCP para resources ausentes/indisponíveis.
 * Não é um membro nomeado no ErrorCode padrão do SDK (que só cobre os
 * códigos JSON-RPC base) — por isso é uma constante local, não um enum.
 */
const RESOURCE_NOT_FOUND_CODE = -32002;

/**
 * Erro de protocolo único e seguro para libras://signs/{id}. Nunca
 * revela se a entrada existe como draft/under_review/blocked, nunca
 * inclui parâmetros linguísticos, nunca inclui stack trace ou caminho
 * local — só o URI solicitado (que já é público) e uma mensagem fixa.
 */
export function createResourceNotFoundError(uri: string): McpError {
  return new McpError(RESOURCE_NOT_FOUND_CODE, 'Resource not found', { uri });
}

export interface SafeToolError {
  code: string;
  message: string;
}

/**
 * Mapeia qualquer erro inesperado para uma forma segura antes de sair
 * do processo. Nunca ecoa err.message/err.stack cru — só um código e
 * uma mensagem genérica fixa.
 */
export function toSafeToolError(_err: unknown): SafeToolError {
  return {
    code: 'INTERNAL_ERROR',
    message: 'Erro interno ao processar a solicitação.',
  };
}
