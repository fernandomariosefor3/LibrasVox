/**
 * Implementação em processo do TutorKnowledgeProvider. Reaproveita
 * exatamente a mesma wiring de mcp/index.ts — repositório em memória
 * construído sobre um conjunto de entradas, com as mesmas entradas
 * também usadas diretamente pelo serviço de elegibilidade (o
 * repositório não expõe as entradas cruas, então o provider guarda sua
 * própria referência, igual ao segundo argumento de createServer em
 * mcp/server.ts). Nunca importa mcp/server.ts, nunca cria o objeto de
 * servidor do protocolo, nunca inicia um transporte stdio. O corpus
 * nunca é mutado por este módulo.
 */
import { ALL_ENTRIES } from '../../knowledge/corpus/index.js';
import { InMemoryValidatedCorpusRepository } from '../../mcp/repository/InMemoryValidatedCorpusRepository.js';
import { checkGroundingEligibility } from '../../mcp/services/GroundingEligibilityService.js';
import type {
  TutorKnowledgeProvider,
  SearchValidatedSignsParams,
} from './tutorKnowledgeProvider.js';
import type {
  ValidatedSignSummary,
  ValidatedSignDetail,
  CorpusStats,
  EligibilityResult,
} from '../../mcp/schemas/toolOutputs.js';
import type { KnowledgeCorpusEntry } from '../../knowledge/schema/types.js';

export class InProcessTutorKnowledgeProvider implements TutorKnowledgeProvider {
  private readonly entries: readonly KnowledgeCorpusEntry[];
  private readonly repository: InMemoryValidatedCorpusRepository;

  constructor(entries: readonly KnowledgeCorpusEntry[] = ALL_ENTRIES) {
    this.entries = entries;
    this.repository = new InMemoryValidatedCorpusRepository(entries);
  }

  searchValidatedSigns(params: SearchValidatedSignsParams): ValidatedSignSummary[] {
    return this.repository.searchValidated(params);
  }

  getValidatedSign(id: string): ValidatedSignDetail | null {
    return this.repository.getValidatedById(id);
  }

  getCorpusStats(): CorpusStats {
    return this.repository.getCorpusStats();
  }

  getCorpusVersion(): string {
    return this.repository.getCorpusVersion();
  }

  checkGroundingEligibility(ids: readonly string[]): EligibilityResult[] {
    return checkGroundingEligibility(ids, this.entries);
  }
}

/** Instância padrão compartilhada pelo handler HTTP — sem estado mutável. */
export const defaultTutorKnowledgeProvider = new InProcessTutorKnowledgeProvider();
