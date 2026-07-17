import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ValidatedCorpusRepository } from '../repository/ValidatedCorpusRepository.ts';
import { checkGroundingEligibility } from '../services/GroundingEligibilityService.ts';
import type { KnowledgeCorpusEntry } from '../../knowledge/schema/types.ts';
import {
  searchValidatedSignsInputShape,
  getValidatedSignInputShape,
  listValidatedCategoriesInputShape,
  getCorpusStatsInputShape,
  checkGroundingEligibilityInputShape,
} from '../schemas/toolInputs.ts';
import {
  searchValidatedSignsOutputShape,
  getValidatedSignOutputShape,
  listValidatedCategoriesOutputShape,
  getCorpusStatsOutputShape,
  checkGroundingEligibilityOutputShape,
} from '../schemas/toolOutputs.ts';
import { GENERIC_NO_VALIDATED_CONTENT_MESSAGE, NO_VALIDATED_CONTENT_CODE } from '../errors/safeErrors.ts';

const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

interface Refusal {
  required: boolean;
  code: string | null;
  message: string | null;
}

const NO_REFUSAL: Refusal = { required: false, code: null, message: null };

function noValidatedContentRefusal(): Refusal {
  return { required: true, code: NO_VALIDATED_CONTENT_CODE, message: GENERIC_NO_VALIDATED_CONTENT_MESSAGE };
}

function asToolResult(structuredContent: Record<string, unknown>) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(structuredContent) }],
    structuredContent,
  };
}

export function registerTools(
  server: McpServer,
  repository: ValidatedCorpusRepository,
  getAllEntries: () => readonly KnowledgeCorpusEntry[],
): void {
  server.registerTool(
    'search_validated_signs',
    {
      title: 'Buscar sinais validados',
      description: 'Busca sinais com status validated e elegíveis para fundamentação. Nunca retorna draft, under_review ou blocked.',
      inputSchema: searchValidatedSignsInputShape,
      outputSchema: searchValidatedSignsOutputShape,
      annotations: READ_ONLY_ANNOTATIONS,
    },
    (args) => {
      const matches = repository.searchValidated(args);
      const evidenceIds = matches.map((match) => match.id);
      return asToolResult({
        ok: true,
        data: { matches },
        evidenceIds,
        corpusVersion: repository.getCorpusVersion(),
        refusal: matches.length > 0 ? NO_REFUSAL : noValidatedContentRefusal(),
      });
    },
  );

  server.registerTool(
    'get_validated_sign',
    {
      title: 'Obter sinal validado',
      description: 'Retorna a entrada completa só se estiver validated e elegível. Caso contrário, recusa estruturada — nunca erro interno.',
      inputSchema: getValidatedSignInputShape,
      outputSchema: getValidatedSignOutputShape,
      annotations: READ_ONLY_ANNOTATIONS,
    },
    (args) => {
      const entry = repository.getValidatedById(args.id);
      return asToolResult({
        ok: true,
        data: { entry },
        evidenceIds: entry ? [entry.id] : [],
        corpusVersion: repository.getCorpusVersion(),
        refusal: entry ? NO_REFUSAL : noValidatedContentRefusal(),
      });
    },
  );

  server.registerTool(
    'list_validated_categories',
    {
      title: 'Listar categorias validadas',
      description: 'Retorna só categorias com ao menos uma entrada validated e elegível.',
      inputSchema: listValidatedCategoriesInputShape,
      outputSchema: listValidatedCategoriesOutputShape,
      annotations: READ_ONLY_ANNOTATIONS,
    },
    () => {
      const categories = repository.listValidatedCategories();
      return asToolResult({
        ok: true,
        data: { categories },
        evidenceIds: [],
        corpusVersion: repository.getCorpusVersion(),
        refusal: categories.length > 0 ? NO_REFUSAL : noValidatedContentRefusal(),
      });
    },
  );

  server.registerTool(
    'get_corpus_stats',
    {
      title: 'Estatísticas do corpus',
      description: 'Contagens agregadas por status, calculadas dinamicamente. Não é uma resposta linguística, então nunca é uma recusa.',
      inputSchema: getCorpusStatsInputShape,
      outputSchema: getCorpusStatsOutputShape,
      annotations: READ_ONLY_ANNOTATIONS,
    },
    () =>
      asToolResult({
        ok: true,
        data: repository.getCorpusStats(),
        evidenceIds: [],
        corpusVersion: repository.getCorpusVersion(),
        refusal: NO_REFUSAL,
      }),
  );

  server.registerTool(
    'check_grounding_eligibility',
    {
      title: 'Checar elegibilidade de fundamentação',
      description: 'Para cada ID, informa se é elegível e por quê (reasonCode seguro, sem parâmetros linguísticos). Não é uma resposta linguística, então nunca é uma recusa.',
      inputSchema: checkGroundingEligibilityInputShape,
      outputSchema: checkGroundingEligibilityOutputShape,
      annotations: READ_ONLY_ANNOTATIONS,
    },
    (args) => {
      const results = checkGroundingEligibility(args.entryIds, getAllEntries());
      const evidenceIds = results.filter((result) => result.eligible).map((result) => result.id);
      return asToolResult({
        ok: true,
        data: { results },
        evidenceIds,
        corpusVersion: repository.getCorpusVersion(),
        refusal: NO_REFUSAL,
      });
    },
  );
}
