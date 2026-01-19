import { generateCatalogPrompt } from "@json-render/core";
import { dashboardCatalog } from "@repo/design-system/lib/catalog";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { gateway, streamText } from "ai";
import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const MAX_PROMPT_LENGTH = 140;

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "30s"),
});

export async function POST(req: Request) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json(
      { error: "Bot detected. Access denied." },
      { status: 403 }
    );
  }

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

RESPONSIVE DESIGN & WIDTH (CRITICAL):
- Design for ALL screen sizes: mobile (default), tablet (md:), desktop (lg:)
- PREFER EXPANSIVE LAYOUTS: Do NOT use small restrictive widths like "max-w-md" or "max-w-2xl" on main containers.
- Root elements MUST use "w-full" or "max-w-6xl mx-auto" to occupy the desktop screen properly. Components should breathe!
- Use grid with 2 or 3 columns on desktop for better space utilization.
- Grid layouts: className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
- Two-column layouts: className="grid gap-6 md:grid-cols-2"
- Responsive padding: className="p-6 md:p-8 lg:p-12"
- Responsive text: className="text-2xl md:text-3xl lg:text-4xl"
- For forms: Use FieldGroup wrapper, Field for each input, FieldLabel and FieldDescription
- Use div with "space-y-6" or FieldGroup for vertical spacing

COMPONENT HIERARCHY & CHILDREN:
- TEXT-ONLY (use "children" prop): Button, Badge, Label, CardTitle, CardDescription, AlertTitle, AlertDescription, TableHead, TableCell.
- NESTED ELEMENTS (use "children" array of keys): div, Card, CardHeader, CardContent, CardFooter, Table, TableHeader, TableBody, TableRow, Tooltip, TooltipTrigger, TooltipContent, Accordion, AccordionItem, AccordionContent, Tabs, TabsList, TabsTrigger, TabsContent, SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem.
- CRITICAL: Every element (except /root) MUST be listed in exactly one parent's "children" array. Do NOT generate disconnected elements.

INVALID NESTING (FORBIDDEN):
- NO Button inside ANY Trigger (TooltipTrigger, AccordionTrigger, SelectTrigger, SheetTrigger, etc.).
- Triggers are interactive elements themselves. Use icons or text directly inside them.
- Sidebar components MUST be wrapped in a SidebarProvider.

TOOLTIPS & TRIGGERS:
- Tooltips are self-contained. Use Tooltip, TooltipTrigger, and TooltipContent directly.
- TRIGGERS (TooltipTrigger, AccordionTrigger, TabsTrigger, DialogTrigger, SheetTrigger, PopoverTrigger, etc.) MUST NOT contain Buttons.
- Instead of <TooltipTrigger><Button>Text</Button></TooltipTrigger>, use <TooltipTrigger>Text</TooltipTrigger> or <TooltipTrigger><span className="...">Text</span></TooltipTrigger>.

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

EXAMPLE (Table inside Card):
{"op":"set","path":"/root","value":"container"}
{"op":"add","path":"/elements/container","value":{"key":"container","type":"div","props":{"className":"p-6 md:p-8"},"children":["mainCard"]}}
{"op":"add","path":"/elements/mainCard","value":{"key":"mainCard","type":"Card","props":{},"children":["cardHeader","cardContent"]}}
{"op":"add","path":"/elements/cardHeader","value":{"key":"cardHeader","type":"CardHeader","props":{},"children":["cardTitle","cardDesc"]}}
{"op":"add","path":"/elements/cardTitle","value":{"key":"cardTitle","type":"CardTitle","props":{"children":"Inventory"}}}
{"op":"add","path":"/elements/cardDesc","value":{"key":"cardDesc","type":"CardDescription","props":{"children":"Manage your products."}}}
{"op":"add","path":"/elements/cardContent","value":{"key":"cardContent","type":"CardContent","props":{},"children":["inventoryTable"]}}
{"op":"add","path":"/elements/inventoryTable","value":{"key":"inventoryTable","type":"Table","props":{},"children":["tableHeader","tableBody"]}}
{"op":"add","path":"/elements/tableHeader","value":{"key":"tableHeader","type":"TableHeader","props":{},"children":["headerRow"]}}
{"op":"add","path":"/elements/headerRow","value":{"key":"headerRow","type":"TableRow","props":{},"children":["th1","th2"]}}
{"op":"add","path":"/elements/th1","value":{"key":"th1","type":"TableHead","props":{"children":"Product"}}}
{"op":"add","path":"/elements/th2","value":{"key":"th2","type":"TableHead","props":{"children":"Stock"}}}
{"op":"add","path":"/elements/tableBody","value":{"key":"tableBody","type":"TableBody","props":{},"children":["row1"]}}
{"op":"add","path":"/elements/row1","value":{"key":"row1","type":"TableRow","props":{},"children":["cell1","cell2"]}}
{"op":"add","path":"/elements/cell1","value":{"key":"cell1","type":"TableCell","props":{"children":"Widget A"}}}
{"op":"add","path":"/elements/cell2","value":{"key":"cell2","type":"TableCell","props":{"children":"10 Units"}}}
`;

  const result = streamText({
    model: gateway("anthropic/claude-opus-4.5"),
    system: systemPrompt,
    prompt: sanitizedPrompt,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
