import * as fs from "node:fs";
import * as path from "node:path";
import type { Route, NavigationSchema, SchemaGeneratorOptions } from "../types";

/**
 * Default patterns to exclude from Next.js route generation
 */
const DEFAULT_EXCLUDE = [
  "api/**", // API routes
  "_*/**", // Private folders
  "**/components/**", // Component folders
  "**/hooks/**", // Hook folders
  "**/lib/**", // Library folders
  "**/utils/**", // Utility folders
  "**/*.test.*", // Test files
  "**/*.spec.*", // Spec files
  "**/layout.*", // Layout files
  "**/loading.*", // Loading files
  "**/error.*", // Error files
  "**/not-found.*", // Not found files
  "**/template.*", // Template files
  "**/default.*", // Default files
];

/**
 * Parses Next.js route segments
 */
const parseSegment = (
  segment: string
): { name: string; type: "static" | "dynamic" | "catch-all" | "optional-catch-all" | "group" } => {
  // Route groups (parentheses)
  if (segment.startsWith("(") && segment.endsWith(")")) {
    return { name: segment.slice(1, -1), type: "group" };
  }

  // Optional catch-all [[...slug]]
  if (segment.startsWith("[[...") && segment.endsWith("]]")) {
    return { name: segment.slice(5, -2), type: "optional-catch-all" };
  }

  // Catch-all [...slug]
  if (segment.startsWith("[...") && segment.endsWith("]")) {
    return { name: segment.slice(4, -1), type: "catch-all" };
  }

  // Dynamic [slug]
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return { name: segment.slice(1, -1), type: "dynamic" };
  }

  return { name: segment, type: "static" };
};

/**
 * Converts a file path to a route path
 */
const filePathToRoutePath = (filePath: string, rootDir: string): string => {
  // Remove root directory
  let routePath = filePath.replace(rootDir, "");

  // Remove file extension and page suffix
  routePath = routePath
    .replace(/\/page\.(tsx?|jsx?|mdx?)$/, "")
    .replace(/\.(tsx?|jsx?|mdx?)$/, "");

  // Parse segments
  const segments = routePath.split("/").filter(Boolean);
  const pathParts: string[] = [];

  for (const segment of segments) {
    const parsed = parseSegment(segment);

    switch (parsed.type) {
      case "group":
        // Route groups don't appear in the URL
        break;
      case "dynamic":
        pathParts.push(`:${parsed.name}`);
        break;
      case "catch-all":
        pathParts.push(`:${parsed.name}*`);
        break;
      case "optional-catch-all":
        pathParts.push(`:${parsed.name}?*`);
        break;
      default:
        pathParts.push(parsed.name);
    }
  }

  return "/" + pathParts.join("/") || "/";
};

/**
 * Converts a route path to a human-readable name
 */
const routePathToName = (routePath: string): string => {
  if (routePath === "/") return "Home";

  const lastSegment = routePath.split("/").filter(Boolean).pop() ?? "";

  // Remove dynamic markers
  const cleanName = lastSegment
    .replace(/^:/, "")
    .replace(/\*$/, "")
    .replace(/\?$/, "");

  // Convert to title case
  return cleanName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Checks if a file is a page file
 */
const isPageFile = (fileName: string): boolean => {
  return /^page\.(tsx?|jsx?|mdx?)$/.test(fileName);
};

/**
 * Simple glob matching
 */
const matchPattern = (pattern: string, filePath: string): boolean => {
  const regexPattern = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "<<<DOUBLE_STAR>>>")
    .replace(/\*/g, "[^/]*")
    .replace(/<<<DOUBLE_STAR>>>/g, ".*");

  return new RegExp(`^${regexPattern}$`).test(filePath);
};

/**
 * Recursively scans a directory for page files
 */
const scanDirectory = (
  dir: string,
  rootDir: string,
  options: SchemaGeneratorOptions
): Route[] => {
  const routes: Route[] = [];
  const { include = ["**/*"], exclude = DEFAULT_EXCLUDE, transform } = options;

  if (!fs.existsSync(dir)) {
    return routes;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = fullPath.replace(rootDir, "").replace(/^\//, "");

    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name === "node_modules" || entry.name.startsWith(".")) {
        continue;
      }

      // Recursively scan subdirectories
      routes.push(...scanDirectory(fullPath, rootDir, options));
    } else if (entry.isFile() && isPageFile(entry.name)) {
      // Check include patterns
      const isIncluded = include.some((pattern) =>
        matchPattern(pattern, relativePath)
      );

      // Check exclude patterns
      const isExcluded = exclude.some((pattern) =>
        matchPattern(pattern, relativePath)
      );

      if (isIncluded && !isExcluded) {
        const routePath = filePathToRoutePath(fullPath, rootDir);
        const isDynamic = routePath.includes(":");

        let route: Route | null = {
          path: routePath,
          name: routePathToName(routePath),
          isDynamic,
          isIndex: routePath === "/" || routePath.endsWith("/"),
        };

        // Apply custom transform if provided
        if (transform) {
          route = transform(route);
        }

        if (route) {
          routes.push(route);
        }
      }
    }
  }

  return routes;
};

/**
 * Generates a navigation schema from a Next.js App Router project
 *
 * @example
 * ```ts
 * import { generateNextSchema } from "ai-navigation-tool/next";
 *
 * const schema = await generateNextSchema({
 *   rootDir: "./app",
 *   exclude: ["api/**", "admin/**"],
 * });
 * ```
 */
export const generateNextSchema = async (
  options: SchemaGeneratorOptions
): Promise<NavigationSchema> => {
  const { rootDir, baseUrl = "" } = options;

  const absoluteRoot = path.resolve(rootDir);

  if (!fs.existsSync(absoluteRoot)) {
    throw new Error(`Directory not found: ${absoluteRoot}`);
  }

  const routes = scanDirectory(absoluteRoot, absoluteRoot, options);

  // Apply base URL if provided
  const routesWithBase = baseUrl
    ? routes.map((route) => ({
        ...route,
        path: baseUrl + route.path,
      }))
    : routes;

  // Sort routes (index first, then alphabetically)
  routesWithBase.sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    return a.path.localeCompare(b.path);
  });

  return {
    routes: routesWithBase,
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    framework: "next",
  };
};

/**
 * Generates a schema from a Next.js Pages Router project
 */
export const generateNextPagesSchema = async (
  options: SchemaGeneratorOptions
): Promise<NavigationSchema> => {
  // Similar implementation but for pages router
  return generateNextSchema({
    ...options,
    exclude: [
      ...(options.exclude ?? []),
      "_app.*",
      "_document.*",
      "_error.*",
      "404.*",
      "500.*",
    ],
  });
};

// Re-export for convenience
export { navigationTool, defineSchema } from "../index";
