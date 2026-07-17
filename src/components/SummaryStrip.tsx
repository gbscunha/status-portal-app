import type { Snapshot } from "@/lib/types";
import { formatPtDate } from "@/lib/format";
import { countDelivered, overallPercent } from "@/lib/summary";

// The "manifest" strip: the executive summary a client reads in 5 seconds.
export function SummaryStrip({
  snapshot,
  platform,
}: {
  snapshot: Snapshot;
  platform?: string;
}) {
  const percent = overallPercent(snapshot);
  const delivered = countDelivered(snapshot);

  return (
    <dl className="manifest">
      {snapshot.phase && (
        <div className="manifest-item">
          <dt>Fase atual</dt>
          <dd>{snapshot.phase}</dd>
        </div>
      )}
      <div className="manifest-item">
        <dt>Atualizado</dt>
        <dd>{formatPtDate(snapshot.date)}</dd>
      </div>
      {platform && (
        <div className="manifest-item">
          <dt>Plataforma</dt>
          <dd>{platform}</dd>
        </div>
      )}
      <div className="manifest-item">
        <dt>Progresso geral</dt>
        <dd className="manifest-strong">{percent}%</dd>
      </div>
      {delivered > 0 && (
        <div className="manifest-item">
          <dt>Entregas concluídas</dt>
          <dd className="manifest-strong">{delivered}</dd>
        </div>
      )}
    </dl>
  );
}
