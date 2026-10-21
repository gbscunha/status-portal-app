# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Clientes da ITGraph e das empresas parceiras** (hoje Movi, FGV, Ellementi e
  Neon): o contato do cliente abre uma URL secreta, sem login, para ver como
  andam os projetos dele e o que está esperando uma ação dele. Lê em linguagem
  de benefício, sem jargão técnico.
- **O dono (Gabriel, ITGraph)**: usa o painel interno `/a/<slug>` como cockpit,
  para ver todos os clientes e projetos de uma vez, achar o que está parado ou
  pendente e abrir a página de cada cliente.

## Product Purpose

Substituir o HTML de status feito à mão por um portal onde cada cliente acompanha
o andamento dos projetos dele, e o dono acompanha todos. Sucesso: o cliente sabe
em que pé está e o que depende dele sem precisar perguntar; o dono vê em segundos
o que precisa de atenção.

## Positioning

O cliente acompanha o software sob medida como acompanha uma encomenda
("rastreio de entrega"). Cada status é um relatório datado e imutável, revisado
por uma pessoa antes de publicar, e o histórico fica no git.

## Operating Context

- Os relatórios nascem da skill `atualizar-status-portal`, rodada no repo de cada
  cliente. O dono revisa o preview e publica com `git push`, e a Vercel redeploya.
- O link chega ao cliente por WhatsApp ou e-mail. O cliente pode salvar a página
  em PDF.
- O acesso é baixo: cerca de duas visitas por semana por cliente (DECISOES §16).
- Projetos internos (Estética App, site novo da ITGraph) ficam fora do portal.
- Além da ITGraph, aparecem como fornecedor (`vendor`) as empresas parceiras do
  dono: VERA ERP (com o Lpncc) e Studio Seven (com o Kim).

## Capabilities and Constraints

- Site 100% estático, sem backend, banco, CMS nem login (DECISOES §16). O conteúdo
  é JSON em `content/`, validado com Zod; arquivo inválido é pulado com aviso.
- Privacidade por construção: slug não adivinhável, `noindex` em 3 camadas, slug
  desconhecido dá 404, sem OpenGraph rico. Nenhuma rota de cliente lista outros
  clientes; a única exceção é o painel interno `/a/`.
- Estados de status: só `done`, `prog` e `plan`. Ciclo de vida do projeto:
  em andamento, em espera, concluído, encerrado.
- Datas em America/Sao_Paulo; a previsão (`eta`) é por mês, nunca por dia.
- Em aberto: módulo financeiro (faturamento, saldo a receber, divisão de caixa),
  com rota própria prevista e fora da escrituração.

## Brand Commitments

- Nome da empresa: ITGraph.
- Cada cliente tem a própria cor de marca, aplicada na página dele.
- Família tipográfica única, Archivo (DECISOES §14).
- Voz: pt-BR, foco em benefício, zero jargão nas páginas de cliente. Linguagem
  direta é aceita no painel interno.

## Evidence on Hand

- Relatórios reais em `content/snapshots/` (8 projetos, de julho a outubro de
  2026) e configs em `content/clients/`.
- Não existem e não devem ser inventados: dados de time, orçamento, tarefas,
  arquivos, depoimentos ou métricas de uso.

## Product Principles

- Conteúdo é dado, e uma pessoa revisa antes de publicar.
- O histórico nunca se perde: status novo é arquivo novo.
- Privacidade antes de conveniência.
- O cliente vê benefício, não implementação.

## Accessibility & Inclusion

Segue as Web Interface Guidelines (spec `ui-ux-hardening`): foco visível, landmarks
e headings corretos, barras de progresso acessíveis e contraste AA nos pills.
