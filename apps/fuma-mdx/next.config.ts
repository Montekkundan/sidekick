import { config, withAnalyzer } from "@repo/next-config";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import { env } from "./env";

let nextConfig: NextConfig = {
  ...config,
  basePath: "/examples/fuma-mdx",
  transpilePackages: ["@repo/design-system"],
};

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

const withMDX = createMDX({
  // customise the config file path
  // configPath: "source.config.ts"
});
export default withMDX(nextConfig);
