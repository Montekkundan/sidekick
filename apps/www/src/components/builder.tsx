"use client";

import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer, useUIStream } from "@json-render/react";
import { CodeBlock } from "@repo/design-system/components/code-block";
import {
  builderRegistry,
  fallbackComponent,
  useInteractiveState,
} from "@repo/design-system/lib/registry";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputProvider,
  usePromptInputController,
} from "@/registry/new-york/blocks/prompt-input";

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
  ]);

  const importNames = Array.from(used)
    .filter((t) => t !== "Text" && !nativeElements.has(t))
    .sort();

  const importsLine = importNames.length
    ? `import { ${importNames.join(", ")} } from "@repo/design-system/lib/registry";\n\n`
    : "";

  const body = renderNode(rootKey, 2);

  return `${importsLine}export function Generated() {\n  return (\n${body}\n  );\n}\n`;
}

type Tab = "stream" | "json" | "code";

interface BuilderPromptApi {
  clear: () => void;
  set: (text: string) => void;
}

function BuilderPromptInputInner({
  inputRef,
  isStreaming,
  onStop,
  onSubmit,
  setApi,
}: {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  isStreaming: boolean;
  onStop: () => void;
  onSubmit: (text: string) => void;
  setApi: (api: BuilderPromptApi) => void;
}) {
  const controller = usePromptInputController();

  useEffect(() => {
    setApi({
      clear: controller.textInput.clear,
      set: controller.textInput.setInput,
    });
  }, [controller.textInput.clear, controller.textInput.setInput, setApi]);

  const hasText = controller.textInput.value.trim().length > 0;

  return (
    <PromptInput
      className="font-mono text-sm"
      onSubmit={({ text }: PromptInputMessage) => {
        onSubmit(text);
      }}
      variant="outline"
    >
      <PromptInput.Body className="px-3">
        <PromptInput.Textarea
          className="min-h-0 py-2 text-base"
          disabled={isStreaming}
          maxLength={140}
          placeholder="Describe what you want to build..."
          ref={inputRef}
        />
      </PromptInput.Body>
      <PromptInput.Footer align="inline-end">
        {isStreaming ? (
          <PromptInput.Button
            aria-label="Stop"
            onClick={(event) => {
              event.preventDefault();
              onStop();
            }}
            variant="default"
          >
            <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
              <title>Stop</title>
              <rect height="12" width="12" x="6" y="6" />
            </svg>
          </PromptInput.Button>
        ) : (
          <PromptInput.Submit disabled={!hasText}>
            <svg
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
            >
              <title>Submit</title>
              <path d="M12 5v14" />
              <path d="M19 12l-7 7-7-7" />
            </svg>
          </PromptInput.Submit>
        )}
      </PromptInput.Footer>
    </PromptInput>
  );
}

export function Builder() {
  const [streamLines, setStreamLines] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("json");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const promptApiRef = useRef<BuilderPromptApi | null>(null);

  // Use the library's useUIStream hook for real API calls
  const {
    tree: apiTree,
    isStreaming,
    send,
    clear,
  } = useUIStream({
    api: "/api/generate",
    onError: (err: Error) => console.error("Generation error:", err),
  } as Parameters<typeof useUIStream>[0]);

  // Initialize interactive state for Select components
  useInteractiveState();

  const stopGeneration = useCallback(() => {
    clear();
  }, [clear]);

  // Track stream lines from real API
  useEffect(() => {
    if (apiTree && Object.keys(apiTree.elements || {}).length > 0) {
      // Convert tree to stream line for display
      const streamLine = JSON.stringify({ tree: apiTree });

      setStreamLines((prev) => {
        const lastLine = prev.at(-1);
        // Avoid duplicate consecutive lines
        if (lastLine !== streamLine) {
          return [...prev, streamLine];
        }
        return prev;
      });
    } else if (!apiTree || Object.keys(apiTree.elements || {}).length === 0) {
      // Only reset if we are explicitly cleared or starting fresh?
      // Actually send() triggers state reset in useUIStream usually?
      // But we handle setStreamLines([]) in handleSubmit
    }
  }, [apiTree]);

  const handleSubmit = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || isStreaming) {
        return;
      }
      setStreamLines([]);
      await send(prompt);
    },
    [isStreaming, send]
  );

  // Expose action handler for registry components - shows toast with text
  useEffect(() => {
    const w = window as unknown as { __demoAction?: (text: string) => void };
    w.__demoAction = (text: string) => {
      toast(text);
    };

    return () => {
      w.__demoAction = undefined;
    };
  }, []);

  const currentTree = apiTree;

  const jsonCode = currentTree
    ? JSON.stringify(currentTree, null, 2)
    : "// waiting...";

  const generatedTsxCode = currentTree
    ? treeToTsx(currentTree)
    : "// waiting...";

  return (
    <div className="mx-auto w-full max-w-4xl text-left">
      {/* Prompt input */}
      <PromptInputProvider>
        <BuilderPromptInputInner
          inputRef={inputRef}
          isStreaming={isStreaming}
          onStop={stopGeneration}
          onSubmit={handleSubmit}
          setApi={(api) => {
            promptApiRef.current = api;
          }}
        />
      </PromptInputProvider>

      <div className="flex flex-col">
        {/* Tabbed code/stream/json panel */}
        <div>
          <div className="mb-2 flex h-6 items-center gap-4">
            {(["json", "stream", "code"] as const).map((tab) => (
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
          <div className="h-96 overflow-auto rounded border border-border bg-background p-3 text-left font-mono text-xs">
            <div className={activeTab === "stream" ? "" : "hidden"}>
              {streamLines.length > 0 ? (
                <>
                  <CodeBlock code={streamLines.join("\n")} lang="json" />
                  {isStreaming && (
                    <div className="mt-2 flex gap-1">
                      <span className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground" />
                      <span className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground [animation-delay:75ms]" />
                      <span className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground/50">
                  {isStreaming ? "streaming..." : "waiting..."}
                </div>
              )}
            </div>
            <div className={activeTab === "json" ? "" : "hidden"}>
              <CodeBlock code={jsonCode} lang="json" />
            </div>
            <div className={activeTab === "code" ? "" : "hidden"}>
              <CodeBlock code={generatedTsxCode} lang="tsx" />
            </div>
          </div>
        </div>

        {/* Rendered output using json-render */}
        <div>
          <div className="mb-2 flex h-6 items-center justify-between">
            <div className="font-mono text-muted-foreground text-xs">
              render
            </div>
            <button
              aria-label="Maximize"
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsFullscreen(true)}
              type="button"
            >
              <svg
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <title>Maximize</title>
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>
          </div>
          <div className="h-96 overflow-auto rounded border border-border bg-background p-3">
            {currentTree?.root ? (
              <div className="fade-in flex min-h-full w-full animate-in items-center justify-center py-4 duration-200">
                <JSONUIProvider
                  registry={
                    builderRegistry as Parameters<
                      typeof JSONUIProvider
                    >[0]["registry"]
                  }
                >
                  <Renderer
                    fallback={
                      fallbackComponent as Parameters<
                        typeof Renderer
                      >[0]["fallback"]
                    }
                    loading={isStreaming}
                    registry={
                      builderRegistry as Parameters<
                        typeof Renderer
                      >[0]["registry"]
                    }
                    tree={currentTree}
                  />
                </JSONUIProvider>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground/50 text-sm">
                {isStreaming ? "generating..." : "waiting..."}
              </div>
            )}
          </div>
          <Toaster position="bottom-right" />
        </div>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex h-14 items-center justify-between border-border border-b px-6">
            <div className="font-mono text-sm">render</div>
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
          <div className="flex-1 overflow-auto p-6">
            {currentTree?.root ? (
              <div className="flex min-h-full w-full items-center justify-center">
                <JSONUIProvider
                  registry={
                    builderRegistry as Parameters<
                      typeof JSONUIProvider
                    >[0]["registry"]
                  }
                >
                  <Renderer
                    fallback={
                      fallbackComponent as Parameters<
                        typeof Renderer
                      >[0]["fallback"]
                    }
                    loading={isStreaming}
                    registry={
                      builderRegistry as Parameters<
                        typeof Renderer
                      >[0]["registry"]
                    }
                    tree={currentTree}
                  />
                </JSONUIProvider>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground/50 text-sm">
                {isStreaming ? "generating..." : "waiting..."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
