import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ALL_ENTRIES } from '../knowledge/corpus/index.ts';
import { InMemoryValidatedCorpusRepository } from './repository/InMemoryValidatedCorpusRepository.ts';
import { createServer } from './server.ts';

/**
 * Entrypoint real do processo. stdout é reservado exclusivamente ao
 * protocolo MCP (gerenciado pelo StdioServerTransport) — todo log de
 * diagnóstico aqui usa console.error, nunca console.log.
 */

const repository = new InMemoryValidatedCorpusRepository(ALL_ENTRIES);
const server = createServer(repository, () => ALL_ENTRIES);
const transport = new StdioServerTransport();

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.error(`[librasvox-knowledge-mcp] recebido ${signal}, encerrando...`);
  try {
    await server.close();
  } catch {
    // encerramento best-effort — nunca ecoa detalhes internos em stdout
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

try {
  await server.connect(transport);
  console.error('[librasvox-knowledge-mcp] pronto (stdio, somente leitura)');
} catch {
  console.error('[librasvox-knowledge-mcp] falha ao conectar o transporte stdio');
  process.exit(1);
}
