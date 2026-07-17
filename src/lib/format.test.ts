import { describe, expect, it } from "vitest";
import { daysBetween, formatPtDate, todayIso } from "./format";

describe("formatPtDate", () => {
  it("formats an ISO date in pt-BR without timezone drift", () => {
    // new Date("2026-07-10") would be midnight UTC and render as 09/07 in
    // America/Sao_Paulo — the exact off-by-one this function exists to avoid.
    expect(formatPtDate("2026-07-10")).toBe("10 Jul 2026");
  });

  it("formats the first and last day of the year", () => {
    expect(formatPtDate("2026-01-01")).toBe("1 Jan 2026");
    expect(formatPtDate("2026-12-31")).toBe("31 Dez 2026");
  });
});

describe("daysBetween", () => {
  it("counts days from a to b", () => {
    expect(daysBetween("2026-07-01", "2026-07-16")).toBe(15);
  });

  it("is negative when b precedes a", () => {
    expect(daysBetween("2026-07-16", "2026-07-01")).toBe(-15);
  });

  it("returns 0 for the same date and crosses month boundaries", () => {
    expect(daysBetween("2026-07-16", "2026-07-16")).toBe(0);
    expect(daysBetween("2026-06-30", "2026-07-01")).toBe(1);
  });
});

describe("todayIso", () => {
  it("returns a YYYY-MM-DD string", () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
