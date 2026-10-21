import { STATUS_LABELS, STATUS_STATES } from "@/lib/status";
import { StateIcon } from "./StateIcon";

// Key to the state icons, under the progress card's title. Hidden from screen
// readers: every row already says its state in words.
export function Legend() {
  return (
    <ul
      aria-hidden="true"
      className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"
    >
      {STATUS_STATES.map((state) => (
        <li key={state} className="flex items-center gap-1.5">
          <StateIcon state={state} className="size-3.5" />
          {STATUS_LABELS[state]}
        </li>
      ))}
    </ul>
  );
}
