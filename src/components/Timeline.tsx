import { formatPtDate } from "@/lib/format";

export type TimelineEntry = {
  date: string;
  /** Title of that snapshot — what happened at this checkpoint. */
  title: string;
};

// The signature element: a vertical tracking rail. Entries come most recent
// first (same order as snapshot history); the current one is "Você está aqui".
export function Timeline({
  entries,
  currentDate,
}: {
  entries: TimelineEntry[];
  currentDate: string;
}) {
  return (
    <section className="timeline" aria-label="Linha do tempo do projeto">
      <h3 className="block-title">Linha do tempo</h3>
      <ol className="rail">
        {entries.map((entry) => {
          const current = entry.date === currentDate;
          return (
            <li
              key={entry.date}
              className={current ? "current" : undefined}
              aria-current={current ? "true" : undefined}
            >
              <span className="rail-dot" aria-hidden="true" />
              <div className="rail-body">
                <span className="rail-date">
                  {formatPtDate(entry.date)}
                  {current && <span className="rail-here">Você está aqui</span>}
                </span>
                <span className="rail-title">{entry.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
