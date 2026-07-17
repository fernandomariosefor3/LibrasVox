import type { ValidatedSignDetail, ValidatedSignSummary, CorpusStats } from '../schemas/toolOutputs.ts';

/**
 * Repositório somente leitura sobre o corpus validado.
 *
 * Nenhum método aqui aceita um parâmetro do tipo includeDraft, unsafeMode,
 * bypassValidation ou returnAllEntries — não existe caminho de código
 * para pedir conteúdo não-validated através desta interface.
 */

export interface SearchValidatedSignsParams {
  query: string;
  category?: string;
  difficulty?: string;
  region?: string;
  limit?: number;
}

export interface ValidatedCorpusRepository {
  /** Retorna só entradas com status validated e elegíveis para fundamentação. */
  searchValidated(params: SearchValidatedSignsParams): ValidatedSignSummary[];

  /** Retorna null se a entrada não existir, não estiver validated, ou não for elegível. */
  getValidatedById(id: string): ValidatedSignDetail | null;

  /** Só categorias com ao menos uma entrada validated e elegível. */
  listValidatedCategories(): string[];

  /** Contagens agregadas, sempre calculadas a partir do corpus atual. */
  getCorpusStats(): CorpusStats;

  /** Hash determinístico do conteúdo atual do corpus. */
  getCorpusVersion(): string;
}
