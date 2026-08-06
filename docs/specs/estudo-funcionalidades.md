# Estudo: funcionalidades candidatas do Portal

> Este arquivo **não é uma spec** — é um estudo exploratório que alimenta o
> backlog. Cada item que virar trabalho de verdade ganha sua própria spec a
> partir do `FEATURE-template.md`.

- **Status:** rascunho (nenhum item aprovado)
- **Data:** 2026-08-06

## Contexto

Levantamento de funcionalidades que o portal poderia ter para atender melhor
(a) os clientes da ITGraph e (b) a operação da própria ITGraph. Base do estudo:
o schema em `src/lib/types.ts`, os loaders em `src/lib/content.ts`, a árvore de
componentes, o painel admin, `docs/DECISOES.md` e o backlog vivo do CHECKLIST.

Cada item está marcado com o custo arquitetural:

- **SSG** — cabe no modelo atual (conteúdo em JSON + build estático, sem
  backend). Não fere nenhuma invariante.
- **sai do SSG** — exige Function/KV/serviço externo. É o território do "v3"
  já registrado em `DECISOES.md` §"Decisões adiadas".

Itens já presentes no CHECKLIST/DECISOES estão sinalizados — aparecem aqui
para dar visão completa, não como descoberta nova.

---

## A. Para o cliente — aumentam a percepção de valor

### A1. Navegação no histórico — SSG

A `Timeline` mostra os checkpoints mas não leva a lugar nenhum. Tornar cada
data clicável (rota estática por snapshot) deixa o cliente reler o relatório de
três semanas atrás. Prova de evolução, não só promessa.
_Já no backlog do CHECKLIST ("Navegação para snapshots antigos")._

### A2. "O que mudou desde o último relatório" — SSG

Bloco gerado automaticamente no build comparando o snapshot atual com o
anterior: barras que subiram (60% → 85%), cards que viraram `done`, itens
novos. Zero trabalho de escrita — os dados para o diff já existem, imutáveis,
um arquivo por data.

### A3. Previsão de entrega (ETA) por frente — SSG

Campo opcional `eta` no snapshot ("previsão: setembro/2026") ao lado do
percentual. Hoje o portal responde _quanto já andou_, mas não _quando termina_
— que é a pergunta nº 1 de qualquer cliente.

### A4. Evidências visuais (prints / vídeo curto) — SSG

Imagem opcional por card ou por seção. Para o cliente não-técnico da FGV ou da
Movi, ver a tela pronta vale mais que três parágrafos descrevendo-a.

### A5. Pendências acionáveis — SSG

O bloco "Aguardando você" hoje é passivo. Cada item ganhar um botão de WhatsApp
pré-preenchido ("Sobre: Aprovar os ajustes do painel de vagas") transforma
cobrança em conversa e encurta o tempo de desbloqueio.

### A6. Salvar em PDF — SSG

Botão explícito de exportação (o print CSS já existe). O cliente quase sempre
precisa encaminhar o status para o chefe dele; hoje ele manda print de celular.
_Registrado como "fora do v2" em `DECISOES.md`._

### A7. Links úteis e ambientes — SSG

Bloco por projeto com acesso à homologação, app na loja, credenciais de teste,
manual. Elimina o "me manda de novo aquele link" no WhatsApp.

### A8. Registro de decisões e mudanças de escopo — SSG

Mini-changelog visível ao cliente: "em 12/07 decidimos priorizar X, o que
empurrou Y". É o documento que protege a ITGraph quando alguém pergunta por que
o prazo mudou.

### A9. Visão de carteira do cliente — SSG

Para clientes com 3+ projetos (Movi, FGV), um cabeçalho antes das abas com o
percentual e a saúde de cada projeto lado a lado. Hoje só dá para comparar
trocando de aba.

### A10. Aprovação com um clique — sai do SSG

Cliente clica "Aprovado" numa pendência e fica registrado com data. Vira prova
de aceite formal — hoje o aceite mora num áudio de WhatsApp.
_Já listado como v3 em `DECISOES.md`._

---

## B. Para a ITGraph — operação

### B1. Analytics de leitura — sai do SSG (leve)

Saber _se_ e _quando_ cada cliente abriu o relatório. É o dado mais valioso da
lista: "a FGV não abre o portal há 3 semanas" é um sinal comercial antes de
virar problema.
_Já no backlog do CHECKLIST ("Analytics")._

### B2. Alerta proativo de projeto parado — sai do SSG

Hoje o alerta "parado há N dias" só existe se o dono abrir o painel admin — e a
referência congela na data do último deploy. Um disparo automático
(e-mail/WhatsApp) inverte isso: o portal procura o dono.

### B3. Rebuild diário agendado — SSG

Cron da Vercel + Deploy Hook. Sem ele, todo cálculo de "há N dias" mente. É
pré-requisito barato do B2.
_Já no backlog do CHECKLIST, com a config descrita._

### B4. Aviso automático ao cliente quando o status é publicado — sai do SSG

Hoje o dono publica e depois avisa manualmente no WhatsApp — ou esquece. O
relatório mais bem escrito do mundo não vale nada se ninguém sabe que ele saiu.
_Já listado como v3 em `DECISOES.md`._

### B5. Painel admin com métricas de ritmo — SSG

Evoluir o `AdminDashboard`: velocidade (Δ% por semana por projeto), pendência
mais antiga em aberto, ranking de risco. Hoje ele mostra **estado**; falta
mostrar **tendência**. Os snapshots datados já têm todo o dado necessário.

### B6. Rascunho de snapshot automático a partir do repo — SSG

GitHub Action no repo do cliente que, a cada release, abre um PR no portal com
o snapshot pré-preenchido pelos commits. O humano só revisa a linguagem em vez
de escrever do zero — sem violar "a skill nunca commita/pusha", porque o
artefato é um PR aguardando revisão.
_Já listado como v3 em `DECISOES.md`._

### B7. Scaffolding de cliente e projeto — SSG

`pnpm new:client` / `pnpm new:snapshot`. Hoje só existe o `gen-slug.mjs` e o
resto é montar JSON à mão. Com 4 clientes já dá atrito; com 10 vira erro.

### B8. Preview local renderizado antes de commitar — SSG

A skill mostra preview em texto. Ver a página real
(`pnpm preview movi/movi-web`) antes do push evita publicar com um card
quebrado ou texto cortado.

---

## C. Comercial e relacionamento

### C1. Whitelabel por cliente — SSG

Hoje o cliente traz só a `brandColor`. Aceitar logo e um breve manifesto
próprio faz o portal parecer _dele_, não um template — e é o tipo de detalhe
que sustenta o preço.

### C2. Contratado × entregue — SSG

Bloco ligando o escopo acordado ao que já foi entregue. Deixa visível quando o
cliente pediu além do combinado — a conversa mais difícil da consultoria,
resolvida com um link.

### C3. Marcos financeiros vinculados a entregas — SSG (visível) / sai do SSG (com cobrança)

"Marco 2 — entregue em 04/08" ao lado da fase correspondente. Faturar fica
factual em vez de negociado.

### C4. Relatório mensal consolidado — SSG

Página (ou PDF) que agrega os snapshots do mês por cliente: o que entrou, o que
avançou, o que travou. É o documento que se manda para a diretoria da FGV — e
um artefato de venda por si só.

---

## D. Confiabilidade (invisível ao cliente, essencial para o dono)

### D1. Validação de conteúdo em CI — SSG

O parse defensivo em `content.ts` protege o build — mas **silenciosamente**: um
snapshot com JSON inválido some da página sem ninguém notar. Um check no PR
(Zod + `pnpm build`) faz falhar barulhento onde falhar é barato.
_Ver também o item 1 de `estudo-qualidade-codigo.md`._

### D2. Testes de rota e componente — SSG

As "Dívidas arquiteturais conhecidas" do CHECKLIST já registram a ausência. Um
punhado de testes das invariantes (slug inexistente → 404, raiz não vaza
cliente, `noindex` presente) blinda exatamente o que, se quebrar, vaza cliente.

### D3. Rotação de slug sem quebrar o link — SSG

Suportar slugs antigos como redirect por um período, em vez de 404 seco. Hoje
trocar um slug comprometido (o procedimento de mitigação do `DECISOES.md` §15)
custa "o cliente perdeu o acesso e não sabe por quê".

---

## Recomendação — os 5 primeiros

1. **B1 (analytics de leitura)** e **B4 (aviso ao publicar)** — medem e
   garantem que o portal _é lido_; sem isso, todo o resto é esforço no vazio.
2. **A2 (o que mudou)** e **A3 (ETA)** — máximo valor percebido por unidade de
   código, ambos dentro do SSG puro.
3. **D1 (validação em CI)** — o único item cuja ausência pode fazer um cliente
   ver uma página errada sem que ninguém saiba.

## Invariantes a preservar em qualquer um destes itens

Nenhum item deste estudo pode custar:

- `dynamicParams = false` em `/r/[slug]` (e Cache Components continua
  desabilitado);
- `noindex` nas 3 camadas (metadata, `robots.ts`, `X-Robots-Tag`);
- ausência de OpenGraph rico em `/r/[slug]`;
- nenhuma rota **de cliente** listando clientes ou slugs (a exceção única
  continua sendo `/a/`, `DECISOES.md` §15);
- snapshot imutável — status novo é arquivo novo, nunca sobrescrita.

Os itens marcados "sai do SSG" (A10, B1, B2, B4) mudam o modelo de deploy e
exigem decisão registrada em `DECISOES.md` antes de virar spec.
