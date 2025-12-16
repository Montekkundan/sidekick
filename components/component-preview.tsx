import Image from "next/image";
import { Suspense } from "react";

import { ComponentPreviewTabs } from "@/components/component-preview-tabs";
import { ComponentSource } from "@/components/component-source";
import { cn } from "@/lib/utils";

// Dynamic component registry - maps component names to their imports
const componentRegistry: Record<string, React.ComponentType> = {};

// Lazy load components from the registry blocks
async function loadComponent(
  name: string
): Promise<React.ComponentType | null> {
  try {
    // Try to dynamically import based on common patterns
    const patterns = [
      () => import(`@/registry/new-york/blocks/${name}/page`),
      () => import(`@/registry/new-york/blocks/${name}/index`),
      () => import(`@/registry/new-york/blocks/${name}/${name}`),
    ];

    for (const pattern of patterns) {
      try {
        const mod = await pattern();
        return mod.default || mod[Object.keys(mod)[0]];
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
}) {
  const Component = await loadComponent(name);

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

  // Special handling for sidekick component - wrap with provider and inset
  if (name === "sidekick") {
    const { SidekickProvider, SidekickInset, SidekickTrigger } = await import(
      "@/registry/new-york/blocks/sidekick"
    );
    const { SparklesIcon } = await import("lucide-react");

    return (
      <div
        className={cn(
          "group relative mt-4 mb-12 flex flex-col gap-2 overflow-hidden rounded-lg border",
          className
        )}
        {...props}
      >
        <div className="h-[600px]" data-slot="preview">
          <Suspense
            fallback={<div className="h-full w-full animate-pulse bg-muted" />}
          >
            <SidekickProvider className="h-full min-h-0" defaultOpen={true}>
              <SidekickInset className="bg-muted/30">
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="size-6 text-primary" />
                    <h2 className="font-semibold text-xl">
                      Welcome to Sidekick
                    </h2>
                  </div>
                  <p className="max-w-md text-center text-muted-foreground">
                    Your AI-powered chat assistant. Toggle the panel with{" "}
                    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
                      ⌘K
                    </kbd>{" "}
                    or use the trigger button.
                  </p>
                  <SidekickTrigger className="mt-4" />
                </div>
              </SidekickInset>
              <Component />
            </SidekickProvider>
          </Suspense>
        </div>
        {!hideCode && (
          <div
            className="[&_[data-rehype-pretty-code-figure]]:!m-0 overflow-hidden [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-[400px]"
            data-slot="code"
          >
            <ComponentSource collapsible={false} name={name} />
          </div>
        )}
      </div>
    );
  }

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
      source={<ComponentSource collapsible={false} name={name} />}
      {...props}
    />
  );
}
