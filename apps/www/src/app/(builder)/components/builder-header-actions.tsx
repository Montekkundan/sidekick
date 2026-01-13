"use client";

import { Download, Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { ModeSwitcher } from "@/components/mode-switcher";
import { Button } from "@/registry/new-york/ui/button";

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
        </>
      )}
    </div>
  );
}
