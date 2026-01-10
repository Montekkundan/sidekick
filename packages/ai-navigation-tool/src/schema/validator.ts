import type {
  NavigationSchema,
  Route,
  FilterOptions,
  PermissionContext,
} from "../types";

/**
 * Validates a navigation schema
 */
export const validateSchema = (schema: unknown): schema is NavigationSchema => {
  if (!schema || typeof schema !== "object") {
    return false;
  }

  const s = schema as Record<string, unknown>;

  if (!Array.isArray(s.routes)) {
    return false;
  }

  return s.routes.every((route) => validateRoute(route));
};

/**
 * Validates a single route
 */
export const validateRoute = (route: unknown): route is Route => {
  if (!route || typeof route !== "object") {
    return false;
  }

  const r = route as Record<string, unknown>;

  if (typeof r.path !== "string" || !r.path.startsWith("/")) {
    return false;
  }

  if (typeof r.name !== "string" || r.name.length === 0) {
    return false;
  }

  return true;
};

/**
 * Creates a schema validation error
 */
export const createValidationError = (
  message: string,
  path?: string
): Error => {
  const error = new Error(
    path ? `Schema validation error at ${path}: ${message}` : message
  );
  error.name = "SchemaValidationError";
  return error;
};

/**
 * Deeply validates and returns typed schema
 */
export const parseSchema = (schema: unknown): NavigationSchema => {
  if (!validateSchema(schema)) {
    throw createValidationError("Invalid navigation schema");
  }

  return {
    ...schema,
    version: schema.version ?? "1.0.0",
    generatedAt: schema.generatedAt ?? new Date().toISOString(),
    framework: schema.framework ?? "manual",
  };
};

/**
 * Simple glob pattern matching
 * Supports: *, **, ?
 */
export const matchGlob = (pattern: string, path: string): boolean => {
  // Handle special case: /path/** should match /path as well as /path/anything
  if (pattern.endsWith("/**")) {
    const basePattern = pattern.slice(0, -3);
    if (path === basePattern) {
      return true;
    }
  }

  // Escape regex special chars except our glob chars
  const regexPattern = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "<<<DOUBLE_STAR>>>")
    .replace(/\*/g, "[^/]*")
    .replace(/<<<DOUBLE_STAR>>>/g, ".*")
    .replace(/\?/g, ".");

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
};

/**
 * Filters routes based on include/exclude glob patterns
 */
export const filterByGlob = (
  routes: Route[],
  options: FilterOptions
): Route[] => {
  const { include, exclude } = options;

  return routes.filter((route) => {
    const path = route.path;

    // If include patterns specified, route must match at least one
    if (include && include.length > 0) {
      const included = include.some((pattern) => matchGlob(pattern, path));
      if (!included) {
        return false;
      }
    }

    // If exclude patterns specified, route must not match any
    if (exclude && exclude.length > 0) {
      const excluded = exclude.some((pattern) => matchGlob(pattern, path));
      if (excluded) {
        return false;
      }
    }

    return true;
  });
};

/**
 * @deprecated Use generic `filter` function instead
 * Filters routes based on permissions (legacy)
 */
export const filterByPermissions = (
  routes: Route[],
  context: PermissionContext,
  options: FilterOptions
): Route[] => {
  const userPermissions = new Set(context.permissions ?? []);
  const activeFlags = new Set(context.featureFlags ?? []);

  return routes.filter((route) => {
    // Custom filter takes precedence
    if (context.filter && !context.filter(route, context)) {
      return false;
    }

    // Check required permissions
    if (route.permissions && route.permissions.length > 0) {
      const hasPermission = route.permissions.some((p) =>
        userPermissions.has(p)
      );
      if (!hasPermission) {
        return false;
      }
    }

    // Check if route's feature flag is active
    if (route.featureFlag && !activeFlags.has(route.featureFlag)) {
      return false;
    }

    return true;
  });
};

/**
 * @deprecated Use generic `filter` function with `globFilter` instead
 * Applies all filters to routes (legacy)
 */
export const applyFilters = (
  routes: Route[],
  filter?: FilterOptions,
  permissions?: PermissionContext
): Route[] => {
  let filtered = routes;

  if (filter) {
    filtered = filterByGlob(filtered, filter);
  }

  if (permissions) {
    filtered = filterByPermissions(filtered, permissions, filter ?? {});
  }

  return filtered;
};
