---
name: Portal de Status ITGraph
description: shadcn/ui no tema padrão com Inter; cor só para estado e para marcar o cliente. Hoje no painel interno, depois nas páginas de cliente.
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
    padding: "0 8px 0 10px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "oklch(0.205 0 0 / 0.8)"
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
  attention-item:
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
---

# Design System: Portal de Status ITGraph

## Overview

**Creative North Star: "A Mesa de Triagem"**

O sistema é o vocabulário de produto da categoria (sidebar, trilha, cards, tabela) no tema padrão do shadcn/ui: estilo `base-nova`, primitivos Base UI, base `neutral`, com Inter. É escolha explícita do dono: numa tela de trabalho, um vocabulário de componentes conhecido vale mais do que um visual autoral, e uma prévia desenhada à mão no lugar dos primitivos foi rejeitada. A personalidade vem do conteúdo (estados, datas, a cor de cada cliente), não da moldura. A moldura é neutra, o primary é quase preto e há um único tom de ação.

A leitura é por varredura, com densidade média. O olho acha primeiro o que pede ação (um número em âmbar, um badge com ponto) e só depois o detalhe. A cor tem duas funções e só duas: dizer o estado (quatro tons fixos) e marcar de quem é o projeto (a cor do cliente, como marcador). Todo o resto é cinza. As superfícies são planas e se separam por um anel de 1px, não por sombra.

Escopo: este é o sistema-alvo do projeto inteiro (DECISOES §19), adotado em duas etapas. Hoje só o painel interno (`/a/…`) roda nele, carregado por `src/app/a/layout.tsx` e `src/app/tailwind.css`. As páginas de cliente (`/r/…`, `/anteriores` e a raiz) continuam no mundo v2 em CSS puro (`src/app/globals.css`, Archivo, DECISOES §14) até a migração delas, num PR próprio com prévia. Nada neste arquivo descreve a v2, e nenhuma regra da v2 vale aqui; na migração, as páginas de cliente entram neste sistema, e não o contrário. O único elo de propósito entre os dois mundos são os quatro tons de estado, com os mesmos valores e o mesmo significado.

**Key Characteristics:**
- Tema padrão do shadcn (`base-nova`, neutral), neutros sem croma e primary quase preto.
- Inter como família única; a hierarquia vem de tamanho e peso, nunca de caixa-alta.
- Cor só para estado (verde, âmbar, cinza, azul) e para marcar o cliente.
- Superfícies planas com anel de 1px; raio de 14px nos containers e de 10px nos controles.
- Sidebar monocromática, que se lê por forma de ícone e colapsa para um trilho de ícones.
- Só tema claro: o bloco `.dark` veio do gerador e nenhuma página o liga.

## Colors

Paleta acromática do tema padrão, com quatro tons de estado e uma cor por cliente que marca, mas nunca pinta.

### Primary
- **Grafite de Ação** (`primary` e `sidebar-primary`, ≈ #171717): o botão preenchido, o indicador de toda barra de progresso e o tile "IT" no topo da sidebar. O texto sobre ele é o **Branco de Contraste** (`primary-foreground`, ≈ #fafafa). É o único tom de interação do sistema.

### State
- **Verde Entregue** (`done`): frente concluída (ícone) e o ponto dos ciclos "em andamento" e "concluído". Dá 4,4:1 sobre branco, então serve a ícone e ponto, não a texto corrido.
- **Âmbar em Curso** (`prog`): frente em andamento e, sobretudo, "algo espera ação". É o ponto de pendência do cliente, o número de KPI em alerta (4,7:1) e, como anel oco de 2px, o sinal de "parado" ou "sem relatório".
- **Cinza Planejado** (`plan`): o ponto de "encerrado", sempre a 50%. Frente planejada usa o ícone vazio em Cinza Legenda.
- **Azul em Espera** (`hold`): o ponto de projeto em espera.

Os fundos claros desses tons (`done-bg`, `prog-bg`, `plan-bg`, `hold-bg`) existem no tema com os valores da v2, mas nenhuma superfície deste sistema os usa ainda.

### Client brand
- **Cor do cliente** (`--brand`, vinda de `brandColor` em `content/clients/<id>.json`): não é token do tema, porque muda por cliente. Entra como variável inline no bloco do cliente (a linha de grupo da tabela, o wrapper da página do projeto) e só aparece nos usos listados na regra abaixo.

### Neutral
- **Branco de Página** (`background` e `card`): fundo da área de conteúdo, dos cards e da barra superior.
- **Tinta Quase Preta** (`foreground`, `card-foreground` e `sidebar-foreground`, ≈ #0a0a0a): texto principal. O tooltip usa a mesma cor invertida, como fundo.
- **Papel da Lateral** (`sidebar`, ≈ #fafafa): fundo da sidebar, um degrau abaixo do branco.
- **Cinza Névoa** (`secondary`, `muted` e `sidebar-accent`, ≈ #f5f5f5): item ativo e hover da sidebar, trilho da barra de progresso, badge secundário, número de passo e hover de item de lista (a 50%).
- **Cinza Legenda** (`muted-foreground`, ≈ #737373): descrições, datas relativas, rótulos de KPI e a trilha. Dá 4,7:1 sobre branco e 4,5:1 na sidebar, no limite do AA.
- **Linha Fina** (`border` e `sidebar-border`, ≈ #e5e5e5): divisores de lista, borda da barra superior e da tabela, recuo dos subitens da sidebar e a linha do histórico.
- **Anel Cinza** (`ring`, ≈ #a1a1a1): o anel de foco do tema, aplicado a 50%.

### Named Rules
**The Brand-as-Marker Rule.** A cor do cliente só marca: o ponto de 10px na tabela e nos fatos do projeto, o ponto do relatório atual no histórico, e o tingimento do hero do projeto (gradiente de 10% e borda de 20%). Ela nunca é cor de texto e nunca pinta barra de progresso, porque marcas vermelhas (Movi, Neon) leriam como alarme.

**The Achromatic Frame Rule.** Todo neutro tem croma zero e o Grafite é o único tom de ação. Link dentro do conteúdo é texto com sublinhado no hover, não texto azul.

**The Four States Rule.** Estado tem quatro tons com significado fixo e igual ao das páginas de cliente: verde para feito, âmbar para em curso ou esperando ação, cinza para planejado ou encerrado, azul para em espera. Eles aparecem como ponto de 8px, ícone de 16px ou número de KPI em alerta, sempre ao lado da palavra (visível ou para leitor de tela).

## Typography

**Display Font:** Inter (com ui-sans-serif, system-ui, sans-serif)
**Body Font:** Inter (com ui-sans-serif, system-ui, sans-serif)
**Label/Mono Font:** nenhuma; não há segunda família nem mono.

**Character:** Inter no tema padrão, neutra e legível em tamanho pequeno. Os títulos ganham peso 600 e tracking levemente fechado; o resto vive em 14px, com o peso 500 marcando o que é nome ou ação.

### Hierarchy
- **Display** (600, 2.25rem, tracking -0.025em; 1.875rem abaixo de 768px no hero e de 1024px na saudação): o h1 de cada página, ou seja, a saudação da visão geral e o nome do projeto. Usa `text-balance`. Na saudação, a palavra de destaque ganha sublinhado de 3px com offset de 6px.
- **Headline** (600, 1.5rem, números tabulares): o valor de KPI e o percentual do hero. A unidade fica ao lado em Body, na cor Cinza Legenda.
- **Title** (500, 1rem, 1.375): título de card, sempre envolvendo um h2.
- **Body Large** (400 ou 500, 1rem, 1.5): o subtítulo e a fase no hero, até 65ch.
- **Body** (400, 0.875rem): o texto de trabalho; descrições, células, a trilha, itens da sidebar.
- **Label** (500, 0.875rem): botão, item ativo da sidebar, nome do projeto na tabela, título de item de lista.
- **Label Small** (500, 0.75rem): texto de badge, percentual ao lado da barra, rótulo de grupo da sidebar.
- **Caption** (400, 0.75rem): data relativa sob a data, nota de KPI, rodapé da sidebar, tooltip.

### Named Rules
**The One Family Rule.** Inter em tudo. Não há mono decorativo, segunda família, caixa-alta nem tracking aberto; a hierarquia vem só do tamanho (de 12 a 36px) e do peso (400/500/600).

**The Tabular Numbers Rule.** Todo número que se compara com outro (percentual, KPI, data em coluna, número de passo) usa `tabular-nums`.

**The No Eyebrow Rule.** Nenhum título tem rótulo acima dele. O contexto vai ao lado (o badge de ciclo de vida ao lado do h1) ou abaixo (a descrição de card, a linha de data da saudação).

## Layout

Toda página do sistema é uma moldura de sidebar com área de conteúdo (`SidebarProvider` + `SidebarInset`). A sidebar tem 256px aberta e 48px fechada em trilho de ícones; abaixo de 768px ela vira uma gaveta de 288px que abre pela esquerda. A barra superior tem 56px, fica fixa no topo com borda inferior e padding de 16px (24px a partir de 1024px). A coluna de conteúdo tem até 1152px, centrada, com padding de 16px (32px a partir de 1024px) e 24px entre blocos.

O ritmo usa a escala de 4px do Tailwind: 24px entre cards e seções, 16px dentro do card e entre KPIs, de 10 a 12px de altura de linha de lista, e de 4 a 8px entre título, badges e descrição. Os indicadores ficam em 2 colunas e passam a 4 a partir de 1280px. Na página do projeto, a partir de 1280px o conteúdo se divide em duas colunas (`minmax(0,1.8fr)` e `minmax(300px,1fr)`), com a coluna lateral fixa a 80px do topo. A tabela esconde colunas conforme a largura (fase abaixo de 1280px, data e situação abaixo de 768px), e no estreito a data e o ciclo dobram para baixo do nome. Os blocos com âncora usam `scroll-mt` de 80px para não ficar sob a barra fixa.

**The Shell Rule.** Toda página nova entra pelo mesmo shell: sidebar, barra de 56px com trilha à esquerda e no máximo uma ação à direita, e coluna de até 1152px. Não existe página sem a sidebar.

## Elevation & Depth

O sistema é plano. Os cards se separam do fundo por um anel de 1px em Tinta a 10%, desenhado como `box-shadow`, sem sombra difusa. A sidebar se separa por tom (Papel da Lateral contra o branco) e por uma borda de 1px. A única sombra em repouso é a sombra mínima do hero do projeto. Profundidade de verdade só existe para o que sobrepõe a página: a gaveta da sidebar no celular e o tooltip, que é invertido (fundo Tinta) em vez de levantado.

### Shadow Vocabulary
- **Anel de card** (`box-shadow: 0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)`): todo card.
- **Sombra mínima** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): só no hero do projeto, para assentar a superfície tingida.
- **Gaveta** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): a sidebar no celular, sobre um véu preto a 10% com desfoque de 4px.

### Named Rules
**The Hairline Rule.** Superfície em repouso se separa por anel ou borda de 1px, nunca por sombra difusa. Sombra grande só para o que flutua sobre a página.

## Shapes

Os raios descem de um único valor (`--radius`, 10px) e diminuem de fora para dentro: 14px nos containers (card, hero, estado vazio), 10px nos controles (botão, item de lista, o tile "IT" de 32px), 8px nos itens da sidebar, no tooltip e no botão de ícone, e 4px no tile da inicial do cliente (16px). Badges são pílulas de 20px de altura (raio de 26px). Pontos de estado, pontos de marca, barras de progresso e números de passo são círculos ou cápsulas completos.

As listas dentro dos cards se dividem com linhas finas entre itens, sem caixa em volta de cada linha. O histórico é uma linha vertical de 1px com pontos de 10px, recortados por uma borda de 2px na cor do fundo. O estado vazio, quando tem borda, usa traço tracejado de 1px.

## Components

### Buttons
Preenchidos, poucos e no canto certo.
- **Shape:** cantos suavemente arredondados (10px).
- **Primary:** fundo Grafite de Ação, texto Branco de Contraste, 32px de altura, 10px à esquerda e 8px à direita quando leva ícone no fim, em Label. O ícone tem 16px; em "Página do cliente", é a seta ↗.
- **Hover / Focus:** no hover, o fundo cai para o Grafite a 80%. No foco visível, a borda vira Anel Cinza e ganha um anel de 3px em Anel Cinza a 50%. Ao clicar, o botão desce 1px; desabilitado fica a 50% de opacidade.
- **Ghost (ícone):** quadrado de 28px, raio de 8px, sem fundo, com Cinza Névoa no hover. Só existe como gatilho da sidebar.

**The One Filled Button Rule.** Ação é botão preenchido (preferência do dono) e há no máximo um por página, no fim da barra superior. Os outros caminhos são links de texto, nunca botões outline concorrendo com ele.

### Chips
- **Style:** o badge outline tem pílula de 20px, borda de 1px em Linha Fina, texto Tinta em Label Small e um ponto de estado de 8px antes da palavra. Ele serve ao ciclo de vida (com o mês para projeto concluído ou encerrado) e ao motivo de atenção ("3 pendências do cliente", "Parado há 20 dias").
- **Secondary:** a mesma pílula preenchida de Cinza Névoa, com texto Grafite, para metadado neutro ("Atual", "Desde 5 Out 2026 · há 16 dias").
- **State:** os badges não são clicáveis nem selecionáveis neste sistema.

**The Dot Carries State Rule.** O estado mora no ponto, e o badge continua neutro. Não existe badge preenchido de verde, âmbar ou azul.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Branco de Página.
- **Shadow Strategy:** anel de card de 1px (ver Elevation & Depth); sem sombra.
- **Border:** nenhuma além do anel.
- **Internal Padding:** 16px nos quatro lados (`--card-spacing`), com 16px entre cabeçalho e conteúdo e 4px entre título e descrição. O título é um h2 em Title; a descrição embaixo, em Body Cinza Legenda, conta o conteúdo ("4 projetos", "16 frentes · 7 concluídas").
- **KPI:** o valor vem primeiro, em Headline (que vira Âmbar quando algo espera ação), com a unidade ao lado em Body Cinza Legenda; embaixo vêm o rótulo e, se houver, uma nota em Caption. É marcado como `dl`, com a ordem visual invertida.

### Navigation
- **Sidebar:** fundo Papel da Lateral. No topo, o tile "IT" de 32px em Grafite com "ITGraph" e "Painel interno". Depois vêm "Visão geral" e o grupo "Clientes" (rótulo em Label Small a 70%). Cada item tem 32px e raio de 8px, com Cinza Névoa no hover; o ativo leva Cinza Névoa e peso 500 e marca `aria-current`. Cada cliente é uma dobra aberta por padrão, com chevron que gira 90° e o tile monocromático da inicial. Os projetos são subitens de 28px recuados por uma linha fina, cada um com o ícone de estado. No rodapé fica a data do deploy em Caption.
- **Rail:** a sidebar colapsa para 48px de ícones. O nome vai no tooltip (invertido, sem atraso), e o botão do cliente vira link para a seção dele na visão geral.
- **Top bar:** botão ghost da sidebar, separador vertical de 16px e trilha em Body Cinza Legenda, com a página atual em Tinta. No estreito, só o último item da trilha aparece. A ação primária fica à direita.
- **Mobile:** abaixo de 768px, a sidebar vira gaveta (ver Elevation & Depth) com o mesmo conteúdo.

**The Monochrome Sidebar Rule.** A sidebar se lê por forma, não por cor. Cliente é um tile da inicial em Tinta a 10%; projeto é um ícone lucide monocromático de 16px que diz o estado pela forma (círculo com ponto para em dia, alerta para pendência, relógio para parado ou sem relatório, pausa para em espera, check para concluído, X para encerrado), com o nome do estado só para leitor de tela.

### Progress
- **Bar:** trilho de 4px em Cinza Névoa, cápsula, com indicador Grafite. O percentual fica ao lado em Label Small tabular, alinhado à direita numa coluna fixa. No hero, o trilho sobe para 8px.
- **State:** a barra não muda de cor por estado nem por cliente. O estado de cada frente vai no ícone à esquerda dela (check verde, ponto âmbar, círculo vazio cinza).

### Project Hero (signature)
O cabeçalho da página de cada projeto é a única superfície tingida do sistema. É uma seção com raio de 14px, borda de 1px na cor do cliente a 20% e um gradiente para baixo e à direita, da cor do cliente a 10% até o Branco de Página, com a sombra mínima. O padding é de 20px (28px a partir de 768px). Por dentro: o h1 em Display com o badge de ciclo de vida ao lado (que quebra linha se faltar espaço), a fase em Body Large 500, o subtítulo em Body Large até 65ch, e embaixo a linha de contexto (frentes, atualização, primeiro relatório) com o percentual em Headline à direita, sobre a barra de 8px.

**The Tinted Surface Rule.** Sobre superfície tingida pela marca, o texto secundário deriva da Tinta a 75% (cerca de 8:1), nunca do Cinza Legenda, que cai para perto de 3,9:1 sobre o tingimento.

### Attention List
Os itens são links inteiros, com raio de 10px, padding de 10px por 12px e Cinza Névoa a 50% no hover. A primeira linha traz o cliente em Body Cinza Legenda, seguido de "·" e do projeto em Label. Depois vêm os badges de motivo e uma linha de detalhe em Body Cinza Legenda; o chevron fica à direita, centralizado. Sem itens, mostra o estado vazio: um ícone num quadrado de 32px em Cinza Névoa, com título em Label e descrição em Body Cinza Legenda.

### Tables
É uma tabela única, com um grupo de linhas por cliente. O cabeçalho de cada grupo traz o ponto de marca de 10px, o nome do cliente em 600 e o link "Página do cliente ↗" em Caption Cinza Legenda à direita. As linhas têm 8px de padding por célula e são divididas por linha fina. Como só o nome do projeto é link, a linha não tem hover.

## Do's and Don'ts

### Do:
- **Do** montar toda página nova dentro do shell: sidebar de 256px, barra de 56px e coluna de até 1152px com 24px entre blocos.
- **Do** partir dos primitivos gerados em `src/components/ui/` (Card, Badge, Item, Table, Progress, Empty, Sidebar, Tooltip, Breadcrumb) antes de escrever marcação própria, e registrar em DECISOES §19 qualquer edição neles.
- **Do** marcar estado com o ponto de 8px dentro de um badge outline, ou com o ícone lucide de 16px, sempre junto da palavra (visível ou para leitor de tela).
- **Do** usar um único botão preenchido em Grafite por página, à direita da barra superior.
- **Do** usar `tabular-nums` em todo número comparável e Headline (600, 1.5rem) nos valores de KPI.
- **Do** usar a Tinta a 75% para texto secundário sobre o hero tingido.
- **Do** pôr o badge de ciclo de vida ao lado do h1, e a contagem de cada card como descrição embaixo do título.

### Don't:
- **Don't** usar a cor do cliente como cor de texto nem para pintar barra de progresso; marcas vermelhas (Movi, Neon) leem como alarme.
- **Don't** colorir a sidebar, nem por cliente nem por estado; ela usa tiles e ícones monocromáticos.
- **Don't** pôr rótulo ou eyebrow acima de título.
- **Don't** adicionar uma segunda família, mono decorativo ou caixa-alta com tracking aberto.
- **Don't** usar Cinza Legenda sobre superfície tingida pela marca.
- **Don't** dar hover de linha inteira numa linha de tabela cujo único link é o nome.
- **Don't** carregar `tailwind.css` e `globals.css` na mesma página: a regra sem camada da v2 (`* { margin: 0; padding: 0 }`) anula todo utilitário do Tailwind.
- **Don't** aplicar estas regras às páginas de cliente antes da migração delas, nem trazer regras da v2 (Archivo, trilho na cor da marca, CSS puro) para dentro deste sistema.
