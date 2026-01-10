import { tool } from "ai";
import { z } from "zod";
import type {
  NavigationToolOptions,
  NavigationToolOutput,
  NavigationAction,
  Route,
} from "./types";
import { filterByGlob } from "./schema/validator";
import { searchRoutes } from "./search/fuzzy";

/**
 * Default tool description for the AI
 */
const DEFAULT_TOOL_DESCRIPTION = `Search and navigate to pages in the application. Use this tool when the user asks:
- "Where can I find..."
- "How do I get to..."
- "Navigate to..."
- "Open the..."
- "Show me the..."
- Questions about finding specific pages, settings, or features

Returns the best matching route(s) based on the user's query.`;

/**
 * Input parameters for the navigation tool
 */
interface NavigationToolInput {
  query: string;
  action?: "navigate" | "open_new_tab" | "copy_link" | "preview";
  category?: string;
}

/**
 * Apply custom filter to routes (supports sync and async filters)
 */
const applyCustomFilter = async <TContext>(
  routes: Route[],
  filter: ((route: Route, context: TContext) => boolean | Promise<boolean>) | undefined,
  context: TContext | undefined
): Promise<Route[]> => {
  if (!filter) return routes;
  
  const results = await Promise.all(
    routes.map(async (route) => ({
      route,
      include: await filter(route, context as TContext),
    }))
  );
  
  return results.filter((r) => r.include).map((r) => r.route);
};

/**
 * Creates an AI SDK navigation tool with generic filter support
 *
 * @example
 * ```ts
 * import { navigationTool, defineSchema } from "ai-navigation-tool";
 *
 * const schema = defineSchema([
 *   { path: "/", name: "Home" },
 *   { path: "/docs", name: "Documentation" },
 *   { path: "/admin", name: "Admin", permissions: ["admin"] },
 * ]);
 *
 * // Basic usage
 * const result = await generateText({
 *   model: gateway("openai/gpt-4o-mini"),
 *   prompt: "Where can I find the documentation?",
 *   tools: {
 *     navigate: navigationTool({ schema }),
 *   },
 * });
 *
 * // With custom filter and context
 * const result = await generateText({
 *   model: gateway("openai/gpt-4o-mini"),
 *   prompt: "Where can I find admin settings?",
 *   tools: {
 *     navigate: navigationTool({
 *       schema,
 *       filter: (route, ctx) => {
 *         // Custom permission logic
 *         if (route.permissions?.includes("admin")) {
 *           return ctx.user.role === "admin";
 *         }
 *         return true;
 *       },
 *       context: {
 *         user: currentUser,
 *         subscription: "pro",
 *       },
 *     }),
 *   },
 * });
 * ```
 */
export const navigationTool = <TContext = unknown>(
  options: NavigationToolOptions<TContext>
) => {
  const {
    schema,
    filter,
    context,
    globFilter,
    permissions,
    results: resultOptions = {},
    actions = { navigate: true },
    toolDescription = DEFAULT_TOOL_DESCRIPTION,
  } = options;

  // Pre-filter routes based on glob patterns only
  let availableRoutes = schema.routes;
  if (globFilter) {
    availableRoutes = filterByGlob(availableRoutes, globFilter);
  }

  // Build available actions list for the schema
  const availableActions: NavigationAction[] = [];
  if (actions.navigate) availableActions.push("navigate");
  if (actions.openNewTab) availableActions.push("open_new_tab");
  if (actions.copyLink) availableActions.push("copy_link");
  if (actions.preview) availableActions.push("preview");

  return tool({
    description: toolDescription,
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "The search query - what the user is looking for (e.g., 'settings', 'documentation', 'user profile')"
        ),
      action: z
        .enum(["navigate", "open_new_tab", "copy_link", "preview"])
        .optional()
        .describe(
          `The action to perform. Available: ${availableActions.join(", ")}. Default: navigate`
        ),
      category: z
        .string()
        .optional()
        .describe(
          "Optional category to filter by (e.g., 'docs', 'settings', 'api')"
        ),
    }),
    execute: async (input: NavigationToolInput): Promise<NavigationToolOutput> => {
      const { query, action, category } = input;
      
      try {
        // Apply custom filter (supports async)
        let routesToSearch = await applyCustomFilter(
          availableRoutes,
          filter,
          context
        );

        // Legacy: Apply permission context filter if provided (backwards compatibility)
        if (permissions?.filter) {
          routesToSearch = routesToSearch.filter((route) =>
            permissions.filter!(route, permissions)
          );
        }
        
        // Filter by category if specified
        if (category) {
          const categoryRoutes = routesToSearch.filter(
            (r) => r.category?.toLowerCase() === category.toLowerCase()
          );
          // Only use category filter if it has results, otherwise search all routes
          if (categoryRoutes.length > 0) {
            routesToSearch = categoryRoutes;
          }
        }

        if (routesToSearch.length === 0) {
          return {
            found: false,
            query,
            totalRoutes: availableRoutes.length,
            error: "No routes available",
          };
        }

        // Search for matching routes
        const searchResults = searchRoutes(query, routesToSearch, resultOptions);

        if (searchResults.length === 0) {
          return {
            found: false,
            query,
            totalRoutes: routesToSearch.length,
            error: `No routes found matching "${query}"`,
          };
        }

        // Apply action to results
        const resultsWithAction = searchResults.map((result) => ({
          ...result,
          action: action ?? ("navigate" as NavigationAction),
        }));

        // Return based on mode
        if (resultOptions.mode === "multiple") {
          return {
            found: true,
            results: resultsWithAction,
            query,
            totalRoutes: routesToSearch.length,
          };
        }

        return {
          found: true,
          result: resultsWithAction[0],
          query,
          totalRoutes: routesToSearch.length,
        };
      } catch (error) {
        return {
          found: false,
          query,
          totalRoutes: 0,
          error: error instanceof Error ? error.message : "Search failed",
        };
      }
    },
  });
};

/**
 * Creates a navigation tool with custom result handling
 */
export const createNavigationTool = navigationTool;
