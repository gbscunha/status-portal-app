import type { Client, Project, Snapshot } from "@/lib/types";
import { lifecycleOf } from "@/lib/lifecycle";
import { formatPtDate } from "@/lib/format";
import { countDelivered, overallPercent } from "@/lib/summary";
import { Progress } from "@/components/ui/progress";
import { LifecycleBadge } from "./LifecycleBadge";

function TitleText({ text, highlight }: Snapshot["title"]) {
  if (highlight) {
    const idx = text.indexOf(highlight);
    if (idx !== -1) {
      return (
        <>
          {text.slice(0, idx)}
          <span className="underline decoration-[3px] underline-offset-[6px]">
            {highlight}
          </span>
          {text.slice(idx + highlight.length)}
        </>
      );
    }
  }
  return <>{text}</>;
}

// The report header: the only surface tinted with the client's color (--brand,
// set by ClientShell), in the background and border only — the bar stays
// primary, since red brands would read as an alarm. The title is the page's
// h1 (one panel shows at a time) and takes focus when the client switches
// projects. The lifecycle badge shows only when the whole project's state is
// news (paused, delivered, closed): on a running project its green dot would
// contradict the legend below, where green means done. No label row above
// the title: client and project sit below it, and the facts reuse the labels
// of the old summary strip. Secondary text derives from the foreground: muted
// gray drops under 4.5:1 on the tint.
export function ReportHeader({
  client,
  project,
  snapshot,
}: {
  client: Client;
  project: Project;
  snapshot: Snapshot;
}) {
  const percent = overallPercent(snapshot);
  const delivered = countDelivered(snapshot);
  const lifecycle = lifecycleOf(project);
  const facts = [
    snapshot.phase && { label: "Fase atual", value: snapshot.phase },
    { label: "Atualizado", value: formatPtDate(snapshot.date) },
    project.platform && { label: "Plataforma", value: project.platform },
    delivered > 0 && { label: "Entregas concluídas", value: String(delivered) },
  ].filter((fact) => !!fact);

  return (
    <section
      aria-labelledby={`titulo-${project.id}`}
      className="flex flex-col gap-6 rounded-xl border border-(--brand)/20 bg-linear-to-br from-(--brand)/10 via-background to-background p-5 shadow-xs break-inside-avoid md:p-7"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1
            id={`titulo-${project.id}`}
            tabIndex={-1}
            className="text-3xl font-semibold tracking-tight text-balance outline-none md:text-4xl"
          >
            <TitleText {...snapshot.title} />
          </h1>
          {lifecycle.state !== "active" && <LifecycleBadge lifecycle={lifecycle} />}
        </div>
        <p className="text-sm font-medium text-foreground/75" translate="no">
          {client.name} · {project.name}
        </p>
        {snapshot.subtitle && (
          <p className="max-w-prose text-base text-pretty text-foreground/75">
            {snapshot.subtitle}
          </p>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-foreground/75">{fact.label}</dt>
            <dd className="text-sm font-medium text-pretty tabular-nums">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-4">
          <span className="text-sm text-foreground/75">Progresso geral</span>
          <span className="text-2xl font-semibold tabular-nums">{percent}%</span>
        </div>
        <Progress
          value={percent}
          aria-label="Progresso geral"
          className="**:data-[slot=progress-track]:h-2"
        />
      </div>
    </section>
  );
}
