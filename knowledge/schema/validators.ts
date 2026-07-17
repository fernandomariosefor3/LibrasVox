/**
 * Validadores estruturais do corpus.
 *
 * Todas as funções aqui são predicados de leitura (nunca mutam a entrada
 * recebida, nunca persistem nada). Nenhuma função promove uma entrada
 * para `validated` — apenas informam se ela SERIA elegível, caso um
 * humano decida validá-la fora deste código.
 */

import type { KnowledgeCorpusEntry } from './types.ts';

export function isPositiveVersion(version: number): boolean {
  return Number.isInteger(version) && version > 0;
}

/**
 * Regra inegociável: uma entrada validated exige, estruturalmente,
 * validatorId, validatorName, validatorRole, validationDate e
 * entry.sources.length > 0.
 */
export function hasCompleteValidationRecord(entry: KnowledgeCorpusEntry): boolean {
  const record = entry.validation;
  if (!record) return false;

  return (
    record.validatorId.trim().length > 0 &&
    record.validatorName.trim().length > 0 &&
    Boolean(record.validatorRole) &&
    record.validationDate.trim().length > 0 &&
    entry.sources.length > 0
  );
}

/** Mídia e licença compatíveis: nenhuma mídia bloqueada, e toda mídia com licença registrada. */
export function hasCompatibleMediaLicensing(entry: KnowledgeCorpusEntry): boolean {
  if (entry.media.length === 0) return true; // entrada não depende de mídia
  return entry.media.every((media) => media.status !== 'blocked' && media.license !== null);
}

/**
 * Checagem estrutural completa de elegibilidade para `validated`.
 * Não executa a transição — apenas informa se as precondições estão
 * satisfeitas, para um processo humano decidir.
 */
export function canBeValidated(entry: KnowledgeCorpusEntry): boolean {
  return (
    hasCompleteValidationRecord(entry) &&
    isPositiveVersion(entry.version) &&
    entry.statusHistory.length > 0 &&
    hasCompatibleMediaLicensing(entry)
  );
}

/**
 * Única condição sob a qual uma entrada pode fundamentar uma resposta do
 * Tutor: validated, com registro de validação completo e mídia compatível.
 * `blocked`, `draft` e `under_review` nunca retornam true aqui.
 */
export function canGroundTutorResponse(entry: KnowledgeCorpusEntry): boolean {
  return (
    entry.status === 'validated' &&
    hasCompleteValidationRecord(entry) &&
    hasCompatibleMediaLicensing(entry)
  );
}

export function hasUniqueIds(entries: readonly KnowledgeCorpusEntry[]): boolean {
  const ids = entries.map((entry) => entry.id);
  return new Set(ids).size === ids.length;
}

/**
 * Percentual de parâmetros linguísticos documentados (0 a 100).
 * Função de LEITURA — não preenche nenhum campo ausente; um campo null
 * continua null antes e depois desta chamada.
 */
export function linguisticCompleteness(entry: KnowledgeCorpusEntry): number {
  const fields = Object.values(entry.linguisticParameters);
  const documented = fields.filter((field) => field !== null && field.trim().length > 0).length;
  return Math.round((documented / fields.length) * 100);
}
