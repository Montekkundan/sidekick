/* eslint-disable react-hooks/static-components */
import * as React from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { siteConfig } from "@/lib/config"
import {
  getRegistryItem,
  getRegistryItems,
} from "@/lib/registry"
import { absoluteUrl } from "@/lib/utils"
import { getStyle, legacyStyles, type Style } from "@/registry/_legacy-styles"

// Dynamic component imports
const componentMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "dashboard-01": () => import("@/registry/new-york/blocks/dashboard-01/page"),
  "sidekick-01": () => import("@/registry/new-york/blocks/sidekick-01/page"),
  "sidekick-02": () => import("@/registry/new-york/blocks/sidekick-02/page"),
  "sidekick-03": () => import("@/registry/new-york/blocks/sidekick-03/page"),
  "prompt-input-01": () => import("@/registry/new-york/blocks/prompt-input-01/page"),
  "prompt-input-02": () => import("@/registry/new-york/blocks/prompt-input-02/page"),
  "prompt-input-03": () => import("@/registry/new-york/blocks/prompt-input-03/page"),
}

async function getRegistryComponent(name: string) {
  const importFn = componentMap[name]
  if (!importFn) return null
  
  try {
    const module = await importFn()
    return module.default
  } catch {
    return null
  }
}

import { ComponentPreview } from "./component-preview"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const getCachedRegistryItem = React.cache(
  async (name: string) => {
    return await getRegistryItem(name)
  }
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    style: string
    name: string
  }>
}): Promise<Metadata> {
  const { style: styleName, name } = await params
  const style = getStyle(styleName)

  if (!style) {
    return {}
  }

  const item = await getCachedRegistryItem(name)

  if (!item) {
    return {}
  }

  const title = item.name
  const description = item.description

  return {
    title: item.name,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/view/${style.name}/${item.name}`),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
      creator: "@shadcn",
    },
  }
}

export async function generateStaticParams() {
  const items = await getRegistryItems()
  const params: Array<{ style: string; name: string }> = []

  for (const style of legacyStyles) {
    for (const item of items) {
      if (
        [
          "registry:block",
          "registry:component",
          "registry:example",
          "registry:internal",
        ].includes(item.type)
      ) {
        params.push({
          style: style.name,
          name: item.name,
        })
      }
    }
  }

  return params
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{
    style: string
    name: string
  }>
}) {
  const { style: styleName, name } = await params
  const style = getStyle(styleName)

  if (!style) {
    return notFound()
  }

  const item = await getCachedRegistryItem(name)
  const Component = await getRegistryComponent(name)

  if (!item || !Component) {
    return notFound()
  }

  return (
    <ComponentPreview>
      <Component />
    </ComponentPreview>
  )
}
