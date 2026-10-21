import { ChevronRightIcon } from "lucide-react";
import type { Section as SectionData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { StatusCard } from "./StatusCard";
import { StatusDot } from "./StatusDot";

// A report section: its number (from the report, it orders the story) and a
// grid of status cards. Not a card itself — cards never nest. The number is
// plain text, so it never reads as one more step of the numbered next steps
// right above. Fully delivered sections collapse into a native <details> (zero
// JS) so the page stays on what is moving; print opens them (tailwind.css),
// and a heading never ends a printed page away from its cards.
export function Section({ number, title, cards }: SectionData) {
  const allDone = cards.length > 0 && cards.every((c) => c.status === "done");

  const heading = (
    <>
      <span className="text-lg font-medium text-muted-foreground tabular-nums">
        {number}
      </span>
      <h2 className="text-lg font-semibold tracking-tight text-balance">
        {title}
      </h2>
    </>
  );

  const grid = (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card, i) => (
        <StatusCard key={`${card.title}-${i}`} {...card} />
      ))}
    </div>
  );

  if (allDone) {
    return (
      <details className="group/section">
        <summary className="flex cursor-pointer list-none items-baseline gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50 print:break-after-avoid [&::-webkit-details-marker]:hidden">
          {heading}
          <Badge variant="outline" className="ml-auto self-center">
            <StatusDot tone="done" />
            {cards.length} {cards.length === 1 ? "entrega" : "entregas"}
          </Badge>
          <ChevronRightIcon
            aria-hidden="true"
            className="size-4 shrink-0 self-center text-muted-foreground transition-transform group-open/section:rotate-90 print:hidden"
          />
        </summary>
        <div className="pt-4">{grid}</div>
      </details>
    );
  }

  return (
    <section className="flex flex-col gap-4 print:block">
      <div className="flex items-baseline gap-3 print:mb-4 print:break-after-avoid">
        {heading}
      </div>
      {grid}
    </section>
  );
}
