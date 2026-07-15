export type VisionSignStatus = 'active' | 'collecting' | 'planned';

export interface VisionSign {
  id: string;
  word: string;
  emoji: string;
  category: 'Básico' | 'Pessoas' | 'Educação' | 'Cotidiano' | 'Saúde';
  status: VisionSignStatus;
  hint?: string;
  gradient?: string;
}

export const VISION_SIGNS: VisionSign[] = [
  { id: 'ola', word: 'Olá', emoji: '👋', category: 'Básico', status: 'active', hint: 'Mão aberta · altura do rosto · movimento lateral', gradient: 'from-emerald-400 to-teal-600' },
  { id: 'obrigado', word: 'Obrigado', emoji: '🙏', category: 'Básico', status: 'active', hint: 'Mão aberta · próxima ao rosto · movimento à frente', gradient: 'from-violet-400 to-indigo-600' },
  { id: 'tchau', word: 'Tchau', emoji: '🤚', category: 'Básico', status: 'active', hint: 'Mão aberta · altura do ombro · movimento lateral', gradient: 'from-amber-400 to-orange-600' },
  { id: 'por-favor', word: 'Por favor', emoji: '🤲', category: 'Básico', status: 'collecting' },
  { id: 'sim', word: 'Sim', emoji: '✅', category: 'Básico', status: 'collecting' },
  { id: 'nao', word: 'Não', emoji: '❌', category: 'Básico', status: 'collecting' },
  { id: 'desculpa', word: 'Desculpa', emoji: '💛', category: 'Básico', status: 'collecting' },
  { id: 'pessoa', word: 'Pessoa', emoji: '🧍', category: 'Pessoas', status: 'collecting' },
  { id: 'eu', word: 'Eu', emoji: '🙋', category: 'Pessoas', status: 'collecting' },
  { id: 'voce', word: 'Você', emoji: '👉', category: 'Pessoas', status: 'collecting' },
  { id: 'nome', word: 'Nome', emoji: '🏷️', category: 'Pessoas', status: 'collecting' },
  { id: 'familia', word: 'Família', emoji: '👨‍👩‍👧', category: 'Pessoas', status: 'collecting' },
  { id: 'mae', word: 'Mãe', emoji: '👩', category: 'Pessoas', status: 'collecting' },
  { id: 'pai', word: 'Pai', emoji: '👨', category: 'Pessoas', status: 'collecting' },
  { id: 'irmao', word: 'Irmão/irmã', emoji: '🧑‍🤝‍🧑', category: 'Pessoas', status: 'collecting' },
  { id: 'amigo', word: 'Amigo', emoji: '🤝', category: 'Pessoas', status: 'collecting' },
  { id: 'escola', word: 'Escola', emoji: '🏫', category: 'Educação', status: 'planned' },
  { id: 'professor', word: 'Professor', emoji: '🧑‍🏫', category: 'Educação', status: 'planned' },
  { id: 'aluno', word: 'Aluno', emoji: '🧑‍🎓', category: 'Educação', status: 'planned' },
  { id: 'aprender', word: 'Aprender', emoji: '📚', category: 'Educação', status: 'planned' },
  { id: 'casa', word: 'Casa', emoji: '🏠', category: 'Cotidiano', status: 'planned' },
  { id: 'trabalho', word: 'Trabalho', emoji: '💼', category: 'Cotidiano', status: 'planned' },
  { id: 'comer', word: 'Comer', emoji: '🍽️', category: 'Cotidiano', status: 'planned' },
  { id: 'beber', word: 'Beber', emoji: '🥤', category: 'Cotidiano', status: 'planned' },
  { id: 'agua', word: 'Água', emoji: '💧', category: 'Cotidiano', status: 'planned' },
  { id: 'banheiro', word: 'Banheiro', emoji: '🚻', category: 'Cotidiano', status: 'planned' },
  { id: 'ajuda', word: 'Ajuda', emoji: '🆘', category: 'Saúde', status: 'planned' },
  { id: 'hospital', word: 'Hospital', emoji: '🏥', category: 'Saúde', status: 'planned' },
  { id: 'emergencia', word: 'Emergência', emoji: '🚨', category: 'Saúde', status: 'planned' },
  { id: 'amor', word: 'Amor', emoji: '❤️', category: 'Básico', status: 'planned' },
];

export const ACTIVE_VISION_SIGNS = VISION_SIGNS.filter((sign) => sign.status === 'active');

export const COLLECTION_DIMENSIONS = [
  'Vídeo frontal e lateral',
  'Velocidade lenta, normal e rápida',
  'Pessoas e corpos diferentes',
  'Iluminações variadas',
  'Variações regionais identificadas',
  'Mão dominante direita e esquerda',
  'Execuções corretas',
  'Erros comuns de iniciantes',
];
