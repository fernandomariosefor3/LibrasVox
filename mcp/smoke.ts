import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

/**
 * mcp/smoke.ts é um CLIENTE de diagnóstico manual, não o servidor — por
 * isso, e só ele dentro de mcp/, pode usar console.log livremente.
 * Spawna mcp/index.ts de verdade por stdio, faz initialize + list* e
 * chama get_corpus_stats, imprimindo um resumo legível.
 */

const indexPath = fileURLToPath(new URL('./index.ts', import.meta.url));

async function main(): Promise<void> {
  const transport = new StdioClientTransport({ command: process.execPath, args: [indexPath] });
  const client = new Client({ name: 'librasvox-knowledge-mcp-smoke', version: '0.1.0' });

  await client.connect(transport);
  console.log('[smoke] initialize + conexão stdio: OK');

  const tools = await client.listTools();
  console.log(`[smoke] listTools (${tools.tools.length}): ${tools.tools.map((tool) => tool.name).join(', ')}`);

  const resources = await client.listResources();
  console.log(
    `[smoke] listResources (${resources.resources.length}): ${resources.resources
      .map((resource) => resource.name)
      .join(', ')}`,
  );

  const resourceTemplates = await client.listResourceTemplates();
  console.log(
    `[smoke] listResourceTemplates (${resourceTemplates.resourceTemplates.length}): ${resourceTemplates.resourceTemplates
      .map((template) => template.name)
      .join(', ')}`,
  );

  const prompts = await client.listPrompts();
  console.log(`[smoke] listPrompts (${prompts.prompts.length}): ${prompts.prompts.map((prompt) => prompt.name).join(', ')}`);

  const stats = await client.callTool({ name: 'get_corpus_stats', arguments: {} });
  console.log('[smoke] get_corpus_stats ->', JSON.stringify(stats.structuredContent));

  const search = await client.callTool({
    name: 'search_validated_signs',
    arguments: { query: 'olá' },
  });
  console.log('[smoke] search_validated_signs("olá") ->', JSON.stringify(search.structuredContent));

  await client.close();
  console.log('[smoke] concluído com sucesso — servidor encerrado.');
}

main().catch((error: unknown) => {
  console.error('[smoke] falhou:', error);
  process.exitCode = 1;
});
