import type { StatusCard as StatusCardData } from "@/lib/types";
import { StatusPill } from "./StatusPill";

export function StatusCard({
  title,
  status,
  description,
  fullWidth,
}: StatusCardData) {
  return (
    <div className={`card${fullWidth ? " full" : ""}`}>
      <div className="top">
        <span className="title">{title}</span>
        <StatusPill status={status} />
      </div>
      <p className="desc">{description}</p>
    </div>
  );
}
