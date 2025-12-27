"use client"

import * as React from "react"
import { GalleryHorizontalIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useLayout } from "@/hooks/use-layout"
import { Button } from "@/registry/new-york/ui/button"

export function SiteConfig({ className }: React.ComponentProps<typeof Button>) {
  const { layout, setLayout } = useLayout()

  console.log("Current layout:", layout)
  

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        const newLayout = layout === "fixed" ? "full" : "fixed"
        setLayout(newLayout)
      }}
      className={cn("size-8", className)}
      title="Toggle layout"
    >
      <span className="sr-only">Toggle layout</span>
      <GalleryHorizontalIcon />
    </Button>
  )
}
