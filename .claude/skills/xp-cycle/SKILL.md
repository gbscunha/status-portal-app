---
name: xp-cycle
description: >
  Ciclo de desenvolvimento do Portal de Status (TDD/XP adaptado). Use SEMPRE que
  for implementar uma feature, corrigir um bug ou refatorar código neste repo —
  antes de escrever qualquer código de produção. Não se aplica a edição pura de
  conteúdo (snapshots/clients JSON), que segue o fluxo da skill
  atualizar-status-portal.
---

# xp-cycle — ciclo de desenvolvimento

O humano é o piloto; você é o copiloto. Nenhuma etapa é pulada em silêncio —
se uma não se aplica, diga o porquê.

## As 6 etapas

1. **Plan** — Ler "Onde estou" no `CHECKLIST.md`. Se a feature é não-trivial,
   escrever/atualizar a spec em `docs/specs/` (critérios DADO/QUANDO/ENTÃO).
   Entrar em Plan Mode, propor o plano e **esperar aprovação**.
2. **Red** — Escrever o teste primeiro e vê-lo falhar:
   - Lógica pura (`src/lib`): teste Vitest co-locado (`src/lib/<mod>.test.ts`),
     rodar `pnpm test` e confirmar o vermelho.
   - Componentes/rotas: não há teste automatizado (decisão consciente). O "Red"
     é definir ANTES o critério de verificação manual (o que deve aparecer em
     `/r/<slug>`, o que deve dar 404, etc.).
3. **Green** — Código mínimo para passar. `pnpm test` verde.
4. **Refactor** — Melhorar com os testes protegendo. Nunca refatorar com teste
   vermelho. `pnpm test && pnpm build && pnpm lint` ao final.
5. **Commit** — Pequeno e específico. Conventional Commits (`feat:`, `fix:`,
   `docs:`, `status:`…). `git add` seletivo por arquivo — NUNCA `git add .`.
   Quem pusha é o humano.
6. **Documentar** — Atualizar `CHECKLIST.md` (só "Onde estou" + checkbox) e
   acrescentar entry datada no `JOURNAL.md`. Decisão arquitetural nova → seção
   no `docs/DECISOES.md`. Padrão novo que muda comportamento → linha no
   `CLAUDE.md` (mantendo-o < 150 linhas).

## Stack de testes

| Camada                      | Ferramenta            | Onde                          |
| --------------------------- | --------------------- | ----------------------------- |
| Lógica pura (lib)           | Vitest                | `src/lib/*.test.ts`           |
| Schemas Zod                 | Vitest                | `src/lib/*.test.ts`           |
| Componentes (RSC) e rotas   | Verificação manual    | `pnpm build` + checar rotas   |
| Gate completo               | —                     | `pnpm test && pnpm build && pnpm lint` |

Verificação manual das rotas: `pnpm dev` → `/r/<slug>` renderiza; `/r/<inexistente>`
→ 404; raiz não vaza cliente; `<meta name="robots">` com noindex presente.

## Invariantes (nenhuma mudança pode violar)

- [ ] `export const dynamicParams = false` intacto em todas as rotas dinâmicas
      (`r/[slug]`, `r/[slug]/anteriores`, `a/[slug]`,
      `a/[slug]/[clientId]/[projectId]`); Cache Components NUNCA habilitado.
- [ ] CSS isolado por segmento (DECISOES §19): o layout raiz não importa CSS;
      páginas de cliente só com `globals.css`, admin só com `tailwind.css`.
- [ ] `noindex` nas 3 camadas: metadata (layout + page), `app/robots.ts`,
      header `X-Robots-Tag` (`next.config.ts`).
- [ ] Nenhum OpenGraph rico ou título que revele o cliente em `/r/[slug]`.
- [ ] Nenhuma rota de cliente (nem a raiz) lista clientes ou slugs; exceção
      única e consciente: painel admin `/a/<slug>` (DECISOES §15).
- [ ] Snapshots são imutáveis: novo status = novo arquivo `YYYY-MM-DD[-N].json`,
      nunca sobrescrever.
- [ ] Estados de status são só `done | prog | plan` (`src/lib/status.ts` é a
      fonte única; cores só no CSS).
- [ ] Parse defensivo preservado: JSON inválido é pulado com aviso, nunca
      derruba o build.
- [ ] Conteúdo visível ao cliente em pt-BR, linguagem de benefício, zero jargão.
- [ ] Nenhuma dependência nova sem perguntar ao humano.
- [ ] Datas sempre TZ-safe via `src/lib/format.ts` — nunca `new Date("YYYY-MM-DD")`.

## Anti-patterns

- Implementar antes de escrever/definir o teste ou critério de verificação.
- `git add .` ou commit gigante misturando preocupações.
- Refatorar com testes falhando.
- Rodar no automático sem o humano revisar o plano (Plan Mode existe pra isso).
- Marcar como concluído sem rodar o gate (`pnpm test && pnpm build && pnpm lint`)
  e ler a saída real.
- Inflar o CHECKLIST com histórico datado (isso vai pro JOURNAL).
