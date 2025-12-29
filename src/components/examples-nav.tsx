"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area";

const examples = [
  {
    name: "Prompt Input",
    href: "/examples/prompt-input",
    code: "https://github.com/shadcn/ui/tree/main/apps/v4/app/(app)/examples/prompt-input",
    hidden: false,
  },
  {
    name: "Sidekick",
    href: "/examples/sidekick",
    code: "https://github.com/shadcn/ui/tree/main/apps/v4/app/(app)/examples/sidekick",
    hidden: false,
  },
];

export function ExamplesNav({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const pathname = usePathname();

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <ScrollArea className="max-w-[96%] md:max-w-[600px] lg:max-w-none">
        <div className="flex items-center">
          <ExampleLink
            example={{ name: "Examples", href: "/", code: "", hidden: false }}
            isActive={pathname === "/"}
          />
          {examples.map((example) => (
            <ExampleLink
              example={example}
              isActive={pathname?.startsWith(example.href) ?? false}
              key={example.href}
            />
          ))}
        </div>
        <ScrollBar className="invisible" orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function ExampleLink({
  example,
  isActive,
}: {
  example: (typeof examples)[number];
  isActive: boolean;
}) {
  if (example.hidden) {
    return null;
  }

  return (
    <Link
      className="flex h-7 items-center justify-center px-4 text-center font-medium text-base text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-primary"
      data-active={isActive}
      href={example.href}
      key={example.href}
    >
      {example.name}
    </Link>
  );
}
