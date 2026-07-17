import { z } from 'zod';
import { difficultyLevelSchema } from './toolInputs.ts';

/**
 * Shapes de output das tools (ZodRawShape) e o envelope de resposta
 * compartilhado. Nenhum campo aqui carrega identidade de validador,
 * caminho local ou qualquer dado fora do que o cliente precisa para
 * citar evidência.
 */

export const refusalSchema = z.object({
  required: z.boolean(),
  code: z.string().nullable(),
  message: z.string().nullable(),
});

export const linguisticParametersSchema = z.object({
  handConfiguration: z.string().nullable(),
  location: z.string().nullable(),
  movement: z.string().nullable(),
  orientation: z.string().nullable(),
  nonManualExpression: z.string().nullable(),
});

export const validatedSignSummarySchema = z.object({
  id: z.string(),
  portugueseWord: z.string(),
  gloss: z.string(),
  category: z.string(),
  difficulty: difficultyLevelSchema,
});

export const validatedSignDetailSchema = validatedSignSummarySchema.extend({
  linguisticParameters: linguisticParametersSchema,
  context: z.string().nullable(),
  sourceCitations: z.array(z.string()),
});

export type ValidatedSignSummary = z.infer<typeof validatedSignSummarySchema>;
export type ValidatedSignDetail = z.infer<typeof validatedSignDetailSchema>;

export const searchValidatedSignsOutputShape = {
  ok: z.boolean(),
  data: z.object({ matches: z.array(validatedSignSummarySchema) }),
  evidenceIds: z.array(z.string()),
  corpusVersion: z.string(),
  refusal: refusalSchema,
};

export const getValidatedSignOutputShape = {
  ok: z.boolean(),
  data: z.object({ entry: validatedSignDetailSchema.nullable() }),
  evidenceIds: z.array(z.string()),
  corpusVersion: z.string(),
  refusal: refusalSchema,
};

export const listValidatedCategoriesOutputShape = {
  ok: z.boolean(),
  data: z.object({ categories: z.array(z.string()) }),
  evidenceIds: z.array(z.string()),
  corpusVersion: z.string(),
  refusal: refusalSchema,
};

export const corpusStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  draft: z.number().int().nonnegative(),
  underReview: z.number().int().nonnegative(),
  validated: z.number().int().nonnegative(),
  blocked: z.number().int().nonnegative(),
  eligibleForGrounding: z.number().int().nonnegative(),
  needsHumanReview: z.number().int().nonnegative(),
});

export type CorpusStats = z.infer<typeof corpusStatsSchema>;

export const getCorpusStatsOutputShape = {
  ok: z.boolean(),
  data: corpusStatsSchema,
  evidenceIds: z.array(z.string()),
  corpusVersion: z.string(),
  refusal: refusalSchema,
};

export const reasonCodeSchema = z.enum([
  'VALIDATED',
  'NOT_FOUND',
  'STATUS_NOT_VALIDATED',
  'HUMAN_REVIEW_REQUIRED',
  'MISSING_SOURCES',
  'MISSING_HUMAN_VALIDATION',
  'BLOCKED',
  'MEDIA_NOT_ELIGIBLE',
]);

export type ReasonCode = z.infer<typeof reasonCodeSchema>;

export const eligibilityResultSchema = z.object({
  id: z.string(),
  eligible: z.boolean(),
  reasonCode: reasonCodeSchema,
});

export type EligibilityResult = z.infer<typeof eligibilityResultSchema>;

export const checkGroundingEligibilityOutputShape = {
  ok: z.boolean(),
  data: z.object({ results: z.array(eligibilityResultSchema) }),
  evidenceIds: z.array(z.string()),
  corpusVersion: z.string(),
  refusal: refusalSchema,
};
