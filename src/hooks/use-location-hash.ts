import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

// The URL hash ("#ct", or "") as React state: the single source of truth for
// which project panel the client pages show. The server snapshot is "", so the
// prerendered HTML shows the first panel and a deep link switches right after
// hydration. Read by the panels, the sidebar items and the breadcrumb alike.
export function useLocationHash(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
}
