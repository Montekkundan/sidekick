"use client";

import * as React from "react";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import { Skeleton } from "@/registry/new-york/ui/skeleton";
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
  MessageAvatar,
  MessageContent,
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
  SidekickInset,
  SidekickProvider,
  SidekickTrigger,
} from "@/registry/new-york/blocks/sidekick";

type ChatMessage = {
  id: string;
  from: "user" | "assistant";
  content: string;
};

export function SidekickFloating() {
  const [open, setOpen] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(true);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      from: "assistant",
      content: "Welcome! Ask me anything about this page.",
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
          content: `You said: ${message.text}`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-end gap-3 px-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:px-0">
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
        <div className="h-[70vh] w-[min(92vw,420px)] overflow-hidden rounded-2xl border bg-background shadow-2xl sm:w-[min(92vw,520px)] md:w-[min(92vw,760px)]">
          <SidekickProvider
            className="relative h-full min-h-0 flex-col [--sidekick-width:100%] md:flex-row md:[--sidekick-width:320px]"
            defaultOpen={true}
            defaultOpenMobile={true}
          >
            <SidekickInset className="flex min-h-0 flex-1 items-center justify-center bg-muted/20 p-6 text-center">
              <div className="flex w-full max-w-xs flex-col items-center gap-3">
                <Skeleton className="h-8 w-40 rounded-full" />
                <Skeleton className="h-32 w-56 rounded-xl" />
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Ask about pricing, docs, or setup.</p>
                  <p>
                    Press <kbd className="rounded border px-1.5 py-0.5">⌘</kbd> +{" "}
                    <kbd className="rounded border px-1.5 py-0.5">I</kbd> to toggle.
                  </p>
                </div>
              </div>
            </SidekickInset>
            <Sidekick mobileBehavior="floating">
              <SidekickHeader>
                <span className="font-semibold">Live Support</span>
                <div className="ml-auto flex items-center gap-2">
                  <SidekickTrigger />
                  <button
                    aria-label="Close chat"
                    className="text-muted-foreground transition hover:text-foreground"
                    onClick={() => setOpen(false)}
                    type="button"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              </SidekickHeader>
              <SidekickContent>
                <Conversation>
                  <ConversationContent>
                    {messages.map((msg) => (
                      <Message from={msg.from} key={msg.id}>
                        <MessageAvatar className="sr-only" />
                        <MessageContent from={msg.from}>
                          {msg.content}
                        </MessageContent>
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
          </SidekickProvider>
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
