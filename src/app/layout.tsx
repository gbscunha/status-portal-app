import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Título genérico de propósito: nenhuma página deve revelar o cliente
// fora da URL secreta. O noindex por página fica em generateMetadata.
export const metadata: Metadata = {
  title: "Status do Projeto",
  description: "Acompanhamento de projeto.",
  robots: { index: false, follow: false },
};

// Matches --bg in globals.css (mobile browser chrome color).
export const viewport: Viewport = {
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bricolage.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
