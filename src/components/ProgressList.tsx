import type { ProgressItem } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";

export function ProgressList({ items }: { items: ProgressItem[] }) {
  return (
    <div className="overview flow-block">
      <h3 className="block-title">Progresso por área</h3>
      <div className="bars">
        {items.map((item) => (
          <ProgressBar key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
