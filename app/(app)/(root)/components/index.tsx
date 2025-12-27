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

export function RootComponents() {
  return (
    <div className="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8">
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
          <PromptInput onSubmit={(message) => console.log(message)}>
            <PromptInputBody>
              <PromptInputTextarea />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit />
            </PromptInputFooter>
          </PromptInput>
      </div>
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
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
      </div>
    </div>
  )
}
