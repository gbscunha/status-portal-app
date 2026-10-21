import { CircleCheckIcon, CircleDotIcon, CircleIcon } from "lucide-react";
import type { StatusState } from "@/lib/status";
import { cn } from "@/lib/utils";

const ICON: Record<StatusState, { Icon: typeof CircleIcon; tone: string }> = {
  done: { Icon: CircleCheckIcon, tone: "text-done" },
  prog: { Icon: CircleDotIcon, tone: "text-prog" },
  plan: { Icon: CircleIcon, tone: "text-muted-foreground" },
};

// The state of a progress area or scope item as an icon: check for done, dot
// for in progress, empty circle for planned. Decorative: the caller always
// puts the state's word next to it (visible or for screen readers).
export function StateIcon({
  state,
  className,
}: {
  state: StatusState;
  className?: string;
}) {
  const { Icon, tone } = ICON[state];
  return (
    <Icon aria-hidden="true" className={cn("size-4 shrink-0", tone, className)} />
  );
}
