"use client";

import { Fragment } from "react";
import type { ComponentType, ReactNode, JSX as ReactJSX } from "react";

import * as RegistryComponents from "@/registry/new-york/ui";
import { cn } from "@/registry/new-york/lib/utils";

export type RegistryUIBinding = {
  path: string;
};

export type RegistryUIValue =
  | RegistryUIBinding
  | string
  | number
  | boolean
  | null
  | { [key: string]: RegistryUIValue }
  | RegistryUIValue[];

export type RegistryUIChild =
  | RegistryUINode
  | RegistryUIBinding
  | string
  | number
  | boolean
  | null;

export type RegistryUINode = {
  type: string;
  props?: Record<string, RegistryUIValue>;
  children?: RegistryUIChild[];
};

type RegistryRendererProps = {
  tree: RegistryUIChild | null;
  data?: Record<string, unknown>;
  className?: string;
};

const registryComponentMap = Object.fromEntries(
  Object.entries(RegistryComponents).filter(([name, value]) => {
    if (!name || name[0] !== name[0]?.toUpperCase()) return false;
    if (typeof value === "function") return true;
    if (typeof value === "object" && value && "$$typeof" in value) return true;
    return false;
  })
);

const HTML_TAGS = new Set([
  "div",
  "span",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "section",
  "article",
  "header",
  "footer",
  "main",
  "strong",
  "em",
  "small",
]);

function resolvePath(path: string, data: Record<string, unknown>) {
  const parts = path.split("/").filter(Boolean);
  let current: unknown = data;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function isBinding(value: unknown): value is RegistryUIBinding {
  if (!value || typeof value !== "object") return false;
  if (!("path" in value)) return false;
  return (
    typeof (value as RegistryUIBinding).path === "string" &&
    Object.keys(value as RegistryUIBinding).length === 1
  );
}

function resolveBinding(
  value: RegistryUIValue,
  data: Record<string, unknown>
): unknown {
  if (isBinding(value)) {
    return resolvePath(value.path, data);
  }
  if (Array.isArray(value)) {
    return value.map((child) => resolveBinding(child, data));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        resolveBinding(entry as RegistryUIValue, data),
      ])
    );
  }
  return value;
}

function renderNode(
  node: RegistryUIChild,
  data: Record<string, unknown>
): ReactNode {
  if (node === null || node === undefined) return null;
  if (typeof node === "string" || typeof node === "number") return node;
  if (typeof node === "boolean") return node ? "true" : "false";

  if (isBinding(node)) {
    const resolved = resolvePath(node.path, data);
    if (resolved === null || resolved === undefined) return "";
    return typeof resolved === "string" || typeof resolved === "number"
      ? resolved
      : JSON.stringify(resolved);
  }

  if (node.type === "Fragment") {
    return (
      <>
        {(node.children ?? []).map((child, index) => (
          <Fragment key={`${node.type}-${index}`}>
            {renderNode(child, data)}
          </Fragment>
        ))}
      </>
    );
  }

  const resolvedProps = resolveBinding(
    node.props ?? {},
    data
  ) as Record<string, unknown>;
  const { children: ignoredChildren, ...componentProps } = resolvedProps;
  const renderedChildren = (node.children ?? []).map((child, index) => (
    <Fragment key={`${node.type}-${index}`}>{renderNode(child, data)}</Fragment>
  ));

  const Component = registryComponentMap[
    node.type
  ] as ComponentType<Record<string, unknown>> | undefined;
  if (Component) {
    return <Component {...componentProps}>{renderedChildren}</Component>;
  }

  if (HTML_TAGS.has(node.type)) {
    const Tag = node.type as keyof ReactJSX.IntrinsicElements;
    return <Tag {...componentProps}>{renderedChildren}</Tag>;
  }

  return (
    <div className="rounded-md border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
      Unsupported component: {node.type}
    </div>
  );
}

export function RegistryRenderer({
  tree,
  data = {},
  className,
}: RegistryRendererProps) {
  if (!tree) return null;
  return (
    <div className={cn("w-full", className)}>{renderNode(tree, data)}</div>
  );
}
