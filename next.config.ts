import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz neste diretório: há um pnpm-lock.yaml em ~/dev que faria o
  // Next inferir a raiz do workspace errada.
  turbopack: { root: import.meta.dirname },
  // Camada extra de anti-indexação: header HTTP em toda resposta, além do
  // <meta robots> por página e do robots.txt.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
