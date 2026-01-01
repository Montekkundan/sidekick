"use client";

import * as React from "react";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input";
import {
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
} from "@/registry/new-york/blocks/sidekick";

type ChatMessage = {
  id: string;
  from: "user" | "assistant";
  content: string;
};

export function SidekickChatbot() {
  const [open, setOpen] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(true);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      from: "assistant",
      content: "Hi! How can I help you today?",
    },
  ]);

  const handleSubmit = (message: { text: string }) => {
    if (!message.text.trim()) return;
    const userMessage: ChatMessage = {
      id: String(Date.now()),
      from: "user",
      content: message.text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          from: "assistant",
          content: "Thanks! I’m looking into that now.",
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {!open && showPreview && (
        <div className="flex w-80 items-center gap-4 rounded-full border bg-background px-4 py-3 shadow-lg">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MessageCircleIcon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              Hi, how can I help you today? 👋
            </p>
            <p className="text-muted-foreground text-xs">Just now</p>
          </div>
          <button
            aria-label="Dismiss preview"
            className="text-muted-foreground transition hover:text-foreground"
            onClick={() => setShowPreview(false)}
            type="button"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      )}

      {open && (
        <div className="h-[560px] w-[360px] overflow-hidden rounded-2xl border bg-background shadow-2xl">
          <Sidekick standalone>
            <SidekickHeader>
              <span className="font-semibold">AI Assistant</span>
            </SidekickHeader>

            <SidekickContent>
              <Conversation>
                <ConversationContent>
                  {messages.map((msg) => (
                    <Message from={msg.from} key={msg.id}>
                      <MessageContent from={msg.from}>{msg.content}</MessageContent>
                    </Message>
                  ))}
                </ConversationContent>
              </Conversation>
            </SidekickContent>

            <SidekickFooter>
              <PromptInput onSubmit={handleSubmit}>
                <PromptInputBody>
                  <PromptInputTextarea placeholder="Type a message..." />
                </PromptInputBody>
                <PromptInputFooter>
                  <PromptInputTools />
                  <PromptInputSubmit />
                </PromptInputFooter>
              </PromptInput>
            </SidekickFooter>
          </Sidekick>
        </div>
      )}

      <Button
        className="size-12 rounded-full shadow-lg"
        onClick={() => setOpen((prev) => !prev)}
        size="icon"
      >
        {open ? <XIcon className="size-5" /> : <MessageCircleIcon className="size-5" />}
      </Button>
    </div>
  );
}
