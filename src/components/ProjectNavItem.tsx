"use client";

import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CirclePauseIcon,
  CircleXIcon,
} from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocationHash } from "@/hooks/use-location-hash";
import {
  type ClientNavItem,
  type ClientSignal,
  activePanel,
} from "@/lib/client-nav";

// Project state as an icon shape, like the admin sidebar (no color scheme);
// the words stay for screen readers. Copied, not imported: the admin's map also
// carries its internal signals (stale, no report).
const SIGNAL_ICON: Record<ClientSignal, typeof CircleDotIcon> = {
  active: CircleDotIcon,
  pending: CircleAlertIcon,
  paused: CirclePauseIcon,
  delivered: CircleCheckIcon,
  closed: CircleXIcon,
};

const SIGNAL_TEXT: Record<ClientSignal, string> = {
  active: "em andamento",
  pending: "aguardando você",
  paused: "em espera",
  delivered: "concluído",
  closed: "encerrado",
};

// A sidebar project link. Local items switch the panel through the hash, so
// their active state comes from it; links to the other page are plain
// navigation. Choosing a project closes the mobile drawer (a no-op on desktop).
export function ProjectNavItem({
  item,
  localIds,
}: {
  item: ClientNavItem;
  /** Ids of the panels on this page, in order: an empty or unknown hash
   *  activates the first one. */
  localIds: string[];
}) {
  const hash = useLocationHash();
  const { setOpenMobile } = useSidebar();
  const active = item.local && activePanel(localIds, hash) === item.id;
  const Icon = SIGNAL_ICON[item.signal];

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={active}
        tooltip={item.name}
        render={
          <a
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={() => setOpenMobile(false)}
          />
        }
      >
        <Icon aria-hidden="true" />
        {/* Last child: the button truncates it. */}
        <span>
          {item.name}
          <span className="sr-only">, {SIGNAL_TEXT[item.signal]}</span>
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
