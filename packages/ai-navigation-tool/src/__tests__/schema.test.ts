import { describe, test, expect } from "bun:test";
import {
  defineSchema,
  createSchema,
  defineRoute,
  defineRoutes,
  mergeSchemas,
  extendSchema,
} from "../schema/builder";

describe("Schema Builder", () => {
  describe("defineSchema", () => {
    test("creates a valid schema from routes array", () => {
      const schema = defineSchema([
        { path: "/", name: "Home" },
        { path: "/docs", name: "Documentation" },
      ]);

      expect(schema.routes).toHaveLength(2);
      expect(schema.routes[0].path).toBe("/");
      expect(schema.routes[0].name).toBe("Home");
      expect(schema.version).toBe("1.0.0");
      expect(schema.framework).toBe("manual");
      expect(schema.generatedAt).toBeDefined();
    });

    test("accepts custom options", () => {
      const schema = defineSchema(
        [{ path: "/", name: "Home" }],
        { version: "2.0.0", framework: "next" }
      );

      expect(schema.version).toBe("2.0.0");
      expect(schema.framework).toBe("next");
    });
  });

  describe("createSchema (fluent builder)", () => {
    test("builds schema with route method", () => {
      const schema = createSchema()
        .route("/", "Home")
        .route("/docs", "Documentation", { description: "Docs page" })
        .build();

      expect(schema.routes).toHaveLength(2);
      expect(schema.routes[1].description).toBe("Docs page");
    });

    test("builds schema with category method", () => {
      const schema = createSchema()
        .category("settings", [
          { path: "/settings/profile", name: "Profile" },
          { path: "/settings/account", name: "Account" },
        ])
        .build();

      expect(schema.routes).toHaveLength(2);
      expect(schema.routes[0].category).toBe("settings");
      expect(schema.routes[1].category).toBe("settings");
    });

    test("builds schema with meta method", () => {
      const schema = createSchema()
        .route("/", "Home")
        .meta("author", "test")
        .build();

      expect(schema.metadata?.author).toBe("test");
    });
  });

  describe("defineRoute", () => {
    test("returns the route with type safety", () => {
      const route = defineRoute({
        path: "/test",
        name: "Test",
        permissions: ["admin"],
      });

      expect(route.path).toBe("/test");
      expect(route.permissions).toEqual(["admin"]);
    });
  });

  describe("defineRoutes", () => {
    test("returns routes array with type safety", () => {
      const routes = defineRoutes([
        { path: "/", name: "Home" },
        { path: "/about", name: "About" },
      ]);

      expect(routes).toHaveLength(2);
    });
  });

  describe("mergeSchemas", () => {
    test("merges multiple schemas without duplicates", () => {
      const schema1 = defineSchema([
        { path: "/", name: "Home" },
        { path: "/docs", name: "Docs" },
      ]);

      const schema2 = defineSchema([
        { path: "/docs", name: "Documentation" }, // duplicate path
        { path: "/about", name: "About" },
      ]);

      const merged = mergeSchemas(schema1, schema2);

      expect(merged.routes).toHaveLength(3);
      // First schema's version of /docs should win
      expect(merged.routes.find((r) => r.path === "/docs")?.name).toBe("Docs");
    });
  });

  describe("extendSchema", () => {
    test("extends schema with additional routes", () => {
      const base = defineSchema([{ path: "/", name: "Home" }]);

      const extended = extendSchema(base, [
        { path: "/new", name: "New Page" },
      ]);

      expect(extended.routes).toHaveLength(2);
    });
  });
});
