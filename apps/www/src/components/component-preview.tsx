import fs from "node:fs/promises";
import Image from "next/image";
import { Suspense } from "react";

import { ComponentPreviewTabs } from "@/components/component-preview-tabs";
import { ComponentSource } from "@/components/component-source";

// Lazy load components from the registry blocks
async function loadComponent(
  name: string
): Promise<React.ComponentType | null> {
  try {
    // Try to dynamically import based on common patterns
    const patterns = [
      () => import(`@/registry/new-york/examples/${name}-demo`),
      () => import(`@/registry/new-york/blocks/${name}`),
    ];

    for (const pattern of patterns) {
      try {
        const mod = await pattern();
        const keys = Object.keys(mod);
        const firstKey = keys[0];
        return mod.default || (firstKey ? mod[firstKey] : null);
      } catch {}
    }
    return null;
  } catch {
    return null;
  }
}

export async function ComponentPreview({
  name,
  type,
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
  align?: "center" | "start" | "end";
  description?: string;
  hideCode?: boolean;
  type?: "block" | "component" | "example";
  chromeLessOnMobile?: boolean;
  previewClassName?: string;
}) {
  const Component = await loadComponent(name);

  // Apply p-10 padding specifically for prompt-input component
  const computedPreviewClassName =
    previewClassName ?? (name === "prompt-input" ? "p-10" : undefined);

  if (!Component) {
    return (
      <p className="mt-6 text-muted-foreground text-sm">
        Component{" "}
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {name}
        </code>{" "}
        not found in registry.
      </p>
    );
  }

  if (type === "block") {
    return (
      <div className="relative aspect-[4/2.5] w-full overflow-hidden rounded-md border md:-mx-1">
        <Image
          alt={name}
          className="absolute top-0 left-0 z-20 w-[970px] max-w-none bg-background sm:w-[1280px] md:hidden dark:hidden md:dark:hidden"
          height={900}
          src={`/r/styles/new-york/${name}-light.png`}
          width={1440}
        />
        <Image
          alt={name}
          className="absolute top-0 left-0 z-20 hidden w-[970px] max-w-none bg-background sm:w-[1280px] md:hidden dark:block md:dark:hidden"
          height={900}
          src={`/r/styles/new-york/${name}-dark.png`}
          width={1440}
        />
        <div className="absolute inset-0 hidden w-[1600px] bg-background md:block">
          <iframe className="size-full" src={`/view/new-york/${name}`} />
        </div>
      </div>
    );
  }

  const exampleSrc = `src/registry/new-york/examples/${name}-demo.tsx`;
  const hasExampleSource = await fs
    .access(exampleSrc)
    .then(() => true)
    .catch(() => false);

  return (
    <ComponentPreviewTabs
      align={align}
      chromeLessOnMobile={chromeLessOnMobile}
      className={className}
      component={
        <Suspense
          fallback={
            <div className="h-32 w-full animate-pulse rounded bg-muted" />
          }
        >
          <Component />
        </Suspense>
      }
      hideCode={hideCode}
      previewClassName={computedPreviewClassName}
      source={
        hasExampleSource ? (
          <ComponentSource
            collapsible={false}
            src={exampleSrc}
            title={`components/ui/${name}.demo.tsx`}
          />
        ) : (
          <ComponentSource collapsible={false} name={name} />
        )
      }
      {...props}
    />
  );
}
