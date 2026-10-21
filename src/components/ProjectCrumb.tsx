"use client";

import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useLocationHash } from "@/hooks/use-location-hash";
import { activePanel } from "@/lib/client-nav";

// Last item of the client pages' trail: the project the hash shows.
export function ProjectCrumb({
  projects,
}: {
  projects: { id: string; name: string }[];
}) {
  const id = activePanel(
    projects.map((project) => project.id),
    useLocationHash(),
  );
  const project = projects.find((p) => p.id === id);
  if (!project) return null;

  return (
    <BreadcrumbItem>
      <BreadcrumbPage translate="no">{project.name}</BreadcrumbPage>
    </BreadcrumbItem>
  );
}
