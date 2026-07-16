import type { ProgressItem } from "@/lib/types";

export function ProgressBar({ label, percent, state }: ProgressItem) {
  return (
    <div className="barrow">
      <span className="label">{label}</span>
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
