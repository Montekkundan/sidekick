"use client";

import { AudioLines, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputTextarea,
  usePromptInputAttachments,
} from "@/registry/new-york/blocks/prompt-input";
import { Button } from "@/registry/new-york/ui/button";

function AddButton() {
  const attachments = usePromptInputAttachments();

  return (
    <Button
      className="size-10 shrink-0 rounded-full border-zinc-700 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white"
      onClick={() => attachments.openFileDialog()}
      size="icon"
      type="button"
      variant="outline"
    >
      <Plus className="size-5" />
    </Button>
  );
}

export type CompactPromptInputProps = {
  onSubmit?: (message: PromptInputMessage) => void;
  className?: string;
};

export function CompactPromptInput({
  onSubmit,
  className,
}: CompactPromptInputProps) {
  return (
    <PromptInputProvider>
      <div className={cn("flex items-center gap-3", className)}>
        <AddButton />
        <PromptInput
          className="flex-1"
          onSubmit={(message) => onSubmit?.(message)}
          size="sm"
          variant="pill"
        >
          <PromptInputBody>
            <PromptInputTextarea
              className="flex-1"
              placeholder="Send a message..."
            />
            <PromptInputButton className="mr-3 ml-auto shrink-0 text-zinc-500 hover:text-white">
              <AudioLines className="size-5" />
            </PromptInputButton>
          </PromptInputBody>
        </PromptInput>
      </div>
    </PromptInputProvider>
  );
}
