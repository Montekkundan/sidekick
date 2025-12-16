"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowDownIcon, PanelLeftIcon } from "lucide-react"

import { cn } from "@/registry/new-york/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { Separator } from "@/registry/new-york/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/registry/new-york/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

// ============================================================================
// Sidekick Constants
// ============================================================================

const SIDEKICK_COOKIE_NAME = "sidekick_state"
const SIDEKICK_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEKICK_WIDTH = "24rem"
const SIDEKICK_WIDTH_MOBILE = "100%"
const SIDEKICK_WIDTH_COLLAPSED = "0rem"
const SIDEKICK_KEYBOARD_SHORTCUT = "k"

// ============================================================================
// Sidekick Context
// ============================================================================

type SidekickContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidekick: () => void
}

const SidekickContext = React.createContext<SidekickContextProps | null>(null)

function useSidekick() {
  const context = React.useContext(SidekickContext)
  if (!context) {
    throw new Error("useSidekick must be used within a SidekickProvider.")
  }
  return context
}

// ============================================================================
// Hook: useIsMobile
// ============================================================================

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// ============================================================================
// Sidekick Provider
// ============================================================================

type SidekickProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function SidekickProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidekickProviderProps) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
      document.cookie = `${SIDEKICK_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEKICK_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  const toggleSidekick = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEKICK_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidekick()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidekick])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidekickContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidekick,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidekick]
  )

  return (
    <SidekickContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidekick-wrapper"
          style={
            {
              "--sidekick-width": SIDEKICK_WIDTH,
              "--sidekick-width-collapsed": SIDEKICK_WIDTH_COLLAPSED,
              ...style,
            } as React.CSSProperties
          }
          className={cn("flex h-full min-h-svh w-full", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidekickContext.Provider>
  )
}

// ============================================================================
// Sidekick Panel
// ============================================================================

type SidekickProps = React.ComponentProps<"aside"> & {
  side?: "left" | "right"
}

function Sidekick({
  side = "right",
  className,
  children,
  ...props
}: SidekickProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidekick()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          data-sidekick="panel"
          data-slot="sidekick"
          data-mobile="true"
          className="flex h-full w-full flex-col bg-background p-0 [&>button]:hidden"
          style={
            {
              "--sidekick-width": SIDEKICK_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>AI Assistant</SheetTitle>
            <SheetDescription>Chat with your AI assistant.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      className={cn(
        "group peer hidden flex-col border-l bg-background text-foreground transition-[width] duration-200 ease-linear md:flex",
        state === "expanded" ? "w-(--sidekick-width)" : "w-0 overflow-hidden",
        side === "left" && "order-first border-l-0 border-r",
        className
      )}
      data-state={state}
      data-side={side}
      data-slot="sidekick"
      {...props}
    >
      <div className="flex h-full w-(--sidekick-width) flex-col">
        {children}
      </div>
    </aside>
  )
}

// ============================================================================
// Sidekick Trigger
// ============================================================================

function SidekickTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidekick } = useSidekick()

  return (
    <Button
      data-sidekick="trigger"
      data-slot="sidekick-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidekick()
      }}
      {...props}
    >
      <PanelLeftIcon className="size-4" />
      <span className="sr-only">Toggle AI Assistant</span>
    </Button>
  )
}

// ============================================================================
// Sidekick Layout Components
// ============================================================================

function SidekickHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidekick-header"
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b px-4",
        className
      )}
      {...props}
    />
  )
}

function SidekickFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidekick-footer"
      className={cn("shrink-0 border-t p-4", className)}
      {...props}
    />
  )
}

function SidekickContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidekick-content"
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      {...props}
    />
  )
}

function SidekickInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidekick-inset"
      className={cn("relative flex w-full flex-1 flex-col", className)}
      {...props}
    />
  )
}

function SidekickSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidekick-separator"
      className={cn("mx-2 w-auto", className)}
      {...props}
    />
  )
}

function SidekickInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidekick-input"
      className={cn("h-8 w-full bg-background shadow-none", className)}
      {...props}
    />
  )
}

// ============================================================================
// Conversation Components
// ============================================================================

type ConversationContextProps = {
  scrollToBottom: () => void
  isAtBottom: boolean
}

const ConversationContext = React.createContext<ConversationContextProps | null>(null)

function useConversation() {
  const context = React.useContext(ConversationContext)
  if (!context) {
    throw new Error("useConversation must be used within a Conversation.")
  }
  return context
}

type ConversationProps = React.ComponentProps<"div">

function Conversation({ className, children, ...props }: ConversationProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = React.useState(true)

  const scrollToBottom = React.useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [])

  const handleScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < 50)
    }
  }, [])

  React.useEffect(() => {
    const scrollEl = scrollRef.current
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll)
      return () => scrollEl.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // Auto-scroll when children change and user is at bottom
  React.useEffect(() => {
    if (isAtBottom) {
      scrollToBottom()
    }
  }, [children, isAtBottom, scrollToBottom])

  const contextValue = React.useMemo(
    () => ({ scrollToBottom, isAtBottom }),
    [scrollToBottom, isAtBottom]
  )

  return (
    <ConversationContext.Provider value={contextValue}>
      <div
        ref={scrollRef}
        data-slot="conversation"
        className={cn("relative flex-1 overflow-y-auto", className)}
        role="log"
        {...props}
      >
        {children}
      </div>
    </ConversationContext.Provider>
  )
}

function ConversationContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="conversation-content"
      className={cn("flex flex-col gap-4 p-4", className)}
      {...props}
    />
  )
}

type ConversationEmptyStateProps = React.ComponentProps<"div"> & {
  title?: string
  description?: string
  icon?: React.ReactNode
}

function ConversationEmptyState({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) {
  return (
    <div
      data-slot="conversation-empty-state"
      className={cn(
        "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div className="space-y-1">
            <h3 className="font-medium text-sm">{title}</h3>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function ConversationScrollButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { isAtBottom, scrollToBottom } = useConversation()

  if (isAtBottom) return null

  return (
    <Button
      data-slot="conversation-scroll-button"
      className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full",
        className
      )}
      onClick={scrollToBottom}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      <ArrowDownIcon className="size-4" />
    </Button>
  )
}

// ============================================================================
// Message Components
// ============================================================================

const messageVariants = cva("flex w-full gap-3", {
  variants: {
    from: {
      user: "flex-row-reverse",
      assistant: "flex-row",
    },
  },
  defaultVariants: {
    from: "assistant",
  },
})

type MessageProps = React.ComponentProps<"div"> &
  VariantProps<typeof messageVariants>

function Message({ className, from, children, ...props }: MessageProps) {
  return (
    <div
      data-slot="message"
      data-from={from}
      className={cn(messageVariants({ from }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

const messageContentVariants = cva(
  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
  {
    variants: {
      from: {
        user: "bg-primary text-primary-foreground rounded-br-md",
        assistant: "bg-muted text-foreground rounded-bl-md",
      },
    },
    defaultVariants: {
      from: "assistant",
    },
  }
)

type MessageContentProps = React.ComponentProps<"div"> &
  VariantProps<typeof messageContentVariants>

function MessageContent({
  className,
  from,
  ...props
}: MessageContentProps) {
  return (
    <div
      data-slot="message-content"
      className={cn(messageContentVariants({ from }), className)}
      {...props}
    />
  )
}

function MessageAvatar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
}

function MessageTimestamp({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="message-timestamp"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function MessageActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-actions"
      className={cn("flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", className)}
      {...props}
    />
  )
}

// ============================================================================
// Exports
// ============================================================================

export {
  // Sidekick
  Sidekick,
  SidekickContent,
  SidekickFooter,
  SidekickHeader,
  SidekickInset,
  SidekickInput,
  SidekickProvider,
  SidekickSeparator,
  SidekickTrigger,
  useSidekick,
  // Conversation
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  useConversation,
  // Message
  Message,
  MessageActions,
  MessageAvatar,
  MessageContent,
  MessageTimestamp,
}
