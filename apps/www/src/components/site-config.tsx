"use client";

import { GalleryHorizontalIcon } from "lucide-react";
import type * as React from "react";
import { useLayout } from "@/hooks/use-layout";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/new-york/ui/button";

export function SiteConfig({ className }: React.ComponentProps<typeof Button>) {
  const { layout, setLayout } = useLayout();

  return (
    <Button
      className={cn("size-8", className)}
      onClick={() => {
        const newLayout = layout === "fixed" ? "full" : "fixed";
        setLayout(newLayout);
      }}
      size="icon"
      title="Toggle layout"
      variant="ghost"
    >
      <span className="sr-only">Toggle layout</span>
      <GalleryHorizontalIcon />
    </Button>
  );
}
