import { Box, Grid2x2, PencilRuler, SquarePlus } from "lucide-react";

export const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const siteConfig = {
  name: "Sidekick",
  url: APP_URL,
  ogImage: `${APP_URL}/og.jpg`,
  description:
    "An open-source library of pre-built components and templates for building developer tools.",
  links: {
    twitter: "https://twitter.com/montekkundan",
    github: "https://github.com/montekkundan/sidekick",
  },
  navItems: [
    {
      href: "/docs",
      label: "Docs",
    },
    {
      href: "/blocks",
      label: "Blocks",
    },
    {
      href: "/docs/cookbook",
      label: "Cookbook",
    },
    {
      href: "/examples",
      label: "Examples",
    }
    // {
    //   href: "/builder",
    //   label: "Builder",
    // }
  ],
  widgetNavItems: [
    {
      href: "/builder",
      label: "New Widget",
      icon: SquarePlus,
    },
    {
      href: "/builder/gallery",
      label: "Gallery",
      icon: Grid2x2,
    },
    {
      href: "/builder/components",
      label: "Components",
      icon: Box,
    },
    {
      href: "/builder/icons",
      label: "Icons",
      icon: PencilRuler,
    },
  ],
};

export const TOP_LEVEL_SECTIONS = [
  { name: "Get Started", href: "/docs" },
  {
    name: "Components",
    href: "/docs/components",
  },
  {
    name: "Changelog",
    href: "/docs/changelog",
  },
];

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
