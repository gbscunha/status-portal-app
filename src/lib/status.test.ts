import { describe, expect, it } from "vitest";
import { STATUS_LABELS, STATUS_STATES } from "./status";
import { statusStateSchema } from "./types";

describe("status states", () => {
  it("has exactly the three canonical states", () => {
    expect(STATUS_STATES).toEqual(["done", "prog", "plan"]);
  });

  it("has a pt-BR label for every state", () => {
    for (const state of STATUS_STATES) {
      expect(STATUS_LABELS[state]).toBeTruthy();
    }
  });

  it("rejects unknown states in the schema", () => {
    expect(statusStateSchema.safeParse("done").success).toBe(true);
    expect(statusStateSchema.safeParse("blocked").success).toBe(false);
    expect(statusStateSchema.safeParse("").success).toBe(false);
  });
});
