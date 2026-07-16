---
description: Inicia uma feature pelo ciclo completo (spec → plan → TDD → verify → document)
---

Inicie o desenvolvimento de uma feature seguindo o ciclo definido em
`.claude/skills/xp-cycle/SKILL.md`. Descrição da feature: $ARGUMENTS

Passos:

1. Leia "Onde estou" no `CHECKLIST.md` (se existir nesta máquina) e a spec
   relacionada em `docs/specs/`, se houver.
2. **Spec:** se a feature é não-trivial e não tem spec, crie uma a partir de
   `docs/specs/FEATURE-template.md` com critérios de aceitação DADO/QUANDO/ENTÃO.
   Confirme os critérios comigo.
3. **Plan:** entre em Plan Mode. Investigue o código, proponha o plano e espere
   minha aprovação. Não escreva código antes disso.
4. **Red:** escreva primeiro os testes Vitest (`src/lib/*.test.ts`) para a
   lógica pura e rode `pnpm test` confirmando que falham. Para componentes/rotas,
   registre o critério de verificação manual antes de implementar.
5. **Green:** implemente o mínimo para passar. `pnpm test` verde.
6. **Refactor:** melhore com os testes protegendo. Gate completo:
   `pnpm test && pnpm build && pnpm lint`.
7. **Commit:** sugira mensagem em Conventional Commits e os arquivos exatos do
   `git add` (nunca `git add .`). Eu decido commitar.
8. **Verify:** rode `/verify` (verificação independente pelo subagent).
9. **Document:** atualize `CHECKLIST.md` ("Onde estou" + checkbox) e acrescente
   a entry datada no `JOURNAL.md`; decisão arquitetural nova vai para
   `docs/DECISOES.md`.

Respeite as invariantes listadas no xp-cycle — em dúvida, pergunte antes.
