import type { MetadataRoute } from "next";

// Bloqueia toda a indexação: o portal é privado por link, não deve aparecer
// em buscadores.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
