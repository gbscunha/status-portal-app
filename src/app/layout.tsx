import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// v2 type voices: Archivo variable (wdth axis — expanded display, normal
// body) and IBM Plex Mono for data/labels ("technical document" register).
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

// Título genérico de propósito: nenhuma página deve revelar o cliente
// fora da URL secreta. O noindex por página fica em generateMetadata.
export const metadata: Metadata = {
  title: "Status do Projeto",
  description: "Acompanhamento de projeto.",
  robots: { index: false, follow: false },
};

// Matches --wash in globals.css (mobile browser chrome color).
export const viewport: Viewport = {
  themeColor: "#f4f5f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
