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

> **Revogado (2026-10-21):** o dono adotou shadcn/ui + Tailwind no projeto todo,
> primeiro no admin (§19) e depois nas páginas de cliente (§21). O `globals.css` foi
> removido.

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
> seguiram este parágrafo até a migração delas, no mesmo dia (§21). Do §14 fica a
> troca de projeto pelo hash, sem rota por projeto. O trilho, as abas e a Archivo
> saíram.

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

> **Atualização (2026-10-21, §21):** as páginas de cliente migraram no mesmo dia.
> O isolamento por segmento e a parte "Fonte" abaixo valeram só durante a
> transição. Hoje o layout raiz importa o único CSS (`tailwind.css`) e carrega a
> Inter na `<html>`. O resto deste § (dependências, edições locais, tema, rotas do
> admin) continua valendo.

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
  `ui/breadcrumb.tsx`. A descrição da gaveta em `ui/sidebar.tsx` é neutra
  ("Navegação."), porque a mesma gaveta serve ao painel e às páginas de cliente
  (§21).

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

## 20. Cliente fora do ar — flag na config, dados preservados

**Decisão (2026-10-21):** o cliente ganha um `offline` opcional em
`content/clients/<id>.json`. Com `true`, `/r/<slug>` e `/r/<slug>/anteriores` dão
404, porque o slug sai do `generateStaticParams` das duas rotas
(`clientSlugs`/`archiveSlugs`, em `src/lib/lifecycle.ts`) e o `getClientBySlug`
ignora o cliente. Config, snapshots e o cliente no admin ficam. O admin troca o
link "Página do cliente" por "Página fora do ar". Primeiro uso: a Movi, que
encerrou o contrato em 2026-10 (Painel Web e Checklist App `closed`; o Movi
Exporter continua `delivered`). Spec: `docs/specs/cliente-fora-do-ar.md`.

**Por quê:**

- **Tirar do ar ≠ encerrar.** O §17 mantém os encerrados visíveis em "Projetos
  anteriores", porque o histórico é do cliente, e esse continua sendo o padrão.
  Tirar a página do ar é uma decisão do dono sobre o acesso, separada do estado de
  cada projeto. Por isso mora no cliente, não no `lifecycle`.
- **Os dados ficam.** Apagar o JSON derrubaria a página, mas tiraria o cliente do
  admin. Com a flag, a mudança é um diff de uma linha, revisado como qualquer
  outro, e o git guarda quando mudou (o mesmo argumento do §17). Para voltar ao
  ar, é só tirar o campo.
- **404 por construção.** É o mesmo mecanismo do §4 e do §17: o slug não é gerado
  e o `dynamicParams = false` responde 404. Esse 404 é idêntico ao de um slug que
  nunca existiu, então quem testa o link não descobre que ele existiu. A busca por
  slug também ignora o cliente (defesa em profundidade).
- **Lista vazia é válida.** Sem nenhum cliente no ar com projeto arquivado, o
  `generateStaticParams` de `/anteriores` devolve `[]`. No Next 16, isso vale com
  `dynamicParams = false` e dá 404 em todo slug. Só daria erro com Cache
  Components, que o projeto não usa.

**Risco aceito:** deployments antigos da Vercel (`*.vercel.app` com hash)
continuam servindo a página como era quando foram gerados. O cliente só recebeu o
domínio de produção. Para fechar isso, a saída é a Deployment Protection, no
painel da Vercel.

**Rejeitado:**
- Apagar o `clients/<id>.json`: o cliente some do admin.
- Mover para outra pasta: o conteúdo passa a ter dois lugares para ler, e o admin
  precisa conhecer os dois.
- Trocar o slug: a página continua existindo, só muda de endereço.
- Derivar de "todos os projetos terminados": a Movi tem um concluído, e encerrar
  não é tirar do ar (§17).

---

## 21. Páginas de cliente no sistema do admin (etapa 2 do shadcn)

**Decisão (2026-10-21):** as páginas de cliente (`/r/<slug>` e `/anteriores`), a raiz e
o 404 entraram no sistema do `DESIGN.md`. Isso quer dizer shadcn/ui, Tailwind v4,
Inter e a marca só como marcador. Spec em `cliente-shadcn.md`.

Com isso o projeto ficou com um CSS só, o `tailwind.css`, importado pelo layout raiz.
O isolamento por segmento do §19 acabou, e este §21 encerra, também para o cliente, o
"CSS puro" e a Archivo do §14.

**Decisões do dono (por pergunta interativa):**
- **Identidade:** entrar no sistema do admin. Recusado: manter a v2 refeita em
  shadcn, com duas famílias e duas regras de cor.
- **Navegação:** a sidebar como no admin, com os projetos do cliente. Recusado: abas
  no topo.
- **Troca de projeto:** pelo hash, um projeto por vez. O §14 continua valendo:
  nenhuma URL nova, e o PDF sai com todos os projetos. Recusado: uma página por
  projeto.
- **Projeto em espera com pendência do cliente:** o sinal é "aguardando você", na
  mesma ordem do admin (`rowSignal`).
- **Tela larga:** duas colunas a partir de 1280px. A linha do tempo e o contato
  ficam numa lateral fixa ao rolar, como na página de projeto do admin.
  - Recusado: uma coluna de leitura de 672px, que zerava o detector da impeccable.
  - Custo aceito: a lateral mais alta (804px, no Checklist App da Movi) passa da
    janela em telas baixas, e o contato, que é o fim dela, só aparece no fim da
    página. O WhatsApp e o E-mail continuam na barra do topo, que é fixa. Medido em
    todos os painéis antes de decidir. Com a Movi fora do ar (§20), a mais alta
    passou a ser a do CT, com 704px.

**Como funciona:**
- **Hash:**
  - O `src/hooks/use-location-hash.ts` (`useSyncExternalStore`, com servidor `""`)
    é lido por três ilhas:
    - o `ProjectSwitcher`, que mostra os painéis;
    - o `ProjectNavItem`, o item da sidebar, que também fecha a gaveta do celular;
    - o `ProjectCrumb`, o fim da trilha.
  - A lógica pura fica em `src/lib/client-nav.ts`, com TDD.
  - As ilhas próprias passam de 3 para 5. Elas recebem dados e elementos, nunca
    funções nem componentes: o sinal vai como string, e o ícone é escolhido dentro
    da ilha.
  - **Um link direto não conta como troca.** O foco e a rolagem reagem ao evento
    `hashchange`, que dispara só em clique, voltar e avançar, nunca na carga.
    Comparar renders falhava no StrictMode do `next dev`.
- **Rolagem e foco:**
  - Os ids têm prefixo (`painel-`, `titulo-`), então nenhum elemento tem o id igual
    ao hash e o navegador não rola a página sozinho.
  - Quando o usuário troca de projeto, a página volta ao topo e o foco vai para o
    título.
  - Num link direto, a hidratação mostra o primeiro painel e logo troca para o do
    hash, sem roubar o foco.
- **Impressão:**
  - Os painéis ocultos usam `hidden print:block`. O atributo `hidden` não serve,
    porque o preflight o esconde com `!important`.
  - O `tailwind.css` ganhou um bloco `@media print` fora de camada. É a única
    regra própria sem camada, fora as variáveis do tema. Ele:
    - esconde o wrapper da sidebar, que nenhum utilitário alcança;
    - abre os `<details>` com `::details-content`. O Safari anterior à 18.4 e o
      Firefox anterior à 143 imprimem as seções fechadas;
    - mantém barras, pontos e o tingido com `print-color-adjust`.
  - Cada projeto começa em página nova.
  - O `break-inside-avoid` fica só nos blocos curtos e nas linhas. Nos cards
    longos, ele empurrava o card inteiro e deixava o cabeçalho sozinho na página.
  - O título de seção e as duas últimas linhas do progresso não ficam sozinhos no
    fim ou no começo de uma página (`break-after: avoid`).
  - O bloco também vale para o PDF do admin, que agora sai sem a sidebar e com os
    fundos.
- **404:**
  - O `app/not-found.tsx` atende todos os casos: slug errado, par trocado e
    qualquer URL. Usa o título e o noindex do layout raiz.
  - Saiu o `r/[slug]/not-found.tsx`. Ele nunca rodou em produção, porque com
    `fallback: false` a resposta é o `/_not-found`.
  - A raiz e o 404 ficam fora da moldura, porque não há cliente nem navegação.
- **Fonte:** a Inter vem de `next/font` com `variable: "--font-sans"` na `<html>`.
  A variável sem camada da `next/font` vence a referência cíclica do
  `@theme inline`. Num wrapper ou no `<body>`, a fonte cai para o padrão do
  navegador.
- **Admin:** não mudou visualmente. As 6 capturas (visão geral, CT e Movi Exporter,
  em 1440 e 390) ficaram idênticas byte a byte. `AdminStatusDot` e
  `AdminLifecycleBadge` viraram `StatusDot` e `LifecycleBadge`, compartilhados.
  - O separador vertical da barra do topo usa `self-stretch` com altura fixa e
    gruda no topo. No cliente ele foi centralizado com `my-auto`. No admin fica
    igual, para um `fix` próprio.
- **Textos:**
  - São os de hoje.
  - O cabeçalho reaproveita os rótulos da antiga faixa-resumo: "Fase atual",
    "Atualizado", "Plataforma", "Progresso geral" e "Entregas concluídas". Não usa
    o "frentes" do admin.
  - Saíram os kickers em caixa-alta da v2 ("Aguardando você" acima do bloco,
    "Próximos passos imediatos", "Fale com a gente"). O craft-floor proíbe rótulo
    acima de título, e o título de cada card já diz o mesmo.
  - O único rótulo novo é o grupo "Projetos" da sidebar, aprovado no plano.
    "Projetos anteriores" já existia.
  - Saíram também, por decisão do dono na revisão final:
    - o aviso "Projeto concluído / Entregue em <mês>", porque o badge
      "Concluído · <mês>" e a frase de `/anteriores` já dizem o mesmo;
    - as datas relativas da linha do tempo ("hoje", "há N dias"). Elas eram
      calculadas no build e ficavam falsas no dia seguinte, num site que só
      rebuilda ao publicar. Ficam só as datas absolutas. O admin segue com o
      relativo, porque é interno e mostra a data do deploy.

**Revisão final da impeccable (21-10), em duas rodadas:**
- **Cabeçalho:** o badge de ciclo de vida fica escondido no projeto ativo (decisão
  do dono). O ponto verde dele contradizia a legenda logo abaixo, onde verde quer
  dizer concluído.
- **Leitura:** as descrições dos cards de status, os passos e as pendências ficam
  em 15px. Os títulos da linha do tempo e as descrições do escopo ficam em 14px.
  Todos usam a Tinta a 80% e `max-w-prose`. O cinza fica só para datas e
  metadados.
- **`text-pretty`:** mantido, com o trade-off aceito pelo dono. Sem ele, o detector
  apontou 12 (1280) e 16 (390) palavras sozinhas na última linha. O custo é um
  parágrafo com bordas irregulares no celular.
- **Seções:** o número virou texto cinza antes do título, sem o círculo dos passos
  numerados que vêm logo acima.
- **Ficaram abertos:**
  - o sorteio de direção (`concept-seed`), recusado pelo dono, como no admin; o
    brief registra `seed: none`;
  - a sidebar sem rodapé, porque "{cliente} · {vendor}" já aparece no topo dela e
    no rodapé de cada relatório.

**Prova:**
- Gate verde.
- 16 rotas com o status, o noindex (meta e header) e o título certos, sem
  OpenGraph e com um CSS só. A raiz e o 404 não têm nome nem slug de cliente.
- Hash conferido via CDP: link direto, clique, voltar, hash desconhecido e a gaveta
  no celular.
- PDF A4 da FGV com os 3 projetos.

**Rejeitado:**
- Manter dois mundos de CSS depois da migração: o isolamento só existia por causa
  da v2.
- Uma página por projeto: reverteria o §14 e mudaria o PDF e os links já enviados.
- Abas no topo: o dono quis a mesma moldura do admin.

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
