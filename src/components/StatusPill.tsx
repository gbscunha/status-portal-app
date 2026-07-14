import { STATUS_LABELS, type StatusState } from "@/lib/status";

export function StatusPill({ status }: { status: StatusState }) {
  return <span className={`pill ${status}`}>{STATUS_LABELS[status]}</span>;
}
