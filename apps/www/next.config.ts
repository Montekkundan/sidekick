import { config, withAnalyzer } from "@repo/next-config";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import { env } from "./env";

let nextConfig: NextConfig = {
  ...config,
  async rewrites() {
    return [
      {
        source: "/examples",
        destination: `${env.NAVIGATION_APP_URL}/examples`,
      },
      {
        source: "/examples/:path*",
        destination: `${env.NAVIGATION_APP_URL}/examples/:path*`,
      },
    ];
  },
};

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

const withMDX = createMDX();

export default withMDX(nextConfig);
