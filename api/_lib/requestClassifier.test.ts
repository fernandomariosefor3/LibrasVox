import { describe, it, expect } from 'vitest';
import { classifyRequest } from './requestClassifier.js';

describe('classifyRequest — linguistic', () => {
  const cases = [
    'Como é o sinal de olá?',
    'Explique o movimento de obrigado.',
    'Qual é a configuração de mão de tchau?',
    'Traduza esta frase para Libras.',
    'Crie um exercício com sinais.',
    'Fale sobre variação regional deste sinal.',
    'Explique a gramática básica da Libras',
    'Qual a diferença entre Libras e ASL?',
    'Como sinalizar os números de 1 a 10?',
    'Como funciona a expressão facial na Libras?',
    'Traduza: "Bom dia, como você está?"',
    'Como se diz "Eu te amo" em Libras?',
    'Quero praticar sinais de emoções e sentimentos',
    'Qual é a história da Libras no Brasil?',
    'O que é a identidade surda?',
  ];

  for (const text of cases) {
    it(`classifica "${text}" como linguistic`, () => {
      expect(classifyRequest(text)).toBe('linguistic');
    });
  }
});

describe('classifyRequest — navigation', () => {
  const cases = ['Onde fica o dicionário?', 'Como acesso as videoaulas?', 'Como volto para a página inicial?'];

  for (const text of cases) {
    it(`classifica "${text}" como navigation`, () => {
      expect(classifyRequest(text)).toBe('navigation');
    });
  }
});

describe('classifyRequest — social (isolada e curta)', () => {
  const cases = ['Oi', 'Olá', 'Bom dia', 'Boa tarde', 'Boa noite', 'Obrigado', 'Obrigada', 'Tchau', 'oi!', 'muito obrigado'];

  for (const text of cases) {
    it(`classifica "${text}" como social`, () => {
      expect(classifyRequest(text)).toBe('social');
    });
  }
});

describe('classifyRequest — out_of_scope', () => {
  const cases = ['Qual é a capital da França?', 'Me ajude com minha declaração de imposto de renda', ''];

  for (const text of cases) {
    it(`classifica "${text}" como out_of_scope`, () => {
      expect(classifyRequest(text)).toBe('out_of_scope');
    });
  }
});

describe('classifyRequest — prioridade linguistic sobre social', () => {
  it('"Como é o sinal de olá?" nunca é tratada como saudação social', () => {
    // contém "olá", mas não é uma mensagem curta isolada — é uma pergunta linguística
    expect(classifyRequest('Como é o sinal de olá?')).toBe('linguistic');
  });

  it('"Explique o sinal de obrigado" nunca é tratada como agradecimento social', () => {
    expect(classifyRequest('Explique o sinal de obrigado')).toBe('linguistic');
  });

  it('"Qual é o movimento de tchau?" nunca é tratada como despedida social', () => {
    expect(classifyRequest('Qual é o movimento de tchau?')).toBe('linguistic');
  });
});

describe('classifyRequest — modeId não é um parâmetro da função', () => {
  it('a assinatura de classifyRequest não aceita modeId, então nenhum modo pode reduzir a exigência de grounding', () => {
    expect(classifyRequest.length).toBe(1);
  });
});
