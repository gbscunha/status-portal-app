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

/** ISO date parts as numbers. Every caller receives strings already validated
 *  by isoDateSchema (types.ts), so a real month and day are guaranteed here —
 *  the contract is enforced at the boundary, not patched in the middle. */
function isoParts(iso: string): [number, number, number] {
  const parts = iso.split("-").map(Number);
  return [parts[0], parts[1], parts[2]];
}

export function formatPtDate(iso: string): string {
  const [y, m, d] = isoParts(iso);
  return `${d} ${MONTHS_PT[m - 1]} ${y}`;
}

/** Full pt-BR date, e.g. "17 de Julho de 2026". */
export function formatPtDateLong(iso: string): string {
  const [y, m, d] = isoParts(iso);
  return `${d} de ${MONTHS_PT_LONG[m - 1]} de ${y}`;
}

/** Month-only label from YYYY-MM, e.g. "Set 2026". Delivery estimates are
 *  months on purpose — see isoMonthSchema in types.ts. */
export function formatPtMonth(isoMonth: string): string {
  const [y, m] = isoMonth.split("-").map(Number);
  return `${MONTHS_PT[m - 1]} ${y}`;
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
  const [y, m, d] = isoParts(iso);
  const weekday = WEEKDAYS_PT[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${weekday}, ${formatPtDateLong(iso)}`;
}

/** Whole days from a to b (negative when b precedes a). TZ-safe: built from
 *  the ISO parts with Date.UTC, never parsing the string as a Date. */
export function daysBetween(aIso: string, bIso: string): number {
  const toUtcDays = (iso: string) => {
    const [y, m, d] = isoParts(iso);
    return Date.UTC(y, m - 1, d) / 86_400_000;
  };
  return toUtcDays(bIso) - toUtcDays(aIso);
}

/** Relative day distance in pt-BR ("hoje", "ontem", "há N dias"). Both args
 *  are ISO dates; clamps future/negative diffs to "hoje". */
export function relativeDaysPt(iso: string, today: string): string {
  const days = daysBetween(iso, today);
  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  return `há ${days} dias`;
}

/** Today's date (YYYY-MM-DD) in America/Sao_Paulo. Under SSG this is the
 *  BUILD date — acceptable because every push redeploys. */
export function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}
