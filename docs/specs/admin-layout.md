# Spec: Painel admin v2 — visão geral + página por projeto (shadcn/ui)

- **Status:** aprovada
- **Data:** 2026-10-21

## Problema / motivação

O painel atual (`/a/<slug>`, spec `painel-admin.md`) é uma grade de cards, um por
cliente, numa coluna de 880px. Mostra os sinais vitais, mas não diz o que pede
ação e não tem vista de detalhe; na tela larga, onde o dono trabalha, sobra espaço.
O dono trouxe uma referência visual (dashboard "Zaga": barra lateral, hero com
progresso, faixa de indicadores, blocos de informação) e rejeitou uma prévia em
CSS puro feita à mão: quer componentes de biblioteca, mais fiéis à referência.

Superfície: modo **Operate** (o dono faz uma triagem e abre um projeto).
Visual: **shadcn/ui com o tema padrão + Inter**, adotado no projeto todo em duas
etapas: esta (base + admin) e, depois, as páginas de cliente, num PR próprio.

## Escopo

**Dentro:**

1. **Base Tailwind v4 + shadcn/ui (preset `base-nova`, Base UI)** com o CSS isolado
   por segmento:
   - o admin carrega só `src/app/tailwind.css`;
   - as páginas de cliente e a raiz carregam só o `globals.css` da v2, sem mudança
     visual.
2. **Shell do admin.**
   - `Sidebar` do shadcn com:
     - a marca "ITGraph · Painel interno";
     - "Visão geral";
     - os clientes (ponto na cor da marca), com os projetos aninhados e um sinal de
       estado em cada um.
   - O item atual tem `isActive` e `aria-current="page"`.
   - No celular (<768px), a sidebar vira `Sheet`.
   - Barra superior com `SidebarTrigger`, `Breadcrumb` (Painel › Cliente › Projeto)
     e o botão preenchido "Página do cliente".
3. **Visão geral (`/a/<slug>`).**
   - A saudação atual (`AdminGreeting`) e a data.
   - 4 indicadores:
     - em andamento;
     - pendências do cliente, com o nº de projetos;
     - parados há mais de 14 dias;
     - em espera.
   - **"Precisa de atenção":**
     - ordem: parado ou sem relatório → mais pendências → menos pendências → em
       espera;
     - cada item mostra o motivo e linka para o projeto;
     - estado vazio: "Nada pedindo ação agora".
   - **"Todos os projetos"** numa tabela agrupada por cliente: projeto, fase, último
     relatório, progresso e situação.
4. **Página do projeto (`/a/<slug>/<cliente>/<projeto>`).** SSG, com
   `dynamicParams = false`: qualquer outra combinação dá 404.
   - **Hero** com fundo no tom da marca do cliente. Traz:
     - o badge de ciclo de vida, "atualizado há N dias" e o primeiro relatório;
     - o nome, a fase e o subtítulo;
     - o progresso geral com "X de Y frentes concluídas".
   - **Indicadores:**
     - frentes concluídas;
     - pendências do cliente;
     - dias desde o último relatório;
     - avanço desde o relatório anterior, em tom neutro e com a variação de frentes
       (ex.: "−8 pp · +2 frentes"; "—" quando não há relatório anterior
       comparável).
   - **Coluna principal:** Frentes, Aguardando o cliente, Próximos passos e
     Histórico.
   - **Coluna lateral ("Projeto"):** cliente, fornecedor, plataforma, fase, primeiro
     e último relatório, nº de relatórios, ciclo de vida com motivo, contrato (se
     houver), pessoa de contato (se houver) e os canais exibidos na página do
     cliente (WhatsApp/e-mail da ITGraph).
   - As duas colunas só aparecem em tela larga; abaixo disso, empilham.
   - Projeto sem relatório tem página com estado vazio. Projeto concluído ou
     encerrado não mostra pendências nem próximos passos.
5. **Lógica pura nova em `src/lib/admin.ts`, com TDD:**
   - estatísticas do portfólio;
   - lista de atenção;
   - resumo do projeto;
   - params estáticos;
   - link da página do cliente;
   - formatação do avanço.

**Fora:**
- a migração das páginas de cliente para shadcn (próximo PR, com prévia);
- campos novos no schema (time, orçamento, prazo, tarefas, arquivos);
- tabs sem conteúdo próprio;
- o módulo financeiro;
- qualquer escrita;
- tema escuro.

## Critérios de aceitação (testáveis)

Vitest (`src/lib/admin.test.ts`):

- **Estatísticas do portfólio:** **DADO** linhas de projeto com estados e
  pendências variados **QUANDO** calculo as estatísticas **ENTÃO** recebo a
  contagem de em andamento, o total de pendências, o nº de projetos com pendência,
  os parados e os em espera. Concluídos e encerrados não contam.
- **Ordem da atenção:** **DADO** um projeto parado, um com 3 pendências, um com 1
  pendência e um em espera **QUANDO** monto a lista **ENTÃO** a ordem é parado → 3
  pendências → 1 pendência → em espera.
- **Em espera com pendência:** **DADO** um projeto em espera que tem pendência
  **QUANDO** monto a lista **ENTÃO** ele entra no grupo de pendências, com "em
  espera" como motivo secundário.
- **Fora da atenção:** **DADO** projetos concluídos, encerrados ou em andamento sem
  motivo **QUANDO** monto a lista **ENTÃO** eles não entram.
- **Sem relatório:** **DADO** um projeto em andamento sem relatório **QUANDO** monto
  a lista **ENTÃO** ele entra com o motivo "sem relatório".
- **Avanço:** **DADO** relatórios com 71% (mais novo) e 65% (anterior) **QUANDO**
  resumo o projeto **ENTÃO**:
  - o avanço é +6 e a variação de frentes é a diferença de contagem;
  - o primeiro relatório é o mais antigo;
  - as frentes concluídas são as `done`.
- **Sem base de comparação:** **DADO** um relatório único, ou um dos dois
  relatórios sem frentes, **QUANDO** resumo **ENTÃO** o avanço é `null`. **DADO** nenhum relatório
  **ENTÃO** o resumo é `null`.
- **Params estáticos:** **DADO** os clientes **QUANDO** gero os params **ENTÃO** sai
  um trio slug/cliente/projeto por projeto, inclusive os sem relatório; sem slug
  admin, nenhum.
- **Link da página do cliente:** **DADO** um projeto arquivado **QUANDO** gero o
  link **ENTÃO** ele aponta para `/r/<slug>/anteriores#<id>`; o ativo, para
  `/r/<slug>#<id>`; sem relatório, sem hash.

Manual (build + servidor local):

- **Rotas:**
  - `/a/<slug>` e os 8 `/a/<slug>/<cliente>/<projeto>` renderizam;
  - dão 404: `/a/<slug>/x/y`, par trocado, `/a/<outro>` e `/r/<inexistente>`.
- **Isolamento:**
  - o CSS carregado por `/`, `/r/*`, `/anteriores` e `/_not-found` é idêntico ao de
    antes da mudança;
  - nenhuma página fora de `/a` carrega Tailwind;
  - as capturas das páginas de cliente batem.
- **Admin (1440, 1024 e 390):**
  - sem estouro ou sobreposição;
  - item ativo certo;
  - Sheet abrindo no celular;
  - foco visível;
  - noindex (meta e header) e o título "Painel interno".

## Impacto nas invariantes

- **Lista de clientes:** continua só em `/a/` (§15). As sub-rotas ficam sob o mesmo
  slug admin.
- **Rotas:** `dynamicParams = false` em todas as rotas novas. O noindex está nas 3
  camadas: metadata, `robots.ts` e o header em `/:path*`.
- **Páginas de cliente:** sem mudança visual (o isolamento é verificado). As ilhas
  client continuam três; os primitivos do shadcn só existem no admin.
- **Estados:** continuam `done/prog/plan`. Datas via `format.ts`.
- **Dependências:** as novas (Tailwind, shadcn e as que ele traz) foram aprovadas
  pelo dono em 21-10. As versões ficam fixadas.

## Notas

- **Referência:** anexada em 2026-10-21. Mapeamento:
  - Team → canais/contato no bloco Projeto;
  - Tasks → Aguardando o cliente + Próximos passos;
  - Activity → Histórico;
  - Budget e Files ficam de fora (sem dado; o financeiro terá rota própria).
- **Decisões do dono (21-10):**
  - desktop primeiro;
  - a visão geral começa pelo que precisa de ação;
  - dado real, sem campos novos;
  - shadcn no projeto todo, com o cliente depois;
  - tema padrão do shadcn + Inter;
  - "Página do cliente" só na barra superior;
  - duas colunas só em tela larga.
