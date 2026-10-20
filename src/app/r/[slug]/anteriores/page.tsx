import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllClients, getClientBySlug } from "@/lib/content";
import { archiveSlugs, isArchived } from "@/lib/lifecycle";
import { ArchiveStack } from "@/components/ArchiveStack";

// Exists only for clients with at least one delivered or closed project; any
// other slug is a 404 (anti-fishing, like /r/[slug]). The link to this page
// only shows up when the page exists.
export const dynamicParams = false;

// Params generated bottom-up: this segment fills in the parent's [slug].
export function generateStaticParams() {
  return archiveSlugs(getAllClients()).map((slug) => ({ slug }));
}

// Same generic metadata as the client page: no OpenGraph, a title that never
// reveals the client, explicit noindex.
export const metadata: Metadata = {
  title: "Status do Projeto",
  robots: { index: false, follow: false },
};

export default async function ClientArchivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client || !client.projects.some(isArchived)) notFound();

  return <ArchiveStack client={client} />;
}
