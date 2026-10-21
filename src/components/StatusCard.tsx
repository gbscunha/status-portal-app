import type { StatusCard as StatusCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusPill } from "./StatusPill";

export function StatusCard({
  title,
  status,
  description,
  fullWidth,
}: StatusCardData) {
  return (
    <Card className={cn("break-inside-avoid", fullWidth && "sm:col-span-2")}>
      <CardHeader>
        <CardTitle>
          <h3 className="text-balance">{title}</h3>
        </CardTitle>
        <CardAction>
          <StatusPill status={status} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="max-w-prose text-pretty text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
