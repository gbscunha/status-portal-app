# Spec: Painel admin (`/a/<slug-admin>`)

- **Status:** implementada
- **Data:** 2026-07-16

## Problema / motivação

O dono (ITGraph) não tem visão consolidada: para saber como está cada cliente
precisa guardar e abrir cada `/r/<slug>`. O painel admin é o cockpit — uma URL
secreta dele, com um card por cliente linkando para a página respectiva e
mostrando sinais vitais (última atualização, progresso, pendências, "status
velho").

## Escopo

**Dentro:**

1. Rota **`/a/[slug]`** (SSG, `dynamicParams = false`): só o slug fixado em
   `content/admin.json` existe; qualquer outro → 404. `noindex` + título
   genérico; **nenhuma rota/página linka para ela**.
2. `content/admin.json` (`{ "slug": "..." }`, validado com Zod, parse
   defensivo — sem arquivo/inválido → rota não gera páginas e o build segue).
   Slug gerado com `scripts/gen-slug.mjs`.
3. Card por cliente: nome, chip da cor da marca, link para `/r/<slug>`; por
   projeto: data do último snapshot, progresso geral (`overallPercent`),
   nº de pendências (`pending`), e **alerta de status velho** (>14 dias sem
   snapshot, calculado em build).
4. Lógica pura nova em `src/lib` com TDD: `daysBetween(aIso, bIso)` TZ-safe
   (aritmética sobre a string ISO, sem `new Date("YYYY-MM-DD")` cru).
5. Exceção consciente à invariante "nenhuma rota lista clientes/slugs"
   documentada em `docs/DECISOES.md` + invariante reescrita no CLAUDE.md e na
   skill xp-cycle ("nenhuma rota *de cliente* lista...; a exceção é /a/").

**Fora:** qualquer ação de escrita (criar snapshot, editar cliente — o fluxo
continua git), auth de verdade, estatísticas históricas, links para previews.

## Critérios de aceitação (testáveis)

Vitest (`src/lib/*.test.ts`):
- **DADO** `daysBetween("2026-07-01", "2026-07-16")` **ENTÃO** retorna 15;
  ordem invertida retorna -15; datas iguais, 0.
- **DADO** um `admin.json` válido **QUANDO** o schema parseia **ENTÃO** aceita;
  slug vazio → rejeita.

Manual (dev server):
- `/a/<slug-admin>` renderiza card de cada cliente com link `/r/<slug>`
  correto, data formatada, % e contagem de pendências.
- Projeto sem snapshot aparece marcado ("sem relatório"), não quebra.
- Snapshot com >14 dias exibe o alerta visual.
- `/a/<qualquer-outro>` → 404; `<meta robots noindex>` presente; header
  `X-Robots-Tag` cobre `/a/` (conferir matcher no `next.config.ts`);
  raiz continua sem nada.

## Impacto nas invariantes

- **"Nenhuma rota lista clientes/slugs":** exceção única e consciente, mesmo
  modelo de segurança das páginas de cliente (slug forte + noindex + 404).
  Registrada em DECISOES; invariante reformulada (CLAUDE.md + xp-cycle).
- **dynamicParams=false:** replicado na rota nova.
- **noindex 3 camadas:** metadata na página; `robots.ts` e `X-Robots-Tag`
  conferidos/estendidos para `/a/`.
- **Parse defensivo:** admin.json inválido nunca derruba o build.
- **Linguagem:** o painel é interno (dono), não precisa de linguagem de
  cliente — termos diretos são ok.

## Notas

- Slug admin NUNCA deve ser entregue a cliente; se vazar, `gen-slug` de novo e
  trocar o `admin.json` (rotação barata).
- Data "hoje" para o alerta é a do **build** (SSG) — aceitável: todo push
  redeploya; anotar no card ("dados do último deploy").
