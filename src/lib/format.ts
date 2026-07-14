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
