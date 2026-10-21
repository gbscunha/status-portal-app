import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminSlug, getAllClients } from "@/lib/content";
import { adminProjectParams, findAdminProject } from "@/lib/admin";
import { AdminProjectView } from "@/components/AdminProjectView";

// One page per project of the owner's cockpit. Same security as /a/[slug]:
// only the generated slug/client/project triples exist, anything else is a
// 404 (a swapped client/project pair included), and nothing links here from
// outside the admin.
export const dynamicParams = false;

// Params generated bottom-up: this leaf fills in [slug], [clientId] and
// [projectId], like r/[slug]/anteriores.
export function generateStaticParams() {
  return adminProjectParams(getAdminSlug(), getAllClients());
}

// Generic on purpose — metadata never reveals clients or projects.
export const metadata: Metadata = {
  title: "Painel interno",
  robots: { index: false, follow: false },
};

export default async function AdminProjectPage({
  params,
}: {
  params: Promise<{ slug: string; clientId: string; projectId: string }>;
}) {
  const { slug, clientId, projectId } = await params;
  if (slug !== getAdminSlug()) notFound();
  const found = findAdminProject(getAllClients(), clientId, projectId);
  if (!found) notFound();

  return (
    <AdminProjectView
      adminSlug={slug}
      client={found.client}
      project={found.project}
    />
  );
}
