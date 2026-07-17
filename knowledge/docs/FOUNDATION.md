# LibrasVox Intelligence Stack — Fase 1 (Fundação)

Este documento descreve o que existe nesta fase e, com igual importância,
o que **não** existe ainda.

## O que existe

- `knowledge/schema/types.ts` — schema TypeScript completo do
  `KnowledgeCorpusEntry` e tipos auxiliares (fontes, licenças, mídia,
  variantes regionais, parâmetros linguísticos, registro de validação
  humana, procedência legada, histórico de status).
- `knowledge/schema/transitions.ts` — regras de transição de estado
  (`draft`, `under_review`, `validated`, `blocked`), incluindo a trava de
  que só `actorType: 'human'` pode propor `-> validated`.
- `knowledge/schema/validators.ts` — validadores estruturais puros
  (nenhum muta dados; todos apenas leem e respondem sim/não).
- `knowledge/schema/mediaDuplication.ts` — detector de mídia duplicada,
  função pura que recomenda bloqueio e revisão humana sem executar nada.
- `knowledge/corpus/entries/{ola,obrigado,tchau}.ts` — 3 entradas de
  demonstração, todas `status: 'draft'`, `validation: null`,
  `needsHumanReview: true`.
- `knowledge/test/*.test.ts` — testes automatizados das regras críticas
  (ver seção Testes abaixo).
- `.claude/skills/librasvox-linguistic-ai-engineer/` e
  `.claude/agents/libras-*.md` — Skill e 4 subagentes especializados.

## O que NÃO existe (fora de escopo desta fase, por decisão explícita)

- Servidor MCP em execução, tools/resources/prompts reais.
- Qualquer chamada a Gemini, Claude, OpenAI ou outro provedor de IA.
- Integração com o LVP Tutor, com `api/assistant.ts` ou
  `api/_lib/gateway.ts` (não tocados).
- Autenticação (Firebase ou qualquer outra).
- Banco de dados, embeddings, busca vetorial.
- Qualquer alteração em dicionário, videoaulas, rotas, interface, Atlas
  ou Vision.
- Qualquer função capaz de mudar uma entrada para `status: 'validated'`
  — essa função não existe neste código, por design permanente, não
  apenas por fase.

## Procedência dos dados das 3 entradas iniciais

Os parâmetros linguísticos de `ola`, `obrigado` e `tchau` foram copiados
de `src/data/librasCorpus.ts` — um arquivo que, no momento da criação
desta fundação, existe apenas como alteração **local não versionada**
(não commitada, ausente em `origin/main`). Por isso `legacyProvenance.originCommit`
é `null` em todas as 3 entradas: não há commit para referenciar.

Isso é uma procedência **técnica** (de onde o texto foi copiado), não uma
fonte linguística nem uma validação. Cada entrada declara isso
explicitamente em `legacyProvenance.disclaimer` e em `validationNotes`.

## Regra estrutural mais importante desta fundação

Nenhuma entrada pode ser fundamentar respostas de IA a menos que
`canGroundTutorResponse(entry)` retorne `true` — e essa função só retorna
`true` para `status: 'validated'` com registro de validação humana
completo (`validatorId`, `validatorName`, `validatorRole`,
`validationDate`, `sources.length > 0`) e mídia compatível. As 3
entradas desta fase retornam `false` nessa checagem, porque estão em
`draft` — isso é esperado e correto: elas existem para provar a
estrutura do schema, não para fundamentar nada ainda.

## Como verificar esta fundação

```bash
# type-check isolado (só schema/ e corpus/, não toca no app nem no tsconfig raiz)
npx tsc --noEmit --project knowledge/tsconfig.json

# testes automatizados (Node nativo, sem dependência nova)
node --test knowledge/test/*.test.ts
```

Nenhum dos dois comandos modifica `package.json` ou instala dependências.

## Próximas fases (não implementadas aqui)

Ver seção 20 do plano de arquitetura aprovado
(`C:\Users\User\.claude\plans\squishy-crunching-fountain.md`, referência
local — este repositório não versiona esse arquivo) para as fases 2-5:
servidor MCP somente leitura, integração experimental do Tutor,
curadoria assistida via PR, e finalmente escrita autenticada — cada uma
exigindo nova aprovação explícita antes de começar.
