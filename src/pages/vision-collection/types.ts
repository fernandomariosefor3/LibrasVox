export type RealMediaSignId = 'ola' | 'obrigado' | 'tchau';

export interface RealMediaSignOption {
  id: RealMediaSignId;
  label: string;
}

export const REAL_MEDIA_SIGNS: RealMediaSignOption[] = [
  { id: 'ola', label: 'Oi/Olá' },
  { id: 'obrigado', label: 'Obrigado' },
  { id: 'tchau', label: 'Tchau' },
];

export const REAL_MEDIA_DEFAULT_REGION = 'Fortaleza, Ceará';

export type RealMediaFrameRole = 'inicio' | 'movimento' | 'final';

export interface RealMediaFramePosition {
  role: RealMediaFrameRole;
  cardLabel: string;
  percentage: number;
}

/** 20% / 50% / 80% da duração do vídeo — início, movimento e final do sinal. */
export const REAL_MEDIA_FRAME_POSITIONS: RealMediaFramePosition[] = [
  { role: 'inicio', cardLabel: 'Início', percentage: 0.2 },
  { role: 'movimento', cardLabel: 'Movimento', percentage: 0.5 },
  { role: 'final', cardLabel: 'Final', percentage: 0.8 },
];

export interface RealMediaManifestFrame {
  role: RealMediaFrameRole;
  filename: string;
  timestampSeconds: number;
}

export interface RealMediaManifest {
  schemaVersion: 'real-media-mvp-1';
  signalId: string;
  signalLabel: string;
  region: string;
  signerReference: string;
  notes: string;
  recordedAt: string;
  validationStatus: 'draft_media';
  humanValidated: false;
  consentConfirmed: boolean;
  video: {
    filename: string;
    mimeType: string;
    durationSeconds: number;
  };
  frames: RealMediaManifestFrame[];
  privacy: {
    processedLocally: true;
    uploadedToServer: false;
  };
}
