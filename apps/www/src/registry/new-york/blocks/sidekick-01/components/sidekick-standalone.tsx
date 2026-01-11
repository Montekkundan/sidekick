"use client";

import {
  Conversation,
  ConversationContent,
} from "@repo/design-system/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
} from "@repo/design-system/components/ai-elements/message";
import { streamText } from "ai";
import { nanoid } from "nanoid";
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
import { createGatewayModel } from "@/registry/new-york/lib/gateway";

interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  content: string;
}

export function SidekickStandalone() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: nanoid(),
      from: "user",
      content: "Hello!",
    },
    {
      id: nanoid(),
      from: "assistant",
      content: "Hi there! How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (message: { text: string }) => {
    if (!message.text.trim()) {
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: nanoid(),
      from: "user",
      content: message.text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Create AI model using gateway
      const model = createGatewayModel({
        modelId: "openai/gpt-4o-mini",
      });

      // Create assistant message placeholder
      const assistantMessageId = nanoid();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          from: "assistant",
          content: "",
        },
      ]);

      // Stream the response
      const result = streamText({
        model,
        messages: [
          ...messages.map((msg) => ({
            role:
              msg.from === "user" ? ("user" as const) : ("assistant" as const),
            content: msg.content,
          })),
          {
            role: "user" as const,
            content: message.text,
          },
        ],
      });

      // Handle streaming
      let fullText = "";
      for await (const chunk of result.textStream) {
        fullText += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: fullText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          from: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
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
