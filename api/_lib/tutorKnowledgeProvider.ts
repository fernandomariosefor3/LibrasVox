/**
 * Interface independente de transporte entre o gateway HTTP e o corpus
 * validado. Só importa tipos e schemas puros de mcp/ — nunca
 * mcp/server.ts, mcp/index.ts, mcp/tools/**, mcp/resources/**,
 * mcp/prompts/** ou qualquer componente do SDK do protocolo MCP.
 */
import type {
  ValidatedSignSummary,
  ValidatedSignDetail,
  CorpusStats,
  EligibilityResult,
} from '../../mcp/schemas/toolOutputs.js';
import type { SearchValidatedSignsParams } from '../../mcp/repository/ValidatedCorpusRepository.js';

export type { SearchValidatedSignsParams };

export interface TutorKnowledgeProvider {
  /** Retorna só entradas validated e elegíveis para fundamentação. */
  searchValidatedSigns(params: SearchValidatedSignsParams): ValidatedSignSummary[];

  /** Retorna null se a entrada não existir, não estiver validated, ou não for elegível. */
  getValidatedSign(id: string): ValidatedSignDetail | null;

  /** Contagens agregadas, calculadas a partir do corpus atual. */
  getCorpusStats(): CorpusStats;

  /** Hash determinístico do conteúdo atual do corpus. */
  getCorpusVersion(): string;

  /** Para cada ID, informa se é elegível e por quê (reasonCode seguro). */
  checkGroundingEligibility(ids: readonly string[]): EligibilityResult[];
}
