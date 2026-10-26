import fs from "node:fs";
import path from "node:path";
import { clientSlugs, isOnline } from "./lifecycle";
import { timelineEntries, type TimelineEntry } from "./summary";
import {
  adminSchema,
  clientSchema,
  snapshotSchema,
  type Client,
  type Project,
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

// ---- Painel admin ----

// Slug secreto do cockpit (/a/<slug>). Sem arquivo ou inválido → null e o
// build segue sem a rota (parse defensivo, como todo o conteúdo).
export function getAdminSlug(): string | null {
  const file = path.join(CONTENT_DIR, "admin.json");
  if (!fs.existsSync(file)) return null;
  try {
    const parsed = adminSchema.safeParse(
      JSON.parse(fs.readFileSync(file, "utf-8")),
    );
    if (!parsed.success) {
      console.warn("[content] admin.json inválido, ignorando:", parsed.error.issues);
      return null;
    }
    return parsed.data.slug;
  } catch (err) {
    console.warn("[content] admin.json ilegível, ignorando:", err);
    return null;
  }
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

// Slugs and lookup for the client pages (/r): an offline client is left out,
// so its routes are a 404. The admin filters it out in src/lib/admin.ts (§22).
export function getAllSlugs(): string[] {
  return clientSlugs(getAllClients());
}

export function getClientBySlug(slug: string): Client | null {
  return (
    getAllClients().find((c) => c.slug === slug && isOnline(c)) ?? null
  );
}

// ---- Snapshots ----

// Chave cronológica do nome do arquivo (YYYY-MM-DD[-N].json). Comparação
// lexicográfica pura falha no mesmo dia — "2026-07-24.json" venceria
// "2026-07-24-2.json" porque "." > "-" — então data e sequência são
// comparadas em separado, a sequência como número (senão "-10" < "-2").
// Arquivo sem sufixo conta como sequência 1.
export function compareSnapshotFiles(a: string, b: string): number {
  const parse = (f: string): [string, number] => {
    const m = /^(\d{4}-\d{2}-\d{2})(?:-(\d+))?\.json$/.exec(f);
    return m ? [m[1]!, m[2] ? Number(m[2]) : 1] : [f, 0];
  };
  const [dateA, seqA] = parse(a);
  const [dateB, seqB] = parse(b);
  return dateA === dateB ? seqA - seqB : dateA < dateB ? -1 : 1;
}

// Do mais recente para o mais antigo, com NO MÁXIMO UM arquivo por dia (o de
// maior sequência vence). A UI assume data única por snapshot (key e "Você
// está aqui" da Timeline) — a convenção é um snapshot por dia, e este filtro
// mantém o invariante mesmo se um sufixo -N legado aparecer.
export function latestSnapshotFilesPerDay(files: string[]): string[] {
  const seen = new Set<string>();
  return [...files]
    .sort((a, b) => compareSnapshotFiles(b, a))
    .filter((f) => {
      const date = /^\d{4}-\d{2}-\d{2}/.exec(f)?.[0] ?? f;
      if (seen.has(date)) return false;
      seen.add(date);
      return true;
    });
}

// Todos os snapshots de um projeto, do mais recente para o mais antigo.
export function getProjectSnapshots(
  clientId: string,
  projectId: string,
): Snapshot[] {
  const dir = path.join(SNAPSHOTS_DIR, clientId, projectId);

  const byFile = new Map<string, Snapshot>();
  for (const { file, data } of readJsonFiles(dir)) {
    const parsed = snapshotSchema.safeParse(data);
    if (!parsed.success) {
      console.warn(
        `[content] snapshot inválido, pulando ${clientId}/${projectId}/${file}:`,
        parsed.error.issues,
      );
      continue;
    }
    byFile.set(file, parsed.data);
  }

  return latestSnapshotFilesPerDay([...byFile.keys()]).map(
    (file) => byFile.get(file)!,
  );
}

export function getLatestSnapshot(
  clientId: string,
  projectId: string,
): Snapshot | null {
  return getProjectSnapshots(clientId, projectId)[0] ?? null;
}

export type ProjectReport = {
  project: Project;
  snapshot: Snapshot;
  history: TimelineEntry[];
};

// Latest snapshot + history of each project, in the order given. Projects
// never published are left out: they have no report to show yet.
export function getProjectReports(
  clientId: string,
  projects: Project[],
): ProjectReport[] {
  return projects.flatMap((project) => {
    const snapshots = getProjectSnapshots(clientId, project.id);
    const latest = snapshots[0];
    return latest
      ? [{ project, snapshot: latest, history: timelineEntries(snapshots) }]
      : [];
  });
}
