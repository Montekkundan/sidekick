"use client";

import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import {
  demoRegistry,
  fallbackComponent,
} from "@repo/design-system/components/builder/index";
import { CodeBlock } from "@repo/design-system/components/code-block";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";

interface GalleryTemplate {
  id: string;
  tree: UITree;
}

function getTemplateTsx(tree: UITree) {
  return `import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import {
  demoRegistry,
  fallbackComponent,
} from "@repo/design-system/components/builder/index";

export const tree: UITree = ${JSON.stringify(tree, null, 2)};

export function Widget() {
  return (
    <JSONUIProvider
      registry={demoRegistry as Parameters<typeof JSONUIProvider>[0]["registry"]}
    >
      <Renderer
        tree={tree}
        registry={demoRegistry as Parameters<typeof Renderer>[0]["registry"]}
        fallback={fallbackComponent as Parameters<typeof Renderer>[0]["fallback"]}
      />
    </JSONUIProvider>
  );
}
`;
}

const GALLERY_TEMPLATES: readonly GalleryTemplate[] = [
  {
    id: "email-composer",
    tree: {
      root: "emailCard",
      elements: {
        emailCard: {
          key: "emailCard",
          type: "Card",
          props: {
            title: "New Message",
            description: "Draft • autosaved",
            maxWidth: "md",
          },
          children: [
            "headerRow",
            "divider1",
            "toRow",
            "ccRow",
            "subjectRow",
            "divider2",
            "body",
            "divider3",
            "actionsRow",
          ],
        },

        headerRow: {
          key: "headerRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["fromBadge", "priorityBadge"],
        },
        fromBadge: {
          key: "fromBadge",
          type: "Badge",
          props: { text: "From: me@acme.co" },
        },
        priorityBadge: {
          key: "priorityBadge",
          type: "Badge",
          props: { text: "Normal" },
        },

        divider1: { key: "divider1", type: "Divider", props: {} },

        toRow: {
          key: "toRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["toLabel", "toChips"],
        },
        toLabel: {
          key: "toLabel",
          type: "Text",
          props: { content: "To", variant: "muted" },
        },
        toChips: {
          key: "toChips",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["toChip1", "toChip2"],
        },
        toChip1: { key: "toChip1", type: "Badge", props: { text: "Ava" } },
        toChip2: {
          key: "toChip2",
          type: "Badge",
          props: { text: "Design Team" },
        },

        ccRow: {
          key: "ccRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["ccLabel", "ccInput"],
        },
        ccLabel: {
          key: "ccLabel",
          type: "Text",
          props: { content: "Cc", variant: "muted" },
        },
        ccInput: {
          key: "ccInput",
          type: "Input",
          props: { label: "", name: "cc", placeholder: "Optional" },
        },

        subjectRow: {
          key: "subjectRow",
          type: "Input",
          props: {
            label: "Subject",
            name: "subject",
            placeholder: "Quick sync tomorrow?",
          },
        },

        divider2: { key: "divider2", type: "Divider", props: {} },

        body: {
          key: "body",
          type: "Textarea",
          props: {
            label: "Message",
            name: "message",
            rows: 4,
            placeholder: "Write something kind and clear…",
          },
        },

        divider3: { key: "divider3", type: "Divider", props: {} },

        actionsRow: {
          key: "actionsRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["discardBtn", "sendBtn"],
        },
        discardBtn: {
          key: "discardBtn",
          type: "Button",
          props: {
            label: "Discard",
            variant: "danger",
            actionText: "Draft discarded",
          },
        },
        sendBtn: {
          key: "sendBtn",
          type: "Button",
          props: { label: "Send", variant: "primary", actionText: "Sent!" },
        },
      },
    },
  },

  {
    id: "weather-now",
    tree: {
      root: "weatherCard",
      elements: {
        weatherCard: {
          key: "weatherCard",
          type: "Card",
          props: { title: "Weather", description: "Downtown • updated 3m ago" },
          children: [
            "topRow",
            "divider1",
            "forecastTitle",
            "forecastStack",
            "divider2",
            "footerRow",
          ],
        },

        topRow: {
          key: "topRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "md" },
          children: ["leftTop", "rightTop"],
        },
        leftTop: {
          key: "leftTop",
          type: "Stack",
          props: { direction: "vertical", gap: "sm" },
          children: ["tempHeading", "conditionText", "feelsRow"],
        },
        tempHeading: {
          key: "tempHeading",
          type: "Heading",
          props: { text: "72°" },
        },
        conditionText: {
          key: "conditionText",
          type: "Text",
          props: { content: "Partly cloudy with a warm breeze" },
        },
        feelsRow: {
          key: "feelsRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["feelsBadge", "windBadge"],
        },
        feelsBadge: {
          key: "feelsBadge",
          type: "Badge",
          props: { text: "Feels like 74°" },
        },
        windBadge: {
          key: "windBadge",
          type: "Badge",
          props: { text: "Wind: 9 mph" },
        },

        rightTop: {
          key: "rightTop",
          type: "Stack",
          props: { direction: "vertical", gap: "sm" },
          children: ["weatherImg", "rainProgress"],
        },
        weatherImg: {
          key: "weatherImg",
          type: "Image",
          props: { alt: "Cloud + sun", width: 110, height: 80 },
        },
        rainProgress: {
          key: "rainProgress",
          type: "Progress",
          props: { value: 18, label: "Rain chance" },
        },

        divider1: { key: "divider1", type: "Divider", props: {} },

        forecastTitle: {
          key: "forecastTitle",
          type: "Text",
          props: { content: "Next 12 hours", variant: "muted" },
        },
        forecastStack: {
          key: "forecastStack",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["slot1", "slot2", "slot3"],
        },
        slot1: {
          key: "slot1",
          type: "Card",
          props: { title: "Now", maxWidth: "sm" },
          children: ["s1a"],
        },
        s1a: { key: "s1a", type: "Text", props: { content: "72° • Clouds" } },
        slot2: {
          key: "slot2",
          type: "Card",
          props: { title: "3 PM", maxWidth: "sm" },
          children: ["s2a"],
        },
        s2a: { key: "s2a", type: "Text", props: { content: "75° • Sun" } },
        slot3: {
          key: "slot3",
          type: "Card",
          props: { title: "6 PM", maxWidth: "sm" },
          children: ["s3a"],
        },
        s3a: { key: "s3a", type: "Text", props: { content: "73° • Cloud" } },

        divider2: { key: "divider2", type: "Divider", props: {} },

        footerRow: {
          key: "footerRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["aqiBadge", "detailsBtn"],
        },
        aqiBadge: {
          key: "aqiBadge",
          type: "Badge",
          props: { text: "AQI: 42 (Good)" },
        },
        detailsBtn: {
          key: "detailsBtn",
          type: "Button",
          props: { label: "Details", variant: "secondary" },
        },
      },
    },
  },

  {
    id: "event-invite",
    tree: {
      root: "eventCard",
      elements: {
        eventCard: {
          key: "eventCard",
          type: "Card",
          props: {
            title: "Design Review",
            description: "Thu • 2:00–2:45 PM",
            maxWidth: "md",
          },
          children: [
            "metaRow",
            "divider1",
            "agendaTitle",
            "agendaStack",
            "divider2",
            "rsvpRow",
          ],
        },
        metaRow: {
          key: "metaRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["hostAvatar", "hostName", "statusBadge"],
        },
        hostAvatar: {
          key: "hostAvatar",
          type: "Avatar",
          props: { name: "Mina Park", size: "md" },
        },
        hostName: {
          key: "hostName",
          type: "Text",
          props: { content: "Mina Park", variant: "muted" },
        },
        statusBadge: {
          key: "statusBadge",
          type: "Badge",
          props: { text: "Invite" },
        },
        divider1: { key: "divider1", type: "Divider", props: {} },
        agendaTitle: {
          key: "agendaTitle",
          type: "Text",
          props: { content: "Agenda", variant: "muted" },
        },
        agendaStack: {
          key: "agendaStack",
          type: "Stack",
          props: { direction: "vertical", gap: "sm" },
          children: ["agenda1", "agenda2"],
        },
        agenda1: {
          key: "agenda1",
          type: "Card",
          props: { title: "Overview", maxWidth: "full" },
          children: ["a1t"],
        },
        a1t: {
          key: "a1t",
          type: "Text",
          props: { content: "Onboarding flow & constraints" },
        },
        agenda2: {
          key: "agenda2",
          type: "Card",
          props: { title: "Decision", maxWidth: "full" },
          children: ["a2t"],
        },
        a2t: {
          key: "a2t",
          type: "Text",
          props: { content: "Pick final layout + ship plan" },
        },
        divider2: { key: "divider2", type: "Divider", props: {} },
        rsvpRow: {
          key: "rsvpRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["noBtn", "maybeBtn", "yesBtn"],
        },
        noBtn: {
          key: "noBtn",
          type: "Button",
          props: { label: "No", variant: "secondary" },
        },
        maybeBtn: {
          key: "maybeBtn",
          type: "Button",
          props: { label: "Maybe", variant: "secondary" },
        },
        yesBtn: {
          key: "yesBtn",
          type: "Button",
          props: { label: "Yes", variant: "primary" },
        },
      },
    },
  },

  {
    id: "checkout-summary",
    tree: {
      root: "checkoutCard",
      elements: {
        checkoutCard: {
          key: "checkoutCard",
          type: "Card",
          props: {
            title: "Checkout",
            description: "Secure payment",
            maxWidth: "md",
          },
          children: [
            "itemRow",
            "divider1",
            "totalsStack",
            "divider2",
            "payBtn",
          ],
        },
        itemRow: {
          key: "itemRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["itemImg", "itemInfo"],
        },
        itemImg: {
          key: "itemImg",
          type: "Image",
          props: { alt: "Desk Lamp", width: 90, height: 70 },
        },
        itemInfo: {
          key: "itemInfo",
          type: "Stack",
          props: { direction: "vertical", gap: "sm" },
          children: ["itemTitle", "qtyBadge"],
        },
        itemTitle: {
          key: "itemTitle",
          type: "Heading",
          props: { text: "Minimal Desk Lamp" },
        },
        qtyBadge: { key: "qtyBadge", type: "Badge", props: { text: "Qty 1" } },
        divider1: { key: "divider1", type: "Divider", props: {} },
        totalsStack: {
          key: "totalsStack",
          type: "Stack",
          props: { direction: "vertical", gap: "sm" },
          children: ["subtotal", "tax", "total"],
        },
        subtotal: {
          key: "subtotal",
          type: "Text",
          props: { content: "Subtotal: $89.00", variant: "muted" },
        },
        tax: {
          key: "tax",
          type: "Text",
          props: { content: "Tax: $7.21", variant: "muted" },
        },
        total: { key: "total", type: "Heading", props: { text: "$102.21" } },
        divider2: { key: "divider2", type: "Divider", props: {} },
        payBtn: {
          key: "payBtn",
          type: "Button",
          props: { label: "Pay $102.21", variant: "primary" },
        },
      },
    },
  },

  {
    id: "chat-update",
    tree: {
      root: "chatCard",
      elements: {
        chatCard: {
          key: "chatCard",
          type: "Card",
          props: {
            title: "Messages",
            description: "2 new updates",
            maxWidth: "md",
          },
          children: ["topRow", "divider1", "thread", "divider2", "composerRow"],
        },
        topRow: {
          key: "topRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["inboxBadge", "unreadBadge"],
        },
        inboxBadge: {
          key: "inboxBadge",
          type: "Badge",
          props: { text: "Inbox" },
        },
        unreadBadge: {
          key: "unreadBadge",
          type: "Badge",
          props: { text: "Unread: 2" },
        },
        divider1: { key: "divider1", type: "Divider", props: {} },
        thread: {
          key: "thread",
          type: "Card",
          props: { title: "Release Room", maxWidth: "full" },
          children: ["msg", "progress"],
        },
        msg: {
          key: "msg",
          type: "Text",
          props: {
            content:
              "Seeing a crash on checkout if card is expired. Repro steps attached.",
          },
        },
        progress: {
          key: "progress",
          type: "Progress",
          props: { value: 62, label: "Fix progress" },
        },
        divider2: { key: "divider2", type: "Divider", props: {} },
        composerRow: {
          key: "composerRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["quickReply", "sendBtn"],
        },
        quickReply: {
          key: "quickReply",
          type: "Input",
          props: { label: "", name: "reply", placeholder: "Quick reply…" },
        },
        sendBtn: {
          key: "sendBtn",
          type: "Button",
          props: { label: "Send", variant: "primary" },
        },
      },
    },
  },

  {
    id: "now-playing",
    tree: {
      root: "musicCard",
      elements: {
        musicCard: {
          key: "musicCard",
          type: "Card",
          props: {
            title: "Now Playing",
            description: "Studio Mix",
            maxWidth: "md",
          },
          children: ["topRow", "divider1", "progress", "divider2", "controls"],
        },
        topRow: {
          key: "topRow",
          type: "Stack",
          props: { direction: "horizontal", gap: "md" },
          children: ["cover", "trackInfo"],
        },
        cover: {
          key: "cover",
          type: "Image",
          props: { alt: "Album cover", width: 120, height: 90 },
        },
        trackInfo: {
          key: "trackInfo",
          type: "Stack",
          props: { direction: "vertical", gap: "sm" },
          children: ["trackTitle", "artistText", "rating"],
        },
        trackTitle: {
          key: "trackTitle",
          type: "Heading",
          props: { text: "Midnight Signals" },
        },
        artistText: {
          key: "artistText",
          type: "Text",
          props: { content: "Haven District • 3:28", variant: "muted" },
        },
        rating: {
          key: "rating",
          type: "Rating",
          props: { value: 4, max: 5, label: "Your rating" },
        },
        divider1: { key: "divider1", type: "Divider", props: {} },
        progress: {
          key: "progress",
          type: "Progress",
          props: { value: 41, label: "1:25 / 3:28" },
        },
        divider2: { key: "divider2", type: "Divider", props: {} },
        controls: {
          key: "controls",
          type: "Stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["prev", "play", "next"],
        },
        prev: {
          key: "prev",
          type: "Button",
          props: { label: "Prev", variant: "secondary" },
        },
        play: {
          key: "play",
          type: "Button",
          props: { label: "Play", variant: "primary" },
        },
        next: {
          key: "next",
          type: "Button",
          props: { label: "Next", variant: "secondary" },
        },
      },
    },
  },
];

export default function GalleryPage() {
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-semibold text-lg">Gallery</h1>
        <p className="text-muted-foreground text-sm">
          Pick a template to preview its UI tree and code.
        </p>
      </div>

      <div className="columns-[320px] gap-x-5 space-y-5">
        {GALLERY_TEMPLATES.map((tpl) => (
          <Dialog
            key={tpl.id}
            onOpenChange={(open) => {
              setActiveTemplateId(open ? tpl.id : null);
            }}
            open={activeTemplateId === tpl.id}
          >
            <DialogTrigger asChild>
              <button className="w-full text-left" type="button">
                <JSONUIProvider
                  registry={
                    demoRegistry as Parameters<
                      typeof JSONUIProvider
                    >[0]["registry"]
                  }
                >
                  <Renderer
                    fallback={
                      fallbackComponent as Parameters<
                        typeof Renderer
                      >[0]["fallback"]
                    }
                    registry={
                      demoRegistry as Parameters<typeof Renderer>[0]["registry"]
                    }
                    tree={tpl.tree}
                  />
                </JSONUIProvider>
              </button>
            </DialogTrigger>

            <DialogContent className="h-[80vh] max-w-5xl p-0">
              <Tabs className="flex h-full flex-col p-6" defaultValue="render">
                <TabsList>
                  <TabsTrigger value="render">render</TabsTrigger>
                  <TabsTrigger value="json">json</TabsTrigger>
                  <TabsTrigger value="code">code</TabsTrigger>
                </TabsList>

                <TabsContent className="mt-4 flex-1" value="render">
                  <div className="h-full overflow-auto rounded-lg border border-border bg-background p-6">
                    <div className="flex min-h-full items-center justify-center">
                      <JSONUIProvider
                        registry={
                          demoRegistry as Parameters<
                            typeof JSONUIProvider
                          >[0]["registry"]
                        }
                      >
                        <Renderer
                          fallback={
                            fallbackComponent as Parameters<
                              typeof Renderer
                            >[0]["fallback"]
                          }
                          registry={
                            demoRegistry as Parameters<
                              typeof Renderer
                            >[0]["registry"]
                          }
                          tree={tpl.tree}
                        />
                      </JSONUIProvider>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent className="mt-4 flex-1" value="json">
                  <div className="h-full overflow-auto rounded-lg border border-border bg-background p-4">
                    <CodeBlock
                      code={JSON.stringify(tpl.tree, null, 2)}
                      lang="json"
                    />
                  </div>
                </TabsContent>

                <TabsContent className="mt-4 flex-1" value="code">
                  <div className="h-full overflow-auto rounded-lg border border-border bg-background p-4">
                    <CodeBlock code={getTemplateTsx(tpl.tree)} lang="tsx" />
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
