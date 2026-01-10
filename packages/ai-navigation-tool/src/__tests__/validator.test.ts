import { describe, test, expect } from "bun:test";
import {
  validateSchema,
  validateRoute,
  parseSchema,
  matchGlob,
  filterByGlob,
  applyFilters,
} from "../schema/validator";
import type { Route, NavigationSchema } from "../types";

describe("Schema Validator", () => {
  describe("validateRoute", () => {
    test("returns true for valid route", () => {
      expect(validateRoute({ path: "/", name: "Home" })).toBe(true);
    });

    test("returns false for missing path", () => {
      expect(validateRoute({ name: "Home" })).toBe(false);
    });

    test("returns false for missing name", () => {
      expect(validateRoute({ path: "/" })).toBe(false);
    });

    test("returns false for path not starting with /", () => {
      expect(validateRoute({ path: "home", name: "Home" })).toBe(false);
    });

    test("returns false for empty name", () => {
      expect(validateRoute({ path: "/", name: "" })).toBe(false);
    });

    test("returns false for non-object", () => {
      expect(validateRoute(null)).toBe(false);
      expect(validateRoute("string")).toBe(false);
      expect(validateRoute(123)).toBe(false);
    });
  });

  describe("validateSchema", () => {
    test("returns true for valid schema", () => {
      const schema = {
        routes: [{ path: "/", name: "Home" }],
      };
      expect(validateSchema(schema)).toBe(true);
    });

    test("returns false for missing routes", () => {
      expect(validateSchema({})).toBe(false);
    });

    test("returns false for non-array routes", () => {
      expect(validateSchema({ routes: "not-array" })).toBe(false);
    });

    test("returns false for invalid routes in array", () => {
      const schema = {
        routes: [{ path: "/", name: "Home" }, { invalid: true }],
      };
      expect(validateSchema(schema)).toBe(false);
    });
  });

  describe("parseSchema", () => {
    test("parses valid schema and adds defaults", () => {
      const schema = parseSchema({
        routes: [{ path: "/", name: "Home" }],
      });

      expect(schema.version).toBe("1.0.0");
      expect(schema.framework).toBe("manual");
      expect(schema.generatedAt).toBeDefined();
    });

    test("throws for invalid schema", () => {
      expect(() => parseSchema({})).toThrow();
    });
  });

  describe("matchGlob", () => {
    test("matches exact paths", () => {
      expect(matchGlob("/docs", "/docs")).toBe(true);
      expect(matchGlob("/docs", "/about")).toBe(false);
    });

    test("matches single wildcard", () => {
      expect(matchGlob("/docs/*", "/docs/intro")).toBe(true);
      expect(matchGlob("/docs/*", "/docs/getting-started")).toBe(true);
      expect(matchGlob("/docs/*", "/docs/nested/path")).toBe(false);
    });

    test("matches double wildcard", () => {
      expect(matchGlob("/docs/**", "/docs/intro")).toBe(true);
      expect(matchGlob("/docs/**", "/docs/nested/deep/path")).toBe(true);
      expect(matchGlob("**/api/**", "/some/api/route")).toBe(true);
    });

    test("matches question mark wildcard", () => {
      expect(matchGlob("/doc?", "/docs")).toBe(true);
      expect(matchGlob("/doc?", "/doc")).toBe(false);
    });
  });

  describe("filterByGlob", () => {
    const routes: Route[] = [
      { path: "/", name: "Home" },
      { path: "/docs", name: "Docs" },
      { path: "/docs/intro", name: "Intro" },
      { path: "/api/users", name: "Users API" },
      { path: "/admin", name: "Admin" },
    ];

    test("filters by include patterns", () => {
      const filtered = filterByGlob(routes, { include: ["/docs/**"] });
      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.path.startsWith("/docs"))).toBe(true);
    });

    test("filters by exclude patterns", () => {
      const filtered = filterByGlob(routes, { exclude: ["/api/**", "/admin"] });
      expect(filtered).toHaveLength(3);
      expect(filtered.some((r) => r.path.startsWith("/api"))).toBe(false);
    });

    test("combines include and exclude", () => {
      const filtered = filterByGlob(routes, {
        include: ["/docs/**", "/"],
        exclude: ["/docs/intro"],
      });
      expect(filtered).toHaveLength(2);
    });
  });

  describe("applyFilters", () => {
    const routes: Route[] = [
      { path: "/", name: "Home" },
      { path: "/docs", name: "Docs" },
      { path: "/admin", name: "Admin", permissions: ["admin"] },
      { path: "/beta", name: "Beta Feature", featureFlag: "beta" },
    ];

    test("applies glob filters", () => {
      const filtered = applyFilters(routes, { exclude: ["/admin"] });
      expect(filtered).toHaveLength(3);
    });

    test("applies permission filters", () => {
      const filtered = applyFilters(
        routes,
        { excludeByPermission: ["admin"] },
        { permissions: [] }
      );
      expect(filtered.some((r) => r.path === "/admin")).toBe(false);
    });

    test("includes routes when user has permission", () => {
      const filtered = applyFilters(
        routes,
        {},
        { permissions: ["admin"] }
      );
      expect(filtered.some((r) => r.path === "/admin")).toBe(true);
    });

    test("filters by feature flags", () => {
      const filtered = applyFilters(
        routes,
        {},
        { featureFlags: [] }
      );
      expect(filtered.some((r) => r.path === "/beta")).toBe(false);
    });

    test("includes routes when feature flag is active", () => {
      const filtered = applyFilters(
        routes,
        {},
        { featureFlags: ["beta"] }
      );
      expect(filtered.some((r) => r.path === "/beta")).toBe(true);
    });

    test("applies custom filter function", () => {
      const filtered = applyFilters(
        routes,
        {},
        {
          filter: (route) => route.path !== "/docs",
        }
      );
      expect(filtered.some((r) => r.path === "/docs")).toBe(false);
    });
  });
});
