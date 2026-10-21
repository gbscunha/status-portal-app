import type { ProgressItem } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/status";
import { formatPtMonth } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Legend } from "./Legend";
import { StateIcon } from "./StateIcon";

// Progress per area. The state lives in the icon; the bar stays primary for
// every state and every client (a red brand would read as an alarm). On a
// phone the bar drops to its own line under the label. Long, so it may break
// across printed pages; its rows never do, and the last row never prints
// alone at the top of a page.
export function ProgressList({ items }: { items: ProgressItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Progresso por área</h2>
        </CardTitle>
        <Legend />
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y print:block">
          {items.map((item, i) => (
            <li
              key={`${i}-${item.label}`}
              className="grid grid-cols-[auto_minmax(0,1fr)_2.5rem] items-center gap-x-3 gap-y-2 py-3 break-inside-avoid first:pt-0 last:pb-0 print:[&:nth-last-child(2)]:break-after-avoid sm:grid-cols-[auto_minmax(0,1fr)_10rem_2.5rem]"
            >
              <StateIcon state={item.state} className="col-start-1 row-start-1" />
              <span className="col-start-2 row-start-1 text-[15px]/6 text-pretty">
                {item.label}
                <span className="sr-only">, {STATUS_LABELS[item.state]}</span>
                {item.eta && item.state !== "done" && (
                  <span className="block text-xs text-muted-foreground">
                    previsão: {formatPtMonth(item.eta)}
                  </span>
                )}
              </span>
              <Progress
                value={item.percent}
                aria-label={item.label}
                className="col-span-2 col-start-2 row-start-2 sm:col-span-1 sm:col-start-3 sm:row-start-1"
              />
              <span className="col-start-3 row-start-1 text-right text-xs font-medium tabular-nums sm:col-start-4">
                {item.percent}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
