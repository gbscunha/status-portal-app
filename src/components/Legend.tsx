import { STATUS_LABELS } from "@/lib/status";

export function Legend() {
  return (
    <div className="legend">
      <span>
        <span className="dot done" /> {STATUS_LABELS.done}
      </span>
      <span>
        <span className="dot prog" /> {STATUS_LABELS.prog}
      </span>
      <span>
        <span className="dot plan" /> {STATUS_LABELS.plan}
      </span>
    </div>
  );
}
