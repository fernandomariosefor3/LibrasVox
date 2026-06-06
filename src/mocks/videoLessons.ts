export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  category: string;
  episodeNumber: number;
  playlistIndex: number;
  duration: string;
  youtubeId: string;
  signsCovered: string[];
  color: string;
}

export interface VideoPlaylist {
  id: string;
  name: string;
  channel: string;
  description: string;
  playlistId: string;
  badgeColor: string;
  icon: string;
  videos: VideoLesson[];
}

export const playlists: VideoPlaylist[] = [
  {
    id: 'tvines',
    name: 'TV INES',
    channel: 'Instituto Nacional de Educação de Surdos',
    description: 'Aulas oficiais do INES com intérpretes certificados. Conteúdo institucional de referência em Libras no Brasil.',
    playlistId: 'PLkRFiAUdJlEaPP-ypxzDVTwCxv2I_v3NJ',
    badgeColor: 'bg-emerald-50 text-emerald-600',
    icon: 'ri-hand-heart-line',
    videos: [
      {
        id: 'ines-01',
        title: 'Abecedário',
        description: 'Aprenda o alfabeto manual completo em Libras, com a sinalização de cada letra e dicas de memorização.',
        category: 'Fundamentos',
        episodeNumber: 1,
        playlistIndex: 1,
        duration: '8:18',
        youtubeId: 'nSuysTxvGJA',
        signsCovered: [],
        color: 'bg-emerald-50 text-emerald-600',
      },
      {
        id: 'ines-02',
        title: 'Família',
        description: 'Sinais essenciais para se comunicar sobre a família: mãe, pai, irmãos, avós, tios, primos e mais.',
        category: 'Fundamentos',
        episodeNumber: 2,
        playlistIndex: 2,
        duration: '8:18',
        youtubeId: 'nSuysTxvGJA',
        signsCovered: ['mae', 'pai', 'filho', 'filha', 'irmao', 'irma', 'avo', 'avo-homem', 'tia', 'tio', 'prima', 'primo'],
        color: 'bg-sky-50 text-sky-600',
      },
      {
        id: 'ines-03',
        title: 'Dias da Semana',
        description: 'Os sinais dos sete dias da semana, com explicações sobre numerais temporais em Libras.',
        category: 'Tempo',
        episodeNumber: 3,
        playlistIndex: 3,
        duration: '8:18',
        youtubeId: 'nSuysTxvGJA',
        signsCovered: ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
        color: 'bg-amber-50 text-amber-600',
      },
      {
        id: 'ines-04',
        title: 'Meses e Estações do Ano',
        description: 'Sinais dos 12 meses e das quatro estações, fundamentais para conversas cotidianas.',
        category: 'Tempo',
        episodeNumber: 4,
        playlistIndex: 4,
        duration: '8:18',
        youtubeId: 'nSuysTxvGJA',
        signsCovered: ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
        color: 'bg-rose-50 text-rose-600',
      },
      {
        id: 'ines-05',
        title: 'Sol e Lua',
        description: 'Os sinais de astros e fenômenos da natureza: sol, lua, estrelas, chuva, vento e mais.',
        category: 'Natureza',
        episodeNumber: 5,
        playlistIndex: 5,
        duration: '8:18',
        youtubeId: 'nSuysTxvGJA',
        signsCovered: ['sol', 'lua'],
        color: 'bg-violet-50 text-violet-600',
      },
    ],
  },
  {
    id: 'academia',
    name: 'Academia de Libras',
    channel: 'Academia de Libras',
    description: 'Curso completo de Libras para iniciantes. Aulas práticas com sinais essenciais do dia a dia, saudações, pronomes e frases básicas.',
    playlistId: 'PL8eRdbSEC-1lKAl3SEaFezjDPg2BPgSCe',
    badgeColor: 'bg-orange-50 text-orange-600',
    icon: 'ri-graduation-cap-line',
    videos: [
      {
        id: 'acad-01',
        title: 'Como Aprender Libras do Zero',
        description: 'Guia passo a passo para iniciantes: por onde começar, como praticar sozinho e os primeiros passos na Língua Brasileira de Sinais.',
        category: 'Fundamentos',
        episodeNumber: 1,
        playlistIndex: 1,
        duration: '24:51',
        youtubeId: '-ZDkdbPqUZg',
        signsCovered: [],
        color: 'bg-emerald-50 text-emerald-600',
      },
      {
        id: 'acad-02',
        title: 'Saudações em Libras',
        description: 'Aprenda as saudações mais comuns: bom dia, boa tarde, boa noite, olá, tchau, prazer em te conhecer e mais.',
        category: 'Fundamentos',
        episodeNumber: 2,
        playlistIndex: 2,
        duration: '12:07',
        youtubeId: '-ZDkdbPqUZg',
        signsCovered: ['ola', 'bom-dia', 'boa-tarde', 'boa-noite', 'tchau', 'obrigado', 'por-favor'],
        color: 'bg-sky-50 text-sky-600',
      },
      {
        id: 'acad-03',
        title: '35 Sinais Básicos Mais Usados',
        description: 'Os 35 sinais mais essenciais do dia a dia: comer, beber, casa, trabalho, escola, dinheiro, saúde e mais.',
        category: 'Fundamentos',
        episodeNumber: 3,
        playlistIndex: 3,
        duration: '19:00',
        youtubeId: '-ZDkdbPqUZg',
        signsCovered: ['comer', 'beber', 'casa', 'trabalho', 'escola', 'dinheiro', 'agua', 'fogo', 'porta', 'janela'],
        color: 'bg-amber-50 text-amber-600',
      },
      {
        id: 'acad-04',
        title: '5 Frases para Iniciantes',
        description: 'Frases completas em Libras para começar a conversar: apresentações, perguntas básicas e respostas simples.',
        category: 'Fundamentos',
        episodeNumber: 4,
        playlistIndex: 4,
        duration: '16:13',
        youtubeId: '-ZDkdbPqUZg',
        signsCovered: ['como-vai', 'meu-nome', 'muito-prazer', 'de-onde-voce-e', 'qual-seu-nome'],
        color: 'bg-rose-50 text-rose-600',
      },
      {
        id: 'acad-05',
        title: 'Pronomes em Libras',
        description: 'Os sinais dos pronomes pessoais: eu, você, ele, ela, nós, vocês, eles, meu, seu, dele.',
        category: 'Gramática',
        episodeNumber: 5,
        playlistIndex: 5,
        duration: '14:37',
        youtubeId: '-ZDkdbPqUZg',
        signsCovered: ['eu', 'voce', 'ele', 'ela', 'nos', 'eles'],
        color: 'bg-violet-50 text-violet-600',
      },
      {
        id: 'acad-06',
        title: '35 Sinais Básicos — Parte 2',
        description: 'Continuação dos sinais essenciais: emoções, adjetivos, lugares, transporte, comidas e mais vocabulário do cotidiano.',
        category: 'Fundamentos',
        episodeNumber: 6,
        playlistIndex: 6,
        duration: '19:00',
        youtubeId: '-ZDkdbPqUZg',
        signsCovered: ['feliz', 'triste', 'amor', 'medo', 'amigo', 'hospital', 'mercado', 'onibus', 'carro', 'cafe'],
        color: 'bg-teal-50 text-teal-600',
      },
    ],
  },
];

export const VIDEO_CATEGORIES = ['Todos', 'Fundamentos', 'Tempo', 'Natureza', 'Gramática'];

export function getEmbedUrl(playlistId: string, index: number): string {
  return `https://www.youtube.com/embed/videoseries?list=${playlistId}&index=${index}`;
}