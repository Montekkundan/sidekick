"use client";

import { useEffect, useState } from "react";
import { useThemeConfig } from "@/components/active-theme";
import { getTheme, type ThemeComponents } from "@/lib/themes";
import {
  AskAIButton as DefaultAskAIButton,
  AskAILabel as DefaultAskAILabel,
  CompactPromptInput as DefaultCompactPromptInput,
  ThemedPromptInput as DefaultPromptInput,
  ThemedSidekick as DefaultSidekick,
} from "@/registry/new-york/themes/default";
import { Skeleton } from "@/registry/new-york/ui/skeleton";

function ThemeSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}

export function RootComponents() {
  const { activeTheme } = useThemeConfig();
  const [components, setComponents] = useState<Partial<ThemeComponents> | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const theme = getTheme(activeTheme);
    if (!theme) return;

    if (theme.name === "default") {
      setComponents(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    theme.components().then((mod) => {
      setComponents(mod);
      setLoading(false);
    });
  }, [activeTheme]);

  if (loading) {
    return (
      <div className="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8">
        <div className="flex flex-col gap-6">
          <ThemeSkeleton />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-[600px] w-full max-w-md rounded-lg" />
        </div>
      </div>
    );
  }

  const ThemedPromptInput = components?.ThemedPromptInput || DefaultPromptInput;
  const ThemedSidekick = components?.ThemedSidekick || DefaultSidekick;
  const AskAIButton = components?.AskAIButton || DefaultAskAIButton;
  const AskAILabel = components?.AskAILabel || DefaultAskAILabel;
  const CompactPromptInput =
    components?.CompactPromptInput || DefaultCompactPromptInput;

  return (
    <div className="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8">
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        {ThemedPromptInput && <ThemedPromptInput />}
        {AskAIButton && <AskAIButton />}
        {AskAILabel && <AskAILabel />}
        {CompactPromptInput && <CompactPromptInput />}
      </div>
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        {ThemedSidekick && <ThemedSidekick />}
      </div>
    </div>
  );
}
