import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const INDEX_PATH = fileURLToPath(new URL('../index.ts', import.meta.url));

function processIsAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitUntil(predicate: () => boolean, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return true;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return predicate();
}

describe('integração stdio real (servidor spawnado como processo filho)', () => {
  it('inicia por stdio, executa initialize e responde às listagens', async () => {
    const transport = new StdioClientTransport({ command: process.execPath, args: [INDEX_PATH] });
    const client = new Client({ name: 'librasvox-knowledge-mcp-integration-test', version: '0.1.0' });

    await client.connect(transport); // connect() já executa o handshake initialize
    assert.ok(transport.pid, 'processo filho deveria ter um pid');
    assert.ok(processIsAlive(transport.pid as number));

    const { tools } = await client.listTools();
    assert.equal(tools.length, 5);

    const { resources } = await client.listResources();
    assert.equal(resources.length, 3);

    const { prompts } = await client.listPrompts();
    assert.equal(prompts.length, 3);

    const stats = await client.callTool({ name: 'get_corpus_stats', arguments: {} });
    const data = stats.structuredContent as { data: { total: number; draft: number; validated: number } };
    assert.equal(data.data.total, 3);
    assert.equal(data.data.draft, 3);
    assert.equal(data.data.validated, 0);

    await client.close();
    assert.ok(await waitUntil(() => !processIsAlive(transport.pid as number), 5000));
  });

  it('SIGINT encerra o processo sem deixar órfão', async () => {
    const transport = new StdioClientTransport({ command: process.execPath, args: [INDEX_PATH] });
    const client = new Client({ name: 'librasvox-knowledge-mcp-sigint-test', version: '0.1.0' });
    await client.connect(transport);
    const pid = transport.pid as number;
    assert.ok(processIsAlive(pid));

    // Nota: no Windows, process.kill(pid, 'SIGINT'/'SIGTERM') emulado pelo
    // Node encerra o processo incondicionalmente (não há sinal POSIX real
    // entregue) — o que este teste garante é a ausência de processo órfão,
    // não a execução do handler de shutdown gracioso em si.
    process.kill(pid, 'SIGINT');

    const exited = await waitUntil(() => !processIsAlive(pid), 5000);
    assert.ok(exited, 'processo continuou vivo após SIGINT além do timeout');
  });

  it('SIGTERM encerra o processo sem deixar órfão', async () => {
    const transport = new StdioClientTransport({ command: process.execPath, args: [INDEX_PATH] });
    const client = new Client({ name: 'librasvox-knowledge-mcp-sigterm-test', version: '0.1.0' });
    await client.connect(transport);
    const pid = transport.pid as number;
    assert.ok(processIsAlive(pid));

    process.kill(pid, 'SIGTERM');

    const exited = await waitUntil(() => !processIsAlive(pid), 5000);
    assert.ok(exited, 'processo continuou vivo após SIGTERM além do timeout');
  });
});
