import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isPositiveVersion,
  hasCompleteValidationRecord,
  canBeValidated,
  hasUniqueIds,
  linguisticCompleteness,
} from '../schema/validators.ts';
import * as validatorsModule from '../schema/validators.ts';
import type { KnowledgeCorpusEntry } from '../schema/types.ts';
import { ALL_ENTRIES } from '../corpus/index.ts';

function buildEntry(overrides: Partial<KnowledgeCorpusEntry> = {}): KnowledgeCorpusEntry {
  return {
    id: 'test-entry',
    portugueseWord: 'Teste',
    gloss: 'TESTE',
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

describe('validators', () => {
  it('permite draft existir sem validação humana', () => {
    const entry = buildEntry({ status: 'draft', validation: null });
    assert.equal(entry.status, 'draft');
    assert.equal(entry.validation, null);
  });

  it('rejeita validated sem validatorId', () => {
    const entry = buildEntry({
      validation: { validatorId: '', validatorName: 'X', validatorRole: 'linguista', validationDate: '2026-07-17' },
      sources: [{ id: 's1', type: 'academic', citation: 'X', url: null, year: null }],
    });
    assert.equal(hasCompleteValidationRecord(entry), false);
  });

  it('rejeita validated sem sources', () => {
    const entry = buildEntry({
      validation: { validatorId: 'v1', validatorName: 'X', validatorRole: 'linguista', validationDate: '2026-07-17' },
      sources: [],
    });
    assert.equal(hasCompleteValidationRecord(entry), false);
    assert.equal(canBeValidated(entry), false);
  });

  it('aceita registro de validação completo com sources preenchido', () => {
    const entry = buildEntry({
      validation: { validatorId: 'v1', validatorName: 'X', validatorRole: 'linguista', validationDate: '2026-07-17' },
      sources: [{ id: 's1', type: 'academic', citation: 'X', url: null, year: null }],
      statusHistory: [
        { from: 'under_review', to: 'validated', actor: 'humano', actorType: 'human', reason: 'ok', at: '2026-07-17T00:00:00.000Z' },
      ],
      version: 1,
    });
    assert.equal(hasCompleteValidationRecord(entry), true);
    assert.equal(canBeValidated(entry), true);
  });

  it('exige IDs de corpus únicos', () => {
    assert.equal(hasUniqueIds(ALL_ENTRIES), true);
    assert.equal(hasUniqueIds([buildEntry({ id: 'a' }), buildEntry({ id: 'a' })]), false);
  });

  it('exige versões inteiras positivas', () => {
    assert.equal(isPositiveVersion(1), true);
    assert.equal(isPositiveVersion(0), false);
    assert.equal(isPositiveVersion(-1), false);
    assert.equal(isPositiveVersion(1.5), false);
  });

  it('não preenche automaticamente campos linguísticos ausentes', () => {
    const entry = buildEntry();
    assert.equal(linguisticCompleteness(entry), 0);
    assert.equal(entry.linguisticParameters.handConfiguration, null);
    assert.equal(entry.linguisticParameters.location, null);
    assert.equal(entry.linguisticParameters.movement, null);
    assert.equal(entry.linguisticParameters.orientation, null);
    assert.equal(entry.linguisticParameters.nonManualExpression, null);
  });

  it('as 3 entradas de fundação têm os parâmetros linguísticos documentados intactos', () => {
    for (const entry of ALL_ENTRIES) {
      assert.equal(linguisticCompleteness(entry), 100);
    }
  });

  it('nunca expõe uma função que promove status para validated', () => {
    const forbidden = [
      'setValidated',
      'approveAsValidated',
      'autoValidate',
      'validateWithAI',
      'promoteToValidated',
    ];
    for (const name of forbidden) {
      assert.equal(name in validatorsModule, false, `função proibida encontrada: ${name}`);
    }
  });
});
