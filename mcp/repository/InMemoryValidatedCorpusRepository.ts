import type { KnowledgeCorpusEntry } from '../../knowledge/schema/types.ts';
import { canGroundTutorResponse } from '../../knowledge/schema/validators.ts';
import { computeCorpusVersion } from '../corpusVersion.ts';
import type { ValidatedCorpusRepository, SearchValidatedSignsParams } from './ValidatedCorpusRepository.ts';
import type { ValidatedSignDetail, ValidatedSignSummary, CorpusStats } from '../schemas/toolOutputs.ts';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 20;

function toSummary(entry: KnowledgeCorpusEntry): ValidatedSignSummary {
  return {
    id: entry.id,
    portugueseWord: entry.portugueseWord,
    gloss: entry.gloss,
    category: entry.category,
    difficulty: entry.difficulty,
  };
}

function toDetail(entry: KnowledgeCorpusEntry): ValidatedSignDetail {
  return {
    ...toSummary(entry),
    linguisticParameters: entry.linguisticParameters,
    context: entry.context,
    sourceCitations: entry.sources.map((source) => source.citation),
  };
}

/**
 * Implementação em memória: os dados vêm de um import estático de
 * knowledge/corpus/index.ts (compilado junto, sem leitura de arquivo em
 * runtime, sem rede, sem banco de dados). "Somente leitura" é garantido
 * estruturalmente — esta classe não expõe nenhum método de escrita.
 */
export class InMemoryValidatedCorpusRepository implements ValidatedCorpusRepository {
  private readonly entries: readonly KnowledgeCorpusEntry[];

  constructor(entries: readonly KnowledgeCorpusEntry[]) {
    this.entries = entries;
  }

  private eligibleEntries(): KnowledgeCorpusEntry[] {
    return this.entries.filter((entry) => canGroundTutorResponse(entry));
  }

  searchValidated(params: SearchValidatedSignsParams): ValidatedSignSummary[] {
    const limit = Math.min(params.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const needle = params.query.toLocaleLowerCase('pt-BR');

    return this.eligibleEntries()
      .filter((entry) => {
        if (params.category !== undefined && entry.category !== params.category) return false;
        if (params.difficulty !== undefined && entry.difficulty !== params.difficulty) return false;
        if (
          params.region !== undefined &&
          !entry.regionalVariants.some((variant) => variant.stateCode === params.region)
        ) {
          return false;
        }
        const haystack = `${entry.portugueseWord} ${entry.gloss} ${entry.context ?? ''}`.toLocaleLowerCase(
          'pt-BR',
        );
        return haystack.includes(needle);
      })
      .slice(0, limit)
      .map(toSummary);
  }

  getValidatedById(id: string): ValidatedSignDetail | null {
    const entry = this.entries.find((candidate) => candidate.id === id);
    if (!entry || !canGroundTutorResponse(entry)) return null;
    return toDetail(entry);
  }

  listValidatedCategories(): string[] {
    const categories = new Set(this.eligibleEntries().map((entry) => entry.category));
    return [...categories].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  getCorpusStats(): CorpusStats {
    let draft = 0;
    let underReview = 0;
    let validated = 0;
    let blocked = 0;
    let eligibleForGrounding = 0;
    let needsHumanReview = 0;

    for (const entry of this.entries) {
      if (entry.status === 'draft') draft += 1;
      else if (entry.status === 'under_review') underReview += 1;
      else if (entry.status === 'validated') validated += 1;
      else if (entry.status === 'blocked') blocked += 1;

      if (entry.needsHumanReview) needsHumanReview += 1;
      if (canGroundTutorResponse(entry)) eligibleForGrounding += 1;
    }

    return { total: this.entries.length, draft, underReview, validated, blocked, eligibleForGrounding, needsHumanReview };
  }

  getCorpusVersion(): string {
    return computeCorpusVersion(this.entries);
  }
}
