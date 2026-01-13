"use client";

import { parse } from "@babel/parser";
import type {
  Expression,
  File,
  JSXAttribute,
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
} from "@babel/types";
import { X } from "lucide-react";
import { nanoid } from "nanoid";
import React from "react";
import { toJSONSchema, z } from "zod";
import {
  DEFAULT_A2UI_DATA,
  DEFAULT_STATE_SCHEMA_JSON,
  DEFAULT_STATE_SCHEMA_ZOD,
  DEFAULT_WIDGET_JSX,
  useBuilder,
} from "@/app/(builder)/components/builder-provider";
import { CodeEditor } from "@/app/(builder)/components/code-editor";
import {
  RegistryRenderer,
  type RegistryUIChild,
  type RegistryUINode,
  type RegistryUIValue,
} from "@/registry/new-york/lib/registry-renderer";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable";

interface JsonParseResult<T> {
  value: T | null;
  error: string | null;
}

interface JsxParseResult {
  value: RegistryUIChild | null;
  error: string | null;
}

type JsxChild =
  | JSXElement
  | JSXFragment
  | JSXExpressionContainer
  | JSXText
  | JSXSpreadChild;

interface ZodSchemaResult {
  schema: Record<string, unknown> | null;
  error: string | null;
}

function parseJson<T>(text: string): JsonParseResult<T> {
  try {
    return { value: JSON.parse(text) as T, error: null };
  } catch (error) {
    return {
      value: null,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

function getJsxRoot(ast: File): JSXElement | JSXFragment | null {
  for (const node of ast.program.body) {
    if (node.type === "ExpressionStatement") {
      const expr = node.expression;
      if (expr.type === "JSXElement" || expr.type === "JSXFragment") {
        return expr;
      }
    }
    if (node.type === "ExportDefaultDeclaration") {
      const decl = node.declaration;
      if (decl && (decl.type === "JSXElement" || decl.type === "JSXFragment")) {
        return decl;
      }
    }
  }
  return null;
}

function getJsxName(name: JSXElement["openingElement"]["name"]): string | null {
  if (name.type === "JSXIdentifier") {
    return name.name;
  }
  return null;
}

function toBindingPath(expression: Expression): string | null {
  if (expression.type === "Identifier") {
    return `/${expression.name}`;
  }
  if (expression.type === "MemberExpression" && !expression.computed) {
    const objectPath =
      expression.object.type === "Identifier"
        ? `/${expression.object.name}`
        : toBindingPath(expression.object);
    if (!objectPath) {
      return null;
    }
    if (expression.property.type !== "Identifier") {
      return null;
    }
    return `${objectPath}/${expression.property.name}`;
  }
  return null;
}

function isBindingValue(
  value: RegistryUIValue | null
): value is { path: string } {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (!("path" in value)) {
    return false;
  }
  return (
    typeof (value as { path: unknown }).path === "string" &&
    Object.keys(value as { path: unknown }).length === 1
  );
}

function parseExpression(
  expression: Expression,
  errors: string[]
): RegistryUIValue | null {
  switch (expression.type) {
    case "StringLiteral":
      return expression.value;
    case "NumericLiteral":
      return expression.value;
    case "BooleanLiteral":
      return expression.value;
    case "NullLiteral":
      return null;
    case "Identifier": {
      const path = toBindingPath(expression);
      return path ? { path } : null;
    }
    case "MemberExpression": {
      const path = toBindingPath(expression);
      if (path) {
        return { path };
      }
      errors.push("Unsupported member expression in JSX binding.");
      return null;
    }
    case "ObjectExpression": {
      const result: Record<string, RegistryUIValue | null> = {};
      for (const property of expression.properties) {
        if (property.type !== "ObjectProperty") {
          errors.push("Unsupported object property in JSX.");
          continue;
        }
        const key =
          property.key.type === "Identifier"
            ? property.key.name
            : property.key.type === "StringLiteral"
              ? property.key.value
              : null;
        if (!key) {
          errors.push("Unsupported object key in JSX.");
          continue;
        }
        if (property.value.type === "JSXElement") {
          errors.push("JSX elements are not supported inside object props.");
          continue;
        }
        if (!("type" in property.value)) {
          continue;
        }
        const childValue = parseExpression(
          property.value as Expression,
          errors
        );
        result[key] = childValue;
      }
      return result;
    }
    case "ArrayExpression":
      return expression.elements
        .map((element) => {
          if (!element || element.type === "SpreadElement") {
            errors.push("Unsupported spread in array prop.");
            return null;
          }
          return parseExpression(element as Expression, errors);
        })
        .filter((item): item is RegistryUIValue => item !== null);
    case "TemplateLiteral":
      if (expression.expressions.length === 0) {
        return expression.quasis.map((part) => part.value.cooked).join("");
      }
      errors.push("Template expressions are not supported in JSX.");
      return null;
    default:
      errors.push(`Unsupported expression: ${expression.type}`);
      return null;
  }
}

function parseAttribute(
  attribute: JSXAttribute,
  errors: string[]
): [string, RegistryUIValue] | null {
  if (attribute.name.type !== "JSXIdentifier") {
    errors.push("Unsupported JSX attribute name.");
    return null;
  }
  const name = attribute.name.name;
  if (!attribute.value) {
    return [name, true];
  }
  if (attribute.value.type === "StringLiteral") {
    return [name, attribute.value.value];
  }
  if (attribute.value.type === "JSXExpressionContainer") {
    const expression = attribute.value.expression;
    if (expression.type === "JSXEmptyExpression") {
      return [name, ""];
    }
    const parsed = parseExpression(expression as Expression, errors);
    return [name, parsed];
  }
  errors.push("Unsupported JSX attribute value.");
  return null;
}

function parseJsxChild(
  child: JsxChild,
  errors: string[]
): RegistryUIChild | null {
  if (child.type === "JSXText") {
    const text = (child as JSXText).value.replace(/\s+/g, " ").trim();
    return text ? text : null;
  }
  if (child.type === "JSXElement" || child.type === "JSXFragment") {
    return parseJsxNode(child, errors);
  }
  if (child.type === "JSXExpressionContainer") {
    const expression = (child as JSXExpressionContainer).expression;
    if (expression.type === "JSXEmptyExpression") {
      return null;
    }
    const value = parseExpression(expression as Expression, errors);
    if (value === null) {
      return null;
    }
    if (Array.isArray(value)) {
      errors.push("Arrays are not supported as JSX children.");
      return null;
    }
    if (typeof value === "object" && !isBindingValue(value)) {
      errors.push("Objects are not supported as JSX children.");
      return null;
    }
    return value as RegistryUIChild;
  }
  if (child.type === "JSXSpreadChild") {
    errors.push("Spread children are not supported.");
    return null;
  }
  return null;
}

function parseJsxNode(
  node: JSXElement | JSXFragment,
  errors: string[]
): RegistryUINode {
  if (node.type === "JSXFragment") {
    const children = node.children
      .map((child) => parseJsxChild(child, errors))
      .filter((child): child is RegistryUIChild => child !== null);
    return {
      type: "Fragment",
      children,
    };
  }
  const name = getJsxName(node.openingElement.name);
  if (!name) {
    errors.push("Unsupported JSX element name.");
    return { type: "Fragment" };
  }
  const props: Record<string, RegistryUIValue> = {};
  for (const attribute of node.openingElement.attributes) {
    if (attribute.type !== "JSXAttribute") {
      errors.push("Spread attributes are not supported.");
      continue;
    }
    const parsed = parseAttribute(attribute, errors);
    if (parsed) {
      const [key, value] = parsed;
      props[key] = value;
    }
  }
  const children = node.children
    .map((child) => parseJsxChild(child, errors))
    .filter((child): child is RegistryUIChild => child !== null);

  return {
    type: name,
    props: Object.keys(props).length ? props : undefined,
    children: children.length ? children : undefined,
  };
}

function parseJsx(source: string): JsxParseResult {
  try {
    const ast = parse(source, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
    const root = getJsxRoot(ast);
    if (!root) {
      return {
        value: null,
        error: "Provide a JSX element or export default JSX.",
      };
    }
    const errors: string[] = [];
    const value = parseJsxNode(root, errors);
    return {
      value,
      error: errors.length > 0 ? (errors[0] ?? null) : null,
    };
  } catch (error) {
    return {
      value: null,
      error: error instanceof Error ? error.message : "Invalid JSX",
    };
  }
}

function getSchemaGlobals(schema: Record<string, unknown> | null): string[] {
  if (!schema) {
    return [];
  }
  const properties = schema.properties;
  if (!properties || typeof properties !== "object") {
    return [];
  }
  return Object.keys(properties);
}

function compileZodToJsonSchema(source: string): ZodSchemaResult {
  try {
    let hasDefaultExport = false;
    const withoutImports = source.replace(/^\s*import\s+.*?;?\s*$/gm, "");
    const withDefaultReturn = withoutImports.replace(
      /^\s*export\s+default\s+/m,
      () => {
        hasDefaultExport = true;
        return "return ";
      }
    );
    const sanitized = withDefaultReturn.replace(
      /^\s*export\s+\{.*?\};?\s*$/gm,
      ""
    );
    const fallbackReturn = hasDefaultExport
      ? ""
      : '\nreturn typeof WidgetState !== "undefined" ? WidgetState : undefined;';
    const factory = new Function(
      "zod",
      `const { z } = zod;\n${sanitized}${fallbackReturn}`
    );
    const schema = factory({ z });
    if (!schema) {
      return { schema: null, error: "No default export found for schema." };
    }
    const jsonSchema = toJSONSchema(schema, { target: "draft-2020-12" });
    if (!jsonSchema || typeof jsonSchema !== "object") {
      return { schema: null, error: "Failed to convert Zod schema." };
    }
    const schemaObject = { ...jsonSchema } as Record<string, unknown>;
    if ("$schema" in schemaObject) {
      schemaObject.$schema = undefined;
    }
    return { schema: schemaObject, error: null };
  } catch (error) {
    return {
      schema: null,
      error: error instanceof Error ? error.message : "Invalid Zod schema",
    };
  }
}

function PanelHeader({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const actionsClassName = className ?? "flex items-center gap-2";
  return (
    <div className="flex items-center justify-between border-b px-4 py-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
      <span>{title}</span>
      {children && <div className={actionsClassName}>{children}</div>}
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

  const [jsxText, setJsxText] = React.useState(DEFAULT_WIDGET_JSX);
  const [dataText, setDataText] = React.useState(DEFAULT_A2UI_DATA);
  const [activeStateId, setActiveStateId] = React.useState("default");
  const [activeTab, setActiveTab] = React.useState<string>("default");
  const [showJsonPreview, setShowJsonPreview] = React.useState(false);
  const [stateSchemaMode, setStateSchemaMode] = React.useState<"zod" | "json">(
    "json"
  );
  const [stateSchemaZod, setStateSchemaZod] = React.useState(
    DEFAULT_STATE_SCHEMA_ZOD
  );
  const [stateSchemaJson, setStateSchemaJson] = React.useState(
    DEFAULT_STATE_SCHEMA_JSON
  );
  const lastValidUiTreeRef = React.useRef<RegistryUIChild | null>(null);
  const lastValidJsonSchemaRef = React.useRef<Record<string, unknown> | null>(
    null
  );
  const lastValidZodSchemaRef = React.useRef<Record<string, unknown> | null>(
    null
  );

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
    isReady,
    chatid,
    currentSessionId,
    activeSessionId,
    createSession,
    setActiveSessionId,
  ]);

  React.useEffect(() => {
    if (!currentSession) {
      return;
    }
    setJsxText(currentSession.jsx);
    setActiveStateId(currentSession.activeStateId);
    setActiveTab(currentSession.activeStateId);
    setStateSchemaMode(currentSession.stateSchema.mode);
    setStateSchemaZod(currentSession.stateSchema.zod);
    setStateSchemaJson(currentSession.stateSchema.json);
    const activeState =
      currentSession.states.find(
        (state) => state.id === currentSession.activeStateId
      ) ?? currentSession.states[0];
    setDataText(activeState?.data ?? DEFAULT_A2UI_DATA);
  }, [currentSession]);

  React.useEffect(() => {
    if (!(isReady && currentSession)) {
      return;
    }
    const timer = window.setTimeout(() => {
      updateSession(chatid, {
        jsx: jsxText,
        activeStateId,
        states: currentSession.states.map((state) =>
          state.id === activeStateId ? { ...state, data: dataText } : state
        ),
        stateSchema: {
          mode: stateSchemaMode,
          zod: stateSchemaZod,
          json: stateSchemaJson,
        },
      });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [
    jsxText,
    dataText,
    activeStateId,
    chatid,
    updateSession,
    isReady,
    currentSession,
    stateSchemaMode,
    stateSchemaZod,
    stateSchemaJson,
  ]);

  const jsxParse = React.useMemo(() => parseJsx(jsxText), [jsxText]);
  const dataParse = React.useMemo(
    () => parseJson<Record<string, unknown>>(dataText),
    [dataText]
  );
  const stateSchemaJsonParse = React.useMemo(
    () => parseJson<Record<string, unknown>>(stateSchemaJson),
    [stateSchemaJson]
  );
  const stateSchemaZodParse = React.useMemo(
    () => compileZodToJsonSchema(stateSchemaZod),
    [stateSchemaZod]
  );

  React.useEffect(() => {
    if (jsxParse.value) {
      lastValidUiTreeRef.current = jsxParse.value;
    }
  }, [jsxParse.value]);

  React.useEffect(() => {
    if (stateSchemaJsonParse.value) {
      lastValidJsonSchemaRef.current = stateSchemaJsonParse.value;
    }
  }, [stateSchemaJsonParse.value]);

  React.useEffect(() => {
    if (stateSchemaZodParse.schema) {
      lastValidZodSchemaRef.current = stateSchemaZodParse.schema;
    }
  }, [stateSchemaZodParse.schema]);

  const uiTree = jsxParse.value ?? lastValidUiTreeRef.current;
  const isSchemaTab = activeTab === "schema";
  const stateDataPath = `a2ui://state/${chatid}/${activeStateId}.json`;
  const stateSchemaPath =
    stateSchemaMode === "zod"
      ? `a2ui://state-schema/${chatid}.ts`
      : `a2ui://state-schema/${chatid}.json`;
  const resolvedStateSchema =
    stateSchemaMode === "json"
      ? (stateSchemaJsonParse.value ?? lastValidJsonSchemaRef.current)
      : (stateSchemaZodParse.schema ?? lastValidZodSchemaRef.current);
  const stateGlobals = React.useMemo(
    () => getSchemaGlobals(resolvedStateSchema ?? null),
    [resolvedStateSchema]
  );
  const stateJsonSchema = React.useMemo(() => {
    if (!resolvedStateSchema) {
      return undefined;
    }
    return {
      uri: `a2ui://schema/${chatid}.json`,
      schema: resolvedStateSchema,
    };
  }, [chatid, resolvedStateSchema]);

  const handleAddState = React.useCallback(() => {
    const newStateId = nanoid();
    const nextState = {
      id: newStateId,
      name: "New state",
      data: DEFAULT_A2UI_DATA,
    };
    updateSession(chatid, {
      states: [...(currentSession?.states ?? []), nextState],
      activeStateId: newStateId,
    });
    setActiveStateId(newStateId);
    setActiveTab(newStateId);
    setDataText(nextState.data);
  }, [chatid, currentSession?.states, updateSession]);

  const handleRenameState = React.useCallback(
    (stateId: string, name: string) => {
      updateSession(chatid, {
        states: currentSession?.states.map((state) =>
          state.id === stateId ? { ...state, name } : state
        ),
      });
    },
    [chatid, currentSession?.states, updateSession]
  );

  const handleSelectState = React.useCallback(
    (stateId: string) => {
      const nextState = currentSession?.states.find(
        (state) => state.id === stateId
      );
      if (!nextState) {
        return;
      }
      setActiveStateId(stateId);
      setActiveTab(stateId);
      setDataText(nextState.data);
      updateSession(chatid, { activeStateId: stateId });
    },
    [chatid, currentSession?.states, updateSession]
  );

  const handleSelectSchema = React.useCallback(() => {
    setActiveTab("schema");
  }, []);

  const handleDeleteState = React.useCallback(
    (stateId: string) => {
      if (stateId === "default") {
        return;
      }
      const nextStates =
        currentSession?.states.filter((state) => state.id !== stateId) ?? [];
      if (nextStates.length === 0) {
        return;
      }
      const firstNextState = nextStates[0];
      if (!firstNextState) {
        return;
      }
      let nextActiveId = activeStateId;
      if (stateId === activeStateId) {
        nextActiveId = firstNextState.id;
        setActiveStateId(nextActiveId);
        setActiveTab((prev) => (prev === "schema" ? prev : nextActiveId));
        setDataText(firstNextState.data);
      }
      updateSession(chatid, {
        states: nextStates,
        activeStateId: nextActiveId,
      });
    },
    [chatid, currentSession?.states, activeStateId, updateSession]
  );

  const handleShare = React.useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentSession?.title ?? "Sidekick Builder",
          text: jsxText,
        });
        return;
      } catch {
        // Fall back to clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(jsxText);
    } catch {
      // Ignore clipboard errors.
    }
  }, [currentSession?.title, jsxText]);

  const handleExport = React.useCallback(() => {
    const blob = new Blob([jsxText], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${currentSession?.title ?? "widget"}.tsx`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [jsxText, currentSession]);

  React.useEffect(() => {
    const handleDownload = () => handleExport();
    const handleShareEvent = () => {
      void handleShare();
    };

    window.addEventListener("builder:download", handleDownload);
    window.addEventListener("builder:share", handleShareEvent);

    return () => {
      window.removeEventListener("builder:download", handleDownload);
      window.removeEventListener("builder:share", handleShareEvent);
    };
  }, [handleExport, handleShare]);

  const hasSchemaError = Boolean(jsxParse.error);
  const hasDataError = Boolean(dataParse.error);
  const jsonPreviewText = React.useMemo(
    () => (uiTree ? JSON.stringify(uiTree, null, 2) : ""),
    [uiTree]
  );

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
          <ResizablePanel defaultSize={30} minSize={22}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} minSize={30}>
                <div className="flex h-full flex-col border-r bg-background">
                  <PanelHeader title="JSX">
                    {hasSchemaError && (
                      <span className="text-destructive text-xs">
                        Invalid JSX
                      </span>
                    )}
                  </PanelHeader>
                  <div className="flex min-h-0 flex-1 flex-col p-2">
                    <CodeEditor
                      className="h-full"
                      globals={stateGlobals}
                      language="typescript"
                      onChange={setJsxText}
                      path={`a2ui://jsx/${chatid}.tsx`}
                      value={jsxText}
                    />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={20}>
                <div className="flex h-full flex-col border-r bg-background">
                  <PanelHeader title="State">
                    {hasDataError && (
                      <span className="text-destructive text-xs">
                        Invalid JSON
                      </span>
                    )}
                  </PanelHeader>
                  <div className="flex items-center gap-2 border-b px-2 py-2">
                    <div className="flex flex-1 items-center gap-1 overflow-x-auto">
                      <Button
                        className="h-7 px-2 text-xs"
                        onClick={handleSelectSchema}
                        variant={isSchemaTab ? "secondary" : "ghost"}
                      >
                        Schema
                      </Button>
                      {currentSession.states.map((state) => {
                        const isActive =
                          !isSchemaTab && state.id === activeStateId;
                        return (
                          <div
                            className="flex items-center gap-1"
                            key={state.id}
                          >
                            <Button
                              className="h-7 px-2 text-xs"
                              onClick={() => handleSelectState(state.id)}
                              variant={isActive ? "secondary" : "ghost"}
                            >
                              {state.name}
                            </Button>
                            {state.id !== "default" && (
                              <Button
                                className="h-7 w-7 p-0 text-xs"
                                onClick={() => handleDeleteState(state.id)}
                                size="icon"
                                variant="ghost"
                              >
                                <X className="size-3" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                      <Button
                        className="h-7 w-7 p-0"
                        onClick={handleAddState}
                        size="icon"
                        variant="ghost"
                      >
                        +
                      </Button>
                    </div>
                    {isSchemaTab ? (
                      <div className="flex items-center gap-1">
                        <Button
                          className="h-7 px-2 text-xs"
                          onClick={() => setStateSchemaMode("zod")}
                          variant={
                            stateSchemaMode === "zod" ? "secondary" : "ghost"
                          }
                        >
                          Zod
                        </Button>
                        <Button
                          className="h-7 px-2 text-xs"
                          onClick={() => setStateSchemaMode("json")}
                          variant={
                            stateSchemaMode === "json" ? "secondary" : "ghost"
                          }
                        >
                          JSON Schema
                        </Button>
                      </div>
                    ) : (
                      <Input
                        className="h-7 w-36 text-xs"
                        onChange={(event) =>
                          handleRenameState(activeStateId, event.target.value)
                        }
                        placeholder="State name"
                        value={
                          currentSession.states.find(
                            (state) => state.id === activeStateId
                          )?.name ?? ""
                        }
                      />
                    )}
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col p-2">
                    {isSchemaTab ? (
                      <CodeEditor
                        className="h-full"
                        language={
                          stateSchemaMode === "zod" ? "typescript" : "json"
                        }
                        onChange={
                          stateSchemaMode === "zod"
                            ? setStateSchemaZod
                            : setStateSchemaJson
                        }
                        path={stateSchemaPath}
                        value={
                          stateSchemaMode === "zod"
                            ? stateSchemaZod
                            : stateSchemaJson
                        }
                      />
                    ) : (
                      <CodeEditor
                        className="h-full"
                        jsonSchema={stateJsonSchema}
                        onChange={setDataText}
                        path={stateDataPath}
                        value={dataText}
                      />
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70} minSize={40}>
            <div className="flex h-full flex-col bg-background">
              <PanelHeader title={showJsonPreview ? "JSON" : "Preview"}>
                <Button
                  className="h-7 px-2 text-xs"
                  onClick={() => setShowJsonPreview((current) => !current)}
                  variant="ghost"
                >
                  {showJsonPreview ? "Preview" : "JSON"}
                </Button>
              </PanelHeader>
              <div className="min-h-0 flex-1 overflow-auto p-6">
                {showJsonPreview ? (
                  uiTree ? (
                    <CodeEditor
                      className="h-full"
                      language="json"
                      onChange={() => {}}
                      readOnly
                      value={jsonPreviewText}
                    />
                  ) : (
                    <div className="rounded-lg border border-dashed bg-background p-6 text-muted-foreground text-sm">
                      Fix JSX errors to view JSON.
                    </div>
                  )
                ) : hasSchemaError || hasDataError || !uiTree ? (
                  <div className="rounded-lg border border-dashed bg-background p-6 text-muted-foreground text-sm">
                    Fix JSX or state JSON errors to render preview.
                  </div>
                ) : (
                  <div className="rounded-xl border bg-muted/20 p-8 shadow-sm">
                    <RegistryRenderer
                      data={dataParse.value ?? {}}
                      tree={uiTree}
                    />
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* TODO: Add sandboxed code execution once Vercel sandboxes are wired in. */}
    </div>
  );
}

function BuilderChatPage({ params }: { params: Promise<{ chatid: string }> }) {
  const { chatid } = React.use(params);

  return <BuilderChatContent chatid={chatid} />;
}

export default BuilderChatPage;
