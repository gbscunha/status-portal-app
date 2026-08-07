import type { Scope, Snapshot } from "@/lib/types";
import { scopeCoverage, scopeGroups } from "@/lib/scope";
import { STATUS_LABELS } from "@/lib/status";
import { formatPtDate } from "@/lib/format";

// The map of what the project is: every agreed item at once, coloured by the
// state its progress bar reports. It is the denominator the percentages were
// missing. Read-only, so a Server Component — the grid does the work a kanban
// board would pretend to do, without asking anyone to move a card.
export function ScopeMap({
  scope,
  snapshot,
}: {
  scope: Scope;
  snapshot: Snapshot;
}) {
  const { items, orphans, total, delivered } = scopeCoverage(scope, snapshot);
  if (items.length === 0) return null;

  // Runs at build time: a dangling scopeId shows up in the build log instead
  // of silently dropping the whole report.
  if (orphans.length > 0) {
    console.warn(
      `[scope] progresso aponta para itens que não existem no escopo: ${orphans.join(", ")}`,
    );
  }

  return (
    <section className="scope flow-block" aria-label="Escopo do projeto">
      <h3 className="block-title">O que está no projeto</h3>
      <p className="scope-count">
        <b className="scope-count-strong">
          {delivered} de {total}
        </b>{" "}
        {total === 1 ? "item entregue" : "itens entregues"}
      </p>

      {scopeGroups(items).map((group) => (
        <div className="scope-group" key={group.name}>
          <h4 className="scope-group-name">{group.name}</h4>
          <ul className="scope-grid">
            {group.items.map((item) => (
              <li
                key={item.id}
                className={`scope-item${item.removed ? " removed" : ""}`}
              >
                <span className="scope-item-head">
                  <span className={`dot ${item.state}`} aria-hidden="true" />
                  <span className="scope-item-label">{item.label}</span>
                </span>
                <span className="scope-state">{STATUS_LABELS[item.state]}</span>
                <span className="scope-item-desc">{item.desc}</span>
                {item.removed && item.removedAt ? (
                  <span className="scope-tag">
                    saiu do escopo em {formatPtDate(item.removedAt)}
                  </span>
                ) : (
                  item.addedAfterBaseline &&
                  item.addedAt && (
                    <span className="scope-tag">
                      acrescentado em {formatPtDate(item.addedAt)}
                    </span>
                  )
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
