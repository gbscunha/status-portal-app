import type { CSSProperties } from "react";
import { ChevronRightIcon, CircleCheckIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  type AttentionItem,
  type AttentionReason,
  type PortfolioRow,
  adminProjectHref,
} from "@/lib/admin";
import { formatPtDate } from "@/lib/format";
import { AdminReasonBadge } from "./AdminReasonBadge";

// One line of context for the main reason.
function detail(
  row: PortfolioRow,
  reason: AttentionReason,
  firstPending: string | undefined,
): string {
  if (reason.kind === "none") return "Nenhum relatório publicado ainda.";
  if (reason.kind === "stale") {
    return `Último relatório em ${formatPtDate(row.report!.date)}.`;
  }
  if (reason.kind === "pending") {
    const more = reason.count - 1;
    return `${firstPending ?? "Pendência do cliente"}${more > 0 ? ` e mais ${more}` : ""}.`;
  }
  return reason.reason;
}

// "Precisa de atenção": what the owner should act on, most urgent first.
export function AdminAttention({
  adminSlug,
  items,
  firstPendingOf,
}: {
  adminSlug: string;
  items: AttentionItem<PortfolioRow>[];
  /** Label of each project's first pending item, keyed by "client/project". */
  firstPendingOf: Record<string, string | undefined>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Precisa de atenção</h2>
        </CardTitle>
        <CardDescription>
          {items.length} {items.length === 1 ? "projeto" : "projetos"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleCheckIcon />
              </EmptyMedia>
              <EmptyTitle>Nada pedindo ação agora</EmptyTitle>
              <EmptyDescription>
                Nenhum projeto parado, sem relatório ou esperando o cliente.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="gap-1">
            {items.map(({ row, reasons }) => (
              <Item
                key={`${row.clientId}/${row.id}`}
                render={<a href={adminProjectHref(adminSlug, row.clientId, row.id)} />}
                className="items-start hover:bg-muted/50"
                style={{ "--brand": row.brandColor } as CSSProperties}
              >
                <ItemMedia className="pt-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full bg-(--brand)"
                  />
                </ItemMedia>
                <ItemContent className="gap-1.5">
                  <ItemTitle>
                    <span className="font-normal text-muted-foreground">
                      {row.clientName} ·
                    </span>
                    {row.name}
                  </ItemTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {reasons.map((reason) => (
                      <AdminReasonBadge key={reason.kind} reason={reason} />
                    ))}
                  </div>
                  <ItemDescription className="text-pretty">
                    {detail(row, reasons[0], firstPendingOf[`${row.clientId}/${row.id}`])}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="self-center">
                  <ChevronRightIcon className="text-muted-foreground" />
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
