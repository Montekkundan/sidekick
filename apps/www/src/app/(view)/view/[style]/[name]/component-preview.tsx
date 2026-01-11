import { cn } from "@repo/design-system/lib/utils";

export function ComponentPreview({ children }: { children: React.ReactNode }) {
  return <div className={cn("bg-background")}>{children}</div>;
}
