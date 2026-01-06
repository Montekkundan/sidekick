"use client";

import { Book } from "@/components/book";

export function CookbookBooksItems() {
  return (
    <>
      <Book
        color="#9D2127"
        textColor="#ece4db"
        textured
        title="Design Engineering at Vercel"
        variant="simple"
      />
      <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
      <Book
        color="#7DC1C1"
        textColor="white"
        textured
        title="Design Engineering at Vercel"
        variant="simple"
      />
      <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
      <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
    </>
  );
}
