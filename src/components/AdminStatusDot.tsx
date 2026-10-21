import { cn } from "@/lib/utils";

export type DotTone = "done" | "prog" | "hold" | "plan" | "alert";

// Small state dot shared by the admin badges. "alert" is the
// hollow amber ring (stale, never published).
const TONES: Record<DotTone, string> = {
  done: "bg-done",
  prog: "bg-prog",
  hold: "bg-hold",
  plan: "bg-plan/50",
  alert: "ring-2 ring-prog ring-inset",
};

export function AdminStatusDot({
  tone,
  className,
}: {
  tone: DotTone;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-2 shrink-0 rounded-full", TONES[tone], className)}
    />
  );
}
