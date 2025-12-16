import { promises as fs } from "node:fs"
import path from "node:path"

export type RegistryItem = {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files?: Array<{
    path: string
    content?: string
    type?: string
    target?: string
  }>
}

export async function getRegistryItem(name: string): Promise<RegistryItem | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "r", `${name}.json`)
    const content = await fs.readFile(filePath, "utf-8")
    return JSON.parse(content) as RegistryItem
  } catch {
    return null
  }
}

export async function getRegistryItems(): Promise<RegistryItem[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "r", "registry.json")
    const content = await fs.readFile(filePath, "utf-8")
    const registry = JSON.parse(content) as { items: RegistryItem[] }
    return registry.items ?? []
  } catch {
    return []
  }
}

export function fixImport(content: string): string {
  const regex = /@\/registry\/[\w-]+\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g

  const replacement = (
    _match: string,
    type: string,
    component: string
  ): string => {
    if (type.endsWith("components")) {
      return `@/components/${component}`
    }
    if (type.endsWith("ui")) {
      return `@/components/ui/${component}`
    }
    if (type.endsWith("hooks")) {
      return `@/hooks/${component}`
    }
    if (type.endsWith("lib")) {
      return `@/lib/${component}`
    }
    return _match
  }

  return content.replace(regex, replacement)
}

export type FileTree = {
  name: string
  path?: string
  children?: FileTree[]
}

export function createFileTreeForRegistryItemFiles(
  files: Array<{ path: string; target?: string }>
): FileTree[] {
  const root: FileTree[] = []

  for (const file of files) {
    const filePath = file.target ?? file.path
    const parts = filePath.split("/")
    let currentLevel = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1
      const existingNode = currentLevel.find((node) => node.name === part)

      if (existingNode) {
        if (isFile) {
          existingNode.path = filePath
        } else {
          currentLevel = existingNode.children ?? []
        }
      } else {
        const newNode: FileTree = isFile
          ? { name: part, path: filePath }
          : { name: part, children: [] }

        currentLevel.push(newNode)

        if (!isFile) {
          currentLevel = newNode.children ?? []
        }
      }
    }
  }

  return root
}
