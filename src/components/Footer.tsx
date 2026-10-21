import type { Client, Project } from "@/lib/types";

export function Footer({
  client,
  project,
}: {
  client: Client;
  project?: Project;
}) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs text-muted-foreground">
      <span translate="no">
        {client.name} · {client.vendor}
      </span>
      {project?.contractUrl ? (
        <a
          className="font-medium text-foreground underline-offset-4 hover:underline"
          href={project.contractUrl}
          target="_blank"
          rel="noopener"
        >
          Ver contrato assinado
        </a>
      ) : (
        <span>Documento de acompanhamento</span>
      )}
    </footer>
  );
}
