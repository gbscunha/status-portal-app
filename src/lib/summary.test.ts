import { describe, expect, it } from "vitest";
import { countDelivered, overallPercent, timelineEntries } from "./summary";
import type { Snapshot } from "./types";

function snapshot(partial: Partial<Snapshot>): Snapshot {
  return {
    date: "2026-07-16",
    title: { text: "t" },
    progress: [],
    sections: [],
    ...partial,
  };
}

describe("overallPercent", () => {
  it("averages progress percentages, rounded", () => {
    const s = snapshot({
      progress: [
        { label: "a", percent: 100, state: "done" },
        { label: "b", percent: 50, state: "prog" },
        { label: "c", percent: 0, state: "plan" },
      ],
    });
    expect(overallPercent(s)).toBe(50);
  });

  it("rounds to nearest integer", () => {
    const s = snapshot({
      progress: [
        { label: "a", percent: 33, state: "prog" },
        { label: "b", percent: 34, state: "prog" },
      ],
    });
    expect(overallPercent(s)).toBe(34); // 33.5 rounds half up
  });

  it("returns 0 for empty progress", () => {
    expect(overallPercent(snapshot({}))).toBe(0);
  });
});

describe("countDelivered", () => {
  it("counts cards with done status across sections", () => {
    const s = snapshot({
      sections: [
        {
          number: "01",
          title: "A",
          cards: [
            { title: "x", status: "done", description: "d", fullWidth: false },
            { title: "y", status: "prog", description: "d", fullWidth: false },
          ],
        },
        {
          number: "02",
          title: "B",
          cards: [
            { title: "z", status: "done", description: "d", fullWidth: false },
          ],
        },
      ],
    });
    expect(countDelivered(s)).toBe(2);
  });

  it("returns 0 when there are no sections", () => {
    expect(countDelivered(snapshot({}))).toBe(0);
  });
});

describe("timelineEntries", () => {
  it("prefers milestone, then subtitle, then the title text", () => {
    const entries = timelineEntries([
      snapshot({ date: "2026-10-12", milestone: "m", subtitle: "s", title: { text: "t1" } }),
      snapshot({ date: "2026-10-05", subtitle: "s", title: { text: "t2" } }),
      snapshot({ date: "2026-09-28", title: { text: "t3" } }),
    ]);
    expect(entries).toEqual([
      { date: "2026-10-12", title: "m" },
      { date: "2026-10-05", title: "s" },
      { date: "2026-09-28", title: "t3" },
    ]);
  });

  it("returns an empty history for no snapshots", () => {
    expect(timelineEntries([])).toEqual([]);
  });
});
