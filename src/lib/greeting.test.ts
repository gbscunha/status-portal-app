import { describe, expect, it } from "vitest";
import { dailyPhrase, PHRASES } from "./greeting";

describe("dailyPhrase", () => {
  it("is deterministic for the same date", () => {
    expect(dailyPhrase("2026-07-17")).toEqual(dailyPhrase("2026-07-17"));
  });

  it("always returns a phrase from the list", () => {
    expect(PHRASES).toContainEqual(dailyPhrase("2026-07-17"));
    expect(PHRASES).toContainEqual(dailyPhrase("2031-12-31"));
  });

  it("cycles through every phrase on consecutive days", () => {
    const seen = new Set(
      PHRASES.map((_, i) => {
        const day = String(i + 1).padStart(2, "0");
        return dailyPhrase(`2026-07-${day}`).text;
      }),
    );
    expect(seen.size).toBe(PHRASES.length);
  });

  it("every phrase contains its own highlight", () => {
    for (const phrase of PHRASES) {
      expect(phrase.text).toContain(phrase.highlight);
    }
  });
});
