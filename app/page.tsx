import Link from "next/link";
import { SparklesIcon } from "lucide-react";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import PromptInputExample from "@/registry/new-york/blocks/prompt-input/page";
import SidekickExample from "@/registry/new-york/blocks/sidekick/page";
import {
  SidekickProvider,
  SidekickInset,
  SidekickTrigger,
} from "@/registry/new-york/blocks/sidekick";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-3xl tracking-tight">Sidekick Registry</h1>
          <Link
            href="/docs"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Documentation
          </Link>
        </div>
        <p className="text-muted-foreground">
          AI-powered components for building chat interfaces.
        </p>
      </header>
      <main className="flex flex-1 flex-col gap-8">
        {/* Sidekick Component */}
        <div className="relative flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground text-sm sm:pl-3">
              An AI chat sidebar component with conversation history and message bubbles.
            </h2>
            <OpenInV0Button className="w-fit" name="sidekick" />
          </div>
          <div className="relative h-[600px] w-full overflow-hidden rounded-lg border bg-background">
            <SidekickProvider defaultOpen={true} className="h-full min-h-0">
              <SidekickInset className="bg-muted/30">
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="size-6 text-primary" />
                    <h2 className="font-semibold text-xl">Welcome to Sidekick</h2>
                  </div>
                  <p className="max-w-md text-center text-muted-foreground">
                    Your AI-powered chat assistant. Toggle the panel with{" "}
                    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
                      ⌘K
                    </kbd>{" "}
                    or use the trigger button.
                  </p>
                  <SidekickTrigger className="mt-4" />
                </div>
              </SidekickInset>
              <SidekickExample />
            </SidekickProvider>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            A sidebar that toggles open and closed.
          </p>
        </div>

        {/* Prompt Input Component */}
        <div className="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground text-sm sm:pl-3">
              An input component for prompts with attachments and speech.
            </h2>
            <OpenInV0Button className="w-fit" name="prompt-input" />
          </div>
          <div className="relative flex min-h-[400px] items-center justify-center">
            <PromptInputExample />
          </div>
        </div>
      </main>
    </div>
  );
}
