"use client";

import { Children, useRef, useSyncExternalStore, type ReactNode } from "react";

type Tab = { id: string; name: string };

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

// One of three client islands (with AdminGreeting and PrintButton), and the
// only one that owns page state. Reports stay Server
// Components: the server renders them all as children and this component
// only toggles which panel is visible. The URL hash is the single source of
// truth (deep-linkable, back button navigates tabs, no routing dependency).
export function ProjectSwitcher({
  tabs,
  children,
}: {
  tabs: Tab[];
  children: ReactNode;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash.slice(1),
    () => "",
  );
  const panels = Children.toArray(children);

  if (tabs.length < 2) return <>{children}</>;

  const found = tabs.findIndex((tab) => tab.id === hash);
  const active = found === -1 ? 0 : found;

  function select(index: number, focus = false) {
    window.location.assign(`#${tabs[index].id}`);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const last = tabs.length - 1;
    const moves: Record<string, number> = {
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowRight: active === last ? 0 : active + 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  }

  return (
    <div className="switcher">
      <div
        className="tabs wrap"
        role="tablist"
        aria-label="Projetos"
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${tab.id}`}
            tabIndex={i === active ? 0 : -1}
            className={`tab${i === active ? " active" : ""}`}
            onClick={() => select(i)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div
          key={tabs[i].id}
          role="tabpanel"
          id={`panel-${tabs[i].id}`}
          aria-labelledby={`tab-${tabs[i].id}`}
          hidden={i !== active}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
