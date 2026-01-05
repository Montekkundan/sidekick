"use client";

import * as React from "react";
import { LayoutGroup, motion } from "motion/react";
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
} from "lucide-react";

import { cn } from "@/registry/new-york/lib/utils";
import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputCard,
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
          <PromptInputCard
            className={cn(isAgent && "rounded-[28px]")}
            shape={isAgent ? "default" : "pill"}
            variant={isAgent ? "muted" : "default"}
          >
            <LayoutGroup>
              <PromptInput
                className="py-2"
                focusRing={false}
                size={isAgent ? "lg" : "default"}
                variant="none"
                onSubmit={(message) => console.log("agent-prompt", message)}
              >
                <PromptInputBody
                  className={cn(
                    isAgent
                      ? "items-start px-4 py-3"
                      : "min-h-14 items-center px-4 py-3"
                  )}
                >
                  {!isAgent && (
                    <motion.div
                      layoutId="plus-button"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
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
                    </motion.div>
                  )}
                  <PromptInputTextarea
                    className={cn(
                      "focus-visible:outline-none focus-visible:ring-0",
                      !isAgent && "min-h-0 py-0"
                    )}
                    minRows={isAgent ? 3 : 1}
                    placeholder={isAgent ? "Describe a task" : "Ask anything"}
                  />
                  {!isAgent && (
                    <>
                      <motion.div
                        layoutId="mic-button"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      >
                        <PromptInputButton className="rounded-full" size="icon-sm">
                          <MicIcon className="size-4" />
                        </PromptInputButton>
                      </motion.div>
                      <motion.div
                        layoutId="submit-button"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      >
                        <PromptInputSubmit
                          className="rounded-full bg-orange-500 text-white hover:bg-orange-500/90"
                          size="icon-sm"
                        />
                      </motion.div>
                    </>
                  )}
                </PromptInputBody>

                {isAgent && (
                  <PromptInputFooter className="items-center justify-between gap-3 px-4 pb-4 pt-0">
                    <PromptInputTools className="flex-wrap gap-2">
                      <motion.div
                        layoutId="plus-button"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      >
                        <PromptInputActionMenu>
                          <PromptInputActionMenuTrigger
                            className="rounded-full bg-background/60"
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
                      </motion.div>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: 0.15 }}
                        className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-background/80"
                        onClick={() => setMode("default")}
                        type="button"
                      >
                        <BotIcon className="size-3.5 text-orange-500" />
                        Agent
                      </motion.button>
                    </PromptInputTools>
                    <div className="flex items-center gap-1">
                      <motion.div
                        layoutId="mic-button"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      >
                        <PromptInputButton className="rounded-full" size="icon-sm">
                          <MicIcon className="size-4" />
                        </PromptInputButton>
                      </motion.div>
                      <motion.div
                        layoutId="submit-button"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      >
                        <PromptInputSubmit
                          className="rounded-full bg-orange-500 text-white hover:bg-orange-500/90"
                          size="icon-sm"
                        />
                      </motion.div>
                    </div>
                  </PromptInputFooter>
                )}
              </PromptInput>
            </LayoutGroup>
          </PromptInputCard>
        </div>

        {isAgent && (
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "Suggested", icon: SparklesIcon },
                { label: "Reports", icon: FileTextIcon },
                { label: "Actions", icon: BotIcon },
                { label: "Spreadsheets", icon: CalendarIcon },
                { label: "Presentations", icon: ChevronRightIcon },
              ].map((chip) => (
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border bg-background/50 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-background/80 dark:bg-muted/40 dark:hover:bg-muted/60"
                  key={chip.label}
                  type="button"
                >
                  <chip.icon className="size-3.5" />
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
