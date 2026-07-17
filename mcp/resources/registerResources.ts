import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ValidatedCorpusRepository } from '../repository/ValidatedCorpusRepository.ts';
import { createResourceNotFoundError } from '../errors/safeErrors.ts';

/**
 * Corpo fixo, escrito à mão — nunca lido de disco (sem fs, sem caminho
 * local exposto). Descreve o schema/política em termos genéricos, não
 * o arquivo real do repositório.
 */
const CORPUS_SCHEMA_DESCRIPTION = {
  entryStatuses: ['draft', 'under_review', 'validated', 'blocked'],
  validationCriteria: {
    validated: [
      'status === "validated"',
      'validation preenchido com validatorId, validatorName, validatorRole, validationDate',
      'sources com pelo menos um item',
      'nenhuma mídia associada com status "blocked"',
      'toda mídia associada com license preenchida',
    ],
  },
  entryFields: {
    id: 'string, identificador único do sinal',
    portugueseWord: 'string',
    gloss: 'string',
    category: 'string',
    difficulty: '"iniciante" | "intermediário" | "avançado"',
    linguisticParameters: {
      handConfiguration: 'string | null',
      location: 'string | null',
      movement: 'string | null',
      orientation: 'string | null',
      nonManualExpression: 'string | null',
    },
    context: 'string | null',
    regionalVariants: 'lista de variantes regionais, cada uma com seu próprio status',
    media: 'lista de mídias (vídeo/foto/ilustração), cada uma com origem e licença',
    sources: 'lista de fontes citáveis (acadêmica, institucional, comunitária, outra)',
    validation: 'registro de validação humana, ou null enquanto não validado',
    needsHumanReview: 'boolean — true impede fundamentação mesmo se status parecer validated',
    legacyProvenance: 'procedência técnica de conteúdo migrado de código legado, nunca fonte linguística',
  },
} as const;

const CORPUS_POLICY_DESCRIPTION = {
  rules: [
    'Somente entradas com status validated, com validação humana completa e ao menos uma fonte, fundamentam respostas.',
    'Nenhuma inteligência artificial valida sinais — validação linguística é sempre uma decisão humana.',
    'Ausência de conteúdo validado gera recusa estruturada, nunca invenção de conteúdo.',
    'Conteúdo com status blocked nunca é retornado, por nenhuma tool ou resource.',
    'Mídia (vídeo/imagem) compartilhada entre sinais diferentes exige revisão humana antes de qualquer uso.',
  ],
} as const;

export function registerResources(server: McpServer, repository: ValidatedCorpusRepository): void {
  server.registerResource(
    'corpus-schema',
    'libras://corpus/schema',
    {
      title: 'Schema do corpus LibrasVox',
      description: 'Descreve os campos, estados e critérios de validação do corpus — não expõe caminhos locais.',
      mimeType: 'application/json',
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(CORPUS_SCHEMA_DESCRIPTION, null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    'corpus-policy',
    'libras://corpus/policy',
    {
      title: 'Política de fundamentação do LibrasVox',
      description: 'Regras que governam quando conteúdo pode fundamentar uma resposta.',
      mimeType: 'application/json',
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(CORPUS_POLICY_DESCRIPTION, null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    'corpus-stats',
    'libras://corpus/stats',
    {
      title: 'Contagens agregadas do corpus',
      description: 'Totais por status, calculados dinamicamente a cada leitura.',
      mimeType: 'application/json',
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(repository.getCorpusStats(), null, 2),
        },
      ],
    }),
  );

  const signTemplate = new ResourceTemplate('libras://signs/{id}', { list: undefined });

  server.registerResource(
    'sign-by-id',
    signTemplate,
    {
      title: 'Sinal validado por ID',
      description:
        'Retorna a entrada só quando validated, com validação completa e fontes. Para qualquer outro caso, retorna erro de protocolo "Resource not found" — nunca revela draft/under_review/blocked.',
      mimeType: 'application/json',
    },
    (uri, variables) => {
      const id = Array.isArray(variables.id) ? variables.id[0] : variables.id;
      const entry = id ? repository.getValidatedById(id) : null;
      if (!entry) {
        throw createResourceNotFoundError(uri.href);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(entry, null, 2),
          },
        ],
      };
    },
  );
}
