"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

export function ComponentPreviewTabs({
  className,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  component,
  source,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  chromeLessOnMobile?: boolean;
  component: React.ReactNode;
  source: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative mt-4 mb-12 flex flex-col gap-2 rounded-lg border",
        className
      )}
      {...props}
    >
      <div data-slot="preview">
        <div
          className={cn(
            "preview flex w-full justify-center data-[align=start]:items-start data-[align=end]:items-end data-[align=center]:items-center",
            chromeLessOnMobile ? "sm:p-10" : "h-[450px] p-10"
          )}
          data-align={align}
        >
          {component}
        </div>
        {!hideCode && (
          <div
            className="[&_[data-rehype-pretty-code-figure]]:!m-0 overflow-hidden [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-[400px]"
            data-slot="code"
          >
            {source}
          </div>
        )}
      </div>
    </div>
  );
}
