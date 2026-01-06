import { Fragment } from "react";
import type { ReactNode } from "react";

import { Button } from "@/registry/new-york/ui/button";
import { Card, CardContent } from "@/registry/new-york/ui/card";
import { Separator } from "@/registry/new-york/ui/separator";
import { cn } from "@/registry/new-york/lib/utils";

export type A2UINode = {
  id: string;
  component: Record<string, unknown>;
};

type A2UIRendererProps = {
  nodes: A2UINode[];
  data?: Record<string, unknown>;
  rootId?: string;
  className?: string;
};

const GAP_CLASSES: Record<string, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const ALIGN_CLASSES: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

function resolvePath(path: string, data: Record<string, unknown>) {
  const parts = path.split("/").filter(Boolean);
  let current: unknown = data;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function resolveValue(
  input: unknown,
  data: Record<string, unknown>
): string | number | boolean | null | undefined {
  if (input === null || input === undefined) return undefined;
  if (typeof input === "string") return input;
  if (typeof input === "number" || typeof input === "boolean") return input;
  if (typeof input !== "object") return undefined;
  const record = input as Record<string, unknown>;
  if (typeof record.path === "string") {
    return resolvePath(record.path, data) as string | number | boolean | null;
  }
  if ("value" in record) {
    return record.value as string | number | boolean | null | undefined;
  }
  return undefined;
}

function getChildIds(componentProps: Record<string, unknown>) {
  const children = componentProps.children as
    | { explicitList?: string[]; implicitList?: string[] }
    | string[]
    | string
    | undefined;
  if (!children) {
    const child = componentProps.child;
    return typeof child === "string" ? [child] : [];
  }
  if (Array.isArray(children)) return children;
  if (typeof children === "string") return [children];
  if (children.explicitList) return children.explicitList;
  if (children.implicitList) return children.implicitList;
  return [];
}

function renderTextValue(
  props: Record<string, unknown>,
  data: Record<string, unknown>
) {
  const text = resolveValue(props.text, data);
  return text ?? "";
}

function renderTextVariant(variant: string | undefined, content: ReactNode) {
  switch (variant) {
    case "h1":
      return <h1 className="text-2xl font-semibold">{content}</h1>;
    case "h2":
      return <h2 className="text-xl font-semibold">{content}</h2>;
    case "h3":
      return <h3 className="text-lg font-semibold">{content}</h3>;
    case "caption":
      return <p className="text-xs text-muted-foreground">{content}</p>;
    default:
      return <p className="text-sm text-foreground">{content}</p>;
  }
}

function getComponentEntry(component: Record<string, unknown>) {
  const entries = Object.entries(component);
  if (entries.length === 0) return null;
  return entries[0];
}

export function A2UIRenderer({
  nodes,
  data = {},
  rootId,
  className,
}: A2UIRendererProps) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const startId = rootId ?? (nodeMap.has("root") ? "root" : nodes[0]?.id);

  if (!startId) {
    return null;
  }

  const renderNode = (id: string): ReactNode => {
    const node = nodeMap.get(id);
    if (!node) return null;

    const entry = getComponentEntry(node.component);
    if (!entry) return null;

    const [type, rawProps] = entry;
    const props = (rawProps ?? {}) as Record<string, unknown>;
    const children = getChildIds(props).map((childId) => (
      <Fragment key={childId}>{renderNode(childId)}</Fragment>
    ));

    switch (type) {
      case "Card":
        return (
          <Card className="w-full">
            <CardContent className="space-y-4">{children}</CardContent>
          </Card>
        );
      case "Column": {
        const gap = GAP_CLASSES[String(props.gap)] ?? "gap-4";
        const align = ALIGN_CLASSES[String(props.alignment)] ?? "items-start";
        return <div className={cn("flex flex-col", gap, align)}>{children}</div>;
      }
      case "Row": {
        const gap = GAP_CLASSES[String(props.gap)] ?? "gap-4";
        const align = ALIGN_CLASSES[String(props.alignment)] ?? "items-center";
        return <div className={cn("flex flex-row", gap, align)}>{children}</div>;
      }
      case "Divider":
        return <Separator />;
      case "Text": {
        const variant =
          typeof props.variant === "string" ? props.variant : undefined;
        const content = renderTextValue(props, data);
        return renderTextVariant(variant, content);
      }
      case "Image": {
        const src = resolveValue(props.src, data);
        const alt = resolveValue(props.alt, data) ?? "A2UI image";
        if (!src || typeof src !== "string") return null;
        return (
          <img
            alt={String(alt)}
            className="h-auto w-full rounded-md object-cover"
            src={src}
          />
        );
      }
      case "Button": {
        const label = resolveValue(props.label ?? props.text, data);
        return <Button size="sm">{label ?? "Button"}</Button>;
      }
      case "List": {
        const ordered = Boolean(props.ordered);
        const ListTag = ordered ? "ol" : "ul";
        const listStyle = ordered ? "list-decimal" : "list-disc";
        return (
          <ListTag
            className={cn(
              "list-inside space-y-2 text-sm text-foreground",
              listStyle
            )}
          >
            {children}
          </ListTag>
        );
      }
      case "ListItem":
        return <li className="text-sm text-foreground">{children}</li>;
      default:
        return (
          <div className="rounded-md border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
            Unsupported A2UI component: {type}
          </div>
        );
    }
  };

  // TODO: Expand mappings to cover the full A2UI spec once transports stabilize.
  return <div className={cn("w-full", className)}>{renderNode(startId)}</div>;
}
