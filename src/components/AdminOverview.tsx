import { getAllClients, getLatestSnapshot } from "@/lib/content";
import { todayIso } from "@/lib/format";
import {
  STALE_DAYS,
  attentionList,
  groupByClient,
  portfolioRows,
  portfolioStats,
} from "@/lib/admin";
import { AdminAttention } from "./AdminAttention";
import { AdminGreeting } from "./AdminGreeting";
import { AdminKpis } from "./AdminKpis";
import { AdminPortfolio } from "./AdminPortfolio";
import { AdminShell } from "./AdminShell";

// Owner's cockpit, /a/<slug> (never linked from anywhere). Direct wording is
// fine here — this is not a client-facing page.
export function AdminOverview({ adminSlug }: { adminSlug: string }) {
  const today = todayIso();
  const clients = getAllClients();
  const rows = portfolioRows(clients, getLatestSnapshot, today);
  const groups = groupByClient(rows);
  const stats = portfolioStats(rows);
  const attention = attentionList(rows);
  const firstPendingOf = Object.fromEntries(
    attention.map(({ row }) => [
      `${row.clientId}/${row.id}`,
      getLatestSnapshot(row.clientId, row.id)?.pending?.[0]?.label,
    ]),
  );

  return (
    <AdminShell
      adminSlug={adminSlug}
      groups={groups}
      current={{ kind: "overview" }}
      crumbs={[{ label: "Painel" }]}
      buildDate={today}
    >
      <header>
        <AdminGreeting buildDateIso={today} />
      </header>

      {clients.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum cliente configurado ainda.
        </p>
      ) : (
        <>
          <AdminKpis
            items={[
              { label: "Em andamento", value: stats.active },
              {
                label: "Pendências do cliente",
                value: stats.pendingTotal,
                unit: `em ${stats.pendingProjects} ${stats.pendingProjects === 1 ? "projeto" : "projetos"}`,
                alert: stats.pendingTotal > 0,
              },
              {
                label: `Parados há mais de ${STALE_DAYS} dias`,
                value: stats.stale,
                alert: stats.stale > 0,
              },
              { label: "Em espera", value: stats.paused },
            ]}
          />
          <AdminAttention
            adminSlug={adminSlug}
            items={attention}
            firstPendingOf={firstPendingOf}
          />
          <AdminPortfolio adminSlug={adminSlug} groups={groups} today={today} />
        </>
      )}
    </AdminShell>
  );
}
