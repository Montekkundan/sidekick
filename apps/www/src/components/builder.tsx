"use client";

import type { UITree } from "@json-render/core";
import { useUIStream } from "@json-render/react";
import { CodeBlock } from "@repo/design-system/components/code-block";
import { Button } from "@repo/design-system/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/design-system/components/ui/resizable";
import { Separator } from "@repo/design-system/components/ui/separator";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/design-system/components/ui/toggle-group";
import { useInteractiveState } from "@repo/design-system/lib/registry";
import { Fullscreen, Monitor, Smartphone, Tablet } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  PromptInput,
  PromptInputProvider,
  usePromptInputController,
} from "@/registry/new-york/blocks/prompt-input";

// Define ImperativePanelHandle type for ResizablePanel ref
type ImperativePanelHandle = React.ElementRef<typeof ResizablePanel>;

function toJsxPropValue(value: unknown): string {
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((v) => toJsxPropValue(v)).join(", ")}]`;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return JSON.stringify(String(value));
}

function propsToJsx(props: Record<string, unknown> | undefined): string {
  if (!props) {
    return "";
  }

  const entries = Object.entries(props).filter(([, v]) => v !== undefined);
  if (entries.length === 0) {
    return "";
  }

  return entries
    .map(([k, v]) => {
      if (k === "className" && Array.isArray(v)) {
        return ` className={${JSON.stringify(v.join(" "))}}`;
      }

      if (typeof v === "string") {
        return ` ${k}=${JSON.stringify(v)}`;
      }

      return ` ${k}={${toJsxPropValue(v)}}`;
    })
    .join("");
}

function treeToTsx(tree: UITree): string {
  const elements = tree.elements ?? {};

  function renderNode(nodeKey: string, depth: number): string {
    const el = elements[nodeKey];
    if (!el) {
      return "";
    }

    // Special-case our builder Text wrapper: prefer rendering its content as plain text.
    if (el.type === "Text") {
      const props = el.props as unknown as { content?: unknown };
      const content = props?.content;
      return typeof content === "string" ? JSON.stringify(content) : "";
    }

    const indent = "  ".repeat(depth);
    const jsxProps = propsToJsx(el.props as Record<string, unknown>);
    const childKeys = Array.isArray(el.children) ? el.children : [];
    const renderedChildren = childKeys
      .map((childKey) => renderNode(childKey, depth + 1))
      .filter(Boolean);

    if (renderedChildren.length === 0) {
      return `${indent}<${el.type}${jsxProps} />`;
    }

    const childrenBlock = renderedChildren.join("\n");

    return `${indent}<${el.type}${jsxProps}>\n${childrenBlock}\n${indent}</${el.type}>`;
  }

  const rootKey = tree.root;
  if (!(rootKey && elements[rootKey])) {
    return "// waiting...";
  }

  const used = new Set<string>();
  for (const el of Object.values(elements)) {
    used.add(el.type);
  }

  // Native HTML elements that shouldn't be imported
  const nativeElements = new Set([
    "div",
    "span",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "img",
    "ul",
    "ol",
    "li",
    "section",
    "article",
    "header",
    "footer",
    "nav",
    "main",
    "aside",
    "form",
    "input",
    "textarea",
    "label",
  ]);

  // Map components to their shadcn file paths
  const componentPathMap: Record<string, string> = {
    // Accordion
    Accordion: "@/components/ui/accordion",
    AccordionContent: "@/components/ui/accordion",
    AccordionItem: "@/components/ui/accordion",
    AccordionTrigger: "@/components/ui/accordion",
    // Alert
    Alert: "@/components/ui/alert",
    AlertDescription: "@/components/ui/alert",
    AlertTitle: "@/components/ui/alert",
    // AlertDialog
    AlertDialog: "@/components/ui/alert-dialog",
    AlertDialogAction: "@/components/ui/alert-dialog",
    AlertDialogCancel: "@/components/ui/alert-dialog",
    AlertDialogContent: "@/components/ui/alert-dialog",
    AlertDialogDescription: "@/components/ui/alert-dialog",
    AlertDialogFooter: "@/components/ui/alert-dialog",
    AlertDialogHeader: "@/components/ui/alert-dialog",
    AlertDialogTitle: "@/components/ui/alert-dialog",
    AlertDialogTrigger: "@/components/ui/alert-dialog",
    // Avatar
    Avatar: "@/components/ui/avatar",
    AvatarFallback: "@/components/ui/avatar",
    AvatarImage: "@/components/ui/avatar",
    // Badge
    Badge: "@/components/ui/badge",
    // Button
    Button: "@/components/ui/button",
    // Card
    Card: "@/components/ui/card",
    CardContent: "@/components/ui/card",
    CardDescription: "@/components/ui/card",
    CardFooter: "@/components/ui/card",
    CardHeader: "@/components/ui/card",
    CardTitle: "@/components/ui/card",
    // Checkbox
    Checkbox: "@/components/ui/checkbox",
    // Collapsible
    Collapsible: "@/components/ui/collapsible",
    CollapsibleContent: "@/components/ui/collapsible",
    CollapsibleTrigger: "@/components/ui/collapsible",
    // Command
    Command: "@/components/ui/command",
    CommandDialog: "@/components/ui/command",
    CommandEmpty: "@/components/ui/command",
    CommandGroup: "@/components/ui/command",
    CommandInput: "@/components/ui/command",
    CommandItem: "@/components/ui/command",
    CommandList: "@/components/ui/command",
    CommandSeparator: "@/components/ui/command",
    CommandShortcut: "@/components/ui/command",
    // Dialog
    Dialog: "@/components/ui/dialog",
    DialogContent: "@/components/ui/dialog",
    DialogDescription: "@/components/ui/dialog",
    DialogFooter: "@/components/ui/dialog",
    DialogHeader: "@/components/ui/dialog",
    DialogTitle: "@/components/ui/dialog",
    DialogTrigger: "@/components/ui/dialog",
    // Drawer
    Drawer: "@/components/ui/drawer",
    DrawerClose: "@/components/ui/drawer",
    DrawerContent: "@/components/ui/drawer",
    DrawerDescription: "@/components/ui/drawer",
    DrawerFooter: "@/components/ui/drawer",
    DrawerHeader: "@/components/ui/drawer",
    DrawerTitle: "@/components/ui/drawer",
    DrawerTrigger: "@/components/ui/drawer",
    // DropdownMenu
    DropdownMenu: "@/components/ui/dropdown-menu",
    DropdownMenuCheckboxItem: "@/components/ui/dropdown-menu",
    DropdownMenuContent: "@/components/ui/dropdown-menu",
    DropdownMenuGroup: "@/components/ui/dropdown-menu",
    DropdownMenuItem: "@/components/ui/dropdown-menu",
    DropdownMenuLabel: "@/components/ui/dropdown-menu",
    DropdownMenuPortal: "@/components/ui/dropdown-menu",
    DropdownMenuRadioGroup: "@/components/ui/dropdown-menu",
    DropdownMenuRadioItem: "@/components/ui/dropdown-menu",
    DropdownMenuSeparator: "@/components/ui/dropdown-menu",
    DropdownMenuShortcut: "@/components/ui/dropdown-menu",
    DropdownMenuSub: "@/components/ui/dropdown-menu",
    DropdownMenuSubContent: "@/components/ui/dropdown-menu",
    DropdownMenuSubTrigger: "@/components/ui/dropdown-menu",
    DropdownMenuTrigger: "@/components/ui/dropdown-menu",
    // Field
    Field: "@/components/ui/field",
    FieldDescription: "@/components/ui/field",
    FieldGroup: "@/components/ui/field",
    FieldLabel: "@/components/ui/field",
    // HoverCard
    HoverCard: "@/components/ui/hover-card",
    HoverCardContent: "@/components/ui/hover-card",
    HoverCardTrigger: "@/components/ui/hover-card",
    // Input
    Input: "@/components/ui/input",
    // Label
    Label: "@/components/ui/label",
    // Menubar
    Menubar: "@/components/ui/menubar",
    MenubarCheckboxItem: "@/components/ui/menubar",
    MenubarContent: "@/components/ui/menubar",
    MenubarItem: "@/components/ui/menubar",
    MenubarMenu: "@/components/ui/menubar",
    MenubarRadioGroup: "@/components/ui/menubar",
    MenubarRadioItem: "@/components/ui/menubar",
    MenubarSeparator: "@/components/ui/menubar",
    MenubarShortcut: "@/components/ui/menubar",
    MenubarSub: "@/components/ui/menubar",
    MenubarSubContent: "@/components/ui/menubar",
    MenubarSubTrigger: "@/components/ui/menubar",
    MenubarTrigger: "@/components/ui/menubar",
    // Popover
    Popover: "@/components/ui/popover",
    PopoverContent: "@/components/ui/popover",
    PopoverTrigger: "@/components/ui/popover",
    // Progress
    Progress: "@/components/ui/progress",
    // RadioGroup
    RadioGroup: "@/components/ui/radio-group",
    RadioGroupItem: "@/components/ui/radio-group",
    // ScrollArea
    ScrollArea: "@/components/ui/scroll-area",
    ScrollBar: "@/components/ui/scroll-area",
    // Select
    Select: "@/components/ui/select",
    SelectContent: "@/components/ui/select",
    SelectGroup: "@/components/ui/select",
    SelectItem: "@/components/ui/select",
    SelectLabel: "@/components/ui/select",
    SelectTrigger: "@/components/ui/select",
    SelectValue: "@/components/ui/select",
    // Separator
    Separator: "@/components/ui/separator",
    // Sheet
    Sheet: "@/components/ui/sheet",
    SheetClose: "@/components/ui/sheet",
    SheetContent: "@/components/ui/sheet",
    SheetDescription: "@/components/ui/sheet",
    SheetFooter: "@/components/ui/sheet",
    SheetHeader: "@/components/ui/sheet",
    SheetTitle: "@/components/ui/sheet",
    SheetTrigger: "@/components/ui/sheet",
    // Skeleton
    Skeleton: "@/components/ui/skeleton",
    // Slider
    Slider: "@/components/ui/slider",
    // Sonner
    Toaster: "@/components/ui/sonner",
    // Switch
    Switch: "@/components/ui/switch",
    // Table
    Table: "@/components/ui/table",
    TableBody: "@/components/ui/table",
    TableCaption: "@/components/ui/table",
    TableCell: "@/components/ui/table",
    TableFooter: "@/components/ui/table",
    TableHead: "@/components/ui/table",
    TableHeader: "@/components/ui/table",
    TableRow: "@/components/ui/table",
    // Tabs
    Tabs: "@/components/ui/tabs",
    TabsContent: "@/components/ui/tabs",
    TabsList: "@/components/ui/tabs",
    TabsTrigger: "@/components/ui/tabs",
    // Textarea
    Textarea: "@/components/ui/textarea",
    // Toggle
    Toggle: "@/components/ui/toggle",
    // ToggleGroup
    ToggleGroup: "@/components/ui/toggle-group",
    ToggleGroupItem: "@/components/ui/toggle-group",
    // Tooltip
    Tooltip: "@/components/ui/tooltip",
    TooltipContent: "@/components/ui/tooltip",
    TooltipProvider: "@/components/ui/tooltip",
    TooltipTrigger: "@/components/ui/tooltip",
  };

  const usedComponents = Array.from(used)
    .filter((t) => t !== "Text" && !nativeElements.has(t))
    .sort();

  const importsByPath: Record<string, string[]> = {};

  usedComponents.forEach((component) => {
    const path = componentPathMap[component] || "@/components/ui/unknown";
    if (!importsByPath[path]) {
      importsByPath[path] = [];
    }
    importsByPath[path].push(component);
  });

  const importsLine =
    Object.entries(importsByPath)
      .map(([path, components]) => {
        return `import { ${components.join(", ")} } from "${path}";`;
      })
      .join("\n") + (Object.keys(importsByPath).length ? "\n\n" : "");

  const body = renderNode(rootKey, 2);

  return `${importsLine}export function Generated() {\n  return (\n${body}\n  );\n}\n`;
}

interface PresetsInputProps {
  isLoading: boolean;
  onSubmit: (text: string) => void;
}

function PresetRow() {
  const controller = usePromptInputController();
  const presets = [
    {
      label: "Card",
      value: "Create a stack of 3 cards with movie titles and ratings.",
    },
    { label: "Form", value: "Create a form with 3 fields." },
    { label: "Table", value: "Create a table with 3 columns." },
    { label: "Tooltip", value: "Create a tooltip with 3 columns." },
  ];

  return (
    <div className="flex flex-wrap gap-3 text-muted-foreground text-xs">
      {presets.map((preset) => (
        <button
          className="whitespace-nowrap underline-offset-4 transition hover:text-foreground hover:underline"
          key={preset.label}
          onClick={() => controller.textInput.setInput(preset.value)}
          type="button"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

function BuilderInput({ isLoading, onSubmit }: PresetsInputProps) {
  return (
    <PromptInputProvider initialInput="Create a stack of 3 cards with movie titles and ratings">
      <div className="space-y-3">
        <PresetRow />
        <PromptInput
          className="font-mono text-sm"
          onSubmit={(msg) => {
            const text = typeof msg === "string" ? msg : msg.text;
            if (text) {
              onSubmit(text);
            }
          }}
        >
          <PromptInput.Body>
            <PromptInput.Textarea
              disabled={isLoading}
              maxLength={140}
              placeholder="Describe what you want to build..."
            />
          </PromptInput.Body>
          <PromptInput.Footer>
            <PromptInput.Tools />
            <PromptInput.Submit status={isLoading ? "streaming" : "ready"} />
          </PromptInput.Footer>
        </PromptInput>
      </div>
    </PromptInputProvider>
  );
}

export function Builder() {
  const [streamLines, setStreamLines] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"json" | "stream">("json");
  const [renderView, setRenderView] = useState<"dynamic" | "static">("dynamic");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewSize, setViewSize] = useState<string>("100");
  const resizablePanelRef = useRef<ImperativePanelHandle>(null);
  const fullscreenPanelRef = useRef<ImperativePanelHandle>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const fullscreenIframeRef = useRef<HTMLIFrameElement>(null);

  const {
    tree: apiTree,
    isStreaming,
    send,
  } = useUIStream({
    api: "/api/generate",
    onError: (err: Error) => console.error("Generation error:", err),
  });

  useInteractiveState();

  // Sync tree to iframes
  useEffect(() => {
    const message = {
      type: "BUILDER_TREE_UPDATE",
      payload: {
        tree: apiTree || null, // Use apiTree directly from useUIStream or currentTree if derived
        isLoading: isStreaming,
      },
    };

    previewIframeRef.current?.contentWindow?.postMessage(message, "*");
    fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
  }, [apiTree, isStreaming]);

  // Handle iframe ready message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check: ensure origin matches
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "BUILDER_PREVIEW_READY") {
        const message = {
          type: "BUILDER_TREE_UPDATE",
          payload: {
            tree: apiTree || null,
            isLoading: isStreaming,
          },
        };

        // Send to whichever iframe is ready
        if (
          previewIframeRef.current &&
          event.source === previewIframeRef.current.contentWindow
        ) {
          previewIframeRef.current.contentWindow?.postMessage(message, "*");
        }
        if (
          fullscreenIframeRef.current &&
          event.source === fullscreenIframeRef.current.contentWindow
        ) {
          fullscreenIframeRef.current.contentWindow?.postMessage(message, "*");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [apiTree, isStreaming]);

  useEffect(() => {
    // Expose action handler for registry components
    const win = window as unknown as {
      __demoAction?: (text: string) => void;
    };
    win.__demoAction = (text: string) => {
      toast(text);
    };
    return () => {
      delete win.__demoAction;
    };
  }, []);

  // Track stream lines
  useEffect(() => {
    if (apiTree && Object.keys(apiTree.elements || {}).length > 0) {
      const streamLine = JSON.stringify({ tree: apiTree });
      setStreamLines((prev) => {
        const lastLine = prev.at(-1);
        if (lastLine !== streamLine) {
          return [...prev, streamLine];
        }
        return prev;
      });
    } else if (
      (!apiTree || Object.keys(apiTree.elements || {}).length === 0) &&
      !isStreaming &&
      streamLines.length > 0
    ) {
      setStreamLines([]);
    }
  }, [apiTree, isStreaming, streamLines.length]);

  const handleSubmit = useCallback(
    async (value: string) => {
      if (!value.trim() || isStreaming) {
        return;
      }
      setStreamLines([]);
      await send(value);
    },
    [isStreaming, send]
  );

  const currentTree = apiTree;
  const jsonCode = currentTree
    ? JSON.stringify(currentTree, null, 2)
    : "// waiting...";
  const generatedTsxCode = currentTree
    ? treeToTsx(currentTree)
    : "// Generate a UI to see the code";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 text-left">
      <PromptInputProvider initialInput="Create a contact form">
        <BuilderInput isLoading={isStreaming} onSubmit={handleSubmit} />
      </PromptInputProvider>

      <div className="flex flex-col gap-8">
        {/* Top Block: JSON / Stream */}
        <div className="min-w-0">
          <div className="mb-2 flex h-6 items-center gap-4">
            {(["json", "stream"] as const).map((tab) => (
              <button
                className={`font-mono text-xs transition-colors ${
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative grid h-96 overflow-hidden rounded border border-border bg-background font-mono text-xs">
            <div
              className={`h-full w-full overflow-auto ${
                activeTab === "stream" ? "" : "hidden"
              }`}
            >
              {streamLines.length > 0 ? (
                <CodeBlock code={streamLines.join("\n")} lang="json" />
              ) : (
                <div className="p-4 text-muted-foreground/50">
                  {isStreaming ? "streaming..." : "waiting..."}
                </div>
              )}
            </div>
            <div
              className={`h-full w-full overflow-auto ${
                activeTab === "json" ? "" : "hidden"
              }`}
            >
              <CodeBlock code={jsonCode} lang="json" />
            </div>
          </div>
        </div>

        {/* Bottom Block: Live Render / Static Code */}
        <div className="min-w-0">
          <div className="mb-2 flex h-6 items-center justify-between">
            <div className="flex items-center gap-4">
              {(
                [
                  { key: "dynamic", label: "live render" },
                  { key: "static", label: "static code" },
                ] as const
              ).map(({ key, label }) => (
                <button
                  className={`font-mono text-xs transition-colors ${
                    renderView === key
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  key={key}
                  onClick={() => setRenderView(key)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 items-center gap-1.5 rounded-md border p-1 shadow-none">
                <ToggleGroup
                  className="*:data-[slot=toggle-group-item]:!size-6 *:data-[slot=toggle-group-item]:!rounded-sm gap-1"
                  defaultValue="100"
                  onValueChange={(value) => {
                    if (!value) {
                      return;
                    }
                    setViewSize(value);
                    setRenderView("dynamic");
                    if (resizablePanelRef?.current) {
                      const panel = resizablePanelRef.current;
                      const size = Number.parseInt(value, 10);
                      if (
                        "resize" in panel &&
                        typeof panel.resize === "function"
                      ) {
                        panel.resize(size);
                      }
                    }
                  }}
                  type="single"
                  value={viewSize}
                >
                  <ToggleGroupItem title="Desktop" value="100">
                    <Monitor />
                  </ToggleGroupItem>
                  <ToggleGroupItem title="Tablet" value="60">
                    <Tablet />
                  </ToggleGroupItem>
                  <ToggleGroupItem title="Mobile" value="30">
                    <Smartphone />
                  </ToggleGroupItem>
                  <Separator className="!h-4" orientation="vertical" />
                  <Button
                    className="size-6 rounded-sm p-0"
                    onClick={() => setIsFullscreen(true)}
                    size="icon"
                    title="Open as fullscreen"
                    variant="ghost"
                  >
                    <span className="sr-only">Open as fullscreen</span>
                    <Fullscreen />
                  </Button>
                </ToggleGroup>
              </div>
            </div>
          </div>

          <div className="relative h-96 overflow-hidden rounded border border-border">
            {/* Dotted background pattern */}
            <div className="absolute inset-0 [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]" />
            <ResizablePanelGroup
              className="relative z-10 h-full"
              direction="horizontal"
            >
              <ResizablePanel
                className="relative overflow-hidden rounded-lg bg-background"
                defaultSize={100}
                minSize={30}
                ref={resizablePanelRef}
              >
                {renderView === "dynamic" ? (
                  <div className="h-full w-full overflow-hidden bg-background">
                    <iframe
                      className="h-full w-full border-none bg-background"
                      ref={previewIframeRef}
                      src="/builder-preview"
                      title="Preview"
                    />
                  </div>
                ) : (
                  <div className="h-full w-full overflow-auto">
                    <CodeBlock code={generatedTsxCode} lang="tsx" />
                  </div>
                )}
              </ResizablePanel>
              <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
              <ResizablePanel defaultSize={0} minSize={0} />
            </ResizablePanelGroup>
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex h-14 items-center justify-between border-border border-b px-6">
            <div className="font-mono text-sm">render</div>
            <div className="flex items-center gap-4">
              <div className="h-8 items-center gap-1.5 rounded-md border p-1 shadow-none">
                <ToggleGroup
                  className="*:data-[slot=toggle-group-item]:!size-6 *:data-[slot=toggle-group-item]:!rounded-sm gap-1"
                  defaultValue="100"
                  onValueChange={(value) => {
                    if (!value) {
                      return;
                    }
                    setViewSize(value);
                    if (fullscreenPanelRef?.current) {
                      const panel = fullscreenPanelRef.current;
                      const size = Number.parseInt(value, 10);
                      if (
                        "resize" in panel &&
                        typeof panel.resize === "function"
                      ) {
                        panel.resize(size);
                      }
                    }
                  }}
                  type="single"
                  value={viewSize}
                >
                  <ToggleGroupItem title="Desktop" value="100">
                    <Monitor />
                  </ToggleGroupItem>
                  <ToggleGroupItem title="Tablet" value="60">
                    <Tablet />
                  </ToggleGroupItem>
                  <ToggleGroupItem title="Mobile" value="30">
                    <Smartphone />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <button
                aria-label="Close"
                className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsFullscreen(false)}
                type="button"
              >
                <svg
                  fill="none"
                  height="20"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="20"
                >
                  <title>Close</title>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="relative flex-1 overflow-hidden p-6">
            {/* Dotted background pattern */}
            <div className="absolute inset-0 [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]" />
            <ResizablePanelGroup
              className="relative z-10 h-full"
              direction="horizontal"
            >
              <ResizablePanel
                className="relative overflow-hidden rounded-lg bg-background"
                defaultSize={100}
                minSize={30}
                ref={fullscreenPanelRef}
              >
                <div className="h-full w-full overflow-hidden bg-background">
                  <iframe
                    className="h-full w-full border-none bg-background"
                    ref={fullscreenIframeRef}
                    src="/builder-preview"
                    title="Fullscreen Preview"
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
              <ResizablePanel defaultSize={0} minSize={0} />
            </ResizablePanelGroup>
          </div>
        </div>
      )}
    </div>
  );
}
