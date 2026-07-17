import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminSlug } from "@/lib/content";
import { AdminDashboard } from "@/components/AdminDashboard";

// Cockpit interno do dono. Mesma segurança das páginas de cliente: só o slug
// de content/admin.json existe (404 para o resto) e nada linka para cá.
export const dynamicParams = false;

export function generateStaticParams() {
  const slug = getAdminSlug();
  return slug ? [{ slug }] : [];
}

// Título genérico de propósito — metadata nunca revela clientes.
export const metadata: Metadata = {
  title: "Painel interno",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== getAdminSlug()) notFound();

  return <AdminDashboard />;
}
