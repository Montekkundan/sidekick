"use client";

import { ChevronDownIcon, FolderIcon, PlugZapIcon } from "lucide-react";

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input";

export function ClaudePromptInput() {
  return (
    <div className="space-y-5 text-center">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">
          Montek returns!
        </p>
        <h2 className="font-semibold text-3xl text-foreground">
          How can I help you today?
        </h2>
      </div>

      <div className="mx-auto w-full max-w-3xl space-y-3">
        <PromptInput
          className="rounded-2xl"
          onSubmit={(message) => console.log("claude-prompt", message)}
          size="lg"
          variant="default"
        >
          <PromptInputBody>
            <PromptInputTextarea minRows={2} placeholder="Ask anything..." />
          </PromptInputBody>
          <PromptInputFooter className="items-center">
            <PromptInputTools className="gap-2">
              <PromptInputButton className="rounded-full" size="icon-sm">
                <FolderIcon className="size-4" />
              </PromptInputButton>
              <PromptInputButton className="gap-2 px-3" size="sm">
                Sonnet 4.5
                <ChevronDownIcon className="size-3.5" />
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit className="rounded-xl" size="icon-sm" />
          </PromptInputFooter>
        </PromptInput>

        <div className="flex items-center justify-between rounded-full border bg-muted/30 px-4 py-2 text-muted-foreground text-xs">
          <span>Upgrade to connect your tools to Claude</span>
          <div className="flex items-center gap-2 text-foreground">
            <PlugZapIcon className="size-4" />
            <span className="text-xs">Connect</span>
          </div>
        </div>
      </div>
    </div>
  );
}
