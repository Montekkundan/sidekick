"use client";

import * as React from "react";
import {
  BotIcon,
  CalendarIcon,
  CameraIcon,
  ChevronRightIcon,
  FileTextIcon,
  MicIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";

import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input";

const quickSuggestions = [
  {
    label: "Build an LTV/CAC model for a meal-kit company",
    icon: FileTextIcon,
  },
  {
    label: "Conduct a calendar audit based on last 6 months",
    icon: CalendarIcon,
  },
  {
    label: "Find top-rated coffee grinder under $150",
    icon: SearchIcon,
  },
];

type AgentMode = "default" | "agent";

export function AgentPromptInput() {
  const [mode, setMode] = React.useState<AgentMode>("default");
  const isAgent = mode === "agent";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 py-16 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-foreground">
          {isAgent ? "What can I do for you?" : "Where should we begin?"}
        </h2>
        {!isAgent && (
          <p className="text-sm text-muted-foreground">
            Pick an action or switch into agent mode to unlock longer prompts.
          </p>
        )}
      </div>

      <div className="space-y-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-[36px] border bg-muted/30 shadow-lg">
            <PromptInput
              className="border-0 bg-transparent shadow-none"
              focusRing={false}
              size={isAgent ? "lg" : "default"}
              variant="ghost"
              onSubmit={(message) => console.log("agent-prompt", message)}
            >
              <PromptInputBody className="gap-3">
                {!isAgent && (
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger
                      className="rounded-full bg-background"
                      size="icon-sm"
                    >
                      <PlusIcon className="size-4" />
                    </PromptInputActionMenuTrigger>
                    <PromptInputActionMenuContent className="w-64">
                      <PromptInputActionMenuItem>
                        <CameraIcon className="size-4" />
                        Add photos & files
                      </PromptInputActionMenuItem>
                      <PromptInputActionMenuItem>
                        <SparklesIcon className="size-4" />
                        Create image
                      </PromptInputActionMenuItem>
                      <PromptInputActionMenuItem>
                        <SearchIcon className="size-4" />
                        Deep research
                      </PromptInputActionMenuItem>
                      <div className="my-1 h-px bg-border" />
                      <PromptInputActionMenuItem
                        onSelect={() => setMode("agent")}
                      >
                        <BotIcon className="size-4" />
                        Agent mode
                      </PromptInputActionMenuItem>
                      <PromptInputActionMenuItem
                        onSelect={() => setMode("default")}
                      >
                        <ChevronRightIcon className="size-4" />
                        Standard mode
                      </PromptInputActionMenuItem>
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                )}
                <PromptInputTextarea
                  className="focus-visible:outline-none focus-visible:ring-0"
                  minRows={isAgent ? 3 : 1}
                  placeholder={isAgent ? "Describe a task" : "Ask anything"}
                />
                <PromptInputButton className="rounded-full" size="icon-sm">
                  <MicIcon className="size-4" />
                </PromptInputButton>
                <PromptInputSubmit
                  className="rounded-full bg-orange-500 text-white hover:bg-orange-500/90"
                  size="icon-sm"
                />
              </PromptInputBody>
            </PromptInput>

            {isAgent && (
              <div className="space-y-4 px-6 pb-5 pt-4 text-left">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground"
                      onClick={() => setMode("default")}
                      type="button"
                    >
                      <XIcon className="size-3" />
                      Agent
                    </button>
                    <span>25 left</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger
                      className="rounded-full bg-background"
                      size="icon-sm"
                    >
                      <PlusIcon className="size-4" />
                    </PromptInputActionMenuTrigger>
                    <PromptInputActionMenuContent className="w-64">
                      <PromptInputActionMenuItem>
                        <CameraIcon className="size-4" />
                        Add photos & files
                      </PromptInputActionMenuItem>
                      <PromptInputActionMenuItem>
                        <SparklesIcon className="size-4" />
                        Create image
                      </PromptInputActionMenuItem>
                      <PromptInputActionMenuItem>
                        <SearchIcon className="size-4" />
                        Deep research
                      </PromptInputActionMenuItem>
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                </div>
              </div>
            )}
          </div>
        </div>

        {isAgent && (
          <div className="mx-auto w-full max-w-3xl space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              {["Suggested", "Reports", "Actions", "Spreadsheets", "Presentations"].map(
                (chip) => (
                  <span
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                    key={chip}
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
