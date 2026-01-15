import type { Metadata } from "next";
import "./styles.css";
import { DesignSystemProvider } from "@repo/design-system";
import { fonts } from "@repo/design-system/lib/fonts";
import { cn } from "@repo/design-system/lib/utils";

export const metadata: Metadata = {
  title: "ChatGPT Home — UI example",
  description: "ChatGPT-like landing UI built with design-system components.",
  openGraph: {
    title: "ChatGPT Home — UI example",
    description: "ChatGPT-like landing UI built with design-system components.",
    url: "https://sidekick.montek.dev/examples/chatgpt",
    siteName: "ChatGPT Home",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "ChatGPT Home — UI example",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatGPT Home — UI example",
    description: "ChatGPT-like landing UI built with design-system components.",
    creator: "@montekkundan",
    images: ["/api/og"],
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
      <body className="min-h-svh bg-background text-foreground">
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </body>
    </html>
  );
}
