import { generateCatalogPrompt } from "@json-render/core";
import { dashboardCatalog } from "@repo/design-system/lib/catalog";
import { gateway, streamText } from "ai";

export const maxDuration = 30;

const MAX_PROMPT_LENGTH = 140;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const sanitizedPrompt = String(prompt || "").slice(0, MAX_PROMPT_LENGTH);
  const baseSystemPrompt = generateCatalogPrompt(dashboardCatalog);
  const systemPrompt = `${baseSystemPrompt}

IMPORTANT: You must generate the UI using a FLAT tree structure with "root" and "elements".
Do NOT generate a recursive tree.
Output a stream of JSON Patch operations (JSONL) to build the tree incrementally.

RULES:
1. First line sets /root to root element key
2. Add elements with /elements/{key}
3. Children array contains string keys to OTHER elements (keys)
4. For simple text content inside Button, Badge, Label, CardTitle, CardDescription, AlertTitle, AlertDescription: pass text as "children" prop string. DO NOT use a child element key.
5. Parent first, then children keys
6. Each element needs: key, type, props
7. Use className for custom Tailwind styling
8. Use "div" with Tailwind flex/grid classes for layout.
9. DO NOT use "Text", "Stack", "Group" components. They do not exist.

FORBIDDEN CLASSES (NEVER USE):
- min-h-screen, h-screen, min-h-full, h-full, min-h-dvh, h-dvh
- bg-gray-50, bg-slate-50 or any page background colors

MOBILE-FIRST RESPONSIVE:
- ALWAYS design mobile-first. Single column on mobile, expand on larger screens.
- Grid layouts: Use div with className="grid gap-4 sm:grid-cols-2"
- For forms: Use Card as container. Use div with "space-y-4" for vertical spacing.
- Use div with "flex items-center gap-2" for horizontal alignment.

EXAMPLE (Blog with responsive grid):
{"op":"set","path":"/root","value":"page"}
{"op":"add","path":"/elements/page","value":{"key":"page","type":"div","props":{"className":"p-6 max-w-4xl mx-auto space-y-8"},"children":["header","posts"]}}
{"op":"add","path":"/elements/header","value":{"key":"header","type":"div","props":{"className":"space-y-2"},"children":["title","desc"]}}
{"op":"add","path":"/elements/title","value":{"key":"title","type":"h1","props":{"className":"text-3xl font-bold tracking-tight", "children": "My Blog"}}}
{"op":"add","path":"/elements/desc","value":{"key":"desc","type":"p","props":{"className":"text-muted-foreground text-lg", "children": "Latest posts from the team"}}}
{"op":"add","path":"/elements/posts","value":{"key":"posts","type":"div","props":{"className":"grid gap-6 sm:grid-cols-2 lg:grid-cols-3"},"children":["post1"]}}
{"op":"add","path":"/elements/post1","value":{"key":"post1","type":"Card","props":{"className":"flex flex-col"},"children":["postHeader","postContent","cardFooter"]}}
{"op":"add","path":"/elements/postHeader","value":{"key":"postHeader","type":"CardHeader","props":{},"children":["postTitle"]}}
{"op":"add","path":"/elements/postTitle","value":{"key":"postTitle","type":"CardTitle","props":{"children":"Post Title"}}}
{"op":"add","path":"/elements/postContent","value":{"key":"postContent","type":"CardContent","props":{"className":"flex-1"},"children":["excerpt"]}}
{"op":"add","path":"/elements/excerpt","value":{"key":"excerpt","type":"p","props":{"className":"text-sm text-muted-foreground", "children": "This is a summary of the post..."}}}
{"op":"add","path":"/elements/cardFooter","value":{"key":"cardFooter","type":"CardFooter","props":{},"children":["readBtn"]}}
{"op":"add","path":"/elements/readBtn","value":{"key":"readBtn","type":"Button","props":{"children":"Read More", "variant":"outline", "className":"w-full"}}}`;

  const result = streamText({
    model: gateway("anthropic/claude-opus-4.5"),
    system: systemPrompt,
    prompt: sanitizedPrompt,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
