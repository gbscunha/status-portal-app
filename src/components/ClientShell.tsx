import { Fragment, type CSSProperties, type ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Client } from "@/lib/types";
import type { ClientNav } from "@/lib/client-nav";
import { ClientSidebar } from "./ClientSidebar";
import { ContactCta } from "./ContactCta";
import { PrintButton } from "./PrintButton";
import { ProjectCrumb } from "./ProjectCrumb";

export type Crumb = { label: string; href?: string };

// Frame of every client page, the same as the admin's: sidebar with the
// client's projects, top bar (trail + PDF and contact) and the content column.
// Sets the brand color (--brand) once for the page. When the page has project
// panels, the trail ends with the one the hash shows (ProjectCrumb); on a phone
// only that last item stays. The top bar never prints.
export function ClientShell({
  client,
  nav,
  crumbs,
  projects,
  printable,
  children,
}: {
  client: Client;
  nav: ClientNav;
  crumbs: Crumb[];
  /** This page's panels, in order: the trail names the active one. */
  projects: { id: string; name: string }[];
  printable: boolean;
  children: ReactNode;
}) {
  const brandStyle = { "--brand": client.brandColor } as CSSProperties;
  const hasProject = projects.length > 0;

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen style={brandStyle}>
        <ClientSidebar client={client} nav={nav} />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 lg:px-6 print:hidden">
            <SidebarTrigger className="-ml-1" />
            {/* my-auto: the primitive's self-stretch would pin the 16px rule
                to the top of the bar. */}
            <Separator orientation="vertical" className="my-auto mr-2 data-vertical:h-4" />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList>
                {crumbs.map((crumb, i) => {
                  const last = !hasProject && i === crumbs.length - 1;
                  return (
                    <Fragment key={i}>
                      {i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                      <BreadcrumbItem
                        className={last ? undefined : "hidden md:inline-flex"}
                      >
                        {crumb.href && !last ? (
                          <BreadcrumbLink href={crumb.href} translate="no">
                            {crumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage translate="no">{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  );
                })}
                {hasProject && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <ProjectCrumb projects={projects} />
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {printable && <PrintButton />}
              <ContactCta client={client} variant="compact" />
            </div>
          </header>
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
