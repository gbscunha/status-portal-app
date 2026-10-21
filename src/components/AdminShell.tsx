import { Fragment, type ReactNode } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ClientGroup } from "@/lib/admin";
import { AdminSidebar, type AdminCurrent } from "./AdminSidebar";

export type Crumb = { label: string; href?: string };

// Frame of every admin page: sidebar (with the deploy date in its footer),
// top bar (trail + the one primary action) and the content column. No
// cookies: the sidebar starts open and the page stays fully static.
export function AdminShell({
  adminSlug,
  groups,
  current,
  crumbs,
  action,
  buildDate,
  children,
}: {
  adminSlug: string;
  groups: ClientGroup[];
  current: AdminCurrent;
  crumbs: Crumb[];
  action?: { href: string; label: string };
  buildDate: string;
  children: ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <AdminSidebar
          adminSlug={adminSlug}
          groups={groups}
          current={current}
          buildDate={buildDate}
        />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4" />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList>
                {crumbs.map((crumb, i) => (
                  <Fragment key={i}>
                    {i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem
                      className={i < crumbs.length - 1 ? "hidden md:inline-flex" : undefined}
                    >
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            {action && (
              <Button
                className="ml-auto"
                nativeButton={false}
                render={<a href={action.href} />}
              >
                {action.label}
                <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
            )}
          </header>
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
