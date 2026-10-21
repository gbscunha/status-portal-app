import { ArchiveIcon } from "lucide-react";
import type { Client, Project } from "@/lib/types";
import { getProjectReports } from "@/lib/content";
import { formatPtMonth } from "@/lib/format";
import {
  archivedProjects,
  currentProjects,
  endMonth,
  lifecycleOf,
} from "@/lib/lifecycle";
import { clientNav } from "@/lib/client-nav";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { StatusReport } from "./StatusReport";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { ClientShell } from "./ClientShell";

// /r/<slug>/anteriores: delivered and closed projects, each with its last
// report, one at a time through the same hash panels as the main page (the
// sidebar groups them and the header badge carries the end month). A closed
// project is never labeled as delivered.
export function ArchiveStack({ client }: { client: Client }) {
  const { delivered, closed } = archivedProjects(client.projects);
  const archived = [...delivered, ...closed];
  const reports = getProjectReports(client.id, archived);
  const nav = clientNav(
    client,
    [...getProjectReports(client.id, currentProjects(client.projects)), ...reports],
    "archive",
  );
  const crumbs = [
    { label: client.name, href: `/r/${client.slug}` },
    { label: "Projetos anteriores", href: `/r/${client.slug}/anteriores` },
  ];

  // Archived projects with no report at all: list them with their end month
  // instead of an empty panel.
  if (reports.length === 0) {
    const ended = (project: Project) => {
      const month = endMonth(lifecycleOf(project));
      const verb = lifecycleOf(project).state === "delivered" ? "Entregue" : "Encerrado";
      return month ? `${verb} em ${formatPtMonth(month)}` : verb;
    };
    return (
      <ClientShell client={client} nav={nav} crumbs={crumbs} projects={[]} printable={false}>
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ArchiveIcon />
            </EmptyMedia>
            <EmptyTitle>
              <h1>Projetos anteriores</h1>
            </EmptyTitle>
            <EmptyDescription>Projetos que já terminaram.</EmptyDescription>
          </EmptyHeader>
          <ul className="flex flex-col gap-1 text-sm">
            {archived.map((project) => (
              <li key={project.id}>
                <span className="font-medium">{project.name}</span>
                <span className="text-muted-foreground"> · {ended(project)}</span>
              </li>
            ))}
          </ul>
        </Empty>
      </ClientShell>
    );
  }

  return (
    <ClientShell
      client={client}
      nav={nav}
      crumbs={crumbs}
      projects={reports.map(({ project }) => ({ id: project.id, name: project.name }))}
      printable
    >
      <p className="max-w-prose text-sm text-pretty text-muted-foreground">
        Projetos que já terminaram. O último relatório de cada um continua
        disponível aqui.
      </p>
      <ProjectSwitcher
        panels={reports.map(({ project, snapshot, history }) => ({
          id: project.id,
          content: (
            <StatusReport
              client={client}
              project={project}
              snapshot={snapshot}
              history={history}
            />
          ),
        }))}
      />
    </ClientShell>
  );
}
