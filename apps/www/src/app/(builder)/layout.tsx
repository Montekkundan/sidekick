import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/registry/new-york/ui/breadcrumb"
import { Separator } from "@/registry/new-york/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/new-york/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { BuilderHeaderActions } from "./components/builder-header-actions"
import {
  SidekickInset,
  SidekickProvider,
} from "@/registry/new-york/blocks/sidekick"
import { BuilderSidekick } from "./components/builder-sidekick"

export default function WidgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-x-hidden">
          <SidekickProvider defaultOpen={false}>
            <SidekickInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                <div className="flex items-center gap-2 px-3">
                  <SidebarTrigger />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          Building Your Application
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <div className="ml-auto flex items-center gap-2 pr-3">
                  <BuilderHeaderActions />
                </div>
              </header>
              {children}
            </SidekickInset>
            <BuilderSidekick />
          </SidekickProvider>
        </SidebarInset>
      </SidebarProvider>
  )
}
