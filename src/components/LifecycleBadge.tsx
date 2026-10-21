import type { Lifecycle } from "@/lib/types";
import { LIFECYCLE_LABELS, endMonth } from "@/lib/lifecycle";
import { formatPtMonth } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { StatusDot, type DotTone } from "./StatusDot";

/** Dot tone of each lifecycle state, shared with the client's lifecycle notice. */
export const LIFECYCLE_TONE: Record<Lifecycle["state"], DotTone> = {
  active: "done",
  paused: "hold",
  delivered: "done",
  closed: "plan",
};

// Whole-project lifecycle, with the month for finished projects.
export function LifecycleBadge({ lifecycle }: { lifecycle: Lifecycle }) {
  const month = endMonth(lifecycle);
  return (
    <Badge variant="outline">
      <StatusDot tone={LIFECYCLE_TONE[lifecycle.state]} />
      {LIFECYCLE_LABELS[lifecycle.state]}
      {month && ` · ${formatPtMonth(month)}`}
    </Badge>
  );
}
