# Spec: cliente fora do ar

- **Status:** implementada
- **Data:** 2026-10-21 (admin revisto em 2026-10-26, ver o fim)

## Problema / motivação

A Movi encerrou o contrato. O dono quer tirar a página dela do ar sem perder
nada: config, snapshots e histórico continuam no repo e no painel admin. Hoje o
único jeito de derrubar `/r/<slug>` é apagar o `clients/<id>.json`, e isso também
some com o cliente no admin. O ciclo de vida do projeto (§17) arquiva projetos,
mas a página continua no ar, com "Projetos anteriores", porque esse é o caso
normal: o histórico é do cliente.

## Decisões (tomadas com o dono em 2026-10-21)

- **Os projetos ativos da Movi viram encerrados:** Painel Web e Checklist App
  ficam `closed` em `2026-10`, sem motivo. O Movi Exporter continua `delivered`.
- **A página do cliente sai do ar:** `/r/<slug>` e `/r/<slug>/anteriores` dão
  404, e os dados ficam no repo e no admin.

## Formato do campo

```jsonc
// content/clients/<id>.json, no nível do cliente
"offline": true   // ausente ou false → página no ar (comportamento atual)
```

O campo vale para o cliente inteiro e é independente do `lifecycle` de cada
projeto. Para trazer a página de volta, é só tirar o campo. O git guarda quando
mudou.

## Escopo

**Dentro:** campo no schema; slugs públicos sem os clientes fora do ar (as duas
rotas `/r`); a busca por slug das páginas de cliente ignora quem está fora do ar;
no admin, o cliente continua com todos os projetos, e o link "Página do cliente"
dá lugar a "Página fora do ar"; conteúdo da Movi; documentação.

**Fora:** apagar ou mover arquivos de conteúdo; trocar o slug; derrubar URLs
de deployments antigos da Vercel (`*.vercel.app` com hash continuam servindo a
versão em que foram gerados; quem resolve isso é a Deployment Protection da
Vercel, configurada no painel dela); mudanças na skill `atualizar-status-portal`
(ela já para em projeto `closed`).

## Critérios de aceitação (testáveis)

### Schema (Vitest, `src/lib/types.test.ts`)

- **DADO** um cliente sem `offline` **QUANDO** valido **ENTÃO** passa.
- **DADO** `offline: true` ou `offline: false` **QUANDO** valido **ENTÃO** passa.
- **DADO** `offline: "sim"` **QUANDO** valido **ENTÃO** falha.

### Slugs públicos (Vitest, `src/lib/lifecycle.test.ts`)

- **DADO** clientes no ar e fora do ar **QUANDO** listo os slugs de `/r/<slug>`
  **ENTÃO** só entram os que estão no ar.
- **DADO** um cliente fora do ar com projeto concluído ou encerrado **QUANDO**
  listo os slugs de `/anteriores` **ENTÃO** ele não entra.

### Admin (Vitest, `src/lib/admin.test.ts`)

- **DADO** um cliente fora do ar **QUANDO** monto as linhas do portfólio
  **ENTÃO** todos os projetos dele continuam lá, e o grupo diz que a página está
  fora do ar.

### Rotas (verificação manual, `pnpm build` + `next start`)

- **DADO** a Movi com `offline: true` **QUANDO** abro `/r/movi-3xubgjr` e
  `/r/movi-3xubgjr/anteriores` **ENTÃO** os dois dão 404, e o build não lista
  essas rotas.
- **DADO** os outros clientes **QUANDO** abro `/r/<slug>` **ENTÃO** renderizam
  como antes.
- **DADO** que hoje só a Movi tem projeto arquivado **QUANDO** ela sai do ar
  **ENTÃO** o `generateStaticParams` de `/anteriores` devolve lista vazia, o build
  passa, e `/r/<qualquer>/anteriores` dá 404. Com `dynamicParams = false`, lista
  vazia é válida (docs do Next 16, `generate-static-params.md`); só daria erro com
  Cache Components, que o projeto não usa.
- **DADO** o admin **QUANDO** abro `/a/<slug>` **ENTÃO** a Movi aparece com os
  três projetos (dois encerrados, um concluído) e "Página fora do ar" no lugar do
  link. Na página de cada projeto da Movi não há link para `/r`, o hero diz que a
  página do cliente está fora do ar, e o card de fatos troca "Canais na página do
  cliente" por "Página do cliente: fora do ar". Nos outros clientes, nada muda.

## Impacto nas invariantes

- `dynamicParams = false` intacto nas duas rotas `/r`; o 404 vem de o slug não
  estar no `generateStaticParams`, e a página também chama `notFound()` se a
  busca por slug devolver `null` (defesa em profundidade).
- Parse defensivo preservado: `offline` inválido invalida o cliente, que é
  pulado com aviso (o mesmo risco aceito do `lifecycle`, §17).
- Snapshots não mudam. Nenhuma rota pública passa a listar clientes.
- O admin continua sendo a única rota que conhece todos os clientes (§15).

## Notas

- Nome do campo: `offline` lê como "fora do ar", a frase que o dono usa. Um
  booleano basta: a data da mudança fica no git, como no §17.
- O link do admin não virou `null` dentro do `clientPageHref`: quem decide é o
  `AdminProjectView` (`isOnline(client)`), conferido na verificação manual. O
  `clientPageHref` continua respondendo só "qual aba", e a lógica testável
  (`isOnline`, `clientSlugs`, `clientOnline` no portfólio) tem Vitest.
- O 404 da Movi é idêntico ao de um slug que nunca existiu (o padrão do Next, que
  já era assim): quem testa o link não descobre que ele existiu.

## Admin, 2026-10-26 (DECISOES §22)

Revisa o critério "Admin" acima: o cliente fora do ar também sai do painel.

### Decisões (tomadas com o dono em 2026-10-26)

- Sai da sidebar **e** da visão geral (lista de atenção, tabela e indicadores).
- As páginas de projeto do cliente no admin deixam de existir (404).
- A regra vale para todo cliente `offline`, não só para a Movi.

**Fora:** apagar `clients/<id>.json` ou os snapshots; mudar as rotas `/r`.

### Critérios de aceitação

#### Lógica (Vitest, `src/lib/admin.test.ts`)

- **DADO** um cliente fora do ar e um no ar **QUANDO** monto as linhas do
  portfólio **ENTÃO** só entram as do cliente no ar, nos grupos e nos
  indicadores.
- **DADO** um cliente fora do ar **QUANDO** gero os params das páginas de
  projeto **ENTÃO** nenhum par dele entra, e `findAdminProject` devolve `null`
  para ele.

#### Rotas (verificação manual, `pnpm build` + `next start`)

- **DADO** a Movi com `offline: true` **QUANDO** abro `/a/<slug>` **ENTÃO** ela
  não aparece na sidebar, na lista de atenção, na tabela nem nos indicadores (o
  HTML não cita "Movi"). FGV, Ellementi e Neon aparecem como antes.
- **DADO** a Movi fora do ar **QUANDO** abro
  `/a/<slug>/movi/{movi-web,movi-app,movi-exporter}` **ENTÃO** as três dão 404, e
  o build não lista essas rotas.
- **DADO** um projeto de outro cliente **QUANDO** abro a página dele no admin
  **ENTÃO** ela renderiza com o link "Página do cliente", como antes.

### Impacto nas invariantes

- `dynamicParams = false` intacto em `a/[slug]/[clientId]/[projectId]`; o 404
  vem de o par não estar no `generateStaticParams`.
- O admin continua sendo a única rota que lista clientes (§15), agora só os que
  estão no ar.
