"use client";

import type { ComponentProps } from "react";
import { GlobeIcon, MicIcon, SparklesIcon } from "lucide-react";

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController,
} from "@/registry/new-york/blocks/prompt-input";

type PromptVariant = ComponentProps<typeof PromptInput>["variant"];
type PromptSize = ComponentProps<typeof PromptInput>["size"];

const variantExamples: Array<{
  title: string;
  description: string;
  variant: PromptVariant;
  size?: PromptSize;
  placeholder: string;
}> = [
  {
    title: "Default",
    description: "Balanced border and background for most chat interfaces.",
    variant: "default",
    placeholder: "Summarize the latest research...",
  },
  {
    title: "Outline",
    description: "High-contrast outline that stands out in dense layouts.",
    variant: "outline",
    placeholder: "Draft an outreach email to our beta list...",
  },
  {
    title: "Ghost",
    description: "Minimal chrome that blends into cards or sidebars.",
    variant: "ghost",
    placeholder: "Ask anything...",
  },
  {
    title: "Pill",
    description: "Fully rounded pill for floating or docked composers.",
    variant: "pill",
    size: "sm",
    placeholder: "Drop a quick command...",
  },
];

const sizeExamples: Array<{
  title: string;
  description: string;
  size: PromptSize;
  textareaProps?: ComponentProps<typeof PromptInputTextarea>;
}> = [
  {
    title: "Small",
    description: "Compact, single-line optimized input for toolbars.",
    size: "sm",
    textareaProps: {
      placeholder: "Generate a short title",
    },
  },
  {
    title: "Default",
    description: "The balanced size for most workflows.",
    size: "default",
    textareaProps: {
      placeholder: "How can I help you today?",
    },
  },
  {
    title: "Large",
    description: "Multi-line composer perfect for detailed prompts.",
    size: "lg",
    textareaProps: {
      placeholder: "Provide context, goals, and constraints...",
      minRows: 3,
    },
  },
];

const customExamples = [
  {
    title: "Creative Brief Workspace",
    description:
      "Outline variant with stacked footer controls and minimal, user-styled chips.",
    Component: CreativeBriefExample,
  },
  {
    title: "Provider Controlled Pill",
    description:
      "State lives in PromptInputProvider so presets or mic buttons can update the textarea.",
    Component: ProviderPresetExample,
  },
];

function CreativeBriefExample() {
  return (
    <PromptInput
      variant="outline"
      size="lg"
      onSubmit={(message) => console.log("creative-brief", message)}
    >
      <PromptInputHeader align="block-start" className="gap-2">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {["Campaign", "Voice", "Launch"].map((chip) => (
            <span key={chip} className="whitespace-nowrap">
              {chip}
            </span>
          ))}
        </div>
      </PromptInputHeader>
      <PromptInputBody>
        <PromptInputTextarea
          minRows={4}
          placeholder="Outline the hero message and CTA for the new launch..."
        />
      </PromptInputBody>
      <PromptInputFooter className="flex-col gap-4">
        <div className="flex w-full flex-wrap justify-start gap-3 text-left text-xs text-muted-foreground">
          {["Tone: Playful", "Audience: Growth", "Length: 200 words"].map(
            (chip) => (
              <span key={chip} className="whitespace-nowrap">
                {chip}
              </span>
            )
          )}
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <PromptInputTools className="flex-wrap gap-2">
            <PromptInputButton className="gap-1 px-3">
              <SparklesIcon className="size-4" />
              <span>Magic Fill</span>
            </PromptInputButton>
            <PromptInputButton className="gap-1 px-3">
              <GlobeIcon className="size-4" />
              <span>Search Docs</span>
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit />
        </div>
      </PromptInputFooter>
    </PromptInput>
  );
}

function ProviderPresetExample() {
  return (
    <PromptInputProvider initialInput="Quick standup summary for AI infra.">
      <div className="space-y-3">
        <PresetButtons />
        <PromptInput
          variant="pill"
          size="sm"
          onSubmit={(message) => console.log("provider-example", message)}
        >
          <PromptInputBody>
            <PromptInputTextarea
              className="!min-h-0 !h-9 !overflow-hidden"
              placeholder="Drop a quick command..."
              rows={1}
            />
            <PromptInputButton
              className="text-muted-foreground"
              size="icon-sm"
            >
              <MicIcon className="size-4" />
            </PromptInputButton>
          </PromptInputBody>
          <PromptInputFooter align="inline-end" className="gap-2">
            <PromptInputTools>
              <PromptInputButton className="gap-1 px-3">
                <SparklesIcon className="size-4" />
                <span>Rewrite</span>
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </PromptInputProvider>
  );
}

function PresetButtons() {
  const controller = usePromptInputController();
  const presets = [
    {
      label: "Sprint update",
      value: "Write a short sprint update.",
    },
    {
      label: "Bug triage",
      value: "Summarize critical bugs with owners.",
    },
    {
      label: "Meeting notes",
      value: "Organize meeting notes into bullets.",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.label}
          className="text-xs text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          onClick={() => controller.textInput.setInput(preset.value)}
          type="button"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

function PromptInputPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <div>
          <h1 className="mb-2 font-bold text-3xl">Prompt Input Component</h1>
          <p className="text-muted-foreground">
            A versatile input component for AI prompts with attachment support.
          </p>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="font-semibold text-xl">Variants</h2>
            <p className="text-muted-foreground">
              Every variant mirrors the documentation: default, outline, ghost, and pill.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {variantExamples.map((example) => (
              <div key={example.title} className="space-y-4 rounded-lg border p-5">
                <div>
                  <h3 className="font-semibold">{example.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {example.description}
                  </p>
                </div>
                <PromptInput
                  variant={example.variant}
                  size={example.size ?? "default"}
                  onSubmit={(message) =>
                    console.log(`${example.variant} variant:`, message)
                  }
                >
                  <PromptInputBody>
                    <PromptInputTextarea placeholder={example.placeholder} />
                  </PromptInputBody>
                  <PromptInputFooter>
                    <PromptInputTools />
                    <PromptInputSubmit />
                  </PromptInputFooter>
                </PromptInput>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-semibold text-xl">Sizes</h2>
            <p className="text-muted-foreground">
              Showcase every size option &mdash; from the toolbar-friendly `sm` to the
              multi-line `lg` composer.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {sizeExamples.map((example) => {
              const textareaProps = example.textareaProps ?? {};

              return (
                <div key={example.title} className="space-y-4 rounded-lg border p-5">
                  <div>
                    <h3 className="font-semibold">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {example.description}
                    </p>
                  </div>
                  <PromptInput
                    size={example.size}
                    variant="default"
                    onSubmit={(message) =>
                      console.log(`${example.size} size:`, message)
                    }
                  >
                    <PromptInputBody>
                      <PromptInputTextarea {...textareaProps} />
                    </PromptInputBody>
                    <PromptInputFooter>
                      <PromptInputTools />
                      <PromptInputSubmit />
                    </PromptInputFooter>
                  </PromptInput>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-semibold text-xl">Custom Layouts</h2>
            <p className="text-muted-foreground">
              Examples that highlight stacked headers, inline buttons, providers, and toolbar composition.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {customExamples.map(({ title, description, Component }) => (
              <div key={title} className="space-y-4 rounded-lg border p-5">
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Component />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PromptInputPage;
