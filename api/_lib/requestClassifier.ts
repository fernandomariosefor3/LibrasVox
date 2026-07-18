import type { AssistantCategory } from './contracts.js';

/**
 * Classificação 100% determinística — nenhuma chamada a IA decide a
 * categoria. Prioridade fixa: linguistic > navigation > social >
 * out_of_scope. modeId nunca entra nesta função: o modo de UI não pode
 * reduzir a exigência de fundamentação.
 */

const DIACRITIC_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

function normalize(text: string): string {
  return text.normalize('NFD').replace(DIACRITIC_MARKS, '').toLowerCase().trim();
}

const LINGUISTIC_KEYWORDS = [
  'sinal',
  'sinais',
  'libras',
  'glosa',
  'configuracao de mao',
  'ponto de articulacao',
  'orientacao da palma',
  'expressao facial',
  'traduza',
  'traducao',
  'traduzir',
  'gramatica',
  'exercicio',
  'exercicios',
  'pratique',
  'praticar',
  'quiz',
  'variante',
  'variacao regional',
  'cultura surda',
  'datilologia',
  'alfabeto manual',
  'classificador',
  'lingua de sinais',
  'movimento',
  'surdo',
  'surda',
  'comunidade surda',
  'como se diz',
  'como sinalizar',
  'em libras',
];

const NAVIGATION_KEYWORDS = [
  'dicionario',
  'glossario',
  'videoaula',
  'video aula',
  'pagina inicial',
  'atlas',
  'flashcard',
  'meu progresso',
  'como acesso',
  'como volto',
  'como chego',
  'onde fica o',
  'onde ficam as',
];

const SOCIAL_WORD_ALLOWLIST = new Set([
  'oi',
  'ola',
  'bom',
  'dia',
  'boa',
  'tarde',
  'noite',
  'obrigado',
  'obrigada',
  'tchau',
  'valeu',
  'muito',
  'obg',
  'ok',
  'certo',
  'entendi',
]);
const SOCIAL_MAX_WORDS = 4;

/** Só classifica como social se a mensagem inteira for uma saudação curta e isolada. */
function isIsolatedSocialMessage(normalized: string): boolean {
  const words = normalized
    .split(/\s+/)
    .map((word) => word.replace(/[!?.,]/g, ''))
    .filter(Boolean);
  if (words.length === 0 || words.length > SOCIAL_MAX_WORDS) return false;
  return words.every((word) => SOCIAL_WORD_ALLOWLIST.has(word));
}

export function classifyRequest(text: string): AssistantCategory {
  const normalized = normalize(text);
  if (normalized.length === 0) return 'out_of_scope';

  if (LINGUISTIC_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return 'linguistic';
  }
  if (NAVIGATION_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return 'navigation';
  }
  if (isIsolatedSocialMessage(normalized)) {
    return 'social';
  }
  return 'out_of_scope';
}
