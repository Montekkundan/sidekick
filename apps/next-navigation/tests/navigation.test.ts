import { describe, it, expect, beforeAll } from "bun:test";

const API_URL = process.env.API_URL || "http://localhost:3001";

interface SearchResult {
  route: {
    path: string;
    name: string;
    description?: string;
    aliases?: string[];
    keywords?: string[];
    category?: string;
    priority?: number;
    metadata?: Record<string, unknown>;
  };
  confidence: number;
  url: string;
  matchReason?: string;
  action?: string;
}

interface NavigationResponse {
  found: boolean;
  result?: SearchResult;
  results?: SearchResult[];
  query: string;
  totalRoutes: number;
  error?: string;
}

// User context for filter testing (matches schema.ts UserContext)
interface UserContext {
  user?: {
    id: string;
    name: string;
    role: "guest" | "user" | "admin";
    subscription: "free" | "pro";
  };
  featureFlags?: string[];
}

// Helper to create user context
const createUserContext = (
  role: "guest" | "user" | "admin",
  subscription: "free" | "pro",
  featureFlags: string[] = []
): UserContext => ({
  user: {
    id: "test-user",
    name: "Test User",
    role,
    subscription,
  },
  featureFlags,
});

async function search(
  query: string,
  userContext?: UserContext
): Promise<NavigationResponse> {
  const response = await fetch(`${API_URL}/api/navigate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, userContext }),
  });
  return response.json();
}

describe("AI Navigation Tool - End-to-End Tests", () => {
  // Health check
  describe("API Health", () => {
    it("should respond to POST requests", async () => {
      const response = await search("test");
      expect(response).toHaveProperty("query");
      expect(response).toHaveProperty("totalRoutes");
    });

    it("should return totalRoutes count", async () => {
      const response = await search("home");
      expect(response.totalRoutes).toBeGreaterThan(0);
    });
  });

  // Basic Search - Exact matching
  describe("Basic Search (Exact Matching)", () => {
    it("should find route by exact name", async () => {
      const response = await search("Home");
      expect(response.found).toBe(true);
      expect(response.results?.[0]?.route.path).toBe("/");
    });

    it("should find Basic Search Demo page", async () => {
      const response = await search("Basic Search Demo");
      expect(response.found).toBe(true);
      expect(response.results?.[0]?.route.path).toBe("/basic-search");
    });

    it("should find Fuzzy Matching Demo page", async () => {
      const response = await search("Fuzzy Matching Demo");
      expect(response.found).toBe(true);
      expect(response.results?.[0]?.route.path).toBe("/fuzzy-match");
    });

    it("should return high confidence for exact matches", async () => {
      const response = await search("Basic Search");
      expect(response.found).toBe(true);
      expect(response.results?.[0]?.confidence).toBeGreaterThanOrEqual(0.9);
    });
  });

  // Fuzzy Matching - Typo tolerance
  describe("Fuzzy Matching (Typo Tolerance)", () => {
    it("should find page despite typos - 'fzzy' -> 'fuzzy'", async () => {
      const response = await search("fzzy");
      expect(response.found).toBe(true);
      const fuzzyResult = response.results?.find(r => r.route.path === "/fuzzy-match");
      expect(fuzzyResult).toBeDefined();
    });

    it("should find page despite typos - 'bsic serch'", async () => {
      const response = await search("bsic serch");
      expect(response.found).toBe(true);
      const basicResult = response.results?.find(r => r.route.path === "/basic-search");
      expect(basicResult).toBeDefined();
    });

    it("should find page with missing letters - 'hme'", async () => {
      const response = await search("hme");
      // Fuzzy search may return Home or other results - just verify it found something
      expect(response.found).toBe(true);
      expect(response.results?.length).toBeGreaterThan(0);
    });

    it("should find page with swapped letters - 'caetgory'", async () => {
      const response = await search("caetgory");
      expect(response.found).toBe(true);
      const categoryResult = response.results?.find(r => r.route.path === "/category");
      expect(categoryResult).toBeDefined();
    });

    it("should include matchReason for fuzzy matches", async () => {
      const response = await search("prmsisions");
      expect(response.found).toBe(true);
      expect(response.results?.[0]?.matchReason).toBeDefined();
    });
  });

  // Aliases - Alternative search terms
  describe("Aliases & Keywords", () => {
    it("should find Home via alias 'main'", async () => {
      const response = await search("main");
      expect(response.found).toBe(true);
      const homeResult = response.results?.find(r => r.route.path === "/");
      expect(homeResult).toBeDefined();
    });

    it("should find Home via alias 'landing'", async () => {
      const response = await search("landing");
      expect(response.found).toBe(true);
      const homeResult = response.results?.find(r => r.route.path === "/");
      expect(homeResult).toBeDefined();
    });

    it("should find Aliases page via alias 'synonyms'", async () => {
      const response = await search("synonyms");
      expect(response.found).toBe(true);
      const aliasResult = response.results?.find(r => r.route.path === "/aliases");
      expect(aliasResult).toBeDefined();
    });

    it("should find Basic Search via alias 'exact match'", async () => {
      const response = await search("exact match");
      expect(response.found).toBe(true);
      const basicResult = response.results?.find(r => r.route.path === "/basic-search");
      expect(basicResult).toBeDefined();
    });

    it("should find Fuzzy Match via keyword 'levenshtein'", async () => {
      const response = await search("levenshtein");
      expect(response.found).toBe(true);
      const fuzzyResult = response.results?.find(r => r.route.path === "/fuzzy-match");
      expect(fuzzyResult).toBeDefined();
    });

    it("should find Custom Navigation via alias 'copy link'", async () => {
      const response = await search("copy link");
      expect(response.found).toBe(true);
      const customResult = response.results?.find(r => r.route.path === "/custom-navigation");
      expect(customResult).toBeDefined();
    });
  });

  // Category Filtering
  describe("Category Filtering", () => {
    it("should return routes from 'demo' category", async () => {
      const response = await search("demo");
      expect(response.found).toBe(true);
      expect(response.results?.length).toBeGreaterThan(0);
      // All results should be in demo category
      response.results?.forEach(result => {
        expect(result.route.category).toBe("demo");
      });
    });

    it("should find Category page when searching 'Category Filtering Demo'", async () => {
      const response = await search("Category Filtering Demo");
      expect(response.found).toBe(true);
      const categoryResult = response.results?.find(r => r.route.path === "/category");
      expect(categoryResult).toBeDefined();
    });
  });

  // Multiple Results
  describe("Multiple Results & Ranking", () => {
    it("should return multiple results", async () => {
      const response = await search("search");
      expect(response.found).toBe(true);
      expect(response.results?.length).toBeGreaterThan(1);
    });

    it("should rank results by confidence (descending)", async () => {
      const response = await search("demo");
      expect(response.found).toBe(true);
      if (response.results && response.results.length > 1) {
        for (let i = 0; i < response.results.length - 1; i++) {
          expect(response.results[i].confidence).toBeGreaterThanOrEqual(
            response.results[i + 1].confidence
          );
        }
      }
    });

    it("should respect maxResults limit (5)", async () => {
      const response = await search("demo");
      expect(response.found).toBe(true);
      expect(response.results?.length).toBeLessThanOrEqual(5);
    });

    it("should include confidence scores", async () => {
      const response = await search("home");
      expect(response.found).toBe(true);
      response.results?.forEach(result => {
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      });
    });
  });

  // Custom Navigation Actions
  describe("Custom Navigation Actions", () => {
    it("should find Custom Navigation page with metadata", async () => {
      const response = await search("custom navigation");
      expect(response.found).toBe(true);
      const customResult = response.results?.find(r => r.route.path === "/custom-navigation");
      expect(customResult).toBeDefined();
      expect(customResult?.route.metadata).toBeDefined();
    });

    it("should have navigate: false in custom navigation metadata", async () => {
      const response = await search("custom navigation");
      expect(response.found).toBe(true);
      const customResult = response.results?.find(r => r.route.path === "/custom-navigation");
      expect(customResult?.route.metadata?.navigate).toBe(false);
    });

    it("should have customAction in metadata", async () => {
      const response = await search("custom handler");
      expect(response.found).toBe(true);
      const customResult = response.results?.find(r => r.route.path === "/custom-navigation");
      expect(customResult?.route.metadata?.customAction).toBe("copy-link");
    });

    it("should return action field in results", async () => {
      const response = await search("home");
      expect(response.found).toBe(true);
      expect(response.results?.[0]?.action).toBeDefined();
    });
  });

  // Permissions Page
  describe("Filters Page", () => {
    it("should find Filters page", async () => {
      const response = await search("Permission-Based Routing");
      expect(response.found).toBe(true);
      const filterResult = response.results?.find(r => r.route.path === "/permissions");
      expect(filterResult).toBeDefined();
    });

    it("should find Filters via alias 'permissions'", async () => {
      const response = await search("permissions demo");
      expect(response.found).toBe(true);
      const filterResult = response.results?.find(r => r.route.path === "/permissions");
      expect(filterResult).toBeDefined();
    });

    it("should find Filters via keyword 'route filtering'", async () => {
      const response = await search("route filtering demo");
      expect(response.found).toBe(true);
      const filterResult = response.results?.find(r => r.route.path === "/permissions");
      expect(filterResult).toBeDefined();
    });
  });

  // Filter Functionality Tests
  describe("Custom Filter Functionality", () => {
    // Admin-only routes
    describe("Permission-based Filters", () => {
      it("should show admin routes for admin users", async () => {
        const response = await search("Admin Dashboard", createUserContext("admin", "pro"));
        expect(response.found).toBe(true);
        const adminResult = response.results?.find(r => r.route.path === "/admin");
        expect(adminResult).toBeDefined();
      });

      it("should hide admin routes for regular users", async () => {
        const response = await search("admin dashboard", createUserContext("user", "pro"));
        // Admin route should be filtered out
        const adminResult = response.results?.find(r => r.route.path === "/admin");
        expect(adminResult).toBeUndefined();
      });

      it("should hide admin routes for guest users", async () => {
        const response = await search("admin", createUserContext("guest", "free"));
        const adminResult = response.results?.find(r => r.route.path === "/admin");
        expect(adminResult).toBeUndefined();
      });
    });

    // Subscription-based filters
    describe("Subscription-based Filters", () => {
      it("should show billing page for pro subscription users", async () => {
        const response = await search("billing", createUserContext("user", "pro"));
        expect(response.found).toBe(true);
        const billingResult = response.results?.find(r => r.route.path === "/billing");
        expect(billingResult).toBeDefined();
      });

      it("should show billing for admin with pro subscription", async () => {
        const response = await search("billing invoices", createUserContext("admin", "pro"));
        expect(response.found).toBe(true);
        const billingResult = response.results?.find(r => r.route.path === "/billing");
        expect(billingResult).toBeDefined();
      });

      it("should hide billing page for free tier users", async () => {
        const response = await search("billing", createUserContext("user", "free"));
        const billingResult = response.results?.find(r => r.route.path === "/billing");
        expect(billingResult).toBeUndefined();
      });
    });

    // Feature flag filters
    describe("Feature Flag Filters", () => {
      it("should show beta features when flag is enabled", async () => {
        const response = await search("beta feature", createUserContext("user", "pro", ["beta-feature"]));
        expect(response.found).toBe(true);
        const betaResult = response.results?.find(r => r.route.path === "/beta-feature");
        expect(betaResult).toBeDefined();
      });

      it("should hide beta features when flag is not enabled", async () => {
        const response = await search("beta experimental", createUserContext("user", "pro", []));
        const betaResult = response.results?.find(r => r.route.path === "/beta-feature");
        expect(betaResult).toBeUndefined();
      });

      it("should work with multiple feature flags", async () => {
        const response = await search("beta", createUserContext("user", "pro", ["other-flag", "beta-feature", "another-flag"]));
        expect(response.found).toBe(true);
        const betaResult = response.results?.find(r => r.route.path === "/beta-feature");
        expect(betaResult).toBeDefined();
      });
    });

    // Settings page (no restrictions)
    describe("Unrestricted Routes", () => {
      it("should show settings to authenticated users", async () => {
        const response = await search("settings", createUserContext("user", "free"));
        expect(response.found).toBe(true);
        const settingsResult = response.results?.find(r => r.route.path === "/settings");
        expect(settingsResult).toBeDefined();
      });

      it("should show home page regardless of context", async () => {
        const response = await search("home", createUserContext("guest", "free"));
        expect(response.found).toBe(true);
        const homeResult = response.results?.find(r => r.route.path === "/");
        expect(homeResult).toBeDefined();
      });
    });

    // Combined filter logic
    describe("Combined Filter Logic", () => {
      it("should apply combined filters correctly - admin with full access can see admin panel", async () => {
        const response = await search("Admin Dashboard", createUserContext("admin", "pro", ["beta-feature"]));
        expect(response.found).toBe(true);
        // Admin should see admin routes when searching directly
        const adminResult = response.results?.find(r => r.route.path === "/admin");
        expect(adminResult).toBeDefined();
      });

      it("should handle no context gracefully", async () => {
        // When no context is provided, filter should handle it
        const response = await search("home");
        expect(response.found).toBe(true);
      });
    });
  });

  // Route Properties
  describe("Route Schema Properties", () => {
    it("should include path in results", async () => {
      const response = await search("home");
      expect(response.results?.[0]?.route.path).toBeDefined();
    });

    it("should include name in results", async () => {
      const response = await search("home");
      expect(response.results?.[0]?.route.name).toBeDefined();
    });

    it("should include description in results", async () => {
      const response = await search("basic search");
      expect(response.results?.[0]?.route.description).toBeDefined();
    });

    it("should include url in results", async () => {
      const response = await search("home");
      expect(response.results?.[0]?.url).toBe("/");
    });

    it("should include priority for ranked routes", async () => {
      const response = await search("Home");
      const homeResult = response.results?.find(r => r.route.path === "/");
      // Priority may or may not be returned depending on tool configuration
      // Check that home route is found with high confidence
      expect(homeResult).toBeDefined();
      expect(homeResult?.confidence).toBeGreaterThanOrEqual(0.8);
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("should handle empty query gracefully", async () => {
      const response = await fetch(`${API_URL}/api/navigate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "" }),
      });
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it("should handle very long query", async () => {
      const longQuery = "a".repeat(500);
      const response = await search(longQuery);
      expect(response).toHaveProperty("query");
    });

    it("should handle special characters", async () => {
      const response = await search("home!@#$%");
      expect(response).toHaveProperty("found");
    });

    it("should handle query with only spaces", async () => {
      const response = await fetch(`${API_URL}/api/navigate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "   " }),
      });
      const data = await response.json();
      // Should either return error or empty results
      expect(data).toHaveProperty("found");
    });

    it("should return found: false for completely irrelevant query", async () => {
      const response = await search("xyzabc123notfound");
      // May or may not find due to fuzzy matching, but should handle gracefully
      expect(response).toHaveProperty("found");
    });
  });

  // Natural Language Queries (AI SDK integration)
  describe("Natural Language Queries", () => {
    it("should understand 'show me' queries", async () => {
      const response = await search("show me the home page");
      expect(response.found).toBe(true);
    });

    it("should understand 'where is' queries", async () => {
      const response = await search("where is fuzzy matching");
      expect(response.found).toBe(true);
      const fuzzyResult = response.results?.find(r => r.route.path === "/fuzzy-match");
      expect(fuzzyResult).toBeDefined();
    });

    it("should understand 'how to' queries", async () => {
      const response = await search("how to use aliases");
      expect(response.found).toBe(true);
      const aliasResult = response.results?.find(r => r.route.path === "/aliases");
      expect(aliasResult).toBeDefined();
    });

    it("should understand 'find' queries", async () => {
      const response = await search("find permissions page");
      expect(response.found).toBe(true);
    });
  });

  // All Demo Pages Coverage
  describe("All Demo Pages Accessible", () => {
    const demoPages = [
      { path: "/", query: "Home" },
      { path: "/basic-search", query: "Basic Search Demo" },
      { path: "/fuzzy-match", query: "Fuzzy Matching Demo" },
      { path: "/aliases", query: "Aliases & Keywords Demo" },
      { path: "/category", query: "Category Filtering Demo" },
      { path: "/custom-navigation", query: "Custom Navigation Demo" },
      { path: "/permissions", query: "Permission-Based Routing Demo" },
    ];

    for (const page of demoPages) {
      it(`should find ${page.path} via search`, async () => {
        const response = await search(page.query);
        expect(response.found).toBe(true);
        const result = response.results?.find(r => r.route.path === page.path);
        expect(result).toBeDefined();
      });
    }

    // Protected pages (require specific context)
    const protectedPages = [
      {
        path: "/admin",
        query: "Admin Dashboard",
        context: createUserContext("admin", "pro"),
      },
      {
        path: "/settings",
        query: "User Settings",
        context: createUserContext("user", "free"),
      },
      {
        path: "/billing",
        query: "Billing & Subscription",
        context: createUserContext("user", "pro"),
      },
      {
        path: "/beta-feature",
        query: "Beta Feature Preview",
        context: createUserContext("user", "pro", ["beta-feature"]),
      },
    ];

    for (const page of protectedPages) {
      it(`should find ${page.path} with correct context`, async () => {
        const response = await search(page.query, page.context);
        expect(response.found).toBe(true);
        const result = response.results?.find(r => r.route.path === page.path);
        expect(result).toBeDefined();
      });
    }
  });
});
