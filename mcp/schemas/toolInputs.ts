import { z } from 'zod';

/**
 * Shapes de input das tools (ZodRawShape — objeto de campos, não
 * z.object() embrulhado, conforme a API de registerTool do SDK 1.x).
 * Todo limite de tamanho existe para impedir consultas excessivas e
 * negar interpretação de texto do usuário como instrução — a query é
 * sempre comparada como string literal, nunca avaliada.
 */

const normalizedQuery = z
  .string()
  .trim()
  .min(1, 'query é obrigatória')
  .max(100, 'query excede o limite de 100 caracteres')
  .transform((value) => value.replace(/\s+/g, ' '));

const boundedId = z.string().trim().min(1).max(100);

export const difficultyLevelSchema = z.enum(['iniciante', 'intermediário', 'avançado']);

export const searchValidatedSignsInputShape = {
  query: normalizedQuery,
  category: z.string().trim().min(1).max(60).optional(),
  difficulty: difficultyLevelSchema.optional(),
  region: z.string().trim().min(1).max(10).optional(),
  limit: z.number().int().min(1).max(20).optional(),
};

export const getValidatedSignInputShape = {
  id: boundedId,
};

export const listValidatedCategoriesInputShape = {};

export const getCorpusStatsInputShape = {};

export const checkGroundingEligibilityInputShape = {
  entryIds: z.array(boundedId).min(1).max(20),
};
