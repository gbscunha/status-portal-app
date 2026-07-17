# Convenções de código (derivadas do código existente)

Padrões observados no repo. Ao criar código novo, siga-os; ao encontrar código
que diverge, não "corrija" em massa — mude só com motivo e no escopo da tarefa.

## Estrutura e componentes

- `src/app/` = rotas (App Router). `src/components/` = componentes de
  apresentação. `src/lib/` = lógica pura (schemas, loaders, formatação).
- **Server Components por padrão.** Ilha `"use client"` só com justificativa
  forte e mínima — hoje existem DUAS (`ProjectSwitcher`, tabs com hash como
  fonte de verdade; `AdminGreeting`, relógio da visita via
  `useSyncExternalStore` com snapshot de servidor = data do build).
- Um componente por arquivo, PascalCase, props tipadas com `type` inline ou
  importado de `@/lib/types`.
- Composição segue a hierarquia `ProjectStack → ProjectSwitcher → StatusReport
  → (ReportHeader, SummaryStrip, PendingList, ProgressList, Legend, NextSteps,
  Section, Timeline, ContactCta, Footer)`.

## Estilo

- **CSS puro** em `src/app/globals.css` — sem Tailwind, sem CSS-in-JS, sem
  módulos. Classes semânticas kebab-case.
- Cor de marca: CSS var `--brand` setada uma vez no `ProjectStack` via style
  inline (precisa de cast `as CSSProperties` — o tipo padrão não aceita custom
  properties). Todo o resto usa `var(--brand)`.
- Estados visuais: só as classes `.done`/`.prog`/`.plan`; valores canônicos em
  `src/lib/status.ts`.

## Dados e validação

- Schema novo = Zod em `src/lib/types.ts` + tipo inferido com `z.infer`
  exportado ao lado.
- Leitura de conteúdo SEMPRE via `src/lib/content.ts`, com `safeParse` +
  `console.warn` + skip — arquivo inválido nunca derruba o build.
- Loaders rodam em build time (Node `fs`); não usar `fetch` para conteúdo local.

## Datas

- Formatação SEMPRE via `src/lib/format.ts`, operando sobre a string ISO.
  **Nunca** `new Date("YYYY-MM-DD")` (off-by-one de fuso em America/Sao_Paulo).

## Next 16 (leia antes de usar APIs)

- `params` em pages/layouts é **`Promise`** — sempre `await`.
- Antes de usar qualquer API do Next, consultar os docs da versão instalada em
  `node_modules/next/dist/docs/` (ver `AGENTS.md`). Não confiar na memória.
- `turbopack.root` está fixado em `next.config.ts` — não remover (evita
  inferência errada de raiz de workspace).

## Idioma e testes

- Código, comentários e nomes em **inglês**; conteúdo visível (UI, snapshots)
  em **pt-BR** de cliente (benefício, zero jargão técnico).
- Testes Vitest co-locados: `src/lib/<modulo>.test.ts`. Descrições de teste em
  inglês, como o código.

## Sempre / nunca

- Sempre rodar `pnpm test && pnpm build && pnpm lint` antes de dar algo por
  concluído.
- Nunca adicionar dependência sem perguntar; nunca `git add .`; nunca commitar
  `.env`/segredos/build.
