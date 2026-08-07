import { describe, expect, it } from "vitest";
import { adminSchema, clientSchema, snapshotSchema } from "./types";

const baseClient = {
  id: "acme",
  name: "Acme",
  slug: "acme-abc1234",
  brandColor: "#112233",
  projects: [{ id: "p1", name: "Projeto 1" }],
};

const baseSnapshot = {
  date: "2026-07-16",
  title: { text: "Tudo certo" },
  progress: [],
  sections: [],
};

describe("clientSchema contact channels", () => {
  it("accepts a client with valid whatsapp and email", () => {
    const parsed = clientSchema.safeParse({
      ...baseClient,
      whatsapp: "+5511999999999",
      email: "contato@itgraph.com.br",
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts a client without contact channels (backward compatible)", () => {
    expect(clientSchema.safeParse(baseClient).success).toBe(true);
  });

  it("rejects whatsapp not in E.164 format", () => {
    for (const bad of ["11999999999", "+0123", "wa.me/5511999999999"]) {
      const parsed = clientSchema.safeParse({ ...baseClient, whatsapp: bad });
      expect(parsed.success).toBe(false);
    }
  });

  it("rejects an invalid email", () => {
    const parsed = clientSchema.safeParse({ ...baseClient, email: "nope" });
    expect(parsed.success).toBe(false);
  });
});

describe("snapshotSchema pending items", () => {
  it("accepts a snapshot without pending (backward compatible)", () => {
    expect(snapshotSchema.safeParse(baseSnapshot).success).toBe(true);
  });

  it("accepts a snapshot with valid pending items", () => {
    const parsed = snapshotSchema.safeParse({
      ...baseSnapshot,
      pending: [
        { label: "Aprovar layout", desc: "Layout da tela inicial" },
        { label: "Enviar logo", desc: "Arquivo em alta", since: "2026-07-10" },
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects pending items with malformed since date", () => {
    const parsed = snapshotSchema.safeParse({
      ...baseSnapshot,
      pending: [{ label: "x", desc: "y", since: "10/07/2026" }],
    });
    expect(parsed.success).toBe(false);
  });
});

describe("isoDateSchema", () => {
  it("rejects well-formed dates that do not exist in the calendar", () => {
    for (const bad of [
      "2026-13-45",
      "2026-02-30",
      "2026-02-29", // 2026 is not a leap year
      "2026-00-10",
      "2026-04-31", // April has 30 days
    ]) {
      const parsed = snapshotSchema.safeParse({ ...baseSnapshot, date: bad });
      expect(parsed.success).toBe(false);
    }
  });

  it("accepts a real leap day", () => {
    const parsed = snapshotSchema.safeParse({
      ...baseSnapshot,
      date: "2024-02-29",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a pending since date that does not exist", () => {
    const parsed = snapshotSchema.safeParse({
      ...baseSnapshot,
      pending: [{ label: "x", desc: "y", since: "2026-11-31" }],
    });
    expect(parsed.success).toBe(false);
  });
});

describe("scopeSchema", () => {
  const baseScope = {
    baseline: "2026-07-22",
    items: [
      { id: "notas", label: "Notas fiscais", desc: "Envio e aprovação." },
      { id: "vagas", label: "Vagas", desc: "Grade de horários." },
    ],
  };

  const withScope = (scope: unknown) => ({
    ...baseClient,
    projects: [{ id: "p1", name: "Projeto 1", scope }],
  });

  it("accepts a project without scope (backward compatible)", () => {
    expect(clientSchema.safeParse(baseClient).success).toBe(true);
  });

  it("accepts a project with a valid scope", () => {
    expect(clientSchema.safeParse(withScope(baseScope)).success).toBe(true);
  });

  it("accepts optional group, addedAt and removedAt on an item", () => {
    const parsed = clientSchema.safeParse(
      withScope({
        ...baseScope,
        items: [
          {
            id: "novo",
            label: "Item novo",
            desc: "Entrou depois.",
            group: "Operação",
            addedAt: "2026-08-01",
            removedAt: "2026-08-20",
          },
        ],
      }),
    );
    expect(parsed.success).toBe(true);
  });

  it("rejects duplicate item ids", () => {
    const parsed = clientSchema.safeParse(
      withScope({
        ...baseScope,
        items: [
          { id: "notas", label: "Notas fiscais", desc: "a" },
          { id: "notas", label: "Outra coisa", desc: "b" },
        ],
      }),
    );
    expect(parsed.success).toBe(false);
  });

  it("rejects scope dates that do not exist", () => {
    expect(
      clientSchema.safeParse(withScope({ ...baseScope, baseline: "2026-02-30" }))
        .success,
    ).toBe(false);
    expect(
      clientSchema.safeParse(
        withScope({
          ...baseScope,
          items: [
            { id: "x", label: "X", desc: "d", addedAt: "2026-13-01" },
          ],
        }),
      ).success,
    ).toBe(false);
  });

  it("rejects an item with an empty id", () => {
    const parsed = clientSchema.safeParse(
      withScope({ ...baseScope, items: [{ id: "", label: "X", desc: "d" }] }),
    );
    expect(parsed.success).toBe(false);
  });
});

describe("progressItemSchema eta", () => {
  const bar = { label: "Notas fiscais", percent: 90, state: "done" };

  it("accepts a progress item without eta (backward compatible)", () => {
    const parsed = snapshotSchema.safeParse({
      ...baseSnapshot,
      progress: [bar],
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts a YYYY-MM estimate", () => {
    for (const good of ["2026-01", "2026-09", "2026-12"]) {
      const parsed = snapshotSchema.safeParse({
        ...baseSnapshot,
        progress: [{ ...bar, eta: good }],
      });
      expect(parsed.success).toBe(true);
    }
  });

  it("rejects anything that is not a real YYYY-MM month", () => {
    for (const bad of ["2026-13", "2026-00", "2026-1", "2026-09-01", "set/2026"]) {
      const parsed = snapshotSchema.safeParse({
        ...baseSnapshot,
        progress: [{ ...bar, eta: bad }],
      });
      expect(parsed.success).toBe(false);
    }
  });
});

describe("progressItemSchema scopeId", () => {
  it("accepts a progress item without scopeId (backward compatible)", () => {
    const parsed = snapshotSchema.safeParse({
      ...baseSnapshot,
      progress: [{ label: "Notas fiscais", percent: 90, state: "done" }],
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts a progress item linked to a scope item", () => {
    const parsed = snapshotSchema.safeParse({
      ...baseSnapshot,
      progress: [
        { label: "Notas fiscais", percent: 90, state: "done", scopeId: "notas" },
      ],
    });
    expect(parsed.success).toBe(true);
  });
});

describe("adminSchema", () => {
  it("accepts a valid admin config", () => {
    expect(adminSchema.safeParse({ slug: "admin-abc1234" }).success).toBe(true);
  });

  it("rejects an empty slug", () => {
    expect(adminSchema.safeParse({ slug: "" }).success).toBe(false);
  });
});
