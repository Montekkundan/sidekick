"use client";

import { cn } from "@repo/design-system/lib/utils";
import {
  IconArrowUp,
  IconBrandGithub,
  IconCopy,
  IconMessageCircle,
  IconSparkles,
} from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";

export function DocsPageActions({
  githubUrl,
  rawMdx,
  className,
}: {
  githubUrl: string;
  rawMdx: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyResetTimeoutRef = useRef<number | null>(null);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const copyPage = useCallback(async () => {
    if (copyResetTimeoutRef.current) {
      window.clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = null;
    }

    await navigator.clipboard.writeText(rawMdx);
    setCopied(true);

    copyResetTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      copyResetTimeoutRef.current = null;
    }, 1500);
  }, [rawMdx]);

  const itemClassName =
    "flex h-8 items-center gap-1.5 rounded-md px-1.5 text-[0.8rem] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className={cn("flex flex-col gap-0.5 px-8", className)}>
      <a
        className={itemClassName}
        href={githubUrl}
        rel="noreferrer"
        target="_blank"
      >
        <IconBrandGithub className="size-4" />
        Edit this page on GitHub
      </a>

      <button className={itemClassName} onClick={scrollToTop} type="button">
        <IconArrowUp className="size-4" />
        Scroll to top
      </button>

      <button className={itemClassName} onClick={copyPage} type="button">
        <IconCopy className="size-4" />
        {copied ? "Copied" : "Copy page"}
      </button>

      {/* <button className={itemClassName} data-action="ask-ai" type="button">
        <IconSparkles className="size-4" />
        Ask AI about this page
      </button>

      <button className={itemClassName} data-action="open-chat" type="button">
        <IconMessageCircle className="size-4" />
        Open in chat
      </button> */}
    </div>
  );
}
