import type { Client } from "@/lib/types";
import { getProjectReports } from "@/lib/content";
import {
  LIFECYCLE_LABELS,
  archivedProjects,
  currentProjects,
  lifecycleOf,
} from "@/lib/lifecycle";
import { StatusReport } from "./StatusReport";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { ClientShell } from "./ClientShell";
import { ContactCta } from "./ContactCta";

// Client page: shell (brand + mast) → client name (the only h1) → one report
// per CURRENT project behind the ProjectSwitcher tabs (active first, then
// paused). Delivered and closed projects live on /r/<slug>/anteriores, linked
// only when there is at least one. Reports are Server Components rendered
// here; the switcher island only toggles panels.
export function ProjectStack({ client }: { client: Client }) {
  const current = currentProjects(client.projects);
  const reports = getProjectReports(client.id, current);
  const { delivered, closed } = archivedProjects(client.projects);
  const archivedCount = delivered.length + closed.length;

  const archiveLink = archivedCount > 0 && (
    <a className="archive-link" href={`/r/${client.slug}/anteriores`}>
      Projetos anteriores · {archivedCount}
      <span aria-hidden="true"> →</span>
    </a>
  );

  if (reports.length === 0) {
    const nothingRunning = current.length === 0;
    return (
      <ClientShell client={client} printable={false}>
        <div className="wrap">
          <header className="report-head empty-head">
            <div className="kicker" translate="no">
              {client.name}
            </div>
            {nothingRunning ? (
              <>
                <h1 className="report-title">
                  Nenhum projeto <span className="accent">em andamento</span>{" "}
                  agora
                </h1>
                <p className="sub">
                  Os projetos que já terminaram, com o último relatório de cada
                  um, continuam disponíveis em Projetos anteriores.
                </p>
              </>
            ) : (
              <>
                <h1 className="report-title">
                  Estamos preparando o seu{" "}
                  <span className="accent">relatório</span>
                </h1>
                <p className="sub">
                  O primeiro relatório de acompanhamento está sendo elaborado e
                  aparecerá aqui em breve. Guarde este link.
                </p>
              </>
            )}
            {archiveLink}
          </header>
          <ContactCta client={client} variant="footer" />
        </div>
      </ClientShell>
    );
  }

  return (
    <ClientShell client={client} printable>
      <div className="wrap client-head">
        <h1 className="client-name" translate="no">
          {client.name}
        </h1>
        {archiveLink}
      </div>
      <ProjectSwitcher
        panels={reports.map(({ project, snapshot, history }) => ({
          id: project.id,
          name: project.name,
          note:
            lifecycleOf(project).state === "paused"
              ? { label: LIFECYCLE_LABELS.paused, state: "paused" }
              : undefined,
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
