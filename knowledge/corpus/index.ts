import type { KnowledgeCorpusEntry } from '../schema/types.ts';
import { ola } from './entries/ola.ts';
import { obrigado } from './entries/obrigado.ts';
import { tchau } from './entries/tchau.ts';

/** As 3 entradas de fundação da Fase 1. Todas status: 'draft'. */
export const ALL_ENTRIES: readonly KnowledgeCorpusEntry[] = [ola, obrigado, tchau];
