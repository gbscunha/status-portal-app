import { STATUS_LABELS, type StatusState } from "@/lib/status";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "./StatusDot";

// The state lives in the dot; the badge itself stays neutral.
export function StatusPill({ status }: { status: StatusState }) {
  return (
    <Badge variant="outline">
      <StatusDot tone={status} />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
