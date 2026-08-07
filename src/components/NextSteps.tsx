import type { NextSteps as NextStepsData } from "@/lib/types";

export function NextSteps({ title, intro, items }: NextStepsData) {
  return (
    <div className="next flow-block">
      <div className="kicker">Próximos passos imediatos</div>
      <h3>{title}</h3>
      {intro && <p>{intro}</p>}
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <b>{item.label}</b> — {item.desc}
          </li>
        ))}
      </ul>
    </div>
  );
}
