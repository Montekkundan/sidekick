"use client";

import {
  ArrowUpIcon,
  AtSignIcon,
  BotIcon,
  BrainIcon,
  BugIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  FileIcon,
  FolderIcon,
  GlobeIcon,
  ImageIcon,
  InfinityIcon,
  MessageSquareIcon,
  MicIcon,
  PencilIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from "react";
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
  PromptInputProvider,
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
} from "@/registry/new-york/blocks/sidekick";
import { cn } from "@/registry/new-york/lib/utils";
import { Button } from "@/registry/new-york/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/registry/new-york/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { Input } from "@/registry/new-york/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover";
import { Switch } from "@/registry/new-york/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip";

export const themeConfig = {
  name: "cursor",
  label: "Cursor",
  description: "Cursor IDE-inspired chat with model selector and tools",
};

const agentModes = [
  { id: "agent", name: "Agent", icon: InfinityIcon, shortcut: "⌘I" },
  { id: "plan", name: "Plan", icon: SettingsIcon, shortcut: null },
  { id: "debug", name: "Debug", icon: BugIcon, shortcut: null },
  { id: "ask", name: "Ask", icon: MessageSquareIcon, shortcut: null },
];

const models = [
  { id: "composer-1", name: "Composer 1", brain: false },
  { id: "opus-4.5", name: "Opus 4.5", brain: true },
  { id: "sonnet-4.5", name: "Sonnet 4.5", brain: true },
  { id: "gpt-5.1-codex-max", name: "GPT-5.1 Codex Max", brain: true },
  { id: "gpt-5.2", name: "GPT-5.2", brain: false },
  { id: "gemini-3-flash", name: "Gemini 3 Flash", brain: true },
  { id: "gpt-5.1-codex-mini", name: "GPT-5.1 Codex Mini", brain: true },
  { id: "grok-code", name: "Grok Code", brain: true },
];

function AgentModeSelector() {
  const [mode, setMode] = useState(agentModes[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-auto items-center gap-1 rounded-full bg-muted/50 px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          type="button"
        >
          <InfinityIcon className="size-3.5" />
          <span className="@[420px]:inline hidden text-xs">{mode.name}</span>
          <ChevronDownIcon className="size-2.5 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {agentModes.map((m) => (
          <DropdownMenuItem
            className="flex items-center justify-between"
            key={m.id}
            onClick={() => setMode(m)}
          >
            <div className="flex items-center gap-2">
              {m.icon && <m.icon className="size-3.5 text-muted-foreground" />}
              <span className="text-sm">{m.name}</span>
              {m.shortcut && (
                <span className="text-muted-foreground text-xs">
                  {m.shortcut}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <PencilIcon className="size-3 text-muted-foreground" />
              {mode.id === m.id && <CheckIcon className="size-3" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ModelSelectorButton() {
  const [model, setModel] = useState(models[1]);
  const [autoMode, setAutoMode] = useState(false);
  const [maxMode, setMaxMode] = useState(false);
  const [multiModel, setMultiModel] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-auto items-center gap-1 px-1 py-1 text-muted-foreground transition-colors hover:text-foreground"
          type="button"
        >
          <span className="text-xs">{model.name}</span>
          <ChevronDownIcon className="size-2.5 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <div className="p-2">
          <Input className="h-7 text-xs" placeholder="Search models" />
        </div>
        <div className="space-y-1 px-2 pb-2">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm">Auto</span>
            <Switch checked={autoMode} onCheckedChange={setAutoMode} />
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm">MAX Mode</span>
            <Switch checked={maxMode} onCheckedChange={setMaxMode} />
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm">Use Multiple Models</span>
            <Switch checked={multiModel} onCheckedChange={setMultiModel} />
          </div>
        </div>
        <DropdownMenuSeparator />
        {models.map((m) => (
          <DropdownMenuItem
            className="flex items-center justify-between"
            key={m.id}
            onClick={() => setModel(m)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{m.name}</span>
              {m.brain && (
                <BrainIcon className="size-3.5 text-muted-foreground" />
              )}
            </div>
            {model.id === m.id && <CheckIcon className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UsageIndicator() {
  return (
    <button
      className="flex h-auto items-center px-1 py-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
      type="button"
    >
      1×
    </button>
  );
}

type ContextButtonProps = {
  onClick?: () => void;
};

function ContextButton({ onClick }: ContextButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="flex size-5 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            onClick={onClick}
            type="button"
          >
            <AtSignIcon className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Add context</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function WebSearchButton() {
  const [enabled, setEnabled] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "flex size-5 items-center justify-center transition-colors",
              enabled
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setEnabled(!enabled)}
            type="button"
          >
            <GlobeIcon className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {enabled ? "Disable" : "Enable"} web search
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ImageUploadButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger className="size-5 p-0 text-muted-foreground hover:bg-transparent hover:text-foreground">
              <ImageIcon className="size-3.5" />
            </PromptInputActionMenuTrigger>
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments label="Upload images" />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </TooltipTrigger>
        <TooltipContent>Add image</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type VoiceOrSubmitButtonProps = {
  hasContent: boolean;
};

function VoiceOrSubmitButton({ hasContent }: VoiceOrSubmitButtonProps) {
  if (hasContent) {
    return (
      <PromptInputSubmit
        className="size-6 rounded-full"
        size="icon-sm"
        variant="default"
      >
        <ArrowUpIcon className="size-3.5" />
      </PromptInputSubmit>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="size-6 rounded-full p-0"
            type="button"
            variant="default"
          >
            <MicIcon className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Voice Input (⇧⌘Space)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const contextItems = [
  {
    id: "files",
    name: "Files",
    icon: FileIcon,
    description: "Reference a file",
  },
  {
    id: "folders",
    name: "Folders",
    icon: FolderIcon,
    description: "Reference a folder",
  },
  {
    id: "code",
    name: "Code",
    icon: AtSignIcon,
    description: "Reference code symbols",
  },
  {
    id: "docs",
    name: "Docs",
    icon: FileIcon,
    description: "Reference documentation",
  },
  { id: "web", name: "Web", icon: GlobeIcon, description: "Search the web" },
];

const commandItems = [
  {
    id: "agent-review",
    name: "Agent Review",
    icon: ClockIcon,
    description: "Review with agent",
  },
  {
    id: "create-command",
    name: "Create Command",
    icon: PlusIcon,
    description: "Create a new command",
  },
];

type MentionCommandPopoverProps = {
  trigger: "@" | "/";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: { id: string; name: string }) => void;
  anchorEl: HTMLElement | null;
};

function MentionCommandPopover({
  trigger,
  open,
  onOpenChange,
  onSelect,
  anchorEl,
}: MentionCommandPopoverProps) {
  const items = trigger === "@" ? contextItems : commandItems;
  const title = trigger === "@" ? "Context" : "Actions";

  if (!anchorEl) return null;

  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger asChild>
        <span className="sr-only">Trigger</span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        side="top"
        sideOffset={8}
      >
        <Command>
          <CommandList>
            <CommandGroup heading={title}>
              {items.map((item) => (
                <CommandItem
                  className="flex items-center gap-2"
                  key={item.id}
                  onSelect={() => {
                    onSelect(item);
                    onOpenChange(false);
                  }}
                >
                  <item.icon className="size-4 text-muted-foreground" />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type CursorTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onOpenMention?: () => void;
  mentionOpen?: boolean;
  onMentionOpenChange?: (open: boolean) => void;
};

function CursorTextarea({
  value,
  onChange,
  placeholder,
  className,
  mentionOpen: externalMentionOpen,
  onMentionOpenChange,
}: CursorTextareaProps) {
  const [internalMentionOpen, setInternalMentionOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [triggerChar, setTriggerChar] = useState<"@" | "/" | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mentionOpen = externalMentionOpen ?? internalMentionOpen;
  const setMentionOpen = onMentionOpenChange ?? setInternalMentionOpen;

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setInternalMentionOpen(false);
      setCommandOpen(false);
      setTriggerChar(null);
    }
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      const cursorPos = e.target.selectionStart;
      onChange(newValue);

      // Check for @ or / trigger
      if (cursorPos > 0) {
        const charBeforeCursor = newValue[cursorPos - 1];
        const charBeforeTrigger = cursorPos > 1 ? newValue[cursorPos - 2] : " ";

        // Only trigger on @ or / at start or after whitespace
        if (
          (charBeforeCursor === "@" || charBeforeCursor === "/") &&
          (charBeforeTrigger === " " ||
            charBeforeTrigger === "\n" ||
            cursorPos === 1)
        ) {
          setTriggerChar(charBeforeCursor as "@" | "/");
          if (charBeforeCursor === "@") {
            setMentionOpen(true);
            setCommandOpen(false);
          } else {
            setCommandOpen(true);
            setMentionOpen(false);
          }
        } else if (charBeforeCursor === " " || charBeforeCursor === "\n") {
          setMentionOpen(false);
          setCommandOpen(false);
          setTriggerChar(null);
        }
      }
    },
    [onChange, setMentionOpen]
  );

  const handleSelect = useCallback(
    (item: { id: string; name: string }) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      const cursorPos = textarea.selectionStart;
      const hasAtTrigger = triggerChar === "@";
      const beforeTrigger = hasAtTrigger
        ? value.slice(0, cursorPos - 1)
        : value.slice(0, cursorPos);
      const afterCursor = hasAtTrigger
        ? value.slice(cursorPos)
        : value.slice(cursorPos);
      const newValue = `${beforeTrigger}@${item.name} ${afterCursor}`;

      onChange(newValue);
      setMentionOpen(false);
      setCommandOpen(false);
      setTriggerChar(null);

      setTimeout(() => {
        textarea.focus();
        const newCursorPos = beforeTrigger.length + item.name.length + 2;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, onChange, triggerChar, setMentionOpen]
  );

  const handleMentionOpenChange = useCallback(
    (open: boolean) => {
      setMentionOpen(open);
      if (open) {
        setTriggerChar("@");
        textareaRef.current?.focus();
      } else {
        setTriggerChar(null);
      }
    },
    [setMentionOpen]
  );

  return (
    <div className="relative w-full">
      <PromptInputTextarea
        className={cn("min-h-12 text-sm", className)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={textareaRef}
        value={value}
      />
      {(triggerChar === "@" || mentionOpen) && (
        <MentionCommandPopover
          anchorEl={textareaRef.current}
          onOpenChange={handleMentionOpenChange}
          onSelect={handleSelect}
          open={mentionOpen}
          trigger="@"
        />
      )}
      {triggerChar === "/" && (
        <MentionCommandPopover
          anchorEl={textareaRef.current}
          onOpenChange={setCommandOpen}
          onSelect={handleSelect}
          open={commandOpen}
          trigger="/"
        />
      )}
    </div>
  );
}

export function ThemedPromptInput() {
  const [inputValue, setInputValue] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const hasContent = inputValue.trim().length > 0;

  return (
    <PromptInput multiple onSubmit={(message) => console.log(message)}>
      <PromptInputAttachments>
        {(attachment) => <PromptInputAttachment data={attachment} />}
      </PromptInputAttachments>
      <PromptInputBody>
        <CursorTextarea
          mentionOpen={mentionOpen}
          onChange={setInputValue}
          onMentionOpenChange={setMentionOpen}
          placeholder="Plan, @ for context, / for commands"
          value={inputValue}
        />
      </PromptInputBody>
      <PromptInputFooter className="@container gap-0">
        <PromptInputTools className="gap-0">
          <AgentModeSelector />
          <ModelSelectorButton />
          <UsageIndicator />
        </PromptInputTools>
        <PromptInputTools className="gap-1">
          <ContextButton onClick={() => setMentionOpen(true)} />
          <WebSearchButton />
          <ImageUploadButton />
          <VoiceOrSubmitButton hasContent={hasContent} />
        </PromptInputTools>
      </PromptInputFooter>
    </PromptInput>
  );
}

export function ThemedSidekick() {
  const [inputValue, setInputValue] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const hasContent = inputValue.trim().length > 0;

  return (
    <div className="h-[600px] w-full max-w-md overflow-hidden rounded-lg border">
      <Sidekick standalone>
        <SidekickHeader>
          <div className="flex items-center gap-2">
            <BotIcon className="size-4 text-primary" />
            <span className="font-medium text-sm">Cursor Chat</span>
          </div>
        </SidekickHeader>

        <SidekickContent>
          <Conversation>
            <ConversationContent>
              <Message from="assistant">
                <MessageAvatar>
                  <BotIcon className="size-4" />
                </MessageAvatar>
                <MessageContent from="assistant">
                  Hi! I&apos;m your AI coding assistant. How can I help you
                  today?
                </MessageContent>
              </Message>
              <Message from="user">
                <MessageAvatar>
                  <UserIcon className="size-4" />
                </MessageAvatar>
                <MessageContent from="user">
                  Can you help me refactor this function?
                </MessageContent>
              </Message>
              <Message from="assistant">
                <MessageAvatar>
                  <BotIcon className="size-4" />
                </MessageAvatar>
                <MessageContent from="assistant">
                  I&apos;d be happy to help! Please share the function
                  you&apos;d like to refactor.
                </MessageContent>
              </Message>
            </ConversationContent>
          </Conversation>
        </SidekickContent>

        <SidekickFooter>
          <PromptInput multiple onSubmit={(message) => console.log(message)}>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputBody>
              <CursorTextarea
                mentionOpen={mentionOpen}
                onChange={setInputValue}
                onMentionOpenChange={setMentionOpen}
                placeholder="Plan, @ for context, / for commands"
                value={inputValue}
              />
            </PromptInputBody>
            <PromptInputFooter className="@container gap-0">
              <PromptInputTools className="gap-0">
                <AgentModeSelector />
                <ModelSelectorButton />
                <UsageIndicator />
              </PromptInputTools>
              <PromptInputTools className="gap-1">
                <ContextButton onClick={() => setMentionOpen(true)} />
                <WebSearchButton />
                <ImageUploadButton />
                <VoiceOrSubmitButton hasContent={hasContent} />
              </PromptInputTools>
            </PromptInputFooter>
          </PromptInput>
        </SidekickFooter>
      </Sidekick>
    </div>
  );
}

export function AskAIButton({ className }: { className?: string }) {
  return (
    <Button
      className={cn(
        "h-8 gap-2 rounded-full border-zinc-700/50 bg-zinc-900/50 font-normal text-xs text-zinc-400 backdrop-blur-sm hover:bg-zinc-800/50 hover:text-zinc-300",
        className
      )}
      variant="outline"
    >
      <img
        alt="Cursor"
        className="size-3 opacity-70 grayscale"
        src="https://cursor.sh/brand/icon.svg"
      />
      Ask Cursor AI
    </Button>
  );
}

export function AskAILabel({
  label = "Ask AI about this page",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 font-mono text-xs text-zinc-500",
        className
      )}
    >
      <BotIcon className="size-3.5" />
      {label}
    </span>
  );
}

export function CompactPromptInput({
  onSubmit,
  className,
}: {
  onSubmit?: (message: any, event?: any) => void;
  className?: string;
}) {
  return (
    <PromptInputProvider>
      <div
        className={cn(
          "group flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/50 p-1 pl-3 shadow-2xl backdrop-blur-xl transition-all focus-within:border-zinc-600 hover:border-zinc-700",
          className
        )}
      >
        <div className="flex shrink-0 items-center gap-1.5 text-zinc-500">
          <Button
            className="size-6 rounded-full hover:bg-zinc-800 hover:text-zinc-300"
            size="icon"
            variant="ghost"
          >
            <PlusIcon className="size-3.5" />
          </Button>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <PromptInput
          className="flex-1 border-none bg-transparent shadow-none"
          onSubmit={(m, e) => onSubmit?.(m, e)}
          size="sm"
          variant="ghost"
        >
          <PromptInputBody>
            <PromptInputTextarea
              className="min-h-[20px] py-1.5 text-xs placeholder:text-zinc-600 focus-visible:ring-0"
              placeholder="Generate code..."
            />
            <div className="flex items-center gap-1 pr-2">
              <span className="flex h-5 items-center rounded border border-zinc-800 bg-zinc-900 px-1.5 font-mono text-[10px] text-zinc-600">
                ⌘I
              </span>
            </div>
          </PromptInputBody>
        </PromptInput>
      </div>
    </PromptInputProvider>
  );
}
