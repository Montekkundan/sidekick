"use client";

import { GlobeIcon, SparklesIcon } from "lucide-react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input";

export function QuickActionsInput() {
  return (
    <PromptInput onSubmit={() => {}}>
      <PromptInputBody>
        <PromptInputTextarea placeholder="Draft a short update..." />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputButton className="gap-1 px-2">
            <SparklesIcon className="size-4" />
            <span>Polish</span>
          </PromptInputButton>
          <PromptInputButton className="gap-1 px-2">
            <GlobeIcon className="size-4" />
            <span>Search</span>
          </PromptInputButton>
        </PromptInputTools>
        <PromptInputSubmit />
      </PromptInputFooter>
    </PromptInput>
  );
}
