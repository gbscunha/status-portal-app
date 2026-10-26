import { getAllClients, getLatestSnapshot } from "@/lib/content";
import { todayIso } from "@/lib/format";
import {
  STALE_DAYS,
  attentionList,
  groupByClient,
  oldestPending,
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
  const rows = portfolioRows(getAllClients(), getLatestSnapshot, today);
  const groups = groupByClient(rows);
  const stats = portfolioStats(rows);
  const attention = attentionList(rows);
  // The pending item that waited longest, so the list shows the worst case.
  const oldestPendingOf = Object.fromEntries(
    attention.map(({ row }) => [
      `${row.clientId}/${row.id}`,
      oldestPending(getLatestSnapshot(row.clientId, row.id)?.pending ?? []),
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

      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum cliente no ar.
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
            oldestPendingOf={oldestPendingOf}
            today={today}
          />
          <AdminPortfolio adminSlug={adminSlug} groups={groups} today={today} />
        </>
      )}
    </AdminShell>
  );
}
