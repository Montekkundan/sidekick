"use client";

import {
  Conversation,
  ConversationContent,
} from "@repo/design-system/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
} from "@repo/design-system/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@repo/design-system/components/ui/prompt-input";
import {
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
  SidekickTrigger,
  useSidekick,
} from "@repo/design-system/components/ui/sidekick";
import { Kbd, KbdGroup } from "@repo/design-system/components/ui/kbd";
import React from "react";

export function AskSidekick() {
  const { toggleSidekick } = useSidekick();

  React.useEffect(() => {
    const handleAskAI = () => toggleSidekick();
    window.addEventListener("builder:ask-ai", handleAskAI);
    return () => window.removeEventListener("builder:ask-ai", handleAskAI);
  }, [toggleSidekick]);

  const messages = [
    {
      id: "1",
      from: "user",
      content: "Hello!",
    },
    {
      id: "2",
      from: "assistant",
      content: "Hi there! How can I help you today?",
    },
  ];

  const isLoading = false;

  return (
    <Sidekick side="right">
      <SidekickHeader className="justify-between">
        <span className="font-semibold text-sm">Chat</span>
        <SidekickTrigger />
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
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            Tip: You can open and close chat with
            <KbdGroup>
              <Kbd>Cmd</Kbd>
              <Kbd>I</Kbd>
            </KbdGroup>
          </div>
          <PromptInput onSubmit={() => {}}>
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
