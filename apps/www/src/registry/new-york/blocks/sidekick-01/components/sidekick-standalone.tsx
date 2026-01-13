"use client";

import {
  Conversation,
  ConversationContent,
} from "@repo/design-system/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
} from "@repo/design-system/components/ai-elements/message";
import React from "react";
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
} from "@/registry/new-york/blocks/sidekick";

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
  );
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  content: string;
}

export function SidekickStandalone() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: createId(),
      from: "user",
      content: "Hello!",
    },
    {
      id: createId(),
      from: "assistant",
      content: "Hi there! How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (message: { text: string }) => {
    if (!message.text.trim()) {
      return;
    }

    const nextUserMessage: ChatMessage = {
      id: createId(),
      from: "user",
      content: message.text,
    };

    const assistantMessageId = createId();
    setMessages((prev) => [
      ...prev,
      nextUserMessage,
      {
        id: assistantMessageId,
        from: "assistant",
        content: "Thinking…",
      },
    ]);
    setIsLoading(true);

    try {
      await delay(600);
      const reply =
        "This is a UI-only demo (no API keys needed). Wire this up to your /api/chat route to stream real responses.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, content: reply } : msg
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "Sorry, I encountered an error. Please try again.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[600px] w-full max-w-md overflow-hidden rounded-lg border">
      <Sidekick standalone>
        <SidekickHeader>
          <span className="font-semibold">AI Assistant</span>
        </SidekickHeader>

        <SidekickContent>
          <Conversation>
            <ConversationContent>
              {messages.map((msg) => (
                <Message from={msg.from} key={msg.id}>
                  <MessageContent>{msg.content}</MessageContent>
                </Message>
              ))}
            </ConversationContent>
          </Conversation>
        </SidekickContent>

        <SidekickFooter>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                disabled={isLoading}
                placeholder="Ask me anything..."
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit disabled={isLoading} />
            </PromptInputFooter>
          </PromptInput>
        </SidekickFooter>
      </Sidekick>
    </div>
  );
}
