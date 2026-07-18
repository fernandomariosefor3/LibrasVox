export type ModeId = 'tutor' | 'translator' | 'practice' | 'culture';

export interface AssistantMode {
  id: ModeId;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  description: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  suggestions: string[];
}

export const assistantModes: AssistantMode[] = [
  {
    id: 'tutor',
    label: 'Tutor',
    icon: 'ri-graduation-cap-line',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-500',
    description: 'Aprenda Libras com explicações didáticas',
    welcomeTitle: 'Tutor de Libras',
    welcomeSubtitle: 'Aprenda a língua dos sinais com explicações claras, passo a passo e dicas práticas.',
    suggestions: [
      'Como faço o sinal de "obrigado" em Libras?',
      'Explique a gramática básica da Libras',
      'Qual a diferença entre Libras e ASL?',
      'Como sinalizar os números de 1 a 10?',
      'Quais são os sinais mais importantes para iniciantes?',
      'Como funciona a expressão facial na Libras?',
    ],
  },
  {
    id: 'translator',
    label: 'Tradutor',
    icon: 'ri-translate-2',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-500',
    description: 'Traduza português para descrições em Libras',
    welcomeTitle: 'Tradutor Português → Libras',
    welcomeSubtitle: 'Digite qualquer frase ou texto e veja a tradução completa com descrição dos sinais.',
    suggestions: [
      'Traduza: "Bom dia, como você está?"',
      'Como se diz "Eu te amo" em Libras?',
      'Traduza: "Preciso de ajuda, por favor"',
      'Como sinalizar "Meu nome é João"?',
      'Traduza: "Onde fica o banheiro?"',
      'Como expressar "Muito prazer em te conhecer"?',
    ],
  },
  {
    id: 'practice',
    label: 'Prática',
    icon: 'ri-gamepad-line',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    badgeColor: 'bg-violet-500',
    description: 'Exercícios interativos e desafios de Libras',
    welcomeTitle: 'Modo Prática',
    welcomeSubtitle: 'Exercícios, quizzes e desafios para fixar o que você aprendeu de Libras.',
    suggestions: [
      'Quero fazer um quiz de sinais básicos!',
      'Me dê um desafio de sinalização do cotidiano',
      'Pratique uma conversa simples comigo em Libras',
      'Crie 5 exercícios de completar frases em Libras',
      'Teste meu conhecimento sobre o alfabeto manual',
      'Quero praticar sinais de emoções e sentimentos',
    ],
  },
  {
    id: 'culture',
    label: 'Cultura Surda',
    icon: 'ri-heart-3-line',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-500',
    description: 'História, identidade e comunidade surda',
    welcomeTitle: 'Cultura Surda',
    welcomeSubtitle: 'Descubra a rica história, identidade e comunidade da cultura surda brasileira e mundial.',
    suggestions: [
      'Qual é a história da Libras no Brasil?',
      'O que é a identidade surda?',
      'Quais são os direitos garantidos às pessoas surdas no Brasil?',
      'Me conte sobre artistas e personalidades surdas famosas',
      'Qual a diferença entre o modelo médico e social da surdez?',
      'Como funciona a educação bilíngue para surdos?',
    ],
  },
];

export const getModeById = (id: ModeId): AssistantMode => {
  return assistantModes.find((m) => m.id === id) ?? assistantModes[0];
};
