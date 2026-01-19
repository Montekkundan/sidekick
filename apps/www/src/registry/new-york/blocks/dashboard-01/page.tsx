"use client";
import type React from "react";
import { AppSidebar } from "@/registry/new-york/blocks/dashboard-01/components/app-sidebar";
import { ChartAreaInteractive } from "@/registry/new-york/blocks/dashboard-01/components/chart-area-interactive";
import { DataTable } from "@/registry/new-york/blocks/dashboard-01/components/data-table";
import { SectionCards } from "@/registry/new-york/blocks/dashboard-01/components/section-cards";
import { SiteHeader } from "@/registry/new-york/blocks/dashboard-01/components/site-header";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input";
import {
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
  SidekickInset,
  SidekickProvider,
  SidekickTrigger,
} from "@/registry/new-york/blocks/sidekick";
import { SidebarInset, SidebarProvider } from "@/registry/new-york/ui/sidebar";

import data from "./data.json";

export default function Page() {
  return (
    <SidekickProvider>
      <div className="flex h-svh w-full overflow-hidden">
        <SidebarProvider
          className="flex-1"
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidekickInset>
            <SidebarInset className="overflow-hidden">
              <SiteHeader />
              <div className="flex flex-1 flex-col overflow-auto text-foreground">
                <div className="@container/main flex flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 text-foreground md:gap-6 md:py-6">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                      <ChartAreaInteractive />
                    </div>
                    <DataTable data={data} />
                  </div>
                </div>
              </div>
            </SidebarInset>
          </SidekickInset>
        </SidebarProvider>
        <Sidekick side="right">
          <SidekickHeader className="justify-between">
            <h2 className="font-semibold text-foreground text-sm">Sidekick</h2>
            <SidekickTrigger />
          </SidekickHeader>
          <SidekickContent className="p-4">
            <p className="text-muted-foreground text-sm">
              This is the Sidekick panel. You can add your AI chat or other
              tools here.
            </p>
          </SidekickContent>
          <SidekickFooter>
            <PromptInput
              onSubmit={(values) => {
                console.log("Submitted:", values);
              }}
            >
              <PromptInputBody>
                <PromptInputTextarea placeholder="Ask a question..." />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools />
                <PromptInputSubmit />
              </PromptInputFooter>
            </PromptInput>
          </SidekickFooter>
        </Sidekick>
      </div>
    </SidekickProvider>
  );
}
