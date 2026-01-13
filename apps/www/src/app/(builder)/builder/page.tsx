"use client";

import { useRouter } from "next/navigation";
import { useBuilder } from "@/app/(builder)/components/builder-provider";
import { AgentPromptInput } from "@/registry/new-york/blocks/prompt-input-01/components/agent-prompt-input";
import { Button } from "@/registry/new-york/ui/button";

function BuilderLandingPage() {
  const router = useRouter();
  const { createSession, isReady } = useBuilder();

  const handleStartBlank = () => {
    const session = createSession();
    router.push(`/builder/${session.id}`);
  };

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_rgba(231,228,240,0.6)),radial-gradient(circle_at_30%_30%,_rgba(252,236,210,0.55),_transparent_55%),radial-gradient(circle_at_70%_40%,_rgba(213,229,255,0.55),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(17,17,20,0.92),_rgba(10,10,12,0.9)),radial-gradient(circle_at_30%_30%,_rgba(43,32,24,0.45),_transparent_55%),radial-gradient(circle_at_70%_40%,_rgba(30,36,48,0.45),_transparent_60%)]"
      />
      <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl">
          <AgentPromptInput />
          <div className="mt-6 space-y-3 text-center text-muted-foreground text-xs">
            <div>Powered by Sidekick</div>
            <Button
              className="h-auto px-3 py-1 text-xs"
              disabled={!isReady}
              onClick={handleStartBlank}
              variant="outline"
            >
              Start Blank
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuilderLandingPage;
