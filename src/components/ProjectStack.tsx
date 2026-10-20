import type { Client } from "@/lib/types";
import { getProjectReports } from "@/lib/content";
import { StatusReport } from "./StatusReport";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { ClientShell } from "./ClientShell";
import { ContactCta } from "./ContactCta";

// Client page: shell (brand + mast) → client name (the only h1) → one report
// per project behind the ProjectSwitcher tabs. Reports are Server Components
// rendered here; the switcher island only toggles panels.
export function ProjectStack({ client }: { client: Client }) {
  const reports = getProjectReports(client.id, client.projects);

  if (reports.length === 0) {
    return (
      <ClientShell client={client} printable={false}>
        <div className="wrap">
          <header className="report-head empty-head">
            <div className="kicker" translate="no">
              {client.name}
            </div>
            <h1 className="report-title">
              Estamos preparando o seu{" "}
              <span className="accent">relatório</span>
            </h1>
            <p className="sub">
              O primeiro relatório de acompanhamento está sendo elaborado e
              aparecerá aqui em breve. Guarde este link.
            </p>
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
      </div>
      <ProjectSwitcher
        panels={reports.map(({ project, snapshot, history }) => ({
          id: project.id,
          name: project.name,
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
