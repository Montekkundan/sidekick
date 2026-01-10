import type { Route, NavigationResult, ResultOptions } from "../types";

/**
 * Calculates string similarity using Levenshtein distance
 * Returns a score between 0 and 1
 */
export const levenshteinSimilarity = (a: string, b: string): number => {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();

  if (aLower === bLower) return 1;
  if (aLower.length === 0) return 0;
  if (bLower.length === 0) return 0;

  const matrix: number[][] = [];

  for (let i = 0; i <= bLower.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= aLower.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bLower.length; i++) {
    for (let j = 1; j <= aLower.length; j++) {
      if (bLower[i - 1] === aLower[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  const distance = matrix[bLower.length][aLower.length];
  const maxLength = Math.max(aLower.length, bLower.length);

  return 1 - distance / maxLength;
};

/**
 * Tokenizes a string into searchable terms
 */
export const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((token) => token.length > 0);
};

/**
 * Extracts searchable text from a route
 */
export const getRouteSearchText = (route: Route): string[] => {
  const texts: string[] = [
    route.name,
    route.path,
    route.description ?? "",
    ...(route.aliases ?? []),
    ...(route.keywords ?? []),
    route.category ?? "",
  ];

  return texts.flatMap(tokenize);
};

/**
 * Calculates how well a query matches a route
 * Returns a score between 0 and 1
 */
export const calculateMatchScore = (query: string, route: Route): number => {
  const queryTokens = tokenize(query);
  const routeTokens = getRouteSearchText(route);

  if (queryTokens.length === 0 || routeTokens.length === 0) {
    return 0;
  }

  let totalScore = 0;
  let matchedTokens = 0;

  for (const queryToken of queryTokens) {
    let bestTokenScore = 0;

    for (const routeToken of routeTokens) {
      // Exact match
      if (routeToken === queryToken) {
        bestTokenScore = Math.max(bestTokenScore, 1);
        continue;
      }

      // Starts with
      if (routeToken.startsWith(queryToken)) {
        bestTokenScore = Math.max(bestTokenScore, 0.9);
        continue;
      }

      // Contains
      if (routeToken.includes(queryToken)) {
        bestTokenScore = Math.max(bestTokenScore, 0.7);
        continue;
      }

      // Fuzzy match
      const similarity = levenshteinSimilarity(queryToken, routeToken);
      if (similarity > 0.6) {
        bestTokenScore = Math.max(bestTokenScore, similarity * 0.8);
      }
    }

    if (bestTokenScore > 0) {
      matchedTokens++;
    }
    totalScore += bestTokenScore;
  }

  // Calculate final score
  const averageScore = totalScore / queryTokens.length;
  const coverageBonus = matchedTokens / queryTokens.length;

  // Apply priority boost
  const priorityBoost = route.priority ? Math.min(route.priority / 100, 0.2) : 0;

  // Index pages get slight boost for generic queries
  const indexBoost = route.isIndex ? 0.05 : 0;

  return Math.min(
    1,
    averageScore * 0.6 + coverageBonus * 0.3 + priorityBoost + indexBoost
  );
};

/**
 * Gets the match reason for a result
 */
export const getMatchReason = (query: string, route: Route): string => {
  const queryLower = query.toLowerCase();
  const nameLower = route.name.toLowerCase();

  if (nameLower === queryLower) {
    return "Exact name match";
  }

  if (nameLower.includes(queryLower)) {
    return `Name contains "${query}"`;
  }

  if (route.path.toLowerCase().includes(queryLower)) {
    return `Path contains "${query}"`;
  }

  if (route.aliases?.some((a) => a.toLowerCase().includes(queryLower))) {
    return `Alias match`;
  }

  if (route.keywords?.some((k) => k.toLowerCase().includes(queryLower))) {
    return `Keyword match`;
  }

  if (route.description?.toLowerCase().includes(queryLower)) {
    return `Description match`;
  }

  return "Fuzzy match";
};

/**
 * Search routes and return ranked results
 */
export const searchRoutes = (
  query: string,
  routes: Route[],
  options: ResultOptions = {}
): NavigationResult[] => {
  const {
    mode = "single",
    maxResults = 5,
    includeConfidence = true,
    threshold = 0.3,
  } = options;

  // Score all routes
  const scored = routes
    .map((route) => ({
      route,
      score: calculateMatchScore(query, route),
    }))
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score);

  // Limit results
  const limited = mode === "single" ? scored.slice(0, 1) : scored.slice(0, maxResults);

  // Convert to NavigationResult
  return limited.map(({ route, score }) => ({
    route,
    confidence: includeConfidence ? Math.round(score * 100) / 100 : score,
    url: route.path,
    matchReason: getMatchReason(query, route),
  }));
};
