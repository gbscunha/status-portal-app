import type { Lifecycle, Project, Snapshot } from "./types";
import { daysBetween } from "./format";
import { lifecycleOf } from "./lifecycle";
import { overallPercent } from "./summary";

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
      percent: overallPercent(latest),
      pendingCount: latest.pending?.length ?? 0,
      idleDays,
      stale: lifecycle.state === "active" && idleDays > STALE_DAYS,
    },
  };
}
