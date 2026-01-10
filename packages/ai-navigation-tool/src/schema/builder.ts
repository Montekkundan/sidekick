import type { NavigationSchema, Route } from "../types";

/**
 * Fluent builder for creating navigation schemas
 *
 * @example
 * ```ts
 * const schema = createSchema()
 *   .route("/", "Home", { description: "Landing page" })
 *   .route("/docs", "Documentation", { aliases: ["help", "guides"] })
 *   .route("/settings", "Settings", { permissions: ["user"] })
 *   .build();
 * ```
 */
export class SchemaBuilder {
  private _routes: Route[] = [];
  private metadata: Record<string, unknown> = {};

  /**
   * Add a route to the schema
   */
  route(
    path: string,
    name: string,
    options?: Omit<Route, "path" | "name">
  ): this {
    this._routes.push({
      path,
      name,
      ...options,
    });
    return this;
  }

  /**
   * Add multiple routes at once
   */
  addRoutes(routes: Route[]): this {
    this._routes.push(...routes);
    return this;
  }

  /**
   * Add a category of routes
   */
  category(
    categoryName: string,
    routes: Array<Omit<Route, "category">>
  ): this {
    for (const route of routes) {
      this._routes.push({
        ...route,
        category: categoryName,
      });
    }
    return this;
  }

  /**
   * Add custom metadata to the schema
   */
  meta(key: string, value: unknown): this {
    this.metadata[key] = value;
    return this;
  }

  /**
   * Build the final schema
   */
  build(): NavigationSchema {
    return {
      routes: this._routes,
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      framework: "manual",
      metadata: Object.keys(this.metadata).length > 0 ? this.metadata : undefined,
    };
  }
}

/**
 * Create a new schema builder
 */
export const createSchema = (): SchemaBuilder => new SchemaBuilder();

/**
 * Create a schema from a plain object
 */
export const defineSchema = (
  routes: Route[],
  options?: Omit<NavigationSchema, "routes">
): NavigationSchema => ({
  routes,
  version: options?.version ?? "1.0.0",
  generatedAt: options?.generatedAt ?? new Date().toISOString(),
  framework: options?.framework ?? "manual",
  metadata: options?.metadata,
});

/**
 * Helper to define a single route with full type safety
 */
export const defineRoute = (route: Route): Route => route;

/**
 * Helper to define multiple routes
 */
export const defineRoutes = (routes: Route[]): Route[] => routes;

/**
 * Merge multiple schemas into one
 */
export const mergeSchemas = (
  ...schemas: NavigationSchema[]
): NavigationSchema => {
  const allRoutes: Route[] = [];
  const seenPaths = new Set<string>();

  for (const schema of schemas) {
    for (const route of schema.routes) {
      if (!seenPaths.has(route.path)) {
        seenPaths.add(route.path);
        allRoutes.push(route);
      }
    }
  }

  return {
    routes: allRoutes,
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    framework: "manual",
  };
};

/**
 * Extend an existing schema with additional routes
 */
export const extendSchema = (
  base: NavigationSchema,
  additions: Route[]
): NavigationSchema => ({
  ...base,
  routes: [...base.routes, ...additions],
  generatedAt: new Date().toISOString(),
});
