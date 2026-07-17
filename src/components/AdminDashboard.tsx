import type { CSSProperties } from "react";
import { getAllClients, getProjectSnapshots } from "@/lib/content";
import {
  daysBetween,
  formatPtDate,
  formatPtDateLong,
  todayIso,
} from "@/lib/format";
import { dailyPhrase } from "@/lib/greeting";
import { overallPercent } from "@/lib/summary";

const STALE_DAYS = 14;

function PhraseTitle({ text, highlight }: { text: string; highlight: string }) {
  const idx = text.indexOf(highlight);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="admin-accent">{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
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
        {/* Greeting must work at any hour (static page) — no "bom dia".
            The phrase rotates with the build date (src/lib/greeting.ts). */}
        <h1 className="report-title">
          <PhraseTitle {...dailyPhrase(today)} />
        </h1>
        <p className="admin-today">{formatPtDateLong(today)}</p>
        <p className="sub">
          Visão consolidada da operação: um card por cliente, com a última
          atualização, o progresso e as pendências de cada projeto. Uso
          interno da equipe ITGraph — este link não sai daqui.
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
              {client.projects.map((project) => {
                const latest = getProjectSnapshots(client.id, project.id)[0];
                if (!latest) {
                  return (
                    <li key={project.id}>
                      <span className="admin-project">{project.name}</span>
                      <span className="admin-note plan">sem relatório</span>
                    </li>
                  );
                }
                const idleDays = daysBetween(latest.date, today);
                const pendingCount = latest.pending?.length ?? 0;
                return (
                  <li key={project.id}>
                    <span className="admin-project">{project.name}</span>
                    <span className="admin-meta">
                      {formatPtDate(latest.date)} · {overallPercent(latest)}%
                      {pendingCount > 0 && (
                        <span className="admin-note prog">
                          {pendingCount}{" "}
                          {pendingCount === 1 ? "pendência" : "pendências"}
                        </span>
                      )}
                      {idleDays > STALE_DAYS && (
                        <span className="admin-note stale">
                          parado há {idleDays} dias
                        </span>
                      )}
                    </span>
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
