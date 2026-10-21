import type { PendingItem } from "@/lib/types";
import { formatPtDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusDot } from "./StatusDot";

// "Aguardando você": actions the CLIENT owns. Rendered only when the
// snapshot lists pending items — absence means nothing is blocked on them.
export function PendingList({ items }: { items: PendingItem[] }) {
  if (items.length === 0) return null;

  return (
    <Card className="break-inside-avoid">
      <CardHeader>
        <CardTitle>
          <h2>Aguardando você</h2>
        </CardTitle>
        <CardDescription>
          Para o projeto seguir no ritmo, precisamos de:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y">
          {items.map((item) => (
            <li
              key={item.label}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-3 first:pt-0 last:pb-0"
            >
              <StatusDot tone="prog" className="mt-2" />
              <div className="flex flex-col items-start gap-1 text-[15px]/6">
                <p className="font-medium text-pretty">{item.label}</p>
                <p className="max-w-prose text-pretty text-muted-foreground">{item.desc}</p>
                {item.since && (
                  <Badge variant="secondary" className="mt-1">
                    desde {formatPtDate(item.since)}
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
