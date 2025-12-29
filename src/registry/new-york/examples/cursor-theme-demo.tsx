"use client";

/**
 * Cursor Theme Demo
 *
 * This demonstrates how to compose the base Sidekick and PromptInput components
 * into a Cursor-like chat interface. No wrappers needed - just creative composition
 * of the building blocks with custom buttons and layout.
 *
 * Copy and modify this for your own themed chat UI!
 */

import type { ChatStatus } from "ai";
import {
  AtSignIcon,
  BotIcon,
  ChevronDownIcon,
  GlobeIcon,
  ImageIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";
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
  PromptInputButton,
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
  Message,
  MessageAvatar,
  MessageContent,
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
  useSidekick,
} from "@/registry/new-york/blocks/sidekick";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip";

// ============================================================================
// Types
// ============================================================================

type MessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ModelOption = {
  id: string;
  name: string;
  description: string;
};

// ============================================================================
// Demo Data
// ============================================================================

const models: ModelOption[] = [
  { id: "gpt-4o", name: "GPT-4o", description: "Most capable model" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast & efficient" },
  { id: "claude-sonnet", name: "Claude Sonnet", description: "Balanced" },
];

// ============================================================================
// Custom Composed Components (Cursor-style)
// ============================================================================

/**
 * Model selector button - shows how to compose DropdownMenu with PromptInputButton
 */
function ModelSelectorButton() {
  const [model, setModel] = useState(models[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PromptInputButton className="gap-1 px-2">
          <SparklesIcon className="size-3.5" />
          <span className="text-xs">{model.name}</span>
          <ChevronDownIcon className="size-3" />
        </PromptInputButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {models.map((m) => (
          <DropdownMenuItem key={m.id} onClick={() => setModel(m)}>
            <div className="flex flex-col">
              <span className="font-medium">{m.name}</span>
              <span className="text-muted-foreground text-xs">
                {m.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Web search toggle - shows how to add custom feature buttons
 */
function WebSearchButton() {
  const [enabled, setEnabled] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <PromptInputButton
            className={enabled ? "bg-accent text-accent-foreground" : ""}
            onClick={() => setEnabled(!enabled)}
          >
            <GlobeIcon className="size-4" />
          </PromptInputButton>
        </TooltipTrigger>
        <TooltipContent>
          {enabled ? "Disable" : "Enable"} web search
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Code context button - shows how to add @ mentions style button
 */
function CodeContextButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <PromptInputButton>
            <AtSignIcon className="size-4" />
          </PromptInputButton>
        </TooltipTrigger>
        <TooltipContent>Add context (@files, @docs)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Image upload button - uses existing attachment system
 */
function ImageUploadButton() {
  return (
    <PromptInputActionMenu>
      <PromptInputActionMenuTrigger>
        <ImageIcon className="size-4" />
      </PromptInputActionMenuTrigger>
      <PromptInputActionMenuContent>
        <PromptInputActionAddAttachments label="Upload images" />
      </PromptInputActionMenuContent>
    </PromptInputActionMenu>
  );
}

// ============================================================================
// Main Chat Demo
// ============================================================================

function CursorChatDemo() {
  const { setOpen } = useSidekick();
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI coding assistant. How can I help you today?",
    },
  ]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    if (!(message.text.trim() || message.files?.length)) return;

    const userMessage: MessageType = {
      id: nanoid(),
      role: "user",
      content: message.text || "[Attached files]",
    };
    setMessages((prev) => [...prev, userMessage]);
    setStatus("submitted");

    // Simulate AI response
    setTimeout(() => {
      setStatus("streaming");
      setTimeout(() => {
        const assistantMessage: MessageType = {
          id: nanoid(),
          role: "assistant",
          content:
            "I can help you with that! Here's what I found in your codebase...",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setStatus("ready");
      }, 1000);
    }, 300);
  };

  return (
    <Sidekick>
      {/* Custom header with title */}
      <SidekickHeader>
        <div className="flex items-center gap-2">
          <BotIcon className="size-4 text-primary" />
          <span className="font-medium text-sm">Cursor Chat</span>
        </div>
      </SidekickHeader>

      <SidekickContent>
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState>
                <SparklesIcon className="size-8 text-muted-foreground" />
                <h3 className="font-medium">Start a conversation</h3>
                <p className="text-muted-foreground text-sm">
                  Ask me anything about your code
                </p>
              </ConversationEmptyState>
            ) : (
              messages.map((msg) => (
                <Message from={msg.role} key={msg.id}>
                  <MessageAvatar>
                    {msg.role === "user" ? (
                      <UserIcon className="size-4" />
                    ) : (
                      <BotIcon className="size-4" />
                    )}
                  </MessageAvatar>
                  <MessageContent>{msg.content}</MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
        </Conversation>
      </SidekickContent>

      <SidekickFooter>
        {/* 
          This is the key part - composing PromptInput with custom tools!
          Users can add any buttons they want in the footer.
        */}
        <PromptInput multiple onSubmit={handleSubmit}>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask anything... (@ to mention files)"
              ref={textareaRef}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              {/* Custom composed buttons - this is the "theme" */}
              <ModelSelectorButton />
              <CodeContextButton />
              <WebSearchButton />
              <ImageUploadButton />
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </SidekickFooter>
    </Sidekick>
  );
}

export default function CursorThemeDemo() {
  return <CursorChatDemo />;
}
