import { describe, expect, it } from "vitest";
import { STALE_DAYS, adminProjectRow } from "./admin";
import type { Lifecycle, Project, Snapshot } from "./types";

const today = "2026-10-20";

function project(lifecycle?: Lifecycle): Project {
  return { id: "p1", name: "Projeto 1", ...(lifecycle && { lifecycle }) };
}

function snapshot(partial: Partial<Snapshot> = {}): Snapshot {
  return {
    date: "2026-10-12",
    title: { text: "t" },
    progress: [{ label: "a", percent: 40, state: "prog" }],
    sections: [],
    ...partial,
  };
}

// 2026-09-01 → 2026-10-20 = 49 days, well past the stale threshold.
const oldSnapshot = snapshot({ date: "2026-09-01" });

describe("adminProjectRow", () => {
  it("summarizes the latest snapshot of an active project", () => {
    const row = adminProjectRow(
      project(),
      snapshot({ pending: [{ label: "x", desc: "y" }] }),
      today,
    );
    expect(row.lifecycle).toEqual({ state: "active" });
    expect(row.report).toEqual({
      date: "2026-10-12",
      percent: 40,
      pendingCount: 1,
      idleDays: 8,
      stale: false,
    });
  });

  it("flags an active project idle beyond the threshold", () => {
    const row = adminProjectRow(project(), oldSnapshot, today);
    expect(row.report?.idleDays).toBeGreaterThan(STALE_DAYS);
    expect(row.report?.stale).toBe(true);
  });

  it("never flags paused, delivered or closed projects as stale", () => {
    for (const lifecycle of [
      { state: "paused", reason: "Aguardando acesso" },
      { state: "delivered", deliveredAt: "2026-09" },
      { state: "closed", closedAt: "2026-09" },
    ] satisfies Lifecycle[]) {
      const row = adminProjectRow(project(lifecycle), oldSnapshot, today);
      expect(row.lifecycle).toBe(lifecycle);
      expect(row.report?.stale).toBe(false);
    }
  });

  it("has no report when the project was never published", () => {
    expect(adminProjectRow(project(), null, today).report).toBeNull();
  });
});
