import { CircleCheckIcon, ClockIcon } from "lucide-react";
import type { Client } from "@/lib/types";
import { getProjectReports } from "@/lib/content";
import { archivedProjects, currentProjects } from "@/lib/lifecycle";
import { clientNav } from "@/lib/client-nav";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { StatusReport } from "./StatusReport";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { ClientShell } from "./ClientShell";
import { ContactCta } from "./ContactCta";

// Client page: one report per CURRENT project (active first, then paused),
// one at a time, picked in the sidebar through the URL hash. Delivered and
// closed projects live on /r/<slug>/anteriores, reachable from the sidebar
// whenever there is one. Reports are Server Components rendered here; the
// switcher island only toggles panels.
export function ProjectStack({ client }: { client: Client }) {
  const current = currentProjects(client.projects);
  const reports = getProjectReports(client.id, current);
  const { delivered, closed } = archivedProjects(client.projects);
  const archived = [...delivered, ...closed];
  const nav = clientNav(
    client,
    [...reports, ...getProjectReports(client.id, archived)],
    "current",
  );

  if (reports.length === 0) {
    const nothingRunning = current.length === 0;
    return (
      <ClientShell
        client={client}
        nav={nav}
        crumbs={[{ label: client.name }]}
        projects={[]}
        printable={false}
      >
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {nothingRunning ? <CircleCheckIcon /> : <ClockIcon />}
            </EmptyMedia>
            <EmptyTitle>
              <h1 className="text-balance">
                {nothingRunning
                  ? "Nenhum projeto em andamento agora"
                  : "Estamos preparando o seu relatório"}
              </h1>
            </EmptyTitle>
            <EmptyDescription>
              {nothingRunning
                ? "Os projetos que já terminaram, com o último relatório de cada um, continuam disponíveis em Projetos anteriores."
                : "O primeiro relatório de acompanhamento está sendo elaborado e aparecerá aqui em breve. Guarde este link."}
            </EmptyDescription>
          </EmptyHeader>
          {nav.archive && (
            <EmptyContent>
              <Button nativeButton={false} render={<a href={nav.archive.href} />}>
                Projetos anteriores · {archived.length}
              </Button>
            </EmptyContent>
          )}
        </Empty>
        <ContactCta client={client} variant="footer" />
      </ClientShell>
    );
  }

  return (
    <ClientShell
      client={client}
      nav={nav}
      crumbs={[{ label: client.name, href: `/r/${client.slug}` }]}
      projects={reports.map(({ project }) => ({ id: project.id, name: project.name }))}
      printable
    >
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
