import type { NextSteps as NextStepsData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NextSteps({ title, intro, items }: NextStepsData) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-balance">{title}</h2>
        </CardTitle>
        {intro && (
          <CardDescription className="max-w-prose text-[15px]/6 text-pretty">
            {intro}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col divide-y">
          {items.map((item, i) => (
            <li
              key={item.label}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-3 break-inside-avoid first:pt-0 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums"
              >
                {i + 1}
              </span>
              <div className="flex flex-col gap-1 text-[15px]/6">
                <p className="font-medium text-pretty">{item.label}</p>
                <p className="max-w-prose text-pretty text-foreground/80">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
