# Spec: Escopo do projeto

- **Status:** rascunho
- **Data:** 2026-08-07
- **Origem:** item A11 de `docs/specs/estudo-funcionalidades.md`

## Problema / motivação

O portal mostra o numerador sem o denominador. O cliente lê "78%" e não tem como
saber 78% **de quê** — nenhuma tela diz o que o projeto se propõe a entregar.

Há também um problema de modelagem por trás disso: hoje cada snapshot
**redeclara** os rótulos em `progress[]` como texto livre. Nada garante que
"Cadastro do centro de testes" no snapshot de 29/07 seja o mesmo item de 04/08.
Isso impede três coisas que já estão no backlog:

- o diff "o que mudou desde o último relatório" (A2), que hoje só poderia
  comparar strings;
- o registro de mudanças de escopo (A8), que é o documento que sustenta a
  conversa de prazo com o cliente;
- "contratado × entregue" (C2), que continuaria sendo bloco escrito à mão.

Escopo não é uma tela nova: é o eixo que faltava. Marcos de pagamento se
penduram nele depois.

## Escopo desta feature

**Dentro:**

1. **Escopo por projeto**, na config estável (`content/clients/<id>.json`),
   dentro de cada item de `projects[]`:

   ```jsonc
   "scope": {
     "baseline": "2026-07-22",          // data do escopo acordado
     "items": [
       {
         "id": "notas-fiscais",          // estável, kebab-case
         "label": "Notas fiscais",       // pt-BR de cliente
         "desc": "Envio, aprovação e relatórios das notas dos centros.",
         "group": "Operação",            // opcional — agrupa o mapa
         "addedAt": "2026-08-01",        // opcional — ausente = veio do baseline
         "removedAt": "2026-08-20"       // opcional — sai da conta, não do histórico
       }
     ]
   }
   ```

2. **Referência opcional do progresso ao escopo:** `progressItemSchema` ganha
   `scopeId?`. Ausente = comportamento atual, intacto.

3. **Lógica pura nova** em `src/lib/scope.ts`, com TDD:
   - `scopeCoverage(scope, snapshot)` → por item de escopo, o estado derivado do
     `progress[]` que o referencia (item sem referência = `plan`);
   - `scopeChanges(scope)` → itens acrescentados depois do `baseline` e itens
     removidos, com data — a matéria-prima de A8.

4. **Mapa do escopo** (componente novo): o escopo inteiro num grid, cada item
   colorido pelos três estados existentes (`done`/`prog`/`plan`), agrupado por
   `group`. Item acrescentado depois do baseline recebe marca de "acrescentado
   em DD/MM"; removido aparece esmaecido com "removido em DD/MM".

5. **Validação cruzada no loader:** `scopeId` que não existe no escopo do projeto
   gera `console.warn` e o item renderiza **sem** vínculo — o snapshot **não** é
   pulado (pular um relatório inteiro por causa de um id errado é pior que
   renderizá-lo degradado).

**Fora:**

- Migrar os ~20 snapshots existentes para usar `scopeId` — a adoção é
  incremental, projeto a projeto, quando cada um for atualizado.
- Fases no trilho (Descoberta → Construção → Homologação → Entrega): boa ideia,
  spec própria.
- C2 (contratado × entregue), marcos financeiros, contrato (A12), diff (A2) —
  todos consomem esta base, nenhum entra aqui.
- Quadro kanban — rejeitado, com motivos, em A11 do estudo.

## Decisão de compatibilidade

`scope` e `scopeId` são **opcionais**. Projeto sem escopo continua funcionando
exatamente como hoje, e nenhum dos 20 snapshots existentes precisa mudar. O
benefício aparece por projeto, conforme cada um adota — o repo já tem a regra de
não corrigir em massa (`code-conventions.md`).

## Critérios de aceitação (testáveis)

Vitest (`src/lib/scope.test.ts`):

- **DADO** um escopo com 4 itens e um snapshot cujo `progress[]` referencia 2
  deles **QUANDO** `scopeCoverage` roda **ENTÃO** os 2 referenciados assumem o
  `state` do progresso e os outros 2 saem como `plan`.
- **DADO** um item com `addedAt` posterior ao `baseline` **QUANDO**
  `scopeChanges` roda **ENTÃO** ele aparece na lista de acrescentados, com a
  data; item sem `addedAt` não aparece.
- **DADO** um item com `removedAt` **ENTÃO** ele é excluído do total de itens do
  escopo, mas continua presente na saída, marcado como removido.
- **DADO** um projeto **sem** `scope` **ENTÃO** as funções devolvem vazio e nada
  quebra.

Vitest (`src/lib/types.test.ts`): `scope` ausente parseia; `id` vazio rejeita;
`baseline`/`addedAt`/`removedAt` fora de `YYYY-MM-DD` rejeitam.

Vitest (`src/lib/content.test.ts`): snapshot com `scopeId` inexistente **não**
é pulado — carrega, com aviso.

Manual (dev server):

- `/r/<slug>` de um projeto com escopo mostra o mapa, agrupado, com os três
  estados e a contagem ("12 de 18 entregues").
- Projeto sem escopo não mostra o bloco e a página segue idêntica à de hoje.
- Item acrescentado depois do baseline aparece sinalizado.

## Impacto nas invariantes

- **SSG puro:** tudo é derivado em build time, a partir de arquivo. Nenhuma rota
  nova, nenhum `dynamicParams` tocado, nenhuma ilha `"use client"` nova — o mapa
  é read-only, portanto Server Component.
- **Parse defensivo:** o schema novo entra em `types.ts` com Zod; escopo
  inválido derruba só aquele cliente (comportamento atual), e `scopeId` órfão
  degrada em vez de sumir com o relatório.
- **Sem dependência nova:** grid em CSS puro no `globals.css`, com as classes de
  estado que já existem.
- **Linguagem de cliente:** `label` e `desc` do escopo são pt-BR de benefício,
  sem jargão — mesma régua dos snapshots.
- **Imutabilidade:** atenção — o escopo vive na config **estável**, que é editada
  no lugar, diferente do snapshot. A auditabilidade vem de duas fontes: o
  histórico do git e os campos explícitos `addedAt`/`removedAt`, que é por isso
  que remover item significa **marcar**, nunca apagar a linha.

## Notas

- `id` do item de escopo é contrato entre a config e os snapshots: uma vez
  publicado, não renomear (renomear = quebrar o vínculo dos snapshots antigos,
  silenciosamente). Vale um aviso no CLAUDE.md quando isso for implementado.
- A validação cruzada `scopeId` → escopo é candidata natural ao check de CI do
  item D1 do estudo: aviso no build é fácil de ignorar; falha no PR, não.
- Depois desta spec, a ordem que faz sentido é A2 (diff) → C2 (contratado ×
  entregue) → financeiro, todos já apoiados neste eixo.

---

## Anexo: escopo do CT, pronto para colar

> **Isto é rascunho de documentação, não conteúdo publicado.** Está aqui porque
> os snapshots são imutáveis: o mapa só acende quando um snapshot carrega
> `scopeId`, e o de 2026-08-04 não pode ser retrofitado. Publicar o `scope`
> sozinho mostraria os 13 itens como "Planejado" — pior que não mostrar nada.
>
> **Como usar:** na próxima entrega real do CT, cole o bloco 1 no
> `content/clients/fgv.json` e os `scopeId` do bloco 2 no `progress[]` do
> **snapshot novo** (nunca no de 04/08). Revise a linguagem antes — foi escrita
> a partir das barras e das seções 02/03/04 do snapshot de 04/08, então não
> inventa compromisso nenhum, mas o tom é seu.

`baseline: 2026-07-22` = data do primeiro snapshot do CT. O painel analítico de
vagas entra com `addedAt: 2026-07-29` porque é o único item que não existia no
sistema antigo — nasceu depois da linha de base e aparece marcado como
"acrescentado em", que é exatamente o registro de mudança de escopo que a A8
quer.

### Bloco 1 — `content/clients/fgv.json`, dentro do projeto `ct`

```jsonc
"scope": {
  "baseline": "2026-07-22",
  "items": [
    { "id": "disponibilidade-vagas", "label": "Disponibilidade e vagas", "desc": "Grade de horários, janelas especiais e eventos que fecham o centro.", "group": "Operação diária" },
    { "id": "consulta-agendamentos", "label": "Consulta de agendamentos", "desc": "Busca cruzada de candidatos e agendamentos, com filtros encadeados.", "group": "Operação diária" },
    { "id": "administracao-pauta", "label": "Administração e pauta do dia", "desc": "Pauta de candidatos, ocorrências e preços por exame.", "group": "Operação diária" },
    { "id": "provas", "label": "Provas e envio de arquivos", "desc": "Confirmados, consolidados e o envio dos arquivos de prova.", "group": "Operação diária" },
    { "id": "acesso-login", "label": "Acesso e login unificado", "desc": "Entrada única e segura, com controle de perfis por pessoa.", "group": "Cadastro e acesso" },
    { "id": "cadastro-centro", "label": "Cadastro do centro de testes", "desc": "Dados gerais, contrato, financeiro, estrutura técnica e equipe.", "group": "Cadastro e acesso" },
    { "id": "notas-fiscais", "label": "Notas fiscais", "desc": "Envio pelos centros, aprovação, estatísticas e relatórios.", "group": "Financeiro e comunicação" },
    { "id": "notificacoes", "label": "Notificações e comunicados", "desc": "Disparo por e-mail com editor, prévia de destinatários e histórico.", "group": "Financeiro e comunicação" },
    { "id": "painel-vagas", "label": "Painel analítico de vagas", "desc": "Visão da saúde das vagas por período, região e tempo de espera.", "group": "Análise e treinamento", "addedAt": "2026-07-29" },
    { "id": "treinamento", "label": "Treinamento da equipe", "desc": "Vídeos com acompanhamento, manuais e certificados de avaliação.", "group": "Análise e treinamento" },
    { "id": "area-candidato", "label": "Área do candidato", "desc": "Inscrição, agendamento de prova e pagamento.", "group": "Fronteiras restantes" },
    { "id": "integracoes-parceiros", "label": "Integrações com parceiros", "desc": "Trocas automáticas com ANAC, Anbima e o fornecedor de provas.", "group": "Fronteiras restantes" },
    { "id": "documentos-lgpd", "label": "Documentos LGPD", "desc": "Publicação e atualização de termos de uso e aviso de cookies.", "group": "Fronteiras restantes" }
  ]
}
```

### Bloco 2 — `scopeId` no `progress[]` do snapshot novo

| Rótulo da barra (como está hoje) | `scopeId` |
| --- | --- |
| Notas fiscais | `notas-fiscais` |
| Notificações e comunicados | `notificacoes` |
| Disponibilidade e vagas | `disponibilidade-vagas` |
| Acesso e login unificado | `acesso-login` |
| Consulta geral de agendamentos | `consulta-agendamentos` |
| Painel analítico de vagas (novidade) | `painel-vagas` |
| Cadastro do centro de testes | `cadastro-centro` |
| Provas: confirmados, consolidados e envio de arquivos | `provas` |
| Administração e pauta do dia | `administracao-pauta` |
| Treinamento: vídeos, manuais e avaliações | `treinamento` |
| Documentos LGPD (termos e cookies) | `documentos-lgpd` |
| Área do candidato: inscrição, agendamento e pagamento | `area-candidato` |
| Integrações com parceiros (ANAC, Anbima, provas) | `integracoes-parceiros` |

### Conferido

Este par foi renderizado de verdade (edição temporária, revertida sem tocar em
snapshot commitado): saiu **"6 de 13 itens entregues"**, cinco grupos, a etiqueta
"acrescentado em 29 Jul 2026" no painel de vagas, nenhum `scopeId` órfão no log
do build, e o mapa apareceu em 1 dos 3 projetos da FGV — os outros dois saíram
idênticos a hoje.
