"use client";

import { CookbookBooksItems } from "@/components/cookbook-books-items";
import { cn } from "@repo/design-system/lib/utils";;

type CookbookBooksGridProps = {
  className?: string;
};

export function CookbookBooksGrid({ className }: CookbookBooksGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 items-start justify-items-center sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      <CookbookBooksItems />
    </div>
  );
}
