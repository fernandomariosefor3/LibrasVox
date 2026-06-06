export type CourseLevel = 'basico' | 'intermediario' | 'avancado';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'leitura' | 'exercicio' | 'quiz';
  description: string;
}

export interface CourseModule {
  id: string;
  level: CourseLevel;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  lessons: Lesson[];
  totalDuration: string;
  prerequisites: string;
  badge: string;
}

export const courseModules: CourseModule[] = [
  // ── BÁSICO ──────────────────────────────────────────────────────────────
  {
    id: 'basico-1',
    level: 'basico',
    order: 1,
    title: 'Introdução à Libras',
    subtitle: 'Fundamentos e contexto histórico',
    description: 'Compreenda o que é a Libras, sua origem, status legal e importância cultural para a comunidade surda brasileira.',
    objectives: [
      'Conhecer a história e origem da Libras',
      'Entender o status linguístico da Libras',
      'Compreender a Lei 10.436/2002 e o Decreto 5.626/2005',
      'Reconhecer a importância da Libras para a inclusão social',
    ],
    lessons: [
      { id: 'b1-l1', title: 'O que é Libras?', duration: '15 min', type: 'leitura', description: 'Definição, status linguístico e diferenças em relação ao português.' },
      { id: 'b1-l2', title: 'História da Libras no Brasil', duration: '20 min', type: 'leitura', description: 'Do INES (1857) à Lei 10.436/2002 e o Decreto 5.626/2005.' },
      { id: 'b1-l3', title: 'Comunidade Surda e Cultura Surda', duration: '15 min', type: 'leitura', description: 'Identidade surda, associações e movimentos sociais.' },
      { id: 'b1-l4', title: 'Quiz: Fundamentos', duration: '10 min', type: 'quiz', description: 'Avalie seu entendimento sobre os fundamentos da Libras.' },
    ],
    totalDuration: '1h',
    prerequisites: 'Nenhum',
    badge: 'ri-seedling-line',
  },
  {
    id: 'basico-2',
    level: 'basico',
    order: 2,
    title: 'Datilologia — Alfabeto Manual',
    subtitle: 'As 26 letras do alfabeto em sinais',
    description: 'Aprenda a soletrar palavras usando o alfabeto manual da Libras (datilologia), essencial para nomes próprios e termos sem sinal específico.',
    objectives: [
      'Reconhecer e produzir as 26 configurações de mão do alfabeto',
      'Soletrar nomes próprios com fluência',
      'Compreender quando usar a datilologia',
      'Praticar velocidade e clareza na soletração',
    ],
    lessons: [
      { id: 'b2-l1', title: 'Letras A–G', duration: '20 min', type: 'leitura', description: 'Configurações de mão para as primeiras letras do alfabeto.' },
      { id: 'b2-l2', title: 'Letras H–N', duration: '20 min', type: 'leitura', description: 'Configurações de mão para o grupo intermediário.' },
      { id: 'b2-l3', title: 'Letras O–Z', duration: '20 min', type: 'leitura', description: 'Configurações de mão para as letras finais.' },
      { id: 'b2-l4', title: 'Prática: Soletrar nomes', duration: '15 min', type: 'exercicio', description: 'Exercícios de soletração de nomes comuns em Libras.' },
      { id: 'b2-l5', title: 'Quiz: Alfabeto', duration: '10 min', type: 'quiz', description: 'Identifique as letras a partir das configurações de mão.' },
    ],
    totalDuration: '1h 25min',
    prerequisites: 'Módulo 1',
    badge: 'ri-font-size',
  },
  {
    id: 'basico-3',
    level: 'basico',
    order: 3,
    title: 'Saudações e Expressões Cotidianas',
    subtitle: 'Vocabulário essencial do dia a dia',
    description: 'Aprenda os sinais mais utilizados no cotidiano: cumprimentos, apresentações, agradecimentos e expressões de cortesia.',
    objectives: [
      'Produzir sinais de saudação e despedida',
      'Apresentar-se em Libras',
      'Usar expressões de cortesia (obrigado, por favor, desculpe)',
      'Conduzir uma conversa básica de apresentação',
    ],
    lessons: [
      { id: 'b3-l1', title: 'Saudações: Olá, Bom dia, Boa tarde', duration: '15 min', type: 'leitura', description: 'Sinais de cumprimento e como usá-los corretamente.' },
      { id: 'b3-l2', title: 'Apresentações pessoais', duration: '20 min', type: 'leitura', description: 'Como dizer seu nome, idade e de onde você é.' },
      { id: 'b3-l3', title: 'Expressões de cortesia', duration: '15 min', type: 'leitura', description: 'Obrigado, por favor, desculpe, com licença.' },
      { id: 'b3-l4', title: 'Exercício: Diálogo de apresentação', duration: '20 min', type: 'exercicio', description: 'Pratique um diálogo completo de apresentação.' },
      { id: 'b3-l5', title: 'Quiz: Vocabulário cotidiano', duration: '10 min', type: 'quiz', description: 'Teste seu conhecimento dos sinais aprendidos.' },
    ],
    totalDuration: '1h 20min',
    prerequisites: 'Módulo 2',
    badge: 'ri-chat-smile-2-line',
  },
  {
    id: 'basico-4',
    level: 'basico',
    order: 4,
    title: 'Números, Cores e Tempo',
    subtitle: 'Quantidades, cores e expressões temporais',
    description: 'Domine os sinais para números (0–100), cores básicas e expressões de tempo como dias da semana, meses e horas.',
    objectives: [
      'Sinalizar números de 0 a 100',
      'Identificar e produzir sinais das cores básicas',
      'Expressar dias da semana e meses do ano',
      'Indicar horas e períodos do dia',
    ],
    lessons: [
      { id: 'b4-l1', title: 'Números 0–20', duration: '20 min', type: 'leitura', description: 'Configurações de mão para os primeiros números.' },
      { id: 'b4-l2', title: 'Números 21–100 e ordinais', duration: '15 min', type: 'leitura', description: 'Dezenas, centenas e números ordinais.' },
      { id: 'b4-l3', title: 'Cores básicas e avançadas', duration: '15 min', type: 'leitura', description: 'Sinais para as principais cores em Libras.' },
      { id: 'b4-l4', title: 'Dias, meses e horas', duration: '20 min', type: 'leitura', description: 'Expressões temporais essenciais.' },
      { id: 'b4-l5', title: 'Quiz: Números e tempo', duration: '10 min', type: 'quiz', description: 'Avaliação dos conteúdos do módulo.' },
    ],
    totalDuration: '1h 20min',
    prerequisites: 'Módulo 3',
    badge: 'ri-number-1',
  },

  // ── INTERMEDIÁRIO ────────────────────────────────────────────────────────
  {
    id: 'inter-1',
    level: 'intermediario',
    order: 1,
    title: 'Estrutura Gramatical da Libras',
    subtitle: 'Sintaxe, morfologia e uso do espaço',
    description: 'Estude a gramática da Libras: ordem das palavras (OSV), uso do espaço de sinalização, incorporação e concordância verbal.',
    objectives: [
      'Compreender a ordem sintática OSV da Libras',
      'Usar o espaço de sinalização para referência',
      'Aplicar concordância verbal espacial',
      'Distinguir Libras do português sinalizado',
    ],
    lessons: [
      { id: 'i1-l1', title: 'Ordem das palavras: OSV vs SVO', duration: '25 min', type: 'leitura', description: 'Como a Libras organiza sujeito, objeto e verbo.' },
      { id: 'i1-l2', title: 'Espaço de sinalização e loci', duration: '25 min', type: 'leitura', description: 'Como o espaço físico funciona como gramática.' },
      { id: 'i1-l3', title: 'Concordância verbal', duration: '20 min', type: 'leitura', description: 'Verbos direcionais e sua concordância espacial.' },
      { id: 'i1-l4', title: 'Exercício: Construção de frases', duration: '25 min', type: 'exercicio', description: 'Monte frases corretas em Libras.' },
      { id: 'i1-l5', title: 'Quiz: Gramática básica', duration: '15 min', type: 'quiz', description: 'Avaliação da estrutura gramatical.' },
    ],
    totalDuration: '1h 50min',
    prerequisites: 'Nível Básico completo',
    badge: 'ri-book-open-line',
  },
  {
    id: 'inter-2',
    level: 'intermediario',
    order: 2,
    title: 'Expressões Faciais e Corporais',
    subtitle: 'Componentes não-manuais da Libras',
    description: 'As expressões faciais e corporais são componentes gramaticais obrigatórios na Libras, não apenas emocionais. Aprenda seu uso linguístico.',
    objectives: [
      'Usar expressões faciais como marcadores gramaticais',
      'Distinguir expressões afetivas de gramaticais',
      'Aplicar marcadores de negação, interrogação e afirmação',
      'Usar o corpo para indicar personagens e perspectivas',
    ],
    lessons: [
      { id: 'i2-l1', title: 'Expressões faciais gramaticais', duration: '25 min', type: 'leitura', description: 'Sobrancelhas, boca e olhos como gramática.' },
      { id: 'i2-l2', title: 'Marcadores de interrogação', duration: '20 min', type: 'leitura', description: 'Perguntas sim/não vs. perguntas abertas (QU-).' },
      { id: 'i2-l3', title: 'Negação e afirmação', duration: '15 min', type: 'leitura', description: 'Como negar e afirmar em Libras.' },
      { id: 'i2-l4', title: 'Roleshift — troca de perspectiva', duration: '20 min', type: 'leitura', description: 'Incorporar personagens no discurso.' },
      { id: 'i2-l5', title: 'Exercício: Expressões em contexto', duration: '20 min', type: 'exercicio', description: 'Pratique expressões em frases reais.' },
    ],
    totalDuration: '1h 40min',
    prerequisites: 'Inter. Módulo 1',
    badge: 'ri-emotion-line',
  },
  {
    id: 'inter-3',
    level: 'intermediario',
    order: 3,
    title: 'Classificadores em Libras',
    subtitle: 'Representação visual de objetos e ações',
    description: 'Os classificadores são configurações de mão que representam categorias de objetos, pessoas e movimentos. São fundamentais para a fluência.',
    objectives: [
      'Identificar os principais tipos de classificadores',
      'Usar classificadores de entidade (pessoas, veículos)',
      'Aplicar classificadores de manejo e instrumentais',
      'Descrever cenas e movimentos com classificadores',
    ],
    lessons: [
      { id: 'i3-l1', title: 'O que são classificadores?', duration: '20 min', type: 'leitura', description: 'Definição, tipos e função linguística.' },
      { id: 'i3-l2', title: 'Classificadores de entidade', duration: '25 min', type: 'leitura', description: 'Representar pessoas, animais e veículos.' },
      { id: 'i3-l3', title: 'Classificadores de manejo', duration: '20 min', type: 'leitura', description: 'Como segurar e manipular objetos em Libras.' },
      { id: 'i3-l4', title: 'Descrevendo cenas com classificadores', duration: '25 min', type: 'exercicio', description: 'Narrar situações usando classificadores.' },
      { id: 'i3-l5', title: 'Quiz: Classificadores', duration: '15 min', type: 'quiz', description: 'Identifique e use classificadores corretamente.' },
    ],
    totalDuration: '1h 45min',
    prerequisites: 'Inter. Módulo 2',
    badge: 'ri-shapes-line',
  },

  // ── AVANÇADO ─────────────────────────────────────────────────────────────
  {
    id: 'avanc-1',
    level: 'avancado',
    order: 1,
    title: 'Discurso e Narrativa em Libras',
    subtitle: 'Coesão, coerência e estrutura textual',
    description: 'Estude como construir discursos coesos em Libras: narração de histórias, descrição de eventos e uso de recursos discursivos avançados.',
    objectives: [
      'Construir narrativas coesas em Libras',
      'Usar marcadores de tempo e espaço no discurso',
      'Aplicar recursos de coesão textual',
      'Narrar eventos passados, presentes e futuros',
    ],
    lessons: [
      { id: 'a1-l1', title: 'Estrutura narrativa em Libras', duration: '30 min', type: 'leitura', description: 'Introdução, desenvolvimento e conclusão em sinais.' },
      { id: 'a1-l2', title: 'Marcadores temporais avançados', duration: '25 min', type: 'leitura', description: 'Passado, presente, futuro e aspectos verbais.' },
      { id: 'a1-l3', title: 'Coesão e referência anafórica', duration: '25 min', type: 'leitura', description: 'Como retomar referentes no discurso.' },
      { id: 'a1-l4', title: 'Exercício: Narrar uma história', duration: '30 min', type: 'exercicio', description: 'Produza uma narrativa completa em Libras.' },
      { id: 'a1-l5', title: 'Quiz: Discurso', duration: '15 min', type: 'quiz', description: 'Avaliação de recursos discursivos.' },
    ],
    totalDuration: '2h 05min',
    prerequisites: 'Nível Intermediário completo',
    badge: 'ri-quill-pen-line',
  },
  {
    id: 'avanc-2',
    level: 'avancado',
    order: 2,
    title: 'Interpretação e Tradução',
    subtitle: 'Fundamentos para intérpretes de Libras',
    description: 'Introdução às técnicas de interpretação simultânea e consecutiva entre Libras e Português, ética profissional e desafios da prática.',
    objectives: [
      'Compreender os fundamentos da interpretação em Libras',
      'Aplicar técnicas de interpretação simultânea',
      'Conhecer o Código de Ética do intérprete',
      'Identificar desafios e estratégias de interpretação',
    ],
    lessons: [
      { id: 'a2-l1', title: 'Fundamentos da interpretação', duration: '30 min', type: 'leitura', description: 'Diferença entre tradução e interpretação.' },
      { id: 'a2-l2', title: 'Técnicas de interpretação simultânea', duration: '30 min', type: 'leitura', description: 'Estratégias para interpretar em tempo real.' },
      { id: 'a2-l3', title: 'Ética profissional do intérprete', duration: '20 min', type: 'leitura', description: 'Código de ética e responsabilidades.' },
      { id: 'a2-l4', title: 'Exercício: Interpretação de texto', duration: '35 min', type: 'exercicio', description: 'Pratique a interpretação de um texto curto.' },
      { id: 'a2-l5', title: 'Quiz: Interpretação', duration: '15 min', type: 'quiz', description: 'Avaliação dos fundamentos de interpretação.' },
    ],
    totalDuration: '2h 10min',
    prerequisites: 'Avançado Módulo 1',
    badge: 'ri-translate-2',
  },
];

export const levelInfo = {
  basico: {
    label: 'Básico',
    description: 'Para quem está começando do zero. Fundamentos, alfabeto e vocabulário essencial.',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    gradient: 'from-emerald-500 to-teal-500',
    icon: 'ri-seedling-line',
    modules: 4,
    hours: '5h',
  },
  intermediario: {
    label: 'Intermediário',
    description: 'Gramática, expressões faciais e classificadores para quem já conhece o básico.',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    gradient: 'from-amber-500 to-orange-500',
    icon: 'ri-plant-line',
    modules: 3,
    hours: '5h 15min',
  },
  avancado: {
    label: 'Avançado',
    description: 'Discurso, narrativa e interpretação para quem busca fluência e profissionalização.',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-700',
    gradient: 'from-rose-500 to-pink-500',
    icon: 'ri-award-line',
    modules: 2,
    hours: '4h 15min',
  },
};
