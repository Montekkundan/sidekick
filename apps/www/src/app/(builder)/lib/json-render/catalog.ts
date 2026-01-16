import { ActionSchema, createCatalog } from "@json-render/core";
import { z } from "zod";

export const BUILDER_COMPONENT_TYPES = [
  "Card",
  "CardHeader",
  "CardContent",
  "CardFooter",
  "Column",
  "Row",
  "Text",
  "Button",
  "Input",
  "Textarea",
  "Separator",
  "Badge",
] as const;

export const BUILDER_ACTION_NAMES = ["navigate", "toast"] as const;

export const builderCatalog = createCatalog({
  components: {
    Card: {
      description: "A container card.",
      props: z
        .object({
          className: z.string().optional(),
        })
        .strict(),
      hasChildren: true,
    },
    CardHeader: {
      props: z.object({ className: z.string().optional() }).strict(),
      hasChildren: true,
    },
    CardContent: {
      props: z.object({ className: z.string().optional() }).strict(),
      hasChildren: true,
    },
    CardFooter: {
      props: z.object({ className: z.string().optional() }).strict(),
      hasChildren: true,
    },
    Column: {
      description: "Vertical flex layout.",
      props: z
        .object({
          className: z.string().optional(),
          gap: z.enum(["none", "xs", "sm", "md", "lg"]).optional(),
          align: z.enum(["start", "center", "end", "stretch"]).optional(),
        })
        .strict(),
      hasChildren: true,
    },
    Row: {
      description: "Horizontal flex layout.",
      props: z
        .object({
          className: z.string().optional(),
          gap: z.enum(["none", "xs", "sm", "md", "lg"]).optional(),
          align: z.enum(["start", "center", "end", "stretch"]).optional(),
        })
        .strict(),
      hasChildren: true,
    },
    Text: {
      description: "Typography element.",
      props: z
        .object({
          className: z.string().optional(),
          text: z.string().optional(),
          valuePath: z.string().optional(),
          variant: z.enum(["p", "h1", "h2", "h3", "caption"]).optional(),
        })
        .strict(),
    },
    Button: {
      description: "Clickable button that can trigger an action.",
      props: z
        .object({
          className: z.string().optional(),
          label: z.string(),
          variant: z
            .enum([
              "default",
              "destructive",
              "outline",
              "secondary",
              "ghost",
              "link",
            ])
            .optional(),
          size: z
            .enum(["default", "sm", "lg", "icon", "icon-sm", "icon-lg"])
            .optional(),
          action: ActionSchema.optional(),
        })
        .strict(),
    },
    Input: {
      description: "Single-line text input bound to data.",
      props: z
        .object({
          className: z.string().optional(),
          valuePath: z.string(),
          placeholder: z.string().optional(),
          type: z.string().optional(),
        })
        .strict(),
    },
    Textarea: {
      description: "Multi-line text input bound to data.",
      props: z
        .object({
          className: z.string().optional(),
          valuePath: z.string(),
          placeholder: z.string().optional(),
          rows: z.number().int().positive().optional(),
        })
        .strict(),
    },
    Separator: {
      props: z
        .object({
          className: z.string().optional(),
          orientation: z.enum(["horizontal", "vertical"]).optional(),
        })
        .strict(),
    },
    Badge: {
      props: z
        .object({
          className: z.string().optional(),
          text: z.string(),
          variant: z
            .enum(["default", "secondary", "destructive", "outline"])
            .optional(),
        })
        .strict(),
    },
  },
  actions: {
    navigate: {
      description: "Navigate to a URL.",
      params: z.object({ url: z.string() }).strict(),
    },
    toast: {
      description: "Show a toast notification.",
      params: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          variant: z.enum(["default", "success", "error"]).optional(),
        })
        .strict(),
    },
  },
});
