import type { Section as SectionData } from "@/lib/types";
import { StatusCard } from "./StatusCard";

export function Section({ number, title, cards }: SectionData) {
  return (
    <div className="section">
      <div className="section-head">
        <span className="num mono">{number}</span>
        <h3>{title}</h3>
      </div>
      <div className="cards">
        {cards.map((card, i) => (
          <StatusCard key={`${card.title}-${i}`} {...card} />
        ))}
      </div>
    </div>
  );
}
