import type { CSSProperties } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type ClientGroup, adminProjectHref } from "@/lib/admin";
import { formatPtDate, relativeDaysPt } from "@/lib/format";
import { LIFECYCLE_LABELS } from "@/lib/lifecycle";
import { LifecycleBadge } from "./LifecycleBadge";

// "Todos os projetos": one table, a tbody (with a header row) per client. Narrow screens keep
// project and progress; the date and state fold under the project name.
export function AdminPortfolio({
  adminSlug,
  groups,
  today,
}: {
  adminSlug: string;
  groups: ClientGroup[];
  today: string;
}) {
  const projectCount = groups.reduce((n, g) => n + g.rows.length, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Todos os projetos</h2>
        </CardTitle>
        <CardDescription>
          {projectCount} projetos · {groups.length} clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Projeto</TableHead>
              <TableHead className="hidden xl:table-cell">Fase</TableHead>
              <TableHead className="hidden md:table-cell">
                Último relatório
              </TableHead>
              <TableHead className="w-28 sm:w-48">Progresso</TableHead>
              <TableHead className="hidden md:table-cell">Situação</TableHead>
            </TableRow>
          </TableHeader>
          {groups.map((group) => (
            <TableBody key={group.clientId}>
              <TableRow
                id={`cliente-${group.clientId}`}
                className="scroll-mt-20 hover:bg-transparent"
                style={{ "--brand": group.brandColor } as CSSProperties}
              >
                <TableHead colSpan={5} scope="rowgroup" className="pt-4">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full bg-(--brand)"
                    />
                    <span className="font-semibold text-foreground">
                      {group.clientName}
                    </span>
                    {group.clientOnline ? (
                      <a
                        href={`/r/${group.clientSlug}`}
                        className="ml-auto inline-flex items-center gap-1 text-xs font-normal text-muted-foreground hover:text-foreground hover:underline"
                      >
                        Página do cliente
                        <ArrowUpRightIcon className="size-3.5" />
                      </a>
                    ) : (
                      <span className="ml-auto text-xs font-normal text-muted-foreground">
                        Página fora do ar
                      </span>
                    )}
                  </div>
                </TableHead>
              </TableRow>
              {group.rows.map((row) => (
                // Only the name is the link, so the row has no hover fill that
                // would promise a whole-row click.
                <TableRow key={row.id} className="hover:bg-transparent">
                  <TableCell className="whitespace-normal">
                    <a
                      href={adminProjectHref(adminSlug, group.clientId, row.id)}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {row.name}
                    </a>
                    <span className="flex flex-wrap gap-x-1 text-xs text-muted-foreground md:hidden">
                      {row.report && (
                        <span className="whitespace-nowrap">
                          {formatPtDate(row.report.date)} ·
                        </span>
                      )}
                      <span className="whitespace-nowrap">
                        {LIFECYCLE_LABELS[row.lifecycle.state]}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="hidden whitespace-normal text-muted-foreground xl:table-cell">
                    {row.report?.phase ?? "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {row.report ? (
                      <>
                        <span className="tabular-nums">
                          {formatPtDate(row.report.date)}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {relativeDaysPt(row.report.date, today)}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">
                        sem relatório
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.report ? (
                      <div className="flex items-center gap-3">
                        <Progress
                          value={row.report.percent}
                          aria-label={`Progresso de ${row.name}`}
                          className="flex-1"
                        />
                        <span className="w-9 text-right text-xs font-medium tabular-nums">
                          {row.report.percent}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <LifecycleBadge lifecycle={row.lifecycle} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ))}
        </Table>
      </CardContent>
    </Card>
  );
}
