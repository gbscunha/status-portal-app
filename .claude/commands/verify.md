---
description: Verificação independente do trabalho atual (subagent cético + gate real)
---

Lance o subagent `code-reviewer` (`.claude/agents/code-reviewer.md`) para
verificar de forma independente o trabalho atual (diff não commitado ou, se
limpo, o último commit). Escopo adicional, se fornecido: $ARGUMENTS

O subagent deve:

1. Rodar de verdade `pnpm test`, `pnpm build` e `pnpm lint` e ler a saída real —
   nunca aceitar o relato de que "passou".
2. Conferir o diff contra as invariantes de `.claude/skills/xp-cycle/SKILL.md`
   (dynamicParams, noindex, sem OG rico, snapshots imutáveis, estados
   done/prog/plan, parse defensivo, pt-BR sem jargão, sem dependência nova).
3. Checar **a mais e a menos**: o que foi entregue além do combinado (escopo
   extra não pedido) e o que ficou faltando (critérios da spec sem cobertura).
4. Se a mudança toca rotas/páginas, verificar os critérios manuais: `/r/<slug>`
   renderiza, `/r/<inexistente>` → 404, raiz não vaza cliente, noindex presente.

Ao final, apresente o relatório do subagent (arquivo:linha, severidade,
correção sugerida) e diga claramente: **aprovado** ou **reprovado com pendências**.
