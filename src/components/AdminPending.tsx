import type { Snapshot } from "@/lib/types";
import { formatPtDate, relativeDaysPt } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusDot } from "./StatusDot";

// "Aguardando o cliente": the latest report's pending items (the client's
// actions, shown as "Aguardando você" on their page).
export function AdminPending({
  pending,
  today,
}: {
  pending: NonNullable<Snapshot["pending"]>;
  today: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Aguardando o cliente</h2>
        </CardTitle>
        <CardDescription>
          {pending.length === 0
            ? "Nada pendente com o cliente"
            : `${pending.length} ${pending.length === 1 ? "item" : "itens"}`}
        </CardDescription>
      </CardHeader>
      {pending.length > 0 && (
        <CardContent>
          <ul className="flex flex-col divide-y">
            {pending.map((item, i) => (
              <li
                key={`${i}-${item.label}`}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-3 first:pt-0 last:pb-0"
              >
                <StatusDot tone="prog" className="mt-1.5" />
                <div className="flex flex-col items-start gap-1">
                  <p className="text-sm font-medium text-pretty">{item.label}</p>
                  <p className="text-sm text-pretty text-muted-foreground">{item.desc}</p>
                  {item.since && (
                    <Badge variant="secondary" className="mt-1">
                      Desde {formatPtDate(item.since)} ·{" "}
                      {relativeDaysPt(item.since, today)}
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
