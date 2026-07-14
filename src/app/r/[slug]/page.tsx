import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getClientBySlug } from "@/lib/content";
import { ProjectStack } from "@/components/ProjectStack";

// Só os slugs gerados existem; qualquer outro dá 404 (anti-fishing).
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// Metadata genérica de propósito + noindex explícito. Nada de OpenGraph rico:
// o unfurl do link (WhatsApp/Slack) não deve revelar o nome do cliente.
export const metadata: Metadata = {
  title: "Status do Projeto",
  robots: { index: false, follow: false },
};

export default async function ClientReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) notFound();

  return <ProjectStack client={client} />;
}
