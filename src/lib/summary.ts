import type { Snapshot } from "./types";

// Pure helpers for the executive summary strip. Computed from the latest
// snapshot at build time — no state, no fetching.

/** Average of all progress percentages, rounded. 0 when there are none. */
export function overallPercent(snapshot: Snapshot): number {
  const items = snapshot.progress;
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + item.percent, 0);
  return Math.round(sum / items.length);
}

/** How many cards across all sections are done ("entregas concluídas"). */
export function countDelivered(snapshot: Snapshot): number {
  return snapshot.sections.reduce(
    (acc, section) =>
      acc + section.cards.filter((card) => card.status === "done").length,
    0,
  );
}
