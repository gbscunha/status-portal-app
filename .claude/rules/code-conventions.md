# Convenções de código (derivadas do código existente)

Padrões observados no repo. Ao criar código novo, siga-os; ao encontrar código
que diverge, não "corrija" em massa — mude só com motivo e no escopo da tarefa.

## Estrutura e componentes

- `src/app/` = rotas (App Router). `src/components/` = componentes de
  apresentação. `src/lib/` = lógica pura (schemas, loaders, formatação).
- **Server Components por padrão.** Ilha `"use client"` própria só com
  justificativa forte e mínima. Hoje são CINCO:
  - `PrintButton`: `window.print()`, sem alternativa sem JS.
  - `ProjectSwitcher`: os painéis de projeto, com o hash como fonte de verdade.
  - `ProjectNavItem` e `ProjectCrumb`: o item da sidebar e a trilha leem o
    mesmo hash, por `src/hooks/use-location-hash.ts`. O item também fecha a
    gaveta do celular.
  - `AdminGreeting`: relógio da visita via `useSyncExternalStore`, com snapshot
    de servidor = data do build.

  As ilhas recebem só dados (o sinal como string, nunca um componente). Os
  primitivos do shadcn em `src/components/ui/` servem às duas superfícies. A
  maioria é client (badge, item e breadcrumb receberam `"use client"` local,
  §19); button, card, empty, input e skeleton não são.
- Um componente por arquivo, PascalCase, props tipadas com `type` inline ou
  importado de `@/lib/types`.
- **Páginas de cliente:** a composição segue a hierarquia
  `ProjectStack | ArchiveStack` (cada um dentro do `ClientShell`, que monta a
  `ClientSidebar`, a trilha e as ações) `→ ProjectSwitcher → StatusReport →
  (ReportHeader, LifecycleNotice, PendingList, ProgressList, Legend, ScopeMap,
  NextSteps, Section, Timeline, ContactCta, Footer)`.
  - O `ProjectSwitcher` recebe `panels[]`.
  - A navegação vem de `clientNav` (`src/lib/client-nav.ts`).
  - O item ativo sai do hash, no navegador: é um projeto por vez, sem rota por
    projeto (§14).
- **Admin:** `AdminOverview | AdminProjectView` → `AdminShell` (sidebar, trilha
  e ação principal) → blocos `Admin*`.
  - Os blocos são Server Components que compõem os primitivos de
    `components/ui` e passam só dados e elementos, nunca funções.
  - O item ativo é calculado no servidor (prop `current`).
  - O shell não é um `layout.tsx`: o CSS e a fonte vêm do layout raiz.

## Estilo

- **Um sistema só (DECISOES §19 e §20):** **shadcn/ui + Tailwind v4**, com o
  tema em `src/app/tailwind.css`, importado só pelo layout raiz junto com a
  Inter.
  - Use componentes de `@/components/ui` antes de markup próprio.
  - Use tokens semânticos (`bg-background`, `text-muted-foreground`,
    `text-done`…), nunca cores cruas.
  - Classes condicionais com `cn()` (`@/lib/utils`).
  - Siga a skill `shadcn` do projeto e o `DESIGN.md`.
- **Nenhum CSS fora do `tailwind.css`**, sem CSS-in-JS e sem módulos. Nada de
  regra sem camada além do bloco de impressão, porque ela vence todo utilitário.
- **Impressão:**
  - use `print:` nos componentes;
  - o bloco `@media print` do `tailwind.css` cobre só o que nenhum utilitário
    alcança (o wrapper da sidebar e o conteúdo do `<details>`);
  - painel oculto usa `hidden print:block`, nunca o atributo `hidden`, que o
    preflight esconde com `!important`.
- **Componentes gerados:** `components/ui` e `hooks/use-mobile.ts` saem do CLI
  fixado (`pnpm dlx shadcn@4.21.4 add …`). As edições locais estão listadas no
  §19. Depois de um `add --overwrite`, refaça-as.
- Cor de marca: CSS var `--brand` via style inline (precisa de cast
  `as CSSProperties` — o tipo padrão não aceita custom properties). Nas
  páginas de cliente ela é setada uma vez no `ClientShell`; no admin, em cada
  bloco que mostra o cliente. As classes usam `bg-(--brand)` ou
  `border-(--brand)/20`. A cor só marca: nunca vira cor de texto (contraste)
  nem pinta barra.
- Estados visuais: só `done`/`prog`/`plan`, com valores canônicos em
  `src/lib/status.ts` e os tokens `done`/`prog`/`plan` no `tailwind.css`. O
  ciclo de vida do projeto inteiro é outro conjunto, com os valores em
  `src/lib/lifecycle.ts`. O ponto usa `hold` para em espera, `done` para
  concluído e `plan` para encerrado.

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
