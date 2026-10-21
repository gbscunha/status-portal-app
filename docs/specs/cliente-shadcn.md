# Spec: Páginas de cliente no sistema do admin (shadcn/ui, etapa 2)

- **Status:** aprovada
- **Data:** 2026-10-21

## Problema / motivação

O admin já roda em shadcn/ui (PR #8, DECISOES §19). As páginas de cliente
continuam na v2 em CSS puro, com Archivo. Isso mantém dois mundos no projeto:
dois CSS isolados por segmento, duas famílias tipográficas e duas regras de cor.
O dono decidiu levar o shadcn ao projeto todo, em duas etapas. Esta é a segunda.

Superfície: modo **Read**. O contato do cliente abre o link, que chega por
WhatsApp ou e-mail, muitas vezes no celular, e quer saber em que pé está o
projeto e o que depende dele.

## Decisões do dono (21-10, por pergunta interativa)

- **Identidade:** as páginas de cliente entram no sistema do `DESIGN.md`, como
  ele mesmo prevê. Ficam com Inter, sem rótulos em caixa-alta, com a marca só
  como marcador e as barras em grafite com ícone de estado. Sai a v2: trilho na
  cor da marca, losangos, kickers e destaque do título na cor da marca.
  Recusado: manter a v2 refeita em shadcn.
- **Navegação:** a sidebar como no admin, com os projetos do cliente. Recusado:
  abas no topo.
- **Troca de projeto:** pelo hash, um projeto por vez. Nenhuma URL muda e o PDF
  continua saindo com todos os projetos. Recusado: uma página por projeto, que
  reverteria o §14.
- **Projeto em espera com pendência do cliente** (hoje, a Prepona): o sinal é
  "aguardando você", na mesma ordem do admin (`admin.ts:223-224`). Recusado: o
  "em espera" vencer.

## Escopo

**Dentro:**

1. **Um mundo só de CSS.**
   - O layout raiz passa a importar `tailwind.css` e a carregar a Inter
     (`next/font`, variável no `<html>`).
   - Saem: `globals.css`, `r/layout.tsx`, a Archivo, o import da v2 em
     `page.tsx` e o `<style>` de fonte do `a/layout.tsx`.
   - O admin não deve mudar visualmente.
2. **Moldura do cliente (`ClientShell`).** Reaproveita o vocabulário do
   `AdminShell`.
   - **Sidebar recolhível em faixa de ícones, com tooltip.**
     - No topo: o cliente (tile monocromático com a inicial) e
       "{fornecedor} · Portal de acompanhamento".
     - Grupo "Projetos": os projetos em curso, primeiro os em andamento, depois
       os em espera.
     - Grupo "Projetos anteriores": os concluídos e encerrados, quando houver.
       Se nenhum deles tiver relatório, o grupo vira só um link para
       `/anteriores`.
     - Ícone de estado por forma: em andamento, aguardando você, em espera,
       concluído, encerrado.
     - No celular (<768px) a sidebar vira gaveta, que fecha ao escolher um
       projeto.
   - **Barra superior.** Contém:
     - o gatilho da sidebar;
     - a trilha "Cliente › Projeto";
     - à direita, "Salvar PDF", "WhatsApp" e "E-mail", preenchidos, como o dono
       pediu na v2. No celular eles viram ícones preenchidos com nome para
       leitor de tela.
3. **Troca de projeto por hash.**
   - Cada item da sidebar é um link `#<id>`. Uma ilha client lê o hash e decide
     o item ativo, a trilha e o painel visível.
   - Hash desconhecido ou vazio mostra o primeiro projeto.
   - Ao trocar de projeto, a página volta ao topo e o foco vai para o título do
     projeto.
   - Os links entre `/r/<slug>` e `/anteriores` são navegação normal.
4. **Relatório de cada projeto.**
   - É o mesmo conteúdo de hoje, recomposto em Card, Badge, Progress e Empty:
     - cabeçalho tingido pela marca: título do relatório, ciclo de vida, fase,
       plataforma, data, subtítulo e progresso geral com as entregas;
     - aviso de ciclo de vida;
     - "Aguardando você";
     - progresso por área, com legenda e previsão;
     - "O que está no projeto";
     - próximos passos;
     - seções numeradas, com as concluídas recolhidas;
     - linha do tempo, com "Você está aqui";
     - contato;
     - rodapé, com o link do contrato.
   - Nenhum texto novo voltado ao cliente sem aprovação do dono. O cabeçalho
     reaproveita os rótulos da faixa-resumo de hoje ("Fase atual",
     "Atualizado", "Plataforma", "Progresso geral", "Entregas concluídas"), e
     não o vocabulário do admin ("frentes").
5. **Projetos anteriores** (`/r/<slug>/anteriores`): a mesma moldura, com os
   relatórios dos projetos encerrados e concluídos. Sai o índice "Entregue em
   <mês>", porque a sidebar já agrupa os projetos e o badge e o aviso mostram o
   mês. Fica a frase de apresentação.
6. **Raiz e 404.** Ficam fora da moldura, porque não há cliente nem navegação.
   - A raiz institucional entra no sistema.
   - O 404 ganha um `app/not-found.tsx` com estado vazio. Sai o
     `r/[slug]/not-found.tsx`, que não roda em produção.
   - Título genérico e noindex nos dois.
7. **Impressão (PDF).**
   - Sai com todos os projetos da página e as seções concluídas abertas.
   - Ficam de fora a sidebar, a barra e o contato.
8. **Lógica pura nova, com TDD**:
   - a navegação do cliente (itens, grupos e links por página);
   - o sinal de estado do projeto para o cliente;
   - a escolha do painel ativo pelo hash.

**Fora:**

- campos novos no schema;
- textos novos ao cliente;
- uma página por projeto;
- visão geral do cliente;
- tema escuro;
- mudanças no admin, além da troca de onde a fonte e o CSS são carregados.

## Critérios de aceitação (testáveis)

Vitest:

- **Navegação, página principal:**
  - **DADO** um cliente com dois projetos em curso com relatório e um concluído
    **QUANDO** monto a navegação de `/r/<slug>` **ENTÃO** os em curso são links
    locais `#<id>`, primeiro o em andamento e depois o em espera;
  - o concluído fica no grupo "Projetos anteriores", com
    `/r/<slug>/anteriores#<id>`.
- **Navegação, anteriores:** **DADO** o mesmo cliente **QUANDO** monto a
  navegação de `/anteriores` **ENTÃO** os anteriores são links locais e os em
  curso apontam para `/r/<slug>#<id>`.
- **Só quem tem relatório:** **DADO** um projeto sem relatório **QUANDO** monto a
  navegação **ENTÃO** ele não entra, porque não há painel para ele.
- **Sem anteriores:** **DADO** um cliente sem projeto concluído ou encerrado
  **QUANDO** monto a navegação **ENTÃO** não há o grupo "Projetos anteriores".
- **Anteriores sem relatório:** **DADO** um cliente com projeto concluído que não
  tem relatório **QUANDO** monto a navegação **ENTÃO** o grupo existe, sem itens,
  com o link para `/r/<slug>/anteriores`.
- **Sinal ao cliente:** **DADO** projetos em andamento (com e sem pendência), em
  espera (com e sem pendência), concluído e encerrado **QUANDO** calculo o sinal
  **ENTÃO** saem, na ordem:
  - em andamento;
  - aguardando você;
  - aguardando você (em espera com pendência);
  - em espera;
  - concluído;
  - encerrado.

  "Parado" e "sem relatório", que são sinais internos do admin, nunca saem.
- **Painel ativo:** **DADO** os ids dos painéis **QUANDO** o hash é um deles
  **ENTÃO** ele é o ativo. Hash vazio ou desconhecido ativa o primeiro.

Manual (build + servidor local):

- **Rotas:**
  - `/r/<slug>` dos 4 clientes, `/r/<movi>/anteriores` e `/` respondem 200;
  - `/r/<inexistente>` e `/r/<sem-anteriores>/anteriores` dão 404, com a página
    nova;
  - noindex em meta e header, título "Status do Projeto" e nenhum OpenGraph;
  - o admin continua com 200 e 404 como antes.
- **Hash:**
  - `/r/<fgv>#prepona` abre a Prepona, com o item ativo e a trilha certa;
  - clicar outro projeto troca o painel, e o voltar do navegador desfaz a troca;
  - no celular, a gaveta fecha ao escolher.
- **Impressão** (mídia `print`):
  - todos os projetos aparecem, com as seções concluídas abertas;
  - sidebar, barra e contato ficam ocultos.
- **Visual:**
  - em 1440, 1024 e 390: FGV (3 projetos, pendência, em espera), Movi (com
    anteriores), Neon e Ellementi (um projeto, sem aba), `/anteriores`, raiz e
    404;
  - sem estouro e com foco visível.
- **Admin:** as capturas de antes e depois em 1440 e 390 batem.
- **Limpeza:** nenhum arquivo importa `globals.css`, nenhuma classe da v2
  sobra, e a Archivo sai do projeto.

## Impacto nas invariantes

- **Rotas:** `dynamicParams = false` intacto em `r/[slug]`, `anteriores` e no
  admin. Nenhuma rota nova de cliente.
- **Noindex e OG:** noindex nas 3 camadas; a raiz e o 404 novos levam metadata
  genérica. Sem OpenGraph rico.
- **Listagem de clientes:** nenhuma rota de cliente lista clientes. A sidebar
  mostra só os projetos do próprio cliente.
- **Estados e datas:** só `done/prog/plan`, com os tokens do `tailwind.css`.
  Datas via `format.ts`.
- **Ilhas client:** mudam. O `ProjectSwitcher` continua dono do hash, e entram
  duas ilhas mínimas que leem o mesmo hash: o item da sidebar e a trilha. O
  motivo vai no DECISOES.
- **Dependências:** nenhuma nova. Tudo vem do shadcn já instalado e do lucide.

## Notas

- **`DESIGN.md`:** a "Shell Rule" passa a valer também para o cliente. Estas
  exceções vão para o DESIGN.md no fim (documentador da impeccable):
  - os botões preenchidos: três na barra e dois no contato (gosto do dono,
    registrado desde a v2);
  - a raiz e o 404 fora da moldura;
  - o corpo de leitura um pouco maior (modo Read).
- **Impressão:** o Safari anterior à 18.4 e o Firefox anterior à 143 imprimem as
  seções concluídas fechadas (`::details-content`). No Chrome elas saem abertas.
- **Sorteio da impeccable (`concept-seed`):** não roda. O sistema é fixado pelo
  `DESIGN.md` e a composição pelo dono (moldura do admin), como no admin.
- **Rascunhos não commitados na `main`:** os relatórios de 21-10 de FGV/CT e
  Neon/VERA ERP são conteúdo do dono e não entram nesta branch.
