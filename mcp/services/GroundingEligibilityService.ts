import type { KnowledgeCorpusEntry } from '../../knowledge/schema/types.ts';
import { hasCompleteValidationRecord, hasCompatibleMediaLicensing } from '../../knowledge/schema/validators.ts';
import type { ReasonCode, EligibilityResult } from '../schemas/toolOutputs.ts';

/**
 * Calcula o reasonCode de elegibilidade para fundamentação. Reaproveita
 * os predicados puros de knowledge/schema/validators.ts (Fase 1) em vez
 * de duplicar julgamento linguístico ou de integridade aqui — este
 * serviço só decide QUAL código de razão descreve o estado já calculado
 * por eles.
 *
 * Ordem de precedência (a primeira regra que falhar decide o código):
 * NOT_FOUND -> BLOCKED -> STATUS_NOT_VALIDATED -> HUMAN_REVIEW_REQUIRED
 * -> MISSING_SOURCES -> MISSING_HUMAN_VALIDATION -> MEDIA_NOT_ELIGIBLE
 * -> VALIDATED.
 */
export function computeReasonCode(entry: KnowledgeCorpusEntry | undefined): ReasonCode {
  if (!entry) return 'NOT_FOUND';
  if (entry.status === 'blocked') return 'BLOCKED';
  if (entry.status !== 'validated') return 'STATUS_NOT_VALIDATED';
  if (entry.needsHumanReview) return 'HUMAN_REVIEW_REQUIRED';
  if (entry.sources.length === 0) return 'MISSING_SOURCES';
  if (!hasCompleteValidationRecord(entry)) return 'MISSING_HUMAN_VALIDATION';
  if (!hasCompatibleMediaLicensing(entry)) return 'MEDIA_NOT_ELIGIBLE';
  return 'VALIDATED';
}

export function checkGroundingEligibility(
  entryIds: readonly string[],
  entries: readonly KnowledgeCorpusEntry[],
): EligibilityResult[] {
  return entryIds.map((id) => {
    const entry = entries.find((candidate) => candidate.id === id);
    const reasonCode = computeReasonCode(entry);
    return { id, eligible: reasonCode === 'VALIDATED', reasonCode };
  });
}
