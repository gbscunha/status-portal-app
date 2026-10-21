import { formatPtDate, relativeDaysPt, todayIso } from "@/lib/format";
import type { TimelineEntry } from "@/lib/summary";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Long histories collapse beyond this: the recent checkpoints tell the story,
// the rest becomes a single "+ N atualizações anteriores" line.
const MAX_ENTRIES = 6;

// The tracking line: every published report, most recent first. The current
// one carries the client's color (a marker, never text) and "Você está aqui".
export function Timeline({
  entries,
  currentDate,
}: {
  entries: TimelineEntry[];
  currentDate: string;
}) {
  const today = todayIso();
  const visible = entries.slice(0, MAX_ENTRIES);
  const hidden = entries.length - visible.length;

  return (
    <Card className="break-inside-avoid">
      <CardHeader>
        <CardTitle>
          <h2>Linha do tempo</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ol className="relative flex flex-col gap-4 border-l pl-5">
          {visible.map((entry) => {
            const current = entry.date === currentDate;
            return (
              <li
                key={entry.date}
                aria-current={current ? "true" : undefined}
                className="relative flex flex-col gap-1"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1.5 -left-6.25 size-2.5 rounded-full border-2 border-card",
                    current ? "bg-(--brand)" : "bg-border",
                  )}
                />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-medium tabular-nums">
                    {formatPtDate(entry.date)}
                  </span>
                  <span className="text-muted-foreground">
                    {relativeDaysPt(entry.date, today)}
                  </span>
                  {current && <Badge variant="secondary">Você está aqui</Badge>}
                </div>
                <p className="max-w-prose text-pretty text-muted-foreground">{entry.title}</p>
              </li>
            );
          })}
        </ol>
        {hidden > 0 && (
          <p className="text-xs text-muted-foreground">
            + {hidden}{" "}
            {hidden === 1 ? "atualização anterior" : "atualizações anteriores"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
