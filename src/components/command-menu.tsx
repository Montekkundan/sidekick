"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import { IconArrowRight } from "@tabler/icons-react";
import { useDocsSearch } from "fumadocs-core/search/client";
import { CornerDownLeftIcon, SquareDashedIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { copyToClipboardWithMeta } from "@/components/copy-button";
import { useConfig } from "@/hooks/use-config";
import { useMutationObserver } from "@/hooks/use-mutation-observer";
import type { source } from "@/lib/source";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/new-york/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog";
import { Kbd } from "@/registry/new-york/ui/kbd";
import { Separator } from "@/registry/new-york/ui/separator";
import { Spinner } from "@/registry/new-york/ui/spinner";

export function CommandMenu({
  tree,
  blocks,
  navItems,
  ...props
}: DialogProps & {
  tree: typeof source.pageTree;
  blocks?: { name: string; description: string; categories: string[] }[];
  navItems?: { href: string; label: string }[];
}) {
  const router = useRouter();
  const [config] = useConfig();
  const [open, setOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<
    "color" | "page" | "component" | "block" | null
  >(null);
  const [copyPayload, setCopyPayload] = React.useState("");

  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
  });
  const packageManager = config.packageManager || "pnpm";

  // Track search queries with debouncing to avoid excessive tracking.
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const lastTrackedQueryRef = React.useRef<string>("");

  const trackSearchQuery = React.useCallback((query: string) => {
    const trimmedQuery = query.trim();

    // Only track if the query is different from the last tracked query and has content.
    if (trimmedQuery && trimmedQuery !== lastTrackedQueryRef.current) {
      lastTrackedQueryRef.current = trimmedQuery;
    }
  }, []);

  const handleSearchChange = React.useCallback(
    (value: string) => {
      // Clear existing timeout.
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout to debounce both search and tracking.
      searchTimeoutRef.current = setTimeout(() => {
        setSearch(value);
        trackSearchQuery(value);
      }, 500);
    },
    [setSearch, trackSearchQuery]
  );

  // Cleanup timeout on unmount.
  React.useEffect(
    () => () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    },
    []
  );

  const handlePageHighlight = React.useCallback(
    (isComponent: boolean, item: { url: string; name?: React.ReactNode }) => {
      if (isComponent) {
        const componentName = item.url.split("/").pop();
        setSelectedType("component");
        setCopyPayload(
          `${packageManager} dlx shadcn@latest add ${componentName}`
        );
      } else {
        setSelectedType("page");
        setCopyPayload("");
      }
    },
    [packageManager, setSelectedType, setCopyPayload]
  );

  const handleBlockHighlight = React.useCallback(
    (block: { name: string; description: string; categories: string[] }) => {
      setSelectedType("block");
      setCopyPayload(`${packageManager} dlx shadcn@latest add ${block.name}`);
    },
    [setSelectedType, setCopyPayload, packageManager]
  );

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }

      if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
        runCommand(() => {
          if (selectedType === "block") {
            copyToClipboardWithMeta(copyPayload, {
              name: "copy_npm_command",
              properties: { command: copyPayload, pm: packageManager },
            });
          }

          if (selectedType === "page" || selectedType === "component") {
            copyToClipboardWithMeta(copyPayload, {
              name: "copy_npm_command",
              properties: { command: copyPayload, pm: packageManager },
            });
          }
        });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [copyPayload, runCommand, selectedType, packageManager]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "relative h-8 w-full justify-start pl-3 font-normal text-foreground shadow-none hover:bg-muted/50 sm:pr-12 md:w-48 lg:w-56 xl:w-64 dark:bg-card"
          )}
          onClick={() => setOpen(true)}
          variant="outline"
          {...props}
        >
          <span className="hidden lg:inline-flex">Search documentation...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <div className="absolute top-1.5 right-1.5 hidden gap-1 group-has-[[data-slot=designer]]/body:hidden sm:flex">
            <Kbd>⌘I</Kbd>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command
          className="**:data-[slot=command-input]:!h-9 **:data-[slot=command-input-wrapper]:!h-9 rounded-none bg-transparent **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border **:data-[slot=command-input-wrapper]:border-input **:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input]:py-0"
          filter={(value, search, keywords) => {
            handleSearchChange(search);
            const extendValue = value + " " + (keywords?.join(" ") || "");
            if (extendValue.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <div className="relative">
            <CommandInput placeholder="Search documentation..." />
            {query.isLoading && (
              <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 z-10 flex items-center justify-center">
                <Spinner className="size-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="py-12 text-center text-muted-foreground text-sm">
              {query.isLoading ? "Searching..." : "No results found."}
            </CommandEmpty>
            {navItems && navItems.length > 0 && (
              <CommandGroup
                className="!p-0 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1 [&_[cmdk-group-heading]]:scroll-mt-16"
                heading="Pages"
              >
                {navItems.map((item) => (
                  <CommandMenuItem
                    key={item.href}
                    keywords={["nav", "navigation", item.label.toLowerCase()]}
                    onHighlight={() => {
                      setSelectedType("page");
                      setCopyPayload("");
                    }}
                    onSelect={() => {
                      runCommand(() => router.push(item.href));
                    }}
                    value={`Navigation ${item.label}`}
                  >
                    <IconArrowRight />
                    {item.label}
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}
            {tree.children.map((group) => (
              <CommandGroup
                className="!p-0 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1 [&_[cmdk-group-heading]]:scroll-mt-16"
                heading={group.name}
                key={group.$id}
              >
                {group.type === "folder" &&
                  group.children.map((item) => {
                    if (item.type === "page") {
                      const isComponent = item.url.includes("/components/");

                      return (
                        <CommandMenuItem
                          key={item.url}
                          keywords={isComponent ? ["component"] : undefined}
                          onHighlight={() =>
                            handlePageHighlight(isComponent, item)
                          }
                          onSelect={() => {
                            runCommand(() => router.push(item.url));
                          }}
                          value={
                            item.name?.toString()
                              ? `${group.name} ${item.name}`
                              : ""
                          }
                        >
                          {isComponent ? (
                            <div className="aspect-square size-4 rounded-full border border-muted-foreground border-dashed" />
                          ) : (
                            <IconArrowRight />
                          )}
                          {item.name}
                        </CommandMenuItem>
                      );
                    }
                    return null;
                  })}
              </CommandGroup>
            ))}
            {blocks?.length ? (
              <CommandGroup
                className="!p-0 [&_[cmdk-group-heading]]:!p-3"
                heading="Blocks"
              >
                {blocks.map((block) => (
                  <CommandMenuItem
                    key={block.name}
                    keywords={[
                      "block",
                      block.name,
                      block.description,
                      ...block.categories,
                    ]}
                    onHighlight={() => {
                      handleBlockHighlight(block);
                    }}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/blocks/${block.categories[0]}#${block.name}`
                        )
                      );
                    }}
                    value={block.name}
                  >
                    <SquareDashedIcon />
                    {block.description}
                    <span className="ml-auto font-mono font-normal text-muted-foreground text-xs tabular-nums">
                      {block.name}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            ) : null}
            <SearchResults
              open={open}
              query={query}
              search={search}
              setOpen={setOpen}
            />
          </CommandList>
        </Command>
        <div className="absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 font-medium text-muted-foreground text-xs dark:border-t-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>{" "}
            {selectedType === "page" || selectedType === "component"
              ? "Go to Page"
              : null}
            {selectedType === "color" ? "Copy OKLCH" : null}
          </div>
          {copyPayload && (
            <>
              <Separator className="!h-4" orientation="vertical" />
              <div className="flex items-center gap-1">
                <CommandMenuKbd>⌘</CommandMenuKbd>
                <CommandMenuKbd>C</CommandMenuKbd>
                {copyPayload}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void;
  "data-selected"?: string;
  "aria-selected"?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.();
      }
    });
  });

  return (
    <CommandItem
      className={cn(
        "!px-3 h-9 rounded-md border border-transparent font-medium data-[selected=true]:border-input data-[selected=true]:bg-input/50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </CommandItem>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none flex h-5 select-none items-center justify-center gap-1 rounded border bg-background px-1 font-medium font-sans text-[0.7rem] text-muted-foreground [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}

type Query = Awaited<ReturnType<typeof useDocsSearch>>["query"];

function SearchResults({
  setOpen,
  query,
  search,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: Query;
  search: string;
}) {
  const router = useRouter();

  const uniqueResults =
    query.data && Array.isArray(query.data)
      ? query.data.filter(
          (item, index, self) =>
            !(
              item.type === "text" &&
              item.content.trim().split(/\s+/).length <= 1
            ) && index === self.findIndex((t) => t.content === item.content)
        )
      : [];

  if (!search.trim()) {
    return null;
  }

  if (!query.data || query.data === "empty") {
    return null;
  }

  if (query.data && uniqueResults.length === 0) {
    return null;
  }

  return (
    <CommandGroup
      className="!px-0 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1 [&_[cmdk-group-heading]]:scroll-mt-16"
      heading="Search Results"
    >
      {uniqueResults.map((item) => (
        <CommandItem
          className="!px-3 h-9 rounded-md border border-transparent font-normal data-[selected=true]:border-input data-[selected=true]:bg-input/50"
          data-type={item.type}
          key={item.id}
          keywords={[item.content]}
          onSelect={() => {
            router.push(item.url);
            setOpen(false);
          }}
          value={`${item.content} ${item.type}`}
        >
          <div className="line-clamp-1 text-sm">{item.content}</div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
