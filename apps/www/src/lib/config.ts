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
    twitter: "https://x.com/montekkundan",
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
      href: "/docs/builder/widget-builder",
      label: "Builder",
    },
    {
      href: "/docs/cookbook",
      label: "Cookbook",
    },
    {
      href: "/examples",
      label: "Examples",
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
