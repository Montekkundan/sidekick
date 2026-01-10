import { defineSchema, type Route, type RouteFilter } from "ai-navigation-tool";

/**
 * Navigation schema for the demo app
 * Demonstrates different route configurations and search capabilities
 */
export const schema = defineSchema([
  {
    path: "/",
    name: "Home",
    description: "Interactive demo showcasing AI Navigation Tool search capabilities",
    aliases: ["main", "index", "start", "landing"],
    keywords: ["demo", "examples", "search", "navigation", "ai"],
    category: "demo",
    priority: 100,
    isIndex: true,
  },
  {
    path: "/basic-search",
    name: "Basic Search Demo",
    description: "Demonstrates exact matching search capabilities with default navigation",
    aliases: ["basic", "exact match", "simple search"],
    keywords: ["exact", "matching", "basic", "simple"],
    category: "demo",
    priority: 90,
  },
  {
    path: "/fuzzy-match",
    name: "Fuzzy Matching Demo",
    description: "Typo-tolerant search using Levenshtein distance algorithm",
    aliases: ["typo tolerance", "fuzzy search", "approximate match"],
    keywords: ["fuzzy", "typo", "levenshtein", "similarity", "tolerance"],
    category: "demo",
    priority: 85,
  },
  {
    path: "/aliases",
    name: "Aliases & Keywords Demo",
    description: "Shows how aliases and keywords improve route discoverability",
    aliases: ["alternative names", "synonyms", "search terms", "nicknames"],
    keywords: ["discoverability", "search optimization", "multiple terms", "seo"],
    category: "demo",
    priority: 80,
  },
  {
    path: "/category",
    name: "Category Filtering Demo",
    description: "Demonstrates how categories help organize and filter routes",
    aliases: ["categories", "organize", "group routes"],
    keywords: ["category", "filter", "organize", "group"],
    category: "demo",
    priority: 75,
  },
  {
    path: "/custom-navigation",
    name: "Custom Navigation Demo",
    description: "Shows custom navigation behavior with navigate: false",
    aliases: ["custom action", "copy link", "custom handler"],
    keywords: ["custom", "handler", "clipboard", "copy"],
    category: "demo",
    priority: 70,
    metadata: {
      navigate: false,
      customAction: "copy-link",
    },
  },
  {
    path: "/permissions",
    name: "Permission-Based Routing Demo",
    description: "Demonstrates permission-based route filtering using custom filter function",
    aliases: ["permissions", "access control", "user roles"],
    keywords: ["permissions", "access", "roles", "filter"],
    category: "demo",
    priority: 65,
  },
  // Routes with permission requirements (for filter demo)
  {
    path: "/admin",
    name: "Admin Dashboard",
    description: "Admin-only dashboard - requires admin role",
    aliases: ["admin panel", "administration"],
    keywords: ["admin", "management", "dashboard"],
    category: "admin",
    priority: 60,
    permissions: ["admin"],
  },
  {
    path: "/settings",
    name: "User Settings",
    description: "User settings page - requires authenticated user",
    aliases: ["preferences", "account settings"],
    keywords: ["settings", "preferences", "account"],
    category: "settings",
    priority: 55,
    permissions: ["user"],
  },
  {
    path: "/billing",
    name: "Billing & Subscription",
    description: "Billing page - requires pro subscription",
    aliases: ["subscription", "payments", "upgrade"],
    keywords: ["billing", "payment", "subscription", "pro"],
    category: "settings",
    priority: 50,
    metadata: {
      requiresPro: true,
    },
  },
  {
    path: "/beta-feature",
    name: "Beta Feature Preview",
    description: "Early access feature - requires beta feature flag",
    aliases: ["early access", "preview"],
    keywords: ["beta", "preview", "experimental"],
    category: "demo",
    priority: 40,
    featureFlag: "beta-feature",
  },
]);

/**
 * Example user context type for filter function
 */
export type UserContext = {
  user?: {
    id: string;
    name: string;
    role: "guest" | "user" | "admin";
    subscription: "free" | "pro";
  };
  featureFlags?: string[];
};

/**
 * Example filter functions demonstrating different use cases
 */
export const filters = {
  /**
   * Permission-based filter
   * Checks if user has required permissions for the route
   */
  permissions: ((route: Route, ctx: UserContext) => {
    // No permissions required
    if (!route.permissions || route.permissions.length === 0) {
      return true;
    }
    
    // Check user role
    const userRole = ctx.user?.role ?? "guest";
    
    // Admin can access everything
    if (userRole === "admin") return true;
    
    // Check if user has any of the required permissions
    if (route.permissions.includes("user") && userRole !== "guest") {
      return true;
    }
    
    if (route.permissions.includes("admin") && userRole === "admin") {
      return true;
    }
    
    return false;
  }) satisfies RouteFilter<UserContext>,

  /**
   * Subscription-based filter
   * Checks if user has required subscription level
   */
  subscription: ((route: Route, ctx: UserContext) => {
    if (route.metadata?.requiresPro) {
      return ctx.user?.subscription === "pro";
    }
    return true;
  }) satisfies RouteFilter<UserContext>,

  /**
   * Feature flag filter
   * Checks if required feature flag is enabled
   */
  featureFlags: ((route: Route, ctx: UserContext) => {
    if (route.featureFlag) {
      return ctx.featureFlags?.includes(route.featureFlag) ?? false;
    }
    return true;
  }) satisfies RouteFilter<UserContext>,

  /**
   * Combined filter - checks all conditions
   * Use this as a template for complex filtering logic
   */
  combined: ((route: Route, ctx: UserContext) => {
    // Check permissions
    if (route.permissions && route.permissions.length > 0) {
      const userRole = ctx.user?.role ?? "guest";
      if (userRole === "guest") return false;
      if (route.permissions.includes("admin") && userRole !== "admin") {
        return false;
      }
    }
    
    // Check subscription
    if (route.metadata?.requiresPro && ctx.user?.subscription !== "pro") {
      return false;
    }
    
    // Check feature flags
    if (route.featureFlag && !ctx.featureFlags?.includes(route.featureFlag)) {
      return false;
    }
    
    return true;
  }) satisfies RouteFilter<UserContext>,
};
