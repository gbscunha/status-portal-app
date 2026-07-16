import type { Client, Project, Snapshot } from "@/lib/types";
import { ReportHeader } from "./ReportHeader";
import { SummaryStrip } from "./SummaryStrip";
import { PendingList } from "./PendingList";
import { ProgressList } from "./ProgressList";
import { Legend } from "./Legend";
import { NextSteps } from "./NextSteps";
import { Section } from "./Section";
import { Timeline, type TimelineEntry } from "./Timeline";
import { ContactCta } from "./ContactCta";
import { Footer } from "./Footer";

type Props = {
  client: Client;
  project: Project;
  snapshot: Snapshot;
  /** Snapshot history (date + title), most recent first. */
  history: TimelineEntry[];
};

export function StatusReport({ client, project, snapshot, history }: Props) {
  return (
    <article className="report wrap">
      <ReportHeader
        kicker={`${client.name} · ${project.name}`}
        title={snapshot.title}
        subtitle={snapshot.subtitle}
      />
      <SummaryStrip snapshot={snapshot} platform={project.platform} />
      <div className="flow">
        {snapshot.pending && <PendingList items={snapshot.pending} />}
        <ProgressList items={snapshot.progress} />
        <Legend />
        {snapshot.nextSteps && <NextSteps {...snapshot.nextSteps} />}
        {snapshot.sections.map((section) => (
          <Section key={section.number} {...section} />
        ))}
        {history.length > 1 && (
          <Timeline entries={history} currentDate={snapshot.date} />
        )}
      </div>
      <ContactCta client={client} projectName={project.name} variant="footer" />
      <Footer client={client} />
    </article>
  );
}
