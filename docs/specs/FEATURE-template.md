# Spec: <nome da feature>

> Copie este arquivo para `docs/specs/<slug-da-feature>.md`. A spec cobre o
> **quê**; o porquê de decisões arquiteturais vai em `docs/DECISOES.md`.

- **Status:** rascunho | aprovada | implementada
- **Data:** AAAA-MM-DD

## Problema / motivação

Que dor ou necessidade esta feature resolve, e para quem.

## Escopo

**Dentro:** o que será feito.
**Fora:** o que explicitamente NÃO será feito nesta feature (evita escopo
implícito).

## Critérios de aceitação (testáveis)

- **DADO** <contexto> **QUANDO** <ação> **ENTÃO** <resultado observável>
- **DADO** ... **QUANDO** ... **ENTÃO** ...

Cada critério deve mapear para um teste Vitest (lógica em `src/lib`) ou para um
passo de verificação manual explícito (componentes/rotas).

## Impacto nas invariantes

Quais invariantes do projeto (ver `.claude/skills/xp-cycle/SKILL.md`) esta
feature toca, e como continuam garantidas.

## Notas

Referências, esboços, dúvidas abertas.
