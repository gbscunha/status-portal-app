---
version: 1
slug: "src-app-r-slug-page-tsx"
primary_target: "src/app/r/[slug]/page.tsx"
related_targets: ["src/app/r/[slug]/anteriores/page.tsx","src/app/page.tsx","src/app/not-found.tsx"]
---

# Surface brief: páginas de cliente (`/r/<slug>`, `/r/<slug>/anteriores`, raiz e 404)

## Scope and mode

Relatório de acompanhamento que o cliente lê (Read). A página principal mostra os
projetos em curso e os anteriores mostram os encerrados, um projeto por vez, pela
sidebar. A raiz e o 404 são páginas mínimas, fora da moldura. Spec:
`docs/specs/cliente-shadcn.md`.

## Audience, job, constraints

- O contato do cliente abre o link que chegou por WhatsApp ou e-mail, muitas vezes
  no celular. Quer saber em que pé está o projeto e o que depende dele, e pode
  salvar em PDF ou falar com a ITGraph.
- O conteúdo e os rótulos são os de hoje: pt-BR de cliente, benefício, zero
  jargão. Nada de texto novo sem o dono aprovar.
- SSG, `dynamicParams = false`, noindex e título genérico. Nenhum outro cliente
  aparece. O hash escolhe o projeto, e o PDF sai com todos.

## Direction contract

THESIS: o relatório do cliente entra na mesma moldura do painel (sidebar + inset
do shadcn). Recusa a v2 autoral (trilho na cor da marca, kickers em caixa-alta)
e as abas no topo.

OWN-WORLD: o sistema do DESIGN.md, que é o tema padrão `base-nova`, Inter, neutros
sem croma e primary grafite. A marca do cliente só tinge o cabeçalho e marca o
relatório atual. Estados em verde, âmbar e cinza; espera em azul. Os botões são
preenchidos.

STORY: o cliente vê o título do relatório e o progresso geral, entende o que
espera por ele e o que vem depois, e troca de projeto pela sidebar.

FIRST VIEWPORT: à esquerda, a sidebar com o cliente e os projetos, cada um com o
ícone de estado. No topo, a barra com a trilha e "Salvar PDF", WhatsApp e
E-mail. No conteúdo, o cabeçalho tingido com o título, o ciclo de vida, os fatos
e a barra geral, e logo abaixo "Aguardando você".

FORM: a moldura e a composição da página de projeto do admin, fixadas pelo dono
(sidebar como no admin, um projeto por vez). O roll não rodou de propósito: o
sistema é o do DESIGN.md e "a user- or brief-pinned direction beats the roll,
always" (new-work.md). A sessão lê mode-read.md. seed: none (direção fixada pelo
dono; roll não aplicável).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
