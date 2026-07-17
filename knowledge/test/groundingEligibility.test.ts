import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canGroundTutorResponse } from '../schema/validators.ts';
import type { KnowledgeCorpusEntry } from '../schema/types.ts';
import { ALL_ENTRIES } from '../corpus/index.ts';

function buildEntry(overrides: Partial<KnowledgeCorpusEntry> = {}): KnowledgeCorpusEntry {
  return {
    id: 'x',
    portugueseWord: 'x',
    gloss: 'X',
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
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z',
    ...overrides,
  };
}

describe('groundingEligibility', () => {
  it('blocked nunca funda o Tutor, mesmo com validação completa', () => {
    const entry = buildEntry({
      status: 'blocked',
      validation: { validatorId: 'v1', validatorName: 'X', validatorRole: 'linguista', validationDate: '2026-07-17' },
      sources: [{ id: 's1', type: 'academic', citation: 'X', url: null, year: null }],
    });
    assert.equal(canGroundTutorResponse(entry), false);
  });

  it('draft e under_review nunca fundam o Tutor', () => {
    assert.equal(canGroundTutorResponse(buildEntry({ status: 'draft' })), false);
    assert.equal(canGroundTutorResponse(buildEntry({ status: 'under_review' })), false);
  });

  it('entrada sem sources não pode fundar o Tutor mesmo se status fosse validated', () => {
    const entry = buildEntry({
      status: 'validated',
      validation: { validatorId: 'v1', validatorName: 'X', validatorRole: 'linguista', validationDate: '2026-07-17' },
      sources: [],
    });
    assert.equal(canGroundTutorResponse(entry), false);
  });

  it('validated com fontes e validação completa pode fundar o Tutor', () => {
    const entry = buildEntry({
      status: 'validated',
      validation: { validatorId: 'v1', validatorName: 'X', validatorRole: 'linguista', validationDate: '2026-07-17' },
      sources: [{ id: 's1', type: 'academic', citation: 'X', url: null, year: null }],
    });
    assert.equal(canGroundTutorResponse(entry), true);
  });

  it('nenhuma das 3 entradas de fundação pode fundar o Tutor hoje (todas draft)', () => {
    for (const entry of ALL_ENTRIES) {
      assert.equal(canGroundTutorResponse(entry), false);
      assert.equal(entry.status, 'draft');
      assert.equal(entry.validation, null);
      assert.equal(entry.needsHumanReview, true);
    }
  });
});
