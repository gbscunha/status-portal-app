import type { Lifecycle, Project } from "@/lib/types";
import type { ProjectSummary } from "@/lib/admin";
import { formatPtDate, relativeDaysPt } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import { LifecycleBadge } from "./LifecycleBadge";

// Project header, tinted with the client's color (--brand is set by the
// caller) in the background and border only. The progress bar stays primary
// (thicker here): red brands (Movi, Neon) would read as an alarm. The caption
// counts fronts, the number is the average. Secondary text derives from the
// foreground, not muted gray: on the tinted surface the gray falls under
// 4.5:1. No label row above the h1 — the lifecycle badge sits beside the title.
export function AdminProjectHero({
  project,
  lifecycle,
  summary,
  today,
  clientOnline,
}: {
  project: Project;
  lifecycle: Lifecycle;
  summary: ProjectSummary | null;
  today: string;
  clientOnline: boolean;
}) {
  const latest = summary?.latest;
  const finished =
    lifecycle.state === "delivered" || lifecycle.state === "closed";
  const ended = lifecycle.state === "delivered" ? "concluído" : "encerrado";
  // What the client sees of this project, when it differs from a live report.
  const pageNote = !clientOnline
    ? `${finished ? `Projeto ${ended}. ` : ""}A página do cliente está fora do ar.`
    : finished && summary
      ? `Projeto ${ended}: a página do cliente mostra o último relatório, sem pendências nem próximos passos.`
      : null;

  return (
    <section
      aria-labelledby="projeto-titulo"
      className="flex flex-col gap-5 rounded-xl border border-(--brand)/20 bg-linear-to-br from-(--brand)/10 via-background to-background p-5 shadow-xs md:p-7"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1
            id="projeto-titulo"
            className="text-3xl font-semibold tracking-tight text-balance md:text-4xl"
          >
            {project.name}
          </h1>
          <LifecycleBadge lifecycle={lifecycle} />
        </div>
        {latest?.phase && <p className="font-medium">{latest.phase}</p>}
        <p className="max-w-prose text-pretty text-foreground/75">
          {latest
            ? (latest.subtitle ?? latest.title.text)
            : "Nenhum relatório publicado ainda."}
        </p>
        {pageNote && (
          <p className="max-w-prose text-sm text-pretty text-foreground/75">
            {pageNote}
          </p>
        )}
      </div>

      {summary && (
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between gap-4">
            <p className="text-sm text-pretty text-foreground/75">
              {summary.fronts.done} de {summary.fronts.total} frentes concluídas
              {" · "}atualizado {relativeDaysPt(summary.lastReport, today)}
              {" · "}primeiro relatório em {formatPtDate(summary.firstReport)}
            </p>
            <span className="text-2xl font-semibold text-foreground tabular-nums">
              {summary.percent}%
            </span>
          </div>
          {/* Hero only: a thicker bar. */}
          <Progress
            value={summary.percent}
            aria-label="Progresso geral"
            className="**:data-[slot=progress-track]:h-2"
          />
        </div>
      )}
    </section>
  );
}
