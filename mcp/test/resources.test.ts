import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_ENTRIES } from '../../knowledge/corpus/index.ts';
import { connectTestClient, buildValidatedEntry } from './fixtures.ts';

function textOf(content: { text: string } | { blob: string } | undefined): string {
  if (content && 'text' in content) return content.text;
  return '';
}

describe('resources — corpus real (3 entradas draft)', () => {
  const clientPromise = connectTestClient(ALL_ENTRIES);
  after(async () => {
    const { close } = await clientPromise;
    await close();
  });

  it('listResources retorna somente os 3 resources estáticos aprovados', async () => {
    const { client } = await clientPromise;
    const { resources } = await client.listResources();
    assert.deepEqual(
      resources.map((resource) => resource.name).sort(),
      ['corpus-policy', 'corpus-schema', 'corpus-stats'],
    );
  });

  it('listResourceTemplates retorna o template dinâmico de sinal', async () => {
    const { client } = await clientPromise;
    const { resourceTemplates } = await client.listResourceTemplates();
    assert.deepEqual(resourceTemplates.map((template) => template.name), ['sign-by-id']);
  });

  it('libras://corpus/schema não expõe caminho local do computador', async () => {
    const { client } = await clientPromise;
    const result = await client.readResource({ uri: 'libras://corpus/schema' });
    const text = textOf(result.contents[0]);
    assert.equal(text.includes('C:\\'), false);
    assert.equal(text.toLowerCase().includes('users'), false);
    assert.equal(text.includes('draft'), true); // estados possíveis, ok expor o nome do estado
  });

  it('libras://corpus/policy descreve as regras de fundamentação', async () => {
    const { client } = await clientPromise;
    const result = await client.readResource({ uri: 'libras://corpus/policy' });
    const text = textOf(result.contents[0]);
    assert.equal(text.includes('validated'), true);
  });

  it('libras://corpus/stats é calculado dinamicamente', async () => {
    const { client } = await clientPromise;
    const result = await client.readResource({ uri: 'libras://corpus/stats' });
    const stats = JSON.parse(textOf(result.contents[0]) || '{}');
    assert.equal(stats.total, 3);
    assert.equal(stats.draft, 3);
    assert.equal(stats.validated, 0);
  });

  it('libras://signs/ola produz erro seguro -32002, sem revelar draft/parâmetros linguísticos', async () => {
    const { client } = await clientPromise;
    await assert.rejects(
      () => client.readResource({ uri: 'libras://signs/ola' }),
      (error: unknown) => {
        assert.ok(error && typeof error === 'object');
        const mcpError = error as { code?: number; message?: string };
        assert.equal(mcpError.code, -32002);
        assert.ok(mcpError.message?.includes('Resource not found'));
        const serialized = JSON.stringify(error);
        assert.equal(serialized.includes('draft'), false);
        assert.equal(serialized.includes('handConfiguration'), false);
        return true;
      },
    );
  });

  it('libras://signs/{id} para ID inexistente produz o mesmo erro seguro (indistinguível de não-elegível)', async () => {
    const { client } = await clientPromise;
    await assert.rejects(
      () => client.readResource({ uri: 'libras://signs/sinal-que-nao-existe' }),
      (error: unknown) => {
        const mcpError = error as { code?: number };
        assert.equal(mcpError.code, -32002);
        return true;
      },
    );
  });

  it('nenhum resource muta o corpus', async () => {
    const before = JSON.stringify(ALL_ENTRIES);
    const { client } = await clientPromise;
    await client.readResource({ uri: 'libras://corpus/schema' });
    await client.readResource({ uri: 'libras://corpus/policy' });
    await client.readResource({ uri: 'libras://corpus/stats' });
    const after = JSON.stringify(ALL_ENTRIES);
    assert.equal(before, after);
  });
});

describe('resources — fixture validated', () => {
  it('libras://signs/{id} retorna a entrada quando validated e elegível', async () => {
    const entry = buildValidatedEntry({ id: 'sinal-feliz' });
    const { client, close } = await connectTestClient([entry]);
    try {
      const result = await client.readResource({ uri: 'libras://signs/sinal-feliz' });
      const parsed = JSON.parse(textOf(result.contents[0]) || '{}');
      assert.equal(parsed.id, 'sinal-feliz');
    } finally {
      await close();
    }
  });
});
