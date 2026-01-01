"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController,
} from "@/registry/new-york/blocks/prompt-input";

function PresetRow() {
  const controller = usePromptInputController();
  const presets = [
    { label: "Summary", value: "Summarize this in three bullets." },
    { label: "Rewrite", value: "Rewrite with a confident tone." },
    { label: "Plan", value: "Create a 3-step plan." },
  ];

  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      {presets.map((preset) => (
        <button
          key={preset.label}
          className="whitespace-nowrap underline-offset-4 transition hover:text-foreground hover:underline"
          onClick={() => controller.textInput.setInput(preset.value)}
          type="button"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

export function PresetsInput() {
  return (
    <PromptInputProvider initialInput="Summarize the call notes.">
      <div className="space-y-3">
        <PresetRow />
        <PromptInput onSubmit={() => {}}>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Describe the task..." />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </PromptInputProvider>
  );
}
