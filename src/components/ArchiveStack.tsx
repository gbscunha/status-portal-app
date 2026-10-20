import type { Client, Project } from "@/lib/types";
import { getProjectReports } from "@/lib/content";
import { formatPtMonth } from "@/lib/format";
import {
  LIFECYCLE_LABELS,
  archivedProjects,
  endMonth,
  lifecycleOf,
} from "@/lib/lifecycle";
import { StatusReport } from "./StatusReport";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { ClientShell } from "./ClientShell";

// /r/<slug>/anteriores: delivered and closed projects, grouped, each with its
// end month and its last report. Same tabs as the main page (the index links
// set the hash the switcher already reads), so no new client island. A
// closed project is never labeled as delivered.
export function ArchiveStack({ client }: { client: Client }) {
  const { delivered, closed } = archivedProjects(client.projects);
  const reports = getProjectReports(client.id, [...delivered, ...closed]);
  // Index links only switch tabs, so they exist only when there are tabs.
  const linkable = new Set(
    reports.length > 1 ? reports.map((r) => r.project.id) : [],
  );

  const groups = [
    { title: "Concluídos", verb: "Entregue", projects: delivered },
    { title: "Encerrados", verb: "Encerrado", projects: closed },
  ].filter((group) => group.projects.length > 0);

  const ended = (project: Project) => {
    const month = endMonth(lifecycleOf(project));
    return month ? formatPtMonth(month) : "";
  };

  return (
    <ClientShell client={client} printable={reports.length > 0}>
      <div className="wrap client-head">
        <h1 className="client-name" translate="no">
          {client.name}
        </h1>
        <a className="archive-link" href={`/r/${client.slug}`}>
          <span aria-hidden="true">← </span>
          Voltar ao acompanhamento
        </a>
      </div>
      <section className="wrap archive-index" aria-labelledby="archive-title">
        <h2 id="archive-title" className="archive-title">
          Projetos anteriores
        </h2>
        <p className="sub">
          Projetos que já terminaram. O último relatório de cada um continua
          disponível aqui.
        </p>
        {groups.map((group) => (
          <div key={group.title} className="archive-group">
            <h3 className="block-title">{group.title}</h3>
            <ul>
              {group.projects.map((project) => (
                <li key={project.id}>
                  {linkable.has(project.id) ? (
                    <a href={`#${project.id}`}>{project.name}</a>
                  ) : (
                    <span>{project.name}</span>
                  )}
                  <span className="archive-when">
                    {group.verb} em {ended(project)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <ProjectSwitcher
        panels={reports.map(({ project, snapshot, history }) => ({
          id: project.id,
          name: project.name,
          note:
            lifecycleOf(project).state === "closed"
              ? { label: LIFECYCLE_LABELS.closed, state: "closed" }
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
