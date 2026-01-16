"use client";

import type { UITree } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { toast } from "sonner";

import { builderRegistry } from "@/app/(builder)/lib/json-render/registry";

const actionHandlers = {
  navigate: (params: Record<string, unknown>) => {
    const url = params.url;
    if (typeof url === "string") {
      window.location.href = url;
    }
  },
  toast: (params: Record<string, unknown>) => {
    const title = typeof params.title === "string" ? params.title : undefined;
    const description =
      typeof params.description === "string" ? params.description : undefined;
    const variant =
      typeof params.variant === "string" ? params.variant : "default";

    if (variant === "error") {
      toast.error(title ?? "Error", { description });
      return;
    }

    if (variant === "success") {
      toast.success(title ?? "Success", { description });
      return;
    }

    toast(title ?? "Notice", { description });
  },
};

export function BuilderPreview({
  tree,
  data,
}: {
  tree: UITree;
  data: Record<string, unknown>;
}) {
  return (
    <JSONUIProvider
      actionHandlers={actionHandlers}
      authState={{ isSignedIn: true }}
      initialData={data}
      registry={builderRegistry}
    >
      <Renderer registry={builderRegistry} tree={tree} />
    </JSONUIProvider>
  );
}
