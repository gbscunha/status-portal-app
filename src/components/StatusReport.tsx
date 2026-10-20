import type { Client, Project, Snapshot } from "@/lib/types";
import type { TimelineEntry } from "@/lib/summary";
import { finishedReport, isArchived, lifecycleOf } from "@/lib/lifecycle";
import { ReportHeader } from "./ReportHeader";
import { LifecycleNotice } from "./LifecycleNotice";
import { SummaryStrip } from "./SummaryStrip";
import { PendingList } from "./PendingList";
import { ProgressList } from "./ProgressList";
import { Legend } from "./Legend";
import { NextSteps } from "./NextSteps";
import { Section } from "./Section";
import { ScopeMap } from "./ScopeMap";
import { Timeline } from "./Timeline";
import { ContactCta } from "./ContactCta";
import { Footer } from "./Footer";

type Props = {
  client: Client;
  project: Project;
  snapshot: Snapshot;
  /** Snapshot history (date + title), most recent first. */
  history: TimelineEntry[];
};

export function StatusReport({ client, project, snapshot: latest, history }: Props) {
  // Delivered/closed projects show their last report without asks or promises.
  const snapshot = isArchived(project) ? finishedReport(latest) : latest;

  return (
    <article className="report wrap">
      <ReportHeader
        kicker={`${client.name} · ${project.name}`}
        title={snapshot.title}
        subtitle={snapshot.subtitle}
      />
      <SummaryStrip snapshot={snapshot} platform={project.platform} />
      <div className="flow">
        <LifecycleNotice
          lifecycle={lifecycleOf(project)}
          hasPending={(snapshot.pending?.length ?? 0) > 0}
        />
        {snapshot.pending && <PendingList items={snapshot.pending} />}
        <ProgressList items={snapshot.progress} />
        <Legend />
        {project.scope && (
          <ScopeMap scope={project.scope} snapshot={snapshot} />
        )}
        {snapshot.nextSteps && <NextSteps {...snapshot.nextSteps} />}
        {snapshot.sections.map((section) => (
          <Section key={section.number} {...section} />
        ))}
        {history.length > 1 && (
          <Timeline entries={history} currentDate={snapshot.date} />
        )}
      </div>
      <ContactCta client={client} projectName={project.name} variant="footer" />
      <Footer client={client} project={project} />
    </article>
  );
}
