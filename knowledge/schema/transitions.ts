/**
 * Regras de transição de estado do corpus.
 *
 * Este arquivo NUNCA muda o status de uma entrada — expõe apenas predicados
 * de leitura. Nenhuma função aqui se chama (nem nunca deve se chamar)
 * setValidated, approveAsValidated, autoValidate, validateWithAI ou
 * promoteToValidated. A transição para `validated` é, por design, algo que
 * nenhum código deste stack executa — é um processo humano fora desta
 * fundação (revisão registrada fora do MCP/agentes).
 */

import type { ActorType, KnowledgeStatus } from './types.ts';

const ALLOWED_TRANSITIONS: Record<KnowledgeStatus, readonly KnowledgeStatus[]> = {
  draft: ['under_review', 'blocked'],
  under_review: ['validated', 'blocked', 'draft'],
  validated: ['blocked'],
  blocked: ['draft'],
};

/** Verifica apenas se a aresta from->to existe no grafo de transições. */
export function isTransitionAllowed(from: KnowledgeStatus, to: KnowledgeStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/**
 * Verifica se a transição é permitida PARA o tipo de ator que a propõe.
 * Regra inegociável: nenhuma transição para `validated` é permitida a
 * um ator que não seja humano.
 */
export function isTransitionAllowedForActor(
  from: KnowledgeStatus,
  to: KnowledgeStatus,
  actorType: ActorType,
): boolean {
  if (!isTransitionAllowed(from, to)) return false;
  if (to === 'validated') return actorType === 'human';
  return true;
}
