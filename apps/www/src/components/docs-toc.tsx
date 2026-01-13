"use client";

import { cn } from "@repo/design-system/lib/utils";
import { IconMenu3 } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    for (const id of itemIds ?? []) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      for (const id of itemIds ?? []) {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      }
    };
  }, [itemIds]);

  return activeId;
}

export function DocsTableOfContents({
  toc,
  variant = "list",
  className,
}: {
  toc: {
    title?: ReactNode;
    url: string;
    depth: number;
  }[];
  variant?: "dropdown" | "list";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const itemIds = useMemo(
    () => toc.map((item) => item.url.replace("#", "")),
    [toc]
  );
  const activeHeading = useActiveItem(itemIds);

  if (!toc?.length) {
    return null;
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn("h-8 md:h-7", className)}
            size="sm"
            variant="outline"
          >
            <IconMenu3 /> On This Page
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="no-scrollbar max-h-[70svh]"
        >
          {toc.map((item) => (
            <DropdownMenuItem
              asChild
              className="data-[depth=3]:pl-6 data-[depth=4]:pl-8"
              data-depth={item.depth}
              key={item.url}
              onClick={() => {
                setOpen(false);
              }}
            >
              <a href={item.url}>{item.title}</a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2 p-4 pt-0 text-sm", className)}>
      <p className="sticky top-0 h-6 bg-background text-muted-foreground text-xs">
        On This Page
      </p>
      {toc.map((item) => (
        <a
          className="text-[0.8rem] text-muted-foreground no-underline transition-colors hover:text-foreground data-[depth=3]:pl-4 data-[depth=4]:pl-6 data-[active=true]:text-foreground"
          data-active={item.url === `#${activeHeading}`}
          data-depth={item.depth}
          href={item.url}
          key={item.url}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
}

export function DocsTocScrollArea({
  children,
  className,
  contentClassName,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const recompute = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      setShowTop(false);
      setShowBottom(false);
      return;
    }

    const overflow = element.scrollHeight > element.clientHeight + 4;
    if (!overflow) {
      setShowTop(false);
      setShowBottom(false);
      return;
    }

    setShowTop(element.scrollTop > 4);
    setShowBottom(
      element.scrollTop + element.clientHeight < element.scrollHeight - 4
    );
  }, []);

  useEffect(() => {
    recompute();

    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(() => {
      recompute();
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [recompute]);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "no-scrollbar max-h-full overflow-y-auto overscroll-contain",
          contentClassName
        )}
        onScroll={recompute}
        ref={scrollRef}
      >
        {children}
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-6 h-4 bg-linear-to-b from-background/60 to-transparent backdrop-blur-[2px] transition-opacity",
          showTop ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-linear-to-t from-background/60 to-transparent backdrop-blur-[2px] transition-opacity",
          showBottom ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
