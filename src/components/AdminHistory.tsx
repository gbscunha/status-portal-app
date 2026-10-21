import type { HistoryPoint } from "@/lib/admin";
import { formatPtDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Every published report, newest first: date, overall % and what happened.
export function AdminHistory({ history }: { history: HistoryPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Histórico</h2>
        </CardTitle>
        <CardDescription>
          {history.length} {history.length === 1 ? "relatório" : "relatórios"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative flex flex-col gap-4 border-l pl-5">
          {history.map((point, i) => (
            <li key={point.date} className="relative flex flex-col gap-1">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1.5 -left-[25px] size-2.5 rounded-full border-2 border-background",
                  i === 0 ? "bg-(--brand)" : "bg-border",
                )}
              />
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium tabular-nums">
                  {formatPtDate(point.date)}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {point.percent}%
                </span>
                {i === 0 && <Badge variant="secondary">Atual</Badge>}
              </div>
              <p className="text-sm text-pretty text-muted-foreground">{point.title}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
