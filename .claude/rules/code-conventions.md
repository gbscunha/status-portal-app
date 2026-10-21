# Convenções de código (derivadas do código existente)

Padrões observados no repo. Ao criar código novo, siga-os; ao encontrar código
que diverge, não "corrija" em massa — mude só com motivo e no escopo da tarefa.

## Estrutura e componentes

- `src/app/` = rotas (App Router). `src/components/` = componentes de
  apresentação. `src/lib/` = lógica pura (schemas, loaders, formatação).
- **Server Components por padrão.** Ilha `"use client"` própria só com
  justificativa forte e mínima — hoje são TRÊS: `PrintButton` (`window.print()`,
  sem alternativa sem JS), `ProjectSwitcher` (tabs com hash como fonte de
  verdade) e `AdminGreeting` (relógio da visita via `useSyncExternalStore`, com
  snapshot de servidor = data do build). Os primitivos do shadcn em
  `src/components/ui/` só são usados no admin; a maioria é client (badge, item e
  breadcrumb receberam `"use client"` local, §19), e button, card, empty, input
  e skeleton não são.
- Um componente por arquivo, PascalCase, props tipadas com `type` inline ou
  importado de `@/lib/types`.
- **Páginas de cliente:** a composição segue a hierarquia
  `ProjectStack | ArchiveStack` (cada um dentro do `ClientShell`)
  `→ ProjectSwitcher → StatusReport → (ReportHeader, SummaryStrip,
  LifecycleNotice, PendingList, ProgressList, Legend, NextSteps, Section,
  Timeline, ContactCta, Footer)`. O `ProjectSwitcher` recebe `panels[]` (aba +
  conteúdo juntos).
- **Admin:** `AdminOverview | AdminProjectView` → `AdminShell` (sidebar, trilha
  e ação principal) → blocos `Admin*`. Eles são Server Components que compõem os
  primitivos de `components/ui` e passam só dados e elementos, nunca funções. O
  item ativo é calculado no servidor (prop `current`); o shell não é um
  `layout.tsx` (o `a/layout.tsx` só carrega o CSS e a fonte).

## Estilo

- **Dois mundos até a migração das páginas de cliente (DECISOES §19).**
  - Cliente e raiz: **CSS puro** em `src/app/globals.css` (v2), sem Tailwind,
    sem CSS-in-JS e sem módulos. Classes semânticas kebab-case.
  - Admin: **shadcn/ui + Tailwind v4**, tema em `src/app/tailwind.css`. Use
    componentes de `@/components/ui` antes de markup próprio, tokens semânticos
    (`bg-background`, `text-muted-foreground`, `text-done`…) e nunca cores
    cruas. Classes condicionais com `cn()` (`@/lib/utils`). Siga a skill
    `shadcn` do projeto.
  - O layout raiz não importa CSS. Cada segmento importa o seu, e os dois nunca
    carregam na mesma página: o `globals.css` tem regras fora de camada que
    anulariam o Tailwind.
- **Componentes gerados:** `components/ui` e `hooks/use-mobile.ts` saem do CLI
  fixado (`pnpm dlx shadcn@4.21.4 add …`). As edições locais estão listadas no
  §19. Depois de um `add --overwrite`, refaça-as.
- Cor de marca: CSS var `--brand` via style inline (precisa de cast
  `as CSSProperties` — o tipo padrão não aceita custom properties). Nas
  páginas de cliente ela é setada uma vez no `ClientShell`, e o resto usa
  `var(--brand)`. No admin, ela vai em cada bloco que mostra o cliente, e as
  classes usam `bg-(--brand)` ou `border-(--brand)/20`. Nunca vira cor de texto
  (contraste).
- Estados visuais: só `done`/`prog`/`plan`, com valores canônicos em
  `src/lib/status.ts`. Na v2 são as classes `.done`/`.prog`/`.plan`; no admin,
  os tokens `done`/`prog`/`plan` do `tailwind.css`, com os mesmos valores. O
  ciclo de vida do projeto inteiro é outro conjunto: `.paused`/`.delivered`/
  `.closed` na v2, token `hold` no admin, e os valores ficam em
  `src/lib/lifecycle.ts`.

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
