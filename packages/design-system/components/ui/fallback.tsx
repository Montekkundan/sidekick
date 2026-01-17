"use client";

import type { ComponentRenderProps } from "@repo/design-system/lib/types";
import { baseClass, getCustomClass } from "@repo/design-system/lib/registry_utils";

export function Fallback({ element }: ComponentRenderProps) {
  const customClass = getCustomClass(element.props);
  return (
    <div
      className={`text-[10px] text-muted-foreground ${baseClass} ${customClass}`}
    >
      [{element.type}]
    </div>
  );
}
