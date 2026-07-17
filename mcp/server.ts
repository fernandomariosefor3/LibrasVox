import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { KnowledgeCorpusEntry } from '../knowledge/schema/types.ts';
import type { ValidatedCorpusRepository } from './repository/ValidatedCorpusRepository.ts';
import { registerResources } from './resources/registerResources.ts';
import { registerTools } from './tools/registerTools.ts';
import { registerPrompts } from './prompts/registerPrompts.ts';

export const SERVER_NAME = 'librasvox-knowledge-mcp';
export const SERVER_VERSION = '0.1.0';

/**
 * Fábrica pura: constrói um McpServer completamente configurado, sem
 * nenhum efeito de processo (sem stdio, sem process.on, sem stdout).
 * Testável isoladamente — basta chamar createServer(...) e usar o
 * server retornado com qualquer transporte, inclusive um par de
 * transportes em memória para testes.
 */
export function createServer(
  repository: ValidatedCorpusRepository,
  getAllEntries: () => readonly KnowledgeCorpusEntry[],
): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  registerResources(server, repository);
  registerTools(server, repository, getAllEntries);
  registerPrompts(server, repository);

  return server;
}
