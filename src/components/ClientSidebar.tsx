import { ArchiveIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { Client } from "@/lib/types";
import type { ClientNav } from "@/lib/client-nav";
import { ProjectNavItem } from "./ProjectNavItem";

// The client's own projects, nothing else: current ones, then the archived
// group (a single link when none of them has a report). Same frame as the
// admin sidebar — monochrome, read by icon shape, collapsing to an icon rail
// with the names in tooltips. Server Component: the items get plain data.
export function ClientSidebar({ client, nav }: { client: Client; nav: ClientNav }) {
  const localIds = [...nav.projects, ...(nav.archive?.items ?? [])]
    .filter((item) => item.local)
    .map((item) => item.id);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Auto height: the vendor line wraps instead of truncating (the
                icon rail still forces the 32px square). */}
            <SidebarMenuButton
              size="lg"
              tooltip={client.name}
              className="h-auto min-h-12 py-2"
              render={<a href={`/r/${client.slug}`} />}
            >
              <span
                aria-hidden="true"
                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground"
              >
                {client.name.charAt(0).toUpperCase()}
              </span>
              <span className="grid flex-1 text-left leading-tight" translate="no">
                <span className="truncate font-semibold">{client.name}</span>
                <span className="text-xs text-pretty whitespace-normal text-muted-foreground">
                  {client.vendor} · Portal de acompanhamento
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label="Projetos" className="contents">
          {nav.projects.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Projetos</SidebarGroupLabel>
              <SidebarMenu>
                {nav.projects.map((item) => (
                  <ProjectNavItem key={item.id} item={item} localIds={localIds} />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
          {nav.archive && (
            <SidebarGroup>
              <SidebarGroupLabel>Projetos anteriores</SidebarGroupLabel>
              <SidebarMenu>
                {nav.archive.items.length > 0 ? (
                  nav.archive.items.map((item) => (
                    <ProjectNavItem key={item.id} item={item} localIds={localIds} />
                  ))
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Projetos anteriores"
                      isActive={nav.archive.here}
                      render={
                        <a
                          href={nav.archive.href}
                          aria-current={nav.archive.here ? "page" : undefined}
                        />
                      }
                    >
                      <ArchiveIcon aria-hidden="true" />
                      <span>Projetos anteriores</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </nav>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
