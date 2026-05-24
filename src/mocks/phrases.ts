export interface PhraseSign {
  signId: string;
  note?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  signs: PhraseSign[];
  glossa: string;
  portuguese: string;
  grammarNotes: string[];
}

export const scenarios: Scenario[] = [
  {
    id: 'apresentar',
    title: 'Se Apresentar',
    description: 'Cumprimente alguém, diga seu nome e pergunte como a pessoa está.',
    icon: 'ri-user-smile-line',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    difficulty: 'iniciante',
    signs: [
      { signId: 'oi', note: 'Saudação inicial' },
      { signId: 'eu', note: 'Indica o próprio falante' },
      { signId: 'voce', note: 'Dirige-se ao interlocutor' },
      { signId: 'como', note: 'Pergunta sobre estado' },
      { signId: 'bem-vindo', note: 'Expressão de acolhimento' },
      { signId: 'obrigado', note: 'Agradecimento' },
    ],
    glossa: 'OI EU VOCÊ COMO ESTÁ? BEM-VINDO. OBRIGADO.',
    portuguese: 'Oi! Eu sou... Como você está? Seja bem-vindo! Obrigado.',
    grammarNotes: [
      'Em Libras, a ordem é tipicamente OSV (Objeto-Sujeito-Verbo).',
      'Os pronomes pessoais (EU, VOCÊ) são sinalizados apontando para o espaço.',
      'Não há conjugação verbal: COMO serve para "como está?", "como foi?", "como será?".',
      'Expressões faciais carregam grande parte da intenção (pergunta, alegria, surpresa).',
    ],
  },
  {
    id: 'restaurante',
    title: 'No Restaurante',
    description: 'Peça comida e bebida educadamente, agradeça e responda.',
    icon: 'ri-restaurant-line',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    difficulty: 'iniciante',
    signs: [
      { signId: 'por-favor', note: 'Cortesia antes do pedido' },
      { signId: 'comida', note: 'Pedido principal' },
      { signId: 'agua', note: 'Bebida' },
      { signId: 'gostar', note: 'Expressa que gostou' },
      { signId: 'obrigado', note: 'Agradecimento ao garçom' },
      { signId: 'de-nada', note: 'Resposta do garçom' },
    ],
    glossa: 'POR-FAVOR COMIDA ÁGUA. GOSTAR. OBRIGADO. DE-NADA.',
    portuguese: 'Por favor, (quero) comida e água. Gostei! Obrigado. De nada.',
    grammarNotes: [
      'Em Libras, o verbo QUERER é frequentemente omitido em contextos claros como pedidos.',
      'A expressão facial de "pergunta" (sobrancelhas levantadas, olhos arregalados) acompanha POR-FAVOR.',
      'O sinal GOSTAR pode ser repetido para enfatizar: "gostei muito".',
      'A resposta DE-NADA é um sinal único que independe do que foi agradecido.',
    ],
  },
  {
    id: 'perguntar-caminho',
    title: 'Perguntar Direções',
    description: 'Pergunte onde ficam lugares importantes e agradeça pela ajuda.',
    icon: 'ri-map-pin-line',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    difficulty: 'iniciante',
    signs: [
      { signId: 'oi', note: 'Saudação' },
      { signId: 'onde', note: 'Pergunta de localização' },
      { signId: 'casa', note: 'Lugar: residência' },
      { signId: 'hospital', note: 'Lugar: saúde' },
      { signId: 'escola', note: 'Lugar: educação' },
      { signId: 'obrigado', note: 'Agradecimento' },
    ],
    glossa: 'OI. ONDE CASA? ONDE HOSPITAL? ONDE ESCOLA? OBRIGADO.',
    portuguese: 'Oi. Onde fica a casa? Onde fica o hospital? Onde fica a escola? Obrigado.',
    grammarNotes: [
      'ONDEm Libras não exige inversão: basta sinalizar ONDE + o lugar desejado.',
      'Os locais podem ser indicados no espaço de sinalização: CASA à direita, HOSPITAL à esquerda.',
      'A expressão facial de dúvida (cenho franzido) acompanha ONDE.',
      'Pode-se apontar na direção do lugar após saber a resposta, reforçando o uso do espaço.',
    ],
  },
  {
    id: 'familia',
    title: 'Falar da Família',
    description: 'Apresente os membros da sua família e expresse afeto.',
    icon: 'ri-heart-pulse-line',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    difficulty: 'intermediario',
    signs: [
      { signId: 'mae', note: 'Figura materna' },
      { signId: 'pai', note: 'Figura paterna' },
      { signId: 'irmao', note: 'Irmão' },
      { signId: 'irma', note: 'Irmã' },
      { signId: 'amor', note: 'Expressão de carinho' },
      { signId: 'casa', note: 'Moram juntos' },
      { signId: 'feliz', note: 'Emoção positiva' },
    ],
    glossa: 'MÃE PAI IRMÃO IRMÃ. AMOR CASA. FELIZ.',
    portuguese: 'Mãe, pai, irmão, irmã. Amor, casa. Felizes.',
    grammarNotes: [
      'Em Libras, lista de itens pode ser sinalizada em sequência rápida sem conectores.',
      'O sinal AMOR é intensificado com expressão facial calorosa.',
      'A ordem é flexível: CASA AMOR também funciona, com sentido de "amor em casa".',
      'Para negar ("não tenho irmão"), sinaliza-se IRMÃO + cabeça balançando negativamente.',
    ],
  },
  {
    id: 'emocoes',
    title: 'Expressar Emoções',
    description: 'Conte como você está se sentindo hoje.',
    icon: 'ri-emotion-line',
    color: 'text-fuchsia-700',
    bgColor: 'bg-fuchsia-50',
    borderColor: 'border-fuchsia-200',
    difficulty: 'iniciante',
    signs: [
      { signId: 'eu', note: 'Quem sente' },
      { signId: 'feliz', note: 'Estado positivo' },
      { signId: 'triste', note: 'Estado negativo' },
      { signId: 'com-raiva', note: 'Estado de irritação' },
      { signId: 'amor', note: 'Afeto profundo' },
      { signId: 'surpreso', note: 'Espanto' },
    ],
    glossa: 'EU FELIZ. EU TRISTE. EU COM-RAIVA. EU AMOR. EU SURPRESO.',
    portuguese: 'Eu estou feliz. Eu estou triste. Eu estou com raiva. Eu amo. Eu estou surpreso.',
    grammarNotes: [
      'Em Libras, o verbo ESTAR é sempre omitido. Basta sinalizar EU + FELIZ.',
      'A intensidade da emoção é dada pela expressão facial e velocidade do sinal.',
      'FELIZ rápido = muito feliz. FELIZ lento = calma, paz.',
      'Para alternar emoções, pode-se usar a técnica de role-shift (mudar o corpo).',
    ],
  },
  {
    id: 'hospital',
    title: 'No Hospital',
    description: 'Peça ajuda médica, descreva onde dói e agradeça.',
    icon: 'ri-hospital-line',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    difficulty: 'intermediario',
    signs: [
      { signId: 'ajudar', note: 'Pedido de auxílio' },
      { signId: 'hospital', note: 'Local de atendimento' },
      { signId: 'medico', note: 'Profissional de saúde' },
      { signId: 'cabeca', note: 'Parte do corpo' },
      { signId: 'como', note: 'Pergunta sobre estado' },
      { signId: 'obrigado', note: 'Agradecimento' },
    ],
    glossa: 'AJUDAR HOSPITAL. MÉDICO. CABEÇA COMO? OBRIGADO.',
    portuguese: 'Preciso de ajuda, hospital. Médico. Como está a cabeça? Obrigado.',
    grammarNotes: [
      'AJUDAR + HOSPITAL forma uma construção implícita de "preciso de ajuda no hospital".',
      'Para indicar dor, o sinal da parte do corpo é repetido com expressão facial de sofrimento.',
      'CABEÇA COMO pode significar "como está a cabeça?" ou "dói a cabeça?" dependendo da expressão.',
      'Em situações de emergência, o sinal AJUDAR é amplificado e sinalizado rapidamente.',
    ],
  },
  {
    id: 'compras',
    title: 'Ir às Compras',
    description: 'No mercado, escolha itens e finalize a compra.',
    icon: 'ri-shopping-cart-line',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    difficulty: 'iniciante',
    signs: [
      { signId: 'mercado', note: 'Local da compra' },
      { signId: 'dinheiro', note: 'Meio de pagamento' },
      { signId: 'comida', note: 'Categoria de itens' },
      { signId: 'fruta', note: 'Item específico' },
      { signId: 'agua', note: 'Item específico' },
      { signId: 'pao', note: 'Item específico' },
      { signId: 'obrigado', note: 'Agradecimento' },
    ],
    glossa: 'MERCADO. DINHEIRO. COMIDA FRUTA ÁGUA PÃO. OBRIGADO.',
    portuguese: '(Vou ao) mercado. (Com) dinheiro. (Quero) comida, fruta, água, pão. Obrigado.',
    grammarNotes: [
      'O verbo IR é omitido em contextos claros: MERCADO já implica "vou ao mercado".',
      'A lista de itens (COMIDA FRUTA ÁGUA PÃO) é sinalizada em sequência rápida.',
      'Para indicar quantidade, insere-se o número antes do item: DOIS PÃO.',
      'DINHEIRO pode ser sinalizado antes ou depois, sem alterar o sentido principal.',
    ],
  },
  {
    id: 'trabalho',
    title: 'No Trabalho',
    description: 'Cumprimente colegas, fale do trabalho e se despeça.',
    icon: 'ri-briefcase-line',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    difficulty: 'intermediario',
    signs: [
      { signId: 'bom-dia', note: 'Saudação matinal' },
      { signId: 'trabalho', note: 'Atividade profissional' },
      { signId: 'computador', note: 'Ferramenta de trabalho' },
      { signId: 'telefone', note: 'Comunicação' },
      { signId: 'ajudar', note: 'Colaboração' },
      { signId: 'obrigado', note: 'Agradecimento' },
      { signId: 'tchau', note: 'Despedida' },
    ],
    glossa: 'BOM-DIA. TRABALHO COMPUTADOR TELEFONE. AJUDAR. OBRIGADO. TCHAU.',
    portuguese: 'Bom dia. Trabalho no computador e telefone. Ajuda. Obrigado. Tchau.',
    grammarNotes: [
      'BOM-DIA é uma saudação composta de BOM + DIA, sinalizada como um único movimento fluido.',
      'A sequência TRABALHO COMPUTADOR TELEFONE indica "trabalho com computador e telefone".',
      'AJUDAR pode ser direcionado: apontar para uma pessoa + AJUDAR = "ajudar aquela pessoa".',
      'A despedida TCHAU pode ser acompanhada de BOM-DIA para "tenha um bom dia".',
    ],
  },
];

export const getScenarioById = (id: string): Scenario | undefined => {
  return scenarios.find((s) => s.id === id);
};

export const getScenariosByDifficulty = (difficulty: string): Scenario[] => {
  return scenarios.filter((s) => s.difficulty === difficulty);
};