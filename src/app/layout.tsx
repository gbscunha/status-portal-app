import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// Single-family system: Archivo variable (wdth axis) covers display
// (expanded), body and the small uppercase labels.
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
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
    <html lang="pt-BR" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
