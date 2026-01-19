import { access } from "node:fs/promises";
import path from "node:path";
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
} from "@tabler/icons-react";
import fm from "front-matter";
import { findNeighbour } from "fumadocs-core/page-tree";
import Link from "next/link";
import { notFound } from "next/navigation";
import z from "zod";
import { DocsPageActions } from "@/components/docs-page-actions";
import { DocsTableOfContents, DocsTocScrollArea } from "@/components/docs-toc";

import { source } from "@/lib/source";
import { absoluteUrl } from "@/lib/utils";
import { mdxComponents } from "@/mdx-components";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

async function exists(absolutePath: string) {
  try {
    await access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveDocsMdxRelativePath(slug: string[] | undefined) {
  const slugParts = slug ?? [];
  const slugPath = slugParts.join("/");

  const candidates = slugPath
    ? [`${slugPath}.mdx`, `${slugPath}/index.mdx`, `(root)/${slugPath}.mdx`]
    : ["(root)/index.mdx"];

  for (const relativePath of candidates) {
    const absolutePath = path.join(
      process.cwd(),
      "content",
      "docs",
      relativePath
    );

    if (await exists(absolutePath)) {
      return relativePath;
    }
  }

  return null;
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const doc = page.data;

  if (!(doc.title && doc.description)) {
    notFound();
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(page.url),
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
      creator: "@shadcn",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const doc = page.data;
  const MDX = doc.body;
  const neighbours = findNeighbour(source.pageTree, page.url);

  const raw = await page.data.getText("raw");
  const { attributes } = fm(raw);
  const { links } = z
    .object({
      links: z
        .object({
          doc: z.string().optional(),
          api: z.string().optional(),
        })
        .optional(),
    })
    .parse(attributes);

  const mdxRelativePath = await resolveDocsMdxRelativePath(params.slug);
  const githubUrl = mdxRelativePath
    ? `https://github.com/Montekkundan/sidekick/blob/main/apps/www/content/docs/${mdxRelativePath}`
    : "https://github.com/Montekkundan/sidekick/tree/main/apps/www/content/docs";

  return (
    <div className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-[var(--top-spacing)] shrink-0" />
        <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <h1 className="scroll-m-20 font-semibold text-4xl tracking-tight sm:text-3xl xl:text-4xl">
                  {doc.title}
                </h1>
                <div className="docs-nav fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-border/50 border-t bg-background/80 px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
                  {neighbours.previous && (
                    <Button
                      asChild
                      className="extend-touch-target ml-auto size-8 shadow-none md:size-7"
                      size="icon"
                      variant="secondary"
                    >
                      <Link href={neighbours.previous.url}>
                        <IconArrowLeft />
                        <span className="sr-only">Previous</span>
                      </Link>
                    </Button>
                  )}
                  {neighbours.next && (
                    <Button
                      asChild
                      className="extend-touch-target size-8 shadow-none md:size-7"
                      size="icon"
                      variant="secondary"
                    >
                      <Link href={neighbours.next.url}>
                        <span className="sr-only">Next</span>
                        <IconArrowRight />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              {doc.description && (
                <p className="text-balance text-[1.05rem] text-muted-foreground sm:text-base">
                  {doc.description}
                </p>
              )}
            </div>
            {links ? (
              <div className="flex items-center gap-2 pt-4">
                {links?.doc && (
                  <Badge asChild className="rounded-full" variant="secondary">
                    <a href={links.doc} rel="noreferrer" target="_blank">
                      Docs <IconArrowUpRight />
                    </a>
                  </Badge>
                )}
                {links?.api && (
                  <Badge asChild className="rounded-full" variant="secondary">
                    <a href={links.api} rel="noreferrer" target="_blank">
                      API Reference <IconArrowUpRight />
                    </a>
                  </Badge>
                )}
              </div>
            ) : null}
          </div>
          <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
            <MDX components={mdxComponents} />
          </div>
        </div>
        <div className="mx-auto hidden h-16 w-full max-w-2xl items-center gap-2 px-4 sm:flex md:px-0">
          {neighbours.previous && (
            <Button
              asChild
              className="shadow-none"
              size="sm"
              variant="secondary"
            >
              <Link href={neighbours.previous.url}>
                <IconArrowLeft /> {neighbours.previous.name}
              </Link>
            </Button>
          )}
          {neighbours.next && (
            <Button
              asChild
              className="ml-auto shadow-none"
              size="sm"
              variant="secondary"
            >
              <Link href={neighbours.next.url}>
                {neighbours.next.name} <IconArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--footer-height)+2rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="h-[var(--top-spacing)] shrink-0" />
        {doc.toc?.length ? (
          <DocsTocScrollArea className="max-h-[50%]" contentClassName="px-8">
            <DocsTableOfContents toc={doc.toc} />
            <div className="h-12" />
          </DocsTocScrollArea>
        ) : null}
        <DocsPageActions githubUrl={githubUrl} rawMdx={raw} />
      </div>
    </div>
  );
}
