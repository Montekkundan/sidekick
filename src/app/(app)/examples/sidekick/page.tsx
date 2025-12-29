"use client";

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
  SidekickInset,
  SidekickProvider,
  SidekickTrigger,
} from "@/registry/new-york/blocks/sidekick";

function SidekickPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="mb-2 font-bold text-3xl">Sidekick Component</h1>
          <p className="text-muted-foreground">
            A collapsible AI assistant panel with conversation support.
          </p>
        </div>

        <div className="h-[600px] rounded-lg border">
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
                      <MessageContent from="user">Hello!</MessageContent>
                    </Message>
                    <Message from="assistant">
                      <MessageContent from="assistant">
                        Hi there! How can I help you today?
                      </MessageContent>
                    </Message>
                    <Message from="user">
                      <MessageContent from="user">
                        Can you explain what this component does?
                      </MessageContent>
                    </Message>
                    <Message from="assistant">
                      <MessageContent from="assistant">
                        This is a Sidekick component that provides a collapsible
                        panel for AI conversations. It includes features like
                        message history, conversation scrolling, and an
                        integrated prompt input.
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
        </div>
      </div>
    </div>
  );
}

export default SidekickPage;
