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

const MONTHS_PT_LONG = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function formatPtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = MONTHS_PT[(m ?? 1) - 1] ?? "";
  return `${d} ${month} ${y}`;
}

/** Full pt-BR date, e.g. "17 de Julho de 2026". */
export function formatPtDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = MONTHS_PT_LONG[(m ?? 1) - 1] ?? "";
  return `${d} de ${month} de ${y}`;
}

const WEEKDAYS_PT = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

/** Weekday + full pt-BR date, e.g. "Sexta-feira, 17 de Julho de 2026".
 *  TZ-safe: weekday comes from Date.UTC over the ISO parts. */
export function formatPtDateFull(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday =
    WEEKDAYS_PT[new Date(Date.UTC(y ?? 0, (m ?? 1) - 1, d ?? 1)).getUTCDay()];
  return `${weekday}, ${formatPtDateLong(iso)}`;
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
