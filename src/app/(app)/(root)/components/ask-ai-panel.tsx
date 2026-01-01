"use client";

import { AskAIButton, AskAILabel } from "@/registry/new-york/blocks/ask-ai";

export function AskAIPanel() {
  return (
    <div className="space-y-4">
      <AskAIButton />
      <AskAILabel />
    </div>
  );
}
