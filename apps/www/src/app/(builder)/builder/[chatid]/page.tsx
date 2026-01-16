"use client";

import React from "react";

import {
  DEFAULT_WIDGET_UITREE,
  useBuilder,
} from "@/app/(builder)/components/builder-provider";
import { CodeEditor } from "@/app/(builder)/components/code-editor";
import { BuilderPreview } from "@/app/(builder)/lib/json-render/preview";
import {
  BUILDER_UITREE_JSON_SCHEMA,
  parseUITreeJson,
} from "@/app/(builder)/lib/json-render/tree";
import { uiTreeToTsx } from "@/app/(builder)/lib/json-render/tsx";
import { Button } from "@/registry/new-york/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable";

function PanelHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
      <span>{title}</span>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

function BuilderChatContent({ chatid }: { chatid: string }) {
  const {
    sessions,
    activeSessionId,
    isReady,
    createSession,
    setActiveSessionId,
    updateSession,
  } = useBuilder();

  const currentSession = sessions.find((session) => session.id === chatid);
  const currentSessionId = currentSession?.id ?? null;

  const [uiTreeText, setUiTreeText] = React.useState(DEFAULT_WIDGET_UITREE);
  const [leftMode, setLeftMode] = React.useState<"ui" | "tsx">("ui");

  const lastValidUiTreeRef =
    React.useRef<ReturnType<typeof parseUITreeJson>["value"]>(null);

  React.useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!currentSessionId) {
      createSession({ id: chatid, title: "Untitled chat" });
      return;
    }

    if (activeSessionId !== chatid) {
      setActiveSessionId(chatid);
    }
  }, [
    activeSessionId,
    chatid,
    createSession,
    currentSessionId,
    isReady,
    setActiveSessionId,
  ]);

  React.useEffect(() => {
    if (!currentSession) {
      return;
    }
    setUiTreeText(currentSession.uiTree);
  }, [currentSession]);

  React.useEffect(() => {
    if (!(isReady && currentSession)) {
      return;
    }

    const timer = window.setTimeout(() => {
      updateSession(chatid, {
        uiTree: uiTreeText,
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [chatid, currentSession, isReady, uiTreeText, updateSession]);

  const uiTreeParse = React.useMemo(
    () => parseUITreeJson(uiTreeText),
    [uiTreeText]
  );

  React.useEffect(() => {
    if (uiTreeParse.value) {
      lastValidUiTreeRef.current = uiTreeParse.value;
    }
  }, [uiTreeParse.value]);

  const uiTree = uiTreeParse.value ?? lastValidUiTreeRef.current;
  const hasUiError = Boolean(uiTreeParse.error);

  const handleRevertUiTree = React.useCallback(() => {
    if (!uiTree) {
      return;
    }

    setUiTreeText(JSON.stringify(uiTree, null, 2));
  }, [uiTree]);

  const tsxPreviewText = React.useMemo(() => {
    if (!uiTree) {
      return "// Fix UI JSON errors to view TSX.";
    }

    try {
      return uiTreeToTsx(uiTree);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return `// Failed to generate TSX: ${message}`;
    }
  }, [uiTree]);

  const handleShare = React.useCallback(
    async (content: string) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: currentSession?.title ?? "Sidekick Builder",
            text: content,
          });
          return;
        } catch {
          // Fall back to clipboard.
        }
      }

      try {
        await navigator.clipboard.writeText(content);
      } catch {
        // Ignore clipboard errors.
      }
    },
    [currentSession?.title]
  );

  const handleExport = React.useCallback(
    (content: string) => {
      const blob = new Blob([content], {
        type: "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${currentSession?.title ?? "widget"}.tsx`;
      anchor.click();
      URL.revokeObjectURL(url);
    },
    [currentSession]
  );

  React.useEffect(() => {
    const handleDownload = () => {
      handleExport(tsxPreviewText);
    };

    const handleShareEvent = () => {
      handleShare(tsxPreviewText).catch(() => undefined);
    };

    window.addEventListener("builder:download", handleDownload);
    window.addEventListener("builder:share", handleShareEvent);

    return () => {
      window.removeEventListener("builder:download", handleDownload);
      window.removeEventListener("builder:share", handleShareEvent);
    };
  }, [handleExport, handleShare, tsxPreviewText]);

  if (!(isReady && currentSession)) {
    return <div className="h-[calc(100dvh-4rem)]" />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted/20">
      <div className="flex items-center gap-3 border-b bg-background px-6 py-3">
        <span className="font-semibold text-sm">{currentSession.title}</span>
        <span className="text-muted-foreground text-xs">Widget Builder</span>
      </div>

      <div className="min-h-0 flex-1">
        <ResizablePanelGroup className="h-full" direction="horizontal">
          <ResizablePanel defaultSize={32} minSize={22}>
            <div className="flex h-full flex-col border-r bg-background">
              <PanelHeader
                title={leftMode === "ui" ? "UI Tree" : "TSX (generated)"}
              >
                <div className="flex items-center gap-1">
                  <Button
                    className="h-7 px-2 text-xs"
                    onClick={() => setLeftMode("ui")}
                    variant={leftMode === "ui" ? "secondary" : "ghost"}
                  >
                    UI
                  </Button>
                  <Button
                    className="h-7 px-2 text-xs"
                    onClick={() => setLeftMode("tsx")}
                    variant={leftMode === "tsx" ? "secondary" : "ghost"}
                  >
                    TSX
                  </Button>
                </div>

                {leftMode === "ui" && hasUiError && (
                  <div className="flex items-center gap-2">
                    <span className="text-destructive text-xs">
                      {uiTreeParse.error ?? "Invalid UI JSON"}
                    </span>
                    {uiTree && (
                      <Button
                        className="h-7 px-2 text-xs"
                        onClick={handleRevertUiTree}
                        variant="ghost"
                      >
                        Revert
                      </Button>
                    )}
                  </div>
                )}
              </PanelHeader>

              <div className="flex min-h-0 flex-1 flex-col p-2">
                {leftMode === "ui" ? (
                  <CodeEditor
                    className="h-full"
                    jsonSchema={{
                      uri: `a2ui://ui-tree/${chatid}.schema.json`,
                      schema: BUILDER_UITREE_JSON_SCHEMA,
                    }}
                    key={`ui-tree-${chatid}`}
                    onChange={setUiTreeText}
                    path={`a2ui://ui-tree/${chatid}.json`}
                    value={uiTreeText}
                  />
                ) : (
                  <CodeEditor
                    className="h-full"
                    key={`tsx-${chatid}`}
                    language="typescript"
                    onChange={() => undefined}
                    path={`a2ui://tsx/${chatid}.tsx`}
                    readOnly
                    value={tsxPreviewText}
                  />
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={68} minSize={40}>
            <div className="flex h-full flex-col bg-background">
              <PanelHeader title="Preview">
                {hasUiError && (
                  <span className="text-muted-foreground text-xs normal-case">
                    Showing last valid render.
                  </span>
                )}
              </PanelHeader>

              <div className="min-h-0 flex-1 overflow-auto p-6">
                {uiTree ? (
                  <div className="rounded-xl border bg-muted/20 p-8 shadow-sm">
                    <BuilderPreview data={{}} tree={uiTree} />
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed bg-background p-6 text-muted-foreground text-sm">
                    Fix UI JSON errors to render preview.
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

function BuilderChatPage({ params }: { params: Promise<{ chatid: string }> }) {
  const { chatid } = React.use(params);

  return <BuilderChatContent chatid={chatid} />;
}

export default BuilderChatPage;
