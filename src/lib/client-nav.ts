import type { Client, Project, Snapshot } from "./types";
import { archivedProjects, currentProjects, lifecycleOf } from "./lifecycle";

// Navigation of the client pages: the sidebar's two groups and which panel the
// URL hash shows. Pure, so the islands only read the hash and render.

/** A project's state as the CLIENT sees it. The admin-only signals (stale, no
 *  report) never reach this page. */
export type ClientSignal = "active" | "pending" | "paused" | "delivered" | "closed";

/** Finished projects keep their end state; otherwise the client's own pending
 *  action wins, even over a pause (same order as the admin's rowSignal). */
export function clientSignal(project: Project, snapshot: Snapshot): ClientSignal {
  const { state } = lifecycleOf(project);
  if (state === "delivered" || state === "closed") return state;
  if ((snapshot.pending?.length ?? 0) > 0) return "pending";
  return state === "paused" ? "paused" : "active";
}

/** Which page the sidebar is on: the main view or /anteriores. */
export type ClientPage = "current" | "archive";

export type ClientNavItem = {
  id: string;
  name: string;
  signal: ClientSignal;
  /** "#<id>" on the page that holds the panel, a full link from the other. */
  href: string;
  /** True when the panel lives on this page (the hash switches it). */
  local: boolean;
};

export type ClientNav = {
  projects: ClientNavItem[];
  /** Null when nothing is archived. With archived projects but no report, the
   *  group still links to the page, which then shows its empty state; `here`
   *  marks that link as the current page on /anteriores. */
  archive: { href: string; here: boolean; items: ClientNavItem[] } | null;
};

type Report = { project: Project; snapshot: Snapshot };

/** Sidebar groups for one client. Only projects with a report get an item:
 *  there is no panel to show for the others. */
export function clientNav(
  client: Client,
  reports: Report[],
  page: ClientPage,
): ClientNav {
  const mainHref = `/r/${client.slug}`;
  const archiveHref = `${mainHref}/anteriores`;
  const reportOf = new Map(reports.map((r) => [r.project.id, r]));

  const items = (projects: Project[], pageHref: string, local: boolean) =>
    projects.flatMap((project): ClientNavItem[] => {
      const report = reportOf.get(project.id);
      if (!report) return [];
      return [
        {
          id: project.id,
          name: project.name,
          signal: clientSignal(project, report.snapshot),
          href: local ? `#${project.id}` : `${pageHref}#${project.id}`,
          local,
        },
      ];
    });

  const { delivered, closed } = archivedProjects(client.projects);
  const archived = [...delivered, ...closed];

  return {
    projects: items(currentProjects(client.projects), mainHref, page === "current"),
    archive:
      archived.length > 0
        ? {
            href: archiveHref,
            here: page === "archive",
            items: items(archived, archiveHref, page === "archive"),
          }
        : null,
  };
}

/** The panel the hash names, or the first one (empty or unknown hash). Takes
 *  `location.hash` as is or already without its leading "#". */
export function activePanel(ids: string[], hash: string): string | undefined {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  return ids.includes(id) ? id : ids[0];
}
