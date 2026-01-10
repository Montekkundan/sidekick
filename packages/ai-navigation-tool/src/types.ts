/**
 * Core types for AI Navigation Tool
 */

/**
 * Represents a single route in your application
 */
export type Route = {
  /** The URL path (e.g., "/docs/getting-started") */
  path: string;

  /** Human-readable name (e.g., "Getting Started") */
  name: string;

  /** Description of what this route contains */
  description?: string;

  /** Alternative names users might search for */
  aliases?: string[];

  /** Keywords for better search matching */
  keywords?: string[];

  /** Category for grouping (e.g., "docs", "settings", "api") */
  category?: string;

  /** Required permissions to access this route */
  permissions?: string[];

  /** Feature flag that controls visibility */
  featureFlag?: string;

  /** Route parameters (for dynamic routes) */
  params?: Record<string, string>;

  /** Priority for ranking (higher = more important) */
  priority?: number;

  /** Whether this is an index/landing page */
  isIndex?: boolean;

  /** Whether this route has dynamic segments */
  isDynamic?: boolean;

  /** Custom metadata */
  metadata?: Record<string, unknown>;
};

/**
 * Generic filter function type
 * Return true to include the route, false to exclude it
 * 
 * @example
 * ```ts
 * // Permission-based filter
 * const filter: RouteFilter<{ user: User }> = (route, ctx) => {
 *   if (route.permissions?.includes("admin")) {
 *     return ctx.user.role === "admin";
 *   }
 *   return true;
 * };
 * ```
 */
export type RouteFilter<TContext = unknown> = (
  route: Route,
  context: TContext
) => boolean | Promise<boolean>;

/**
 * Async route filter (for async checks like API calls)
 */
export type AsyncRouteFilter<TContext = unknown> = (
  route: Route,
  context: TContext
) => Promise<boolean>;

/**
 * The navigation schema containing all routes
 */
export type NavigationSchema = {
  /** Array of all routes */
  routes: Route[];

  /** Schema version */
  version?: string;

  /** When the schema was generated */
  generatedAt?: string;

  /** Framework the schema was generated from */
  framework?: "next" | "sveltekit" | "astro" | "remix" | "nuxt" | "manual";

  /** Custom metadata */
  metadata?: Record<string, unknown>;
};

/**
 * Options for filtering routes (glob patterns)
 */
export type FilterOptions = {
  /** Glob patterns to include (e.g., ["app/**", "pages/**"]) */
  include?: string[];

  /** Glob patterns to exclude (e.g., ["api/**", "admin/**"]) */
  exclude?: string[];
};

/**
 * Permission context for filtering
 * @deprecated Use generic `filter` function with custom `context` instead
 */
export type PermissionContext = {
  /** Current user object */
  user?: unknown;

  /** User's permissions */
  permissions?: string[];

  /** Active feature flags */
  featureFlags?: string[];

  /** Custom permission checker */
  filter?: (route: Route, context: PermissionContext) => boolean;
};

/**
 * Result options for the navigation tool
 */
export type ResultOptions = {
  /** Return single best match or multiple */
  mode?: "single" | "multiple";

  /** Maximum results for multiple mode */
  maxResults?: number;

  /** Include confidence scores */
  includeConfidence?: boolean;

  /** Minimum confidence threshold (0-1) */
  threshold?: number;
};

/**
 * Action types the tool can return
 */
export type NavigationAction =
  | "navigate"
  | "open_new_tab"
  | "copy_link"
  | "preview";

/**
 * Configuration for available actions
 */
export type ActionOptions = {
  /** Enable navigation action */
  navigate?: boolean;

  /** Enable open in new tab */
  openNewTab?: boolean;

  /** Enable copy link */
  copyLink?: boolean;

  /** Enable preview (for modals/sidebars) */
  preview?: boolean;
};

/**
 * Main configuration for the navigation tool
 */
export type NavigationToolOptions<TContext = unknown> = {
  /** The navigation schema */
  schema: NavigationSchema;

  /**
   * Generic filter function for custom route filtering
   * Use this for permissions, feature flags, subscriptions, or any custom logic
   * 
   * @example
   * ```ts
   * // Simple permission check
   * filter: (route, ctx) => {
   *   if (!route.permissions) return true;
   *   return route.permissions.every(p => ctx.user.roles.includes(p));
   * }
   * 
   * // Subscription-based access
   * filter: (route, ctx) => {
   *   if (route.metadata?.requiresPro) {
   *     return ctx.subscription === "pro";
   *   }
   *   return true;
   * }
   * ```
   */
  filter?: RouteFilter<TContext>;

  /**
   * Context passed to the filter function
   * Can contain user, permissions, feature flags, or any custom data
   * 
   * @example
   * ```ts
   * context: {
   *   user: currentUser,
   *   permissions: ["admin", "editor"],
   *   featureFlags: ["new-dashboard"],
   *   subscription: "pro",
   * }
   * ```
   */
  context?: TContext;

  /**
   * Glob pattern options for path-based filtering
   * Applied before the custom filter function
   */
  globFilter?: FilterOptions;

  /** Result options */
  results?: ResultOptions;

  /** Available actions */
  actions?: ActionOptions;

  /** Execution mode */
  mode?: "server" | "client";

  /** Custom description for the tool (shown to AI) */
  toolDescription?: string;

  /**
   * @deprecated Use `filter` and `context` instead
   * Legacy permission context - kept for backwards compatibility
   */
  permissions?: PermissionContext;
};

/**
 * A single navigation result
 */
export type NavigationResult = {
  /** The matched route */
  route: Route;

  /** Confidence score (0-1) */
  confidence: number;

  /** Suggested action */
  action?: NavigationAction;

  /** Full URL (with params filled in) */
  url: string;

  /** Why this was matched */
  matchReason?: string;
};

/**
 * Tool output structure
 */
export type NavigationToolOutput = {
  /** Whether a match was found */
  found: boolean;

  /** Single result (when mode is "single") */
  result?: NavigationResult;

  /** Multiple results (when mode is "multiple") */
  results?: NavigationResult[];

  /** Search query that was used */
  query: string;

  /** Total routes searched */
  totalRoutes: number;

  /** Error message if something went wrong */
  error?: string;
};

/**
 * Options for schema generation (framework adapters)
 */
export type SchemaGeneratorOptions = {
  /** Root directory to scan */
  rootDir: string;

  /** Glob patterns to include */
  include?: string[];

  /** Glob patterns to exclude */
  exclude?: string[];

  /** Base URL prefix */
  baseUrl?: string;

  /** Extract metadata from files */
  extractMetadata?: boolean;

  /** Custom route transformer */
  transform?: (route: Route) => Route | null;
};
