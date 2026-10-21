---
version: 1
slug: "src-app-a-slug-page-tsx"
primary_target: "src/app/a/[slug]/page.tsx"
related_targets: ["src/app/a/[slug]/[clientId]/[projectId]/page.tsx"]
---

# Surface brief: painel admin (`/a/<slug>` e `/a/<slug>/<cliente>/<projeto>`)

## Scope and mode

Painel interno do dono (Operate). Visão geral + uma página por projeto. Spec:
`docs/specs/admin-layout.md`.

## Audience, job, constraints

- O dono (Gabriel), no Mac, faz triagem diária: o que está parado, o que depende
  do cliente, como está cada projeto. Depois abre o projeto ou a página do cliente.
- Só dado real de `content/`. Nada de time, orçamento, tarefas ou arquivos.
- SSG, com `dynamicParams = false` e noindex. O CSS do admin fica isolado das
  páginas de cliente.

## Direction contract

THESIS: o painel é um produto da categoria (sidebar + inset do shadcn) no tema
padrão. Recusa o visual autoral da v2 e a grade de cards por cliente.

OWN-WORLD: tema padrão shadcn `base-nova` (neutros, primary preto), Inter. A cor
de cada cliente aparece só em pontos, no hero do projeto e nos marcadores. Estados
em verde, âmbar e cinza; espera em azul.

STORY: o dono vê o que pede ação, entende por quê e abre o projeto em um clique.

FIRST VIEWPORT: a sidebar com os clientes e os projetos (com sinal de estado). À
direita, a barra com trilha e "Página do cliente", a saudação, os 4 indicadores e
"Precisa de atenção". No projeto: o hero com progresso, os indicadores e as duas
colunas em tela larga.

FORM: composição da referência do dono (dashboard "Zaga"), fixada por ele; o roll
não rodou. seed: none (composição fixada pela referência do dono).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
