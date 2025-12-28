"use client"

import {
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
} from "@/registry/new-york/blocks/sidekick"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input"

export const themeConfig = {
  name: "default",
  label: "Default",
  description: "Clean, minimal default theme",
}

export function ThemedPromptInput() {
  return (
    <PromptInput onSubmit={(message) => console.log(message)}>
      <PromptInputBody>
        <PromptInputTextarea placeholder="What would you like to know?" />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools />
        <PromptInputSubmit />
      </PromptInputFooter>
    </PromptInput>
  )
}

export function ThemedSidekick() {
  return (
    <div className="h-[600px] w-full max-w-md overflow-hidden rounded-lg border">
      <Sidekick standalone>
        <SidekickHeader>
          <span className="font-semibold">AI Assistant</span>
        </SidekickHeader>

        <SidekickContent>
          <Conversation>
            <ConversationContent>
              <Message from="user">
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
    </div>
  )
}
