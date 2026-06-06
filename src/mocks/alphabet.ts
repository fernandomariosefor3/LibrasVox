export interface HandConfig {
  thumb: number;     // 0 = fechado, 1 = estendido
  index: number;
  middle: number;
  ring: number;
  pinky: number;
  thumbSide: boolean; // polegar apontando para o lado
  spread: number;    // 0 = dedos juntos, 1 = abertos
}

export interface LetterData {
  letter: string;
  description: string;
  steps: string[];
  tip: string;
  handConfig: HandConfig;
  isMovement?: boolean; // letras com movimento (J, Z)
}

export const alphabetData: LetterData[] = [
  {
    letter: 'A',
    description: 'Punho fechado com o polegar repousando ao lado do indicador.',
    steps: ['Feche todos os dedos formando um punho firme', 'Posicione o polegar ao lado do dedo indicador (não sobre)', 'Palma voltada para frente'],
    tip: 'O "A" em Libras é idêntico ao ASL. É o sinal de um punho com polegar ao lado.',
    handConfig: { thumb: 0.65, index: 0, middle: 0, ring: 0, pinky: 0, thumbSide: false, spread: 0 },
  },
  {
    letter: 'B',
    description: 'Todos os quatro dedos estendidos e juntos, polegar dobrado sobre a palma.',
    steps: ['Estenda o indicador, médio, anelar e mínimo para cima', 'Mantenha os 4 dedos juntos', 'Dobre o polegar sobre a palma', 'Palma voltada para frente'],
    tip: 'Pense no "B" como uma mão aberta com o polegar escondido.',
    handConfig: { thumb: 0.1, index: 1, middle: 1, ring: 1, pinky: 1, thumbSide: false, spread: 0.15 },
  },
  {
    letter: 'C',
    description: 'Todos os dedos curvados formando a letra C, como segurar uma maçã.',
    steps: ['Curve todos os dedos como se fosse segurar uma bola pequena', 'O polegar também se curva em oposição', 'Deixe um espaço oval entre os dedos e o polegar', 'Palma voltada para o lado'],
    tip: 'Imagine segurar uma maçã ou uma lata de refrigerante.',
    handConfig: { thumb: 0.75, index: 0.65, middle: 0.6, ring: 0.6, pinky: 0.55, thumbSide: true, spread: 0.25 },
  },
  {
    letter: 'D',
    description: 'Indicador estendido para cima, outros dedos formam um círculo com o polegar.',
    steps: ['Levante apenas o dedo indicador bem estendido', 'Curve o médio, anelar e mínimo até tocarem o polegar', 'Forme um círculo com polegar + 3 dedos', 'Indicador aponta para cima'],
    tip: 'O indicador reto + círculo abaixo lembra a letra D maiúscula.',
    handConfig: { thumb: 0.8, index: 1, middle: 0.2, ring: 0.2, pinky: 0.2, thumbSide: false, spread: 0 },
  },
  {
    letter: 'E',
    description: 'Todos os dedos dobrados, pontas tocando levemente a base.',
    steps: ['Dobre todos os dedos para baixo, pontas curvadas', 'O polegar se encosta levemente nos dedos dobrados', 'Não é um punho fechado, é um gancho suave', 'Palma para frente'],
    tip: 'Diferente do punho "A", os dedos no "E" ficam levemente curvados em gancho, não totalmente fechados.',
    handConfig: { thumb: 0.15, index: 0.18, middle: 0.18, ring: 0.18, pinky: 0.18, thumbSide: false, spread: 0 },
  },
  {
    letter: 'F',
    description: 'Polegar toca o indicador formando um círculo; médio, anelar e mínimo estendidos.',
    steps: ['Una a ponta do polegar com a ponta do indicador (formando O)', 'Estenda o médio, anelar e mínimo para cima', 'Mantenha os 3 dedos estendidos e juntos', 'Palma para frente'],
    tip: 'É como o "OK" mas com 3 dedos retos, não inclinados.',
    handConfig: { thumb: 0.8, index: 0.15, middle: 1, ring: 1, pinky: 1, thumbSide: false, spread: 0.1 },
  },
  {
    letter: 'G',
    description: 'Indicador e polegar apontando para o lado, outros dedos fechados.',
    steps: ['Feche o médio, anelar e mínimo em punho', 'Estenda o indicador horizontalmente para o lado', 'Estenda o polegar para o mesmo lado do indicador', 'Como se apontasse para a lateral'],
    tip: 'Imagine fazer uma pistola com a mão apontando para o lado.',
    handConfig: { thumb: 1, index: 0.7, middle: 0, ring: 0, pinky: 0, thumbSide: true, spread: 0 },
  },
  {
    letter: 'H',
    description: 'Indicador e médio estendidos juntos apontando para o lado.',
    steps: ['Feche anelar e mínimo em punho', 'Estenda o indicador e médio juntos horizontalmente para o lado', 'Polegar fechado', 'Os dois dedos ficam paralelos'],
    tip: 'Como o "G" mas com dois dedos ao invés de um.',
    handConfig: { thumb: 0.15, index: 0.8, middle: 0.8, ring: 0, pinky: 0, thumbSide: false, spread: 0 },
  },
  {
    letter: 'I',
    description: 'Somente o mínimo (dedinho) estendido para cima, outros fechados.',
    steps: ['Feche todos os dedos em punho', 'Levante apenas o dedo mínimo (dedinho) para cima', 'O polegar pode descansar sobre os dedos fechados', 'Mantenha o restante da mão firme'],
    tip: 'Apenas o dedinho levantado — muito fácil de lembrar!',
    handConfig: { thumb: 0.2, index: 0, middle: 0, ring: 0, pinky: 1, thumbSide: false, spread: 0 },
  },
  {
    letter: 'J',
    description: 'Começa como I (mínimo levantado) e desenha um J no ar.',
    steps: ['Forme o sinal "I" com o mínimo levantado', 'Mova o mínimo desenhando um J no ar', 'Movimento de cima para baixo com curva final', 'É o único sinal que requer movimento de traçado'],
    tip: 'J é como I em movimento — trace a letra J no ar com o dedinho.',
    handConfig: { thumb: 0.2, index: 0, middle: 0, ring: 0, pinky: 1, thumbSide: false, spread: 0 },
    isMovement: true,
  },
  {
    letter: 'K',
    description: 'Indicador e médio estendidos com o polegar entre eles apontando para cima.',
    steps: ['Estenda o indicador e médio para cima em V', 'Posicione o polegar entre os dois dedos', 'Feche anelar e mínimo', 'Palma voltada para frente'],
    tip: 'Parece um V com o polegar entre os dedos.',
    handConfig: { thumb: 0.9, index: 1, middle: 1, ring: 0, pinky: 0, thumbSide: true, spread: 0.5 },
  },
  {
    letter: 'L',
    description: 'Indicador aponta para cima e polegar aponta para o lado, formando um L.',
    steps: ['Feche médio, anelar e mínimo', 'Estenda o indicador para cima', 'Estenda o polegar para o lado (horizontal)', 'Os dois formam um ângulo de 90° — letra L'],
    tip: 'Essa é intuitiva! A forma da mão literalmente faz a letra L.',
    handConfig: { thumb: 1, index: 1, middle: 0, ring: 0, pinky: 0, thumbSide: true, spread: 0 },
  },
  {
    letter: 'M',
    description: 'Três dedos (indicador, médio, anelar) dobrados sobre o polegar.',
    steps: ['Estenda o polegar levemente para fora', 'Dobre o indicador, médio e anelar sobre o polegar', 'Mínimo fechado ao lado', 'Vista de frente parece 3 "montes" — letra M'],
    tip: 'M = 3 dedos dobrados. Lembre: M tem 3 "picos".',
    handConfig: { thumb: 0.5, index: 0.12, middle: 0.12, ring: 0.12, pinky: 0, thumbSide: false, spread: 0 },
  },
  {
    letter: 'N',
    description: 'Dois dedos (indicador e médio) dobrados sobre o polegar.',
    steps: ['Estenda o polegar levemente', 'Dobre o indicador e médio sobre o polegar', 'Anelar e mínimo fechados', 'Vista de frente parece 2 "montes" — letra N'],
    tip: 'N = 2 dedos dobrados. M e N são parecidos mas M tem 3 dedos, N tem 2.',
    handConfig: { thumb: 0.5, index: 0.12, middle: 0.12, ring: 0, pinky: 0, thumbSide: false, spread: 0 },
  },
  {
    letter: 'O',
    description: 'Todos os dedos formam um círculo com o polegar, criando a forma de O.',
    steps: ['Una levemente todos os dedos em arco', 'Curve o polegar para encontrar as pontas dos dedos', 'Forme um círculo/oval com todos os dedos', 'Palma voltada para frente'],
    tip: 'Fácil de lembrar: a forma é literalmente um O!',
    handConfig: { thumb: 0.7, index: 0.45, middle: 0.45, ring: 0.45, pinky: 0.45, thumbSide: false, spread: 0.1 },
  },
  {
    letter: 'P',
    description: 'Como K mas apontando para baixo — indicador e médio para baixo, polegar entre eles.',
    steps: ['Forme a posição K', 'Incline toda a mão para baixo (dedos apontando para o chão)', 'Indicador e médio paralelos para baixo', 'Polegar entre eles'],
    tip: 'P = K inclinado para baixo. Uma boa memorização é: P é K "caído".',
    handConfig: { thumb: 0.85, index: 0.9, middle: 0.9, ring: 0, pinky: 0, thumbSide: true, spread: 0.4 },
  },
  {
    letter: 'Q',
    description: 'Como G mas apontando para baixo — indicador e polegar apontando para o chão.',
    steps: ['Forme a posição G', 'Incline a mão para baixo', 'Indicador e polegar apontam para o chão', 'Os outros dedos permanecem fechados'],
    tip: 'Q = G inclinado para baixo.',
    handConfig: { thumb: 0.85, index: 0.75, middle: 0, ring: 0, pinky: 0, thumbSide: true, spread: 0 },
  },
  {
    letter: 'R',
    description: 'Indicador e médio estendidos e cruzados um sobre o outro.',
    steps: ['Estenda indicador e médio para cima', 'Cruze o médio sobre o indicador', 'Feche anelar e mínimo', 'Polegar fechado, palma para frente'],
    tip: 'R de "Razão" — cruze os dedos para boa sorte!',
    handConfig: { thumb: 0.2, index: 1, middle: 1, ring: 0, pinky: 0, thumbSide: false, spread: -0.2 },
  },
  {
    letter: 'S',
    description: 'Punho fechado com o polegar sobre os dedos.',
    steps: ['Feche todos os dedos em punho firme', 'Posicione o polegar sobre os dedos fechados (sobre indicador e médio)', 'Diferente do A onde o polegar fica ao lado', 'Palma para frente'],
    tip: 'S parece com o A, mas o polegar fica SOBRE os dedos, não ao lado.',
    handConfig: { thumb: 0.45, index: 0, middle: 0, ring: 0, pinky: 0, thumbSide: false, spread: 0 },
  },
  {
    letter: 'T',
    description: 'Polegar entre o indicador e o médio, indicador curvado sobre o polegar.',
    steps: ['Feche médio, anelar e mínimo', 'Curve o indicador para baixo', 'Posicione o polegar entre indicador e médio', 'Palma para frente'],
    tip: 'T tem o polegar "escondido" entre os dedos — bastante único.',
    handConfig: { thumb: 0.6, index: 0.22, middle: 0.1, ring: 0, pinky: 0, thumbSide: false, spread: 0 },
  },
  {
    letter: 'U',
    description: 'Indicador e médio estendidos juntos para cima, outros fechados.',
    steps: ['Feche anelar e mínimo', 'Estenda indicador e médio juntos para cima', 'Mantenha os dois dedos colados', 'Polegar dobrado, palma para frente'],
    tip: 'U é como dois dedos colados apontando para o céu.',
    handConfig: { thumb: 0.2, index: 1, middle: 1, ring: 0, pinky: 0, thumbSide: false, spread: 0 },
  },
  {
    letter: 'V',
    description: 'Indicador e médio estendidos e separados formando um V.',
    steps: ['Feche anelar e mínimo', 'Estenda indicador e médio para cima', 'Separe-os para formar um V', 'Polegar fechado, palma para frente'],
    tip: 'V de Vitória — igual ao sinal de paz universal!',
    handConfig: { thumb: 0.2, index: 1, middle: 1, ring: 0, pinky: 0, thumbSide: false, spread: 0.9 },
  },
  {
    letter: 'W',
    description: 'Indicador, médio e anelar estendidos e separados formando um W.',
    steps: ['Feche o mínimo', 'Estenda indicador, médio e anelar para cima', 'Separe-os levemente formando um W', 'Polegar fechado ou levemente aberto'],
    tip: 'W = três dedos abertos. W tem três picos, três dedos!',
    handConfig: { thumb: 0.25, index: 1, middle: 1, ring: 1, pinky: 0, thumbSide: false, spread: 0.8 },
  },
  {
    letter: 'X',
    description: 'Indicador curvado em forma de gancho, outros dedos fechados.',
    steps: ['Feche todos em punho', 'Levante o indicador', 'Curve-o para baixo formando um gancho/X', 'Polegar pode repousar ao lado'],
    tip: 'X é fácil — só o indicador curvado em gancho!',
    handConfig: { thumb: 0.3, index: 0.45, middle: 0, ring: 0, pinky: 0, thumbSide: false, spread: 0 },
  },
  {
    letter: 'Y',
    description: 'Polegar e mínimo estendidos para os lados, outros dedos fechados.',
    steps: ['Feche indicador, médio e anelar', 'Estenda o polegar para o lado', 'Estenda o mínimo para o outro lado', 'Forma o sinal "Hang loose" / "I love you"'],
    tip: 'Y é o famoso "Hang loose" do surf! Polegar e mínimo abertos.',
    handConfig: { thumb: 1, index: 0, middle: 0, ring: 0, pinky: 1, thumbSide: true, spread: 0 },
  },
  {
    letter: 'Z',
    description: 'Indicador estendido traçando a letra Z no ar.',
    steps: ['Feche todos exceto o indicador', 'Estenda o indicador para frente', 'Trace um Z no ar: linha horizontal, diagonal, linha horizontal', 'Movimento é essencial para este sinal'],
    tip: 'Z é como I e J — trace com o indicador a letra Z no ar.',
    handConfig: { thumb: 0.25, index: 1, middle: 0, ring: 0, pinky: 0, thumbSide: false, spread: 0 },
    isMovement: true,
  },
];

export const getLetterData = (letter: string): LetterData | undefined =>
  alphabetData.find((l) => l.letter === letter);
