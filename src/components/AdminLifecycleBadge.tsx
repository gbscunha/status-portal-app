import type { Lifecycle } from "@/lib/types";
import { LIFECYCLE_LABELS, endMonth } from "@/lib/lifecycle";
import { formatPtMonth } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { AdminStatusDot, type DotTone } from "./AdminStatusDot";

const TONE: Record<Lifecycle["state"], DotTone> = {
  active: "done",
  paused: "hold",
  delivered: "done",
  closed: "plan",
};

// Whole-project lifecycle, with the month for finished projects.
export function AdminLifecycleBadge({ lifecycle }: { lifecycle: Lifecycle }) {
  const month = endMonth(lifecycle);
  return (
    <Badge variant="outline">
      <AdminStatusDot tone={TONE[lifecycle.state]} />
      {LIFECYCLE_LABELS[lifecycle.state]}
      {month && ` · ${formatPtMonth(month)}`}
    </Badge>
  );
}
