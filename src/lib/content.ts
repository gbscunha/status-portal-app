import fs from "node:fs";
import path from "node:path";
import {
  clientSchema,
  snapshotSchema,
  type Client,
  type Snapshot,
} from "./types";

// Carregadores de conteúdo. Rodam em build time (Node fs), gerando páginas
// estáticas. Parse defensivo: um arquivo inválido é PULADO com aviso, nunca
// derruba o build de todos os clientes.

const CONTENT_DIR = path.join(process.cwd(), "content");
const CLIENTS_DIR = path.join(CONTENT_DIR, "clients");
const SNAPSHOTS_DIR = path.join(CONTENT_DIR, "snapshots");

function readJsonFiles(dir: string): { file: string; data: unknown }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const full = path.join(dir, f);
      try {
        return { file: f, data: JSON.parse(fs.readFileSync(full, "utf-8")) };
      } catch (err) {
        console.warn(`[content] JSON inválido, pulando ${full}:`, err);
        return null;
      }
    })
    .filter((x): x is { file: string; data: unknown } => x !== null);
}

// ---- Clientes ----

let clientsCache: Client[] | null = null;

export function getAllClients(): Client[] {
  if (clientsCache) return clientsCache;

  const clients: Client[] = [];
  const seenSlugs = new Set<string>();

  for (const { file, data } of readJsonFiles(CLIENTS_DIR)) {
    const parsed = clientSchema.safeParse(data);
    if (!parsed.success) {
      console.warn(
        `[content] cliente inválido, pulando ${file}:`,
        parsed.error.issues,
      );
      continue;
    }
    if (seenSlugs.has(parsed.data.slug)) {
      console.warn(
        `[content] slug duplicado "${parsed.data.slug}" em ${file}, pulando.`,
      );
      continue;
    }
    seenSlugs.add(parsed.data.slug);
    clients.push(parsed.data);
  }

  clientsCache = clients;
  return clients;
}

export function getAllSlugs(): string[] {
  return getAllClients().map((c) => c.slug);
}

export function getClientBySlug(slug: string): Client | null {
  return getAllClients().find((c) => c.slug === slug) ?? null;
}

// ---- Snapshots ----

// Todos os snapshots de um projeto, do mais recente para o mais antigo.
// Ordena pelo nome do arquivo (ISO YYYY-MM-DD[-N].json), que é lexicográfica
// e cronologicamente ordenável; sufixo -N desempata no mesmo dia.
export function getProjectSnapshots(
  clientId: string,
  projectId: string,
): Snapshot[] {
  const dir = path.join(SNAPSHOTS_DIR, clientId, projectId);

  return readJsonFiles(dir)
    .map(({ file, data }) => {
      const parsed = snapshotSchema.safeParse(data);
      if (!parsed.success) {
        console.warn(
          `[content] snapshot inválido, pulando ${clientId}/${projectId}/${file}:`,
          parsed.error.issues,
        );
        return null;
      }
      return { file, snapshot: parsed.data };
    })
    .filter((x): x is { file: string; snapshot: Snapshot } => x !== null)
    .sort((a, b) => b.file.localeCompare(a.file))
    .map((x) => x.snapshot);
}

export function getLatestSnapshot(
  clientId: string,
  projectId: string,
): Snapshot | null {
  return getProjectSnapshots(clientId, projectId)[0] ?? null;
}
