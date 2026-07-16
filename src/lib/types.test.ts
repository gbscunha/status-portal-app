import { describe, expect, it } from "vitest";
import { clientSchema, snapshotSchema } from "./types";

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
