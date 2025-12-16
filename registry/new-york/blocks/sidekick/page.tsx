"use client";

import { BotIcon, MessageSquareIcon, UserIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/registry/new-york/blocks/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  Message,
  MessageAvatar,
  MessageContent,
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
  SidekickTrigger,
} from "@/registry/new-york/blocks/sidekick";

type ChatMessage = {
  id: string;
  content: string;
  from: "user" | "assistant";
};

const DEMO_RESPONSES = [
  "Hello! I'm your AI assistant. How can I help you today?",
  "That's a great question! Let me think about that for a moment...",
  "I'd be happy to help you with that. Here's what I suggest:",
  "Interesting! Could you tell me more about what you're looking for?",
  "Based on what you've shared, I think the best approach would be to start with the basics and build from there.",
  "I understand. Let me provide some additional context that might be helpful.",
  "That makes sense! Is there anything specific you'd like me to elaborate on?",
  "Great point! Here are some resources that might help you learn more.",
];

const SidekickExample = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming">(
    "ready"
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: nanoid(),
      content: message.text,
      from: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setStatus("submitted");

    // Simulate AI response
    setTimeout(() => {
      setStatus("streaming");
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        content:
          DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)],
        from: "assistant",
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, assistantMessage]);
        setStatus("ready");
      }, 1000);
    }, 500);
  };

  return (
    <Sidekick className="h-full" side="right">
      <SidekickHeader>
        <div className="flex flex-1 items-center gap-2">
          <BotIcon className="size-5 text-primary" />
          <span className="font-semibold">AI Assistant</span>
        </div>
        <SidekickTrigger />
      </SidekickHeader>

      <SidekickContent>
        <Conversation className="h-full">
          {messages.length === 0 ? (
            <ConversationEmptyState
              description="Send a message to begin chatting with your AI assistant."
              icon={<MessageSquareIcon className="size-8" />}
              title="Start a conversation"
            />
          ) : (
            <ConversationContent>
              {messages.map((msg) => (
                <Message from={msg.from} key={msg.id}>
                  <MessageAvatar>
                    {msg.from === "user" ? (
                      <UserIcon className="size-4" />
                    ) : (
                      <BotIcon className="size-4" />
                    )}
                  </MessageAvatar>
                  <MessageContent from={msg.from}>{msg.content}</MessageContent>
                </Message>
              ))}
              {status === "streaming" && (
                <Message from="assistant">
                  <MessageAvatar>
                    <BotIcon className="size-4" />
                  </MessageAvatar>
                  <MessageContent from="assistant">
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="size-2 animate-bounce rounded-full bg-current"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="size-2 animate-bounce rounded-full bg-current"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="size-2 animate-bounce rounded-full bg-current"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                  </MessageContent>
                </Message>
              )}
            </ConversationContent>
          )}
          <ConversationScrollButton />
        </Conversation>
      </SidekickContent>

      <SidekickFooter>
        <PromptInput multiple onSubmit={handleSubmit}>
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
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </SidekickFooter>
    </Sidekick>
  );
};

export default SidekickExample;
