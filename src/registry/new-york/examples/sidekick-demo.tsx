"use client";

import { GlobeIcon } from "lucide-react";
import * as React from "react";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSpeechButton,
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

export default function SidekickDemo() {
  const [messages, setMessages] = React.useState([
    { id: "1", from: "user", content: "Hello, how can you help me?" },
    {
      id: "2",
      from: "assistant",
      content:
        "I am your AI Sidekick. I can help you with coding, writing, and more.",
    },
  ]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex h-full w-full overflow-hidden rounded-xl border bg-background shadow-lg">
      <SidekickProvider
        className="min-h-0"
        defaultOpen={true}
        style={
          {
            "--sidekick-width": "320px",
          } as React.CSSProperties
        }
      >
        <SidekickInset>
          <div className="flex h-full flex-col items-center justify-center bg-muted/20 p-6 text-center">
            <SidekickTrigger className="mb-4 md:hidden" />
            <div className="max-w-xs space-y-2">
              <h3 className="font-semibold text-lg">Main Content</h3>
              <p className="text-muted-foreground text-sm">
                Use <kbd className="font-mono text-xs">⌘I</kbd> to toggle panel.
              </p>
            </div>
          </div>
        </SidekickInset>

        <Sidekick>
          <SidekickHeader>
            <span className="font-semibold">AI Assistant</span>
            <div className="ml-auto">
              <SidekickTrigger />
            </div>
          </SidekickHeader>
          <SidekickContent>
            <Conversation>
              <ConversationContent>
                {messages.map((msg) => (
                  <Message from={msg.from as "user" | "assistant"} key={msg.id}>
                    <MessageAvatar className="sr-only" />
                    <MessageContent from={msg.from as "user" | "assistant"}>
                      {msg.content}
                    </MessageContent>
                  </Message>
                ))}
              </ConversationContent>
            </Conversation>
          </SidekickContent>
          <SidekickFooter>
            <PromptInput
              className="w-full"
              onSubmit={(message) => {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    from: "user",
                    content: message.text,
                  },
                ]);
              }}
            >
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
              <PromptInputBody>
                <PromptInputTextarea
                  placeholder="Ask me anything..."
                  ref={textareaRef}
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                  <PromptInputSpeechButton textareaRef={textareaRef} />
                  <PromptInputButton>
                    <GlobeIcon size={16} />
                    <span>Search</span>
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit />
              </PromptInputFooter>
            </PromptInput>
          </SidekickFooter>
        </Sidekick>
      </SidekickProvider>
    </div>
  );
}
