import type { ProgressItem } from "@/lib/types";
import { formatPtMonth } from "@/lib/format";

export function ProgressBar({ label, percent, state, eta }: ProgressItem) {
  return (
    <div className="barrow">
      <span className="label">
        {label}
        {eta && state !== "done" && (
          <span className="label-eta">previsão: {formatPtMonth(eta)}</span>
        )}
      </span>
      <div
        className="track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`fill ${state}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="pct">{percent}%</span>
    </div>
  );
}
