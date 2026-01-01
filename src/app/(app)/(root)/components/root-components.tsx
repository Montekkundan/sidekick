"use client";

import { CompactPromptInput } from "./compact-prompt-input";
import { AskAIPanel } from "./ask-ai-panel";
import { AttachmentsInput } from "./attachments-input";
import { PresetsInput } from "./presets-input";
import { QuickActionsInput } from "./quick-actions-input";
import { SearchAskInput } from "./search-ask-input";
import { SidekickStandaloneDemo } from "./sidekick-standalone-demo";

export function RootComponents() {
  return (
    <div className="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8">
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <SearchAskInput />
        <QuickActionsInput />
      </div>
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <SidekickStandaloneDemo />
      </div>
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <AttachmentsInput />
        <PresetsInput />
      </div>
      <div className="order-first flex flex-col gap-6 lg:hidden xl:order-last xl:flex *:[div]:w-full *:[div]:max-w-full">
        <CompactPromptInput />
        <AskAIPanel />
      </div>
    </div>
  );
}
