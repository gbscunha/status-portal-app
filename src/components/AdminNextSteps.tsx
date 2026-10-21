import type { Snapshot } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// The latest report's next steps, in order.
export function AdminNextSteps({
  nextSteps,
}: {
  nextSteps: NonNullable<Snapshot["nextSteps"]>;
}) {
  const subtitle = [
    nextSteps.title !== "Próximos passos" ? nextSteps.title : null,
    nextSteps.intro,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Próximos passos</h2>
        </CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col divide-y">
          {nextSteps.items.map((item, i) => (
            <li
              key={`${i}-${item.label}`}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums"
              >
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-pretty">{item.label}</p>
                <p className="text-sm text-pretty text-muted-foreground">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
