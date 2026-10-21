---
name: Portal de Status ITGraph
description: shadcn/ui no tema padrão com Inter; cor só para estado e para marcar o cliente. Um sistema só para o painel interno e as páginas de cliente.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  border: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  sidebar: "oklch(0.985 0 0)"
  sidebar-foreground: "oklch(0.145 0 0)"
  sidebar-primary: "oklch(0.205 0 0)"
  sidebar-primary-foreground: "oklch(0.985 0 0)"
  sidebar-accent: "oklch(0.97 0 0)"
  sidebar-accent-foreground: "oklch(0.205 0 0)"
  sidebar-border: "oklch(0.922 0 0)"
  done: "#178a4c"
  prog: "#b25e00"
  plan: "#8a8f9a"
  hold: "#2f5b86"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.11
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    fontFeature: "tnum"
  section-title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.56
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.375
  body-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-read:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
  label-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  md: "8px"
  lg: "10px"
  xl: "14px"
  4xl: "26px"
  full: "9999px"
spacing:
  "1": "4px"
  "1.5": "6px"
  "2": "8px"
  "2.5": "10px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "7": "28px"
  "8": "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "oklch(0.205 0 0 / 0.8)"
  button-primary-icon:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    size: "32px"
  button-ghost-icon:
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    size: "28px"
  button-ghost-icon-hover:
    backgroundColor: "{colors.muted}"
  badge-outline:
    textColor: "{colors.foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.4xl}"
    padding: "2px 8px"
    height: "20px"
  badge-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.4xl}"
    padding: "2px 8px"
    height: "20px"
  status-dot:
    rounded: "{rounded.full}"
    size: "8px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: "16px"
  card-title:
    typography: "{typography.title}"
  reading-body:
    textColor: "oklch(0.145 0 0 / 0.8)"
    typography: "{typography.body-read}"
  kpi-value:
    textColor: "{colors.foreground}"
    typography: "{typography.headline}"
  kpi-value-alert:
    textColor: "{colors.prog}"
  progress-track:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.full}"
    height: "4px"
  progress-track-hero:
    height: "8px"
  progress-indicator:
    backgroundColor: "{colors.primary}"
  sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-foreground}"
    width: "256px"
  sidebar-collapsed:
    width: "48px"
  sidebar-brand-tile:
    backgroundColor: "{colors.sidebar-primary}"
    textColor: "{colors.sidebar-primary-foreground}"
    rounded: "{rounded.lg}"
    size: "32px"
  sidebar-menu-button:
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px"
    height: "32px"
  sidebar-menu-button-active:
    backgroundColor: "{colors.sidebar-accent}"
    textColor: "{colors.sidebar-accent-foreground}"
    typography: "{typography.label}"
  top-bar:
    backgroundColor: "{colors.background}"
    height: "56px"
    padding: "0 16px"
  tooltip:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  project-hero:
    rounded: "{rounded.xl}"
    padding: "28px"
  report-header:
    rounded: "{rounded.xl}"
    padding: "28px"
  section-title:
    typography: "{typography.section-title}"
  step-number:
    backgroundColor: "{colors.muted}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: "20px"
  timeline-dot:
    backgroundColor: "{colors.border}"
    rounded: "{rounded.full}"
    size: "10px"
  attention-item:
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
  empty-state:
    rounded: "{rounded.xl}"
    padding: "24px"
  empty-media-icon:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    size: "32px"
---

# Design System: Portal de Status ITGraph

## Overview

**Creative North Star: "A Mesa de Triagem"**

O sistema é o vocabulário de produto da categoria (sidebar, trilha, cards, tabela) no tema padrão do shadcn/ui: estilo `base-nova`, primitivos Base UI, base `neutral`, com Inter. É escolha explícita do dono: um vocabulário de componentes conhecido vale mais do que um visual autoral, e uma prévia desenhada à mão no lugar dos primitivos foi rejeitada. A personalidade vem do conteúdo (estados, datas, a cor de cada cliente), não da moldura. A moldura é neutra, o primary é quase preto e há um único tom de ação.

As duas superfícies leem de jeitos diferentes dentro da mesma moldura. O painel interno é lido por varredura, com densidade média: o olho acha primeiro o que pede ação (um número em âmbar, um badge com ponto) e só depois o detalhe. O relatório do cliente é lido em ordem: o título e o progresso geral, o que espera por ele, o que vem depois e o detalhe por seção, com um corpo de leitura um pouco maior. Nas duas, a cor tem duas funções e só duas: dizer o estado (quatro tons fixos) e marcar de quem é o projeto (a cor do cliente, como marcador). Todo o resto é cinza. As superfícies são planas e se separam por um anel de 1px, não por sombra.

Escopo: um sistema só para o projeto inteiro (DECISOES §19 e §21). O painel interno (`/a/…`), as páginas de cliente (`/r/…` e `/r/…/anteriores`), a raiz e o 404 rodam nele, com uma folha de estilo só, `src/app/tailwind.css`, importada pelo layout raiz junto com a Inter (variável na `<html>`). Nenhum outro arquivo importa CSS. A v2 (CSS puro, Archivo, trilho na cor da marca, kickers em caixa-alta) saiu do projeto e não é referência para nada. Os quatro tons de estado e o significado deles são os mesmos nas duas superfícies.

**Key Characteristics:**
- Tema padrão do shadcn (`base-nova`, neutral), neutros sem croma e primary quase preto.
- Inter como família única; a hierarquia vem de tamanho e peso, nunca de caixa-alta.
- Cor só para estado (verde, âmbar, cinza, azul) e para marcar o cliente.
- Uma moldura para tudo: sidebar, barra de 56px e coluna de conteúdo, no admin e no cliente; só a raiz e o 404 ficam fora.
- Superfícies planas com anel de 1px; raio de 14px nos containers e de 10px nos controles.
- Sidebar monocromática, que se lê por forma de ícone e colapsa para um trilho de ícones.
- O PDF faz parte do sistema: o relatório do cliente imprime todos os projetos, sem moldura e com os fundos.
- Só tema claro: o bloco `.dark` veio do gerador e nenhuma página o liga.

## Colors

Paleta acromática do tema padrão, com quatro tons de estado e uma cor por cliente que marca, mas nunca pinta.

### Primary
- **Grafite de Ação** (`primary` e `sidebar-primary`, ≈ #171717): o botão preenchido, o indicador de toda barra de progresso e os tiles de marca (o "IT" no topo da sidebar do admin e da raiz, e a inicial do cliente no topo da sidebar do cliente). O texto sobre ele é o **Branco de Contraste** (`primary-foreground`, ≈ #fafafa). É o único tom de interação do sistema.

### State
Os quatro tons valem igual no admin e no cliente (`tailwind.css`, com a fonte única em `lib/status.ts` e `lib/lifecycle.ts`).
- **Verde Entregue** (`done`): frente ou item concluído (ícone de check), o ponto do card e da seção concluídos, e o ponto dos ciclos "em andamento" (só no admin) e "concluído". Dá 4,4:1 sobre branco, então serve a ícone e ponto, não a texto corrido.
- **Âmbar em Curso** (`prog`): frente em andamento e, sobretudo, "algo espera ação". É o ponto de cada item de "Aguardando você", o ponto de pendência no admin, o número de KPI em alerta (4,7:1) e, como anel oco de 2px, o sinal de "parado" ou "sem relatório" (só no admin).
- **Cinza Planejado** (`plan`): o ponto de "encerrado" e de card planejado, sempre a 50%. Frente ou item planejado usa o ícone de círculo vazio em Cinza Legenda.
- **Azul em Espera** (`hold`): o ponto de projeto em espera, no badge e no aviso de ciclo de vida.

Os fundos claros desses tons (`done-bg`, `prog-bg`, `plan-bg`, `hold-bg`) existem no tema com os valores da v2, mas nenhuma superfície os usa.

### Client brand
- **Cor do cliente** (`--brand`, vinda de `brandColor` em `content/clients/<id>.json`): não é token do tema, porque muda por cliente. No cliente ela entra uma vez por página, como variável inline na moldura; no admin, em cada bloco que mostra o cliente (a linha de grupo da tabela, o wrapper da página do projeto). Só aparece nos usos listados na regra abaixo.

### Neutral
- **Branco de Página** (`background` e `card`): fundo da área de conteúdo, dos cards e da barra superior.
- **Tinta Quase Preta** (`foreground`, `card-foreground` e `sidebar-foreground`, ≈ #0a0a0a): texto principal e títulos. O tooltip usa a mesma cor invertida, como fundo. Duas derivações dela têm papel fixo: a **Tinta a 80%**, o corpo de leitura do cliente, e a **Tinta a 75%**, o texto secundário sobre o cabeçalho tingido.
- **Papel da Lateral** (`sidebar`, ≈ #fafafa): fundo da sidebar, um degrau abaixo do branco.
- **Cinza Névoa** (`secondary`, `muted` e `sidebar-accent`, ≈ #f5f5f5): item ativo e hover da sidebar, trilho da barra de progresso, badge secundário, número de passo, quadro de ícone do estado vazio e hover de item de lista (a 50%).
- **Cinza Legenda** (`muted-foreground`, ≈ #737373): a descrição sob o título de card, datas, previsões, a legenda dos estados, rótulos de KPI, a trilha e o rodapé. Dá 4,7:1 sobre branco e 4,5:1 na sidebar, no limite do AA.
- **Linha Fina** (`border` e `sidebar-border`, ≈ #e5e5e5): divisores de lista, borda da barra superior e da tabela, recuo dos subitens da sidebar, a linha e os pontos passados da linha do tempo.
- **Anel Cinza** (`ring`, ≈ #a1a1a1): o anel de foco do tema, aplicado a 50%.

### Named Rules
**The Brand-as-Marker Rule.** A cor do cliente só marca: o tingimento do cabeçalho do projeto (gradiente de 10% e borda de 20%), nas duas superfícies; o ponto do relatório atual na linha do tempo, nas duas; e o ponto de 10px na tabela e nos fatos do projeto, no admin. Ela nunca é cor de texto (nem o destaque do título, que é sublinhado) e nunca pinta barra de progresso nem a sidebar, porque marcas vermelhas (Movi, Neon) leriam como alarme.

**The Achromatic Frame Rule.** Todo neutro tem croma zero e o Grafite é o único tom de ação. Link dentro do conteúdo é texto com sublinhado no hover, não texto azul.

**The Four States Rule.** Estado tem quatro tons com significado fixo e igual nas duas superfícies: verde para feito, âmbar para em curso ou esperando ação, cinza para planejado ou encerrado, azul para em espera. Eles aparecem como ponto de 8px, ícone de 16px ou número de KPI em alerta, sempre ao lado da palavra (visível ou para leitor de tela).

## Typography

**Display Font:** Inter (com ui-sans-serif, system-ui, sans-serif)
**Body Font:** Inter (com ui-sans-serif, system-ui, sans-serif)
**Label/Mono Font:** nenhuma; não há segunda família nem mono.

**Character:** Inter no tema padrão, neutra e legível em tamanho pequeno. Os títulos ganham peso 600 e tracking levemente fechado; o trabalho vive em 14px e a leitura do cliente em 15px, com o peso 500 marcando o que é nome ou ação. A fonte vem de `next/font` com a variável `--font-sans` na `<html>`, de onde a gaveta do celular, que é portal, também a herda.

### Hierarchy
- **Display** (600, 2.25rem, tracking -0.025em; 1.875rem abaixo de 768px no cabeçalho do projeto e de 1024px na saudação): o h1 de cada página com moldura, ou seja, a saudação do admin, o nome do projeto no admin e o título do relatório no cliente. Usa `text-balance`.
- **Headline** (600, 1.5rem, números tabulares): o valor de KPI e o percentual do progresso geral. A unidade fica ao lado em Body, na cor Cinza Legenda. No mesmo tamanho e peso, com tracking -0.025em, é o h1 da raiz e do 404.
- **Section Title** (600, 1.125rem, tracking -0.025em): o h2 de cada seção numerada do relatório do cliente. O número vem antes, no mesmo tamanho, em 500, Cinza Legenda e tabular.
- **Title** (500, 1rem, 1.375): título de card, sempre envolvendo um h2 (ou um h3, no card de status dentro de uma seção).
- **Body Large** (400 ou 500, 1rem, 1.5): o subtítulo no cabeçalho do projeto (até 65ch) e a fase no hero do admin.
- **Body Read** (400, 15px, 24px de entrelinha): o corpo de leitura do cliente. São a descrição do card de status, o passo, a pendência, o rótulo da linha de progresso, o título do item de escopo e o aviso de ciclo de vida. O título de item fica no mesmo tamanho em 500 e Tinta cheia. A introdução dos próximos passos também tem 15px, mas é a descrição do card e fica em Cinza Legenda.
- **Body** (400, 0.875rem): o texto de trabalho do admin (descrições, células, a trilha, itens da sidebar) e, no cliente, a descrição sob o título de card, o título de cada entrada da linha do tempo e a descrição do item de escopo (esses dois em Tinta a 80%).
- **Label** (500, 0.875rem): botão, item ativo da sidebar, nome do projeto na tabela, título de item de lista, a data na linha do tempo, o valor de cada fato do cabeçalho e a linha "Cliente · Projeto" (em Tinta a 75%).
- **Label Small** (500, 0.75rem): texto de badge, percentual ao lado da barra, número de passo, rótulo de grupo da sidebar.
- **Caption** (400, 0.75rem): o rótulo de cada fato do cabeçalho (em Tinta a 75%), a previsão sob a frente, a legenda dos estados, o rodapé do relatório, a data relativa e a nota de KPI do admin, o rodapé da sidebar do admin e o tooltip.

### Named Rules
**The One Family Rule.** Inter em tudo. Não há mono decorativo, segunda família, caixa-alta nem tracking aberto; a hierarquia vem só do tamanho (de 12 a 36px) e do peso (400/500/600).

**The Tabular Numbers Rule.** Todo número que se compara com outro (percentual, KPI, data em coluna ou na linha do tempo, número de passo, número de seção, valor de fato) usa `tabular-nums`.

**The No Eyebrow Rule.** Nenhum título tem rótulo acima dele. O contexto vai ao lado (o badge de ciclo de vida ao lado do h1) ou abaixo (a linha "Cliente · Projeto" sob o título do relatório, a descrição de card, a linha de data da saudação).

**The Underlined Highlight Rule.** A palavra de destaque de um h1 (a saudação do admin, o `highlight` do título do relatório) ganha sublinhado de 3px com offset de 6px, na cor do próprio texto. Destaque nunca é cor, nem a do cliente.

**The Reading Body Rule.** No cliente, o texto que o cliente veio ler fica em Body Read, na Tinta a 80%, até 65ch e com `text-pretty`. O Cinza Legenda fica para a descrição sob o título de card, datas, previsões, a legenda e o rodapé, nunca para o parágrafo do relatório.

## Layout

Toda página que tem um cliente ou navegação é uma moldura de sidebar com área de conteúdo (`SidebarProvider` + `SidebarInset`), no admin (`AdminShell`) e no cliente (`ClientShell`). A sidebar tem 256px aberta e 48px fechada em trilho de ícones; abaixo de 768px ela vira uma gaveta de 288px que abre pela esquerda. A barra superior tem 56px, fica fixa no topo com borda inferior e padding de 16px (24px a partir de 1024px). A coluna de conteúdo tem até 1152px, centrada, com padding de 16px (32px a partir de 1024px) e 24px entre blocos.

O ritmo usa a escala de 4px do Tailwind: 24px entre cards e seções, 16px dentro do card e entre KPIs, 12px de respiro vertical por linha de lista, e de 4 a 8px entre título, badges e descrição. No admin, os indicadores ficam em 2 colunas e passam a 4 a partir de 1280px; a tabela esconde colunas conforme a largura (fase abaixo de 1280px, data e situação abaixo de 768px), e no estreito a data e o ciclo dobram para baixo do nome. Os blocos com âncora usam `scroll-mt` de 80px para não ficar sob a barra fixa.

A partir de 1280px, a página do projeto se divide em duas colunas (`minmax(0,1.8fr)` e `minmax(300px,1fr)`), com a coluna lateral fixa a 80px do topo, nas duas superfícies. No cliente, o cabeçalho tingido ocupa a largura toda acima delas; a coluna principal leva o aviso de ciclo de vida, "Aguardando você", o progresso por área, o escopo, os próximos passos e as seções, e a lateral leva a linha do tempo e o contato. Abaixo de 1280px tudo vira uma coluna, na mesma ordem. Os cards de cada seção ficam em 2 colunas a partir de 640px, com 16px entre eles, e o card marcado como largo ocupa as duas. Os fatos do cabeçalho ficam em grade de 2 colunas no celular e em linha a partir de 640px, com 40px entre eles. Na linha de progresso, a barra desce para baixo do rótulo no celular; a partir de 640px ela vira uma coluna de 160px, com o percentual numa coluna de 40px à direita.

No cliente, a coluna mostra um projeto por vez. A sidebar troca o projeto pelo hash da URL (`#<id>`), sem rota nova; hash vazio ou desconhecido mostra o primeiro. Quando o cliente troca, a página volta ao topo e o foco vai para o título do relatório. Um link direto não conta como troca.

**The Shell Rule.** Toda página com cliente ou navegação entra pelo mesmo shell: sidebar, barra de 56px com a trilha à esquerda e as ações à direita, e coluna de até 1152px. Isso vale para o admin e para o cliente. As únicas páginas sem a moldura são a raiz e o 404, que não têm cliente nem navegação: são um estado vazio centrado na tela inteira, com 16px de margem.

**The Whole Report Prints Rule.** "Salvar PDF" imprime todos os projetos da página, e cada um começa em página nova. A sidebar, a barra superior e o card de contato ficam de fora, as seções concluídas saem abertas e os fundos (barras, pontos e o tingido) são mantidos com `print-color-adjust: exact`. O título de seção e as duas últimas linhas do progresso nunca ficam sozinhos numa quebra. `break-inside-avoid` vale só para blocos curtos e linhas, nunca para um card longo, que seria empurrado inteiro e deixaria o título sozinho. O mesmo bloco de impressão vale para o PDF do admin.

## Elevation & Depth

O sistema é plano. Os cards se separam do fundo por um anel de 1px em Tinta a 10%, desenhado como `box-shadow`, sem sombra difusa. A sidebar se separa por tom (Papel da Lateral contra o branco) e por uma borda de 1px. A única sombra em repouso é a sombra mínima do cabeçalho tingido do projeto (o hero do admin e o cabeçalho do relatório do cliente). Profundidade de verdade só existe para o que sobrepõe a página: a gaveta da sidebar no celular e o tooltip, que é invertido (fundo Tinta) em vez de levantado.

### Shadow Vocabulary
- **Anel de card** (`box-shadow: 0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)`): todo card.
- **Sombra mínima** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): só no cabeçalho tingido do projeto, para assentar a superfície.
- **Gaveta** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): a sidebar no celular, sobre um véu preto a 10% com desfoque de 4px.

### Named Rules
**The Hairline Rule.** Superfície em repouso se separa por anel ou borda de 1px, nunca por sombra difusa. Sombra grande só para o que flutua sobre a página.

## Shapes

Os raios descem de um único valor (`--radius`, 10px) e diminuem de fora para dentro: 14px nos containers (card, cabeçalho do projeto, estado vazio), 10px nos controles (botão, item de lista, o tile de marca de 32px no topo da sidebar, o tile "IT" de 40px da raiz, o quadro de ícone de 32px do estado vazio), 8px nos itens da sidebar, no tooltip e no botão de ícone, e 4px no tile da inicial do cliente na lista do admin (16px). Badges são pílulas de 20px de altura (raio de 26px). Pontos de estado, pontos de marca, barras de progresso e números de passo são círculos ou cápsulas completos.

As listas dentro dos cards se dividem com linhas finas entre itens, sem caixa em volta de cada linha; os itens do escopo, em duas colunas, levam a linha fina em cima. A linha do tempo é uma linha vertical de 1px com pontos de 10px, recortados por uma borda de 2px na cor do card. O estado vazio, quando fica dentro da moldura, usa traço tracejado de 1px; na raiz e no 404 ele não tem borda.

## Components

### Buttons
Preenchidos, sempre em Grafite, e só onde há ação.
- **Shape:** cantos suavemente arredondados (10px).
- **Primary:** fundo Grafite de Ação, texto Branco de Contraste, 32px de altura, 10px de padding lateral (8px do lado de um ícone no fim), em Label. O ícone tem 16px e 6px de distância do texto. No admin, "Página do cliente" leva a seta ↗ no fim; no cliente, "Salvar PDF", "WhatsApp" e "E-mail" levam o ícone no começo (impressora, balão, envelope).
- **Icon-only:** abaixo de 640px, os três botões da barra do cliente viram quadrados preenchidos de 32px só com o ícone, e o nome continua para leitor de tela.
- **Hover / Focus:** no hover, o fundo cai para o Grafite a 80%. No foco visível, a borda vira Anel Cinza e ganha um anel de 3px em Anel Cinza a 50%. Ao clicar, o botão desce 1px; desabilitado fica a 50% de opacidade.
- **Ghost (ícone):** quadrado de 28px, raio de 8px, sem fundo, com Cinza Névoa no hover. Só existe como gatilho da sidebar.

**The One Filled Button Rule.** Ação é botão preenchido em Grafite (gosto do dono desde a v2), nunca outline. No admin há no máximo um por página, no fim da barra superior. No cliente a exceção é fixa: três na barra ("Salvar PDF", "WhatsApp" e "E-mail") e dois no card "Ficou com alguma dúvida?" (WhatsApp e E-mail); numa página sem relatório, o estado vazio leva também "Projetos anteriores · N". Os outros caminhos são links de texto, nunca botões outline concorrendo com eles.

### Chips
- **Style:** o badge outline tem pílula de 20px, borda de 1px em Linha Fina, texto Tinta em Label Small e um ponto de estado de 8px antes da palavra. Ele serve ao estado do card ("Concluído", "Em andamento", "Planejado"), ao ciclo de vida (com o mês para projeto concluído ou encerrado), à contagem da seção concluída ("8 entregas") e, no admin, ao motivo de atenção ("3 pendências do cliente", "Parado há 20 dias").
- **Secondary:** a mesma pílula preenchida de Cinza Névoa, com texto Grafite, para metadado neutro: "Você está aqui" e "Atual" na linha do tempo, "desde 15 Jul 2026" na pendência, "acrescentado em" e "saiu do escopo em" no item de escopo.
- **State:** os badges não são clicáveis nem selecionáveis.

**The Dot Carries State Rule.** O estado mora no ponto, e o badge continua neutro. Não existe badge preenchido de verde, âmbar ou azul.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Branco de Página.
- **Shadow Strategy:** anel de card de 1px (ver Elevation & Depth); sem sombra.
- **Border:** nenhuma além do anel.
- **Internal Padding:** 16px nos quatro lados (`--card-spacing`), com 16px entre cabeçalho e conteúdo e 4px entre título e descrição. O título é um h2 em Title; a descrição embaixo, em Body Cinza Legenda, conta ou apresenta o conteúdo ("4 projetos", "Para o projeto seguir no ritmo, precisamos de:").
- **Status card (cliente):** título h3 em Title à esquerda, badge de estado no canto superior direito e a descrição em Body Read na Tinta a 80%. Card não tem card dentro.
- **KPI (admin):** o valor vem primeiro, em Headline (que vira Âmbar quando algo espera ação), com a unidade ao lado em Body Cinza Legenda; embaixo vêm o rótulo e, se houver, uma nota em Caption. É marcado como `dl`, com a ordem visual invertida.

### Navigation
- **Sidebar do admin:** fundo Papel da Lateral. No topo, o tile "IT" de 32px em Grafite com "ITGraph" e "Painel interno". Depois vêm "Visão geral" e o grupo "Clientes" (rótulo em Label Small a 70%). Cada item tem 32px e raio de 8px, com Cinza Névoa no hover; o ativo leva Cinza Névoa e peso 500 e marca `aria-current`. Cada cliente é uma dobra aberta por padrão, com chevron que gira 90° e o tile monocromático da inicial. Os projetos são subitens de 28px recuados por uma linha fina, cada um com o ícone de estado. No rodapé fica a data do deploy em Caption.
- **Sidebar do cliente:** a mesma moldura, só com os projetos do próprio cliente. No topo, o tile de 32px em Grafite com a inicial do cliente, o nome em 600 e "{fornecedor} · Portal de acompanhamento" em Caption Cinza Legenda, que quebra linha em vez de cortar. Depois vêm o grupo "Projetos" (os em curso, primeiro os em andamento e depois os em espera) e, se houver, "Projetos anteriores" (concluídos e encerrados); se nenhum anterior tiver relatório, esse grupo é um único link com ícone de arquivo para `/anteriores`. Os projetos são itens de 32px no primeiro nível, com o ícone de estado. O item ativo vem do hash; escolher um projeto fecha a gaveta no celular. Não há rodapé, porque cliente e fornecedor já estão no topo e no rodapé de cada relatório.
- **Rail:** as duas sidebars colapsam para 48px de ícones. O nome vai no tooltip (invertido, sem atraso). No admin, o botão do cliente vira link para a seção dele na visão geral; no cliente, o tile da inicial leva à página principal do cliente.
- **Top bar:** botão ghost da sidebar, separador vertical de 16px e trilha em Body Cinza Legenda, com a página atual em Tinta. No cliente, a trilha é "Cliente › Projeto" (ou "Cliente › Projetos anteriores › Projeto"), e o último item é o projeto que o hash mostra. No estreito, só o último item aparece. As ações ficam à direita: uma no admin, três no cliente. A barra nunca imprime.
- **Mobile:** abaixo de 768px, a sidebar vira gaveta (ver Elevation & Depth) com o mesmo conteúdo.

**The Monochrome Sidebar Rule.** A sidebar se lê por forma, não por cor. O tile de marca do topo é Grafite (o "IT" no admin, a inicial no cliente); na lista do admin, cliente é um tile da inicial em Tinta a 10%. Projeto é um ícone lucide monocromático de 16px que diz o estado pela forma: círculo com ponto para em dia ou em andamento, alerta para pendência ou "aguardando você", pausa para em espera, check para concluído e X para encerrado; o relógio, de parado ou sem relatório, só existe no admin. O nome do estado fica só para leitor de tela. A cor do cliente nunca entra na sidebar.

### Progress
- **Bar:** trilho de 4px em Cinza Névoa, cápsula, com indicador Grafite. O percentual fica ao lado em Label Small tabular, alinhado à direita numa coluna fixa. No cabeçalho do projeto, o trilho sobe para 8px.
- **Row (cliente):** o ícone de estado à esquerda, o rótulo em Body Read e, para frente não concluída com previsão, "previsão: <mês>" embaixo em Caption Cinza Legenda. A legenda dos três ícones (14px, com a palavra em Caption Cinza Legenda) fica sob o título do card e é escondida do leitor de tela, porque cada linha já diz o estado.
- **State:** a barra não muda de cor por estado nem por cliente. O estado de cada frente vai no ícone à esquerda dela (check verde, ponto âmbar, círculo vazio cinza).

### Project Header (signature)
O cabeçalho do projeto é a única superfície tingida do sistema, e é o mesmo nas duas superfícies: o hero da página de projeto do admin e o cabeçalho de cada relatório do cliente. É uma seção com raio de 14px, borda de 1px na cor do cliente a 20% e um gradiente para baixo e à direita, da cor do cliente a 10% até o Branco de Página, com a sombra mínima. O padding é de 20px (28px a partir de 768px).

- **Admin:** o h1 em Display com o nome do projeto e o badge de ciclo de vida ao lado (que quebra linha se faltar espaço), a fase em Body Large 500, o subtítulo em Body Large até 65ch, e embaixo a linha de contexto (frentes, atualização, primeiro relatório) com o percentual em Headline à direita, sobre a barra de 8px.
- **Cliente:** três blocos com 24px entre eles. Primeiro, o h1 em Display com o título do relatório (o destaque sublinhado), a linha "Cliente · Projeto" em Label na Tinta a 75% e o subtítulo em Body Large até 65ch. Depois, os fatos ("Fase atual", "Atualizado", "Plataforma", "Entregas concluídas"), com o rótulo em Caption e o valor em Label tabular. Por fim, "Progresso geral" em Body com o percentual em Headline à direita, sobre a barra de 8px em Grafite. O badge de ciclo de vida só aparece para em espera, concluído e encerrado. Num projeto em andamento ele some, porque o ponto verde contradiria a legenda logo abaixo, onde verde quer dizer concluído. O h1 recebe o foco quando o cliente troca de projeto.

**The Tinted Surface Rule.** Sobre superfície tingida pela marca, o texto secundário deriva da Tinta a 75% (cerca de 8:1), nunca do Cinza Legenda, que cai para perto de 3,9:1 sobre o tingimento.

### Report Blocks (cliente)
Cada relatório é uma sequência de cards planos, na ordem de leitura.
- **Aviso de ciclo de vida:** só para projeto em espera ou encerrado. É um card cujo título leva o ponto do estado ("Projeto em espera", "Projeto encerrado"), com "desde <data>" na descrição e o motivo em Body Read. No projeto em espera com pendência, uma linha em Cinza Legenda aponta para o bloco de baixo.
- **Aguardando você:** uma linha por pendência, divididas por linha fina. Cada linha tem o ponto âmbar de 8px, o título em Body Read 500, a descrição na Tinta a 80% e o badge secundário "desde <data>".
- **Próximos passos:** uma lista numerada. O número fica num círculo de 20px em Cinza Névoa, em Label Small tabular, com o título do passo em 500 e a descrição na Tinta a 80%.
- **O que está no projeto:** a descrição traz "N de M itens entregues", com a contagem em Tinta 500 tabular. Os grupos têm título em Label Cinza Legenda, e os itens ficam em duas colunas a partir de 640px, cada um com linha fina em cima: ícone de estado, nome em Body Read 500, a palavra do estado à direita em Caption Cinza Legenda e a descrição embaixo. Item removido fica em Cinza Legenda e riscado.
- **Seções:** não são cards. O cabeçalho é o número e o h2 em Section Title, e embaixo vem a grade de cards de status. A seção inteiramente concluída vira um `<details>` nativo fechado. Seu `summary` leva o badge outline "N entregas" com ponto verde e um chevron que gira 90°, com anel de foco de 3px. Na impressão, ela sai aberta.

**The Plain Section Number Rule.** O número de seção é texto simples, em Cinza Legenda e tabular, no tamanho do título e antes do h2. Ele nunca fica num círculo, que é dos passos numerados logo acima: os dois não podem parecer a mesma sequência.

### Timeline
É um card "Linha do tempo" com cada relatório publicado, do mais recente para o mais antigo. A linha vertical tem 1px em Linha Fina, com 20px de recuo. Cada entrada tem um ponto de 10px em Linha Fina, a data em Label tabular e o título embaixo, na Tinta a 80% e até 65ch. No relatório atual, o ponto fica na cor do cliente e leva o badge secundário "Você está aqui" (no admin, "Atual"). Com mais de 6 entradas, o resto vira uma linha "+ N atualizações anteriores" em Caption Cinza Legenda.

**The Absolute Dates Rule.** Página de cliente mostra só data absoluta ("21 Out 2026"; a previsão por mês, "Jan 2027"). O site só é reconstruído quando um relatório é publicado, então um "hoje" ou "há N dias" calculado no build fica falso no dia seguinte. O admin pode usar a data relativa porque é interno e mostra a data do deploy.

### Contact and Footer
- **Contato:** o card "Ficou com alguma dúvida?", com a descrição em Body Cinza Legenda e os dois botões preenchidos lado a lado, com 8px entre eles. Fecha a coluna lateral em tela larga, não imprime e não aparece se o cliente não tem WhatsApp nem e-mail. Na barra superior, os mesmos canais ficam num `nav` "Contato".
- **Rodapé:** linha fina em cima, 16px de respiro e Caption Cinza Legenda, com "{cliente} · {fornecedor}" à esquerda e, à direita, "Ver contrato assinado" (link em Tinta 500, sublinhado no hover) ou "Documento de acompanhamento".

### Empty States
- **Raiz e 404:** fora da moldura, centrados na tela, sem borda. A mídia da raiz é o tile "IT" de 40px em Grafite; a do 404 é o quadro de 32px em Cinza Névoa com um ícone de link. O h1 fica no tamanho de Headline, e a descrição em Body Cinza Legenda, com entrelinha folgada. Nenhum dos dois cita cliente ou slug.
- **Dentro da moldura:** um cliente sem relatório ou sem anteriores com relatório vê o estado vazio com borda tracejada de 1px e raio de 14px, com o quadro de ícone de 32px, o h1 e a descrição. Na página principal, quando há anteriores, ele leva o botão "Projetos anteriores · N"; em `/anteriores`, lista os projetos com o mês do fim.
- **Admin:** a lista "Precisa de atenção" vazia mostra o mesmo quadro de ícone, com título em Label e descrição em Body Cinza Legenda.

### Attention List (admin)
Os itens são links inteiros, com raio de 10px, padding de 10px por 12px e Cinza Névoa a 50% no hover. A primeira linha traz o cliente em Body Cinza Legenda, seguido de "·" e do projeto em Label. Depois vêm os badges de motivo e uma linha de detalhe em Body Cinza Legenda; o chevron fica à direita, centralizado.

### Tables (admin)
É uma tabela única, com um grupo de linhas por cliente. O cabeçalho de cada grupo traz o ponto de marca de 10px, o nome do cliente em 600 e o link "Página do cliente ↗" em Caption Cinza Legenda à direita. As linhas têm 8px de padding por célula e são divididas por linha fina. Como só o nome do projeto é link, a linha não tem hover.

## Do's and Don'ts

### Do:
- **Do** montar toda página com cliente ou navegação dentro do shell: sidebar de 256px, barra de 56px e coluna de até 1152px com 24px entre blocos. Só a raiz e o 404 ficam fora, como estado vazio centrado.
- **Do** partir dos primitivos gerados em `src/components/ui/` (Card, Badge, Button, Item, Table, Progress, Empty, Sidebar, Tooltip, Breadcrumb, Separator) antes de escrever marcação própria, e registrar em DECISOES §19 qualquer edição neles.
- **Do** marcar estado com o ponto de 8px dentro de um badge outline, ou com o ícone lucide de 16px, sempre junto da palavra (visível ou para leitor de tela).
- **Do** usar botão preenchido em Grafite para toda ação: um por página no admin; no cliente, os três da barra (só ícone abaixo de 640px) e os dois do card de contato.
- **Do** usar `tabular-nums` em todo número comparável e Headline (600, 1.5rem) nos valores de KPI e no progresso geral.
- **Do** usar a Tinta a 75% para texto secundário sobre o cabeçalho tingido.
- **Do** escrever o corpo de leitura do cliente em Body Read (15px, entrelinha de 24px), na Tinta a 80%, até 65ch e com `text-pretty`.
- **Do** pôr o badge de ciclo de vida ao lado do h1 (no cliente, só para em espera, concluído e encerrado), e a contagem de cada card como descrição embaixo do título.
- **Do** conferir a impressão a cada mudança no relatório: todos os projetos, cada um em página nova, sem sidebar, barra nem contato, com as seções abertas e os fundos mantidos.

### Don't:
- **Don't** usar a cor do cliente como cor de texto (nem no destaque do título), para pintar barra de progresso ou na sidebar; marcas vermelhas (Movi, Neon) leem como alarme.
- **Don't** colorir a sidebar, nem por cliente nem por estado; ela usa tiles e ícones monocromáticos.
- **Don't** pôr rótulo ou eyebrow acima de título, nem kicker em caixa-alta acima de bloco.
- **Don't** adicionar uma segunda família, mono decorativo ou caixa-alta com tracking aberto.
- **Don't** usar Cinza Legenda sobre superfície tingida pela marca, nem no parágrafo que o cliente veio ler.
- **Don't** mostrar o badge de ciclo de vida num projeto em andamento na página do cliente: o ponto verde contradiz a legenda, onde verde quer dizer concluído.
- **Don't** mostrar data relativa ("hoje", "há N dias") em página de cliente.
- **Don't** pôr o número de seção num círculo; o círculo é do passo numerado.
- **Don't** dar hover de linha inteira numa linha de tabela cujo único link é o nome.
- **Don't** importar CSS fora do layout raiz nem criar uma segunda folha de estilo; a única regra própria fora de camada no `tailwind.css` é o bloco de impressão.
