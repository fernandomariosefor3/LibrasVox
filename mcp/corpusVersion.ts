import { createHash } from 'node:crypto';
import type { KnowledgeCorpusEntry } from '../knowledge/schema/types.ts';

/**
 * corpusVersion — hash determinístico do conteúdo do corpus.
 *
 * Não usa relógio, caminho local, Git nem variável de ambiente: depende
 * só do conteúdo das entradas recebidas. Duas chamadas com o mesmo
 * conjunto de entradas (em qualquer ordem de entrada) produzem sempre o
 * mesmo resultado.
 */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function hasStringId(value: unknown): value is { id: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as { id: unknown }).id === 'string'
  );
}

/**
 * Serializa qualquer valor de forma canônica: chaves de objeto em ordem
 * alfabética, arrays de entidades (itens com `id: string`) ordenados
 * por id, `null` preservado explicitamente, sem qualquer campo omitido.
 */
function canonicalize(value: unknown): Json {
  if (value === null) return null;
  if (Array.isArray(value)) {
    const items = value.map((item) => canonicalize(item));
    if (value.every(hasStringId)) {
      const withIds = value as ReadonlyArray<{ id: string }>;
      const order = withIds
        .map((item, index) => ({ id: item.id, index }))
        .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
        .map((entry) => entry.index);
      return order.map((index) => items[index] as Json);
    }
    return items as Json[];
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const sortedKeys = Object.keys(record).sort();
    const result: { [key: string]: Json } = {};
    for (const key of sortedKeys) {
      result[key] = canonicalize(record[key]);
    }
    return result;
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  return null;
}

function canonicalCorpusJson(entries: readonly KnowledgeCorpusEntry[]): string {
  const sortedEntries = [...entries].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return JSON.stringify(canonicalize(sortedEntries));
}

/**
 * Calcula o corpusVersion no formato `corpus-v1-<16 hex chars do SHA-256>`.
 */
export function computeCorpusVersion(entries: readonly KnowledgeCorpusEntry[]): string {
  const canonicalJson = canonicalCorpusJson(entries);
  const digest = createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
  return `corpus-v1-${digest.slice(0, 16)}`;
}
