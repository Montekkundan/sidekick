"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input";

function PromptInputPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="mb-2 font-bold text-3xl">Prompt Input Component</h1>
          <p className="text-muted-foreground">
            A versatile input component for AI prompts with attachment support.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-4 font-semibold text-xl">Basic Example</h2>
            <div className="rounded-lg border p-6">
              <PromptInput onSubmit={(message) => console.log(message)}>
                <PromptInputBody>
                  <PromptInputTextarea placeholder="What would you like to know?" />
                </PromptInputBody>
                <PromptInputFooter>
                  <PromptInputTools />
                  <PromptInputSubmit />
                </PromptInputFooter>
              </PromptInput>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">Custom Placeholder</h2>
            <div className="rounded-lg border p-6">
              <PromptInput onSubmit={(message) => console.log(message)}>
                <PromptInputBody>
                  <PromptInputTextarea placeholder="Ask me anything..." />
                </PromptInputBody>
                <PromptInputFooter>
                  <PromptInputTools />
                  <PromptInputSubmit />
                </PromptInputFooter>
              </PromptInput>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">Compact Version</h2>
            <div className="rounded-lg border p-6">
              <PromptInput onSubmit={(message) => console.log(message)}>
                <PromptInputBody>
                  <PromptInputTextarea placeholder="Type your message..." />
                </PromptInputBody>
                <PromptInputFooter>
                  <PromptInputTools />
                  <PromptInputSubmit />
                </PromptInputFooter>
              </PromptInput>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptInputPage;
