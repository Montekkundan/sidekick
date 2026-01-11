"use client";

import { PanelLeftIcon } from "lucide-react";
import React from "react";
import { cn } from "@/registry/new-york/lib/utils";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Separator } from "@/registry/new-york/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/registry/new-york/ui/sheet";
import { TooltipProvider } from "@/registry/new-york/ui/tooltip";

const SIDEKICK_COOKIE_NAME = "sidekick_state";
const SIDEKICK_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEKICK_WIDTH = "24rem";
const SIDEKICK_WIDTH_MOBILE = "100%";
const SIDEKICK_WIDTH_COLLAPSED = "0rem";
const SIDEKICK_KEYBOARD_SHORTCUT = "i";

interface SidekickContextProps {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidekick: () => void;
}

const SidekickContext = React.createContext<SidekickContextProps | null>(null);

function useSidekick() {
  const context = React.useContext(SidekickContext);
  if (!context) {
    throw new Error("useSidekick must be used within a SidekickProvider.");
  }
  return context;
}

// Optional hook that returns null if no provider is present (for standalone mode)
function useOptionalSidekick() {
  return React.useContext(SidekickContext);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

type SidekickProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  defaultOpenMobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function SidekickProvider({
  defaultOpen = true,
  defaultOpenMobile = false,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidekickProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(defaultOpenMobile);

  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      // biome-ignore lint/suspicious/noDocumentCookie: Used for client-side state persistence
      document.cookie = `${SIDEKICK_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEKICK_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  const toggleSidekick = React.useCallback(
    () =>
      isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open),
    [isMobile, setOpen]
  );

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEKICK_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidekick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidekick]);

  const state = open ? "expanded" : "collapsed";

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
    [state, open, setOpen, isMobile, openMobile, toggleSidekick]
  );

  return (
    <SidekickContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          className={cn("flex h-full min-h-svh w-full min-w-0", className)}
          data-slot="sidekick-wrapper"
          style={
            {
              "--sidekick-width": SIDEKICK_WIDTH,
              "--sidekick-width-collapsed": SIDEKICK_WIDTH_COLLAPSED,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidekickContext.Provider>
  );
}

type SidekickProps = React.ComponentProps<"aside"> & {
  side?: "left" | "right";
  mobileBehavior?: "sheet" | "inline" | "floating";
  /** When true, renders as a standalone panel without toggle behavior */
  standalone?: boolean;
};

function Sidekick({
  side = "right",
  mobileBehavior = "sheet",
  standalone = false,
  className,
  children,
  ...props
}: SidekickProps) {
  const context = useOptionalSidekick();

  // Standalone mode: render as a simple panel without provider
  if (standalone || !context) {
    return (
      <aside
        className={cn(
          "flex h-full flex-col border-l bg-background text-foreground",
          side === "left" && "border-r border-l-0",
          className
        )}
        data-side={side}
        data-slot="sidekick"
        data-standalone="true"
        style={
          {
            "--sidekick-width": SIDEKICK_WIDTH,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className="flex h-full w-full flex-col">{children}</div>
      </aside>
    );
  }

  const { isMobile, state, openMobile, setOpenMobile } = context;

  if (isMobile && mobileBehavior === "sheet") {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile}>
        <SheetContent
          className="flex h-full w-full flex-col bg-background p-0 [&>button]:hidden"
          data-mobile="true"
          data-sidekick="panel"
          data-slot="sidekick"
          side={side}
          style={
            {
              "--sidekick-width": SIDEKICK_WIDTH_MOBILE,
            } as React.CSSProperties
          }
        >
          <SheetHeader className="sr-only">
            <SheetTitle>AI Assistant</SheetTitle>
            <SheetDescription>Chat with your AI assistant.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  if (isMobile && mobileBehavior === "inline") {
    return (
      <aside
        className={cn(
          "flex w-full flex-col border-t bg-background text-foreground transition-[max-height,opacity] duration-200",
          openMobile
            ? "max-h-[75vh] opacity-100"
            : "max-h-0 overflow-hidden opacity-0",
          className
        )}
        data-side={side}
        data-slot="sidekick"
        data-state={openMobile ? "expanded" : "collapsed"}
        {...props}
      >
        <div className="flex w-full flex-col">{children}</div>
      </aside>
    );
  }

  if (isMobile && mobileBehavior === "floating") {
    return (
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col border-l bg-background text-foreground transition-transform duration-200",
          openMobile ? "translate-x-0" : "translate-x-full",
          className
        )}
        data-side={side}
        data-slot="sidekick"
        data-state={openMobile ? "expanded" : "collapsed"}
        {...props}
      >
        <div className="flex h-full w-full flex-col">{children}</div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "group peer hidden flex-col border-l bg-background text-foreground transition-[width] duration-200 ease-linear md:flex",
        state === "expanded" ? "w-(--sidekick-width)" : "w-0 overflow-hidden",
        side === "left" && "order-first border-r border-l-0",
        className
      )}
      data-side={side}
      data-slot="sidekick"
      data-state={state}
      {...props}
    >
      <div className="flex h-full w-(--sidekick-width) flex-col">
        {children}
      </div>
    </aside>
  );
}

function SidekickTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const context = useOptionalSidekick();

  // In standalone mode, trigger does nothing (or can be hidden)
  if (!context) {
    return null;
  }

  const { toggleSidekick } = context;

  return (
    <Button
      className={cn("size-7", className)}
      data-sidekick="trigger"
      data-slot="sidekick-trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidekick();
      }}
      size="icon"
      variant="ghost"
      {...props}
    >
      <PanelLeftIcon className="size-4" />
      <span className="sr-only">Toggle AI Assistant</span>
    </Button>
  );
}

function SidekickHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b px-4",
        className
      )}
      data-slot="sidekick-header"
      {...props}
    />
  );
}

function SidekickFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("shrink-0 border-t p-4", className)}
      data-slot="sidekick-footer"
      {...props}
    />
  );
}

function SidekickContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      data-slot="sidekick-content"
      {...props}
    />
  );
}

function SidekickInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      className={cn("relative flex min-w-0 flex-1 flex-col", className)}
      data-slot="sidekick-inset"
      {...props}
    />
  );
}

function SidekickSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("mx-2 w-auto", className)}
      data-slot="sidekick-separator"
      {...props}
    />
  );
}

function SidekickInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn("h-8 w-full bg-background shadow-none", className)}
      data-slot="sidekick-input"
      {...props}
    />
  );
}

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
};

Sidekick.Header = SidekickHeader;
Sidekick.Content = SidekickContent;
Sidekick.Footer = SidekickFooter;
Sidekick.Inset = SidekickInset;
Sidekick.Input = SidekickInput;
Sidekick.Separator = SidekickSeparator;
Sidekick.Trigger = SidekickTrigger;
Sidekick.Provider = SidekickProvider;
