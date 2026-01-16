import type { UIElement, UITree } from "@json-render/core";

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

function indent(level: number) {
  return "  ".repeat(level);
}

function jsString(value: string) {
  return JSON.stringify(value);
}

function pathToAccessor(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) {
    return "data";
  }
  // data?.a?.b?.c
  return ["data"].concat(parts.map((p) => `?.${p}`)).join("");
}

function renderProps(props: Record<string, unknown>): string {
  const entries = Object.entries(props)
    .filter(([_, value]) => value !== undefined)
    .filter(([key]) => key !== "label" && key !== "text")
    .filter(([key]) => key !== "valuePath" && key !== "action");

  if (entries.length === 0) {
    return "";
  }

  const rendered = entries
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${key}={${jsString(value)}}`;
      }
      if (typeof value === "number" || typeof value === "boolean") {
        return `${key}={${String(value)}}`;
      }
      if (value === null) {
        return `${key}={null}`;
      }
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(" ");

  return rendered ? ` ${rendered}` : "";
}

function renderText(element: UIElement, level: number): string {
  const className =
    typeof (element.props as any).className === "string"
      ? ((element.props as any).className as string)
      : undefined;
  const variant =
    typeof (element.props as any).variant === "string"
      ? ((element.props as any).variant as string)
      : undefined;
  const valuePath =
    typeof (element.props as any).valuePath === "string"
      ? ((element.props as any).valuePath as string)
      : undefined;
  const text =
    typeof (element.props as any).text === "string"
      ? ((element.props as any).text as string)
      : undefined;

  const Tag =
    variant === "h1"
      ? "h1"
      : variant === "h2"
        ? "h2"
        : variant === "h3"
          ? "h3"
          : "p";

  const variantClass =
    variant === "h1"
      ? "text-2xl font-semibold"
      : variant === "h2"
        ? "text-xl font-semibold"
        : variant === "h3"
          ? "text-lg font-semibold"
          : variant === "caption"
            ? "text-xs text-muted-foreground"
            : "text-sm text-foreground";

  const cls = [variantClass, className].filter(Boolean).join(" ");
  const clsProp = cls ? ` className={${jsString(cls)}}` : "";

  if (valuePath) {
    return `${indent(level)}<${Tag}${clsProp}>{String(get(data, ${jsString(
      valuePath
    )}) ?? "")}</${Tag}>`;
  }

  return `${indent(level)}<${Tag}${clsProp}>${text ? text : ""}</${Tag}>`;
}

function renderElement(tree: UITree, key: string, level: number): string {
  const element = tree.elements[key];
  if (!element) {
    return `${indent(level)}{/* Missing element: ${key} */}`;
  }

  const props = (element.props ?? {}) as Record<string, unknown>;

  if (element.type === "Text") {
    return renderText(element, level);
  }

  if (element.type === "Column" || element.type === "Row") {
    const gap =
      GAP_CLASSES[typeof props.gap === "string" ? props.gap : "md"] ?? "gap-4";
    const align =
      ALIGN_CLASSES[typeof props.align === "string" ? props.align : "start"] ??
      (element.type === "Row" ? "items-center" : "items-start");

    const classNameParts = [
      element.type === "Row" ? "flex flex-row" : "flex flex-col",
      gap,
      align,
      typeof props.className === "string" ? props.className : undefined,
    ].filter(Boolean);

    const className = classNameParts.join(" ");

    const children = (element.children ?? []).map((childKey) =>
      renderElement(tree, childKey, level + 1)
    );

    if (children.length === 0) {
      return `${indent(level)}<div className={${jsString(className)}} />`;
    }

    return [
      `${indent(level)}<div className={${jsString(className)}}>`,
      ...children,
      `${indent(level)}</div>`,
    ].join("\n");
  }

  if (element.type === "Button") {
    const label = typeof props.label === "string" ? props.label : "Button";
    const variant =
      typeof props.variant === "string" ? props.variant : undefined;
    const size = typeof props.size === "string" ? props.size : undefined;

    const extraProps: Record<string, unknown> = { ...props };
    delete extraProps.label;
    delete extraProps.action;

    if (variant) {
      extraProps.variant = variant;
    }

    if (size) {
      extraProps.size = size;
    }

    return `${indent(level)}<Button${renderProps(extraProps)}>${label}</Button>`;
  }

  if (element.type === "Badge") {
    const text = typeof props.text === "string" ? props.text : "Badge";
    const extraProps: Record<string, unknown> = { ...props };
    delete extraProps.text;
    return `${indent(level)}<Badge${renderProps(extraProps)}>${text}</Badge>`;
  }

  if (element.type === "Input") {
    const placeholder =
      typeof props.placeholder === "string" ? props.placeholder : "";
    const type = typeof props.type === "string" ? props.type : undefined;
    const valuePath =
      typeof props.valuePath === "string" ? props.valuePath : undefined;

    const binding = valuePath
      ? ` value={String(get(data, ${jsString(valuePath)}) ?? "")}`
      : "";

    const typeProp = type ? ` type={${jsString(type)}}` : "";

    const cls =
      typeof props.className === "string"
        ? ` className={${jsString(props.className)}}`
        : "";

    return `${indent(level)}<Input${cls}${typeProp} placeholder={${jsString(
      placeholder
    )}}${binding} />`;
  }

  if (element.type === "Textarea") {
    const placeholder =
      typeof props.placeholder === "string" ? props.placeholder : "";
    const rows = typeof props.rows === "number" ? ` rows={${props.rows}}` : "";
    const valuePath =
      typeof props.valuePath === "string" ? props.valuePath : undefined;

    const binding = valuePath
      ? ` value={String(get(data, ${jsString(valuePath)}) ?? "")}`
      : "";

    const cls =
      typeof props.className === "string"
        ? ` className={${jsString(props.className)}}`
        : "";

    return `${indent(level)}<Textarea${cls}${rows} placeholder={${jsString(
      placeholder
    )}}${binding} />`;
  }

  if (element.type === "Separator") {
    return `${indent(level)}<Separator${renderProps(props)} />`;
  }

  const children = (element.children ?? []).map((childKey) =>
    renderElement(tree, childKey, level + 1)
  );

  const jsxProps = renderProps(props);

  if (children.length === 0) {
    return `${indent(level)}<${element.type}${jsxProps} />`;
  }

  return [
    `${indent(level)}<${element.type}${jsxProps}>`,
    ...children,
    `${indent(level)}</${element.type}>`,
  ].join("\n");
}

export function uiTreeToTsx(tree: UITree): string {
  const root = tree.elements[tree.root];
  if (!root) {
    return "// Invalid UITree: root not found";
  }

  const usedTypes = new Set(Object.values(tree.elements).map((el) => el.type));

  const imports: string[] = ['import * as React from "react";'];

  const addImport = (spec: string, path: string) => {
    imports.push(`import { ${spec} } from ${jsString(path)};`);
  };

  if (usedTypes.has("Button")) {
    addImport("Button", "@repo/design-system/components/ui/button");
  }
  if (usedTypes.has("Badge")) {
    addImport("Badge", "@repo/design-system/components/ui/badge");
  }
  if (usedTypes.has("Input")) {
    addImport("Input", "@repo/design-system/components/ui/input");
  }
  if (usedTypes.has("Textarea")) {
    addImport("Textarea", "@repo/design-system/components/ui/textarea");
  }
  if (usedTypes.has("Separator")) {
    addImport("Separator", "@repo/design-system/components/ui/separator");
  }
  if (
    usedTypes.has("Card") ||
    usedTypes.has("CardHeader") ||
    usedTypes.has("CardContent") ||
    usedTypes.has("CardFooter")
  ) {
    const parts: string[] = [];
    if (usedTypes.has("Card")) parts.push("Card");
    if (usedTypes.has("CardHeader")) parts.push("CardHeader");
    if (usedTypes.has("CardContent")) parts.push("CardContent");
    if (usedTypes.has("CardFooter")) parts.push("CardFooter");
    addImport(parts.join(", "), "@repo/design-system/components/ui/card");
  }

  const header = [
    ...imports.sort(),
    "",
    "type WidgetProps = { data: Record<string, unknown> };",
    "",
    "function get(data: Record<string, unknown>, path: string): unknown {",
    "  const parts = path.split('/').filter(Boolean);",
    "  let current: unknown = data;",
    "  for (const part of parts) {",
    "    if (!current || typeof current !== 'object') return undefined;",
    "    current = (current as Record<string, unknown>)[part];",
    "  }",
    "  return current;",
    "}",
    "",
    "export function Widget({ data }: WidgetProps) {",
    "  return (",
  ].join("\n");

  const body = renderElement(tree, tree.root, 2);

  const footer = ["  );", "}", ""].join("\n");

  return [header, body, footer].join("\n");
}
