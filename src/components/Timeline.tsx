import { formatPtDate } from "@/lib/format";

export function Timeline({
  dates,
  currentDate,
}: {
  dates: string[];
  currentDate: string;
}) {
  return (
    <div className="timeline">
      <h2>Histórico de atualizações</h2>
      <ul>
        {dates.map((d) => (
          <li
            key={d}
            className={d === currentDate ? "current" : undefined}
            aria-current={d === currentDate ? "true" : undefined}
          >
            {formatPtDate(d)}
          </li>
        ))}
      </ul>
    </div>
  );
}
