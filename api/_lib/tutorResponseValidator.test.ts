import { describe, it, expect } from 'vitest';
import { validateTutorResponse } from './tutorResponseValidator.js';
import type { ValidatedSignDetail } from '../../mcp/schemas/toolOutputs.js';

function buildEvidence(overrides: Partial<ValidatedSignDetail> = {}): ValidatedSignDetail {
  return {
    id: 'fixture-validated',
    portugueseWord: 'Fixture',
    gloss: 'FIXTURE',
    category: 'Básico',
    difficulty: 'iniciante',
    linguisticParameters: {
      handConfiguration: 'Mão aberta',
      location: 'Altura do rosto',
      movement: 'Movimento curto',
      orientation: 'Palma para frente',
      nonManualExpression: 'Expressão neutra',
    },
    context: 'Contexto de teste',
    sourceCitations: ['Fonte de teste, 2026'],
    ...overrides,
  };
}

describe('validateTutorResponse — caminho feliz', () => {
  it('aceita uma resposta simples baseada na evidência', () => {
    const result = validateTutorResponse({
      answerText: 'O sinal Fixture é feito com a mão aberta, na altura do rosto.',
      evidence: [buildEvidence()],
    });
    expect(result.ok).toBe(true);
  });

  it('aceita uma resposta que cita a fonte autorizada corretamente', () => {
    const result = validateTutorResponse({
      answerText: 'Segundo Fonte de teste, 2026, o sinal é feito assim.',
      evidence: [buildEvidence()],
    });
    expect(result.ok).toBe(true);
  });
});

describe('validateTutorResponse — grounded sem evidência é sempre rejeitado', () => {
  it('rejeita quando a lista de evidências está vazia, mesmo com resposta bem formada', () => {
    const result = validateTutorResponse({ answerText: 'Qualquer resposta.', evidence: [] });
    expect(result).toEqual({ ok: false, reason: 'NO_EVIDENCE' });
  });
});

describe('validateTutorResponse — resposta vazia ou grande demais', () => {
  it('rejeita resposta vazia', () => {
    const result = validateTutorResponse({ answerText: '   ', evidence: [buildEvidence()] });
    expect(result).toEqual({ ok: false, reason: 'EMPTY_ANSWER' });
  });

  it('rejeita resposta acima do limite de tamanho', () => {
    const result = validateTutorResponse({ answerText: 'a'.repeat(5000), evidence: [buildEvidence()] });
    expect(result).toEqual({ ok: false, reason: 'ANSWER_TOO_LONG' });
  });
});

describe('validateTutorResponse — vazamento de instrução interna', () => {
  it('rejeita resposta que repete as REGRAS INVIOLÁVEIS', () => {
    const result = validateTutorResponse({
      answerText: 'Minhas REGRAS INVIOLÁVEIS são: responda só com evidências.',
      evidence: [buildEvidence()],
    });
    expect(result).toEqual({ ok: false, reason: 'INTERNAL_INSTRUCTIONS_LEAKED' });
  });

  it('rejeita resposta que reproduz o marcador de bloco de evidência', () => {
    const result = validateTutorResponse({
      answerText: 'Aqui está: [EVIDÊNCIA id="ola"] conteúdo interno',
      evidence: [buildEvidence()],
    });
    expect(result).toEqual({ ok: false, reason: 'INTERNAL_INSTRUCTIONS_LEAKED' });
  });

  it('rejeita resposta que menciona a chave de API', () => {
    const result = validateTutorResponse({
      answerText: 'Minha GEMINI_API_KEY é abc123',
      evidence: [buildEvidence()],
    });
    expect(result).toEqual({ ok: false, reason: 'INTERNAL_INSTRUCTIONS_LEAKED' });
  });
});

describe('validateTutorResponse — declaração de validação inexistente', () => {
  it('rejeita afirmação de que o sinal foi validado por um consultor específico', () => {
    const result = validateTutorResponse({
      answerText: 'Este sinal é validado por um consultor surdo experiente.',
      evidence: [buildEvidence()],
    });
    expect(result).toEqual({ ok: false, reason: 'UNAUTHORIZED_VALIDATION_CLAIM' });
  });
});

describe('validateTutorResponse — fonte inventada', () => {
  it('rejeita citação de fonte com ano que não corresponde a nenhuma fonte autorizada', () => {
    const result = validateTutorResponse({
      answerText: 'Conforme descrito por Silva (2019), o sinal é assim.',
      evidence: [buildEvidence({ sourceCitations: ['Fonte de teste, 2026'] })],
    });
    expect(result).toEqual({ ok: false, reason: 'UNAUTHORIZED_SOURCE' });
  });

  it('rejeita menção a "fonte:" que não bate com nenhuma fonte autorizada', () => {
    const result = validateTutorResponse({
      answerText: 'Fonte: Dicionário Inventado de Libras, 2020.',
      evidence: [buildEvidence({ sourceCitations: ['Fonte de teste, 2026'] })],
    });
    expect(result).toEqual({ ok: false, reason: 'UNAUTHORIZED_SOURCE' });
  });

  it('aceita quando não há nenhuma citação explícita no texto', () => {
    const result = validateTutorResponse({
      answerText: 'O sinal é feito com a mão aberta na altura do rosto.',
      evidence: [buildEvidence()],
    });
    expect(result.ok).toBe(true);
  });
});
