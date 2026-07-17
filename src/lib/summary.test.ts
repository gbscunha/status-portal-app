import { describe, expect, it } from "vitest";
import { countDelivered, overallPercent } from "./summary";
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
