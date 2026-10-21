import type { ReactNode } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Kpi = {
  label: string;
  value: ReactNode;
  /** Small text next to the value ("em 4 projetos", "dias"). */
  unit?: string;
  /** Context line under the label (a date, what it compares with). */
  note?: string;
  /** Amber value: something is waiting for action. */
  alert?: boolean;
};

// Indicator strip shared by the overview and the project page.
export function AdminKpis({ items }: { items: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {items.map((kpi) => (
        <Card key={kpi.label}>
          <CardHeader>
            <dl className="flex flex-col-reverse gap-1">
              <dt className="flex flex-col gap-0.5">
                <CardDescription>{kpi.label}</CardDescription>
                {kpi.note && (
                  <span className="text-xs text-muted-foreground">
                    {kpi.note}
                  </span>
                )}
              </dt>
              <dd>
                <CardTitle
                  className={cn(
                    "flex flex-wrap items-baseline gap-x-1.5 text-2xl font-semibold tabular-nums",
                    kpi.alert && "text-prog",
                  )}
                >
                  {kpi.value}
                  {kpi.unit && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {kpi.unit}
                    </span>
                  )}
                </CardTitle>
              </dd>
            </dl>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
