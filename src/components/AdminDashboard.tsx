import type { CSSProperties } from "react";
import type { Lifecycle } from "@/lib/types";
import { getAllClients, getLatestSnapshot } from "@/lib/content";
import { formatPtDate, formatPtMonth, todayIso } from "@/lib/format";
import { adminProjectRow } from "@/lib/admin";
import { LIFECYCLE_LABELS, endMonth, orderedProjects } from "@/lib/lifecycle";
import { AdminGreeting } from "./AdminGreeting";

// Lifecycle badge for a project line; nothing for active projects.
function LifecycleNote({ lifecycle }: { lifecycle: Lifecycle }) {
  if (lifecycle.state === "active") return null;
  const month = endMonth(lifecycle);
  return (
    <span className={`admin-note ${lifecycle.state}`}>
      {LIFECYCLE_LABELS[lifecycle.state].toLowerCase()}
      {month && ` · ${formatPtMonth(month)}`}
    </span>
  );
}

// Internal cockpit (owner only, never linked from anywhere). Direct wording
// is fine here — this is not a client-facing page.
export function AdminDashboard() {
  const today = todayIso();
  const clients = getAllClients();

  return (
    <main className="wrap admin">
      <header className="report-head admin-head">
        <div className="kicker" translate="no">
          ITGraph · Painel interno
        </div>
        <AdminGreeting buildDateIso={today} />
        <p className="sub">
          Visão consolidada dos projetos. Um card por cliente, com a última
          atualização, o progresso e as pendências de cada projeto. Uso
          interno da equipe{" "}
          <b className="semibold" translate="no">
            ITGraph
          </b>
          .
        </p>
      </header>

      {clients.length === 0 && (
        <p className="sub">Nenhum cliente configurado ainda.</p>
      )}

      <div className="admin-grid">
        {clients.map((client) => (
          <a
            key={client.id}
            className="admin-card"
            href={`/r/${client.slug}`}
            style={{ "--brand": client.brandColor } as CSSProperties}
          >
            <div className="admin-card-head">
              <span className="admin-chip" aria-hidden="true" />
              <span className="admin-client" translate="no">
                {client.name}
              </span>
              <span className="admin-open">Abrir →</span>
            </div>
            <ul className="admin-projects">
              {orderedProjects(client.projects).map((project) => {
                const row = adminProjectRow(
                  project,
                  getLatestSnapshot(client.id, project.id),
                  today,
                );
                const { lifecycle, report } = row;
                return (
                  <li key={row.id}>
                    <span className="admin-project">{row.name}</span>
                    <span className="admin-meta">
                      {report ? (
                        <>
                          {formatPtDate(report.date)} · {report.percent}%
                        </>
                      ) : (
                        <span className="admin-note plan">sem relatório</span>
                      )}
                      <LifecycleNote lifecycle={lifecycle} />
                      {report && report.pendingCount > 0 && (
                        <span className="admin-note prog">
                          {report.pendingCount}{" "}
                          {report.pendingCount === 1 ? "pendência" : "pendências"}
                        </span>
                      )}
                      {report?.stale && (
                        <span className="admin-note stale">
                          parado há {report.idleDays} dias
                        </span>
                      )}
                    </span>
                    {lifecycle.state === "paused" && (
                      <span className="admin-reason">{lifecycle.reason}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </a>
        ))}
      </div>

      <p className="admin-foot">Dados do último deploy - {formatPtDate(today)}.</p>
    </main>
  );
}
