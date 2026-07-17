import type { KnowledgeCorpusEntry } from '../../schema/types.ts';

/**
 * Entrada de fundação — NÃO validada linguisticamente.
 * Ver legacyProvenance e validationNotes abaixo antes de usar este
 * conteúdo para qualquer finalidade além de demonstrar a estrutura do schema.
 */
export const tchau: KnowledgeCorpusEntry = {
  id: 'tchau',
  portugueseWord: 'Tchau',
  gloss: 'TCHAU',
  category: 'Básico',
  difficulty: 'iniciante',

  linguisticParameters: {
    handConfiguration: 'Mão aberta com dedos estendidos',
    location: 'Altura do ombro ou do rosto',
    movement: 'Movimento lateral repetido',
    orientation: 'Palma voltada para a pessoa interlocutora',
    nonManualExpression: 'Expressão amistosa',
  },
  context: 'Despedida',

  regionalVariants: [],
  media: [],
  sources: [],

  status: 'draft',
  validation: null,
  needsHumanReview: true,
  validationNotes:
    'Parâmetros linguísticos copiados de código local não versionado (ver legacyProvenance), ' +
    'nunca revisados por consultor surdo ou linguista. Sem fontes acadêmicas, mídia de ' +
    'referência ou variação regional confirmadas. Requer revisão humana completa antes de ' +
    'avançar para under_review.',

  legacyProvenance: {
    originType: 'legacy_code',
    originPath: 'src/data/librasCorpus.ts',
    originCommit: null,
    note:
      'Os parâmetros linguísticos acima foram copiados de uma alteração local não ' +
      'versionada (não commitada, ausente em origin/main) do arquivo indicado. ' +
      'originCommit é null porque esse arquivo de origem nunca foi commitado no repositório.',
    disclaimer:
      'Isto não constitui fonte linguística nem validação. É somente o registro de onde ' +
      'o texto foi tecnicamente copiado, para fins de rastreabilidade.',
  },

  statusHistory: [
    {
      from: null,
      to: 'draft',
      actor: 'libras-corpus-curator',
      actorType: 'agent',
      reason:
        'Entrada inicial de fundação da Fase 1, reconstruída a partir de parâmetros já ' +
        'registrados em src/data/librasCorpus.ts (arquivo local não commitado). Nenhum dado ' +
        'foi inventado; ausências permanecem null.',
      at: '2026-07-17T00:00:00.000Z',
    },
  ],
  version: 1,
  createdAt: '2026-07-17T00:00:00.000Z',
  updatedAt: '2026-07-17T00:00:00.000Z',
};
