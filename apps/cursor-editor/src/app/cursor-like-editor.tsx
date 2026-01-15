"use client";

import type { EditorProps } from "@monaco-editor/react";
import { Button } from "@repo/design-system/components/ui/button";
import {
  CollapseButton,
  File,
  Folder,
  Tree,
  type TreeViewElement,
} from "@repo/design-system/components/ui/file-tree";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputCard,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@repo/design-system/components/ui/prompt-input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/design-system/components/ui/resizable";
import { Sidekick } from "@repo/design-system/components/ui/sidekick";
import { cn } from "@repo/design-system/lib/utils";
import {
  AtSignIcon,
  ChevronDownIcon,
  ClockIcon,
  GlobeIcon,
  ImageIcon,
  LaptopIcon,
  MicIcon,
  MoreHorizontalIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PlusIcon,
  TerminalIcon,
  XIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

const MonacoEditor = dynamic(
  async () => (await import("@monaco-editor/react")).default,
  { ssr: false }
) as React.ComponentType<EditorProps>;

const APP_NAME = "Nebula Studio";

const ACTIVE_FILE_ID =
  "apps/nebula/src/modules/orbits/panels/star-map-panel.tsx";
const ACTIVE_FILE = {
  id: ACTIVE_FILE_ID,
  name: "star-map-panel.tsx",
  badge: "3",
  path: [
    "apps",
    "nebula",
    "src",
    "modules",
    "orbits",
    "panels",
    "star-map-panel.tsx",
  ],
};

const FILE_TREE: TreeViewElement[] = [
  {
    id: "apps",
    name: "apps",
    children: [
      {
        id: "apps/nebula",
        name: "nebula",
        children: [
          {
            id: "apps/nebula/src",
            name: "src",
            children: [
              {
                id: "apps/nebula/src/modules",
                name: "modules",
                children: [
                  {
                    id: "apps/nebula/src/modules/orbits",
                    name: "orbits",
                    children: [
                      {
                        id: "apps/nebula/src/modules/orbits/panels",
                        name: "panels",
                        children: [
                          {
                            id: "apps/nebula/src/modules/orbits/panels/orbit-controls.ts",
                            name: "orbit-controls.ts",
                          },
                          {
                            id: "apps/nebula/src/modules/orbits/panels/render-grid.ts",
                            name: "render-grid.ts",
                          },
                          {
                            id: "apps/nebula/src/modules/orbits/panels/signal-bus.ts",
                            name: "signal-bus.ts",
                          },
                          {
                            id: ACTIVE_FILE_ID,
                            name: "star-map-panel.tsx",
                          },
                          {
                            id: "apps/nebula/src/modules/orbits/panels/telemetry-panel.tsx",
                            name: "telemetry-panel.tsx",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: "apps/nebula/src/ui",
                name: "ui",
                children: [
                  { id: "apps/nebula/src/ui/badge.tsx", name: "badge.tsx" },
                  { id: "apps/nebula/src/ui/button.tsx", name: "button.tsx" },
                  { id: "apps/nebula/src/ui/tabs.tsx", name: "tabs.tsx" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "packages",
    name: "packages",
    children: [
      {
        id: "packages/design-system",
        name: "design-system",
        children: [
          {
            id: "packages/design-system/components",
            name: "components",
          },
        ],
      },
    ],
  },
];

const FILE_TREE_DEFAULT_EXPANDED = [
  "apps",
  "apps/nebula",
  "apps/nebula/src",
  "apps/nebula/src/modules",
  "apps/nebula/src/modules/orbits",
  "apps/nebula/src/modules/orbits/panels",
];

const DUMMY_TSX = `"use client";

import React from "react";

type Star = {
  id: string;
  name: string;
  magnitude: number;
};

const STARS: Star[] = [
  { id: "sirius", name: "Sirius", magnitude: -1.46 },
  { id: "vega", name: "Vega", magnitude: 0.03 },
  { id: "rigel", name: "Rigel", magnitude: 0.13 },
  { id: "betelgeuse", name: "Betelgeuse", magnitude: 0.42 },
];

export function StarMapPanel() {
  const [selected, setSelected] = React.useState<Star>(STARS[0]!);

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">Star Map</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Demo component used by the Cursor-like UI example.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-3">
          <div className="text-xs font-medium text-muted-foreground">Stars</div>
          <div className="mt-2 space-y-1">
            {STARS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm " +
                  (selected.id === s.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted/30")
                }
                onClick={() => setSelected(s)}
              >
                <span>{s.name}</span>
                <span className="text-xs opacity-70">{s.magnitude}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="text-xs font-medium text-muted-foreground">Selected</div>
          <div className="mt-2 rounded-md bg-muted/20 p-3 font-mono text-xs">
            {JSON.stringify(selected, null, 2)}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

function FileTreeNodes({ elements }: { elements: TreeViewElement[] }) {
  return elements.map((el) => {
    const hasChildren = (el.children?.length ?? 0) > 0;

    if (hasChildren) {
      return (
        <Folder
          className="px-1 py-1 text-muted-foreground text-xs hover:bg-muted/30"
          element={el.name}
          key={el.id}
          value={el.id}
        >
          <FileTreeNodes elements={el.children ?? []} />
        </Folder>
      );
    }

    return (
      <File
        className="px-1 py-1 text-muted-foreground text-xs hover:bg-muted/30"
        key={el.id}
        value={el.id}
      >
        <span className="truncate">{el.name}</span>
      </File>
    );
  });
}

function BottomTerminal() {
  return (
    <div className="flex h-full flex-col border-t bg-background">
      <div className="flex h-9 items-center gap-3 border-b px-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Problems</span>
          <span className="rounded bg-destructive/20 px-1.5 py-0.5 text-destructive">
            1
          </span>
        </div>
        <span className="text-muted-foreground">Output</span>
        <span className="text-muted-foreground">Debug Console</span>
        <span className="rounded bg-muted px-2 py-1 text-foreground">
          Terminal
        </span>
        <span className="text-muted-foreground">Ports</span>
        <span className="text-muted-foreground">GitLens</span>
        <span className="text-muted-foreground">Playwright</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3 py-2 font-mono text-[12px]">
        <div className="text-muted-foreground">
          /Users/montekkundan/.zprofile:export:7: not valid in this context:
          ~/.zprofile:
        </div>
        <div className="text-foreground">
          nebula git:(<span className="text-emerald-400">ui-demo</span>)
          <span className="text-muted-foreground"> ✗</span> <span>$</span>
          <span className="opacity-60">▍</span>
        </div>
      </div>
    </div>
  );
}

function PanelToggleButton({
  pressed,
  title,
  onClick,
  children,
}: {
  pressed: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      aria-pressed={pressed}
      className={cn("h-7 w-7", pressed ? "bg-muted/50" : "", "[&>svg]:size-4")}
      onClick={onClick}
      size="icon"
      title={title}
      type="button"
      variant="ghost"
    >
      {children}
    </Button>
  );
}

function ChatTab({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className={cn(
        "h-7 max-w-[12rem] truncate rounded-md px-2 text-left text-xs",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      )}
      type="button"
    >
      {children}
    </button>
  );
}

const PAST_CHATS: Array<{ title: string; time: string }> = [
  { title: "AI-driven UI generation and customization", time: "4h" },
  { title: "Orbit inspector v0 build", time: "4h" },
  { title: "Missing executionState in TriggerData", time: "6h" },
];

export function CursorLikeEditor() {
  const leftPanelRef = React.useRef<ImperativePanelHandle>(null);
  const rightPanelRef = React.useRef<ImperativePanelHandle>(null);
  const bottomPanelRef = React.useRef<ImperativePanelHandle>(null);

  const [leftOpen, setLeftOpen] = React.useState(true);
  const [rightOpen, setRightOpen] = React.useState(true);
  const [bottomOpen, setBottomOpen] = React.useState(true);

  const [value, setValue] = React.useState(DUMMY_TSX);

  const togglePanel = React.useCallback(
    (ref: React.RefObject<ImperativePanelHandle | null>, open: boolean) => {
      if (!ref.current) {
        return;
      }
      if (open) {
        ref.current.collapse();
      } else {
        ref.current.expand();
      }
    },
    []
  );

  return (
    <div className="h-svh w-full bg-background text-foreground">
      <div className="flex h-full items-center justify-center px-6 text-center md:hidden">
        <div className="space-y-2">
          <div className="font-semibold text-lg">
            I didnt have time for this
          </div>
          <div className="text-muted-foreground text-sm">
            Open on a larger screen to view the editor demo.
          </div>
        </div>
      </div>

      <div className="hidden h-svh w-full flex-col md:flex">
        <ResizablePanelGroup className="min-h-0 flex-1" direction="horizontal">
          <ResizablePanel
            collapsedSize={0}
            collapsible
            defaultSize={18}
            minSize={12}
            onCollapse={() => setLeftOpen(false)}
            onExpand={() => setLeftOpen(true)}
            ref={leftPanelRef}
          >
            <aside className="flex h-full flex-col border-r bg-muted/10">
              <div className="flex h-10 items-center justify-between border-b px-3 text-xs">
                <span className="font-medium tracking-wide">{APP_NAME}</span>
                <span className="text-muted-foreground">⋯</span>
              </div>

              <div className="min-h-0 flex-1">
                <Tree
                  className="h-full"
                  elements={FILE_TREE}
                  indicator={false}
                  initialExpandedItems={FILE_TREE_DEFAULT_EXPANDED}
                  initialSelectedId={ACTIVE_FILE_ID}
                >
                  <FileTreeNodes elements={FILE_TREE} />
                  <CollapseButton elements={FILE_TREE} />
                </Tree>
              </div>
            </aside>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={57} minSize={30}>
            <section className="flex h-full min-w-0 flex-col">
              <div className="flex h-10 items-center justify-between border-b bg-muted/10 px-2 text-xs">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex items-center gap-2 rounded bg-muted px-2 py-1">
                    <span className="text-muted-foreground">
                      nebula.en.json
                    </span>
                    <span className="text-muted-foreground">
                      (Working Tree)
                    </span>
                    <span className="ml-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-400">
                      M
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2 rounded bg-background px-2 py-1 shadow-sm">
                    <span className="truncate font-medium">
                      {ACTIVE_FILE.name}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                      {ACTIVE_FILE.badge}
                    </span>
                    <span className="opacity-70">×</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <PanelToggleButton
                    onClick={() => togglePanel(leftPanelRef, leftOpen)}
                    pressed={leftOpen}
                    title="Toggle Explorer"
                  >
                    <PanelLeftIcon />
                  </PanelToggleButton>
                  <PanelToggleButton
                    onClick={() => togglePanel(bottomPanelRef, bottomOpen)}
                    pressed={bottomOpen}
                    title="Toggle Console"
                  >
                    <TerminalIcon />
                  </PanelToggleButton>
                  <PanelToggleButton
                    onClick={() => togglePanel(rightPanelRef, rightOpen)}
                    pressed={rightOpen}
                    title="Toggle Sidekick"
                  >
                    <PanelRightIcon />
                  </PanelToggleButton>
                </div>
              </div>

              <div className="flex h-9 items-center gap-2 border-b px-3 text-muted-foreground text-xs">
                {ACTIVE_FILE.path.map((segment, idx) => (
                  <React.Fragment key={`${ACTIVE_FILE.id}:${idx}:${segment}`}>
                    <span
                      className={
                        idx === ACTIVE_FILE.path.length - 1
                          ? "text-foreground"
                          : undefined
                      }
                    >
                      {segment}
                    </span>
                    {idx !== ACTIVE_FILE.path.length - 1 ? (
                      <span className="opacity-60">›</span>
                    ) : null}
                  </React.Fragment>
                ))}
              </div>

              <ResizablePanelGroup
                className="min-h-0 flex-1"
                direction="vertical"
              >
                <ResizablePanel defaultSize={72} minSize={35}>
                  <div className="h-full min-h-0">
                    <MonacoEditor
                      height="100%"
                      language="typescript"
                      onChange={(next: string | undefined) =>
                        setValue(next ?? "")
                      }
                      options={{
                        fontSize: 12,
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        wordWrap: "off",
                        folding: true,
                        tabSize: 2,
                        renderWhitespace: "none",
                        cursorBlinking: "solid",
                        smoothScrolling: true,
                        padding: { top: 12, bottom: 12 },
                      }}
                      theme="vs-dark"
                      value={value}
                    />
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel
                  collapsedSize={0}
                  collapsible
                  defaultSize={28}
                  minSize={12}
                  onCollapse={() => setBottomOpen(false)}
                  onExpand={() => setBottomOpen(true)}
                  ref={bottomPanelRef}
                >
                  <BottomTerminal />
                </ResizablePanel>
              </ResizablePanelGroup>
            </section>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            collapsedSize={0}
            collapsible
            defaultSize={25}
            minSize={18}
            onCollapse={() => setRightOpen(false)}
            onExpand={() => setRightOpen(true)}
            ref={rightPanelRef}
          >
            <div className="h-full">
              <Sidekick className="h-full w-full" side="right" standalone>
                <div className="flex h-full flex-col">
                  <div className="flex h-10 items-center justify-between border-b px-3">
                    <div className="flex min-w-0 items-center gap-1">
                      <ChatTab>Orbit event race</ChatTab>
                      <ChatTab>Telemetry UI polish</ChatTab>
                      <ChatTab active>New Chat</ChatTab>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        className="h-7 w-7"
                        size="icon"
                        title="New"
                        type="button"
                        variant="ghost"
                      >
                        <PlusIcon className="size-4" />
                      </Button>
                      <Button
                        className="h-7 w-7"
                        size="icon"
                        title="History"
                        type="button"
                        variant="ghost"
                      >
                        <ClockIcon className="size-4" />
                      </Button>
                      <Button
                        className="h-7 w-7"
                        size="icon"
                        title="More"
                        type="button"
                        variant="ghost"
                      >
                        <MoreHorizontalIcon className="size-4" />
                      </Button>
                      <Button
                        className="h-7 w-7"
                        onClick={() => togglePanel(rightPanelRef, rightOpen)}
                        size="icon"
                        title="Close"
                        type="button"
                        variant="ghost"
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3">
                    <PromptInputCard className="rounded-xl border bg-muted/10 shadow-sm">
                      <PromptInput
                        focusRing={false}
                        onSubmit={() => undefined}
                        variant="none"
                      >
                        <PromptInputBody className="items-start px-2 py-1.5">
                          <PromptInputTextarea
                            minRows={4}
                            placeholder="Plan, @ for context, / for commands"
                          />
                        </PromptInputBody>

                        <PromptInputFooter className="items-center justify-between gap-2 px-3 pt-0 pb-2">
                          <PromptInputTools className="gap-1.5">
                            <PromptInputButton
                              className="h-7 gap-1 rounded-full px-2 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground [&>svg]:size-3.5"
                              size="sm"
                            >
                              <span className="text-foreground/80">∞</span>
                              <span>Agent</span>
                              <ChevronDownIcon className="size-3.5" />
                            </PromptInputButton>

                            <PromptInputButton
                              className="h-7 gap-1 rounded-full px-2 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground [&>svg]:size-3.5"
                              size="sm"
                            >
                              Auto
                              <ChevronDownIcon className="size-3.5" />
                            </PromptInputButton>
                          </PromptInputTools>

                          <PromptInputTools className="gap-0.5">
                            <PromptInputButton
                              aria-label="Mention"
                              className="rounded-full text-muted-foreground hover:bg-accent hover:text-foreground [&>svg]:size-3.5"
                              size="icon-xs"
                            >
                              <AtSignIcon />
                            </PromptInputButton>
                            <PromptInputButton
                              aria-label="Search"
                              className="rounded-full text-muted-foreground hover:bg-accent hover:text-foreground [&>svg]:size-3.5"
                              size="icon-xs"
                            >
                              <GlobeIcon />
                            </PromptInputButton>
                            <PromptInputButton
                              aria-label="Attach"
                              className="rounded-full text-muted-foreground hover:bg-accent hover:text-foreground [&>svg]:size-3.5"
                              size="icon-xs"
                            >
                              <ImageIcon />
                            </PromptInputButton>
                            <PromptInputButton
                              aria-label="Voice"
                              className="rounded-full text-muted-foreground hover:bg-accent hover:text-foreground [&>svg]:size-3.5"
                              size="icon-xs"
                            >
                              <MicIcon />
                            </PromptInputButton>
                            <PromptInputSubmit
                              aria-label="Send"
                              className="rounded-full bg-foreground text-background hover:bg-foreground/90 [&>svg]:size-3.5"
                              size="icon-xs"
                            />
                          </PromptInputTools>
                        </PromptInputFooter>
                      </PromptInput>
                    </PromptInputCard>

                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <LaptopIcon className="size-3.5" />
                      <span>Local</span>
                      <ChevronDownIcon className="ml-0.5 size-3.5" />
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 overflow-auto" />

                    <div className="px-3 py-2">
                      <div className="flex items-center justify-between text-muted-foreground text-xs">
                        <div className="flex items-center gap-2">
                          <span>Past Chats</span>
                          <ChevronDownIcon className="size-3.5" />
                        </div>
                        <span>View All</span>
                      </div>

                      <div className="mt-2 space-y-1">
                        {PAST_CHATS.map((c) => (
                          <button
                            className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-muted-foreground text-xs hover:bg-muted/30 hover:text-foreground"
                            key={c.title}
                            type="button"
                          >
                            <span className="truncate">{c.title}</span>
                            <span className="shrink-0 opacity-70">
                              {c.time}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Sidekick>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        <div className="flex h-6 items-center justify-between border-t bg-muted/10 px-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">⌥</span>
            <span>ui-demo*</span>
            <span className="opacity-60">•</span>
            <span>0↓ 2↑</span>
          </div>
          <div className="flex items-center gap-3">
            <span>TypeScript JSX</span>
            <span>UTF-8</span>
            <span>LF</span>
            <span>Spaces: 2</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Ln 12, Col 19</span>
            <span className="opacity-60">|</span>
            <span>Prettier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
