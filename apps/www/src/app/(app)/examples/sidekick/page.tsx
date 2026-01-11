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
} from "@/registry/new-york/blocks/prompt-input";
import {
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
  SidekickInset,
  SidekickProvider,
  SidekickTrigger,
} from "@/registry/new-york/blocks/sidekick";

function SidekickPage() {
  return (
    <SidekickProvider>
      <SidekickInset>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 font-semibold text-xl">Main Content</h2>
            <p className="mb-4 text-muted-foreground">
              Click the button to open the AI assistant
            </p>
            <SidekickTrigger />
          </div>
        </div>
      </SidekickInset>

      <Sidekick>
        <SidekickHeader>
          <span>AI Assistant</span>
          <SidekickTrigger />
        </SidekickHeader>

        <SidekickContent>
          <Conversation>
            <ConversationContent>
              <Message from="user">
                <MessageContent>Hello!</MessageContent>
              </Message>
              <Message from="assistant">
                <MessageContent>
                  Hi there! How can I help you today?
                </MessageContent>
              </Message>
              <Message from="user">
                <MessageContent>
                  Can you explain what this component does?
                </MessageContent>
              </Message>
              <Message from="assistant">
                <MessageContent>
                  This is a Sidekick component that provides a collapsible panel
                  for AI conversations. It includes features like message
                  history, conversation scrolling, and an integrated prompt
                  input.
                </MessageContent>
              </Message>
            </ConversationContent>
          </Conversation>
        </SidekickContent>

        <SidekickFooter>
          <PromptInput onSubmit={(message) => console.log(message)}>
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
    </SidekickProvider>
  );
}

export default SidekickPage;
