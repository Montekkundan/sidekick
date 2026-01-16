import {
  type UIElement,
  type UITree,
  VisibilityConditionSchema,
} from "@json-render/core";
import { z } from "zod";

export type JsonParseResult<T> = {
  value: T | null;
  error: string | null;
};

export const UIElementSchema: z.ZodType<UIElement> = z
  .object({
    key: z.string(),
    type: z.string(),
    props: z.record(z.string(), z.unknown()).default({}),
    children: z.array(z.string()).optional(),
    parentKey: z.string().nullable().optional(),
    visible: VisibilityConditionSchema.optional(),
  })
  .passthrough();

export const UITreeSchema: z.ZodType<UITree> = z
  .object({
    root: z.string(),
    elements: z.record(z.string(), UIElementSchema),
  })
  .passthrough();

function validateReferences(tree: UITree): string | null {
  if (!tree.root) {
    return "Missing root";
  }

  if (!tree.elements[tree.root]) {
    return `Root key not found in elements: ${tree.root}`;
  }

  for (const [key, element] of Object.entries(tree.elements)) {
    if (element.key !== key) {
      return `Element key mismatch: elements['${key}'].key is '${String(element.key)}'`;
    }

    for (const childKey of element.children ?? []) {
      if (!tree.elements[childKey]) {
        return `Missing child '${childKey}' referenced by '${key}'`;
      }
    }
  }

  return null;
}

export function parseUITreeJson(text: string): JsonParseResult<UITree> {
  const trimmed = text.trim();
  if (trimmed.startsWith("import ") || trimmed.startsWith("export ")) {
    return {
      value: null,
      error: "UI Tree must be JSON (you pasted TSX/JS).",
    };
  }

  try {
    const raw = JSON.parse(text) as unknown;
    const parsed = UITreeSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        value: null,
        error: parsed.error.issues[0]?.message ?? "Invalid UI tree JSON",
      };
    }

    const referenceError = validateReferences(parsed.data);
    if (referenceError) {
      return { value: null, error: referenceError };
    }

    return { value: parsed.data, error: null };
  } catch (error) {
    return {
      value: null,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

export const BUILDER_UITREE_JSON_SCHEMA: Record<string, unknown> = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  required: ["root", "elements"],
  properties: {
    root: { type: "string" },
    elements: {
      type: "object",
      additionalProperties: {
        type: "object",
        required: ["key", "type", "props"],
        properties: {
          key: { type: "string" },
          type: { type: "string" },
          props: { type: "object" },
          children: { type: "array", items: { type: "string" } },
          parentKey: { anyOf: [{ type: "string" }, { type: "null" }] },
          visible: {},
        },
      },
    },
  },
};
