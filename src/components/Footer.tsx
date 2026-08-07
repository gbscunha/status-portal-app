import type { Client, Project } from "@/lib/types";

export function Footer({
  client,
  project,
}: {
  client: Client;
  project?: Project;
}) {
  return (
    <footer>
      <span translate="no">
        {client.name} · {client.vendor}
      </span>
      {project?.contractUrl ? (
        <a
          className="footer-link"
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
