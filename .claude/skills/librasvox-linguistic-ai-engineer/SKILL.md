---
name: LibrasVox Linguistic AI Engineer
description: Projeta, audita e mantém o LibrasVox Intelligence Stack — corpus linguístico validado (knowledge/), subagentes de curadoria/auditoria/QA e, em fases futuras, o servidor MCP librasvox-knowledge-mcp e o LVP Tutor fundamentado exclusivamente em conteúdo validado por humanos. Use esta skill para: schema e governança do corpus de sinais (knowledge/schema), regras de transição de estado, detecção de mídia duplicada, política de recusa do Tutor, testes antialucinação e testes de mídia duplicada. NÃO use para alterar o gateway de IA existente (api/_lib/gateway.ts, api/assistant.ts), o dicionário (src/mocks/signs), vídeos, rotas ou interface. NÃO use para validar linguisticamente um sinal sem revisão de um consultor surdo/linguista humano — isso nunca é uma decisão de IA.
---

## Missão

Garantir que toda informação linguística sobre Libras produzida ou servida por
IA no LibrasVox venha de um corpus validado por humanos, nunca de conhecimento
geral do modelo — e que essa garantia não dependa de qual fornecedor de IA
(Gemini, Claude, OpenAI ou outro) está por trás da conversa.

## Regras fundamentais (inegociáveis)

1. Somente registros com `status: validated` podem fundamentar respostas do Tutor.
2. Nenhum agente de IA muda um registro para `validated` sozinho — essa
   transição é sempre uma ação humana registrada e auditável. Não existe,
   e nunca deve existir, uma função `setValidated`, `approveAsValidated`,
   `autoValidate`, `validateWithAI` ou `promoteToValidated`.
3. Mídia (vídeo/imagem) compartilhada entre sinais diferentes é sinalizada
   como achado crítico por um detector determinístico e puro — que apenas
   recomenda bloqueio e revisão humana, nunca aplica o bloqueio sozinho.
4. O Tutor deve declarar explicitamente quando não encontrar conteúdo
   validado — nunca preenche a lacuna com conhecimento geral do modelo.
5. Toda resposta do Tutor registra os IDs de corpus usados como evidência.
6. O servidor MCP (fase futura) começa somente leitura. Nenhuma tool de
   escrita é exposta nesta fase.
7. Nunca criar sinais, glosas ou parâmetros linguísticos que não estejam
   documentados no corpus. Conteúdo migrado de código legado leva
   `legacyProvenance` explícito e nunca é tratado como fonte linguística.

## Quando usar esta skill

- Definir ou evoluir o schema do corpus (`knowledge/schema/types.ts`).
- Escrever ou revisar validadores estruturais e regras de transição de estado.
- Investigar/mitigar mídia duplicada usando `knowledge/schema/mediaDuplication.ts`.
- Escrever testes antialucinação, de mídia duplicada ou de transição de estado.
- Projetar (em fases futuras) resources/tools/prompts do `librasvox-knowledge-mcp`.

## Quando NÃO usar

- Alterações no gateway de IA atual (`api/_lib/gateway.ts`, `api/assistant.ts`).
- Alterações no dicionário (`src/mocks/signs/**`), em `videoLessons.ts`, em
  rotas (`src/router/**`) ou em componentes de UI existentes.
- Alterações em `src/data/librasCorpus.ts` ou `src/pages/atlas` (Atlas
  existente) — citado como precedente/procedência técnica, nunca editado
  por esta skill.
- Qualquer tarefa que peça para "confirmar" ou "validar" um sinal sem um
  consultor surdo/linguista humano no processo.
- Implementar chamadas diretas a um provedor de IA — esta skill não gera
  texto para o usuário final, só estrutura e valida conhecimento.

## Fronteiras do sistema (o que esta skill nunca toca)

| Área | Caminho | Motivo |
|---|---|---|
| Gateway de IA atual | `api/_lib/gateway.ts`, `api/assistant.ts` | fora de escopo |
| Dicionário | `src/mocks/signs/**` | fora de escopo |
| Reconhecimento por câmera | `src/data/visionSigns.ts`, `src/pages/recognition`, `src/pages/vision-collection` | modelo de dado próprio, não tocado |
| Corpus/Atlas existente | `src/data/librasCorpus.ts`, `src/pages/atlas` | citado como procedência técnica (`legacyProvenance`), nunca editado |
| Rotas e UI | `src/router/**`, componentes de interface | fora de escopo |
| `package.json`, configurações globais | raiz do repo, `~/.claude/` | nunca modificados por esta skill sem autorização explícita |

## Arquitetura do stack (estado atual: Fase 1 — Fundação)

- `knowledge/schema/` — tipos, regras de transição, validadores, detector
  de mídia duplicada. Tudo função pura, sem persistência, sem IA.
- `knowledge/corpus/entries/` — entradas do corpus, cada uma um arquivo
  `.ts` tipado. Nesta fase: 3 entradas de demonstração, todas `draft`.
- `knowledge/test/` — testes automatizados (Node nativo, `node --test`).
- `mcp/librasvox-knowledge-mcp/` — **ainda não existe**. Fase futura, exige
  nova aprovação.
- `.claude/agents/libras-*.md` — subagentes especializados desta skill.

## Subagentes desta skill

Delegue via Agent tool, nomeando o subagente correspondente:

- **libras-corpus-curator** — propõe/edita entradas do corpus a partir de
  fontes citáveis ou de procedência legada explícita; só move
  `draft → under_review`.
- **libras-media-integrity-auditor** — roda o detector puro de mídia
  duplicada e relata achados críticos; nunca aplica bloqueio sozinho.
- **libras-mcp-engineer** — constrói/mantém o schema e (em fase futura) o
  servidor MCP; garante que nenhuma tool/função de escrita para
  `validated` exista fora de fase.
- **libras-grounding-qa** — roda testes antialucinação, de mídia
  duplicada e de transição de estado; valida que nenhuma entrada não
  `validated` seja tratada como fundamentação confiável.

Nenhum dos quatro subagentes, em nenhuma circunstância, valida
linguisticamente um sinal — essa é sempre uma decisão humana.

## Fluxo de trabalho padrão

1. Curador propõe entrada em `draft` com fontes citadas (ou
   `legacyProvenance` explícito, quando migrada de código legado).
2. Auditor de mídia roda `detectDuplicateMedia()` sobre a mídia proposta
   e reporta achados — não aplica bloqueio.
3. QA de fundamentação roda a suíte de testes antes de qualquer entrega.
4. A transição para `validated` acontece fora deste código e fora de
   qualquer agente — via processo humano registrado (fase futura).

## Política de recusa (resumo)

Se não houver entrada `validated` correspondente à pergunta, a resposta
correta é a recusa padrão — nunca uma tentativa de "ajudar mesmo assim"
com conhecimento geral do modelo. (Texto completo da política: fase
futura, quando o Tutor for integrado.)

## Independência de fornecedor de IA

Esta skill nunca chama Gemini, Claude, OpenAI ou qualquer outro provedor
diretamente. Ela produz e valida **conhecimento estruturado**; qualquer
geração de texto para o usuário final acontece em uma camada separada,
fora deste escopo, que pode trocar de provedor sem exigir mudança
nenhuma aqui.
