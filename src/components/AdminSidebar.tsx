import {
  ChevronRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CirclePauseIcon,
  CircleXIcon,
  ClockIcon,
  LayoutGridIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { formatPtDate } from "@/lib/format";

export type AdminCurrent =
  | { kind: "overview" }
  | { kind: "project"; clientId: string; projectId: string };

// Project state as an icon shape (no color scheme): the owner reads the
// sidebar by icons; the words stay for screen readers.
const SIGNAL_ICON: Record<RowSignal, typeof CircleDotIcon> = {
  // Dot = em andamento, the same meaning it has in the fronts list (an empty
  // circle there is "planejado").
  active: CircleDotIcon,
  pending: CircleAlertIcon,
  stale: ClockIcon,
  none: ClockIcon,
  paused: CirclePauseIcon,
  delivered: CircleCheckIcon,
  closed: CircleXIcon,
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

function ClientTile({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-sidebar-foreground/10 text-[10px] font-semibold text-sidebar-foreground"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

// Server Component: every prop handed to the client primitives is plain data
// or an element, never a function. Active state comes from the route.
// Collapses to an icon rail (tooltips carry the names); each client's project
// list folds open or closed. Nothing persists: every page starts expanded.
// Clients show a monochrome initial tile. In the rail, where a project list
// cannot open, the client button becomes a link to its section of the overview
// (a CSS swap on the sidebar's data-collapsible, no extra JS).
export function AdminSidebar({
  adminSlug,
  groups,
  current,
  buildDate,
}: {
  adminSlug: string;
  groups: ClientGroup[];
  current: AdminCurrent;
  buildDate: string;
}) {
  const overviewHref = `/a/${adminSlug}`;
  const onOverview = current.kind === "overview";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="ITGraph · Painel interno"
              render={<a href={overviewHref} />}
            >
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
                  tooltip="Visão geral"
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
                <Collapsible
                  key={group.clientId}
                  defaultOpen
                  render={<SidebarMenuItem />}
                >
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton className="group-data-[collapsible=icon]:hidden" />
                    }
                  >
                    <ClientTile name={group.clientName} />
                    <span className="font-medium">{group.clientName}</span>
                    <ChevronRightIcon className="ml-auto transition-transform in-data-panel-open:rotate-90" />
                  </CollapsibleTrigger>
                  <SidebarMenuButton
                    tooltip={group.clientName}
                    isActive={
                      current.kind === "project" &&
                      current.clientId === group.clientId
                    }
                    className="hidden group-data-[collapsible=icon]:flex"
                    render={
                      <a href={`${overviewHref}#cliente-${group.clientId}`} />
                    }
                  >
                    <ClientTile name={group.clientName} />
                    <span className="sr-only">{group.clientName}</span>
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {group.rows.map((row) => {
                        const active =
                          current.kind === "project" &&
                          current.clientId === group.clientId &&
                          current.projectId === row.id;
                        const signal = rowSignal(row);
                        const Icon = SIGNAL_ICON[signal];
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
                              <Icon aria-hidden="true" />
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
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <p className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Dados do último deploy - {formatPtDate(buildDate)}.
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
