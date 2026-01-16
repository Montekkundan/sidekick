import type { Metadata } from "next";
import "./styles.css";
import { DesignSystemProvider } from "@repo/design-system";
import { fonts } from "@repo/design-system/lib/fonts";
import { cn } from "@repo/design-system/lib/utils";

export const metadata: Metadata = {
  title: "Help Page — Help Center UI",
  description: "Visual help center demo with a Sidekick chatbot.",
  openGraph: {
    title: "Help Page — Help Center UI",
    description: "Visual help center demo with a Sidekick chatbot.",
    url: "https://sidekick.montek.dev/examples/help-page",
    siteName: "Help Page",
    images: [
      {
        url: "/examples/help-page/help-page.jpeg",
        width: 1200,
        height: 630,
        alt: "Help Page — Help Center UI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Page — Help Center UI",
    description: "Visual help center demo with a Sidekick chatbot.",
    creator: "@montekkundan",
    images: ["/examples/help-page/help-page.jpeg"],
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
