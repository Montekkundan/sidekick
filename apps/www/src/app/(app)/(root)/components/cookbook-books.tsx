"use client";

import { CookbookBooksItems } from "@/components/cookbook-books-items";

export function CookbookBooks() {
  return (
    <div className="flex justify-center items-start gap-8 mt-16 flex-wrap">
      <CookbookBooksItems />
    </div>
  );
}
