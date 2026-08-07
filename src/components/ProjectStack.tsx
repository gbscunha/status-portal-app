import type { CSSProperties } from "react";
import type { Client } from "@/lib/types";
import { getProjectSnapshots } from "@/lib/content";
import { StatusReport } from "./StatusReport";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { ContactCta } from "./ContactCta";
import { PrintButton } from "./PrintButton";

// Page shell for a client: mast (vendor + contact) → client name (the only
// h1) → one report per project behind the ProjectSwitcher tabs. Reports are
// Server Components rendered here; the switcher island only toggles panels.
export function ProjectStack({ client }: { client: Client }) {
  const reports = client.projects
    .map((project) => {
      const snapshots = getProjectSnapshots(client.id, project.id);
      const latest = snapshots[0];
      if (!latest) return null;
      return {
        project,
        snapshot: latest,
        history: snapshots.map((s) => ({
          date: s.date,
          title: s.milestone ?? s.subtitle ?? s.title.text,
        })),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const brandStyle = { "--brand": client.brandColor } as CSSProperties;

  if (reports.length === 0) {
    return (
      <main className="client" style={brandStyle}>
        <header className="mast">
          <div className="wrap mast-row">
            <span className="mast-vendor" translate="no">
              {client.vendor} · Portal de acompanhamento
            </span>
            <ContactCta client={client} variant="compact" />
          </div>
        </header>
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
      </main>
    );
  }

  return (
    <main className="client" style={brandStyle}>
      <header className="mast">
        <div className="wrap mast-row">
          <span className="mast-vendor" translate="no">
            {client.vendor} · Portal de acompanhamento
          </span>
          <div className="mast-actions">
            <PrintButton />
            <ContactCta client={client} variant="compact" />
          </div>
        </div>
      </header>
      <div className="wrap client-head">
        <h1 className="client-name" translate="no">
          {client.name}
        </h1>
      </div>
      <ProjectSwitcher
        tabs={reports.map(({ project }) => ({
          id: project.id,
          name: project.name,
        }))}
      >
        {reports.map(({ project, snapshot, history }) => (
          <StatusReport
            key={project.id}
            client={client}
            project={project}
            snapshot={snapshot}
            history={history}
          />
        ))}
      </ProjectSwitcher>
    </main>
  );
}
