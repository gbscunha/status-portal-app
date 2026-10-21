@AGENTS.md

# CLAUDE.md

Portal de Status — app Next.js que mostra a cada cliente da **ITGraph** o
andamento dos projetos dele por uma URL secreta, **sem login**. Repo separado dos
repos dos clientes. Substitui o antigo HTML de status feito à mão.

## Princípios

- Cada cliente acessa `/r/<slug>` e vê **só os projetos dele**. Sem auth — a
  diferenciação é por **slug não-adivinhável** + `noindex`.
- Conteúdo é **dado** (JSON em `content/`), não código. Visual: **shadcn/ui** + Tailwind, tema
  padrão + Inter, no admin e nas páginas de cliente (§19, §20; sistema no `DESIGN.md`).
- **SSG puro.** Deploy = `git push` → Vercel redeploya. Sem backend/banco/CMS/ISR.
- O humano revisa e publica (a skill nunca commita/pusha).

## Estrutura

```
src/app/            — App Router. r/[slug]/ (+ anteriores/) = cliente; a/[slug]/ (+ [clientId]/[projectId]/) = admin; layout raiz importa o único CSS (tailwind.css) + Inter; not-found.tsx; robots.ts; page.tsx (raiz)
src/components/     — Server Components. Cliente: ProjectStack | ArchiveStack → ClientShell (sidebar) → ProjectSwitcher (ilha, hash) → StatusReport. Admin: Admin* → AdminShell; ui/ = shadcn gerado (edições locais no §19)
src/lib/            — types.ts (Zod), status.ts, lifecycle.ts, admin.ts (painel), client-nav.ts (navegação do cliente), content.ts (loaders fs), format.ts (data TZ-safe), utils.ts (cn)
content/clients/    — <id>.json: config estável do cliente
content/snapshots/  — <cliente>/<projeto>/<AAAA-MM-DD>.json: status datado, imutável
scripts/gen-slug.mjs — gera slug não-adivinhável (roda 1x por cliente)
```

## Comandos

```bash
pnpm dev            # dev server :3000
pnpm build          # build SSG + typecheck
pnpm lint           # ESLint
pnpm test           # Vitest (src/lib/*.test.ts)
node scripts/gen-slug.mjs <nome>   # gera um slug (fixar no clients/<id>.json)
```

## Ciclo de desenvolvimento

- Sessão abre lendo **"Onde estou"** no `CHECKLIST.md` (arquivo local,
  gitignorado; histórico datado no `JOURNAL.md`, também local).
- Feature/bug/refactor segue `.claude/skills/xp-cycle/SKILL.md`: Plan → Red →
  Green → Refactor → Commit → Documentar. `/new-feature` dispara o ciclo;
  `/verify` roda a verificação independente (subagent `code-reviewer`).
- Convenções de código: `.claude/rules/code-conventions.md`. Skills externas:
  `.claude/rules/skills-policy.md`. Specs: `docs/specs/` (template incluso).
  Decisões arquiteturais (o "porquê"): `docs/DECISOES.md`.

## Git

- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `status:`…), commits
  pequenos e específicos.
- `git add` **seletivo por arquivo** — NUNCA `git add .`. Nunca commitar
  segredos/`.env`/build.
- Mudança de **código**: branch por feature. Snapshot/conteúdo pode ir direto
  na `main` (fluxo real de publicação). Quem pusha é o humano.

## Modelo de dados

- **Cliente** (`content/clients/<id>.json`): `id`, `name`, `contact?`, `slug`,
  `brandColor` (hex `#RRGGBB`), `vendor`, `whatsapp?` (E.164, canal da ITGraph),
  `email?`, `offline?` (§20), `projects[]` (`id`, `name`, `platform?`, `scope?{baseline,items[]}`,
  `lifecycle?`, `contractUrl?` — link para o contrato ASSINADO, nunca arquivo hospedado).
- **Ciclo de vida** (`lifecycle`, na config, nunca no snapshot): ausente = em andamento ·
  `paused{reason,since?}` ("Em espera") · `delivered{deliveredAt}` · `closed{closedAt,reason?}`
  (mês `YYYY-MM`; encerrado ≠ entregue). Fonte única: `src/lib/lifecycle.ts`. DECISOES §17.
- **Snapshot** (`content/snapshots/<clientId>/<projectId>/<data>.json`): `date`
  (YYYY-MM-DD), `phase?`, `title{text,highlight?}`, `subtitle?`,
  `progress[]{label,percent,state,scopeId?,eta?}` (`eta` é MÊS `YYYY-MM`, nunca
  dia), `nextSteps?{title,intro?,items[]{label,desc}}`,
  `pending?[]{label,desc,since?}` (ações do CLIENTE — bloco "Aguardando você"),
  `sections[]{number,title,cards[]{title,status,description,fullWidth?}}`.
- **Estados** (`state`/`status`): só `done` (verde) · `prog` (âmbar) · `plan`
  (cinza). Fonte única: `src/lib/status.ts`. Cores nos tokens do `tailwind.css`.
- Tudo validado com **Zod** em `src/lib/types.ts`. `src/lib/content.ts` faz **parse
  defensivo**: JSON/snapshot inválido é PULADO com aviso, nunca derruba o build.

## Convenções

- Código e comentários em **inglês**; conteúdo (UI e snapshots) em **pt-BR**, em
  **linguagem de cliente** — foco em benefício, ZERO jargão técnico.
- **Server Components** por padrão. Ilhas `"use client"` próprias só com justificativa forte — hoje
  CINCO: `ProjectSwitcher`, `ProjectNavItem` e `ProjectCrumb` (o hash), `AdminGreeting`, `PrintButton`.
- Cor da marca: CSS var `--brand` inline (no `ClientShell`; no admin, por bloco). Só marca: nunca cor de texto nem barra.
- Datas em **America/Sao_Paulo**. Arquivo de snapshot `YYYY-MM-DD[-N].json`,
  **imutável** — nunca sobrescrever; novo status = novo arquivo (isso dá histórico).
- **Next 16:** `params` é `Promise` (dar `await`). Ao usar APIs do Next, consultar
  os docs da versão instalada em `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Segurança / privacidade

- `export const dynamicParams = false` em TODAS as rotas dinâmicas (`r/` e `a/`) → slug ou par
  desconhecido dá **404** (anti-fishing). NÃO habilitar Cache Components (desliga o `dynamicParams`).
- `noindex` em **3 camadas**: metadata (`layout` + `page`), `app/robots.ts`, e header
  `X-Robots-Tag` (`next.config.ts`).
- **SEM OpenGraph rico** em `/r/[slug]` — o unfurl do link não pode vazar o cliente.
- Nenhuma rota **de cliente** (nem a raiz) lista clientes/slugs. Exceção única:
  o painel interno `/a/<slug-admin>` (`content/admin.json`, mesmo modelo de
  segurança; se vazar, rodar `gen-slug` e trocar o slug — DECISOES §15). O slug
  admin NUNCA vai para cliente. Entregar ao cliente só o domínio de produção
  (previews `*.vercel.app` também servem o conteúdo).

## Atualização de status (a skill)

- Skill global `atualizar-status-portal` (`~/.claude/skills/`): roda **de dentro do
  repo do cliente** (que tem um `.status-portal.json` com `portalRepoPath`/`clientId`/
  `projectId`), lê o que avançou, gera o snapshot em linguagem de cliente, mostra o
  **preview e PARA**. O humano revisa e faz `git push` no portal.
- Repos configurados: `creci`, `ct-bff`, `ct-react`, `prepona-api` (FGV), `diagnostico` (Ellementi), `veraerp` (Neon).

## Fluxos

- **Novo cliente:** `gen-slug` → criar `content/clients/<id>.json` → primeiro
  snapshot (skill ou à mão) → `git push`. A URL só existe após o redeploy.
- **Novo projeto:** +objeto em `projects[]` do cliente → primeiro snapshot → push.
- **Pausar/retomar/concluir/encerrar:** editar o `lifecycle` do projeto em `clients/<id>.json` → push.
- **Tirar a página do ar:** `"offline": true` no cliente → push (404; dados ficam no admin, §20).

## Não faça

- NÃO habilitar Cache Components (quebra o `dynamicParams=false`).
- NÃO adicionar OpenGraph/título que revele o cliente; NÃO listar clientes/slugs em
  rota pública.
- NÃO sobrescrever snapshot existente — sempre arquivo novo datado.
- NÃO renomear `id` de item de escopo publicado — quebra o vínculo dos snapshots.
- NÃO importar CSS fora do layout raiz nem criar regra sem camada além do bloco de impressão (ela
  vence todo utilitário do Tailwind, §19); NÃO adicionar dependência sem perguntar.
- NÃO fazer a skill commitar/pushar — ela para no preview.

## Verificação

1. `pnpm test && pnpm build && pnpm lint` — verde, SSG+typecheck OK, zero avisos.
2. `/r/<slug>` e `/a/<slug>/…` renderizam; `/r/<inexistente>` e par trocado → 404; raiz não vaza
   cliente; noindex (meta + `X-Robots-Tag`); o hash troca o projeto e o PDF sai com todos.

## Estado atual

- **Live na Vercel** em **https://portal.itgraph.com.br** (CNAME no Cloudflare,
  DNS-only; repo GitHub privado). Clientes no ar: FGV, Ellementi, Neon (Movi fora do ar). Painel admin
  em `/a/` (slug em `content/admin.json`), já em shadcn; o cliente migra num PR próprio.
- Runbook (Notion): https://app.notion.com/p/39d605785fb9816a8a7fcdbeac05844b
- **Backlog:** ver CHECKLIST local (cron de rebuild diário, analytics, v3).

## Compactação

Ao resumir o contexto, preservar: decisões explícitas do usuário na sessão; as invariantes de
Segurança/privacidade e a lista "Não faça"; a etapa atual do ciclo xp-cycle (e o passo corrente
do CHECKLIST); comandos/arquivos ainda não commitados.
