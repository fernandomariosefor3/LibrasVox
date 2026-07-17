import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_ENTRIES } from '../../knowledge/corpus/index.ts';
import { connectTestClient, buildValidatedEntry } from './fixtures.ts';

describe('tools — corpus real (3 entradas draft)', () => {
  const clientPromise = connectTestClient(ALL_ENTRIES);
  after(async () => {
    const { close } = await clientPromise;
    await close();
  });

  it('listTools retorna somente as 5 tools aprovadas', async () => {
    const { client } = await clientPromise;
    const { tools } = await client.listTools();
    assert.deepEqual(
      tools.map((tool) => tool.name).sort(),
      [
        'check_grounding_eligibility',
        'get_corpus_stats',
        'get_validated_sign',
        'list_validated_categories',
        'search_validated_signs',
      ],
    );
  });

  it('search_validated_signs("olá") retorna matches vazio e recusa estruturada', async () => {
    const { client } = await clientPromise;
    const result = await client.callTool({ name: 'search_validated_signs', arguments: { query: 'olá' } });
    const data = result.structuredContent as {
      ok: boolean;
      data: { matches: unknown[] };
      refusal: { required: boolean; code: string | null };
    };
    assert.equal(data.ok, true);
    assert.deepEqual(data.data.matches, []);
    assert.equal(data.refusal.required, true);
    assert.equal(data.refusal.code, 'NO_VALIDATED_CONTENT');
    assert.equal(JSON.stringify(data).includes('handConfiguration'), false);
  });

  it('get_validated_sign("ola") não retorna o draft', async () => {
    const { client } = await clientPromise;
    const result = await client.callTool({ name: 'get_validated_sign', arguments: { id: 'ola' } });
    const data = result.structuredContent as { data: { entry: unknown } };
    assert.equal(data.data.entry, null);
  });

  it('list_validated_categories retorna []', async () => {
    const { client } = await clientPromise;
    const result = await client.callTool({ name: 'list_validated_categories', arguments: {} });
    const data = result.structuredContent as { data: { categories: string[] } };
    assert.deepEqual(data.data.categories, []);
  });

  it('get_corpus_stats calcula dinamicamente total 3, draft 3, validated 0, eligibleForGrounding 0', async () => {
    const { client } = await clientPromise;
    const result = await client.callTool({ name: 'get_corpus_stats', arguments: {} });
    const data = result.structuredContent as {
      data: { total: number; draft: number; validated: number; eligibleForGrounding: number };
    };
    assert.equal(data.data.total, 3);
    assert.equal(data.data.draft, 3);
    assert.equal(data.data.validated, 0);
    assert.equal(data.data.eligibleForGrounding, 0);
  });

  it('input inválido (query ausente) é rejeitado pelo servidor', async () => {
    const { client } = await clientPromise;
    const result = await client.callTool({ name: 'search_validated_signs', arguments: {} });
    assert.equal(result.isError, true);
  });

  it('query excessivamente longa é rejeitada pelo servidor', async () => {
    const { client } = await clientPromise;
    const result = await client.callTool({
      name: 'search_validated_signs',
      arguments: { query: 'a'.repeat(101) },
    });
    assert.equal(result.isError, true);
  });

  it('limit acima do máximo é rejeitado pelo servidor', async () => {
    const { client } = await clientPromise;
    const result = await client.callTool({
      name: 'search_validated_signs',
      arguments: { query: 'ola', limit: 21 },
    });
    assert.equal(result.isError, true);
  });

  it('array de IDs excessivo em check_grounding_eligibility é rejeitado pelo servidor', async () => {
    const { client } = await clientPromise;
    const tooMany = Array.from({ length: 21 }, (_, index) => `id-${index}`);
    const result = await client.callTool({
      name: 'check_grounding_eligibility',
      arguments: { entryIds: tooMany },
    });
    assert.equal(result.isError, true);
  });

  it('check_grounding_eligibility para as 3 entradas retorna STATUS_NOT_VALIDATED', async () => {
    const { client } = await clientPromise;
    const result = await client.callTool({
      name: 'check_grounding_eligibility',
      arguments: { entryIds: ['ola', 'obrigado', 'tchau'] },
    });
    const data = result.structuredContent as { data: { results: Array<{ id: string; eligible: boolean; reasonCode: string }> } };
    for (const entryResult of data.data.results) {
      assert.equal(entryResult.eligible, false);
      assert.equal(entryResult.reasonCode, 'STATUS_NOT_VALIDATED');
    }
  });

  it('check_grounding_eligibility para ID inexistente retorna NOT_FOUND', async () => {
    const { client } = await clientPromise;
    const result = await client.callTool({
      name: 'check_grounding_eligibility',
      arguments: { entryIds: ['nao-existe'] },
    });
    const data = result.structuredContent as { data: { results: Array<{ reasonCode: string }> } };
    assert.equal(data.data.results[0]?.reasonCode, 'NOT_FOUND');
  });

  it('nenhuma tool muta o corpus — snapshot idêntico antes e depois de todas as chamadas', async () => {
    const before = JSON.stringify(ALL_ENTRIES);
    const { client } = await clientPromise;
    await client.callTool({ name: 'search_validated_signs', arguments: { query: 'a' } });
    await client.callTool({ name: 'get_validated_sign', arguments: { id: 'ola' } });
    await client.callTool({ name: 'list_validated_categories', arguments: {} });
    await client.callTool({ name: 'get_corpus_stats', arguments: {} });
    await client.callTool({ name: 'check_grounding_eligibility', arguments: { entryIds: ['ola'] } });
    const after = JSON.stringify(ALL_ENTRIES);
    assert.equal(before, after);
  });
});

describe('tools — fixture validated (caminho feliz)', () => {
  it('search_validated_signs encontra uma entrada de fato validated', async () => {
    const entry = buildValidatedEntry({ id: 'sinal-feliz', portugueseWord: 'Feliz', gloss: 'FELIZ' });
    const { client, close } = await connectTestClient([entry]);
    try {
      const result = await client.callTool({ name: 'search_validated_signs', arguments: { query: 'Feliz' } });
      const data = result.structuredContent as { data: { matches: Array<{ id: string }> }; evidenceIds: string[]; refusal: { required: boolean } };
      assert.deepEqual(data.data.matches.map((match) => match.id), ['sinal-feliz']);
      assert.deepEqual(data.evidenceIds, ['sinal-feliz']);
      assert.equal(data.refusal.required, false);
    } finally {
      await close();
    }
  });

  it('check_grounding_eligibility retorna VALIDATED para a fixture', async () => {
    const entry = buildValidatedEntry({ id: 'sinal-elegivel' });
    const { client, close } = await connectTestClient([entry]);
    try {
      const result = await client.callTool({
        name: 'check_grounding_eligibility',
        arguments: { entryIds: ['sinal-elegivel'] },
      });
      const data = result.structuredContent as { data: { results: Array<{ eligible: boolean; reasonCode: string }> } };
      assert.equal(data.data.results[0]?.eligible, true);
      assert.equal(data.data.results[0]?.reasonCode, 'VALIDATED');
    } finally {
      await close();
    }
  });
});
