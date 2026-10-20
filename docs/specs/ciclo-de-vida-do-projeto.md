# Spec: ciclo de vida do projeto + página de projetos anteriores

- **Status:** implementada
- **Data:** 2026-10-20

## Problema / motivação

Hoje todo projeto em `projects[]` aparece como ativo. Os estados `done/prog/plan`
valem para itens de progresso e cards, não para o projeto inteiro. Falta marcar
um projeto como parado por bloqueio, como entregue ou como interrompido sem
entrega, e tirar os que terminaram da vista principal sem perder o histórico.

## Decisões (tomadas com o dono em 2026-10-20)

- **Onde mora:** campo opcional `lifecycle` no projeto, em
  `content/clients/<id>.json`. Snapshot não muda. O "desde quando" vai no próprio
  campo; o histórico de mudanças fica no git.
- **Rótulo do pausado:** "Em espera" (estado `paused` no código).
- **Quatro estados:** `active` (Em andamento) · `paused` (Em espera) ·
  `delivered` (Concluído) · `closed` (Encerrado). Encerrado nunca aparece como
  entregue.
- **Página:** rota própria `/r/<slug>/anteriores` ("Projetos anteriores"), com os
  grupos "Concluídos" e "Encerrados". Cliente sem nenhum dos dois → **404**.

## Formato do campo

```jsonc
// ausente ou { "state": "active" } → em andamento (comportamento atual)
{ "state": "paused", "reason": "Aguardando o acesso ao servidor de vocês", "since": "2026-10-12" }
{ "state": "delivered", "deliveredAt": "2026-10" }
{ "state": "closed", "closedAt": "2026-10", "reason": "Projeto interrompido a pedido do cliente" }
```

`reason` é obrigatório no pausado e opcional no encerrado. `since` é opcional.
`deliveredAt`/`closedAt` são MÊS (`YYYY-MM`), como o `eta`.

## Escopo

**Dentro:** schema + fonte única dos estados (`src/lib/lifecycle.ts`);
agrupamento e ordenação; selo e aviso do projeto em espera; rota
`/r/<slug>/anteriores`; link condicional na página principal; estado de projeto
no painel admin; documentação.

**Fora:** cadastrar/marcar projetos reais (segunda etapa, conteúdo, direto na
`main`); mudanças na skill `atualizar-status-portal` e nos scripts de
`~/.claude/tarefas/` (só listados abaixo); navegação para snapshots antigos.

## Critérios de aceitação (testáveis)

### Schema (Vitest, `src/lib/types.test.ts`)

- **DADO** um projeto sem `lifecycle` **QUANDO** valido o cliente **ENTÃO** passa,
  e o projeto conta como em andamento.
- **DADO** cada um dos quatro estados com seus campos obrigatórios **QUANDO**
  valido **ENTÃO** passa.
- **DADO** `state` fora dos quatro (ex.: `"blocked"`, `"done"`) **QUANDO** valido
  **ENTÃO** falha.
- **DADO** pausado sem `reason`, concluído sem `deliveredAt`, encerrado sem
  `closedAt`, ou mês com dia (`"2026-10-12"`) **QUANDO** valido **ENTÃO** falha.

### Agrupamento e ordenação (Vitest, `src/lib/lifecycle.test.ts`)

- **DADO** projetos ativos e em espera intercalados **QUANDO** monto a vista
  principal **ENTÃO** vêm todos os ativos e depois os em espera, mantendo a ordem
  da config dentro de cada grupo; concluídos e encerrados ficam de fora.
- **DADO** concluídos e encerrados **QUANDO** monto a vista de anteriores
  **ENTÃO** ficam em dois grupos, cada um do mais recente para o mais antigo
  (empate mantém a ordem da config).
- **DADO** um conjunto de clientes **QUANDO** listo os slugs da página de
  anteriores **ENTÃO** só entram os que têm ao menos um concluído ou encerrado.
- **DADO** cada estado **QUANDO** busco o rótulo **ENTÃO** existe um texto em
  pt-BR.
- **DADO** o último snapshot de um projeto concluído ou encerrado **QUANDO**
  monto o relatório dele **ENTÃO** saem as pendências, os próximos passos e as
  previsões (`eta`), e ficam o progresso, os cards e o histórico (decidido com o
  dono na verificação: projeto que terminou não pede ação nem promete data).

### Painel admin (Vitest, `src/lib/admin.test.ts`)

- **DADO** um projeto em andamento sem snapshot há mais de 14 dias **QUANDO**
  monto a linha do admin **ENTÃO** ela traz o alerta de parado.
- **DADO** um projeto em espera, concluído ou encerrado na mesma situação
  **QUANDO** monto a linha **ENTÃO** ela traz o estado e NÃO o alerta de parado.

### Rotas e componentes (verificação manual, `pnpm build && pnpm start`)

Com os JSONs atuais (sem `lifecycle` em nenhum projeto):

1. `/r/<slug>` de cada cliente renderiza igual a antes: mesmas tabs, mesma
   ordem, nenhum link "Projetos anteriores".
2. `/r/<slug>/anteriores` dá 404 para todo cliente; `/r/inexistente/anteriores`
   também.

Com uma edição TEMPORÁRIA e não commitada num `clients/<id>.json` (um projeto em
espera com pendências no snapshot, um concluído e um encerrado), revertida no
fim:

3. Na `/r/<slug>`, o em espera aparece depois dos ativos, com o selo "Em espera"
   na tab e um aviso como primeiro bloco do trilho (logo abaixo do resumo), com
   o motivo e a data; como o snapshot tem pendências, o aviso aponta para o bloco
   "Aguardando você", que vem logo depois.
4. Concluído e encerrado saem das tabs. Aparece o link "Projetos anteriores · 2 →".
5. `/r/<slug>/anteriores` responde 200 com o grupo "Concluídos" ("Entregue em
   <mês>") e o grupo "Encerrados" ("Encerrado em <mês>"), além do último
   relatório de cada um, sem "Aguardando você", "Próximos passos" nem previsões.
   Nenhum encerrado diz "entregue". Os itens do índice
   linkam a tab (`#<id>`) só quando há mais de um relatório.
6. A rota nova tem `<meta name="robots" content="noindex, nofollow">`, o header
   `X-Robots-Tag: noindex, nofollow` e nenhuma tag `og:`, e o `<title>` é o
   genérico "Status do Projeto".
7. Com TODOS os projetos de um cliente encerrados ou concluídos, a `/r/<slug>`
   mostra "Nenhum projeto em andamento agora" com o link para os anteriores.
8. O `/a/<slug-admin>` mostra o estado de cada projeto (em espera com o motivo,
   concluído e encerrado com o mês), sem alerta de "parado" fora dos ativos.
9. Na impressão (PDF), o aviso de "Em espera" sai no relatório; a tab some, como
   hoje.

## Impacto nas invariantes

- `dynamicParams = false` + `generateStaticParams` também na rota nova: um slug
  sem anteriores ou inexistente dá 404 por construção.
- `noindex` em 3 camadas: metadata (layout + page nova), `robots.ts` (`/`
  inteiro) e `X-Robots-Tag` (`/:path*`) já cobrem a rota nova.
- Sem OpenGraph; título genérico.
- Nenhuma rota pública lista clientes: a página de anteriores só mostra os
  projetos do próprio slug.
- Estados `done|prog|plan` intocados; o conjunto novo tem fonte própria em
  `src/lib/lifecycle.ts` e cores próprias no `globals.css`.
- Parse defensivo: `lifecycle` inválido invalida o cliente, que é pulado com
  aviso, como qualquer outro campo da config (o build não cai). Ver Notas.
- Nenhuma ilha nova: a página de anteriores reaproveita o `ProjectSwitcher`.
- Snapshots intocados; nenhum `id` renomeado.

## Impacto fora do repo (só listado, nada editado)

- **Skill `atualizar-status-portal`:** ler o `lifecycle` do projeto antes de
  gerar. Se o projeto estiver concluído ou encerrado, avisar e perguntar antes
  de criar um snapshot; se estiver em espera, lembrar de alinhar o motivo com o
  `pending`. Pode sugerir marcar `delivered` quando todo o progresso estiver em
  `done`. Não muda o formato do snapshot.
- **`~/.claude/tarefas/portal-pendente.mjs`:** abrir
  `content/clients/<clientId>.json`, achar o projeto e, se não estiver em
  andamento, trocar o aviso de "N commits desde o último snapshot" por uma linha
  informativa (em espera desde X / concluído em Y).
- **`~/.claude/tarefas/email-pendente.mjs`:** pular concluídos e encerrados no
  e-mail quinzenal; nos em espera, trocar "quinzena vencida sem novidade" pelo
  motivo da espera.

## Notas

- **Risco do parse defensivo:** um erro de digitação no `lifecycle` (ex.:
  `"pasued"`) pula o cliente inteiro, e a página dele dá 404 depois do deploy.
  O comportamento é o mesmo de qualquer outro campo inválido da config hoje (o
  aviso aparece no build). Afrouxar só esse campo (inválido = em andamento)
  mostraria um projeto concluído como ativo, sem aviso visível. Mantido o
  padrão.
- Hash antigo de um projeto que virou anterior (`/r/<slug>#<id>`) cai na
  primeira tab. Aceitável.
