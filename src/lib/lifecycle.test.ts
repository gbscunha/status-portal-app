import { describe, expect, it } from "vitest";
import {
  LIFECYCLE_LABELS,
  LIFECYCLE_STATES,
  archiveSlugs,
  archivedProjects,
  currentProjects,
  endMonth,
  finishedReport,
  isArchived,
  lifecycleOf,
  orderedProjects,
} from "./lifecycle";
import {
  lifecycleSchema,
  type Client,
  type Lifecycle,
  type Project,
  type Snapshot,
} from "./types";

function project(id: string, lifecycle?: Lifecycle): Project {
  return { id, name: id, ...(lifecycle && { lifecycle }) };
}

const paused: Lifecycle = { state: "paused", reason: "Aguardando acesso" };
const delivered = (deliveredAt: string): Lifecycle => ({
  state: "delivered",
  deliveredAt,
});
const closed = (closedAt: string): Lifecycle => ({ state: "closed", closedAt });

describe("lifecycle states", () => {
  it("has exactly the four canonical states", () => {
    expect(LIFECYCLE_STATES).toEqual(["active", "paused", "delivered", "closed"]);
  });

  it("has a pt-BR label for every state", () => {
    for (const state of LIFECYCLE_STATES) {
      expect(LIFECYCLE_LABELS[state]).toBeTruthy();
    }
    expect(LIFECYCLE_LABELS.paused).toBe("Em espera");
  });

  it("matches the states the schema accepts, in the same order", () => {
    const schemaStates = lifecycleSchema.options.map((o) => o.shape.state.value);
    expect(schemaStates).toEqual([...LIFECYCLE_STATES]);
  });
});

describe("lifecycleOf", () => {
  it("treats a project without lifecycle as active", () => {
    expect(lifecycleOf(project("a"))).toEqual({ state: "active" });
  });

  it("returns the declared lifecycle", () => {
    expect(lifecycleOf(project("a", paused))).toBe(paused);
  });
});

describe("endMonth", () => {
  it("returns the month a delivered or closed project ended", () => {
    expect(endMonth(delivered("2026-10"))).toBe("2026-10");
    expect(endMonth(closed("2026-08"))).toBe("2026-08");
  });

  it("is null while the project is still running", () => {
    expect(endMonth({ state: "active" })).toBeNull();
    expect(endMonth(paused)).toBeNull();
  });
});

describe("isArchived", () => {
  it("is true only for delivered and closed projects", () => {
    expect(isArchived(project("a"))).toBe(false);
    expect(isArchived(project("a", { state: "active" }))).toBe(false);
    expect(isArchived(project("a", paused))).toBe(false);
    expect(isArchived(project("a", delivered("2026-10")))).toBe(true);
    expect(isArchived(project("a", closed("2026-10")))).toBe(true);
  });
});

describe("currentProjects", () => {
  it("puts active projects first, then paused ones, keeping config order", () => {
    const projects = [
      project("p1", paused),
      project("a1"),
      project("d1", delivered("2026-09")),
      project("p2", paused),
      project("a2", { state: "active" }),
      project("c1", closed("2026-08")),
    ];
    expect(currentProjects(projects).map((p) => p.id)).toEqual([
      "a1",
      "a2",
      "p1",
      "p2",
    ]);
  });

  it("returns an empty list when every project is archived", () => {
    const projects = [project("d1", delivered("2026-09"))];
    expect(currentProjects(projects)).toEqual([]);
  });
});

describe("archivedProjects", () => {
  it("groups delivered and closed, most recent month first", () => {
    const projects = [
      project("d-old", delivered("2026-03")),
      project("a1"),
      project("c-old", closed("2025-12")),
      project("d-new", delivered("2026-10")),
      project("c-new", closed("2026-07")),
      project("p1", paused),
    ];
    const { delivered: d, closed: c } = archivedProjects(projects);
    expect(d.map((p) => p.id)).toEqual(["d-new", "d-old"]);
    expect(c.map((p) => p.id)).toEqual(["c-new", "c-old"]);
  });

  it("keeps config order on the same month", () => {
    const projects = [
      project("x", delivered("2026-10")),
      project("y", delivered("2026-10")),
    ];
    expect(archivedProjects(projects).delivered.map((p) => p.id)).toEqual([
      "x",
      "y",
    ]);
  });

  it("returns empty groups when nothing is archived", () => {
    expect(archivedProjects([project("a1"), project("p1", paused)])).toEqual({
      delivered: [],
      closed: [],
    });
  });
});

describe("orderedProjects", () => {
  it("lists current projects, then delivered, then closed", () => {
    const projects = [
      project("c1", closed("2026-08")),
      project("d1", delivered("2026-09")),
      project("p1", paused),
      project("a1"),
    ];
    expect(orderedProjects(projects).map((p) => p.id)).toEqual([
      "a1",
      "p1",
      "d1",
      "c1",
    ]);
  });
});

describe("archiveSlugs", () => {
  const client = (slug: string, projects: Project[]): Client => ({
    id: slug,
    name: slug,
    slug,
    brandColor: "#112233",
    vendor: "ITGraph",
    projects,
  });

  it("lists only clients with at least one delivered or closed project", () => {
    const clients = [
      client("only-active", [project("a1"), project("p1", paused)]),
      client("has-delivered", [project("a1"), project("d1", delivered("2026-10"))]),
      client("has-closed", [project("c1", closed("2026-08"))]),
    ];
    expect(archiveSlugs(clients)).toEqual(["has-delivered", "has-closed"]);
  });

  it("returns nothing when no client has archived projects", () => {
    expect(archiveSlugs([client("x", [project("a1")])])).toEqual([]);
  });
});

describe("finishedReport", () => {
  const latest: Snapshot = {
    date: "2026-10-12",
    title: { text: "Quase lá" },
    progress: [
      { label: "Cadastro", percent: 100, state: "done" },
      { label: "Pagamento", percent: 60, state: "prog", eta: "2026-11" },
    ],
    nextSteps: { title: "Próximos passos", items: [{ label: "a", desc: "b" }] },
    pending: [{ label: "Aprovar layout", desc: "Tela inicial" }],
    sections: [],
  };

  it("drops what reads as a live request or promise", () => {
    const report = finishedReport(latest);
    expect(report.pending).toBeUndefined();
    expect(report.nextSteps).toBeUndefined();
    expect(report.progress.map((item) => item.eta)).toEqual([undefined, undefined]);
  });

  it("keeps the record of what was done", () => {
    const report = finishedReport(latest);
    expect(report.date).toBe("2026-10-12");
    expect(report.title).toEqual({ text: "Quase lá" });
    expect(report.progress.map((item) => [item.label, item.percent, item.state])).toEqual([
      ["Cadastro", 100, "done"],
      ["Pagamento", 60, "prog"],
    ]);
  });

  it("does not mutate the loaded snapshot", () => {
    finishedReport(latest);
    expect(latest.pending).toHaveLength(1);
    expect(latest.progress[1].eta).toBe("2026-11");
  });
});
