import { z } from "zod";
import { STATUS_STATES } from "./status";

// Contrato de dados entre a skill (que gera os JSON) e o app (que renderiza).
// Tudo é validado com Zod no carregamento (lib/content.ts), com parse
// defensivo — um snapshot inválido é pulado, nunca derruba o build.

export const statusStateSchema = z.enum(STATUS_STATES);

// ---- Config estável do cliente (content/clients/<id>.json) ----

export const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  platform: z.string().optional(),
});

export const clientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  contact: z.string().optional(),
  slug: z.string().min(1),
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "brandColor deve ser hex #RRGGBB"),
  vendor: z.string().default("MOOV Consultoria"),
  projects: z.array(projectSchema).min(1),
});

// ---- Snapshot temporal (content/snapshots/<client>/<project>/<data>.json) ----

export const progressItemSchema = z.object({
  label: z.string().min(1),
  percent: z.number().min(0).max(100),
  state: statusStateSchema,
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

export const snapshotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date deve ser YYYY-MM-DD"),
  phase: z.string().optional(),
  title: titleSchema,
  subtitle: z.string().optional(),
  progress: z.array(progressItemSchema),
  nextSteps: nextStepsSchema.optional(),
  sections: z.array(sectionSchema),
});

export type StatusState = z.infer<typeof statusStateSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Client = z.infer<typeof clientSchema>;
export type ProgressItem = z.infer<typeof progressItemSchema>;
export type NextStepItem = z.infer<typeof nextStepItemSchema>;
export type NextSteps = z.infer<typeof nextStepsSchema>;
export type StatusCard = z.infer<typeof cardSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Snapshot = z.infer<typeof snapshotSchema>;
