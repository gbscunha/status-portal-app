import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./tailwind.css";

// The only stylesheet of the app (shadcn/ui theme, DECISOES §19 and §20): no
// other file imports CSS. Inter is the single family; its variable sits on
// <html>, where tailwind.css resolves --font-sans, so the portaled mobile
// drawer inherits it too.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Título genérico de propósito: nenhuma página deve revelar o cliente
// fora da URL secreta. O noindex por página fica em generateMetadata.
export const metadata: Metadata = {
  title: "Status do Projeto",
  description: "Visão consolidada dos projetos da ITGraph",
  robots: { index: false, follow: false },
};

// Mobile browser chrome matches the page background.
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
