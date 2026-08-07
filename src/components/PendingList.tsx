import type { PendingItem } from "@/lib/types";
import { formatPtDate } from "@/lib/format";

// "Aguardando você": actions the CLIENT owns. Rendered only when the
// snapshot lists pending items — absence means nothing is blocked on them.
export function PendingList({ items }: { items: PendingItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="pending flow-block" aria-label="Aguardando você">
      <div className="kicker">Aguardando você</div>
      <p className="pending-intro">
        Para o projeto seguir no ritmo, precisamos de:
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <b>{item.label}</b> — {item.desc}
            {item.since && (
              <span className="pending-since">
                desde {formatPtDate(item.since)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
