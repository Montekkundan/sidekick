"use client";

import { usePathname } from "next/navigation";
import { Download, Share2, Sparkles } from "lucide-react";

import { Button } from "@/registry/new-york/ui/button";
import { ModeSwitcher } from "@/components/mode-switcher";

function dispatchBuilderEvent(name: string) {
  window.dispatchEvent(new CustomEvent(name));
}

export function BuilderHeaderActions() {
  const pathname = usePathname() ?? "";
  const showChatActions = /^\/builder\/[^/]+$/.test(pathname);

  return (
    <div className="flex items-center gap-2">
      <ModeSwitcher />
      {showChatActions && (
        <>
          <Button
            className="gap-1"
            onClick={() => dispatchBuilderEvent("builder:share")}
            size="sm"
            variant="ghost"
          >
            <Share2 className="size-4" />
            Share
          </Button>
          <Button
            className="gap-1"
            onClick={() => dispatchBuilderEvent("builder:download")}
            size="sm"
          >
            <Download className="size-4" />
            Download
          </Button>
          <Button
            className="gap-1"
            onClick={() => dispatchBuilderEvent("builder:ask-ai")}
            size="sm"
            variant="outline"
          >
            <Sparkles className="size-4" />
            Ask AI
          </Button>
        </>
      )}
    </div>
  );
}
