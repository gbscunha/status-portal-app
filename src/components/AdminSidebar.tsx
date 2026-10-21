import type { CSSProperties } from "react";
import { LayoutGridIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  type ClientGroup,
  type RowSignal,
  adminProjectHref,
  rowSignal,
} from "@/lib/admin";
import { AdminStatusDot, type DotTone } from "./AdminStatusDot";

export type AdminCurrent =
  | { kind: "overview" }
  | { kind: "project"; clientId: string; projectId: string };

const SIGNAL_TONE: Record<RowSignal, DotTone> = {
  active: "done",
  pending: "prog",
  stale: "alert",
  none: "alert",
  paused: "hold",
  delivered: "plan",
  closed: "plan",
};

const SIGNAL_TEXT: Record<RowSignal, string> = {
  active: "em dia",
  pending: "com pendências do cliente",
  stale: "parado",
  none: "sem relatório",
  paused: "em espera",
  delivered: "concluído",
  closed: "encerrado",
};

// Server Component: every prop handed to the client primitives is plain data
// or an element, never a function. Active state comes from the route.
export function AdminSidebar({
  adminSlug,
  groups,
  current,
}: {
  adminSlug: string;
  groups: ClientGroup[];
  current: AdminCurrent;
}) {
  const overviewHref = `/a/${adminSlug}`;
  const onOverview = current.kind === "overview";

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href={overviewHref} />}>
              <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                IT
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">ITGraph</span>
                <span className="truncate text-xs text-muted-foreground">
                  Painel interno
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label="Painel" className="contents">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={onOverview}
                  render={
                    <a
                      href={overviewHref}
                      aria-current={onOverview ? "page" : undefined}
                    />
                  }
                >
                  <LayoutGridIcon />
                  <span>Visão geral</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Clientes</SidebarGroupLabel>
            <SidebarMenu>
              {groups.map((group) => (
                <SidebarMenuItem
                  key={group.clientId}
                  style={{ "--brand": group.brandColor } as CSSProperties}
                >
                  <SidebarMenuButton
                    render={
                      <a href={`${overviewHref}#cliente-${group.clientId}`} />
                    }
                  >
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 rounded-full bg-(--brand)"
                    />
                    <span className="font-medium">{group.clientName}</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {group.rows.map((row) => {
                      const active =
                        current.kind === "project" &&
                        current.clientId === group.clientId &&
                        current.projectId === row.id;
                      const signal = rowSignal(row);
                      return (
                        <SidebarMenuSubItem key={row.id}>
                          <SidebarMenuSubButton
                            isActive={active}
                            href={adminProjectHref(
                              adminSlug,
                              group.clientId,
                              row.id,
                            )}
                            aria-current={active ? "page" : undefined}
                          >
                            <AdminStatusDot tone={SIGNAL_TONE[signal]} />
                            {/* Last child: the button truncates it. */}
                            <span>
                              {row.name}
                              <span className="sr-only">
                                , {SIGNAL_TEXT[signal]}
                              </span>
                            </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </nav>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
