import type { Snapshot } from "@/lib/types";
import { formatPtDate } from "@/lib/format";

type Props = {
  kicker: string;
  title: Snapshot["title"];
  subtitle?: string;
  date: string;
  platform?: string;
  phase?: string;
  /** Heading tag for the report title; only the first report on a page is h1. */
  titleAs?: "h1" | "h2";
};

function TitleText({ text, highlight }: Snapshot["title"]) {
  if (highlight) {
    const idx = text.indexOf(highlight);
    if (idx !== -1) {
      return (
        <>
          {text.slice(0, idx)}
          <span className="accent">{highlight}</span>
          {text.slice(idx + highlight.length)}
        </>
      );
    }
  }
  return <>{text}</>;
}

export function ReportHeader({
  kicker,
  title,
  subtitle,
  date,
  platform,
  phase,
  titleAs: Title = "h1",
}: Props) {
  return (
    <header>
      <div className="kicker" translate="no">
        {kicker}
      </div>
      <Title className="report-title">
        <TitleText {...title} />
      </Title>
      {subtitle && <p className="sub">{subtitle}</p>}
      <div className="meta">
        <span>
          Atualizado · <b>{formatPtDate(date)}</b>
        </span>
        {platform && (
          <span>
            Plataforma · <b>{platform}</b>
          </span>
        )}
        {phase && (
          <span>
            Fase atual · <b>{phase}</b>
          </span>
        )}
      </div>
    </header>
  );
}
