import type { Client, Project, Snapshot } from "@/lib/types";
import { ReportHeader } from "./ReportHeader";
import { ProgressList } from "./ProgressList";
import { Legend } from "./Legend";
import { NextSteps } from "./NextSteps";
import { Section } from "./Section";
import { Timeline } from "./Timeline";
import { Footer } from "./Footer";

type Props = {
  client: Client;
  project: Project;
  snapshot: Snapshot;
  /** Datas de todos os snapshots do projeto, mais recente primeiro. */
  history: string[];
};

export function StatusReport({ client, project, snapshot, history }: Props) {
  return (
    <article className="report wrap">
      <ReportHeader
        kicker={`${client.name} · ${project.name}`}
        title={snapshot.title}
        subtitle={snapshot.subtitle}
        date={snapshot.date}
        platform={project.platform}
        phase={snapshot.phase}
      />
      <ProgressList items={snapshot.progress} />
      <Legend />
      {snapshot.nextSteps && <NextSteps {...snapshot.nextSteps} />}
      {snapshot.sections.map((section) => (
        <Section key={section.number} {...section} />
      ))}
      {history.length > 1 && (
        <Timeline dates={history} currentDate={snapshot.date} />
      )}
      <Footer client={client} />
    </article>
  );
}
