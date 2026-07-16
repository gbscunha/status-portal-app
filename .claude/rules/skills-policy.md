# Política de skills externas

Regras para descobrir, auditar e usar skills de terceiros neste projeto.

1. **Gate de confirmação.** Nunca instalar/habilitar uma skill externa sem
   perguntar ao humano antes, mostrando o que ela faz e de onde vem.
2. **Auditar antes de usar.** Ler o `SKILL.md` (e scripts que ele referencia)
   inteiro antes da primeira execução. Se a skill roda comandos, listar quais.
3. **Escopo e versionamento.** Skill adotada pelo projeto vive versionada em
   `.claude/skills/` deste repo. Skills pessoais/globais (`~/.claude/skills/`)
   não viram dependência implícita do projeto — se o fluxo do projeto depende
   dela, documentar no CLAUDE.md (como a `atualizar-status-portal`).
4. **As regras do projeto vencem.** Em conflito entre uma skill externa e o
   CLAUDE.md/rules deste repo, o repo manda. Uma skill nunca autoriza commit,
   push, deploy ou dependência nova que as regras do projeto proíbem.
