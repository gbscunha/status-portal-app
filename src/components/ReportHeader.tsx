import type { Snapshot } from "@/lib/types";

type Props = {
  kicker: string;
  title: Snapshot["title"];
  subtitle?: string;
  /** Heading tag for the report title; the page h1 lives in the mast. */
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

export function ReportHeader({ kicker, title, subtitle, titleAs: Title = "h2" }: Props) {
  return (
    <header className="report-head">
      <div className="kicker" translate="no">
        {kicker}
      </div>
      <Title className="report-title">
        <TitleText {...title} />
      </Title>
      {subtitle && <p className="sub">{subtitle}</p>}
    </header>
  );
}
