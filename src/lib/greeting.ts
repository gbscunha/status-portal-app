import { daysBetween } from "./format";

export type Phrase = { text: string; highlight: string };

// Rotating greeting for the admin panel. Deterministic by date (SSG-safe):
// the build date picks the phrase, so it changes per day/deploy — no
// randomness that would make builds unreproducible.
export const PHRASES: Phrase[] = [
  { text: "Uma entrega de cada vez", highlight: "entrega" },
  { text: "Feito é melhor que perfeito", highlight: "Feito" },
  { text: "Progresso é o melhor relatório", highlight: "Progresso" },
  { text: "Construindo o que importa", highlight: "importa" },
  { text: "Cada push conta uma história", highlight: "história" },
];

export function dailyPhrase(dateIso: string): Phrase {
  const days = daysBetween("1970-01-01", dateIso);
  const index = ((days % PHRASES.length) + PHRASES.length) % PHRASES.length;
  return PHRASES[index];
}
