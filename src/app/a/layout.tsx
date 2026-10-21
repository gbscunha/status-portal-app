import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "../tailwind.css";

// The admin runs on shadcn/ui (default theme + Inter); client pages keep the
// v2 stylesheet until their own migration (DECISOES §19). The root layout
// loads no CSS, so the two never meet on one page.
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* On :root, not on a wrapper: the mobile Sheet is portaled to <body>. */}
      <style href="admin-font" precedence="default">
        {`:root{--font-sans:${inter.style.fontFamily}}`}
      </style>
      {children}
    </>
  );
}
