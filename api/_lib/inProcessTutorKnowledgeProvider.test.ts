import { describe, it, expect } from 'vitest';
import { ALL_ENTRIES } from '../../knowledge/corpus/index.js';
import { InMemoryValidatedCorpusRepository } from '../../mcp/repository/InMemoryValidatedCorpusRepository.js';
import { InProcessTutorKnowledgeProvider, defaultTutorKnowledgeProvider } from './inProcessTutorKnowledgeProvider.js';
import type { KnowledgeCorpusEntry } from '../../knowledge/schema/types.js';

const BASE_TIMESTAMP = '2026-07-17T00:00:00.000Z';

function buildDraftEntry(overrides: Partial<KnowledgeCorpusEntry> = {}): KnowledgeCorpusEntry {
  return {
    id: 'fixture-draft',
    portugueseWord: 'Fixture',
    gloss: 'FIXTURE',
    category: 'Básico',
    difficulty: 'iniciante',
    linguisticParameters: {
      handConfiguration: null,
      location: null,
      movement: null,
      orientation: null,
      nonManualExpression: null,
    },
    context: null,
    regionalVariants: [],
    media: [],
    sources: [],
    status: 'draft',
    validation: null,
    needsHumanReview: true,
    validationNotes: null,
    legacyProvenance: null,
    statusHistory: [],
    version: 1,
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
    ...overrides,
  };
}

function buildValidatedEntry(overrides: Partial<KnowledgeCorpusEntry> = {}): KnowledgeCorpusEntry {
  return buildDraftEntry({
    id: 'fixture-validated',
    portugueseWord: 'Fixture Validada',
    gloss: 'FIXTURE-VALIDADA',
    linguisticParameters: {
      handConfiguration: 'Mão aberta',
      location: 'Altura do rosto',
      movement: 'Movimento curto',
      orientation: 'Palma para frente',
      nonManualExpression: 'Expressão neutra',
    },
    context: 'Contexto de teste',
    sources: [{ id: 'fixture-source', type: 'academic', citation: 'Fonte de teste, 2026', url: null, year: 2026 }],
    status: 'validated',
    validation: {
      validatorId: 'fixture-validator',
      validatorName: 'Fixture Validador',
      validatorRole: 'linguista',
      validationDate: BASE_TIMESTAMP,
    },
    needsHumanReview: false,
    statusHistory: [
      { from: 'under_review', to: 'validated', actor: 'fixture-human', actorType: 'human', reason: 'fixture', at: BASE_TIMESTAMP },
    ],
    ...overrides,
  });
}

describe('InProcessTutorKnowledgeProvider — corpus real (3 draft, 0 validated)', () => {
  it('nenhum dos três drafts (olá, obrigado, tchau) é retornado por getValidatedSign', () => {
    for (const id of ['ola', 'obrigado', 'tchau']) {
      expect(defaultTutorKnowledgeProvider.getValidatedSign(id)).toBeNull();
    }
  });

  it('searchValidatedSigns não retorna nenhum draft real', () => {
    const results = defaultTutorKnowledgeProvider.searchValidatedSigns({ query: 'olá' });
    expect(results).toEqual([]);
  });

  it('getCorpusStats reflete total 3, validated 0, eligibleForGrounding 0', () => {
    const stats = defaultTutorKnowledgeProvider.getCorpusStats();
    expect(stats.total).toBe(3);
    expect(stats.validated).toBe(0);
    expect(stats.eligibleForGrounding).toBe(0);
    expect(stats.draft).toBe(3);
  });

  it('checkGroundingEligibility para os três IDs reais retorna STATUS_NOT_VALIDATED', () => {
    const results = defaultTutorKnowledgeProvider.checkGroundingEligibility(['ola', 'obrigado', 'tchau']);
    expect(results).toHaveLength(3);
    for (const result of results) {
      expect(result.eligible).toBe(false);
      expect(result.reasonCode).toBe('STATUS_NOT_VALIDATED');
    }
  });

  it('getCorpusVersion retorna uma string no formato corpus-v1-<hex>', () => {
    const version = defaultTutorKnowledgeProvider.getCorpusVersion();
    expect(version).toMatch(/^corpus-v1-[0-9a-f]{16}$/);
  });

  it('o corpus real permanece imutável após todas as chamadas acima', () => {
    expect(ALL_ENTRIES).toHaveLength(3);
    expect(ALL_ENTRIES.every((entry) => entry.status === 'draft')).toBe(true);
  });
});

describe('InProcessTutorKnowledgeProvider — entradas sintéticas', () => {
  it('uma entrada validated sintética pode fundamentar uma resposta', () => {
    const entries = [buildValidatedEntry()];
    const provider = new InProcessTutorKnowledgeProvider(entries);

    const detail = provider.getValidatedSign('fixture-validated');
    expect(detail).not.toBeNull();
    expect(detail?.id).toBe('fixture-validated');

    const eligibility = provider.checkGroundingEligibility(['fixture-validated']);
    expect(eligibility[0].eligible).toBe(true);
    expect(eligibility[0].reasonCode).toBe('VALIDATED');
  });

  it('entrada blocked nunca é retornada', () => {
    const entries = [buildValidatedEntry({ id: 'fixture-blocked', status: 'blocked' })];
    const provider = new InProcessTutorKnowledgeProvider(entries);

    expect(provider.getValidatedSign('fixture-blocked')).toBeNull();
    expect(provider.checkGroundingEligibility(['fixture-blocked'])[0].reasonCode).toBe('BLOCKED');
  });

  it('entrada under_review nunca é retornada', () => {
    const entries = [buildValidatedEntry({ id: 'fixture-under-review', status: 'under_review' })];
    const provider = new InProcessTutorKnowledgeProvider(entries);

    expect(provider.getValidatedSign('fixture-under-review')).toBeNull();
    expect(provider.checkGroundingEligibility(['fixture-under-review'])[0].reasonCode).toBe('STATUS_NOT_VALIDATED');
  });

  it('entrada draft sintética nunca é retornada', () => {
    const entries = [buildDraftEntry({ id: 'fixture-draft-2' })];
    const provider = new InProcessTutorKnowledgeProvider(entries);

    expect(provider.getValidatedSign('fixture-draft-2')).toBeNull();
  });

  it('ID inexistente retorna reasonCode NOT_FOUND', () => {
    const provider = new InProcessTutorKnowledgeProvider([]);
    expect(provider.checkGroundingEligibility(['inexistente'])[0].reasonCode).toBe('NOT_FOUND');
  });
});
