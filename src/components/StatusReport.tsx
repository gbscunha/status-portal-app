import type { Client, Project, Snapshot } from "@/lib/types";
import type { TimelineEntry } from "@/lib/summary";
import { finishedReport, isArchived, lifecycleOf } from "@/lib/lifecycle";
import { cn } from "@/lib/utils";
import { ReportHeader } from "./ReportHeader";
import { LifecycleNotice } from "./LifecycleNotice";
import { PendingList } from "./PendingList";
import { ProgressList } from "./ProgressList";
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

// One project's report: the tinted header, then the blocks in reading order.
// From 1280px the timeline and the contact move to a side column, like the
// admin's project page; below that everything stacks in the same order.
export function StatusReport({ client, project, snapshot: latest, history }: Props) {
  // Delivered/closed projects show their last report without asks or promises.
  const snapshot = isArchived(project) ? finishedReport(latest) : latest;
  const hasTimeline = history.length > 1;
  const hasContact = Boolean(client.whatsapp || client.email);

  const side = (hasTimeline || hasContact) && (
    <div className="flex flex-col gap-6 xl:sticky xl:top-20">
      {hasTimeline && <Timeline entries={history} currentDate={snapshot.date} />}
      <ContactCta client={client} projectName={project.name} variant="footer" />
    </div>
  );

  return (
    <article className="flex flex-col gap-6">
      <ReportHeader client={client} project={project} snapshot={snapshot} />
      <div
        className={cn(
          "grid items-start gap-6",
          side && "xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]",
        )}
      >
        <div className="flex min-w-0 flex-col gap-6">
          <LifecycleNotice
            lifecycle={lifecycleOf(project)}
            hasPending={(snapshot.pending?.length ?? 0) > 0}
          />
          {snapshot.pending && <PendingList items={snapshot.pending} />}
          <ProgressList items={snapshot.progress} />
          {project.scope && <ScopeMap scope={project.scope} snapshot={snapshot} />}
          {snapshot.nextSteps && <NextSteps {...snapshot.nextSteps} />}
          {snapshot.sections.map((section) => (
            <Section key={section.number} {...section} />
          ))}
        </div>
        {side}
      </div>
      <Footer client={client} project={project} />
    </article>
  );
}
