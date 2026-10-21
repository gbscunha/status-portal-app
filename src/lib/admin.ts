import type { Client, Lifecycle, Project, Snapshot } from "./types";
import { daysBetween } from "./format";
import {
  endMonth,
  finishedReport,
  isArchived,
  lifecycleOf,
  orderedProjects,
} from "./lifecycle";
import { overallPercent, timelineEntries } from "./summary";

/** Days without a snapshot before an active project reads as "parado"
 *  (DECISOES §15). */
export const STALE_DAYS = 14;

export type AdminProjectRow = {
  id: string;
  name: string;
  lifecycle: Lifecycle;
  /** null = never published ("sem relatório"). */
  report: {
    date: string;
    phase?: string;
    percent: number;
    pendingCount: number;
    idleDays: number;
    stale: boolean;
  } | null;
};

// One project line of the owner's cockpit. Only an ACTIVE project can be
// stale: paused is idle by definition, delivered and closed are finished.
export function adminProjectRow(
  project: Project,
  latest: Snapshot | null,
  today: string,
): AdminProjectRow {
  const lifecycle = lifecycleOf(project);
  if (!latest) {
    return { id: project.id, name: project.name, lifecycle, report: null };
  }
  const idleDays = daysBetween(latest.date, today);
  return {
    id: project.id,
    name: project.name,
    lifecycle,
    report: {
      date: latest.date,
      phase: latest.phase,
      percent: overallPercent(latest),
      pendingCount: latest.pending?.length ?? 0,
      idleDays,
      stale: lifecycle.state === "active" && idleDays > STALE_DAYS,
    },
  };
}

// ---- Portfolio (overview + sidebar) ----

export type PortfolioRow = AdminProjectRow & {
  clientId: string;
  clientName: string;
  clientSlug: string;
  brandColor: string;
};

/** Every project of every client, in client order and each client's display
 *  order. The snapshot reader is injected so this stays pure. */
export function portfolioRows(
  clients: Client[],
  latestOf: (clientId: string, projectId: string) => Snapshot | null,
  today: string,
): PortfolioRow[] {
  return clients.flatMap((client) =>
    orderedProjects(client.projects).map((project) => ({
      ...adminProjectRow(project, latestOf(client.id, project.id), today),
      clientId: client.id,
      clientName: client.name,
      clientSlug: client.slug,
      brandColor: client.brandColor,
    })),
  );
}

export type ClientGroup = {
  clientId: string;
  clientName: string;
  clientSlug: string;
  brandColor: string;
  rows: PortfolioRow[];
};

export function groupByClient(rows: PortfolioRow[]): ClientGroup[] {
  const groups = new Map<string, ClientGroup>();
  for (const row of rows) {
    const group = groups.get(row.clientId) ?? {
      clientId: row.clientId,
      clientName: row.clientName,
      clientSlug: row.clientSlug,
      brandColor: row.brandColor,
      rows: [],
    };
    group.rows.push(row);
    groups.set(row.clientId, group);
  }
  return [...groups.values()];
}

// A finished project's pending list is history, not a live request.
const isFinished = (row: AdminProjectRow) => endMonth(row.lifecycle) !== null;
const livePending = (row: AdminProjectRow) =>
  isFinished(row) ? 0 : (row.report?.pendingCount ?? 0);

export type PortfolioStats = {
  active: number;
  pendingTotal: number;
  pendingProjects: number;
  stale: number;
  paused: number;
};

export function portfolioStats(rows: AdminProjectRow[]): PortfolioStats {
  return {
    active: rows.filter((r) => r.lifecycle.state === "active").length,
    pendingTotal: rows.reduce((sum, r) => sum + livePending(r), 0),
    pendingProjects: rows.filter((r) => livePending(r) > 0).length,
    stale: rows.filter((r) => r.report?.stale).length,
    paused: rows.filter((r) => r.lifecycle.state === "paused").length,
  };
}

// ---- "Precisa de atenção" ----

export type AttentionReason =
  | { kind: "none" }
  | { kind: "stale"; idleDays: number }
  | { kind: "pending"; count: number }
  | { kind: "paused"; reason: string };

/** Why a project asks for the owner's attention; [0] is the main reason. */
export function attentionReasons(row: AdminProjectRow): AttentionReason[] {
  if (isFinished(row)) return [];
  const reasons: AttentionReason[] = [];
  if (!row.report && row.lifecycle.state === "active") {
    reasons.push({ kind: "none" });
  }
  if (row.report?.stale) {
    reasons.push({ kind: "stale", idleDays: row.report.idleDays });
  }
  const pending = livePending(row);
  if (pending > 0) reasons.push({ kind: "pending", count: pending });
  if (row.lifecycle.state === "paused") {
    reasons.push({ kind: "paused", reason: row.lifecycle.reason });
  }
  return reasons;
}

const RANK: Record<AttentionReason["kind"], number> = {
  none: 0,
  stale: 0,
  pending: 1,
  paused: 2,
};

// Weight inside a rank: never published, then longer idle, then more pending
// items come first.
function weight(reason: AttentionReason): number {
  if (reason.kind === "none") return Number.POSITIVE_INFINITY;
  if (reason.kind === "stale") return reason.idleDays;
  if (reason.kind === "pending") return reason.count;
  return 0;
}

export type AttentionItem<T extends AdminProjectRow> = {
  row: T;
  reasons: AttentionReason[];
};

/** Projects needing action: stale or unpublished → more pending → fewer
 *  pending → paused. Ties keep the input order (Array.sort is stable). */
export function attentionList<T extends AdminProjectRow>(
  rows: T[],
): AttentionItem<T>[] {
  return rows
    .map((row) => ({ row, reasons: attentionReasons(row) }))
    .filter((item) => item.reasons.length > 0)
    .sort((a, b) => {
      const [ra, rb] = [a.reasons[0], b.reasons[0]];
      const [wa, wb] = [weight(ra), weight(rb)];
      return RANK[ra.kind] - RANK[rb.kind] || (wa === wb ? 0 : wa > wb ? -1 : 1);
    });
}

/** The pending item that has waited longest (oldest `since`), so the
 *  attention list shows the worst case. Undated items only win when none is
 *  dated; then the first one. ISO dates compare correctly as strings. */
export function oldestPending<T extends { label: string; since?: string }>(
  pending: T[],
): T | undefined {
  const dated = pending.filter((item) => item.since !== undefined);
  if (dated.length === 0) return pending[0];
  return dated.reduce((oldest, item) =>
    item.since! < oldest.since! ? item : oldest,
  );
}

export type RowSignal =
  | "active"
  | "pending"
  | "stale"
  | "none"
  | "paused"
  | "delivered"
  | "closed";

/** The sidebar dot: the most urgent state of the project. */
export function rowSignal(row: AdminProjectRow): RowSignal {
  if (row.lifecycle.state === "delivered" || row.lifecycle.state === "closed") {
    return row.lifecycle.state;
  }
  if (!row.report) return row.lifecycle.state === "paused" ? "paused" : "none";
  if (row.report.stale) return "stale";
  if (row.report.pendingCount > 0) return "pending";
  if (row.lifecycle.state === "paused") return "paused";
  return "active";
}

// ---- Project page ----

export type HistoryPoint = { date: string; percent: number; title: string };

export type ProjectSummary = {
  /** Latest snapshot; a finished project's goes through finishedReport. */
  latest: Snapshot;
  percent: number;
  fronts: { done: number; total: number };
  pendingCount: number;
  /** Change vs the previous report, in percentage points; null without a
   *  comparison (single report, or either report with no fronts). */
  delta: number | null;
  frontsDelta: number | null;
  previousDate: string | null;
  firstReport: string;
  lastReport: string;
  idleDays: number;
  /** Newest first. */
  history: HistoryPoint[];
};

/** Summary of a project from its snapshots (newest first); null when it was
 *  never published. */
export function projectSummary(
  project: Project,
  snapshots: Snapshot[],
  today: string,
): ProjectSummary | null {
  const [newest, previous] = snapshots;
  if (!newest) return null;
  const latest = isArchived(project) ? finishedReport(newest) : newest;
  const percent = overallPercent(latest);
  const comparable =
    previous !== undefined &&
    previous.progress.length > 0 &&
    latest.progress.length > 0;
  const history = timelineEntries(snapshots).map((entry, i) => ({
    date: entry.date,
    percent: overallPercent(snapshots[i]),
    title: entry.title,
  }));

  return {
    latest,
    percent,
    fronts: {
      done: latest.progress.filter((item) => item.state === "done").length,
      total: latest.progress.length,
    },
    pendingCount: latest.pending?.length ?? 0,
    delta: comparable ? percent - overallPercent(previous) : null,
    frontsDelta: comparable
      ? latest.progress.length - previous.progress.length
      : null,
    previousDate: comparable ? previous.date : null,
    firstReport: snapshots[snapshots.length - 1].date,
    lastReport: newest.date,
    idleDays: daysBetween(newest.date, today),
    history,
  };
}

// ---- Routes and links ----

export type AdminProjectParams = {
  slug: string;
  clientId: string;
  projectId: string;
};

/** Static params of /a/[slug]/[clientId]/[projectId]: one triple per project,
 *  published or not. No admin slug, no pages (every URL is a 404). */
export function adminProjectParams(
  adminSlug: string | null,
  clients: Client[],
): AdminProjectParams[] {
  if (!adminSlug) return [];
  return clients.flatMap((client) =>
    client.projects.map((project) => ({
      slug: adminSlug,
      clientId: client.id,
      projectId: project.id,
    })),
  );
}

export function findAdminProject(
  clients: Client[],
  clientId: string,
  projectId: string,
): { client: Client; project: Project } | null {
  const client = clients.find((c) => c.id === clientId);
  const project = client?.projects.find((p) => p.id === projectId);
  return client && project ? { client, project } : null;
}

export function adminProjectHref(
  adminSlug: string,
  clientId: string,
  projectId: string,
): string {
  return `/a/${adminSlug}/${clientId}/${projectId}`;
}

/** The client page tab of a project. Finished projects live on /anteriores;
 *  the hash selects the tab (ProjectSwitcher) and only exists with a report. */
export function clientPageHref(
  clientSlug: string,
  project: Project,
  hasReport: boolean,
): string {
  const base = isArchived(project)
    ? `/r/${clientSlug}/anteriores`
    : `/r/${clientSlug}`;
  return hasReport ? `${base}#${project.id}` : base;
}

// ---- Change formatting (pt-BR) ----

const MINUS = "−";

/** "+6 pp", "−8 pp", "0 pp"; "—" without a comparable previous report. */
export function formatDeltaPp(delta: number | null): string {
  if (delta === null) return "—";
  if (delta > 0) return `+${delta} pp`;
  if (delta < 0) return `${MINUS}${-delta} pp`;
  return "0 pp";
}

/** "+2 frentes no escopo", "−1 frente no escopo", "mesmas frentes"; empty
 *  without a comparison. It counts scope, so the words say so — "+4 frentes"
 *  alone read as four delivered. */
export function formatFrontsDelta(delta: number | null): string {
  if (delta === null) return "";
  if (delta === 0) return "mesmas frentes";
  const n = Math.abs(delta);
  const noun = n === 1 ? "frente" : "frentes";
  return `${delta > 0 ? "+" : MINUS}${n} ${noun} no escopo`;
}
