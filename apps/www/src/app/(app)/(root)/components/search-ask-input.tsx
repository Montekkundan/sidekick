"use client";

import { MicIcon } from "lucide-react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/registry/new-york/blocks/prompt-input";

export function SearchAskInput() {
  return (
    <PromptInputProvider>
      <PromptInput onSubmit={() => {}} size="sm">
        <PromptInputBody>
          <PromptInputTextarea
            className="!min-h-0 !h-10 !px-4 !py-2.5 !text-sm !overflow-hidden"
            placeholder="Ask, search, or make anything..."
            rows={1}
          />
          <PromptInputSubmit
            className="mr-2 rounded-full"
            emptyIcon={<MicIcon className="size-4" />}
            size="icon-xs"
          />
        </PromptInputBody>
      </PromptInput>
    </PromptInputProvider>
  );
}
