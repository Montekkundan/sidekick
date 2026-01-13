"use client";

import Link from "next/link";
import { Book } from "@/components/book";

const cookbookItems = [
  // {
  //   title: "Netflix Search Page",
  //   href: "/docs/cookbook/netflix",
  //   color: "#9D2127",
  //   textColor: "#F6EEE7",
  //   textured: true,
  //   variant: "simple" as const,
  // },
  {
    title: "ChatGPT Home Page",
    href: "/docs/cookbook/chatgpt-home",
    color: "#0F2E2E",
    textColor: "#E8F2F0",
    textured: true,
  },
  {
    title: "Cursor Editor Page",
    href: "/docs/cookbook/cursor-editor",
    color: "#1B1F2A",
    textColor: "#E6ECF5",
    textured: true,
    variant: "simple" as const,
  },
  {
    title: "Help Center Page",
    href: "/docs/cookbook/help-center",
    color: "#3C2B14",
    textColor: "#FFF2D6",
    textured: true,
  },
  {
    title: "Fumadocs + MDX",
    href: "/docs/cookbook/fuma-docs-mdx",
    color: "#17315C",
    textColor: "#EEF4FF",
    textured: true,
    variant: "simple" as const,
  },
  // {
  //   title: "Fumadocs + Basehub",
  //   href: "/docs/cookbook/fuma-docs-basehub",
  //   color: "#2A1B3D",
  //   textColor: "#F1E9FF",
  //   textured: true,
  // },
];

export function CookbookBooksItems() {
  return (
    <>
      {cookbookItems.map((item) => (
        <Link
          className="group flex self-start"
          href={item.href}
          key={item.href}
        >
          <Book
            color={item.color}
            textColor={item.textColor}
            textured={item.textured}
            title={item.title}
            variant={item.variant}
          />
        </Link>
      ))}
    </>
  );
}
