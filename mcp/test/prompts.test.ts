import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_ENTRIES } from '../../knowledge/corpus/index.ts';
import { connectTestClient, buildValidatedEntry } from './fixtures.ts';
import { SIGN_SPECIFIC_REFUSAL_MESSAGE } from '../errors/safeErrors.ts';

describe('prompts — corpus real (3 entradas draft)', () => {
  const clientPromise = connectTestClient(ALL_ENTRIES);
  after(async () => {
    const { close } = await clientPromise;
    await close();
  });

  it('listPrompts retorna somente os 3 prompts aprovados', async () => {
    const { client } = await clientPromise;
    const { prompts } = await client.listPrompts();
    assert.deepEqual(
      prompts.map((prompt) => prompt.name).sort(),
      ['create_grounded_practice', 'explain_validated_sign', 'safe_tutor_refusal'],
    );
  });

  it('safe_tutor_refusal retorna o texto canônico exato', async () => {
    const { client } = await clientPromise;
    const result = await client.getPrompt({ name: 'safe_tutor_refusal', arguments: {} });
    const message = result.messages[0];
    assert.ok(message);
    assert.equal(message.content.type, 'text');
    assert.equal((message.content as { text: string }).text, SIGN_SPECIFIC_REFUSAL_MESSAGE);
  });

  it('explain_validated_sign para "olá" instrui recusa (sem conteúdo validado hoje)', async () => {
    const { client } = await clientPromise;
    const result = await client.getPrompt({ name: 'explain_validated_sign', arguments: { term: 'olá' } });
    const text = (result.messages[0]?.content as { text?: string } | undefined)?.text ?? '';
    assert.equal(text.includes(SIGN_SPECIFIC_REFUSAL_MESSAGE), true);
  });

  it('create_grounded_practice não fabrica estrutura de exercício sem conteúdo validado', async () => {
    const { client } = await clientPromise;
    const result = await client.getPrompt({ name: 'create_grounded_practice', arguments: {} });
    const text = (result.messages[0]?.content as { text?: string } | undefined)?.text ?? '';
    assert.equal(text, SIGN_SPECIFIC_REFUSAL_MESSAGE);
    assert.equal(text.includes('handConfiguration'), false);
  });

  it('nenhum prompt muta o corpus', async () => {
    const before = JSON.stringify(ALL_ENTRIES);
    const { client } = await clientPromise;
    await client.getPrompt({ name: 'safe_tutor_refusal', arguments: {} });
    await client.getPrompt({ name: 'explain_validated_sign', arguments: { term: 'olá' } });
    await client.getPrompt({ name: 'create_grounded_practice', arguments: {} });
    const after = JSON.stringify(ALL_ENTRIES);
    assert.equal(before, after);
  });
});

describe('prompts — fixture validated', () => {
  it('create_grounded_practice monta estrutura real quando há conteúdo validated', async () => {
    const entry = buildValidatedEntry({ id: 'sinal-feliz', category: 'Básico' });
    const { client, close } = await connectTestClient([entry]);
    try {
      const result = await client.getPrompt({ name: 'create_grounded_practice', arguments: { category: 'Básico' } });
      const text = (result.messages[0]?.content as { text?: string } | undefined)?.text ?? '';
      assert.equal(text.includes('sinal-feliz'), true);
      assert.equal(text.includes(SIGN_SPECIFIC_REFUSAL_MESSAGE), false);
    } finally {
      await close();
    }
  });
});
