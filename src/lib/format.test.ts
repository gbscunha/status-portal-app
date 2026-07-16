import { describe, expect, it } from "vitest";
import { formatPtDate } from "./format";

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
