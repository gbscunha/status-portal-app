import { CircleCheckIcon, CircleDotIcon, CircleIcon } from "lucide-react";
import type { ProgressItem, StatusState } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/status";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ICON: Record<StatusState, { Icon: typeof CircleIcon; className: string }> = {
  done: { Icon: CircleCheckIcon, className: "text-done" },
  prog: { Icon: CircleDotIcon, className: "text-prog" },
  plan: { Icon: CircleIcon, className: "text-muted-foreground" },
};

// The latest report's fronts, in the client page's order.
export function AdminFronts({
  items,
  done,
}: {
  items: ProgressItem[];
  done: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Frentes</h2>
        </CardTitle>
        <CardDescription>
          {items.length} frentes · {done} concluídas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y">
          {items.map((item, i) => {
            const { Icon, className } = ICON[item.state];
            return (
              <li
                key={`${i}-${item.label}`}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-[auto_minmax(0,1fr)_8rem_auto]"
              >
                <Icon className={cn("size-4", className)} aria-hidden="true" />
                <span className="text-sm text-pretty">
                  {item.label}
                  <span className="sr-only">, {STATUS_LABELS[item.state]}</span>
                </span>
                <Progress
                  value={item.percent}
                  aria-label={item.label}
                  className="hidden sm:flex"
                />
                <span className="w-10 text-right text-xs font-medium tabular-nums">
                  {item.percent}%
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
