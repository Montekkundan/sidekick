import type { Metadata } from "next";
import "./styles.css";
import { DesignSystemProvider } from "@repo/design-system";
import { fonts } from "@repo/design-system/lib/fonts";
import { cn } from "@repo/design-system/lib/utils";

export const metadata: Metadata = {
  title: "Cursor Editor — Sidekick UI example",
  description:
    "Cursor-like editor UI showcasing Sidekick + PromptInput components.",
  openGraph: {
    title: "Cursor Editor — Sidekick UI example",
    description:
      "Cursor-like editor UI showcasing Sidekick + PromptInput components.",
    url: "https://sidekick.montek.dev/examples/cursor-editor",
    siteName: "Cursor Editor",
    images: [
      {
        url: "/examples/cursor-editor/cursor-editor.jpeg",
        width: 1200,
        height: 630,
        alt: "Cursor Editor — Sidekick UI example",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursor Editor — Sidekick UI example",
    description:
      "Cursor-like editor UI showcasing Sidekick + PromptInput components.",
    creator: "@montekkundan",
    images: ["/examples/cursor-editor/cursor-editor.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(fonts, "dark scroll-smooth")}
      lang="en"
      suppressHydrationWarning
    >
      <body className="h-svh overflow-hidden bg-background text-foreground">
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </body>
    </html>
  );
}
