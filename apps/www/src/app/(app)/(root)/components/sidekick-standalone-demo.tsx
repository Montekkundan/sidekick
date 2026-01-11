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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design-system/components/ui/avatar";
import { useState } from "react";
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

export function SidekickStandaloneDemo() {
  const [messages, _] = useState([
    { id: "1", from: "user", content: "Hello, how can you help me?" },
    {
      id: "2",
      from: "assistant",
      content:
        "I am your AI Sidekick. I can help you with coding, writing, and more.",
    },
  ]);
  return (
    <div className="h-[640px] overflow-hidden rounded-xl border">
      <Sidekick standalone>
        <SidekickHeader>
          <span className="font-semibold">AI Assistant</span>
        </SidekickHeader>
        <SidekickContent>
          <Conversation>
            <ConversationContent>
              {messages.map((msg) => (
                <Message
                  className={
                    msg.from === "user" ? "flex-row-reverse" : "flex-row"
                  }
                  from={msg.from as "user" | "assistant"}
                  key={msg.id}
                >
                  <Avatar className="h-6 w-6 rounded-full">
                    <AvatarImage
                      alt={msg.from === "user" ? "@montekkundan" : "shadcn"}
                      src={
                        msg.from === "user"
                          ? "https://github.com/montekkundan.png"
                          : "https://github.com/shadcn.png"
                      }
                    />
                    <AvatarFallback>
                      {msg.from === "user" ? "MK" : "CN"}
                    </AvatarFallback>
                  </Avatar>
                  <MessageContent>{msg.content}</MessageContent>
                </Message>
              ))}
            </ConversationContent>
          </Conversation>
        </SidekickContent>
        <SidekickFooter>
          <PromptInput onSubmit={() => {}}>
            <PromptInputBody>
              <PromptInputTextarea placeholder="Ask me anything..." />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit />
            </PromptInputFooter>
          </PromptInput>
        </SidekickFooter>
      </Sidekick>
    </div>
  );
}
