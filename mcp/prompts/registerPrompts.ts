import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ValidatedCorpusRepository } from '../repository/ValidatedCorpusRepository.ts';
import { SIGN_SPECIFIC_REFUSAL_MESSAGE } from '../errors/safeErrors.ts';

function textMessage(role: 'user' | 'assistant', text: string) {
  return { role, content: { type: 'text' as const, text } };
}

export function registerPrompts(server: McpServer, repository: ValidatedCorpusRepository): void {
  server.registerPrompt(
    'explain_validated_sign',
    {
      title: 'Explicar sinal validado',
      description: 'Orienta o cliente a pesquisar conteúdo validado, citar IDs como evidência e recusar quando não houver conteúdo.',
      argsSchema: { term: z.string().trim().min(1).max(100) },
    },
    (args) => {
      const matches = repository.searchValidated({ query: args.term, limit: 5 });
      const instructions =
        matches.length > 0
          ? `Use search_validated_signs/get_validated_sign para "${args.term}". ` +
            'Responda usando somente os campos retornados por essas tools. ' +
            'Cite explicitamente os IDs de evidência retornados em evidenceIds. ' +
            'Nunca acrescente informação linguística que não veio da tool.'
          : `Não há conteúdo validado para "${args.term}" no momento. ${SIGN_SPECIFIC_REFUSAL_MESSAGE}`;
      return {
        description: 'Instrução de fundamentação para explicar um sinal',
        messages: [textMessage('user', instructions)],
      };
    },
  );

  server.registerPrompt(
    'create_grounded_practice',
    {
      title: 'Criar prática fundamentada',
      description: 'Monta uma estrutura de exercício somente quando existem entradas validated disponíveis. Nunca gera parâmetros linguísticos por conta própria.',
      argsSchema: {
        category: z.string().trim().min(1).max(60).optional(),
        difficulty: z.string().trim().min(1).max(20).optional(),
      },
    },
    (args) => {
      const matches = repository.searchValidated({
        query: '',
        category: args.category,
        difficulty: args.difficulty,
        limit: 5,
      });

      if (matches.length === 0) {
        return {
          description: 'Recusa — sem conteúdo validado suficiente para montar uma prática',
          messages: [textMessage('assistant', SIGN_SPECIFIC_REFUSAL_MESSAGE)],
        };
      }

      const structure = {
        exerciseType: 'reconhecimento_guiado',
        signs: matches.map((match) => ({ id: match.id, portugueseWord: match.portugueseWord })),
        instructions: 'Use somente os sinais listados acima — todos já validated e elegíveis.',
      };

      return {
        description: 'Estrutura de prática fundamentada em conteúdo validated',
        messages: [textMessage('assistant', JSON.stringify(structure))],
      };
    },
  );

  server.registerPrompt(
    'safe_tutor_refusal',
    {
      title: 'Recusa segura do tutor',
      description: 'Template canônico de recusa quando não há conteúdo validado suficiente.',
      argsSchema: { signTerm: z.string().trim().min(1).max(100).optional() },
    },
    () => ({
      description: 'Mensagem de recusa canônica',
      messages: [textMessage('assistant', SIGN_SPECIFIC_REFUSAL_MESSAGE)],
    }),
  );
}
