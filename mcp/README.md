# librasvox-knowledge-mcp

Servidor MCP (Model Context Protocol) local, **somente leitura**, que expõe o
corpus linguístico validado do LibrasVox (`knowledge/`) via `stdio`.

## Finalidade

Ser a única porta de acesso programático ao corpus para qualquer cliente de
IA — garantindo, na estrutura do próprio protocolo, que **somente conteúdo
`validated`, com evidência humana completa, pode fundamentar uma resposta**.
Este servidor não decide o que é linguisticamente correto: ele só impede
que conteúdo não-validado seja apresentado como se fosse confiável.

## O que este servidor NÃO é

- Não abre porta HTTP nem aceita conexão de rede.
- Não chama Gemini, Claude, OpenAI ou qualquer outro provedor de IA.
- Não acessa Firebase, banco de dados, nem qualquer serviço externo.
- Não escreve arquivos, não altera o corpus, não muda `status` de nada.
- Não valida sinais — validação linguística é sempre humana, fora deste código.

## Arquitetura

```
mcp/
├── index.ts        — entrypoint do processo (stdio, sinais de shutdown)
├── server.ts        — fábrica pura createServer(repository, entries)
├── corpusVersion.ts — hash determinístico do conteúdo do corpus
├── smoke.ts          — cliente de diagnóstico manual (não é o servidor)
├── schemas/          — contratos zod de entrada/saída das tools
├── repository/        — abstração somente leitura sobre knowledge/corpus
├── resources/         — os 4 resources MCP
├── tools/             — as 5 tools MCP
├── prompts/           — os 3 prompts MCP
├── services/           — cálculo de elegibilidade de fundamentação
├── errors/             — erros seguros e mensagens de recusa canônicas
└── test/               — testes automatizados (node --test nativo)
```

`server.ts` não tem nenhum efeito de processo — é testável sozinho, sem
subir `stdio`. Só `index.ts` toca stdio/sinais de sistema.

## Instalação

Dependências já declaradas no `package.json` da raiz do repositório:
`@modelcontextprotocol/sdk` (fixado em `1.29.0`), `zod` (fixado em
`4.4.3`) e, como dependência de desenvolvimento, `@types/node`. Rode
`npm install` na raiz do projeto.

Nenhuma dependência nova é necessária para executar — este servidor roda
com o TypeScript do Node 24 nativamente (sem `tsx`, sem passo de build).

## Execução

```bash
npm run mcp:dev          # inicia o servidor por stdio (uso interativo/manual)
npm run mcp:type-check   # tsc --noEmit isolado (mcp/ + knowledge/schema + knowledge/corpus)
npm run mcp:test         # suíte de testes (node --test nativo)
npm run mcp:smoke        # cliente de diagnóstico: sobe o servidor, initialize + listagens + 2 chamadas de tool
```

## Resources

| URI | Conteúdo |
|---|---|
| `libras://corpus/schema` | Descrição dos campos, estados e critérios de validação do corpus |
| `libras://corpus/policy` | As regras de fundamentação (resumidas abaixo) |
| `libras://corpus/stats` | Contagens agregadas, calculadas a cada leitura |
| `libras://signs/{id}` | Entrada completa — só se `validated` e elegível. Qualquer outro caso: erro de protocolo `-32002 Resource not found`, sem revelar se a entrada existe como draft/under_review/blocked |

## Tools

| Tool | O que faz |
|---|---|
| `search_validated_signs` | Busca por texto entre sinais `validated` elegíveis |
| `get_validated_sign` | Retorna uma entrada completa, só se elegível |
| `list_validated_categories` | Categorias com ao menos um sinal elegível |
| `get_corpus_stats` | Contagens por status, sempre calculadas na hora |
| `check_grounding_eligibility` | Para uma lista de IDs, diz se cada um é elegível e por quê (`reasonCode` seguro) |

Todas anotadas como `readOnlyHint: true` (o SDK 1.29.0 suporta tool
annotations).

## Prompts

- `explain_validated_sign` — instrui pesquisar, citar evidência, recusar se vazio.
- `create_grounded_practice` — só monta um exercício se houver conteúdo `validated` disponível.
- `safe_tutor_refusal` — texto canônico de recusa.

## Política de fundamentação (resumo)

1. Só `status: validated`, com `validation` completo e `sources` não-vazio, funda respostas.
2. Nenhuma IA valida sinais.
3. Ausência de conteúdo validado gera recusa estruturada — nunca invenção.
4. `blocked` nunca é retornado, por nenhuma tool ou resource.
5. Mídia compartilhada entre sinais diferentes exige revisão humana antes de qualquer uso.

## Política de recusa

Quando não há conteúdo validado suficiente, a resposta das tools é sempre
`ok: true` com `refusal.required: true` e a mensagem: *"O LibrasVox ainda
não possui conteúdo validado suficiente para responder com segurança."*
— nunca um erro interno. Ausência de conteúdo não é uma falha do sistema.

## Limitações atuais — por que zero sinais estão disponíveis

O corpus (`knowledge/corpus/entries/`) hoje tem exatamente 3 entradas
(`ola`, `obrigado`, `tchau`), todas com `status: 'draft'`. **Nenhuma
entrada está `validated` neste momento** — por isso toda tool/resource
deste servidor vai legitimamente recusar ou retornar vazio para qualquer
pergunta. Isso é o comportamento correto e esperado, não um defeito: a
validação linguística humana ainda não aconteceu para nenhum sinal.

## Como testar

```bash
npm run mcp:test
```

Cobre: inicialização por stdio, listagens de tools/resources/prompts,
contagens dinâmicas, ausência de draft/under_review/blocked em qualquer
resposta, rejeição de input inválido, ausência de efeito colateral
(mutação do corpus), ausência de chamada de rede/escrita de arquivo/
`console.log` fora de `smoke.ts`, e desligamento limpo por sinal.

## Como conectar futuramente a um cliente

Qualquer cliente MCP compatível com `stdio` pode conectar executando
`node mcp/index.ts` a partir da raiz do repositório como comando. Não há
autenticação nem configuração de rede nesta fase — a confiança é de
processo local.

## Fase 3 (fora deste escopo)

Uma camada futura e isolada de composição do Tutor consumirá este
servidor para compor respostas fundamentadas — sem tocar no gateway de
IA atual (`api/_lib/gateway.ts`, `api/assistant.ts`) e sem que este
servidor jamais chame um provedor de IA diretamente.
