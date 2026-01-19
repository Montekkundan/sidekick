import { config, withAnalyzer } from "@repo/next-config";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import { env } from "./env";

let nextConfig: NextConfig = {
  ...config,
  async rewrites() {
    return [
      {
        source: "/examples/next-navigation",
        destination: `${env.NAVIGATION_APP_URL}/examples/next-navigation`,
      },
      {
        source: "/examples/next-navigation/:path*",
        destination: `${env.NAVIGATION_APP_URL}/examples/next-navigation/:path*`,
      },
      {
        source: "/examples/fuma-mdx",
        destination: `${env.FUMA_MDX_URL}/examples/fuma-mdx`,
      },
      {
        source: "/examples/fuma-mdx/:path*",
        destination: `${env.FUMA_MDX_URL}/examples/fuma-mdx/:path*`,
      },
      {
        source: "/examples/help-page",
        destination: `${env.HELP_PAGE_APP_URL}/examples/help-page`,
      },
      {
        source: "/examples/help-page/:path*",
        destination: `${env.HELP_PAGE_APP_URL}/examples/help-page/:path*`,
      },
      {
        source: "/examples/chatgpt",
        destination: `${env.CHATGPT_APP_URL}/examples/chatgpt`,
      },
      {
        source: "/examples/chatgpt/:path*",
        destination: `${env.CHATGPT_APP_URL}/examples/chatgpt/:path*`,
      },
      {
        source: "/examples/cursor-editor",
        destination: `${env.CURSOR_EDITOR_APP_URL}/examples/cursor-editor`,
      },
      {
        source: "/examples/cursor-editor/:path*",
        destination: `${env.CURSOR_EDITOR_APP_URL}/examples/cursor-editor/:path*`,
      },
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
};

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

const withMDX = createMDX();

export default withMDX(nextConfig);
