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
        {/* {GALLERY_TEMPLATES.map((tpl) => (
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
        ))} */}
      </div>
    </div>
  );
}
