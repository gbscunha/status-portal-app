"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";

/** One tab and its report, kept together so the pairing is structural. */
export type Panel = { id: string; name: string; content: ReactNode };

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

// One of three client islands (with AdminGreeting and PrintButton), and the
// only one that owns page state. Reports stay Server
// Components: the server renders them all as panel content and this component
// only toggles which panel is visible. The URL hash is the single source of
// truth (deep-linkable, back button navigates tabs, no routing dependency).
export function ProjectSwitcher({ panels }: { panels: Panel[] }) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash.slice(1),
    () => "",
  );

  if (panels.length < 2) return <>{panels[0]?.content}</>;

  const found = panels.findIndex((panel) => panel.id === hash);
  const active = found === -1 ? 0 : found;

  function select(index: number, focus = false) {
    window.location.assign(`#${panels[index].id}`);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const last = panels.length - 1;
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
    <>
      <div
        className="tabs wrap"
        role="tablist"
        aria-label="Projetos"
        onKeyDown={onKeyDown}
      >
        {panels.map((panel, i) => (
          <button
            key={panel.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${panel.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${panel.id}`}
            tabIndex={i === active ? 0 : -1}
            className={`tab${i === active ? " active" : ""}`}
            onClick={() => select(i)}
          >
            {panel.name}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div
          key={panel.id}
          role="tabpanel"
          id={`panel-${panel.id}`}
          aria-labelledby={`tab-${panel.id}`}
          hidden={i !== active}
        >
          {panel.content}
        </div>
      ))}
    </>
  );
}
