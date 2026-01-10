/**
 * AI Navigation Tool
 *
 * Universal AI-powered navigation tool for AI SDK.
 * Helps AI understand and navigate your app's routes.
 *
 * @example
 * ```ts
 * import { navigationTool, defineSchema } from "ai-navigation-tool";
 * import { generateText, gateway } from "ai";
 *
 * const schema = defineSchema([
 *   { path: "/", name: "Home" },
 *   { path: "/docs", name: "Documentation" },
 *   { path: "/settings", name: "Settings", permissions: ["user"] },
 * ]);
 *
 * const result = await generateText({
 *   model: gateway("openai/gpt-4o-mini"),
 *   prompt: "Where can I find the documentation?",
 *   tools: {
 *     navigate: navigationTool({ schema }),
 *   },
 * });
 * ```
 *
 * @packageDocumentation
 */

// Main tool
export { navigationTool, createNavigationTool } from "./tool";

// Schema utilities
export {
  createSchema,
  defineSchema,
  defineRoute,
  defineRoutes,
  mergeSchemas,
  extendSchema,
  SchemaBuilder,
} from "./schema/builder";

// Validation
export {
  validateSchema,
  validateRoute,
  parseSchema,
  matchGlob,
  filterByGlob,
  filterByPermissions,
  applyFilters,
} from "./schema/validator";

// Search utilities
export {
  searchRoutes,
  calculateMatchScore,
  tokenize,
  levenshteinSimilarity,
} from "./search/fuzzy";

// Types
export type {
  Route,
  RouteFilter,
  AsyncRouteFilter,
  NavigationSchema,
  FilterOptions,
  PermissionContext,
  ResultOptions,
  ActionOptions,
  NavigationAction,
  NavigationToolOptions,
  NavigationResult,
  NavigationToolOutput,
  SchemaGeneratorOptions,
} from "./types";
