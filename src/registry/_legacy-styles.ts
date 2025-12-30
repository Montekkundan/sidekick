export const legacyStyles = [
  {
    name: "new-york",
    title: "New York",
  },
] as const

export type Style = (typeof legacyStyles)[number]

export async function getActiveStyle() {
  return legacyStyles[0]
}

export function getStyle(name: string) {
  return legacyStyles.find((style) => style.name === name)
}
