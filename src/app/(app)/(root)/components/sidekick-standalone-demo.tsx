"use client";

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
} from "@/registry/new-york/blocks/sidekick";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input";

export function SidekickStandaloneDemo() {
  return (
    <div className="h-[640px] overflow-hidden rounded-xl border">
      <Sidekick standalone>
        <SidekickHeader>
          <span className="font-semibold">AI Assistant</span>
        </SidekickHeader>
        <SidekickContent>
          <Conversation>
            <ConversationContent>
              <Message from="user">
                <MessageAvatar className="text-xs">ME</MessageAvatar>
                <MessageContent from="user">Hello!</MessageContent>
              </Message>
              <Message from="assistant">
                <MessageContent from="assistant">
                  Hi there! How can I help you today?
                </MessageContent>
              </Message>
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
