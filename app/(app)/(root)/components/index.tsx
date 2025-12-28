"use client"

import { useThemeConfig } from "@/components/active-theme"
import { getTheme, type ThemeComponents } from "@/lib/themes"
import { Suspense, useEffect, useState } from "react"
import { Skeleton } from "@/registry/new-york/ui/skeleton"

function ThemeSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  )
}

export function RootComponents() {
  const { activeTheme } = useThemeConfig()
  const [components, setComponents] = useState<ThemeComponents | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const theme = getTheme(activeTheme)
    if (theme) {
      theme.components().then((mod) => {
        setComponents({
          ThemedPromptInput: mod.ThemedPromptInput,
          ThemedSidekick: mod.ThemedSidekick,
        })
        setLoading(false)
      })
    }
  }, [activeTheme])

  if (loading || !components) {
    return (
      <div className="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8">
        <div className="flex flex-col gap-6">
          <ThemeSkeleton />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-[600px] w-full max-w-md rounded-lg" />
        </div>
      </div>
    )
  }

  const { ThemedPromptInput, ThemedSidekick } = components

  return (
    <div className="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8">
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <ThemedPromptInput />
      </div>
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <ThemedSidekick />
      </div>
    </div>
  )
}
