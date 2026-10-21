import type { Scope, Snapshot } from "@/lib/types";
import { scopeCoverage, scopeGroups } from "@/lib/scope";
import { STATUS_LABELS } from "@/lib/status";
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
import { StateIcon } from "./StateIcon";

// The map of what the project is: every agreed item at once, marked by the
// state its progress bar reports. It is the denominator the percentages were
// missing. Items are rows in two columns, divided by hairlines — never cards
// inside the card.
export function ScopeMap({
  scope,
  snapshot,
}: {
  scope: Scope;
  snapshot: Snapshot;
}) {
  const { items, orphans, total, delivered } = scopeCoverage(scope, snapshot);
  if (items.length === 0) return null;

  // Runs at build time: a dangling scopeId shows up in the build log instead
  // of silently dropping the whole report.
  if (orphans.length > 0) {
    console.warn(
      `[scope] progresso aponta para itens que não existem no escopo: ${orphans.join(", ")}`,
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>O que está no projeto</h2>
        </CardTitle>
        <CardDescription>
          <span className="font-medium text-foreground tabular-nums">
            {delivered} de {total}
          </span>{" "}
          {total === 1 ? "item entregue" : "itens entregues"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {scopeGroups(items).map((group) => (
          <div key={group.name} className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              {group.name}
            </h3>
            <ul className="grid gap-x-6 sm:grid-cols-2">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "flex flex-col gap-1 border-t py-3 break-inside-avoid",
                    item.removed && "text-muted-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <StateIcon state={item.state} />
                    <span
                      className={cn(
                        "text-[15px]/6 font-medium",
                        item.removed && "line-through",
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {STATUS_LABELS[item.state]}
                    </span>
                  </span>
                  <span className="text-pretty text-muted-foreground">
                    {item.desc}
                  </span>
                  {item.removed && item.removedAt ? (
                    <Badge variant="secondary" className="mt-1">
                      saiu do escopo em {formatPtDate(item.removedAt)}
                    </Badge>
                  ) : (
                    item.addedAfterBaseline &&
                    item.addedAt && (
                      <Badge variant="secondary" className="mt-1">
                        acrescentado em {formatPtDate(item.addedAt)}
                      </Badge>
                    )
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
