# Spec: UI/UX hardening (auditoria web-design-guidelines)

- **Status:** implementada
- **Data:** 2026-07-16

## Problema / motivação

Auditoria com a skill `web-design-guidelines` (Vercel Web Interface Guidelines)
apontou 6 grupos de achados no portal: um bug real de multi-cliente (gradiente
do `.next` hardcoded no rosa da Movi), fragilidades com conteúdo vindo de JSON
(título longo estoura o card; cliente sem snapshot rende página em branco),
lacunas de acessibilidade (landmark, headings, progressbar, `aria-current`),
polish de tipografia/theming e contraste do pill âmbar abaixo do AA.

O design "operational precision" não muda — só ganha robustez e acessibilidade.

## Escopo

**Dentro:**

1. **Theming multi-cliente:** `.next` com fundo derivado de `--brand` via
   `color-mix()`; `.fill.plan`/`.dot.plan` usando `var(--plan-track)` (nova
   var) em vez de `#d0d0d6` solto.
2. **Conteúdo longo:** `.card .top .title` com `min-width: 0` +
   `overflow-wrap: break-word`.
3. **Empty state:** `ProjectStack` sem nenhum relatório renderiza mensagem
   amigável em pt-BR (ex.: "Estamos preparando o primeiro relatório deste
   projeto.") em vez de página em branco.
4. **Semântica/a11y:** `ProjectStack` envolve os relatórios em `<main>`;
   apenas o 1º relatório usa `<h1>` (demais `<h2>`, via prop `headingLevel`);
   barra de progresso com `role="progressbar"` + `aria-valuenow/min/max`;
   `aria-current="true"` na data atual da `Timeline`.
5. **Polish:** `text-wrap: balance` em `h1`/`.section-head h3`;
   `export const viewport = { themeColor: "#fafafa" }` no layout (Next 16:
   themeColor vive no export `viewport`, conferido em
   `node_modules/next/dist/docs/.../generate-viewport.md`); `translate="no"`
   nos nomes de marca (Footer e kicker do ReportHeader).
6. **Contraste:** escurecer `--prog` para tom com ≥ 4,5:1 sobre `--prog-bg`
   (ex.: `#8f5c0a`) mantendo a leitura "âmbar".

**Fora:** navegação de snapshots antigos, seletor de projeto, qualquer mudança
de layout/identidade visual, redesign criativo, dependências novas.

## Critérios de aceitação (testáveis)

- **DADO** um cliente com `brandColor` azul **QUANDO** o bloco "Próximos
  passos" renderiza **ENTÃO** o fundo do `.next` puxa para o azul (nenhum tom
  rosa hardcoded no CSS). _(verificação manual + grep `#fff6f6` vazio)_
- **DADO** um card com título muito longo **QUANDO** renderiza **ENTÃO** o
  texto quebra dentro do card sem estourar o layout. _(manual, dev server)_
- **DADO** um cliente cujos projetos não têm nenhum snapshot válido **QUANDO**
  `/r/<slug>` renderiza **ENTÃO** aparece mensagem amigável em pt-BR, não
  página em branco. _(manual: fixture temporária)_
- **DADO** um cliente com 2+ projetos **QUANDO** a página renderiza **ENTÃO**
  há exatamente um `<h1>` e um `<main>` no DOM. _(manual: view-source)_
- **DADO** a barra de progresso **QUANDO** renderiza **ENTÃO** o elemento tem
  `role="progressbar"` com `aria-valuenow` igual ao percent. _(manual:
  view-source)_
- **DADO** a Timeline com 2+ datas **QUANDO** renderiza **ENTÃO** a data do
  snapshot exibido tem `aria-current="true"`. _(manual: view-source)_
- **DADO** o layout **QUANDO** a página carrega **ENTÃO** `<meta
  name="theme-color" content="#fafafa">` está presente. _(manual: view-source)_
- **DADO** os valores canônicos de status **QUANDO** `pnpm test` roda **ENTÃO**
  os testes de `src/lib/status.ts` seguem verdes (fonte única intacta).

## Impacto nas invariantes

- **Estados só `done|prog|plan`:** intacto — nenhuma mudança em
  `src/lib/status.ts`; cores continuam só no CSS.
- **noindex/3 camadas, dynamicParams, OpenGraph, rota raiz:** não tocados
  (o `viewport` export não adiciona metadata que revele cliente).
- **Conteúdo pt-BR de cliente:** a mensagem de empty state segue linguagem de
  benefício, zero jargão.
- **Sem dependência nova:** só CSS + JSX; `color-mix()` é CSS nativo
  (baseline 2023).

## Notas

- Achados completos da auditoria na sessão de 2026-07-16 (skill
  `web-design-guidelines`, guidelines da Vercel).
- `role="meter"` seria semanticamente aceitável para as barras, mas
  `progressbar` tem suporte AT mais amplo — escolhido por isso.
