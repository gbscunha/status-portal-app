import { describe, expect, it } from "vitest";
import { compareSnapshotFiles, latestSnapshotFilesPerDay } from "./content";

describe("compareSnapshotFiles", () => {
  it("orders the -N suffix after the base file of the same day", () => {
    // Lexicographic compare gets this wrong ("." > "-"), which made the panel
    // ignore a second snapshot published on the same day.
    expect(
      compareSnapshotFiles("2026-07-24.json", "2026-07-24-2.json"),
    ).toBeLessThan(0);
  });

  it("compares the suffix numerically, not lexicographically", () => {
    expect(
      compareSnapshotFiles("2026-07-24-2.json", "2026-07-24-10.json"),
    ).toBeLessThan(0);
  });

  it("keeps chronological order across different days", () => {
    expect(
      compareSnapshotFiles("2026-07-22.json", "2026-07-24.json"),
    ).toBeLessThan(0);
    expect(
      compareSnapshotFiles("2026-07-24-9.json", "2026-07-25.json"),
    ).toBeLessThan(0);
  });

  it("puts the newest snapshot first when sorting descending", () => {
    const files = ["2026-07-24.json", "2026-07-22.json", "2026-07-24-2.json"];
    files.sort((a, b) => compareSnapshotFiles(b, a));
    expect(files).toEqual([
      "2026-07-24-2.json",
      "2026-07-24.json",
      "2026-07-22.json",
    ]);
  });
});

describe("latestSnapshotFilesPerDay", () => {
  it("keeps at most one snapshot per day, the highest sequence winning", () => {
    // The UI keys the timeline by date, so duplicate days would break React
    // keys and mark two entries as current.
    expect(
      latestSnapshotFilesPerDay([
        "2026-07-22.json",
        "2026-07-24.json",
        "2026-07-24-2.json",
      ]),
    ).toEqual(["2026-07-24-2.json", "2026-07-22.json"]);
  });

  it("returns newest first and leaves distinct days untouched", () => {
    expect(
      latestSnapshotFilesPerDay(["2026-07-10.json", "2026-07-22.json"]),
    ).toEqual(["2026-07-22.json", "2026-07-10.json"]);
  });
});
