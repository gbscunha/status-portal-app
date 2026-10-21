"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { useLocationHash } from "@/hooks/use-location-hash";
import { activePanel } from "@/lib/client-nav";
import { cn } from "@/lib/utils";

/** One project's report, rendered on the server and only toggled here. */
export type Panel = { id: string; content: ReactNode };

// Owns the page state of the client pages: the URL hash says which project
// panel shows (deep-linkable, the back button switches projects, no routing
// dependency). Reports stay Server Components passed in as content. The sidebar
// items and the breadcrumb read the same hash (ProjectNavItem, ProjectCrumb).
// Inactive panels use `hidden` (display:none, so screen readers skip them) and
// come back for print: the PDF carries every project.
export function ProjectSwitcher({ panels }: { panels: Panel[] }) {
  const ids = useMemo(() => panels.map((panel) => panel.id), [panels]);
  const active = activePanel(ids, useLocationHash());

  // On a switch the user asked for (a click, back or forward — hashchange
  // never fires on load, so a deep link is not a switch), start the new report
  // from its top and move focus to its title, once the panel has re-rendered.
  useEffect(() => {
    function onSwitch() {
      requestAnimationFrame(() => {
        const id = activePanel(ids, window.location.hash);
        window.scrollTo({ top: 0 });
        document.getElementById(`titulo-${id}`)?.focus({ preventScroll: true });
      });
    }
    window.addEventListener("hashchange", onSwitch);
    return () => window.removeEventListener("hashchange", onSwitch);
  }, [ids]);

  if (panels.length < 2) return <>{panels[0]?.content}</>;

  return panels.map((panel, i) => (
    <div
      key={panel.id}
      id={`painel-${panel.id}`}
      className={cn(
        panel.id !== active && "hidden print:block",
        i > 0 && "print:break-before-page",
      )}
    >
      {panel.content}
    </div>
  ));
}
