import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type { KnowledgeCorpusEntry, MediaAsset } from '../../knowledge/schema/types.ts';
import { createServer } from '../server.ts';
import { InMemoryValidatedCorpusRepository } from '../repository/InMemoryValidatedCorpusRepository.ts';

/**
 * Fixtures compartilhadas entre os arquivos de teste do mcp/. O corpus
 * real de hoje só tem entradas draft — para testar o caminho "validated"
 * precisamos construir entradas sintéticas aqui, isoladas dos testes.
 */

const BASE_TIMESTAMP = '2026-07-17T00:00:00.000Z';

export function buildDraftEntry(overrides: Partial<KnowledgeCorpusEntry> = {}): KnowledgeCorpusEntry {
  return {
    id: 'fixture-draft',
    portugueseWord: 'Fixture',
    gloss: 'FIXTURE',
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
    createdAt: BASE_TIMESTAMP,
    updatedAt: BASE_TIMESTAMP,
    ...overrides,
  };
}

export function buildValidatedEntry(overrides: Partial<KnowledgeCorpusEntry> = {}): KnowledgeCorpusEntry {
  return buildDraftEntry({
    id: 'fixture-validated',
    portugueseWord: 'Fixture Validada',
    gloss: 'FIXTURE-VALIDADA',
    linguisticParameters: {
      handConfiguration: 'Mão aberta',
      location: 'Altura do rosto',
      movement: 'Movimento curto',
      orientation: 'Palma para frente',
      nonManualExpression: 'Expressão neutra',
    },
    context: 'Contexto de teste',
    sources: [{ id: 'fixture-source', type: 'academic', citation: 'Fonte de teste, 2026', url: null, year: 2026 }],
    status: 'validated',
    validation: {
      validatorId: 'fixture-validator',
      validatorName: 'Fixture Validador',
      validatorRole: 'linguista',
      validationDate: BASE_TIMESTAMP,
    },
    needsHumanReview: false,
    statusHistory: [
      { from: 'under_review', to: 'validated', actor: 'fixture-human', actorType: 'human', reason: 'fixture', at: BASE_TIMESTAMP },
    ],
    ...overrides,
  });
}

export function buildMedia(overrides: Partial<MediaAsset> = {}): MediaAsset {
  return {
    id: 'fixture-media',
    kind: 'video',
    url: 'https://example.com/fixture.mp4',
    origin: 'own_recording',
    dedupKey: null,
    sharedWithSignIds: [],
    license: { type: 'cc_by', owner: 'Fixture', grantedBy: null, notes: null },
    status: 'validated',
    ...overrides,
  };
}

/**
 * Conecta um Client MCP real a um servidor real via par de transportes
 * em memória (sem stdio, sem spawn de processo) — exercita o caminho
 * completo do protocolo (validação de input/output, annotations) de
 * forma rápida. O teste de stdio de verdade fica isolado em
 * stdio.integration.test.ts.
 */
export async function connectTestClient(
  entries: readonly KnowledgeCorpusEntry[],
): Promise<{ client: Client; close: () => Promise<void> }> {
  const repository = new InMemoryValidatedCorpusRepository(entries);
  const server = createServer(repository, () => entries);
  const client = new Client({ name: 'librasvox-knowledge-mcp-test-client', version: '0.1.0' });

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  return {
    client,
    close: async () => {
      await client.close();
      await server.close();
    },
  };
}
