import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

// add your configs here.
export const config: NextConfig = {};

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer()(sourceConfig);
