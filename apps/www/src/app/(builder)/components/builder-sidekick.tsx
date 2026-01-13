"use client";

import {
  Conversation,
  ConversationContent,
} from "@repo/design-system/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
} from "@repo/design-system/components/ai-elements/message";
import { usePathname } from "next/navigation";
import React from "react";
import { useBuilder } from "@/app/(builder)/components/builder-provider";
import type { PromptInputMessage } from "@/registry/new-york/blocks/prompt-input";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input";
import {
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
  SidekickTrigger,
} from "@/registry/new-york/blocks/sidekick";
import { useGatewayChat } from "@/registry/new-york/hooks/use-gateway-chat";
import { Kbd, KbdGroup } from "@/registry/new-york/ui/kbd";

const SIDEKICK_SUGGESTIONS = [
  "Create a pricing card with a CTA button.",
  "Design a login form with email and password.",
  "Build a stats widget with 3 metrics.",
  "Generate a profile card with avatar and bio.",
];

function getMessageText(message: {
  parts?: Array<{ type: string; text?: string }>;
}) {
  if (!message.parts) {
    return "";
  }
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

function getChatIdFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const builderIndex = parts.indexOf("builder");
  if (builderIndex === -1 || builderIndex >= parts.length - 1) {
    return null;
  }
  return parts[builderIndex + 1] ?? null;
}

export function BuilderSidekick() {
  const { activeSessionId } = useBuilder();
  const pathname = usePathname() ?? "";
  const chatIdFromPath = React.useMemo(
    () => getChatIdFromPath(pathname),
    [pathname]
  );
  const chatId = chatIdFromPath ?? activeSessionId ?? "builder";

  const gatewayConfig = React.useMemo(
    () => ({
      modelId: "openai/gpt-4o-mini",
      provider: "vercel" as const,
    }),
    []
  );

  const { messages, sendMessage, status } = useGatewayChat({
    id: chatId,
    gateway: gatewayConfig,
  });

  const handleSubmit = React.useCallback(
    async (message: PromptInputMessage) => {
      if (!message.text.trim()) {
        return;
      }
      await sendMessage({ text: message.text });
    },
    [sendMessage]
  );

  const isLoading = status === "streaming";

  return (
    <Sidekick className="h-full" side="right">
      <SidekickHeader className="justify-between">
        <span className="font-semibold text-sm">Chat</span>
        <SidekickTrigger />
      </SidekickHeader>
      <SidekickContent>
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Suggestions
                </div>
                <div className="space-y-2">
                  {SIDEKICK_SUGGESTIONS.map((suggestion) => (
                    <button
                      className="w-full rounded-md border px-3 py-2 text-left text-sm transition hover:border-muted-foreground/40 hover:bg-muted/40"
                      key={suggestion}
                      onClick={() => sendMessage({ text: suggestion })}
                      type="button"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <Message
                  from={msg.role === "assistant" ? "assistant" : "user"}
                  key={msg.id}
                >
                  <MessageContent>{getMessageText(msg)}</MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
        </Conversation>
      </SidekickContent>
      <SidekickFooter>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            Tip: You can open and close chat with
            <KbdGroup>
              <Kbd>Cmd</Kbd>
              <Kbd>I</Kbd>
            </KbdGroup>
          </div>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                disabled={isLoading}
                placeholder="Describe the UI you want..."
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit disabled={isLoading} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </SidekickFooter>
    </Sidekick>
  );
}
