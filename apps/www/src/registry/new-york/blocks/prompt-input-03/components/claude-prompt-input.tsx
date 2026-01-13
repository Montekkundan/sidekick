"use client";

import {
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  GlobeIcon,
  MessageCircleIcon,
  PlusIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Icons } from "@/components/icons";
import {
  PromptInput,
  PromptInputBody,
  PromptInputBottomSleeve,
  PromptInputButton,
  PromptInputCard,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputTopSleeve,
} from "@/registry/new-york/blocks/prompt-input";
import { cn } from "@/registry/new-york/lib/utils";

const sleeveWidthClassName = "w-full md:w-4/5";

function ToolPillIcon({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid size-[18px] place-items-center rounded-[5px] border border-border bg-background shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ClaudePromptInput() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex w-full flex-col items-center justify-center gap-4 text-center sm:mb-10 sm:flex-row">
        <Icons.claude aria-hidden="true" className="size-9 sm:size-10" />
        <h1 className="font-serif text-4xl text-foreground leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          Afternoon, Montek
        </h1>
      </div>

      <div className="mx-auto w-full max-w-3xl space-y-0">
        <PromptInputTopSleeve
          className="relative z-10 -mb-px flex items-center justify-between rounded-t-[28px] border border-border bg-background/80 px-4 py-2 text-muted-foreground text-sm"
          widthClassName={sleeveWidthClassName}
        >
          <div className="flex items-center gap-2">
            <ChevronDownIcon className="size-4" />
            <span>1 File</span>
          </div>
          <button
            className="rounded-md border border-border bg-background/60 px-3 py-1.5 font-medium text-foreground text-xs hover:bg-background/80"
            onClick={() => console.log("claude-review-click")}
            type="button"
          >
            Review
          </button>
        </PromptInputTopSleeve>

        <PromptInputCard className="relative z-0 rounded-[28px]">
          <PromptInput
            focusRing={false}
            onSubmit={(message) => console.log("claude-prompt", message)}
            size="lg"
            variant="none"
          >
            <PromptInputBody className="items-start px-4 py-3">
              <PromptInputTextarea
                className="min-h-28 text-[15px] text-foreground leading-relaxed placeholder:text-muted-foreground"
                minRows={4}
                placeholder="Type / for commands"
              />
            </PromptInputBody>

            <PromptInputFooter className="items-center justify-between gap-3 px-4 pt-0 pb-4">
              <PromptInputTools className="gap-2">
                <PromptInputButton
                  aria-label="Add"
                  className="rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                  size="icon-sm"
                >
                  <PlusIcon className="size-4" />
                </PromptInputButton>
                <PromptInputButton
                  aria-label="History"
                  className="rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                  size="icon-sm"
                >
                  <ClockIcon className="size-4" />
                </PromptInputButton>
              </PromptInputTools>

              <div className="flex items-center gap-2">
                <PromptInputButton
                  className="gap-1.5 rounded-full px-3 text-muted-foreground hover:bg-accent hover:text-foreground"
                  size="sm"
                >
                  Sonnet 4.5
                  <ChevronDownIcon className="size-4" />
                </PromptInputButton>
                <PromptInputSubmit
                  aria-label="Send"
                  className="rounded-full bg-orange-500 text-white hover:bg-orange-500/90"
                  size="icon-sm"
                >
                  <ArrowUpIcon className="size-4" />
                </PromptInputSubmit>
              </div>
            </PromptInputFooter>
          </PromptInput>
        </PromptInputCard>

        <PromptInputBottomSleeve
          asChild
          className="relative z-10 -mt-px flex items-center justify-between gap-3 rounded-b-[28px] border border-border bg-background/80 px-4 py-3 text-muted-foreground text-sm transition-colors hover:bg-background"
          widthClassName={sleeveWidthClassName}
        >
          <button
            onClick={() => console.log("claude-upgrade-click")}
            type="button"
          >
            <div className="flex w-full items-center justify-between gap-3">
              <p className="text-[13px] sm:hidden">Upgrade to Claude</p>
              <p className="hidden text-[13px] sm:block">
                Upgrade to connect your tools to Claude
              </p>
              <div className="flex items-center gap-2 text-foreground">
                <div className="hidden items-center sm:flex">
                  <ToolPillIcon>
                    <MessageCircleIcon className="size-3.5" />
                  </ToolPillIcon>
                  <ToolPillIcon className="-ml-1">
                    <FileTextIcon className="size-3.5" />
                  </ToolPillIcon>
                  <ToolPillIcon className="-ml-1">
                    <GlobeIcon className="size-3.5" />
                  </ToolPillIcon>
                </div>
                <ChevronRightIcon className="size-4 text-muted-foreground" />
              </div>
            </div>
          </button>
        </PromptInputBottomSleeve>
      </div>
    </div>
  );
}
