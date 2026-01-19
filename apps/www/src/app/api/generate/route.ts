import { generateCatalogPrompt } from "@json-render/core";
import { dashboardCatalog } from "@repo/design-system/lib/catalog";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { gateway, streamText } from "ai";

export const maxDuration = 30;

const MAX_PROMPT_LENGTH = 140;

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "30s"),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "ip";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Ratelimited!", { status: 429 });
  }

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

RESPONSIVE DESIGN (ALL BREAKPOINTS):
- Design for ALL screen sizes: mobile (default), tablet (md:), desktop (lg:)
- Two-column layouts: className="grid p-0 md:grid-cols-2"
- Grid layouts: className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
- Hide on mobile: className="hidden md:block"
- Responsive padding: className="p-6 md:p-8"
- Responsive text: className="text-2xl md:text-3xl"
- For forms: Use FieldGroup wrapper, Field for each input, FieldLabel and FieldDescription
- Use div with "space-y-4" or FieldGroup for vertical spacing

GRID LISTS & COLLECTIONS (CRITICAL):
- Multiple similar items (Cards, Badges, etc.) SHOULD use a responsive grid.
- Pattern: className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
- This ensures items stack vertically on mobile and arrange horizontally on desktop.

FORM COMPONENTS:
- FieldGroup: Wraps an entire form section with proper spacing
- Field: Individual form field wrapper
- FieldLabel: Label for a field (children prop for text)
- FieldDescription: Helper text below field
- FieldSeparator: Visual separator with optional text (children prop)

EXAMPLE (Responsive Card Grid):
{"op":"set","path":"/root","value":"container"}
{"op":"add","path":"/elements/container","value":{"key":"container","type":"div","props":{"className":"flex flex-col gap-6 p-4 md:p-6"},"children":["title","grid"]}}
{"op":"add","path":"/elements/title","value":{"key":"title","type":"h1","props":{"className":"text-2xl font-bold","children":"Featured Movies"}}}
{"op":"add","path":"/elements/grid","value":{"key":"grid","type":"div","props":{"className":"grid gap-4 md:grid-cols-2 lg:grid-cols-3"},"children":["card1","card2","card3"]}}
{"op":"add","path":"/elements/card1","value":{"key":"card1","type":"Card","props":{},"children":["header1","content1"]}}
{"op":"add","path":"/elements/header1","value":{"key":"header1","type":"CardHeader","props":{},"children":["title1","desc1"]}}
{"op":"add","path":"/elements/title1","value":{"key":"title1","type":"CardTitle","props":{"children":"The Shawshank Redemption"}}}
{"op":"add","path":"/elements/desc1","value":{"key":"desc1","type":"CardDescription","props":{"children":"1994 • Drama"}}}
{"op":"add","path":"/elements/content1","value":{"key":"content1","type":"CardContent","props":{"className":"flex items-center gap-2"},"children":["badge1","ratingText1"]}}
{"op":"add","path":"/elements/badge1","value":{"key":"badge1","type":"Badge","props":{"variant":"default","children":"⭐ 9.3"}}}
{"op":"add","path":"/elements/ratingText1","value":{"key":"ratingText1","type":"span","props":{"className":"text-sm text-muted-foreground","children":"IMDb"}}}
{"op":"add","path":"/elements/card2","value":{"key":"card2","type":"Card","props":{},"children":["header2","content2"]}}
{"op":"add","path":"/elements/card3","value":{"key":"card3","type":"Card","props":{},"children":["header3","content3"]}}`;

  const result = streamText({
    model: gateway("anthropic/claude-opus-4.5"),
    system: systemPrompt,
    prompt: sanitizedPrompt,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
