import { formatPtDate, relativeDaysPt, todayIso } from "@/lib/format";

export type TimelineEntry = {
  date: string;
  /** Title of that snapshot — what happened at this checkpoint. */
  title: string;
};

// Long histories collapse beyond this: the recent checkpoints tell the story,
// the rest becomes a single "+ N atualizações anteriores" line.
const MAX_ENTRIES = 6;

// The signature element: a vertical tracking rail. Entries come most recent
// first (same order as snapshot history); the current one is "Você está aqui".
export function Timeline({
  entries,
  currentDate,
}: {
  entries: TimelineEntry[];
  currentDate: string;
}) {
  const today = todayIso();
  const visible = entries.slice(0, MAX_ENTRIES);
  const hidden = entries.length - visible.length;

  return (
    <section className="timeline flow-block" aria-label="Linha do tempo do projeto">
      <h3 className="block-title">Linha do tempo</h3>
      <ol className="rail">
        {visible.map((entry) => {
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
                  <span className="rail-ago">
                    {relativeDaysPt(entry.date, today)}
                  </span>
                  {current && <span className="rail-here">Você está aqui</span>}
                </span>
                <span className="rail-title">{entry.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
      {hidden > 0 && (
        <p className="rail-more">
          + {hidden} {hidden === 1 ? "atualização anterior" : "atualizações anteriores"}
        </p>
      )}
    </section>
  );
}
