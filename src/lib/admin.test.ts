import { describe, expect, it } from "vitest";
import {
  STALE_DAYS,
  type AdminProjectRow,
  adminProjectHref,
  adminProjectParams,
  adminProjectRow,
  attentionList,
  attentionReasons,
  clientPageHref,
  findAdminProject,
  formatDeltaPp,
  formatFrontsDelta,
  groupByClient,
  portfolioRows,
  portfolioStats,
  projectSummary,
  rowSignal,
} from "./admin";
import type { Client, Lifecycle, Project, Snapshot } from "./types";

const today = "2026-10-20";

function project(lifecycle?: Lifecycle, id = "p1"): Project {
  return { id, name: `Projeto ${id}`, ...(lifecycle && { lifecycle }) };
}

function client(id: string, projects: Project[]): Client {
  return {
    id,
    name: `Cliente ${id}`,
    slug: `${id}-slug`,
    brandColor: "#123456",
    vendor: "ITGraph",
    projects,
  };
}

const paused: Lifecycle = { state: "paused", reason: "Aguardando testes" };
const delivered: Lifecycle = { state: "delivered", deliveredAt: "2026-09" };
const closed: Lifecycle = { state: "closed", closedAt: "2026-08" };

// A row as the admin builds it, with only what each case cares about.
function row(
  id: string,
  {
    lifecycle = { state: "active" },
    report = {},
  }: {
    lifecycle?: Lifecycle;
    report?: Partial<NonNullable<AdminProjectRow["report"]>> | null;
  } = {},
): AdminProjectRow {
  return {
    id,
    name: id,
    lifecycle,
    report:
      report === null
        ? null
        : {
            date: "2026-10-12",
            percent: 50,
            pendingCount: 0,
            idleDays: 8,
            stale: false,
            ...report,
          },
  };
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

  it("carries the phase of the latest snapshot", () => {
    const row = adminProjectRow(project(), snapshot({ phase: "Piloto" }), today);
    expect(row.report?.phase).toBe("Piloto");
  });
});

describe("portfolioRows / groupByClient", () => {
  const clients = [
    client("b", [project(delivered, "b1"), project(undefined, "b2")]),
    client("a", [project(undefined, "a1")]),
  ];
  const latestOf = (clientId: string, projectId: string) =>
    projectId === "b2" ? null : snapshot();

  it("keeps client order and the display order of each client's projects", () => {
    const rows = portfolioRows(clients, latestOf, today);
    // orderedProjects: active before delivered.
    expect(rows.map((r) => r.id)).toEqual(["b2", "b1", "a1"]);
    expect(rows[0]).toMatchObject({
      clientId: "b",
      clientName: "Cliente b",
      clientSlug: "b-slug",
      brandColor: "#123456",
      report: null,
    });
  });

  it("groups rows by client in first-seen order", () => {
    const groups = groupByClient(portfolioRows(clients, latestOf, today));
    expect(groups.map((g) => [g.clientId, g.rows.map((r) => r.id)])).toEqual([
      ["b", ["b2", "b1"]],
      ["a", ["a1"]],
    ]);
  });
});

describe("portfolioStats", () => {
  it("counts active, pending, stale and paused — never finished projects", () => {
    const stats = portfolioStats([
      row("stale", { report: { stale: true, pendingCount: 2 } }),
      row("pending", { report: { pendingCount: 1 } }),
      row("unpublished", { report: null }),
      row("paused", { lifecycle: paused, report: { pendingCount: 1 } }),
      // A finished project's old pending list is not a live request.
      row("delivered", { lifecycle: delivered, report: { pendingCount: 3 } }),
      row("closed", { lifecycle: closed, report: { pendingCount: 2 } }),
    ]);
    expect(stats).toEqual({
      active: 3,
      pendingTotal: 4,
      pendingProjects: 3,
      stale: 1,
      paused: 1,
    });
  });
});

describe("attentionList", () => {
  it("orders stale → more pending → fewer pending → paused", () => {
    const list = attentionList([
      row("paused", { lifecycle: paused }),
      row("one", { report: { pendingCount: 1 } }),
      row("stale", { report: { stale: true, idleDays: 20 } }),
      row("three", { report: { pendingCount: 3 } }),
    ]);
    expect(list.map((i) => i.row.id)).toEqual(["stale", "three", "one", "paused"]);
  });

  it("puts a paused project with pending items in the pending group", () => {
    const list = attentionList([
      row("paused", { lifecycle: paused }),
      row("paused-pending", { lifecycle: paused, report: { pendingCount: 1 } }),
      row("three", { report: { pendingCount: 3 } }),
    ]);
    expect(list.map((i) => i.row.id)).toEqual([
      "three",
      "paused-pending",
      "paused",
    ]);
    expect(list[1].reasons).toEqual([
      { kind: "pending", count: 1 },
      { kind: "paused", reason: "Aguardando testes" },
    ]);
  });

  it("lists an active project never published as 'none', before every stale one", () => {
    const list = attentionList([
      row("three", { report: { pendingCount: 3 } }),
      row("stale", { report: { stale: true, idleDays: 90 } }),
      row("unpublished", { report: null }),
      row("unpublished-2", { report: null }),
    ]);
    expect(list.map((i) => i.row.id)).toEqual([
      "unpublished",
      "unpublished-2",
      "stale",
      "three",
    ]);
    expect(list[0].reasons).toEqual([{ kind: "none" }]);
  });

  it("reads a paused project never published as paused, not 'none'", () => {
    const r = row("w", { lifecycle: paused, report: null });
    expect(attentionReasons(r)).toEqual([
      { kind: "paused", reason: "Aguardando testes" },
    ]);
    expect(rowSignal(r)).toBe("paused");
  });

  it("ranks the longer-idle stale project first and keeps input order on ties", () => {
    const list = attentionList([
      row("s1", { report: { stale: true, idleDays: 16 } }),
      row("s2", { report: { stale: true, idleDays: 40 } }),
      row("p1", { report: { pendingCount: 2 } }),
      row("p2", { report: { pendingCount: 2 } }),
    ]);
    expect(list.map((i) => i.row.id)).toEqual(["s2", "s1", "p1", "p2"]);
  });

  it("leaves out finished projects and active ones with nothing to act on", () => {
    expect(
      attentionList([
        row("ok"),
        row("delivered", {
          lifecycle: delivered,
          report: { pendingCount: 2, stale: true },
        }),
        row("closed", { lifecycle: closed, report: { pendingCount: 2 } }),
      ]),
    ).toEqual([]);
  });

  it("exposes the reasons of a single row", () => {
    expect(attentionReasons(row("ok"))).toEqual([]);
    expect(
      attentionReasons(row("s", { report: { stale: true, idleDays: 30 } })),
    ).toEqual([{ kind: "stale", idleDays: 30 }]);
  });
});

describe("rowSignal", () => {
  it("maps each row to the sidebar signal", () => {
    expect(rowSignal(row("ok"))).toBe("active");
    expect(rowSignal(row("p", { report: { pendingCount: 1 } }))).toBe("pending");
    expect(rowSignal(row("s", { report: { stale: true } }))).toBe("stale");
    expect(rowSignal(row("n", { report: null }))).toBe("none");
    expect(rowSignal(row("w", { lifecycle: paused }))).toBe("paused");
    expect(
      rowSignal(row("wp", { lifecycle: paused, report: { pendingCount: 1 } })),
    ).toBe("pending");
    expect(rowSignal(row("d", { lifecycle: delivered }))).toBe("delivered");
    expect(rowSignal(row("c", { lifecycle: closed }))).toBe("closed");
  });
});

describe("projectSummary", () => {
  const newest = snapshot({
    date: "2026-10-12",
    milestone: "Marco novo",
    progress: [
      { label: "a", percent: 100, state: "done" },
      { label: "b", percent: 42, state: "prog" },
    ],
    pending: [{ label: "x", desc: "y" }],
    nextSteps: { title: "Próximos passos", items: [{ label: "n", desc: "d" }] },
  });
  const previous = snapshot({
    date: "2026-09-30",
    subtitle: "Sub antigo",
    progress: [{ label: "a", percent: 65, state: "prog" }],
  });
  const first = snapshot({ date: "2026-07-22", title: { text: "Título" } });

  it("compares the latest report with the previous one", () => {
    const s = projectSummary(project(), [newest, previous, first], today)!;
    expect(s.percent).toBe(71);
    expect(s.delta).toBe(6);
    expect(s.frontsDelta).toBe(1);
    expect(s.previousDate).toBe("2026-09-30");
    expect(s.fronts).toEqual({ done: 1, total: 2 });
    expect(s.pendingCount).toBe(1);
    expect(s.firstReport).toBe("2026-07-22");
    expect(s.lastReport).toBe("2026-10-12");
    expect(s.idleDays).toBe(8);
  });

  it("counts done fronts by state, not by percent", () => {
    const s = projectSummary(
      project(),
      [
        snapshot({
          progress: [
            { label: "a", percent: 100, state: "prog" },
            { label: "b", percent: 90, state: "done" },
            { label: "c", percent: 80, state: "done" },
          ],
        }),
      ],
      today,
    )!;
    // By percent === 100 this would be 1.
    expect(s.fronts).toEqual({ done: 2, total: 3 });
  });

  it("measures the change in fronts by the total count, not the done count", () => {
    const before = snapshot({
      progress: [
        { label: "a", percent: 100, state: "done" },
        { label: "b", percent: 10, state: "prog" },
      ],
    });
    const after = snapshot({
      progress: [
        { label: "a", percent: 100, state: "done" },
        { label: "b", percent: 30, state: "prog" },
        { label: "c", percent: 0, state: "plan" },
        { label: "d", percent: 0, state: "plan" },
      ],
    });
    // Done stays 1 → 1; the total goes 2 → 4.
    expect(projectSummary(project(), [after, before], today)!.frontsDelta).toBe(2);
  });

  it("keeps a negative change (scope grew)", () => {
    const lower = snapshot({
      progress: [
        { label: "a", percent: 100, state: "done" },
        { label: "c", percent: 0, state: "plan" },
      ],
    });
    const s = projectSummary(project(), [lower, previous], today)!;
    expect(s.delta).toBe(-15);
    expect(s.frontsDelta).toBe(1);
  });

  it("builds the history newest first, with percent and the timeline title", () => {
    const s = projectSummary(project(), [newest, previous, first], today)!;
    expect(s.history).toEqual([
      { date: "2026-10-12", percent: 71, title: "Marco novo" },
      { date: "2026-09-30", percent: 65, title: "Sub antigo" },
      { date: "2026-07-22", percent: 40, title: "Título" },
    ]);
  });

  it("has no change without fronts on both sides to compare", () => {
    const empty = snapshot({ progress: [] });
    for (const snapshots of [[newest], [newest, empty], [empty, previous]]) {
      const s = projectSummary(project(), snapshots, today)!;
      expect(s.delta).toBeNull();
      expect(s.frontsDelta).toBeNull();
      expect(s.previousDate).toBeNull();
    }
  });

  it("drops pending, next steps and estimates of a finished project", () => {
    const withEta = snapshot({
      ...newest,
      progress: [{ label: "b", percent: 42, state: "prog", eta: "2026-11" }],
    });
    for (const lifecycle of [delivered, closed]) {
      const s = projectSummary(project(lifecycle), [withEta], today)!;
      expect(s.pendingCount).toBe(0);
      expect(s.latest.nextSteps).toBeUndefined();
      expect(s.latest.progress[0].eta).toBeUndefined();
    }
  });

  it("is null when the project was never published", () => {
    expect(projectSummary(project(), [], today)).toBeNull();
  });
});

describe("static params and links", () => {
  const clients = [
    client("movi", [project(undefined, "web"), project(delivered, "exporter")]),
    client("fgv", [project(undefined, "ct")]),
  ];

  it("generates one slug/client/project triple per project", () => {
    expect(adminProjectParams("adm", clients)).toEqual([
      { slug: "adm", clientId: "movi", projectId: "web" },
      { slug: "adm", clientId: "movi", projectId: "exporter" },
      { slug: "adm", clientId: "fgv", projectId: "ct" },
    ]);
    expect(adminProjectParams(null, clients)).toEqual([]);
  });

  it("finds a project only under its own client", () => {
    expect(findAdminProject(clients, "fgv", "ct")?.project.id).toBe("ct");
    expect(findAdminProject(clients, "fgv", "web")).toBeNull();
    expect(findAdminProject(clients, "x", "y")).toBeNull();
  });

  it("builds the admin project path", () => {
    expect(adminProjectHref("adm", "fgv", "ct")).toBe("/a/adm/fgv/ct");
  });

  it("points the client page to the right tab", () => {
    const [web, exporter] = clients[0].projects;
    expect(clientPageHref("movi-slug", web, true)).toBe("/r/movi-slug#web");
    expect(clientPageHref("movi-slug", exporter, true)).toBe(
      "/r/movi-slug/anteriores#exporter",
    );
    expect(clientPageHref("movi-slug", web, false)).toBe("/r/movi-slug");
    expect(clientPageHref("movi-slug", exporter, false)).toBe(
      "/r/movi-slug/anteriores",
    );
    expect(clientPageHref("movi-slug", project(closed, "old"), true)).toBe(
      "/r/movi-slug/anteriores#old",
    );
  });
});

describe("change formatting", () => {
  it("formats percentage-point changes with a real minus sign", () => {
    expect(formatDeltaPp(6)).toBe("+6 pp");
    expect(formatDeltaPp(-8)).toBe("−8 pp");
    expect(formatDeltaPp(0)).toBe("0 pp");
    expect(formatDeltaPp(null)).toBe("—");
  });

  it("formats the change in the number of fronts", () => {
    expect(formatFrontsDelta(2)).toBe("+2 frentes");
    expect(formatFrontsDelta(1)).toBe("+1 frente");
    expect(formatFrontsDelta(-1)).toBe("−1 frente");
    expect(formatFrontsDelta(0)).toBe("mesmas frentes");
    expect(formatFrontsDelta(null)).toBe("");
  });
});
