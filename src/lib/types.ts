import { z } from "zod";
import { STATUS_STATES } from "./status";

// Contrato de dados entre a skill (que gera os JSON) e o app (que renderiza).
// Tudo é validado com Zod no carregamento (lib/content.ts), com parse
// defensivo — um snapshot inválido é pulado, nunca derruba o build.

export const statusStateSchema = z.enum(STATUS_STATES);

// Data ISO que existe de verdade no calendário. Só o regex aceita "2026-02-30"
// e "2026-13-45", que passariam pelo parse defensivo e chegariam à tela do
// cliente como lixo ("45  2026"). Validar na fronteira sai mais barato do que
// tratar no meio: quem consome já pode confiar nas partes da string.
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "deve ser YYYY-MM-DD")
  .refine((s) => {
    const [y, m, d] = s.split("-").map(Number);
    const utc = new Date(Date.UTC(y, m - 1, d));
    return (
      utc.getUTCFullYear() === y &&
      utc.getUTCMonth() === m - 1 &&
      utc.getUTCDate() === d
    );
  }, "data inexistente no calendário");

// ---- Config estável do cliente (content/clients/<id>.json) ----

// O escopo é o denominador do progresso: sem ele, "78%" não diz de quê. Vive na
// config ESTÁVEL (não no snapshot) porque é a linha de base acordada. O que
// muda com o tempo entra em addedAt/removedAt — item removido é MARCADO, nunca
// apagado, porque a mudança de escopo é a conversa que sustenta o prazo.
export const scopeItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  desc: z.string().min(1),
  group: z.string().optional(),
  addedAt: isoDateSchema.optional(),
  removedAt: isoDateSchema.optional(),
});

export const scopeSchema = z
  .object({
    baseline: isoDateSchema,
    items: z.array(scopeItemSchema),
  })
  .refine(
    (s) => new Set(s.items.map((i) => i.id)).size === s.items.length,
    "ids do escopo devem ser únicos (são a chave do vínculo com os snapshots)",
  );

export const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  platform: z.string().optional(),
  scope: scopeSchema.optional(),
});

export const clientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  contact: z.string().optional(),
  slug: z.string().min(1),
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "brandColor deve ser hex #RRGGBB"),
  vendor: z.string().default("ITGraph"),
  // Contact channels shown to the client (ITGraph's own, never the client's).
  whatsapp: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, "whatsapp deve ser E.164 (+5511999999999)")
    .optional(),
  email: z.string().email().optional(),
  projects: z.array(projectSchema).min(1),
});

// ---- Painel admin (content/admin.json) ----

// O slug secreto do cockpit do dono (/a/<slug>). Mesma segurança das páginas
// de cliente; se vazar, gerar outro com scripts/gen-slug.mjs e trocar aqui.
export const adminSchema = z.object({
  slug: z.string().min(1),
});

// ---- Snapshot temporal (content/snapshots/<client>/<project>/<data>.json) ----

export const progressItemSchema = z.object({
  label: z.string().min(1),
  percent: z.number().min(0).max(100),
  state: statusStateSchema,
  // Vínculo opcional com um item do escopo do projeto. Ausente = o item é
  // texto livre, como antes; presente = o mapa do escopo herda este estado.
  scopeId: z.string().min(1).optional(),
});

export const nextStepItemSchema = z.object({
  label: z.string().min(1),
  desc: z.string().min(1),
});

export const nextStepsSchema = z.object({
  title: z.string().min(1),
  intro: z.string().optional(),
  items: z.array(nextStepItemSchema),
});

export const cardSchema = z.object({
  title: z.string().min(1),
  status: statusStateSchema,
  description: z.string().min(1),
  fullWidth: z.boolean().default(false),
});

export const sectionSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  cards: z.array(cardSchema),
});

export const titleSchema = z.object({
  text: z.string().min(1),
  highlight: z.string().optional(),
});

// Item que depende de ação do CLIENTE (bloco "Aguardando você").
export const pendingItemSchema = z.object({
  label: z.string().min(1),
  desc: z.string().min(1),
  since: isoDateSchema.optional(),
});

export const snapshotSchema = z.object({
  date: isoDateSchema,
  phase: z.string().optional(),
  title: titleSchema,
  subtitle: z.string().optional(),
  // Frase curta do que aconteceu neste checkpoint — vira o texto da entrada
  // na linha do tempo (fallback: subtitle → title.text).
  milestone: z.string().optional(),
  progress: z.array(progressItemSchema),
  nextSteps: nextStepsSchema.optional(),
  pending: z.array(pendingItemSchema).optional(),
  sections: z.array(sectionSchema),
});

export type { StatusState } from "./status";
export type ScopeItem = z.infer<typeof scopeItemSchema>;
export type Scope = z.infer<typeof scopeSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Client = z.infer<typeof clientSchema>;
export type ProgressItem = z.infer<typeof progressItemSchema>;
export type NextStepItem = z.infer<typeof nextStepItemSchema>;
export type NextSteps = z.infer<typeof nextStepsSchema>;
export type PendingItem = z.infer<typeof pendingItemSchema>;
export type StatusCard = z.infer<typeof cardSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Snapshot = z.infer<typeof snapshotSchema>;
