/**
 * Detector de mídia duplicada entre sinais diferentes.
 *
 * Função pura: recebe entradas, calcula achados, retorna achados novos.
 * Não modifica nenhuma entrada recebida, não altera `status`, não escreve
 * em `sharedWithSignIds` dos objetos recebidos, não grava arquivos, não
 * bloqueia nem promove nada por efeito colateral. Aplicar a recomendação
 * (bloquear/revisar) é responsabilidade de um processo separado, fora
 * desta função.
 */

import type { KnowledgeCorpusEntry } from './types.ts';

/** Normaliza uma URL para agrupar variações triviais do mesmo conteúdo real. */
export function computeDedupKey(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, '');
    const params = parsed.searchParams;
    const v = params.get('v') ?? '';
    const list = params.get('list') ?? '';
    const index = params.get('index') ?? '';
    return [host, path, v, list, index].join('|');
  } catch {
    return url.trim().toLowerCase();
  }
}

export interface DuplicateMediaFinding {
  severity: 'critical';
  dedupKey: string;
  url: string;
  involvedEntryIds: string[];
  involvedMedia: ReadonlyArray<{ entryId: string; mediaId: string }>;
  recommendation: 'block_and_review';
}

/**
 * Detecta mídia (vídeo/foto/ilustração) reaproveitada entre sinais
 * diferentes. Retorna uma lista de achados críticos; não decide nem
 * aplica nada — apenas recomenda bloqueio e revisão humana.
 */
export function detectDuplicateMedia(
  entries: readonly KnowledgeCorpusEntry[],
): readonly DuplicateMediaFinding[] {
  const byDedupKey = new Map<
    string,
    { url: string; involvedMedia: Array<{ entryId: string; mediaId: string }> }
  >();

  for (const entry of entries) {
    for (const media of entry.media) {
      const key = media.dedupKey ?? computeDedupKey(media.url);
      const existing = byDedupKey.get(key);
      const bucket = existing ?? { url: media.url, involvedMedia: [] };
      bucket.involvedMedia.push({ entryId: entry.id, mediaId: media.id });
      if (!existing) byDedupKey.set(key, bucket);
    }
  }

  const findings: DuplicateMediaFinding[] = [];
  for (const [dedupKey, bucket] of byDedupKey) {
    const involvedEntryIds = Array.from(new Set(bucket.involvedMedia.map((m) => m.entryId)));
    if (involvedEntryIds.length > 1) {
      findings.push({
        severity: 'critical',
        dedupKey,
        url: bucket.url,
        involvedEntryIds,
        involvedMedia: bucket.involvedMedia,
        recommendation: 'block_and_review',
      });
    }
  }
  return findings;
}
