import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { computeDedupKey, detectDuplicateMedia } from '../schema/mediaDuplication.ts';
import type { KnowledgeCorpusEntry, MediaAsset } from '../schema/types.ts';
import { ALL_ENTRIES } from '../corpus/index.ts';

function buildMedia(overrides: Partial<MediaAsset>): MediaAsset {
  return {
    id: 'm1',
    kind: 'video',
    url: 'https://example.com/v?list=abc&index=1',
    origin: 'own_recording',
    dedupKey: null,
    sharedWithSignIds: [],
    license: null,
    status: 'draft',
    ...overrides,
  };
}

function buildEntryWithMedia(id: string, media: MediaAsset[]): KnowledgeCorpusEntry {
  return {
    id,
    portugueseWord: id,
    gloss: id.toUpperCase(),
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
    media,
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
  };
}

describe('mediaDuplication', () => {
  it('gera a mesma dedupKey para a mesma URL', () => {
    const url = 'https://youtube.com/watch?v=abc&list=PL1&index=4';
    assert.equal(computeDedupKey(url), computeDedupKey(url));
  });

  it('detecta mídia compartilhada entre sinais diferentes', () => {
    const sharedUrl = 'https://youtube.com/watch?v=abc&list=PL1&index=4';
    const entryA = buildEntryWithMedia('janeiro', [buildMedia({ id: 'mA', url: sharedUrl })]);
    const entryB = buildEntryWithMedia('fevereiro', [buildMedia({ id: 'mB', url: sharedUrl })]);

    const findings = detectDuplicateMedia([entryA, entryB]);

    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'critical');
    assert.equal(findings[0].recommendation, 'block_and_review');
    assert.deepEqual([...findings[0].involvedEntryIds].sort(), ['fevereiro', 'janeiro']);
  });

  it('não sinaliza mídia usada em um único sinal', () => {
    const entryA = buildEntryWithMedia('unico', [buildMedia({ id: 'mA', url: 'https://example.com/only.mp4' })]);
    assert.deepEqual(detectDuplicateMedia([entryA]), []);
  });

  it('é uma função pura: não muta as entradas nem a mídia recebidas', () => {
    const sharedUrl = 'https://youtube.com/watch?v=abc&list=PL1&index=4';
    const mediaA = buildMedia({ id: 'mA', url: sharedUrl });
    const entryA = buildEntryWithMedia('janeiro', [mediaA]);
    const entryB = buildEntryWithMedia('fevereiro', [buildMedia({ id: 'mB', url: sharedUrl })]);

    const before = JSON.stringify([entryA, entryB]);
    detectDuplicateMedia([entryA, entryB]);
    const after = JSON.stringify([entryA, entryB]);

    assert.equal(before, after);
    assert.deepEqual(mediaA.sharedWithSignIds, []); // nunca escrito pelo detector
    assert.equal(entryA.status, 'draft'); // status não alterado por efeito colateral
  });

  it('não escreve arquivos nem retorna qualquer indício de persistência', () => {
    const sharedUrl = 'https://youtube.com/watch?v=abc&list=PL1&index=4';
    const entryA = buildEntryWithMedia('janeiro', [buildMedia({ id: 'mA', url: sharedUrl })]);
    const entryB = buildEntryWithMedia('fevereiro', [buildMedia({ id: 'mB', url: sharedUrl })]);
    const findings = detectDuplicateMedia([entryA, entryB]);
    // O achado é só um relatório: contém recomendação textual, não uma ação executada.
    for (const finding of findings) {
      assert.equal(typeof finding.recommendation, 'string');
      assert.ok(!('applied' in finding));
      assert.ok(!('blockedAt' in finding));
    }
  });

  it('as 3 entradas reais de fundação não têm mídia (zero risco de duplicidade)', () => {
    assert.deepEqual(detectDuplicateMedia(ALL_ENTRIES), []);
  });
});
