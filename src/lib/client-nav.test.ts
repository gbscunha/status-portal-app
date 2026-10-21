import { describe, expect, it } from "vitest";
import { activePanel, clientNav, clientSignal } from "./client-nav";
import type { Client, Lifecycle, Project, Snapshot } from "./types";

function project(id: string, lifecycle?: Lifecycle): Project {
  return { id, name: `Projeto ${id}`, ...(lifecycle && { lifecycle }) };
}

function client(projects: Project[]): Client {
  return {
    id: "c1",
    name: "Cliente",
    slug: "cliente-slug",
    brandColor: "#123456",
    vendor: "ITGraph",
    projects,
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

const pending = { pending: [{ label: "x", desc: "y" }] };
const paused: Lifecycle = { state: "paused", reason: "Aguardando testes" };
const delivered: Lifecycle = { state: "delivered", deliveredAt: "2026-09" };
const closed: Lifecycle = { state: "closed", closedAt: "2026-08" };

const report = (p: Project, s: Snapshot = snapshot()) => ({ project: p, snapshot: s });

describe("clientSignal", () => {
  it("is active for a running project with nothing pending", () => {
    expect(clientSignal(project("a"), snapshot())).toBe("active");
  });

  it("is pending when the client owes something", () => {
    expect(clientSignal(project("a"), snapshot(pending))).toBe("pending");
  });

  it("puts the client's pending action ahead of the pause", () => {
    expect(clientSignal(project("a", paused), snapshot(pending))).toBe("pending");
  });

  it("is paused for a paused project with nothing pending", () => {
    expect(clientSignal(project("a", paused), snapshot())).toBe("paused");
  });

  it("keeps the end state of finished projects, even with old asks", () => {
    expect(clientSignal(project("a", delivered), snapshot(pending))).toBe("delivered");
    expect(clientSignal(project("a", closed), snapshot(pending))).toBe("closed");
  });

  it("never reports the admin-only stale state", () => {
    expect(clientSignal(project("a"), snapshot({ date: "2020-01-01" }))).toBe("active");
  });
});

describe("clientNav", () => {
  const running = project("run");
  const waiting = project("wait", paused);
  const done = project("done", delivered);
  const unpublished = project("draft");
  // Config order on purpose: paused first, so the active-first rule shows.
  const c = client([waiting, running, done, unpublished]);
  const reports = [report(waiting), report(running), report(done)];

  it("links current projects locally on the main page, active before paused", () => {
    const nav = clientNav(c, reports, "current");
    expect(nav.projects).toEqual([
      { id: "run", name: "Projeto run", signal: "active", href: "#run", local: true },
      { id: "wait", name: "Projeto wait", signal: "paused", href: "#wait", local: true },
    ]);
  });

  it("points archived projects to the archive page from the main page", () => {
    const nav = clientNav(c, reports, "current");
    expect(nav.archive).toEqual({
      href: "/r/cliente-slug/anteriores",
      here: false,
      items: [
        {
          id: "done",
          name: "Projeto done",
          signal: "delivered",
          href: "/r/cliente-slug/anteriores#done",
          local: false,
        },
      ],
    });
  });

  it("signals the client's pending action without reordering the group", () => {
    const nav = clientNav(
      c,
      [report(waiting, snapshot(pending)), report(running), report(done)],
      "current",
    );
    expect(nav.projects.map((item) => [item.id, item.signal])).toEqual([
      ["run", "active"],
      ["wait", "pending"],
    ]);
  });

  it("flips which group is local on the archive page", () => {
    const nav = clientNav(c, reports, "archive");
    expect(nav.archive?.href).toBe("/r/cliente-slug/anteriores");
    expect(nav.archive?.here).toBe(true);
    expect(nav.projects.map((item) => [item.href, item.local])).toEqual([
      ["/r/cliente-slug#run", false],
      ["/r/cliente-slug#wait", false],
    ]);
    expect(nav.archive?.items.map((item) => [item.href, item.local])).toEqual([
      ["#done", true],
    ]);
  });

  it("leaves out projects without a report", () => {
    const nav = clientNav(c, reports, "current");
    expect(nav.projects.map((item) => item.id)).not.toContain("draft");
  });

  it("has no archive group when nothing is archived", () => {
    const only = client([running]);
    expect(clientNav(only, [report(running)], "current").archive).toBeNull();
  });

  it("keeps the archive link when archived projects have no report", () => {
    const nav = clientNav(c, [report(waiting), report(running)], "current");
    expect(nav.archive).toEqual({
      href: "/r/cliente-slug/anteriores",
      here: false,
      items: [],
    });
  });

  it("lists delivered projects (newest first) before closed ones", () => {
    const older = project("older", { state: "delivered", deliveredAt: "2026-05" });
    const stopped = project("stopped", closed);
    const all = client([older, stopped, done]);
    const reports = [report(older), report(stopped), report(done)];
    const nav = clientNav(all, reports, "archive");
    expect(nav.archive?.items.map((item) => item.id)).toEqual([
      "done",
      "older",
      "stopped",
    ]);
  });
});

describe("activePanel", () => {
  const ids = ["ct", "creci", "prepona"];

  it("picks the panel named by the hash", () => {
    expect(activePanel(ids, "prepona")).toBe("prepona");
  });

  it("accepts the hash with or without the leading #", () => {
    expect(activePanel(ids, "#creci")).toBe("creci");
  });

  it("falls back to the first panel for an empty or unknown hash", () => {
    expect(activePanel(ids, "")).toBe("ct");
    expect(activePanel(ids, "cliente-x")).toBe("ct");
  });

  it("has no active panel when there are no panels", () => {
    expect(activePanel([], "ct")).toBeUndefined();
  });
});
