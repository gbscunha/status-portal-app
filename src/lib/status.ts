// Fonte única de verdade dos estados de status.
// As CORES vivem no CSS (classes .done/.prog/.plan em globals.css);
// aqui ficam os valores canônicos e seus rótulos em pt-BR.

export const STATUS_STATES = ["done", "prog", "plan"] as const;

export type StatusState = (typeof STATUS_STATES)[number];

export const STATUS_LABELS: Record<StatusState, string> = {
  done: "Concluído",
  prog: "Em andamento",
  plan: "Planejado",
};
