import { saudacoes, familia, numeros, cores, pronomes } from './part1';
import { alimentos, emocoes, verbos, adjetivos, questoes } from './part2';
import { lugares, animais, natureza } from './part3';
import {
  transporte,
  profissoes,
  corpo,
  tempo,
  roupas,
  objetos,
  materiais,
  disciplinas,
  meses,
  semana,
  varios,
} from './part4';
import { Sign } from './types';

export { SIGN_CATEGORIES } from './categories';

export const allSigns: Sign[] = [
  ...saudacoes,
  ...familia,
  ...numeros,
  ...cores,
  ...pronomes,
  ...alimentos,
  ...emocoes,
  ...verbos,
  ...adjetivos,
  ...questoes,
  ...lugares,
  ...animais,
  ...natureza,
  ...transporte,
  ...profissoes,
  ...corpo,
  ...tempo,
  ...roupas,
  ...objetos,
  ...materiais,
  ...disciplinas,
  ...meses,
  ...semana,
  ...varios,
];

export const signs = allSigns;

export function getSignsByCategory(category: string): Sign[] {
  if (category === 'Todos') return allSigns;
  return allSigns.filter((s) => s.category === category);
}

export function searchSigns(query: string): Sign[] {
  const q = query.toLowerCase().trim();
  if (!q) return allSigns;
  return allSigns.filter(
    (s) =>
      s.word.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
  );
}

export {
  saudacoes,
  familia,
  numeros,
  cores,
  pronomes,
  alimentos,
  emocoes,
  verbos,
  adjetivos,
  questoes,
  lugares,
  animais,
  natureza,
  transporte,
  profissoes,
  corpo,
  tempo,
  roupas,
  objetos,
  materiais,
  disciplinas,
  meses,
  semana,
  varios,
};