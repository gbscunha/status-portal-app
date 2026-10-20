import type { Lifecycle } from "@/lib/types";
import { LIFECYCLE_LABELS, endMonth } from "@/lib/lifecycle";
import { formatPtDate, formatPtMonth } from "@/lib/format";

// Whole-project state, first block of the rail. Active projects render
// nothing, so reports without a lifecycle look exactly as before. A paused
// project points at "Aguardando você" (right below) when the client has
// pending actions — the reason and the asks read as one message.
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
    <section
      className={`lifecycle-notice flow-block ${lifecycle.state}`}
      aria-label={heading}
    >
      <div className="kicker">
        {heading}
        {lifecycle.state === "paused" && lifecycle.since && (
          <span className="lifecycle-since">
            desde {formatPtDate(lifecycle.since)}
          </span>
        )}
      </div>
      {lifecycle.state === "paused" ? (
        <>
          <p className="lifecycle-text">{lifecycle.reason}</p>
          {hasPending && (
            <p className="lifecycle-hint">
              Veja logo abaixo o que precisamos de você.
            </p>
          )}
        </>
      ) : (
        <>
          <p className="lifecycle-text">
            {lifecycle.state === "delivered" ? "Entregue" : "Encerrado"} em{" "}
            <b className="semibold">{month && formatPtMonth(month)}</b>.
          </p>
          {lifecycle.state === "closed" && lifecycle.reason && (
            <p className="lifecycle-text">{lifecycle.reason}</p>
          )}
          <p className="lifecycle-hint">Este é o último relatório do projeto.</p>
        </>
      )}
    </section>
  );
}
