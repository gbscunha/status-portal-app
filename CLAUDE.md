@AGENTS.md

# CLAUDE.md

Portal de Status — app Next.js que mostra a cada cliente da **ITGraph** o
andamento dos projetos dele por uma URL secreta, **sem login**. Repo separado dos
repos dos clientes. Substitui o antigo HTML de status feito à mão.

## Princípios

- Cada cliente acessa `/r/<slug>` e vê **só os projetos dele**. Sem auth — a
  diferenciação é por **slug não-adivinhável** + `noindex`.
- Conteúdo é **dado** (JSON em `content/`), não código. Design system próprio
  v2 "**rastreio de entrega**" (trilho na cor da marca, manifesto, tabs):
  família única Archivo variable (eixo `wdth`), CSS puro. Ver DECISOES §14.
- **SSG puro.** Deploy = `git push` → Vercel redeploya. Sem backend/banco/CMS/ISR.
- O humano revisa e publica (a skill nunca commita/pusha).

## Estrutura

```
src/app/            — App Router. r/[slug]/ = página do cliente; robots.ts; layout (fontes + noindex); page.tsx (raiz institucional)
src/components/     — Server Components (ProjectStack → ProjectSwitcher* → StatusReport → …); *única ilha "use client"
src/lib/            — types.ts (schema Zod), status.ts (estados), content.ts (loaders fs), format.ts (data TZ-safe)
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
  `email?`, `projects[]` (`id`, `name`, `platform?`).
- **Snapshot** (`content/snapshots/<clientId>/<projectId>/<data>.json`): `date`
  (YYYY-MM-DD), `phase?`, `title{text,highlight?}`, `subtitle?`,
  `progress[]{label,percent,state}`, `nextSteps?{title,intro?,items[]{label,desc}}`,
  `pending?[]{label,desc,since?}` (ações do CLIENTE — bloco "Aguardando você"),
  `sections[]{number,title,cards[]{title,status,description,fullWidth?}}`.
- **Estados** (`state`/`status`): só `done` (verde) · `prog` (âmbar) · `plan`
  (cinza). Fonte única: `src/lib/status.ts`. Cores vivem no CSS (`globals.css`).
- Tudo validado com **Zod** em `src/lib/types.ts`. `src/lib/content.ts` faz **parse
  defensivo**: JSON/snapshot inválido é PULADO com aviso, nunca derruba o build.

## Convenções

- Código e comentários em **inglês**; conteúdo (UI e snapshots) em **pt-BR**, em
  **linguagem de cliente** — foco em benefício, ZERO jargão técnico.
- **Server Components** por padrão. Ilhas `"use client"` só com justificativa
  forte e mínimas — hoje existe UMA (`ProjectSwitcher`, tabs via hash).
- Cor da marca via CSS var `--brand`, setada por cliente no `ProjectStack`
  (`style={{ "--brand": brandColor }}`); o CSS usa `var(--brand)`.
- Datas em **America/Sao_Paulo**. Arquivo de snapshot `YYYY-MM-DD[-N].json`,
  **imutável** — nunca sobrescrever; novo status = novo arquivo (isso dá histórico).
- **Next 16:** `params` é `Promise` (dar `await`). Ao usar APIs do Next, consultar
  os docs da versão instalada em `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Segurança / privacidade

- `export const dynamicParams = false` em `r/[slug]` → slug desconhecido dá **404**
  (anti-fishing). NÃO habilitar Cache Components (desliga o `dynamicParams`).
- `noindex` em **3 camadas**: metadata (`layout` + `page`), `app/robots.ts`, e header
  `X-Robots-Tag` (`next.config.ts`).
- **SEM OpenGraph rico** em `/r/[slug]` — o unfurl do link não pode vazar o cliente.
- `page.tsx` raiz **nunca** lista clientes/slugs. Entregar ao cliente só o domínio de
  produção (previews `*.vercel.app` também servem o conteúdo).

## Atualização de status (a skill)

- Skill global `atualizar-status-portal` (`~/.claude/skills/`): roda **de dentro do
  repo do cliente** (que tem um `.status-portal.json` com `portalRepoPath`/`clientId`/
  `projectId`), lê o que avançou, gera o snapshot em linguagem de cliente, mostra o
  **preview e PARA**. O humano revisa e faz `git push` no portal.
- Repos já configurados: `movi-web` (movi-web), `movi-checklist` (movi-app),
  `movi_exporter_app` (movi-exporter).

## Fluxos

- **Novo cliente:** `gen-slug` → criar `content/clients/<id>.json` → primeiro
  snapshot (skill ou à mão) → `git push`. A URL só existe após o redeploy.
- **Novo projeto:** +objeto em `projects[]` do cliente → primeiro snapshot → push.

## Não faça

- NÃO habilitar Cache Components (quebra o `dynamicParams=false`).
- NÃO adicionar OpenGraph/título que revele o cliente; NÃO listar clientes/slugs em
  rota pública.
- NÃO sobrescrever snapshot existente — sempre arquivo novo datado.
- NÃO reintroduzir Tailwind (o design é CSS puro portado); NÃO adicionar dependência
  sem perguntar.
- NÃO fazer a skill commitar/pushar — ela para no preview.

## Verificação

1. `pnpm test` — Vitest verde.
2. `pnpm build` — SSG + typecheck passam.
3. `pnpm lint` — zero.
4. `/r/<slug>` renderiza; `/r/<inexistente>` → 404; raiz não vaza cliente; `<meta
   robots noindex>` + header `X-Robots-Tag` presentes.

## Estado atual

- **Live na Vercel** (repo GitHub privado próprio). Cliente **Movi** (`movi-3xubgjr`)
  com 3 projetos: Painel Administrativo, App dos Motoristas (Fase 0), Movi Exporter
  (produção v1.4.0).
- Runbook (Notion): https://app.notion.com/p/39d605785fb9816a8a7fcdbeac05844b
- **Backlog:** melhorias de UI/UX (adiadas de propósito no 1º deploy). **Ellementi:**
  criar quando o projeto começar (slug reservado `ellementi-emkr3tn`).

## Compactação

Ao resumir o contexto, preservar: decisões explícitas do usuário na sessão; as
invariantes de Segurança/privacidade e a lista "Não faça"; a etapa atual do
ciclo xp-cycle (e o passo corrente do CHECKLIST); comandos/arquivos ainda não
commitados.
