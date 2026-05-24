export interface GrammarExample {
  libras: string;
  portuguese: string;
  note?: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  gradient: string;
  summary: string;
  sections: GrammarSection[];
  references: string[];
}

export interface GrammarSection {
  id: string;
  title: string;
  content: string;
  examples?: GrammarExample[];
  items?: { label: string; description: string; icon?: string }[];
  image?: string;
  imageAlt?: string;
  highlight?: string;
}

export const grammarTopics: GrammarTopic[] = [
  // ── 1. FONOLOGIA ──────────────────────────────────────────────────────────
  {
    id: 'fonologia',
    title: 'Fonologia da Libras',
    subtitle: 'Parâmetros fonológicos e estrutura dos sinais',
    icon: 'ri-hand-coin-line',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    gradient: 'from-emerald-500 to-teal-500',
    summary: 'A fonologia da Libras estuda as unidades mínimas que compõem os sinais. Diferente das línguas orais, os "fonemas" da Libras são parâmetros visuais-espaciais simultâneos.',
    sections: [
      {
        id: 'fon-1',
        title: 'Os 5 Parâmetros Fonológicos',
        content: 'Stokoe (1960) identificou os primeiros parâmetros das línguas de sinais. Para a Libras, Ferreira Brito (1995) e Quadros & Karnopp (2004) descrevem cinco parâmetros fonológicos que, combinados, formam cada sinal. A mudança de apenas um parâmetro pode criar um sinal completamente diferente (par mínimo).',
        items: [
          { label: 'Configuração de Mão (CM)', description: 'A forma que a(s) mão(s) assume(m) durante a realização do sinal. A Libras possui 64 configurações de mão distintas catalogadas.', icon: 'ri-hand-heart-line' },
          { label: 'Ponto de Articulação (PA)', description: 'O local no corpo ou no espaço de sinalização onde o sinal é produzido. Pode ser na cabeça, tronco, mão não-dominante ou no espaço neutro.', icon: 'ri-map-pin-line' },
          { label: 'Movimento (M)', description: 'O movimento da(s) mão(s) durante a produção do sinal: direção, frequência, tensão e tipo de movimento (linear, circular, etc.).', icon: 'ri-arrow-right-up-line' },
          { label: 'Orientação da Palma (Or)', description: 'A direção para a qual a palma da mão está voltada durante o sinal: para cima, para baixo, para o sinalizante, etc.', icon: 'ri-compass-3-line' },
          { label: 'Expressão Não-Manual (ENM)', description: 'Componentes faciais e corporais que acompanham os sinais: expressões faciais, movimentos de boca, cabeça e corpo.', icon: 'ri-emotion-line' },
        ],
        highlight: 'Pares mínimos em Libras: os sinais APRENDER e TARDE diferem apenas no ponto de articulação — demonstrando que a localização é um parâmetro fonológico.',
      },
      {
        id: 'fon-2',
        title: 'Sinais Simultâneos vs. Sequenciais',
        content: 'Uma característica fundamental das línguas de sinais é a simultaneidade: vários parâmetros são produzidos ao mesmo tempo. Isso contrasta com as línguas orais, onde os fonemas são produzidos em sequência linear. Essa simultaneidade permite que a Libras expresse em um único sinal o que o português precisaria de várias palavras para descrever.',
        examples: [
          { libras: 'CASA (sinal único)', portuguese: 'Uma configuração de mão + localização + movimento = "casa"', note: 'Todos os parâmetros ocorrem simultaneamente' },
          { libras: 'CARRO-PASSAR-RÁPIDO', portuguese: 'Um classificador com movimento rápido expressa toda a cena', note: 'Movimento e configuração codificam velocidade e tipo de veículo' },
        ],
      },
    ],
    references: ['QUADROS; KARNOPP, 2004, p. 47–89', 'FERREIRA BRITO, 1995, p. 19–45', 'STOKOE, 1960'],
  },

  // ── 2. MORFOLOGIA ─────────────────────────────────────────────────────────
  {
    id: 'morfologia',
    title: 'Morfologia da Libras',
    subtitle: 'Formação e estrutura interna dos sinais',
    icon: 'ri-shapes-line',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    gradient: 'from-amber-500 to-orange-500',
    summary: 'A morfologia da Libras estuda como os sinais são formados e modificados. A língua possui processos morfológicos ricos, incluindo flexão, derivação e composição — muitos deles realizados espacialmente.',
    sections: [
      {
        id: 'mor-1',
        title: 'Processos de Formação de Sinais',
        content: 'A Libras utiliza diferentes processos para criar novos sinais e modificar o significado dos existentes. Diferente do português, muitos desses processos ocorrem de forma simultânea no espaço de sinalização.',
        items: [
          { label: 'Composição', description: 'Dois ou mais sinais combinados para formar um novo sinal com significado próprio. Ex: ESCOLA = CASA + ESTUDAR.', icon: 'ri-merge-cells-horizontal' },
          { label: 'Derivação', description: 'Criação de novos sinais a partir de sinais existentes, geralmente com mudança de classe gramatical. Ex: TRABALHAR (verbo) → TRABALHO (substantivo).', icon: 'ri-git-branch-line' },
          { label: 'Incorporação de Numeral', description: 'O número é incorporado diretamente ao sinal, modificando sua configuração de mão. Ex: UM-MÊS, DOIS-MESES, TRÊS-MESES.', icon: 'ri-number-1' },
          { label: 'Reduplicação', description: 'Repetição do sinal ou parte dele para indicar pluralidade, aspecto habitual ou intensidade.', icon: 'ri-repeat-line' },
        ],
        highlight: 'A incorporação é um processo morfológico exclusivo das línguas de sinais: informações como número, aspecto e intensidade são "embutidas" no próprio sinal.',
      },
      {
        id: 'mor-2',
        title: 'Aspecto Verbal',
        content: 'A Libras não possui conjugação verbal por tempo (passado/presente/futuro) da mesma forma que o português. O tempo é marcado por advérbios temporais e pelo contexto. Porém, a língua possui um rico sistema de aspecto verbal, indicando a duração, repetição e completude da ação.',
        examples: [
          { libras: 'ONTEM EU IR ESCOLA', portuguese: 'Ontem eu fui à escola', note: 'Tempo marcado pelo advérbio ONTEM, não pelo verbo' },
          { libras: 'EU ESTUDAR [movimento repetido]', portuguese: 'Eu estudo habitualmente / fico estudando', note: 'Reduplicação indica aspecto habitual/continuativo' },
          { libras: 'EU COMER [movimento único e finalizado]', portuguese: 'Eu comi (ação completada)', note: 'Movimento único e seco indica aspecto perfectivo' },
        ],
      },
    ],
    references: ['QUADROS; KARNOPP, 2004, p. 90–130', 'FERREIRA BRITO, 1995, p. 46–80'],
  },

  // ── 3. SINTAXE ────────────────────────────────────────────────────────────
  {
    id: 'sintaxe',
    title: 'Sintaxe da Libras',
    subtitle: 'Ordem das palavras, espaço e concordância',
    icon: 'ri-node-tree',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    gradient: 'from-teal-500 to-cyan-500',
    summary: 'A sintaxe da Libras organiza os sinais em frases usando o espaço tridimensional como recurso gramatical. A ordem básica é OSV, mas o espaço de sinalização permite grande flexibilidade.',
    sections: [
      {
        id: 'sin-1',
        title: 'Ordem Sintática: OSV',
        content: 'A ordem básica dos constituintes na Libras é OSV (Objeto-Sujeito-Verbo), diferente do português que usa SVO. No entanto, essa ordem pode variar conforme o contexto discursivo, a topicalização e o foco informacional. O importante é que o espaço de sinalização estabelece as relações gramaticais.',
        examples: [
          { libras: 'LIVRO EU LER', portuguese: 'Eu leio o livro', note: 'Ordem OSV: objeto (LIVRO) vem antes do sujeito (EU)' },
          { libras: 'EU GOSTAR VOCÊ', portuguese: 'Eu gosto de você', note: 'Ordem SVO também ocorre, especialmente com verbos de estado' },
          { libras: 'MARIA [loci-a] JOÃO [loci-b] AJUDAR [a→b]', portuguese: 'Maria ajuda João', note: 'O verbo direcional indica sujeito e objeto pelo movimento espacial' },
        ],
        highlight: 'O espaço de sinalização funciona como uma "gramática espacial": ao estabelecer loci (pontos de referência) para pessoas e objetos, o sinalizante pode retomá-los apenas apontando para o espaço.',
      },
      {
        id: 'sin-2',
        title: 'Verbos Direcionais e Concordância',
        content: 'Os verbos direcionais são aqueles que se movem no espaço de sinalização para indicar sujeito e objeto. O movimento do verbo parte do locus do sujeito em direção ao locus do objeto, estabelecendo a concordância verbal de forma espacial — sem necessidade de pronomes explícitos.',
        items: [
          { label: 'Verbos Direcionais', description: 'Verbos que se movem entre loci para indicar sujeito e objeto. Ex: DAR, AJUDAR, PERGUNTAR, ENSINAR.', icon: 'ri-arrow-right-circle-line' },
          { label: 'Verbos de Concordância', description: 'Verbos que concordam com sujeito e/ou objeto por meio de modificações espaciais. Incluem verbos direcionais e verbos de localização.', icon: 'ri-links-line' },
          { label: 'Verbos Simples', description: 'Verbos que não se movem no espaço para indicar argumentos. Ex: PENSAR, GOSTAR, SABER. Requerem sujeito explícito.', icon: 'ri-subtract-line' },
        ],
      },
      {
        id: 'sin-3',
        title: 'Topicalização e Foco',
        content: 'A topicalização é um recurso sintático em que um constituinte é movido para o início da frase para ser marcado como tópico (tema do discurso). Na Libras, a topicalização é marcada por expressões não-manuais específicas: sobrancelhas levantadas e leve inclinação da cabeça para trás.',
        examples: [
          { libras: 'LIVRO [sobrancelha levantada], EU LER', portuguese: 'Quanto ao livro, eu o leio', note: 'LIVRO é topicalizado com ENM específica' },
          { libras: 'MARIA [sobrancelha levantada], ELA INTELIGENTE', portuguese: 'Quanto à Maria, ela é inteligente', note: 'Topicalização de sujeito com predicado nominal' },
        ],
      },
    ],
    references: ['QUADROS; KARNOPP, 2004, p. 131–175', 'FERREIRA BRITO, 1995, p. 81–120'],
  },

  // ── 4. EXPRESSÕES NÃO-MANUAIS ─────────────────────────────────────────────
  {
    id: 'enm',
    title: 'Expressões Não-Manuais',
    subtitle: 'Componentes gramaticais faciais e corporais',
    icon: 'ri-emotion-line',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    gradient: 'from-rose-500 to-pink-500',
    summary: 'As expressões não-manuais (ENM) são componentes gramaticais obrigatórios na Libras — não são apenas expressões emocionais. Elas marcam interrogação, negação, topicalização, foco e outros elementos sintáticos.',
    sections: [
      {
        id: 'enm-1',
        title: 'ENM Gramaticais vs. Afetivas',
        content: 'É fundamental distinguir as expressões não-manuais gramaticais das afetivas. As gramaticais têm função sintática obrigatória e ocorrem em contextos específicos. As afetivas expressam emoções e são opcionais. Um sinalizante fluente usa ambas simultaneamente, o que exige grande controle facial.',
        items: [
          { label: 'ENM Gramaticais', description: 'Têm função sintática: marcam interrogação, negação, topicalização, foco, condicionais. São obrigatórias em seus contextos.', icon: 'ri-checkbox-circle-line' },
          { label: 'ENM Afetivas', description: 'Expressam estados emocionais: alegria, tristeza, surpresa, raiva. São opcionais e podem coocorrer com ENM gramaticais.', icon: 'ri-heart-line' },
          { label: 'ENM Lexicais', description: 'Fazem parte da forma fonológica de sinais específicos. Ex: o sinal NADA requer movimento de boca específico.', icon: 'ri-text' },
        ],
        highlight: 'Erro comum de aprendizes: usar apenas as mãos e ignorar as ENM. Isso é equivalente a falar português sem entonação — a mensagem fica incompleta e pode ser ambígua.',
      },
      {
        id: 'enm-2',
        title: 'Marcadores de Interrogação',
        content: 'A Libras distingue dois tipos de perguntas com ENM diferentes, assim como o português distingue entonação ascendente (sim/não) de descendente (QU-). Essa distinção é obrigatória e gramatical.',
        items: [
          { label: 'Perguntas Sim/Não (Polares)', description: 'Sobrancelhas levantadas + inclinação leve da cabeça para frente. Ocorrem ao longo de toda a pergunta.', icon: 'ri-question-line' },
          { label: 'Perguntas QU- (Abertas)', description: 'Sobrancelhas franzidas + inclinação da cabeça para frente. Usadas com sinais interrogativos: QUEM, O-QUÊ, ONDE, QUANDO, COMO, POR-QUÊ.', icon: 'ri-questionnaire-line' },
        ],
        examples: [
          { libras: 'VOCÊ GOSTAR LIBRAS? [sobrancelha levantada]', portuguese: 'Você gosta de Libras?', note: 'Pergunta polar: sobrancelha levantada em toda a frase' },
          { libras: 'VOCÊ MORAR ONDE? [sobrancelha franzida]', portuguese: 'Onde você mora?', note: 'Pergunta QU-: sobrancelha franzida, ONDE no final' },
        ],
      },
      {
        id: 'enm-3',
        title: 'Negação',
        content: 'A negação na Libras pode ser expressa de múltiplas formas: pelo sinal NÃO, por movimento de cabeça negativo (da esquerda para a direita), por ENM específica, ou pela incorporação da negação no próprio sinal (negação morfológica).',
        examples: [
          { libras: 'EU NÃO GOSTAR [movimento de cabeça negativo]', portuguese: 'Eu não gosto', note: 'Negação com sinal NÃO + ENM de negação' },
          { libras: 'EU GOSTAR [movimento de cabeça negativo sem sinal NÃO]', portuguese: 'Eu não gosto', note: 'Negação apenas pela ENM — o sinal NÃO pode ser omitido' },
          { libras: 'EU NUNCA-VER', portuguese: 'Eu nunca vi', note: 'Negação incorporada morfologicamente no verbo' },
        ],
      },
    ],
    references: ['QUADROS; KARNOPP, 2004, p. 57–62', 'FERREIRA BRITO, 1995, p. 121–145'],
  },

  // ── 5. CLASSIFICADORES ────────────────────────────────────────────────────
  {
    id: 'classificadores',
    title: 'Classificadores',
    subtitle: 'Representação visual de entidades e ações',
    icon: 'ri-layout-grid-line',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    gradient: 'from-violet-500 to-purple-500',
    summary: 'Classificadores são configurações de mão que representam categorias de referentes (pessoas, veículos, objetos planos, etc.) e descrevem sua localização, movimento e interação no espaço. São fundamentais para a fluência em Libras.',
    sections: [
      {
        id: 'clas-1',
        title: 'Tipos de Classificadores',
        content: 'Supalla (1986) e Quadros & Karnopp (2004) descrevem diferentes tipos de classificadores na Libras. Cada tipo usa uma configuração de mão específica para representar uma categoria de entidade ou propriedade.',
        items: [
          { label: 'Classificadores de Entidade (CE)', description: 'Representam categorias de seres: pessoa (dedo indicador estendido), veículo (mão em "V" invertido), animal de quatro patas (mão em "B" horizontal).', icon: 'ri-user-line' },
          { label: 'Classificadores de Manejo (CM)', description: 'Representam como um objeto é segurado ou manipulado. A configuração de mão imita o ato de segurar o objeto. Ex: segurar um copo, uma caneta, um livro.', icon: 'ri-hand-heart-line' },
          { label: 'Classificadores de Superfície (CS)', description: 'Descrevem superfícies planas e suas dimensões. Ex: mão plana para representar uma mesa, parede ou chão.', icon: 'ri-layout-line' },
          { label: 'Classificadores de Extensão (CEx)', description: 'Descrevem a extensão ou forma de objetos: comprimento, largura, espessura. Ex: indicar o tamanho de um objeto com as duas mãos.', icon: 'ri-expand-left-right-line' },
          { label: 'Classificadores de Corpo (CC)', description: 'Usam partes do corpo para representar entidades ou ações. Ex: usar os dedos como "pernas" para representar uma pessoa andando.', icon: 'ri-body-scan-line' },
        ],
        highlight: 'Os classificadores não são sinais fixos — são morfemas que se combinam com movimento, localização e orientação para criar descrições ricas e detalhadas de cenas.',
      },
      {
        id: 'clas-2',
        title: 'Uso dos Classificadores no Discurso',
        content: 'Os classificadores são usados principalmente para: (1) descrever a localização de objetos no espaço, (2) narrar o movimento de entidades, (3) descrever a forma e tamanho de objetos, e (4) representar interações entre entidades. Seu uso adequado é um dos principais marcadores de fluência em Libras.',
        examples: [
          { libras: '[CE-pessoa] ANDAR DEVAGAR [CE-carro] PASSAR RÁPIDO', portuguese: 'Uma pessoa andava devagar quando um carro passou rápido', note: 'Dois classificadores de entidade descrevem a cena simultaneamente' },
          { libras: '[CM-copo] EU PEGAR MESA', portuguese: 'Eu peguei o copo da mesa', note: 'Classificador de manejo mostra como o objeto foi segurado' },
          { libras: '[CS-plano] LIVRO ESTAR [localização]', portuguese: 'O livro está sobre a mesa', note: 'Classificador de superfície + localização espacial' },
        ],
      },
    ],
    references: ['QUADROS; KARNOPP, 2004, p. 90–100', 'SUPALLA, 1986', 'FERREIRA BRITO, 1995, p. 60–75'],
  },

  // ── 6. DISCURSO ───────────────────────────────────────────────────────────
  {
    id: 'discurso',
    title: 'Discurso e Pragmática',
    subtitle: 'Coesão, coerência e uso contextual da Libras',
    icon: 'ri-chat-quote-line',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    gradient: 'from-indigo-500 to-blue-500',
    summary: 'O nível discursivo da Libras envolve como os sinais se organizam em textos coesos e coerentes. Recursos como roleshift, referência anafórica e marcadores discursivos são essenciais para a comunicação fluente.',
    sections: [
      {
        id: 'dis-1',
        title: 'Roleshift — Troca de Perspectiva',
        content: 'O roleshift (ou troca de perspectiva) é um recurso discursivo em que o sinalizante assume corporalmente a perspectiva de um personagem do discurso. Isso é marcado por: inclinação do corpo, mudança na direção do olhar e alteração das expressões faciais. É fundamental para narração de histórias e discurso reportado.',
        examples: [
          { libras: '[corpo inclinado para direita, olhar para esquerda] EU GOSTAR LIBRAS', portuguese: '"Eu gosto de Libras" (fala do personagem A)', note: 'Sinalizante assume perspectiva do personagem A' },
          { libras: '[corpo inclinado para esquerda, olhar para direita] EU TAMBÉM', portuguese: '"Eu também" (fala do personagem B)', note: 'Mudança de inclinação indica mudança de personagem' },
        ],
        highlight: 'O roleshift é um dos recursos mais sofisticados da Libras e um dos mais difíceis para aprendizes. Dominar o roleshift é sinal de fluência avançada.',
      },
      {
        id: 'dis-2',
        title: 'Referência Anafórica e Loci',
        content: 'A referência anafórica em Libras é realizada espacialmente: ao introduzir um referente no discurso, o sinalizante o associa a um ponto no espaço (locus). Para retomar esse referente, basta apontar para o mesmo locus — sem necessidade de repetir o sinal. Isso torna o discurso em Libras muito econômico e eficiente.',
        items: [
          { label: 'Estabelecimento de Loci', description: 'Ao mencionar um referente pela primeira vez, o sinalizante o "coloca" em um ponto específico do espaço de sinalização.', icon: 'ri-map-pin-2-line' },
          { label: 'Retomada por Apontamento', description: 'Para retomar o referente, basta apontar para o locus estabelecido. Equivale ao uso de pronomes no português.', icon: 'ri-cursor-line' },
          { label: 'Verbos Direcionais', description: 'Verbos que se movem entre loci retomam automaticamente os referentes estabelecidos, indicando sujeito e objeto.', icon: 'ri-arrow-right-circle-line' },
        ],
      },
    ],
    references: ['QUADROS; KARNOPP, 2004, p. 176–210', 'LIDDELL, 2003', 'FERREIRA BRITO, 1995, p. 146–170'],
  },
];
