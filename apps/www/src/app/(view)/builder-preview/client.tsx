"use client";

import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import {
  builderRegistry,
  fallbackComponent,
  SidebarProvider,
  Toaster,
  TooltipProvider,
  useInteractiveState,
} from "@repo/design-system/lib/registry";
import { useEffect, useState } from "react";

export function BuilderPreviewClient() {
  const [tree, setTree] = useState<UITree | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useInteractiveState();

  useEffect(() => {
    setMounted(true);
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from same origin
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, payload } = event.data || {};

      if (type === "BUILDER_TREE_UPDATE") {
        setTree(payload.tree);
        setIsLoading(payload.isLoading ?? false);
      }
    };

    window.addEventListener("message", handleMessage);

    // Tell parent we're ready to receive messages
    if (window.parent !== window) {
      window.parent.postMessage({ type: "BUILDER_PREVIEW_READY" }, "*");
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (!tree?.root) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center text-muted-foreground/50 text-sm">
        {isLoading ? "generating..." : "waiting..."}
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="fade-in flex min-h-full w-full animate-in items-center justify-center p-4 duration-200">
      <TooltipProvider>
        <SidebarProvider>
          <JSONUIProvider
            registry={
              builderRegistry as Parameters<
                typeof JSONUIProvider
              >[0]["registry"]
            }
          >
            <Renderer
              fallback={
                fallbackComponent as Parameters<typeof Renderer>[0]["fallback"]
              }
              loading={isLoading}
              registry={
                builderRegistry as Parameters<typeof Renderer>[0]["registry"]
              }
              tree={tree}
            />
          </JSONUIProvider>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </div>
  );
}
