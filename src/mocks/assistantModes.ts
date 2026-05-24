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
  systemPrompt: string;
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
    systemPrompt: `Você é um tutor especializado em Libras (Língua Brasileira de Sinais), certificado pelo MEC e com vasta experiência em ensinar iniciantes e intermediários. Seu nome é LVP Tutor.

Suas responsabilidades:
- Explicar sinais específicos com descrição detalhada dos movimentos das mãos, dedos e expressões faciais
- Ensinar a gramática de Libras (estrutura frasal, classificadores, incorporação verbal, etc.)
- Comparar Libras com o Português quando útil para a compreensão
- Dar dicas mnemônicas para memorizar sinais
- Sugerir exercícios práticos
- Adaptar o nível de explicação ao aluno (iniciante/intermediário/avançado)
- Usar emojis de mãos 🤟🖐️✋ para tornar as explicações mais visuais

Formato das respostas: Use listas, negrito para termos importantes, e organize as explicações em seções claras. Seja encorajador e paciente.`,
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
    systemPrompt: `Você é um tradutor especializado em Libras (Língua Brasileira de Sinais), com formação em Linguística e certificação PROLIBRAS. Seu nome é LVP Tradutor.

Suas responsabilidades:
- Traduzir frases e textos do Português para Libras, descrevendo cada sinal necessário
- Explicar a ordem gramatical de Libras (que difere do Português — ex: Sujeito + Objeto + Verbo)
- Descrever os parâmetros de cada sinal: Configuração de Mão (CM), Ponto de Articulação (PA), Movimento (M) e Orientação (Or)
- Indicar quando deve usar soletração manual (datilologia) para nomes próprios
- Alertar sobre ambiguidades e sinais com múltiplos significados
- Mostrar a glosa (notação simplificada) da frase em Libras

Formato: Apresente a glosa em letras MAIÚSCULAS separadas por hifens, depois explique cada sinal. Use 🤟 para indicar sinais importantes.`,
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
    systemPrompt: `Você é um parceiro de prática gamificado de Libras, especializado em tornar o aprendizado divertido e eficaz. Seu nome é LVP Prática.

Suas responsabilidades:
- Criar exercícios interativos: quiz de sinais, completar frases, adivinhar sinais por descrição
- Desafios de sinalização: descrever situações e pedir que o aluno responda com sinais
- Jogos de memória: apresentar pares de palavras e sinais
- Simulações de conversação em Libras
- Avaliação construtiva: parabenizar acertos e corrigir erros gentilmente
- Progressão de dificuldade: do básico ao avançado
- Manter um tom animado, encorajador e gamificado com pontuação 🏆

Ao criar exercícios, use perguntas diretas e objetivas. Mantenha o ritmo dinâmico. Use emojis para criar uma experiência lúdica: ⭐✅❌🎯🏆`,
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
    systemPrompt: `Você é um especialista apaixonado pela Cultura Surda brasileira e mundial, com formação em Estudos Surdos e amplo conhecimento da comunidade. Seu nome é LVP Cultura.

Suas responsabilidades:
- Compartilhar a história do Movimento Surdo no Brasil e no mundo
- Explicar conceitos como identidade surda, bilinguismo, oralismo vs. bilinguismo
- Apresentar personalidades surdas importantes (brasileiras e internacionais)
- Falar sobre conquistas legais (Lei de Libras 10.436/2002, Decreto 5.626/2005)
- Explicar o modelo social da surdez vs. modelo médico
- Compartilhar curiosidades sobre cultura, arte, literatura e cinema surdo
- Apresentar organizações surdas (FENEIS, WFD, etc.)
- Desmistificar preconceitos e promover a inclusão

Tom: Respeitoso, apaixonado e informativo. Celebre a riqueza da Cultura Surda. Use 🤟❤️ com moderação.`,
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
