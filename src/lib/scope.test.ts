import { describe, expect, it } from "vitest";
import { scopeChanges, scopeCoverage, scopeGroups } from "./scope";
import type { Scope, ScopeItem, Snapshot } from "./types";

function item(partial: Partial<ScopeItem> & { id: string }): ScopeItem {
  return { label: `L ${partial.id}`, desc: `D ${partial.id}`, ...partial };
}

function scope(partial: Partial<Scope>): Scope {
  return { baseline: "2026-07-22", items: [], ...partial };
}

function snapshot(progress: Snapshot["progress"]): Snapshot {
  return {
    date: "2026-08-04",
    title: { text: "t" },
    progress,
    sections: [],
  };
}

describe("scopeCoverage", () => {
  const base = scope({
    items: [item({ id: "a" }), item({ id: "b" }), item({ id: "c" })],
  });

  it("inherits the state of the progress item that references it", () => {
    const { items } = scopeCoverage(
      base,
      snapshot([
        { label: "A", percent: 100, state: "done", scopeId: "a" },
        { label: "B", percent: 40, state: "prog", scopeId: "b" },
      ]),
    );
    expect(items.map((i) => [i.id, i.state])).toEqual([
      ["a", "done"],
      ["b", "prog"],
      ["c", "plan"],
    ]);
  });

  it("falls back to plan for items nothing references", () => {
    const { items } = scopeCoverage(base, snapshot([]));
    expect(items.every((i) => i.state === "plan")).toBe(true);
  });

  it("reports scopeIds that no scope item answers to, without failing", () => {
    const { items, orphans } = scopeCoverage(
      base,
      snapshot([
        { label: "A", percent: 100, state: "done", scopeId: "a" },
        { label: "Fantasma", percent: 50, state: "prog", scopeId: "nao-existe" },
      ]),
    );
    expect(orphans).toEqual(["nao-existe"]);
    expect(items).toHaveLength(3);
  });

  it("ignores progress items with no scopeId at all", () => {
    const { orphans, items } = scopeCoverage(
      base,
      snapshot([{ label: "Texto livre", percent: 10, state: "prog" }]),
    );
    expect(orphans).toEqual([]);
    expect(items.every((i) => i.state === "plan")).toBe(true);
  });

  it("counts only active items, and delivered among them", () => {
    const withRemoved = scope({
      items: [
        item({ id: "a" }),
        item({ id: "b" }),
        item({ id: "old", removedAt: "2026-08-01" }),
      ],
    });
    const { total, delivered } = scopeCoverage(
      withRemoved,
      snapshot([
        { label: "A", percent: 100, state: "done", scopeId: "a" },
        { label: "Old", percent: 100, state: "done", scopeId: "old" },
      ]),
    );
    expect(total).toBe(2);
    expect(delivered).toBe(1);
  });

  it("flags items added after the baseline, but not the baseline ones", () => {
    const mixed = scope({
      baseline: "2026-07-22",
      items: [
        item({ id: "base" }),
        item({ id: "same-day", addedAt: "2026-07-22" }),
        item({ id: "later", addedAt: "2026-08-01" }),
      ],
    });
    const { items } = scopeCoverage(mixed, snapshot([]));
    expect(items.map((i) => i.addedAfterBaseline)).toEqual([false, false, true]);
  });

  it("returns empty results for an empty scope", () => {
    const empty = scopeCoverage(scope({}), snapshot([]));
    expect(empty).toEqual({ items: [], orphans: [], total: 0, delivered: 0 });
  });
});

describe("scopeChanges", () => {
  it("lists items added after the baseline and items removed", () => {
    const changed = scope({
      baseline: "2026-07-22",
      items: [
        item({ id: "base" }),
        item({ id: "novo", addedAt: "2026-08-01" }),
        item({ id: "fora", removedAt: "2026-08-05" }),
      ],
    });
    const { added, removed } = scopeChanges(changed);
    expect(added.map((i) => i.id)).toEqual(["novo"]);
    expect(removed.map((i) => i.id)).toEqual(["fora"]);
  });

  it("returns nothing when the scope never moved", () => {
    const untouched = scope({ items: [item({ id: "a" }), item({ id: "b" })] });
    expect(scopeChanges(untouched)).toEqual({ added: [], removed: [] });
  });
});

describe("scopeGroups", () => {
  it("groups by group, preserving first-seen order", () => {
    const { items } = scopeCoverage(
      scope({
        items: [
          item({ id: "a", group: "Operação" }),
          item({ id: "b", group: "Financeiro" }),
          item({ id: "c", group: "Operação" }),
        ],
      }),
      snapshot([]),
    );
    expect(scopeGroups(items).map((g) => [g.name, g.items.length])).toEqual([
      ["Operação", 2],
      ["Financeiro", 1],
    ]);
  });

  it("puts items without a group under Geral", () => {
    const { items } = scopeCoverage(
      scope({ items: [item({ id: "a" }), item({ id: "b", group: "Outro" })] }),
      snapshot([]),
    );
    expect(scopeGroups(items).map((g) => g.name)).toEqual(["Geral", "Outro"]);
  });
});
