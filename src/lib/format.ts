// Formatação de data TZ-safe: opera sobre a string ISO (YYYY-MM-DD) sem
// construir Date, evitando o off-by-one de fuso (2026-07-10 virar 09/07).
const MONTHS_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function formatPtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = MONTHS_PT[(m ?? 1) - 1] ?? "";
  return `${d} ${month} ${y}`;
}

/** Whole days from a to b (negative when b precedes a). TZ-safe: built from
 *  the ISO parts with Date.UTC, never parsing the string as a Date. */
export function daysBetween(aIso: string, bIso: string): number {
  const toUtcDays = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y ?? 0, (m ?? 1) - 1, d ?? 1) / 86_400_000;
  };
  return toUtcDays(bIso) - toUtcDays(aIso);
}

/** Today's date (YYYY-MM-DD) in America/Sao_Paulo. Under SSG this is the
 *  BUILD date — acceptable because every push redeploys. */
export function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}
