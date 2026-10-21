import type { Client, Lifecycle, Project, Snapshot } from "./types";

// Single source of truth for the WHOLE-PROJECT lifecycle — a set kept apart
// from done/prog/plan (status.ts), which apply to bars and cards. Colors live
// in the CSS (.paused/.delivered/.closed classes in globals.css).

export const LIFECYCLE_STATES = ["active", "paused", "delivered", "closed"] as const;

export type LifecycleState = (typeof LIFECYCLE_STATES)[number];

// "Em espera", not "Pausado" or "Bloqueado": it doesn't say who stopped.
// "Encerrado" is a project interrupted without delivery — never shown as
// delivered.
export const LIFECYCLE_LABELS: Record<LifecycleState, string> = {
  active: "Em andamento",
  paused: "Em espera",
  delivered: "Concluído",
  closed: "Encerrado",
};

const ACTIVE: Lifecycle = { state: "active" };

/** Missing field = active, so JSON written before the field behaves as before. */
export function lifecycleOf(project: Project): Lifecycle {
  return project.lifecycle ?? ACTIVE;
}

/** YYYY-MM the project was delivered or closed; null while it still runs. */
export function endMonth(lifecycle: Lifecycle): string | null {
  if (lifecycle.state === "delivered") return lifecycle.deliveredAt;
  if (lifecycle.state === "closed") return lifecycle.closedAt;
  return null;
}

/** Delivered or closed: leaves the tabs and moves to "Projetos anteriores". */
export function isArchived(project: Project): boolean {
  return endMonth(lifecycleOf(project)) !== null;
}

/** Main view: active projects first, then paused ones, each in config order. */
export function currentProjects(projects: Project[]): Project[] {
  const byState = (state: LifecycleState) =>
    projects.filter((p) => lifecycleOf(p).state === state);
  return [...byState("active"), ...byState("paused")];
}

/** Archive view, most recent month first (sort is stable on ties). YYYY-MM
 *  compares correctly as a string. */
export function archivedProjects(projects: Project[]): {
  delivered: Project[];
  closed: Project[];
} {
  const month = (p: Project) => endMonth(lifecycleOf(p)) ?? "";
  const newestFirst = (a: Project, b: Project) =>
    month(b).localeCompare(month(a));
  const byState = (state: LifecycleState) =>
    projects.filter((p) => lifecycleOf(p).state === state).sort(newestFirst);
  return { delivered: byState("delivered"), closed: byState("closed") };
}

/** Every project in display order: current ones, then delivered, then closed. */
export function orderedProjects(projects: Project[]): Project[] {
  const { delivered, closed } = archivedProjects(projects);
  return [...currentProjects(projects), ...delivered, ...closed];
}

/** A finished project's last report, minus what reads as a live request or a
 *  promise: client pending actions, next steps and delivery estimates. What
 *  was done (progress, cards, history) stays. Returns a copy. */
export function finishedReport(snapshot: Snapshot): Snapshot {
  return {
    ...snapshot,
    pending: undefined,
    nextSteps: undefined,
    progress: snapshot.progress.map((item) => ({ ...item, eta: undefined })),
  };
}

/** Offline client: its pages are a 404, its data stays (DECISOES §20). */
export function isOnline(client: Client): boolean {
  return client.offline !== true;
}

/** Slugs that get a /r/<slug> page; every other slug is a 404. */
export function clientSlugs(clients: Client[]): string[] {
  return clients.filter(isOnline).map((c) => c.slug);
}

/** Slugs that get a /r/<slug>/anteriores page; every other slug is a 404. */
export function archiveSlugs(clients: Client[]): string[] {
  return clients
    .filter((c) => isOnline(c) && c.projects.some(isArchived))
    .map((c) => c.slug);
}
