# Diário de bordo — decisões do Portal de Status

Registro do **porquê** das escolhas de arquitetura, e do que foi **descartado**.
O CLAUDE.md diz *o que fazer*; este doc diz *por que é assim*. Ordem aproximada
em que as decisões apareceram.

---

## 1. Sem login — acesso por slug não-adivinhável

**Decisão:** cada cliente acessa `/r/<slug>`, onde `slug = <prefixo>-<sufixo
aleatório>` (ex: `movi-3xubgjr`). Sem autenticação.

**Por quê:** o pedido era "cada cliente vê só a URL dele, sem login". A ideia
inicial era usar o nome na URL (`/movi-projects`, `/ellementi-projects`), mas isso
é **enumerável**: quem recebe o link da Movi chuta o da Ellementi e vê o status,
o roadmap e os atrasos de outro cliente. O slug com sufixo aleatório mantém a UX
"é só abrir o link" e remove a enumeração cruzada.

**Descartamos:** nome literal na URL (enumerável); login/senha (fricção
desnecessária para o caso de uso); hash determinístico do nome (se o seed vaza,
todos os slugs viram reproduzíveis — aleatório fixado é mais seguro).

---

## 2. Conteúdo como dado (JSON), não HTML

**Decisão:** o design é fixo em componentes; cada atualização de status é um
arquivo JSON em `content/`.

**Por quê:** antes, cada relatório era um HTML escrito à mão por dia — não escala e
não tem histórico. Separando **conteúdo de design**, a skill consegue gerar/atualizar
status programaticamente e o histórico sai de graça (um arquivo por data).

**Descartamos:** seguir com HTML manual; CMS/banco (overkill — adicionaria backend
a um site que é essencialmente estático).

---

## 3. Modelo cliente → projeto(s) → snapshots datados

**Decisão:** `content/clients/<id>.json` (config estável) + `content/snapshots/
<cliente>/<projeto>/<AAAA-MM-DD>.json` (status imutável, um por data).

**Por quê:** a URL é `/movi-projects` (plural) — um cliente pode ter **vários
projetos** (a Movi tem 3: Painel, App dos Motoristas, Movi Exporter). Snapshot
datado e imutável dá histórico, evita merge conflict e deixa a skill só *adicionar*
arquivos, nunca reescrever.

**Descartamos:** um relatório único por cliente; sobrescrever o status (perde
histórico).

---

## 4. SSG puro + `dynamicParams = false`

**Decisão:** páginas estáticas geradas no build (`generateStaticParams`), com
`dynamicParams = false`.

**Por quê:** o conteúdo só muda por `git push`, então SSG é o mais rápido e barato.
E `dynamicParams = false` faz um slug desconhecido cair em **404** em vez de tentar
renderizar on-demand — fecha a porta pra alguém ficar chutando slugs.

**Descartamos:** SSR/ISR (desnecessário; ISR ainda abriria a brecha de render
on-demand). **Atenção:** Cache Components desliga o `dynamicParams` — por isso NÃO
é habilitado.

---

## 5. `noindex` em 3 camadas + sem OpenGraph

**Decisão:** `noindex` via metadata (layout+página), `robots.ts` e header
`X-Robots-Tag`. Nenhuma tag OpenGraph rica em `/r/[slug]`.

**Por quê:** `noindex` mantém o portal fora do Google (é privado por link). E OG
rico faria o **preview do link** (WhatsApp/Slack) exibir o nome do cliente — vazando
identidade mesmo sem ninguém abrir a página.

**Nota honesta:** `noindex` **não é segurança**. Sem auth, quem tem o link vê. Por
isso: entregar ao cliente só o domínio de produção (os previews `*.vercel.app` de
cada deploy também servem o conteúdo) e nunca expor o slug em canal público.

---

## 6. Repo separado, Vercel, deploy por push — humano publica

**Decisão:** o portal é um repo próprio (não dentro de `movi-solutions/`), na Vercel,
com deploy automático a cada push. Quem commita e publica é o humano.

**Por quê:** é um produto **cross-cliente** da ITGraph, não um projeto "da Movi".
Gitops sem backend, com revisão antes de publicar — casa com o fluxo do mantenedor
(criar repo no GitHub → versionar → conectar na Vercel).

---

## 7. Skill global + `.status-portal.json` por repo

**Decisão:** a skill `atualizar-status-portal` vive uma vez em `~/.claude/skills/`;
cada repo de cliente tem um `.status-portal.json` apontando `clientId`/`projectId`/
caminho do portal.

**Por quê:** a lógica é genérica — escrita uma vez, disponível em todos os projetos.
O que muda por repo é só o config leve.

**Descartamos:** copiar a skill em cada repo (duplicação e manutenção).

---

## 8. A skill para no preview (não commita)

**Decisão:** a skill gera o snapshot, mostra o preview e **para**. Não commita nem
pusha.

**Por quê:** é conteúdo que o cliente lê — precisa de revisão humana da linguagem
antes de publicar. Também casa com a preferência do mantenedor de commitar ele mesmo.

---

## 9. Sem Tailwind — CSS puro portado

**Decisão:** o design foi portado 1:1 do HTML existente para `globals.css` (CSS puro),
sem Tailwind e sem shadcn.

**Por quê:** o design já existia como CSS pronto; reexpressá-lo em Tailwind seria
retrabalho. shadcn não faz sentido num site read-only, sem formulários.

**Descartamos:** manter Tailwind/shadcn (padrão do `movi-web`) só por consistência —
não compensava o retrabalho aqui.

---

## 10. Reaproveitar a base do `movi-web`, sem o peso

**Decisão:** mesma stack (Next 16, React 19, TS, pnpm) e configs equivalentes
(tsconfig strict, alias `@/*`, eslint flat). Zod para validação.

**Por quê:** o `movi-web` já é Next — alinhar reduz surpresa. Mas **não** trouxemos
Prisma/pg (sem banco), shadcn (sem forms), nem os `pnpm.overrides` (específicos de
Prisma/msw).

---

## 11. App mobile virou projeto próprio; Painel foi enxugado

**Decisão:** quando ficou claro que a Movi tem 3 projetos, o app dos motoristas
saiu de "área dentro do Painel" para **projeto separado**. O relatório do Painel foi
enxugado (removida a barra "App mobile" e o card do app), mantendo só "Base de login
do app mobile" — que é trabalho de backend do próprio Painel.

**Por quê:** evitar o mesmo status aparecer duplicado em dois relatórios.

---

## 12. Cor de marca por cliente, via `--brand`

**Decisão:** a cor da marca é uma CSS var `--brand`, setada uma vez no `ProjectStack`
(inline, por cliente); todo o CSS usa `var(--brand)`.

**Por quê:** evita cascatear props de cor por toda a árvore de componentes; cada
cliente troca uma variável.

---

## 13. Data TZ-safe

**Decisão:** datas em `America/Sao_Paulo`; a formatação opera sobre a string ISO
(`YYYY-MM-DD`) sem construir `Date`.

**Por quê:** `new Date("2026-07-10")` é meia-noite UTC e, no fuso local, exibiria
09/07 — off-by-one clássico. Formatar a partir das partes da string elimina isso.

---

## 14. Redesign v2 — "rastreio de entrega", com uma única ilha client

**Decisão:** o design deixou de ser o HTML portado 1:1 e virou um design system
próprio ("rastreio de entrega": trilho vertical na cor da marca, manifesto,
tabs-etiqueta). Tipografia de família única: Archivo variable (eixo `wdth`) —
expanded nos títulos, normal no corpo e nas etiquetas uppercase (o IBM Plex
Mono entrou e saiu no mesmo dia: o dono achou frágil/deslocado nos tamanhos
pequenos). O seletor de projetos é a **única** ilha `"use client"`
(`ProjectSwitcher`): os relatórios seguem Server Components passados como
children; o hash da URL é a fonte de verdade das tabs (deep-link + voltar).

**Por quê:** com 3 projetos empilhados o cliente se perdia; tabs client-side
eram o item de backlog com melhor custo-benefício e não exigem rotas novas nem
dependência. Hash em vez de query string: funciona em página 100% estática sem
roteador. Visual novo (e não evolução) foi escolha explícita do dono em
2026-07-16; direção guiada pela skill `frontend-design` (metáfora específica do
sujeito — a Movi é de logística; a ITGraph "entrega" software rastreável).

**Rejeitado:** rota por projeto (`/r/<slug>/<projeto>`) — multiplicaria URLs
secretas a gerenciar; biblioteca de tabs/estado — dependência proibida sem
necessidade.

---

## 15. Painel admin (`/a/<slug>`) — exceção consciente ao "não listar slugs"

**Decisão:** existe UMA rota que lista todos os clientes e seus slugs: o
painel interno `/a/<slug-admin>` (slug em `content/admin.json`, gerado pelo
`gen-slug`). Cockpit do dono: card por cliente com link, última atualização,
progresso, pendências e alerta de "parado há N dias" (>14 sem snapshot,
referência = data do build).

**Por quê:** sem visão consolidada, o dono precisava guardar cada URL. O
painel usa o MESMO modelo de segurança das páginas de cliente (slug forte +
noindex 3 camadas + 404 via `dynamicParams=false` + nunca linkado). O risco
novo é ser ponto único: se ESTE slug vazar, vazam todos — mitigação é a
rotação barata (rodar `gen-slug` de novo e trocar o `admin.json`; o link
antigo passa a dar 404 no próximo deploy).

**Rejeitado:** auth de verdade (quebraria o "SSG puro sem backend" por um
usuário só); listar na raiz (indexável/adivinhável).

---

## 16. Sem banco de dados — arquivo e git continuam sendo a verdade

**Decisão (2026-08-07):** avaliado adotar Prisma + Postgres (Neon) e
**descartado**. O conteúdo — status, escopo, contrato e o futuro módulo
financeiro — continua em JSON no repo, publicado por push. Confirma e reforça
o §10, que já havia deixado Prisma/pg de fora.

**Por quê:** o volume não pede banco (fechamento mensal são ~12 registros por
ano; recebíveis, algumas dezenas — toda métrica é um `reduce` em build time), e
o banco custaria as quatro propriedades que sustentam o projeto:

- **histórico de graça** — hoje é o git (imutável, diffável, revisável em PR);
  em banco, `UPDATE` apaga o passado em silêncio (§3);
- **portão de revisão humana** — publicar deixaria de ser um diff revisado e
  viraria um UPDATE sem revisão (§8);
- **404 por inexistência** — slug desconhecido hoje falha por construção
  (`generateStaticParams` + `dynamicParams = false`); lendo de banco, viraria um
  `if` correto por teste, não por estrutura (§4);
- **operação trivial** — arquivo estático em CDN não tem o que cair; Postgres
  serverless somaria cold start a um padrão de acesso de duas visitas por
  semana por cliente.

**Descartamos também o meio-termo pior:** ter banco e continuar publicando por
git — paga-se a infraestrutura inteira sem receber o benefício dela.

**Sobre o motivo real da dúvida:** a fricção de entrada de dados (principalmente
do financeiro) se resolve com CLI/skill que pergunta e escreve o JSON — mesmo
padrão do `atualizar-status-portal`, sem infra nova.

**Reabrir quando:** (a) houver formulário de verdade, aceitando o pacote
completo com autenticação; (b) aprovação clicável pelo cliente (v3) sair do
papel — única escrita vinda de quem não é o dono, e ainda assim há saída sem
banco (Function registrando o aceite como commit via API do GitHub); (c) o build
ficar lento ou surgir consulta que não dê para pré-calcular. Analytics de
leitura **não** é gatilho (Vercel Analytics resolve).

---

## Pegadinhas encontradas (para a próxima pessoa)

- **Next 16 mudou.** O `AGENTS.md` avisa: "This is NOT the Next.js you know".
  `params` virou **`Promise`** (dar `await`). Sempre consultar
  `node_modules/next/dist/docs/` da versão instalada antes de usar uma API.
- **`pnpm add` no diretório errado.** Um `pnpm add zod` rodado a partir de `~/dev`
  criou `package.json`/`pnpm-lock.yaml`/`node_modules` órfãos lá, e o Next passou a
  inferir a raiz do workspace errada. Correção: limpar `~/dev` e instalar de dentro
  do portal. Fixamos `turbopack.root` no diretório do portal em `next.config.ts` pra
  travar a raiz.
- **CSS var inline em TS.** `style={{ "--brand": cor }}` precisa de cast
  `as CSSProperties` — o tipo padrão não aceita custom properties.
- **JSON quebrado não pode derrubar tudo.** Deploy único = todos os clientes juntos.
  Por isso `content.ts` valida com Zod e **pula** o arquivo inválido (com aviso), em
  vez de crashar o build.

---

## Decisões adiadas / backlog

- **Ellementi** — cliente ainda sem projeto; foi removida do portal até começar. Slug
  reservado: `ellementi-emkr3tn` (ou gerar um novo).
- **v3 (exige sair do SSG puro):** aprovações clicáveis pelo cliente (Functions +
  KV), notificação automática ao publicar snapshot (e-mail/WhatsApp), snapshot
  semi-automático via GitHub Action no repo do cliente.
- **Fora do v2:** navegação para snapshots antigos (a timeline mostra, não navega),
  domínio próprio, analytics, botão "Salvar PDF" (print CSS já existe).
