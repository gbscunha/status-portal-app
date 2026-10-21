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

> **Atualização (2026-10-21):** no admin, o CSS puro e o limite de uma ilha
> client foram substituídos por shadcn/ui + Tailwind (§19). As páginas de cliente
> seguem este parágrafo até a migração delas.

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

## 17. Ciclo de vida do projeto — na config, quatro estados, página própria

**Decisão (2026-10-20):** cada projeto ganha um `lifecycle` opcional em
`content/clients/<id>.json`, com quatro estados: `active` (padrão quando o campo
falta), `paused` ("Em espera", com motivo e `since?`), `delivered` (mês de
entrega) e `closed` (mês de encerramento, motivo opcional). Na vista principal,
ativos vêm antes dos em espera. Concluídos e encerrados saem das tabs e vão para
`/r/<slug>/anteriores`, que só existe para quem tem ao menos um (o resto dá 404).
Fonte única dos estados: `src/lib/lifecycle.ts`, separada de `done|prog|plan`.
Spec: `docs/specs/ciclo-de-vida-do-projeto.md`.

**Por quê:**

- **Config, não snapshot.** O estado é do projeto, não de um checkpoint. No
  snapshot, pausar ou concluir exigiria um snapshot novo mesmo sem trabalho no
  repo, e cada snapshot seguinte precisaria repetir o estado. Um esquecimento da
  skill "despausaria" o projeto em silêncio. Na config, mudar é um diff de uma
  linha, revisado como qualquer outro, e o git guarda quando mudou. A regra do
  snapshot imutável (§3) fica intocada. Os scripts de aviso fora do repo leem um
  lugar só.
- **"Em espera"**, e não "Pausado" ou "Bloqueado": não aponta quem parou. Quando
  o bloqueio é do cliente, o aviso aponta para o bloco "Aguardando você", logo
  abaixo, e o motivo e as pendências chegam como uma mensagem só.
- **Encerrado ≠ concluído.** Um projeto interrompido sem entrega nunca pode
  aparecer como "entregue". Ele continua visível em "Projetos anteriores", com o
  último relatório, porque o cliente teve acesso a ele e o histórico é dele.
- **Último relatório sem pedidos.** Concluídos e encerrados mostram o último
  snapshot sem "Aguardando você", "Próximos passos" e previsões (`eta`): projeto
  que terminou não pede ação nem promete data. O snapshot no disco não muda; o
  filtro é `finishedReport` (`src/lib/lifecycle.ts`), aplicado na renderização.
- **Rota própria + 404.** O `generateStaticParams` de baixo para cima (o segmento
  filho preenche o `[slug]`) + `dynamicParams = false` dão o 404 por construção,
  o mesmo mecanismo anti-fishing do §4. O link só aparece quando a página existe.
  Não há ilha nova: as tabs dos anteriores reaproveitam o `ProjectSwitcher`, e o
  índice linka `#<id>`.

**Risco aceito:** um erro de digitação no `lifecycle` invalida o cliente, que é
pulado com aviso no build (parse defensivo, igual a qualquer campo da config). A
página dele dá 404 até a correção. Afrouxar só esse campo (inválido = em
andamento) mostraria um projeto concluído como ativo, sem aviso.

**Rejeitado:** estado no snapshot; aba "Concluídos" no seletor (os anteriores
continuariam nas tabs); seção `<details>` na mesma página (o HTML fica mais
pesado e os anteriores saem no PDF); página vazia para quem não tem anteriores
(rota sem leitor).

---

## 18. Skill de design `impeccable` — para ajustes, com o repo no comando

**Decisão (2026-10-21):** a skill externa `impeccable` (pbakaus/impeccable,
Apache-2.0, variante Claude Code em `.claude/skills/impeccable/`) entra como
ferramenta de ajuste de layout do admin e das páginas de cliente, ao lado de
`frontend-design` e `web-design-guidelines`. Escolha do dono entre as auditadas.

**Por quê:** é a mais completa das avaliadas. Trata o painel como tela de uso
(modo Operate) e o relatório do cliente como leitura (modo Read), com comandos
`layout`, `audit`, `critique`, `adapt` e `polish` e um detector próprio de
problemas de layout e contraste.

**Regras de uso:**

- **O repo vence a skill** (skills-policy §4). Aqui o trabalho é **refinamento**
  da v2 (§14), nunca redesign: família única Archivo, CSS puro em `globals.css`,
  sem Tailwind, sem dependência nova, estados em `status.ts`/`lifecycle.ts`.
- **Motor fora do repo.** O launcher baixa um binário compilado pela CI do autor
  (GitHub Releases `engine-v<versão>`, sha256 conferido) para `~/.impeccable/bin/`.
  O sha256 vem da mesma origem: garante integridade, não autoria. O binário nunca
  é commitado.
- **Telemetria desligada em duas camadas:** `IMPECCABLE_NO_TELEMETRY=1` em
  `.claude/settings.json` (versionado, vale em qualquer máquina) e
  `impeccable telemetry off` na máquina do dono.
- **Hook de edição não instalado.** Ligar é decisão explícita
  (`/impeccable hooks on`).
- **Modo `live` só em branch descartável.** Ele injeta um `<script>` de localhost
  em `src/app/layout.tsx`. Antes de qualquer commit,
  `git diff src/app/layout.tsx next.config.ts` precisa estar limpo. Hoje não há
  CSP no projeto, então o `next.config.ts` não é tocado; se um dia houver, o patch
  de CSP da skill pede consentimento.
- **Artefatos:** `.impeccable/config.local.json` é gitignorado. O resto de
  `.impeccable/` se decide quando aparecer.

**Rejeitado:** `npx impeccable install` (instala o hook do Claude Code junto); a
variante genérica `.agents/` que o CLI do skills.sh escolhe por padrão (caminhos e
sintaxe de comando do Codex); as alternativas só-texto `better-*` (jakubkrehel) e
`interface-design`.

## 19. shadcn/ui + Tailwind no admin, com o CSS isolado por segmento

**Decisão (2026-10-21):** o painel admin foi refeito com **shadcn/ui** (preset `nova`,
base **Base UI**, tema padrão neutral) e **Tailwind v4**, com a fonte **Inter**.
A estrutura agora é visão geral + uma página por projeto (spec `admin-layout.md`).
A adoção vale para o projeto todo, em duas etapas: primeiro o admin, depois as
páginas de cliente, num PR próprio com prévia. Até lá, as páginas de cliente seguem
na v2 em CSS puro (§14), sem nenhuma mudança visual.

**Por quê:** o dono rejeitou uma prévia do admin feita à mão no mundo da v2 e quer
componentes de biblioteca, mais fiéis à referência que trouxe (um dashboard com
cara de shadcn). Para uma tela de uso interno, um vocabulário de componentes
conhecido (sidebar, trilha, cards, tabela) vale mais do que um visual autoral. Este
§19 revoga, só para o admin, o "CSS puro" e o "três ilhas" do §14.

**Como o CSS fica isolado (e por quê):**

- **O conflito:** o `globals.css` da v2 tem regras fora de camada, como
  `* { margin: 0; padding: 0 }`. Pelo spec de cascade layers, uma regra fora de
  camada vence qualquer regra em `@layer`, e os utilitários do Tailwind ficam em
  camadas. Carregar os dois na mesma página anula o shadcn.
- **A solução: o layout raiz não importa CSS nenhum.**
  - `src/app/page.tsx` e `src/app/r/layout.tsx` importam o `globals.css`.
  - `src/app/a/layout.tsx` importa o `src/app/tailwind.css`.
- **Por que não vaza:** todos os links são `<a>` comuns, então não há navegação
  client-side entre `/a` e `/r` que levasse o CSS de um para o outro.
- **Prova:** na migração, o CSS de `/`, `/r/*` e `/anteriores` ficou idêntico ao
  de antes, menos as regras `.admin*` removidas. As capturas das páginas de
  cliente ficaram idênticas byte a byte. Nenhum HTML fora de `/a` carrega Tailwind.
- **Rejeitado:** vários layouts raiz por route group. Exigiria o
  `global-not-found`, que é experimental, justamente no 404 anti-fishing.
- **Efeito no 404:** o `/_not-found` é o 404 padrão do Next e continua igual, só
  que sem a v2. Perde o `padding-bottom` de 64px e o antialiasing.

**Fonte:**
- A Inter vem de `next/font` dentro do `a/layout.tsx` e entra como
  `<style href precedence>` com `:root{--font-sans: …}`. Ela não pode ficar num
  `<div>`, porque a Sheet do celular é renderizada no `<body>`.
- O `@theme inline { --font-sans: var(--font-sans) }` gerado pelo shadcn é cíclico
  e só funciona porque esse `<style>` sem camada vence. Se ele sumir, a fonte cai
  para o padrão do navegador.
- A Archivo continua no layout raiz, porque o `globals.css` lê `--font-display` do
  `<html>`. Por isso o admin também pré-carrega o woff2 dela, que não usa (custo
  aceito).

**Dependências** (aprovadas pelo dono, versões exatas):
- Runtime: `@base-ui/react` 1.9.0, `class-variance-authority` 0.7.1, `cn` 0.5.0 (o
  merge de classes que os componentes gerados importam) e `lucide-react` 1.60.0.
- Dev: `tailwindcss` e `@tailwindcss/postcss` 4.3.3, `shadcn` 4.21.4 e
  `tw-animate-css` 1.4.0.
- O `shadcn` é necessário no build, porque o `tailwind.css` faz
  `@import "shadcn/tailwind.css"`.
- Os componentes foram gerados com o CLI fixado (`pnpm dlx shadcn@4.21.4`). O
  `init` reescreveu o layout raiz para injetar a Geist, e isso foi revertido.

**Edições locais nos arquivos gerados** (um `shadcn add --overwrite` desfaz; refazer
depois de atualizar):
- `"use client"` em `ui/badge.tsx`, `ui/breadcrumb.tsx` e `ui/item.tsx`: eles usam
  `useRender` (que chama `useRef`) e quebram quando usados por Server Component.
- `hooks/use-mobile.ts` reescrito com `useSyncExternalStore`. A versão do registry
  faz setState dentro de effect e falha no lint (`react-hooks/set-state-in-effect`).
- `ui/sidebar.tsx` não grava mais o cookie `sidebar_state`: nada o lê num site
  estático, e cada link recarrega a página. O `SidebarMenuSkeleton` (com
  `Math.random`) ficou como veio, porque não é usado.
- Textos para leitor de tela em pt-BR em `ui/sheet.tsx`, `ui/sidebar.tsx` e
  `ui/breadcrumb.tsx`.

**Tema:**
- Os tokens de estado (`done`, `prog`, `plan` e `hold`, com os fundos) entraram no
  `tailwind.css` com os mesmos valores da v2. O significado das cores é o mesmo no
  admin e nas páginas de cliente.
- O anel de foco é o do tema padrão (`ring/50`, cerca de 1,5:1 sobre branco).
  Fica registrado; subir o tom é uma decisão de tema para depois.
- No hero tingido, o texto secundário vem do `foreground` (75%), porque o cinza
  `muted` fica abaixo de 4,5:1.
- O detector da impeccable ignora "fonte batida" para a Inter
  (`.impeccable/config.json`), por ser escolha do dono.

**Revisão final da impeccable (21-10), o que mudou:**
- **Barra lateral só com ícones (pedido do dono):** sem esquema de cores. Os
  clientes têm um quadradinho monocromático com a inicial e uma lista de
  projetos recolhível (`ui/collapsible`). Nos projetos, um ícone cuja forma diz
  o estado: o círculo com ponto é "em dia", com o mesmo sentido de "em andamento"
  nas frentes. A barra recolhe para uma faixa de ícones com tooltip, onde o
  cliente vira link para a seção dele (troca só por CSS). A data do deploy fica
  no rodapé da barra lateral.
- **Hero:** o badge fica ao lado do h1, sem rótulo acima do título (proibido pelo
  craft-floor). A cor da marca vai só no fundo e na borda; a barra de progresso
  fica preta e mais grossa, porque marcas vermelhas leriam como alerta.
- **Atenção:** sem o ponto da marca. Cada linha mostra a pendência que espera há
  mais tempo (`oldestPending`) e há quantos dias.
- **Avanço:** escrito como "+N frentes no escopo", porque "+N frentes" sozinho se
  lia como N concluídas.
- **Tabela:** só o nome é link e a linha não muda de cor no hover. Não dava para
  garantir `position: relative` em `<tr>` no Safari.
- **Divergência consciente:** o revisor da skill pede o sorteio de direção
  (`concept-seed`) e um `seed` no brief. O dono decidiu não rodar, porque o mundo
  (shadcn padrão + Inter) e a composição (a referência dele) estão fixados por
  ele, e o `new-work.md` diz que uma direção fixada vence o sorteio. Rodar
  abriria uma rodada de direção cujo resultado essa fixação anula. O brief
  registra `seed: none` com esse motivo.

**Rotas:** `/a/[slug]/[clientId]/[projectId]` gera os params de baixo para cima,
com `dynamicParams = false`. Qualquer combinação fora das geradas dá 404,
inclusive um par cliente/projeto trocado. O shell é um Server Component por página,
e não um `layout.tsx`, porque o layout não conhece a rota filha e o item ativo é
calculado no servidor.

**Rejeitado:**
- shadcn só no admin, isolado para sempre: o dono quer o projeto todo, em etapas.
- Prévia em CSS puro no mundo da v2: rejeitada pelo dono.
- `npx impeccable install`: ele instala um hook junto, e a skill foi instalada
  manualmente (§18).

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
