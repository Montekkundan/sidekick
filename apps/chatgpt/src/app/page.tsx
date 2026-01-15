"use client";

import { Avatar, AvatarImage } from "@repo/design-system/components/ui/avatar";
import { Button } from "@repo/design-system/components/ui/button";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputCard,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputAttachments,
} from "@repo/design-system/components/ui/prompt-input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@repo/design-system/components/ui/sidebar";
import {
  ChevronDownIcon,
  Edit3Icon,
  MessageSquareIcon,
  MicIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";

function OpenAILogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 260"
    >
      <title>OpenAI</title>
      <path
        d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PromptPlusButton() {
  const attachments = usePromptInputAttachments();

  return (
    <PromptInputButton
      aria-label="Add"
      className="rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      onClick={() => attachments.openFileDialog()}
      size="icon-sm"
    >
      <PlusIcon className="size-4" />
    </PromptInputButton>
  );
}

function SidebarLogoButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      aria-label="Toggle sidebar"
      className="h-7 w-7"
      onClick={toggleSidebar}
      size="icon"
      type="button"
      variant="ghost"
    >
      <OpenAILogo className="size-4" />
    </Button>
  );
}

function ChatGPTPrompt() {
  return (
    <PromptInputProvider>
      <PromptInputCard className="rounded-full bg-muted/40 shadow-sm">
        <PromptInput
          className="py-1"
          focusRing={false}
          onSubmit={() => undefined}
          shape="pill"
          size="sm"
          variant="none"
        >
          <PromptInputBody className="min-h-12 items-center gap-2 px-2 py-1.5">
            <PromptPlusButton />
            <PromptInputTextarea
              className="!min-h-0 !h-10 !overflow-hidden !px-1 !py-2 flex-1 text-sm"
              placeholder="Ask anything"
              rows={1}
            />
            <PromptInputButton
              aria-label="Voice"
              className="rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              size="icon-sm"
            >
              <MicIcon className="size-4" />
            </PromptInputButton>
            <PromptInputSubmit
              aria-label="Send"
              className="rounded-full bg-orange-500 text-white hover:bg-orange-500/90"
              size="icon-sm"
            />
          </PromptInputBody>
        </PromptInput>
      </PromptInputCard>
    </PromptInputProvider>
  );
}

function SidebarIconButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={label}>
        {icon}
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function Page() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-svh w-full bg-background text-foreground">
        <Sidebar collapsible="icon" variant="sidebar">
          <SidebarHeader className="px-2">
            <div className="flex h-9 items-center justify-between">
              <SidebarLogoButton />
            </div>
          </SidebarHeader>

          <SidebarContent className="px-1">
            <SidebarMenu>
              <SidebarIconButton
                icon={<Edit3Icon className="size-4" />}
                label="New chat"
              />
              <SidebarIconButton
                icon={<SearchIcon className="size-4" />}
                label="Search"
              />
              <SidebarIconButton
                icon={<MessageSquareIcon className="size-4" />}
                label="Library"
              />
            </SidebarMenu>

            <SidebarSeparator />

            <div className="px-2">
              <div className="h-8" />
            </div>
          </SidebarContent>

          <SidebarFooter className="px-2">
            <div className="flex items-center justify-between">
              <Avatar className="size-7">
                <AvatarImage
                  alt="Montek"
                  src="https://github.com/montekkundan.png"
                />
              </Avatar>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <main className="relative flex min-h-svh flex-1 flex-col">
          <div className="absolute top-0 left-0 z-10 flex w-full items-center justify-between px-4 py-3">
            <button
              className="flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              type="button"
            >
              <span className="font-medium text-foreground text-sm">
                ChatGPT 5.2
              </span>
              <ChevronDownIcon className="size-4" />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 pt-10 pb-2">
            <div className="w-full max-w-2xl">
              <h1 className="mb-6 text-center font-medium text-2xl">
                How can I help, Montek?
              </h1>
              <ChatGPTPrompt />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
