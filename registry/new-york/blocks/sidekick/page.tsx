"use client"

import { BotIcon, MessageSquareIcon, UserIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useRef, useState } from "react"

import {
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
  SidekickTrigger,
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  Message,
  MessageAvatar,
  MessageContent,
} from "@/registry/new-york/blocks/sidekick"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputAttachments,
  PromptInputAttachment,
  type PromptInputMessage,
} from "@/registry/new-york/blocks/prompt-input"

type ChatMessage = {
  id: string
  content: string
  from: "user" | "assistant"
}

const DEMO_RESPONSES = [
  "Hello! I'm your AI assistant. How can I help you today?",
  "That's a great question! Let me think about that for a moment...",
  "I'd be happy to help you with that. Here's what I suggest:",
  "Interesting! Could you tell me more about what you're looking for?",
  "Based on what you've shared, I think the best approach would be to start with the basics and build from there.",
  "I understand. Let me provide some additional context that might be helpful.",
  "That makes sense! Is there anything specific you'd like me to elaborate on?",
  "Great point! Here are some resources that might help you learn more.",
]

const SidekickExample = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming">("ready")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: nanoid(),
      content: message.text,
      from: "user",
    }
    setMessages((prev) => [...prev, userMessage])
    setStatus("submitted")

    // Simulate AI response
    setTimeout(() => {
      setStatus("streaming")
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        content: DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)],
        from: "assistant",
      }
      setTimeout(() => {
        setMessages((prev) => [...prev, assistantMessage])
        setStatus("ready")
      }, 1000)
    }, 500)
  }

  return (
    <Sidekick side="right" className="h-full">
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
              title="Start a conversation"
              description="Send a message to begin chatting with your AI assistant."
              icon={<MessageSquareIcon className="size-8" />}
            />
          ) : (
            <ConversationContent>
              {messages.map((msg) => (
                <Message key={msg.id} from={msg.from}>
                  <MessageAvatar>
                    {msg.from === "user" ? (
                      <UserIcon className="size-4" />
                    ) : (
                      <BotIcon className="size-4" />
                    )}
                  </MessageAvatar>
                  <MessageContent from={msg.from}>
                    {msg.content}
                  </MessageContent>
                </Message>
              ))}
              {status === "streaming" && (
                <Message from="assistant">
                  <MessageAvatar>
                    <BotIcon className="size-4" />
                  </MessageAvatar>
                  <MessageContent from="assistant">
                    <span className="inline-flex items-center gap-1">
                      <span className="size-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "0ms" }} />
                      <span className="size-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "150ms" }} />
                      <span className="size-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "300ms" }} />
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
        <PromptInput onSubmit={handleSubmit} multiple>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputBody>
            <PromptInputTextarea
              ref={textareaRef}
              placeholder="Ask me anything..."
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
  )
}

export default SidekickExample
