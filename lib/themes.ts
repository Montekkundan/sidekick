import type { ComponentType } from "react"

export type ThemeConfig = {
  name: string
  label: string
  description?: string
}

export type ThemeComponents = {
  ThemedPromptInput: ComponentType
  ThemedSidekick: ComponentType
}

export type Theme = ThemeConfig & {
  components: () => Promise<ThemeComponents>
}

export const THEMES: Theme[] = [
  {
    name: "default",
    label: "Default",
    description: "Clean, minimal default theme",
    components: () => import("@/registry/new-york/themes/default"),
  },
  {
    name: "cursor",
    label: "Cursor",
    description: "Cursor IDE-inspired chat with model selector and tools",
    components: () => import("@/registry/new-york/themes/cursor"),
  },
]

export function getTheme(name: string): Theme | undefined {
  return THEMES.find((theme) => theme.name === name)
}

export function getThemeConfig(name: string): ThemeConfig | undefined {
  const theme = getTheme(name)
  return theme ? { name: theme.name, label: theme.label, description: theme.description } : undefined
}

