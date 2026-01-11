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
        source: "/examples/mdx",
        destination: `${env.FUMA_MDX_URL}/examples/mdx`,
      },
      {
        source: "/examples/mdx/:path*",
        destination: `${env.FUMA_MDX_URL}/examples/mdx/:path*`,
      },
    ];
  },
};

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

const withMDX = createMDX();

export default withMDX(nextConfig);
