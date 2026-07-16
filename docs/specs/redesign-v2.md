# Spec: Redesign v2 — portal conciso, navegável e com canais de contato

- **Status:** implementada
- **Data:** 2026-07-16

## Problema / motivação

O v1 empilha até 3 relatórios longos numa página só: o cliente rola muito, se
perde, e não tem como agir (tirar dúvida, saber o que depende dele). O objetivo
do v2 é que o cliente abra o link e em ~1 minuto: saiba onde cada projeto está,
veja o que está esperando **dele**, sinta o progresso (valor pago virando
produto) e tenha um canal direto com a ITGraph.

## Escopo

**Dentro:**

1. **Sumário executivo** no topo de cada projeto: fase, progresso geral,
   última atualização, próxima entrega — legível em 5 segundos.
2. **Seletor de projetos** client-side (tabs) — primeira ilha `"use client"`
   do projeto (v2 oficializa JS leve; regra do CLAUDE.md atualizada).
3. **Timeline vertical** com marcos: histórico de snapshots (data + título de
   cada um, que já existem nos JSON) como trilho visual com "você está aqui".
   Substitui a lista de pills.
4. **Bloco "Aguardando você"**: pendências do lado do cliente. Novo campo
   opcional no snapshot: `pending[]{label, desc, since?}`.
5. **Contato direto**: botões WhatsApp (`wa.me` com texto pré-preenchido) e
   e-mail (`mailto:`). Novos campos opcionais no cliente: `whatsapp` (E.164),
   `email`.
6. **Contador de entregas**: nº de cards `done` no snapshot mais recente
   ("N entregas concluídas") — função pura em `src/lib`.
7. **Seções concluídas colapsáveis** via `<details>/<summary>` nativo.
8. **Responsivo + polish**: tipografia fluida (`clamp()`), revisão mobile-first,
   microinterações CSS-only respeitando `prefers-reduced-motion`.

**Fora:** backend/banco (aprovações clicáveis ficam para v3), notificações
automáticas, analytics, PDF button, OpenGraph (proibido por privacidade),
Tailwind ou qualquer dependência nova, mudança das fontes/identidade
("operational precision" evolui, não é substituída).

## Critérios de aceitação (testáveis)

Schema (Vitest, `src/lib/types.test.ts` — TDD real):
- **DADO** um cliente com `whatsapp`/`email` válidos **QUANDO** o schema parseia
  **ENTÃO** aceita; **DADO** whatsapp fora do E.164 **ENTÃO** rejeita.
- **DADO** um snapshot sem `pending` **QUANDO** parseia **ENTÃO** aceita
  (retrocompatível com todos os snapshots existentes).
- **DADO** um snapshot com `pending[]` válido **ENTÃO** aceita e tipa.

Contador (Vitest, `src/lib/*.test.ts`):
- **DADO** um snapshot com N cards `done` **QUANDO** conta entregas **ENTÃO**
  retorna N.

Manual (dev server + view-source):
- **DADO** cliente com 3 projetos **QUANDO** a página abre **ENTÃO** mostra 1
  projeto por vez com tabs; trocar de tab não recarrega a página.
- **DADO** snapshot com `pending` **ENTÃO** bloco "Aguardando você" aparece
  destacado; sem `pending`, o bloco não renderiza.
- **DADO** cliente com `whatsapp` **ENTÃO** botão abre
  `https://wa.me/<numero>?text=<msg com nome do projeto>`; com `email`,
  `mailto:`. Sem os campos, CTAs não renderizam.
- **DADO** 2+ snapshots **ENTÃO** timeline vertical mostra data + título de
  cada um, mais recente marcado.
- Invariantes: `/r/<inexistente>` 404; noindex meta+header; raiz sem cliente;
  1 `<h1>`/1 `<main>`; teclado navega as tabs.

## Impacto nas invariantes

- **Server Components por padrão:** mantido; a exceção (`"use client"`) fica
  restrita ao seletor de projetos. Regra do CLAUDE.md/rules atualizada de
  "sem estado no v1" para "ilhas client-side mínimas e justificadas (v2)".
- **Schema Zod + parse defensivo:** campos novos são todos `optional` —
  snapshots e clients existentes continuam válidos sem tocar em arquivo.
- **Snapshots imutáveis:** timeline lê o histórico existente; nada é reescrito.
- **Privacidade:** wa.me/mailto expõem contato da ITGraph (nunca do cliente);
  nenhum dado novo vaza em rota pública/metadata.
- **Sem dependência nova:** tabs implementadas à mão (~30 linhas), CSS puro.

## Notas

- Direção visual segue a skill `frontend-design` (auditada): evolução da
  identidade atual, assinatura visual = timeline/trilho na cor da marca.
- Auditoria final com `web-design-guidelines` antes do merge.
- v3 (futuro, fora desta spec): aprovações clicáveis (Vercel Functions + KV),
  notificação por e-mail/WhatsApp ao publicar snapshot, GitHub Action gerando
  snapshot draft, analytics.
