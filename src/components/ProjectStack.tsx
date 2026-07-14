import type { CSSProperties } from "react";
import type { Client } from "@/lib/types";
import { getProjectSnapshots } from "@/lib/content";
import { StatusReport } from "./StatusReport";

// Empilha todos os projetos do cliente na mesma página (v1: sem seletor).
// Cada projeto renderiza seu snapshot mais recente. A cor da marca é injetada
// uma vez, como CSS var --brand, no wrapper do cliente.
export function ProjectStack({ client }: { client: Client }) {
  const reports = client.projects
    .map((project) => {
      const snapshots = getProjectSnapshots(client.id, project.id);
      const latest = snapshots[0];
      if (!latest) return null;
      return {
        project,
        snapshot: latest,
        history: snapshots.map((s) => s.date),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const brandStyle = { "--brand": client.brandColor } as CSSProperties;

  return (
    <div className="client" style={brandStyle}>
      {reports.map(({ project, snapshot, history }) => (
        <StatusReport
          key={project.id}
          client={client}
          project={project}
          snapshot={snapshot}
          history={history}
        />
      ))}
    </div>
  );
}
