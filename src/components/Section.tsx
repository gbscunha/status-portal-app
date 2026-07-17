import type { Section as SectionData } from "@/lib/types";
import { StatusCard } from "./StatusCard";

// Fully-delivered sections collapse into <details> (native, zero JS) so the
// page stays focused on what is moving; the open ones render as before.
export function Section({ number, title, cards }: SectionData) {
  const allDone = cards.length > 0 && cards.every((c) => c.status === "done");

  const grid = (
    <div className="cards">
      {cards.map((card, i) => (
        <StatusCard key={`${card.title}-${i}`} {...card} />
      ))}
    </div>
  );

  if (allDone) {
    return (
      <details className="section section-done">
        <summary>
          <span className="num">{number}</span>
          <h3>{title}</h3>
          <span className="section-badge">
            {cards.length} {cards.length === 1 ? "entrega" : "entregas"} ✓
          </span>
        </summary>
        {grid}
      </details>
    );
  }

  return (
    <section className="section">
      <div className="section-head">
        <span className="num">{number}</span>
        <h3>{title}</h3>
      </div>
      {grid}
    </section>
  );
}
