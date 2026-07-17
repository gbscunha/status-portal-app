"use client";

import { useSyncExternalStore } from "react";
import { formatPtDateFull, todayIso } from "@/lib/format";
import { dailyPhrase } from "@/lib/greeting";

const subscribe = () => () => {};

function PhraseTitle({ text, highlight }: { text: string; highlight: string }) {
  const idx = text.indexOf(highlight);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="admin-accent">{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
  );
}

// Client island: the static page is built once, but the greeting must show
// the VISIT date, not the build date. SSR/hydration render buildDateIso;
// after hydration the browser clock (America/Sao_Paulo) takes over — so the
// phrase rotation and the date line are always current.
export function AdminGreeting({ buildDateIso }: { buildDateIso: string }) {
  const today = useSyncExternalStore(
    subscribe,
    () => todayIso(),
    () => buildDateIso,
  );

  return (
    <>
      {/* Greeting must work at any hour — no "bom dia"/"boa tarde". */}
      <h1 className="report-title">
        <PhraseTitle {...dailyPhrase(today)} />
      </h1>
      <p className="admin-today">{formatPtDateFull(today)}</p>
    </>
  );
}
