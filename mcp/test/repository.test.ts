import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryValidatedCorpusRepository } from '../repository/InMemoryValidatedCorpusRepository.ts';
import { ALL_ENTRIES } from '../../knowledge/corpus/index.ts';
import { buildDraftEntry, buildValidatedEntry, buildMedia } from './fixtures.ts';

describe('InMemoryValidatedCorpusRepository — corpus real (3 entradas draft)', () => {
  const repository = new InMemoryValidatedCorpusRepository(ALL_ENTRIES);

  it('getCorpusStats calcula dinamicamente a partir do corpus atual', () => {
    const stats = repository.getCorpusStats();
    assert.equal(stats.total, ALL_ENTRIES.length);
    assert.equal(stats.draft, ALL_ENTRIES.filter((entry) => entry.status === 'draft').length);
    assert.equal(stats.validated, ALL_ENTRIES.filter((entry) => entry.status === 'validated').length);
    // sanidade contra o estado real conhecido do corpus (não hardcoded na implementação)
    assert.equal(stats.total, 3);
    assert.equal(stats.draft, 3);
    assert.equal(stats.validated, 0);
    assert.equal(stats.eligibleForGrounding, 0);
    assert.equal(stats.needsHumanReview, 3);
  });

  it('searchValidated("olá") não retorna nada — ola está draft', () => {
    assert.deepEqual(repository.searchValidated({ query: 'olá' }), []);
  });

  it('getValidatedById("ola") retorna null', () => {
    assert.equal(repository.getValidatedById('ola'), null);
  });

  it('getValidatedById para ID inexistente também retorna null', () => {
    assert.equal(repository.getValidatedById('sinal-que-nao-existe'), null);
  });

  it('listValidatedCategories retorna lista vazia', () => {
    assert.deepEqual(repository.listValidatedCategories(), []);
  });

  it('getCorpusVersion é determinístico e estável entre chamadas', () => {
    const first = repository.getCorpusVersion();
    const second = repository.getCorpusVersion();
    assert.equal(first, second);
    assert.match(first, /^corpus-v1-[0-9a-f]{16}$/);
  });

  it('o corpus real permanece idêntico antes e depois de todas as chamadas de leitura', () => {
    const before = JSON.stringify(ALL_ENTRIES);
    repository.searchValidated({ query: 'a' });
    repository.getValidatedById('ola');
    repository.listValidatedCategories();
    repository.getCorpusStats();
    repository.getCorpusVersion();
    const after = JSON.stringify(ALL_ENTRIES);
    assert.equal(before, after);
  });
});

describe('InMemoryValidatedCorpusRepository — fixtures sintéticas (blocked/under_review/sem fontes/sem validação)', () => {
  it('blocked nunca é retornado por searchValidated nem getValidatedById', () => {
    const blocked = buildDraftEntry({ id: 'sinal-bloqueado', status: 'blocked' });
    const repository = new InMemoryValidatedCorpusRepository([blocked]);
    assert.deepEqual(repository.searchValidated({ query: 'Fixture' }), []);
    assert.equal(repository.getValidatedById('sinal-bloqueado'), null);
  });

  it('under_review nunca é retornado', () => {
    const underReview = buildDraftEntry({ id: 'sinal-em-revisao', status: 'under_review' });
    const repository = new InMemoryValidatedCorpusRepository([underReview]);
    assert.deepEqual(repository.searchValidated({ query: 'Fixture' }), []);
    assert.equal(repository.getValidatedById('sinal-em-revisao'), null);
  });

  it('draft nunca é retornado', () => {
    const draft = buildDraftEntry({ id: 'sinal-rascunho' });
    const repository = new InMemoryValidatedCorpusRepository([draft]);
    assert.deepEqual(repository.searchValidated({ query: 'Fixture' }), []);
    assert.equal(repository.getValidatedById('sinal-rascunho'), null);
  });

  it('validated sem sources nunca fundamenta (não é retornado como confiável)', () => {
    const semFontes = buildValidatedEntry({ id: 'sem-fontes', sources: [] });
    const repository = new InMemoryValidatedCorpusRepository([semFontes]);
    assert.equal(repository.getValidatedById('sem-fontes'), null);
  });

  it('validated sem HumanValidationRecord nunca fundamenta', () => {
    const semValidacao = buildValidatedEntry({ id: 'sem-validacao', validation: null });
    const repository = new InMemoryValidatedCorpusRepository([semValidacao]);
    assert.equal(repository.getValidatedById('sem-validacao'), null);
  });

  it('validated com mídia bloqueada não é elegível', () => {
    const comMidiaBloqueada = buildValidatedEntry({
      id: 'midia-bloqueada',
      media: [buildMedia({ status: 'blocked' })],
    });
    const repository = new InMemoryValidatedCorpusRepository([comMidiaBloqueada]);
    assert.equal(repository.getValidatedById('midia-bloqueada'), null);
  });

  it('validated completo (fontes + validação + sem mídia bloqueada) é retornado', () => {
    const completo = buildValidatedEntry({ id: 'sinal-completo' });
    const repository = new InMemoryValidatedCorpusRepository([completo]);
    const result = repository.getValidatedById('sinal-completo');
    assert.ok(result);
    assert.equal(result.id, 'sinal-completo');
    assert.deepEqual(repository.searchValidated({ query: 'Fixture Validada' }).map((entry) => entry.id), [
      'sinal-completo',
    ]);
    assert.deepEqual(repository.listValidatedCategories(), ['Básico']);
  });
});
