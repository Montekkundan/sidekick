import type { Metadata } from "next";
import "./styles.css";
import { DesignSystemProvider } from "@repo/design-system";
import { fonts } from "@repo/design-system/lib/fonts";
import { cn } from "@repo/design-system/lib/utils";

export const metadata: Metadata = {
  title: "Sidekick Examples - Fumadocs MDX",
  description:
    "Documentation and examples for using Sidekick with Fumadocs MDX, demonstrating powerful AI-assisted documentation features.",
  openGraph: {
    title: "Sidekick Examples - Fumadocs MDX",
    description:
      "Documentation and examples for using Sidekick with Fumadocs MDX, demonstrating powerful AI-assisted documentation features.",
    url: "https://sidekick.montek.dev/examples/mdx",
    siteName: "Sidekick Examples",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Sidekick Examples - Fumadocs MDX",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sidekick Examples - Fumadocs MDX",
    description:
      "Documentation and examples for using Sidekick with Fumadocs MDX, demonstrating powerful AI-assisted documentation features.",
    creator: "@montekkundan",
    images: ["/api/og"],
  },
};

import { RootProvider } from "fumadocs-ui/provider/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(fonts, "scroll-smooth")}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <RootProvider
          search={{
            options: {
              api: "/examples/mdx/api/search",
            },
          }}
        >
          <DesignSystemProvider>{children}</DesignSystemProvider>
        </RootProvider>
      </body>
    </html>
  );
}
