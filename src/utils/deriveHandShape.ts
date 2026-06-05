/**
 * Extrai a Configuração de Mão (CM) mais provável a partir do
 * texto dos steps do sinal. Evita ter que atualizar os 233+ mocks manualmente.
 */
export function deriveHandShape(steps: string[]): string {
  const text = steps.join(' ').toLowerCase();

  // CMs identificadas por letra explícita no texto (ex: "formato de 'y'")
  const letterMatch = text.match(/['"'"]([a-z0-9])['"'"]\s/i);
  if (letterMatch) {
    const letter = letterMatch[1].toUpperCase();
    const supported = ['A','B','C','D','F','G','I','L','O','R','S','V','W','X','Y','5'];
    if (supported.includes(letter)) return letter;
  }

  // Y — polegar e mínimo estendidos (tipo "ILY")
  if (/polegar.*m[íi]nimo|m[íi]nimo.*polegar|ily/.test(text)) return 'Y';

  // V — dois dedos em V / paz / vitória
  if (/indicador.*m[ée]dio.*v|dois dedos.*estendidos|sinal de paz|sinal de v[íi]t/.test(text)) return 'V';

  // L — indicador + polegar em L
  if (/indicador.*polegar.*l\b|polegar.*indicador.*l\b|formato.*l\b|forma.*l\b/.test(text)) return 'L';

  // R — dedos cruzados
  if (/cruzad|indicador.*m[ée]dio.*cruzad/.test(text)) return 'R';

  // W — três dedos abertos
  if (/tr[êe]s dedos.*abertos|indicador.*m[ée]dio.*anelar.*estendid/.test(text)) return 'W';

  // F — índex + polegar tocando, demais abertos
  if (/indicador.*polegar.*tocam|polegar.*indicador.*toca/.test(text)) return 'F';

  // O — dedos formando O / oval
  if (/form.*o\b|oval|dedos.*tocam.*polegar|polegar.*ponta.*dedos/.test(text)) return 'O';

  // C — mão em C / curvada
  if (/forma.*c\b|formato.*c\b|m[ãa]o.*curv|dedos.*curv/.test(text)) return 'C';

  // D — apenas indicador estendido para cima
  if (/indicador.*estendid|apont.*indicador|dedo.*indicador.*cima/.test(text)) return 'D';

  // I — apenas mínimo estendido
  if (/m[íi]nimo.*estendid|apenas.*m[íi]nimo/.test(text)) return 'I';

  // A ou S — punho fechado
  if (/punho|m[ãa]o.*fechada|pu[gn]o/.test(text)) return 'A';

  // 5 — todos os dedos abertos e afastados
  if (/todos.*dedos.*abertos.*afastados|dedos.*afastados|cinco dedos/.test(text)) return '5';

  // B — mão aberta / palma / dedos juntos (fallback mais comum)
  if (/m[ãa]o.*aberta|palma|dedos.*juntos|b\b.*estendid/.test(text)) return 'B';

  // Default: B (mão aberta) é o padrão mais neutro
  return 'B';
}
