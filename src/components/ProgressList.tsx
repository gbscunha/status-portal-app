import type { ProgressItem } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";

export function ProgressList({ items }: { items: ProgressItem[] }) {
  return (
    <div className="overview">
      <h2>Progresso por área</h2>
      <div className="bars">
        {items.map((item) => (
          <ProgressBar key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
