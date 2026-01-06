"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import * as RegistryComponents from "@/registry/new-york/ui";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const A2UI_COMPONENTS = [
  "Card",
  "Column",
  "Row",
  "Text",
  "Button",
  "Divider",
  "Image",
  "List",
  "ListItem",
];

const A2UI_FIELDS = [
  "id",
  "component",
  "children",
  "child",
  "text",
  "path",
  "variant",
  "gap",
  "alignment",
  "src",
  "alt",
  "ordered",
  "label",
];

let completionRegistered = false;
let jsonDefaultsConfigured = false;
let tsDefaultsConfigured = false;
const jsonSchemaRegistry = new Map<string, {
  uri: string;
  schema: Record<string, unknown>;
  fileMatch?: string[];
}>();
const registryComponentNames = Object.keys(RegistryComponents).filter(
  (name) => name[0] === name[0]?.toUpperCase()
);

function registerCompletions(monaco: Parameters<OnMount>[1]) {
  if (completionRegistered) return;
  completionRegistered = true;

  monaco.languages.registerCompletionItemProvider("json", {
    triggerCharacters: ['"', ":"],
    provideCompletionItems(
      model: Monaco.editor.ITextModel,
      position: Monaco.Position
    ) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const componentSuggestions = A2UI_COMPONENTS.map((label) => ({
        label,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: label,
        range,
      }));

      const fieldSuggestions = A2UI_FIELDS.map((label) => ({
        label,
        kind: monaco.languages.CompletionItemKind.Field,
        insertText: label,
        range,
      }));

      return {
        suggestions: [...componentSuggestions, ...fieldSuggestions],
      };
    },
  });
}

function configureJsonDefaults(monaco: Parameters<OnMount>[1]) {
  if (jsonDefaultsConfigured) return;
  jsonDefaultsConfigured = true;
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: false,
    allowComments: true,
    schemaRequest: "ignore",
    schemas: [],
  });
}

function configureTypeScriptDefaults(monaco: Parameters<OnMount>[1]) {
  if (tsDefaultsConfigured) return;
  tsDefaultsConfigured = true;

  const defaults = [
    monaco.languages.typescript.typescriptDefaults,
    monaco.languages.typescript.javascriptDefaults,
  ];

  defaults.forEach((languageDefaults) => {
    languageDefaults.setCompilerOptions({
      allowNonTsExtensions: true,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeNext,
      target: monaco.languages.typescript.ScriptTarget.ES2022,
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
    });

    languageDefaults.addExtraLib(
      `declare module "zod" {
        export const z: any;
        const _default: unknown;
        export default _default;
      }`,
      "file:///node_modules/@types/zod/index.d.ts"
    );

    languageDefaults.addExtraLib(
      `declare module "react" {
        export type ReactNode = any;
        export interface FC<P = any> {
          (props: P): JSX.Element | null;
        }
      }
      declare module "react/jsx-runtime" {
        export const jsx: any;
        export const jsxs: any;
        export const Fragment: any;
      }
      declare namespace JSX {
        interface IntrinsicElements {
          [key: string]: any;
        }
      }`,
      "file:///node_modules/@types/react/index.d.ts"
    );

    if (registryComponentNames.length) {
      languageDefaults.addExtraLib(
        `${registryComponentNames
          .map((name) => `declare const ${name}: (props: any) => JSX.Element;`)
          .join("\n")}`,
        "file:///node_modules/@types/sidekick-registry/index.d.ts"
      );
    }
  });
}

function applyJsonSchemas(monaco: Parameters<OnMount>[1]) {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: false,
    allowComments: true,
    schemas: Array.from(jsonSchemaRegistry.values()).map((entry) => ({
      uri: entry.uri,
      schema: entry.schema,
      fileMatch: entry.fileMatch,
    })),
  });
}

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  className?: string;
  path?: string;
  readOnly?: boolean;
  globals?: string[];
  jsonSchema?: {
    uri: string;
    schema: Record<string, unknown>;
    fileMatch?: string[];
  };
};

export function CodeEditor({
  value,
  onChange,
  language = "json",
  className,
  path,
  readOnly = false,
  globals,
  jsonSchema,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorTheme = resolvedTheme === "dark" ? "vs-dark" : "vs";
  const editorRef = React.useRef<Monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const monacoRef = React.useRef<Parameters<OnMount>[1] | null>(null);
  const globalsDisposableRef = React.useRef<Monaco.IDisposable[]>([]);
  const editorId = React.useId().replace(/:/g, "");

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    registerCompletions(monaco);
    configureJsonDefaults(monaco);
    configureTypeScriptDefaults(monaco);
    applyJsonSchemas(monaco);
    editor.updateOptions({
      tabSize: 2,
      insertSpaces: true,
    });
  };

  React.useEffect(() => {
    if (!monacoRef.current || !jsonSchema) return undefined;
    const fileMatch = jsonSchema.fileMatch ?? (path ? [path] : undefined);
    jsonSchemaRegistry.set(jsonSchema.uri, {
      ...jsonSchema,
      fileMatch,
    });
    applyJsonSchemas(monacoRef.current);
    return () => {
      jsonSchemaRegistry.delete(jsonSchema.uri);
      if (monacoRef.current) {
        applyJsonSchemas(monacoRef.current);
      }
    };
  }, [jsonSchema, path]);

  React.useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.updateOptions({ readOnly });
  }, [readOnly]);

  React.useEffect(() => {
    if (!monacoRef.current) return;
    globalsDisposableRef.current.forEach((disposable) => disposable.dispose());
    globalsDisposableRef.current = [];

    const names =
      globals?.filter((name) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) ?? [];
    if (names.length === 0) return;

    const declarations = names
      .map((name) => `declare const ${name}: any;`)
      .join("\n");
    const filePath = `file:///node_modules/@types/sidekick-globals/${editorId}.d.ts`;

    globalsDisposableRef.current = [
      monacoRef.current.languages.typescript.typescriptDefaults.addExtraLib(
        declarations,
        filePath
      ),
      monacoRef.current.languages.typescript.javascriptDefaults.addExtraLib(
        declarations,
        filePath
      ),
    ];

    return () => {
      globalsDisposableRef.current.forEach((disposable) => disposable.dispose());
      globalsDisposableRef.current = [];
    };
  }, [globals, editorId]);

  return (
    <div className={cn("h-full w-full", className)}>
      <MonacoEditor
        height="100%"
        language={language}
        onChange={
          readOnly ? undefined : (nextValue) => onChange(nextValue ?? "")
        }
        onMount={handleMount}
        options={{
          automaticLayout: true,
          domReadOnly: readOnly,
          fixedOverflowWidgets: true,
          fontSize: 12,
          lineNumbers: "on",
          minimap: { enabled: false },
          readOnly,
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
        path={path}
        theme={editorTheme}
        value={value}
      />
    </div>
  );
}
