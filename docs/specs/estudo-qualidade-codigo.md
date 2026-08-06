# Estudo: qualidade do código (SOLID + Pragmático)

> Este arquivo **não é uma spec** — é uma auditoria de qualidade que alimenta o
> backlog de refactor. Cada item que virar trabalho ganha branch própria e
> segue o `xp-cycle` (Red → Green → Refactor).

- **Status:** rascunho (nenhum item aprovado)
- **Data:** 2026-08-06

## Baseline verificado

Antes da análise, o estado do repo foi conferido rodando os comandos de
verdade:

| Comando          | Resultado                            |
| ---------------- | ------------------------------------ |
| `pnpm test`      | 37/37 verdes                         |
| `pnpm lint`      | zero                                 |
| `tsc --noEmit`   | zero                                 |
| `pnpm build`     | 10 páginas estáticas geradas         |

**Nenhum bug aberto.** Tudo abaixo é qualidade — legibilidade, acoplamento,
testabilidade e contratos. Nada aqui é urgente; a lista existe para que o
próximo refactor seja escolhido por retorno, não por proximidade.

---

## Alto impacto

### 1. `content.ts` é o núcleo do sistema e não tem um único teste

`src/lib/content.ts:15-17`, `:40`, `:62`, `:133`

O invariante mais citado do projeto — "JSON inválido é PULADO, nunca derruba o
build" (CLAUDE.md e `DECISOES.md` §Pegadinhas) — só existe como código.
`src/lib/content.test.ts` importa apenas `compareSnapshotFiles` e
`latestSnapshotFilesPerDay`; o skip de cliente inválido, o dedupe de slug
(`:77`) e o `getAdminSlug` nunca rodam em teste, porque os diretórios são
constantes de módulo derivadas de `process.cwd()`.

- **Princípio:** DIP (dependência de um detalhe concreto — o filesystem) +
  "teste a invariante em que você aposta" (Pragmático).
- **Sugestão:** separar política de I/O. A política vira pura e testável; o
  wrapper `fs` fica trivial:

  ```ts
  // pure — testable with fixtures
  export function parseClients(entries: { file: string; data: unknown }[]): Client[] { … }
  export function getAllClients(): Client[] { return parseClients(readJsonFiles(CLIENTS_DIR)); }
  ```

  Alternativa mais barata: aceitar `root = CONTENT_DIR` como parâmetro default
  nos três loaders e apontar os testes para `content/__fixtures__`.

  Testes a escrever: JSON quebrado, cliente sem `brandColor`, dois clientes com
  o mesmo slug, diretório inexistente.

- **Custo:** médio.

### 2. O contrato de data ISO é fraco e os fallbacks são código morto

`src/lib/types.ts:87` e `:92` (regex duplicado) · `src/lib/format.ts:34-36`,
`:41-43`, `:59-62`, `:68-71`

O regex `^\d{4}-\d{2}-\d{2}$` aceita `"2026-13-45"`. Rodando a lógica de
`formatPtDate`: `"2026-13-45"` → `"45  2026"` (mês vazio, espaço duplo); uma
string qualquer → `"NaN  NaN"`. Ou seja: um snapshot com data inválida **passa**
pelo parse defensivo e renderiza lixo para o cliente — exatamente o cenário que
o parse defensivo existe para evitar.

Pior: os fallbacks `(m ?? 1)` / `(y ?? 0)` são código morto — confirmado com
`tsc --strict` que, sem `noUncheckedIndexedAccess`, `iso.split("-").map(Number)`
tipa como `number`, nunca `undefined`. Eles não protegem nada, só dão aparência
de proteção e são intestáveis.

- **Princípio:** design by contract + "crash early" (validar na fronteira, não
  maquiar no meio) + DRY (o regex repetido 2x, o `split/map(Number)` 4x).
- **Sugestão:** um schema único que valida data de calendário de verdade,
  reusado em `date` e `since`; e um parser único em `format.ts`:

  ```ts
  // types.ts
  export const isoDateSchema = z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "deve ser YYYY-MM-DD")
    .refine((s) => new Date(`${s}T00:00:00Z`).toISOString().startsWith(s), "data inexistente");

  // format.ts — uma vez só, sem ?? mortos
  function isoParts(iso: string): [number, number, number] { … }
  ```

- **Custo:** baixo. **Melhor retorno da lista.**

### 3. `ProjectSwitcher` pareia tabs e painéis por índice posicional

`src/components/ProjectSwitcher.tsx:29`, `:37`, `:82-92` ·
`src/components/ProjectStack.tsx:76-91`

O `ProjectStack` já tem a estrutura certa (`reports` com `project` +
`snapshot`), mas a **desmonta** em dois canais paralelos — `tabs` como prop, os
relatórios como `children` — e o filho os **rejunta por índice**: `panels[i]` é
rotulado com `tabs[i].id`. Nada no tipo garante `panels.length === tabs.length`,
e `Children.toArray` descarta filhos falsy silenciosamente. Hoje funciona porque
o pai filtrou os nulos antes (`ProjectStack.tsx:26`) — a correção é invisível no
ponto do acoplamento.

- **Princípio:** "não programe por coincidência" + tipos expressivos (tornar o
  pareamento estrutural, não convencional).
- **Sugestão:** uma lista só, com o conteúdo junto. Elemento de Server
  Component passado como prop funciona igual a `children`:

  ```ts
  type Panel = { id: string; name: string; content: ReactNode };
  export function ProjectSwitcher({ panels }: { panels: Panel[] }) { … }
  ```

  Some `Children.toArray`, some `tabs[i]`, e o `select(index)` passa a operar
  sobre a mesma lista.

- **Custo:** baixo/médio.

### 4. `AdminDashboard` acumula I/O, regra de negócio e apresentação

`src/components/AdminDashboard.tsx:7`, `:11-13`, `:53-84`

Um componente faz: carregar clientes, carregar snapshots por projeto, decidir
"parado há N dias" (`STALE_DAYS = 14`, regra documentada em `DECISOES.md` §15),
contar pendências, calcular percentual e renderizar um `map` aninhado com dois
`return` de JSX. Nenhuma dessas regras tem teste. Além disso,
`getProjectSnapshots(client.id, project.id)[0]` (`:54`) reimplementa
`getLatestSnapshot` (`content.ts:157`), que existe e não tem nenhum chamador.

- **Princípio:** SRP (três motivos de mudança no mesmo arquivo) + DRY.
- **Sugestão:** extrair um `src/lib/admin.ts` puro:

  ```ts
  export type ProjectRow =
    | { name: string; kind: "empty" }
    | { name: string; kind: "report"; dateIso: string; percent: number; pendingCount: number; idleDays: number; stale: boolean };
  export function buildAdminOverview(clients: Client[], today: string, load = getProjectSnapshots): ClientRow[]
  ```

  O componente vira um `map` sem lógica, e o limiar de 14 dias, o plural e o
  "sem relatório" ganham testes.

- **Custo:** médio.

---

## Médio impacto

### 5. O `mast` está duplicado nos dois ramos do `ProjectStack`

`src/components/ProjectStack.tsx:32-40` vs `:62-70`

Os dois `return` repetem `<main className="client" style={brandStyle}>` +
header do mast + `ContactCta variant="compact"` palavra por palavra. Uma
mudança no cabeçalho precisa ser feita duas vezes.

- **Princípio:** DRY.
- **Sugestão:** um `ClientShell` (ou variável `mast`) envolvendo os dois casos;
  o `if (reports.length === 0)` decide só o miolo.
- **Custo:** baixo.

### 6. Regra de domínio mora dentro do componente de layout

`src/components/ProjectStack.tsx:20-23`

`title: s.milestone ?? s.subtitle ?? s.title.text` é uma política de conteúdo —
a cascata de fallback que define o texto do histórico — escondida num `.map()`
de shell de página. Não é testável e não é descobrível por quem lê `src/lib/`.

- **Princípio:** SRP / ortogonalidade.
- **Sugestão:** `export function timelineEntries(snapshots: Snapshot[]):
  TimelineEntry[]` em `src/lib/summary.ts`, com teste dos três níveis de
  fallback.
- **Custo:** baixo.

### 7. O mesmo algoritmo de "destacar trecho do título" existe em dois arquivos

`src/components/ReportHeader.tsx:11-25` (`TitleText`) vs
`src/components/AdminGreeting.tsx:9-19` (`PhraseTitle`)

Idênticos exceto pela classe (`accent` vs `admin-accent`) e por um `if
(highlight)` a mais.

- **Princípio:** DRY.
- **Sugestão:** um `<Highlight text={…} highlight={…} className="accent" />`
  compartilhado. Sem diretiva `"use client"` — ele é puro e pode ser incluído no
  bundle da ilha sem custo relevante.
- **Custo:** baixo.

### 8. `StatusState` é declarado duas vezes, em módulos diferentes

`src/lib/status.ts:7` e `src/lib/types.ts:105`

Duas definições exportadas do mesmo tipo, e o código importa de lugares
diferentes: `StatusPill.tsx:1` puxa de `@/lib/status`, todo o resto de
`@/lib/types`. São estruturalmente iguais hoje — o que significa que a
divergência, se acontecer, será silenciosa.

- **Princípio:** DRY / fonte única de verdade (o próprio comentário de
  `status.ts:1` declara a intenção).
- **Sugestão:** em `types.ts`, trocar a linha 105 por
  `export type { StatusState } from "./status";`.
- **Custo:** baixo.

### 9. `Timeline` busca a data atual sozinho, quebrando o padrão de dados por prop

`src/components/Timeline.tsx:22` (`const today = todayIso();`)

Todo o resto da árvore recebe dados prontos do pai (`StatusReport` distribui
`snapshot`, `history`, `client`); `AdminDashboard.tsx:12` calcula `today` uma
vez no topo e passa adiante. `Timeline` é o único que alcança o relógio ambiente
lá do fundo da árvore — dependência oculta, não testável, e duas leituras
diferentes de "hoje" na mesma página.

- **Princípio:** DIP + princípio da menor surpresa.
- **Sugestão:** `today` como prop (com default `todayIso()` se quiser
  compatibilidade), passada por `StatusReport`.
- **Custo:** baixo.

### 10. O padrão `safeParse → console.warn → skip` está escrito três vezes

`src/lib/content.ts:44-55`, `:69-76`, `:141-148`

Três blocos quase idênticos, com formatos de mensagem levemente diferentes
(`"admin.json inválido, ignorando:"` vs `"cliente inválido, pulando"` vs
`"snapshot inválido, pulando"`). É a política mais importante do módulo,
espalhada em variações.

- **Princípio:** DRY / ortogonalidade.
- **Sugestão:** `function parseOrWarn<T>(schema: ZodType<T>, data: unknown,
  label: string): T | null` — uma mensagem, um comportamento, e o teste do item
  1 cobre tudo de uma vez.
- **Custo:** baixo.

### 11. Um novo estado de status não quebra nada — só renderiza sem cor

`src/lib/status.ts:5` · `src/app/globals.css:367-375`, `:419-427`, `:570-582`

`STATUS_LABELS` é `Record<StatusState, string>`, então acrescentar um estado dá
erro de compilação (bom). Mas o CSS tem `.pill.<estado>`, `.dot.<estado>` e
`.fill.<estado>` triplicados por estado, e nada acusa a falta — a "fonte única
de verdade" só cobre metade do contrato.

- **Princípio:** OCP (extensão exige modificação em lugar distante e não
  sinalizado) + automação.
- **Sugestão:** um teste barato que lê o CSS e fecha o contrato:

  ```ts
  const css = fs.readFileSync("src/app/globals.css", "utf-8");
  for (const s of STATUS_STATES)
    for (const p of ["pill", "dot", "fill"]) expect(css).toContain(`.${p}.${s}`);
  ```

- **Custo:** baixo.

### 12. O trilho do relatório enumera à mão cada tipo de bloco, em duas listas

`src/app/globals.css:268-272` e `:906-910`

Adicionar um bloco novo ao `StatusReport` (ex.: "Riscos") exige lembrar de
editar duas listas idênticas de cinco seletores em outro arquivo — senão o bloco
aparece sem o losango do trilho, sem erro nenhum.

- **Princípio:** OCP + DRY.
- **Sugestão:** classe compartilhada `.flow-block` nos blocos
  (`.flow > .flow-block::before`), ou simplesmente `.flow > *::before`. Bônus na
  mesma linha: `.flow::before` (`:251-258`) e `.rail::before` (`:593-600`) são a
  mesma regra escrita duas vezes — dá para uni-las numa lista de seletores.
- **Custo:** baixo.

---

## Polimento

### 13. Classes CSS mortas no JSX

`src/components/ProjectSwitcher.tsx:56` (`className="switcher"`) ·
`src/components/ContactCta.tsx:26` e `:36` (`cta-wa`, `cta-mail`)

Cruzando todas as classes do JSX com as do `globals.css`, essas três não têm
nenhuma regra. São ganchos que não engancham em nada — janela quebrada clássica
(o próximo leitor procura o estilo e não acha). Ou estilize (o WhatsApp merece
cor própria?), ou remova. **Princípio:** evitar broken windows. **Custo:** baixo.

### 14. `getLatestSnapshot` é código morto

`src/lib/content.ts:157-162` — zero chamadores em `src/` e `scripts/`. Enquanto
isso `AdminDashboard.tsx:54` reescreve o mesmo `[0]` na mão. Ou apagar, ou usar
no admin (resolve o item 4 de quebra). **Custo:** baixo.

### 15. Non-null assertion redundante

`src/lib/content.ts:109` (`m[1]!`) — confirmado com `tsc --strict` isolado:
`RegExpExecArray` indexado devolve `string`, não `string | undefined` (o projeto
não usa `noUncheckedIndexedAccess`). O `!` não silencia nada, só treina o leitor
a ignorar `!`. O `byFile.get(file)!` da linha 153 é legítimo (`Map.get` é
opcional de verdade), mas some se você mapear entradas em vez de chaves.
**Custo:** baixo.

### 16. Metade dos comentários viola a própria regra de idioma

`src/lib/types.ts:4-6`, `src/lib/content.ts:11-13` e `:38-39`,
`src/lib/status.ts:1-3`, `src/app/r/[slug]/page.tsx:6` e `:13-14`,
`next.config.ts:4-5` — todos em pt-BR; `format.ts`, `summary.ts`, `greeting.ts`
e todos os componentes em inglês.

`.claude/rules/code-conventions.md` diz "código, comentários e nomes em
**inglês**". A regra está sendo desobedecida na metade dos arquivos há tempo
suficiente para parecer intencional.

- **Princípio:** menor surpresa + broken windows (regra que ninguém segue deixa
  de ser regra).
- **Sugestão:** decidir e registrar — ou relaxar a regra para "comentários podem
  ser pt-BR" (o projeto é de um dono só, e os comentários explicam decisões de
  negócio em pt), ou converter incrementalmente. A escolha errada aqui é manter
  a ambiguidade.
- **Custo:** baixo (decidir) / médio (converter).

### 17. Estilos inline com números mágicos fora do `globals.css`

`src/app/page.tsx:5` (`paddingTop: 64`), `:9` (`marginTop: 12`) ·
`src/app/r/[slug]/not-found.tsx:3` (`paddingTop: 40`)

A convenção manda CSS puro em `globals.css`; a única exceção justificada e
documentada é o `--brand` do `ProjectStack`. Esses três são espaçamento
hardcoded que não participa do sistema (compare com
`.admin { padding-top: clamp(36px, 7vw, 72px) }`). **Custo:** baixo.

### 18. Nomes de tipo colidem com nomes de componente

`src/components/Section.tsx:1`, `NextSteps.tsx:1`, `StatusCard.tsx:1`

Todo consumidor precisa aliasar (`Section as SectionData`, `NextSteps as
NextStepsData`, `StatusCard as StatusCardData`). Quando o alias é obrigatório em
todo import, o nome está errado na origem. Renomear em `types.ts`:
`SectionData`, `NextStepsData`, `CardData`. Uma vez, e o atrito acaba.
**Custo:** baixo.

### 19. Chaves de lista dependem de unicidade que ninguém garante

`src/components/ProgressList.tsx:10`, `PendingList.tsx:17`, `NextSteps.tsx:11`
(`key={item.label}`) · `StatusReport.tsx:36` (`key={section.number}`) ·
`Section.tsx:12` (`` key={`${card.title}-${i}`} `` — convenção diferente das
outras quatro)

Dois rótulos iguais num snapshot dão key duplicada silenciosa. Como já existe
uma fronteira de validação com skip defensivo, o lugar natural de garantir isso
é o Zod: `.refine` de unicidade em `progress[].label` e `sections[].number` — o
snapshot inválido é pulado com aviso, exatamente como o resto. **Custo:** baixo.

### 20. A micro-etiqueta uppercase está reescrita 15 vezes

`src/app/globals.css` linhas 72, 78, 110, 153, 230, 327, 406, 513, 564, 642,
681, 771, 817, 854, 886

`text-transform: uppercase` + `font-weight: 500` + `letter-spacing: 0.06–0.2em`
+ `font-size: 10.5–12px` repetido em `.kicker`, `.block-title`, `.mast-vendor`,
`.legend`, `.pill`, `.cta`, `.section-badge`, `.pending-since`, `.rail-ago`,
`.admin-*`, `footer`… É o átomo do design system e não tem nome.

Uma lista de seletores base com as três propriedades comuns, e cada classe
sobrescreve só o que difere. Sendo honesto: **é o item de menor retorno da
lista** — o CSS está saudável e 100% utilizado (só as três classes do item 13
estão órfãs). Faça só se for mexer nessa área de qualquer jeito.
**Custo:** médio.

---

## O que NÃO mudar

Explicitado para evitar over-engineering em refactor futuro:

1. **`src/lib/format.ts` operando sobre a string ISO.** A decisão TZ-safe
   (`DECISOES.md` §13) está certa, comentada no lugar onde importa e coberta por
   testes que explicam o off-by-one. O item 2 acima ajusta o contrato de
   entrada — a estratégia continua igual.
2. **A arquitetura de ilha única do `ProjectSwitcher`.** Relatórios como Server
   Components passados de fora, hash como fonte de verdade, zero dependência de
   roteador, `role="tablist"` com setas/Home/End corretos e `tabIndex` roving. O
   item 3 muda só o formato da prop — não a arquitetura.
3. **`summary.ts`, `status.ts` e `greeting.ts`.** Funções puras, pequenas, com
   nome bom e teste — inclusive o teste de invariante de conteúdo em
   `greeting.test.ts:24` ("every phrase contains its own highlight"). Não
   precisam de abstração nenhuma.
4. **O `--brand` inline no `ProjectStack` e as três camadas de `noindex`.**
   Padrão deliberado, documentado em `DECISOES.md` §5 e §12; qualquer "limpeza"
   aqui é regressão de segurança ou de design.
5. **A duplicação do `themeColor: "#f4f5f7"` em `layout.tsx:24` vs `--wash` no
   CSS.** É duplicação real, mas o comentário na linha acima já é a mitigação
   certa; resolver de verdade exigiria JS lendo CSS — over-engineering.

---

## Ordem sugerida de ataque

**2 → 8 → 10 → 1.** Os três primeiros são de custo baixo e fecham contratos
reais; o quarto é o que destrava testar a invariante em que o projeto inteiro
aposta. Os itens 3 a 12 podem esperar o próximo trabalho que já toque a área. O
item 20 só se houver refactor de CSS por outro motivo.
