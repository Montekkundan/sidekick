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
import { GlobeIcon } from "lucide-react";
import React from "react";
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
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
  SidekickInset,
  SidekickProvider,
  SidekickTrigger,
} from "@/registry/new-york/blocks/sidekick";

export default function SidekickDemo() {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Example: Custom implementation
  const [messages, setMessages] = React.useState([
    { id: "1", from: "user", content: "Hello, how can you help me?" },
    {
      id: "2",
      from: "assistant",
      content:
        "I am your AI Sidekick. I can help you with coding, writing, and more.",
    },
  ]);

  const handleCustomSubmit = (message: { text: string }) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        from: "user",
        content: message.text,
      },
    ]);

    // Simulate assistant response (replace with your own logic)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          from: "assistant",
          content: `You said: ${message.text}`,
        },
      ]);
    }, 1000);
  };

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
            <PromptInput className="w-full" onSubmit={handleCustomSubmit}>
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
