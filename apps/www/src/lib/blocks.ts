"use server"

import { registryItemSchema } from "shadcn/schema"
import { type RegistryItem, getRegistryItems } from "@/lib/registry"

export async function getAllBlockIds(
  types: string[] = [
    "registry:block",
    "registry:internal",
  ],
  categories: string[] = []
): Promise<string[]> {
  const blocks = await getAllBlocks(types, categories)

  return blocks.map((block) => block.name)
}

export async function getAllBlocks(
  types: string[] = [
    "registry:block",
    "registry:internal",
  ],
  categories: string[] = []
): Promise<RegistryItem[]> {
  // Get all registry items from the registry.json file
  const allBlocks = await getRegistryItems()

  // Validate each block.
  const validatedBlocks = allBlocks
    .map((block) => {
      const result = registryItemSchema.safeParse(block)
      return result.success ? result.data : null
    })
    .filter((block) => block !== null)

  return validatedBlocks.filter(
    (block) =>
      types.includes(block.type) &&
      (categories.length === 0 ||
        block.categories?.some((category) => categories.includes(category))) &&
      !block.name.startsWith("chart-")
  )
}
