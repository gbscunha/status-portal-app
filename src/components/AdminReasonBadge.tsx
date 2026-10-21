import type { AttentionReason } from "@/lib/admin";
import { Badge } from "@/components/ui/badge";
import { StatusDot, type DotTone } from "./StatusDot";

function label(reason: AttentionReason): string {
  switch (reason.kind) {
    case "none":
      return "Sem relatório";
    case "stale":
      return `Parado há ${reason.idleDays} dias`;
    case "pending":
      return `${reason.count} ${reason.count === 1 ? "pendência" : "pendências"} do cliente`;
    case "paused":
      return "Em espera";
  }
}

const TONE: Record<AttentionReason["kind"], DotTone> = {
  none: "alert",
  stale: "alert",
  pending: "prog",
  paused: "hold",
};

// Why a project is on the "Precisa de atenção" list.
export function AdminReasonBadge({ reason }: { reason: AttentionReason }) {
  return (
    <Badge variant="outline">
      <StatusDot tone={TONE[reason.kind]} />
      {label(reason)}
    </Badge>
  );
}
