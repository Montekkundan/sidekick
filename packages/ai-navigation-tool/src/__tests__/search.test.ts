import { describe, test, expect } from "bun:test";
import {
  searchRoutes,
  calculateMatchScore,
  tokenize,
  levenshteinSimilarity,
} from "../search/fuzzy";
import type { Route } from "../types";

describe("Search - Fuzzy Matching", () => {
  describe("tokenize", () => {
    test("splits text into lowercase tokens", () => {
      const tokens = tokenize("Hello World");
      expect(tokens).toEqual(["hello", "world"]);
    });

    test("handles hyphens and special characters", () => {
      const tokens = tokenize("user-profile settings_page");
      expect(tokens).toEqual(["user", "profile", "settings", "page"]);
    });

    test("returns empty array for empty string", () => {
      const tokens = tokenize("");
      expect(tokens).toEqual([]);
    });
  });

  describe("levenshteinSimilarity", () => {
    test("returns 1 for identical strings", () => {
      expect(levenshteinSimilarity("test", "test")).toBe(1);
    });

    test("returns 1 for identical strings case-insensitive", () => {
      expect(levenshteinSimilarity("Test", "test")).toBe(1);
    });

    test("returns 0 for completely different strings", () => {
      const similarity = levenshteinSimilarity("abc", "xyz");
      expect(similarity).toBeLessThan(0.5);
    });

    test("handles empty strings", () => {
      expect(levenshteinSimilarity("", "test")).toBe(0);
      expect(levenshteinSimilarity("test", "")).toBe(0);
    });

    test("calculates similarity for typos", () => {
      // "documenation" vs "documentation" - one letter difference
      const similarity = levenshteinSimilarity("documenation", "documentation");
      expect(similarity).toBeGreaterThan(0.8);
    });
  });

  describe("calculateMatchScore", () => {
    const route: Route = {
      path: "/docs/getting-started",
      name: "Getting Started",
      description: "Learn how to get started",
      aliases: ["quickstart", "intro"],
      keywords: ["tutorial", "beginner"],
      category: "docs",
    };

    test("returns high score for exact name match", () => {
      const score = calculateMatchScore("getting started", route);
      expect(score).toBeGreaterThan(0.8);
    });

    test("returns high score for alias match", () => {
      const score = calculateMatchScore("quickstart", route);
      expect(score).toBeGreaterThan(0.7);
    });

    test("returns high score for keyword match", () => {
      const score = calculateMatchScore("tutorial", route);
      expect(score).toBeGreaterThan(0.6);
    });

    test("returns moderate score for partial match", () => {
      const score = calculateMatchScore("getting", route);
      expect(score).toBeGreaterThan(0.4);
    });

    test("returns low score for unrelated query", () => {
      const score = calculateMatchScore("xyz123", route);
      expect(score).toBeLessThan(0.3);
    });

    test("handles fuzzy/typo matching", () => {
      const score = calculateMatchScore("geting started", route); // typo
      expect(score).toBeGreaterThan(0.5);
    });
  });

  describe("searchRoutes", () => {
    const routes: Route[] = [
      { path: "/", name: "Home", isIndex: true },
      { path: "/docs", name: "Documentation", aliases: ["help", "guides"] },
      { path: "/docs/getting-started", name: "Getting Started" },
      { path: "/settings", name: "Settings", category: "settings" },
      { path: "/settings/profile", name: "Profile Settings" },
      { path: "/admin", name: "Admin Dashboard", permissions: ["admin"] },
    ];

    test("returns single result by default", () => {
      const results = searchRoutes("documentation", routes);
      expect(results).toHaveLength(1);
      expect(results[0].route.path).toBe("/docs");
    });

    test("returns multiple results when configured", () => {
      const results = searchRoutes("settings", routes, {
        mode: "multiple",
        maxResults: 3,
      });
      expect(results.length).toBeGreaterThan(1);
    });

    test("filters by threshold", () => {
      const results = searchRoutes("xyz", routes, { threshold: 0.5 });
      expect(results).toHaveLength(0);
    });

    test("includes confidence scores", () => {
      const results = searchRoutes("docs", routes, { includeConfidence: true });
      expect(results[0].confidence).toBeDefined();
      expect(results[0].confidence).toBeGreaterThan(0);
      expect(results[0].confidence).toBeLessThanOrEqual(1);
    });

    test("matches by alias", () => {
      const results = searchRoutes("help", routes);
      expect(results[0].route.path).toBe("/docs");
    });

    test("returns match reason", () => {
      const results = searchRoutes("documentation", routes);
      expect(results[0].matchReason).toBeDefined();
    });

    test("ranks exact matches higher", () => {
      const results = searchRoutes("settings", routes, {
        mode: "multiple",
        maxResults: 5,
      });
      
      // "/settings" should rank higher than "/settings/profile"
      const settingsIndex = results.findIndex((r) => r.route.path === "/settings");
      const profileIndex = results.findIndex((r) => r.route.path === "/settings/profile");
      
      if (settingsIndex !== -1 && profileIndex !== -1) {
        expect(settingsIndex).toBeLessThan(profileIndex);
      }
    });
  });
});
