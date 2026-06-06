export interface Sign {
  id: string;
  word: string;
  category: string;
  emoji: string;
  description: string;
  steps: string[];
  difficulty: 'iniciante' | 'intermediário' | 'avançado';
  videoThumbnail?: string;
  videoUrl?: string;
}