"use client";

import {
  ChevronDownIcon,
  GlobeIcon,
  MicIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react";

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input";

export function CursorPromptInput() {
  return (
    <div className="space-y-3 text-center">
      <h2 className="text-2xl font-semibold text-foreground">
        Ask Cursor to build, fix, or explore
      </h2>

      <PromptInput
        className="mx-auto w-full max-w-2xl"
        size="lg"
        variant="outline"
        onSubmit={(message) => console.log("cursor-prompt", message)}
      >
        <PromptInputBody>
          <PromptInputTextarea
            minRows={2}
            placeholder="Describe a task"
          />
        </PromptInputBody>
        <PromptInputFooter className="items-center">
          <PromptInputTools className="gap-1">
            <PromptInputButton className="rounded-full" size="icon-xs">
              <PlusIcon className="size-3.5" />
            </PromptInputButton>
            <PromptInputButton className="gap-1 px-2" size="xs">
              <SparklesIcon className="size-3.5" />
              Agent
            </PromptInputButton>
            <PromptInputButton className="gap-1 px-2" size="xs">
              <GlobeIcon className="size-3.5" />
              Web
              <ChevronDownIcon className="size-3" />
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputTools className="gap-1">
            <PromptInputButton className="rounded-full" size="icon-xs">
              <MicIcon className="size-3.5" />
            </PromptInputButton>
            <PromptInputSubmit className="rounded-full" size="icon-xs" />
          </PromptInputTools>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
