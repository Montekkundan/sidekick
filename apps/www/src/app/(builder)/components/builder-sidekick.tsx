"use client";

import { useChat } from "@ai-sdk/react";
import { useUIStream } from "@json-render/react";
import {
  Conversation,
  ConversationContent,
} from "@repo/design-system/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
} from "@repo/design-system/components/ai-elements/message";
import { DefaultChatTransport } from "ai";
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

const GREETING_RE =
  /^(hi|hello|hey|yo|sup|gm|good\s+morning|good\s+afternoon|good\s+evening)\b/i;
const UI_INTENT_RE =
  /\b(create|build|design|generate|make|add|update|change|improve|refactor)\b/i;

function safeParseJson(value: string): Record<string, unknown> | undefined {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return undefined;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

export function BuilderSidekick() {
  const { activeSessionId, sessions, updateSession } = useBuilder();
  const pathname = usePathname() ?? "";
  const chatIdFromPath = React.useMemo(
    () => getChatIdFromPath(pathname),
    [pathname]
  );
  const chatId = chatIdFromPath ?? activeSessionId ?? "builder";
  const currentSession = sessions.find((session) => session.id === chatId);

  const chatTransport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          gateway: { modelId: "anthropic/claude-sonnet-4" },
          system:
            "You are Sidekick Builder, a helpful UI builder assistant.\n" +
            "- If the user greets (e.g. 'hi'), respond normally and ask what UI they want to build.\n" +
            "- If the user asks to create/build/design UI, ask 1-2 clarifying questions only when essential.\n" +
            "- Do NOT output JSON patches or raw UI tree in chat.",
        },
      }),
    []
  );

  const { messages, sendMessage, status } = useChat({
    id: chatId,
    transport: chatTransport,
  });

  const uiStream = useUIStream({
    api: "/api/builder/generate",
    onComplete: (tree) => {
      updateSession(chatId, {
        uiTree: JSON.stringify(tree, null, 2),
      });
    },
  });

  // Apply streamed tree to builder in real-time.
  React.useEffect(() => {
    if (!uiStream.tree) {
      return;
    }

    updateSession(chatId, {
      uiTree: JSON.stringify(uiStream.tree, null, 2),
    });
  }, [chatId, uiStream.tree, updateSession]);

  const shouldGenerateUI = React.useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return false;
    }

    if (GREETING_RE.test(trimmed)) {
      return false;
    }

    return UI_INTENT_RE.test(trimmed);
  }, []);

  const handleSubmit = React.useCallback(
    async (message: PromptInputMessage) => {
      const text = message.text.trim();
      if (!text) {
        return;
      }

      // Chat transcript (natural language).
      await sendMessage({ text });

      // Stream UI only when the user is asking for UI generation.
      if (!shouldGenerateUI(text)) {
        return;
      }

      const currentTree = currentSession?.uiTree
        ? safeParseJson(currentSession.uiTree)
        : undefined;

      // `useUIStream` posts { prompt, context, currentTree }.
      // We pass `currentTree` via `context` so the server can apply edits.
      uiStream
        .send(text, {
          currentTree: currentTree ?? {},
          gateway: { modelId: "anthropic/claude-sonnet-4" },
        })
        .catch(() => undefined);
    },
    [currentSession?.uiTree, sendMessage, shouldGenerateUI, uiStream]
  );

  const isLoading = status === "streaming" || uiStream.isStreaming;

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
                      onClick={() => {
                        sendMessage({ text: suggestion });
                        const currentTree = currentSession?.uiTree
                          ? safeParseJson(currentSession.uiTree)
                          : undefined;
                        uiStream
                          .send(suggestion, {
                            currentTree: currentTree ?? {},
                            gateway: { modelId: "anthropic/claude-sonnet-4" },
                          })
                          .catch(() => undefined);
                      }}
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
              {uiStream.error && (
                <div className="px-3 pt-2 text-destructive text-xs">
                  {uiStream.error.message}
                </div>
              )}
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
