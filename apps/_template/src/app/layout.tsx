import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles.css";
import { DesignSystemProvider } from "@repo/design-system";
import { fonts } from "@repo/design-system/lib/fonts";
import { cn } from "@repo/design-system/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "shadturbo — Turborepo starter with shadcn/ui",
  description: "Minimal starter repo that includes a Next.js app and a shadcn design system.",
  openGraph: {
    title: "shadturbo — Turborepo starter with shadcn/ui",
    description: "Minimal starter repo that includes a Next.js app and a shadcn design system.",
    url: "https://shadturbo.vercel.app",
    siteName: "shadturbo",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "shadturbo — Turborepo starter with shadcn/ui",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "shadturbo — Turborepo starter with shadcn/ui",
    description: "Minimal starter repo that includes a Next.js app and a shadcn design system.",
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
      className={cn(fonts, "scroll-smooth")}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </body>
    </html>
  );
}
