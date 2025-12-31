import { SquarePlus, Grid2x2, Box, PencilRuler } from 'lucide-react';

export const siteConfig = {
  name: "Sidekick",
  url: "https://sidekick.montek.dev",
  ogImage: "https://sidekick.montek.dev/og.jpg",
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
      href: "/widget-builder",
      label: "Widget Builder",
    }
  ],
  widgetNavItems: [
    {
      href: "/widget-builder",
      label: "New Widget",
      icon: SquarePlus,
    },
    {
      href: "/widget-builder/gallery",
      label: "Gallery",
      icon: Grid2x2,
    },
    {
      href: "/widget-builder/components",
      label: "Components",
      icon: Box,
    },
    {
      href: "/widget-builder/icons",
      label: "Icons",
      icon: PencilRuler,
    }
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
