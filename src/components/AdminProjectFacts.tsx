import type { ReactNode } from "react";
import type { Client, Lifecycle, Project } from "@/lib/types";
import type { ProjectSummary } from "@/lib/admin";
import { formatPtDate } from "@/lib/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminLifecycleBadge } from "./AdminLifecycleBadge";

// Side column: what the project is and who sees it. WhatsApp and e-mail are
// ITGraph's channels shown on the client page, not the client's contacts.
export function AdminProjectFacts({
  client,
  project,
  lifecycle,
  summary,
}: {
  client: Client;
  project: Project;
  lifecycle: Lifecycle;
  summary: ProjectSummary | null;
}) {
  const channels = [client.whatsapp && "WhatsApp", client.email && "E-mail"]
    .filter(Boolean)
    .join(" · ");
  const note =
    lifecycle.state === "paused"
      ? `${lifecycle.reason}${lifecycle.since ? ` Desde ${formatPtDate(lifecycle.since)}.` : ""}`
      : lifecycle.state === "closed"
        ? lifecycle.reason
        : undefined;

  const facts: [string, ReactNode][] = [
    [
      "Cliente",
      <span key="c" className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-(--brand)" />
        {client.name}
      </span>,
    ],
    ["Fornecedor", client.vendor],
  ];
  if (project.platform) facts.push(["Plataforma", project.platform]);
  if (summary?.latest.phase) facts.push(["Fase", summary.latest.phase]);
  if (summary) {
    facts.push(["Primeiro relatório", formatPtDate(summary.firstReport)]);
    facts.push(["Último relatório", formatPtDate(summary.lastReport)]);
    facts.push(["Relatórios publicados", summary.history.length]);
  }
  if (project.contractUrl) {
    facts.push([
      "Contrato",
      <a
        key="k"
        href={project.contractUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4"
      >
        Abrir contrato
      </a>,
    ]);
  }
  if (client.contact) facts.push(["Pessoa de contato", client.contact]);
  facts.push(["Canais na página do cliente", channels || "nenhum"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Projeto</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col divide-y text-sm">
          {facts.map(([term, value]) => (
            <div key={term} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2.5 first:pt-0">
              <dt className="text-muted-foreground">{term}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
          <div className="flex flex-col gap-2 py-2.5 last:pb-0">
            <dt className="text-muted-foreground">Ciclo de vida</dt>
            <dd className="flex flex-col items-start gap-1.5">
              <AdminLifecycleBadge lifecycle={lifecycle} />
              {note && <p className="text-muted-foreground">{note}</p>}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
