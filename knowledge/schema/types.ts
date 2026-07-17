/**
 * Schema do LibrasVox Intelligence Stack — Fase 1 (Fundação).
 *
 * Nenhum tipo ou função neste arquivo persiste dados, chama IA, ou expõe
 * uma forma de promover uma entrada para `validated`. Ver validators.ts
 * e transitions.ts para as regras que consomem este schema.
 */

export type KnowledgeStatus = 'draft' | 'under_review' | 'validated' | 'blocked';

export type ActorType = 'human' | 'agent' | 'system';

export interface StatusTransition {
  from: KnowledgeStatus | null; // null = criação inicial da entrada
  to: KnowledgeStatus;
  actor: string;
  actorType: ActorType;
  reason: string;
  at: string;
}

export type SourceType = 'academic' | 'institutional' | 'community' | 'other';

/** Fonte externa citável. Referenciada por id em RegionalVariant.sourceIds. */
export interface CorpusSource {
  id: string;
  type: SourceType;
  citation: string;
  url: string | null;
  year: number | null;
}

export type LicenseType =
  | 'cc_by'
  | 'cc_by_sa'
  | 'cc_by_nc'
  | 'cc0'
  | 'institutional_permission'
  | 'all_rights_reserved'
  | 'unknown';

export interface MediaLicense {
  type: LicenseType;
  owner: string | null;
  grantedBy: string | null;
  notes: string | null;
}

export type MediaKind = 'video' | 'photo' | 'illustration';
export type MediaOrigin = 'real_institution' | 'own_recording' | 'stock' | 'ai_generated_forbidden';

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  url: string;
  origin: MediaOrigin;
  /**
   * Nunca é preenchido por detectDuplicateMedia() (função pura, sem efeitos
   * colaterais — ver mediaDuplication.ts). Permanece null/[] até que um
   * processo humano futuro decida registrar o resultado de uma auditoria.
   */
  dedupKey: string | null;
  sharedWithSignIds: string[];
  license: MediaLicense | null;
  status: KnowledgeStatus;
}

export interface RegionalVariant {
  id: string;
  stateCode: string;
  regionName: string;
  status: KnowledgeStatus;
  culturalNote: string | null;
  /** Referencia CorpusSource.id — não duplica o objeto da fonte. */
  sourceIds: string[];
  reviewedAt: string | null;
}

export interface LinguisticParameters {
  handConfiguration: string | null;
  location: string | null;
  movement: string | null;
  orientation: string | null;
  nonManualExpression: string | null;
}

export type ValidatorRole = 'consultor_surdo' | 'linguista' | 'professor_surdo' | 'outro';

/** Só é exigido preenchido quando status === 'validated' (ver validators.ts). */
export interface HumanValidationRecord {
  validatorId: string;
  validatorName: string;
  validatorRole: ValidatorRole;
  validationDate: string;
}

/**
 * Procedência técnica de conteúdo migrado de código legado local.
 * Registra DE ONDE o texto foi copiado tecnicamente — nunca substitui
 * fonte linguística ou validação humana.
 */
export interface LegacyProvenance {
  originType: 'legacy_code';
  originPath: string;
  originCommit: string | null;
  note: string;
  disclaimer: string;
}

export interface KnowledgeCorpusEntry {
  id: string;
  portugueseWord: string;
  gloss: string;
  category: string;
  difficulty: 'iniciante' | 'intermediário' | 'avançado';

  linguisticParameters: LinguisticParameters;
  context: string | null;

  regionalVariants: RegionalVariant[];
  media: MediaAsset[];
  sources: CorpusSource[];

  status: KnowledgeStatus;
  validation: HumanValidationRecord | null;
  needsHumanReview: boolean;
  validationNotes: string | null;

  legacyProvenance: LegacyProvenance | null;

  statusHistory: StatusTransition[];
  version: number;
  createdAt: string;
  updatedAt: string;
}
