import type { CSSProperties } from "react";
import { FileClockIcon } from "lucide-react";
import type { Client, Project } from "@/lib/types";
import {
  getAllClients,
  getLatestSnapshot,
  getProjectSnapshots,
} from "@/lib/content";
import { formatPtDate, todayIso } from "@/lib/format";
import { isArchived, isOnline, lifecycleOf } from "@/lib/lifecycle";
import {
  STALE_DAYS,
  clientPageHref,
  formatDeltaPp,
  formatFrontsDelta,
  groupByClient,
  portfolioRows,
  projectSummary,
} from "@/lib/admin";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AdminFronts } from "./AdminFronts";
import { AdminHistory } from "./AdminHistory";
import { AdminKpis } from "./AdminKpis";
import { AdminNextSteps } from "./AdminNextSteps";
import { AdminPending } from "./AdminPending";
import { AdminProjectFacts } from "./AdminProjectFacts";
import { AdminProjectHero } from "./AdminProjectHero";
import { AdminShell } from "./AdminShell";

// /a/<slug>/<client>/<project>: one project in detail, from its snapshots.
export function AdminProjectView({
  adminSlug,
  client,
  project,
}: {
  adminSlug: string;
  client: Client;
  project: Project;
}) {
  const today = todayIso();
  const groups = groupByClient(
    portfolioRows(getAllClients(), getLatestSnapshot, today),
  );
  const lifecycle = lifecycleOf(project);
  const summary = projectSummary(
    project,
    getProjectSnapshots(client.id, project.id),
    today,
  );
  const finished = isArchived(project);

  return (
    <AdminShell
      adminSlug={adminSlug}
      groups={groups}
      current={{ kind: "project", clientId: client.id, projectId: project.id }}
      crumbs={[
        { label: "Painel", href: `/a/${adminSlug}` },
        { label: client.name, href: `/a/${adminSlug}#cliente-${client.id}` },
        { label: project.name },
      ]}
      action={
        isOnline(client)
          ? {
              href: clientPageHref(client.slug, project, summary !== null),
              label: "Página do cliente",
            }
          : undefined
      }
      buildDate={today}
    >
      <div
        className="flex flex-col gap-6"
        style={{ "--brand": client.brandColor } as CSSProperties}
      >
        <AdminProjectHero
          project={project}
          lifecycle={lifecycle}
          summary={summary}
          today={today}
          clientOnline={isOnline(client)}
        />

        {summary ? (
          <>
            <AdminKpis
              items={[
                {
                  label: "Frentes concluídas",
                  value: summary.fronts.done,
                  unit: `de ${summary.fronts.total}`,
                },
                finished
                  ? { label: "Pendências (projeto finalizado)", value: "—" }
                  : {
                      label: "Aguardando o cliente",
                      value: summary.pendingCount,
                      alert: summary.pendingCount > 0,
                    },
                {
                  label: "Desde o último relatório",
                  value: summary.idleDays === 0 ? "hoje" : summary.idleDays,
                  unit:
                    summary.idleDays === 0
                      ? undefined
                      : summary.idleDays === 1
                        ? "dia"
                        : "dias",
                  note: formatPtDate(summary.lastReport),
                  alert: !finished && summary.idleDays > STALE_DAYS,
                },
                {
                  label: "Avanço",
                  value: formatDeltaPp(summary.delta),
                  unit: formatFrontsDelta(summary.frontsDelta) || undefined,
                  note: summary.previousDate
                    ? `desde ${formatPtDate(summary.previousDate)}`
                    : summary.latest.progress.length === 0
                      ? "relatório atual sem frentes"
                      : summary.history.length > 1
                        ? "relatório anterior sem frentes para comparar"
                        : "primeiro relatório",
                },
              ]}
            />

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
              <div className="flex min-w-0 flex-col gap-6">
                <AdminFronts
                  items={summary.latest.progress}
                  done={summary.fronts.done}
                />
                {!finished && (
                  <AdminPending
                    pending={summary.latest.pending ?? []}
                    today={today}
                  />
                )}
                {!finished && summary.latest.nextSteps?.items.length ? (
                  <AdminNextSteps nextSteps={summary.latest.nextSteps} />
                ) : null}
                <AdminHistory history={summary.history} />
              </div>
              <div className="flex flex-col gap-6 xl:sticky xl:top-20">
                <AdminProjectFacts
                  client={client}
                  project={project}
                  lifecycle={lifecycle}
                  summary={summary}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileClockIcon />
                </EmptyMedia>
                <EmptyTitle>Sem relatório publicado</EmptyTitle>
                <EmptyDescription>
                  Rode a skill atualizar-status-portal no repo do cliente para
                  publicar o primeiro relatório deste projeto.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
            <AdminProjectFacts
              client={client}
              project={project}
              lifecycle={lifecycle}
              summary={null}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
