import type { Lifecycle } from "@/lib/types";
import { LIFECYCLE_LABELS, endMonth } from "@/lib/lifecycle";
import { formatPtDate, formatPtMonth } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LIFECYCLE_TONE } from "./LifecycleBadge";
import { StatusDot } from "./StatusDot";

// Whole-project state, first block under the header. Active projects render
// nothing. A paused project points at "Aguardando você" (right below) when the
// client has pending actions — the reason and the asks read as one message.
export function LifecycleNotice({
  lifecycle,
  hasPending,
}: {
  lifecycle: Lifecycle;
  hasPending: boolean;
}) {
  if (lifecycle.state === "active") return null;

  const heading = `Projeto ${LIFECYCLE_LABELS[lifecycle.state].toLowerCase()}`;
  const month = endMonth(lifecycle);

  return (
    <Card className="break-inside-avoid">
      <CardHeader>
        <CardTitle>
          <h2 className="flex items-center gap-2">
            <StatusDot tone={LIFECYCLE_TONE[lifecycle.state]} />
            {heading}
          </h2>
        </CardTitle>
        {lifecycle.state === "paused" && lifecycle.since && (
          <CardDescription>desde {formatPtDate(lifecycle.since)}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-[15px]/6 text-pretty">
        {lifecycle.state === "paused" ? (
          <>
            <p>{lifecycle.reason}</p>
            {hasPending && (
              <p className="text-muted-foreground">
                Veja logo abaixo o que precisamos de você.
              </p>
            )}
          </>
        ) : (
          <>
            <p>
              {lifecycle.state === "delivered" ? "Entregue" : "Encerrado"} em{" "}
              <span className="font-medium">{month && formatPtMonth(month)}</span>.
            </p>
            {lifecycle.state === "closed" && lifecycle.reason && (
              <p>{lifecycle.reason}</p>
            )}
            <p className="text-muted-foreground">
              Este é o último relatório do projeto.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
