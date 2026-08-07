import type { Scope, ScopeItem, Snapshot, StatusState } from "./types";

// Scope is the denominator of progress: without it, "78%" never says of what.
// These helpers pair the agreed scope (stable, in the client config) with a
// dated snapshot (temporal) and derive everything the report needs.

const DEFAULT_GROUP = "Geral";

export type ScopeItemView = ScopeItem & {
  /** State of the progress item pointing here; `plan` when nothing points. */
  state: StatusState;
  /** Entered after the agreed baseline — i.e. the scope moved. */
  addedAfterBaseline: boolean;
  /** Left the scope. Kept for history, excluded from the counts. */
  removed: boolean;
};

export type ScopeCoverage = {
  items: ScopeItemView[];
  /** scopeIds referenced by the snapshot that no scope item answers to. */
  orphans: string[];
  /** Active (non-removed) items, and how many of those are delivered. */
  total: number;
  delivered: number;
};

export function scopeCoverage(scope: Scope, snapshot: Snapshot): ScopeCoverage {
  const stateById = new Map<string, StatusState>();
  for (const entry of snapshot.progress) {
    if (entry.scopeId) stateById.set(entry.scopeId, entry.state);
  }

  const items: ScopeItemView[] = scope.items.map((item) => ({
    ...item,
    state: stateById.get(item.id) ?? "plan",
    // ISO strings compare lexicographically, so no Date is built here — same
    // TZ-safe rule as format.ts.
    addedAfterBaseline:
      item.addedAt !== undefined && item.addedAt > scope.baseline,
    removed: item.removedAt !== undefined,
  }));

  const known = new Set(scope.items.map((item) => item.id));
  const orphans = [...stateById.keys()].filter((id) => !known.has(id));

  const active = items.filter((item) => !item.removed);

  return {
    items,
    orphans,
    total: active.length,
    delivered: active.filter((item) => item.state === "done").length,
  };
}

export type ScopeChanges = {
  added: ScopeItem[];
  removed: ScopeItem[];
};

/** What moved since the scope was agreed — the record that backs a deadline
 *  conversation with the client. */
export function scopeChanges(scope: Scope): ScopeChanges {
  return {
    added: scope.items.filter(
      (item) => item.addedAt !== undefined && item.addedAt > scope.baseline,
    ),
    removed: scope.items.filter((item) => item.removedAt !== undefined),
  };
}

/** Buckets for the map. Insertion order wins, so groups show up in the order
 *  they first appear in the content file — predictable for whoever writes it. */
export function scopeGroups(
  items: ScopeItemView[],
): { name: string; items: ScopeItemView[] }[] {
  const groups = new Map<string, ScopeItemView[]>();
  for (const item of items) {
    const name = item.group ?? DEFAULT_GROUP;
    const bucket = groups.get(name);
    if (bucket) bucket.push(item);
    else groups.set(name, [item]);
  }
  return [...groups].map(([name, grouped]) => ({ name, items: grouped }));
}
