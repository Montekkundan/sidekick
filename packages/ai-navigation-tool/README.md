# AI Navigation Tool

Universal AI-powered navigation tool for AI SDK. Helps AI understand and navigate your app's routes.

## Requirements

- Node.js 18+ or Bun 1.0+
- AI SDK v6.0.0+
- Zod v4.0.0+

## Installation

```bash
npm install ai-navigation-tool
# or
bun add ai-navigation-tool
# or
pnpm add ai-navigation-tool
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/Montekkundan/sidekick.git
cd sidekick/packages/ai-navigation-tool

# Install dependencies
bun install
```

### Building

```bash
# Build the package
bun run build
```

### Testing

The package includes comprehensive test coverage across three test files:

**`src/__tests__/schema.test.ts`** - Schema Builder Tests

- Tests `defineSchema()` for creating schemas from route arrays
- Tests `createSchema()` fluent builder API
- Tests `mergeSchemas()` for combining multiple schemas
- Tests `extendSchema()` for adding routes to existing schemas
- Validates schema metadata and route structure

**`src/__tests__/search.test.ts`** - Fuzzy Search Tests

- Tests Levenshtein distance calculations for string similarity
- Tests tokenization and text normalization
- Tests fuzzy matching with exact, starts-with, contains, and approximate matching
- Tests ranking and confidence score calculation
- Tests multi-route search with different confidence thresholds

**`src/__tests__/validator.test.ts`** - Validation and Filtering Tests

- Tests glob pattern matching (\*, \*\*, ?)
- Tests include/exclude pattern filtering
- Tests permission-based route filtering
- Tests feature flag filtering
- Tests combined filter application

Run the tests:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test src/__tests__/schema.test.ts

# Run with coverage (if configured)
bun test --coverage
```

### Type Checking

```bash
bun run typecheck
```

### Publishing

```bash
# Create a changeset (for version bumping)
bun run change

# Version packages based on changesets
bun run version

# Publish to npm
bun run release
```

## Quick Start

```typescript
import { navigationTool, defineSchema } from "ai-navigation-tool";
import { generateText, gateway } from "ai";

// Define your routes
const schema = defineSchema([
  { path: "/", name: "Home" },
  { path: "/docs", name: "Documentation", aliases: ["help", "guides"] },
  { path: "/settings", name: "Settings" },
]);

// Use with AI SDK
const result = await generateText({
  model: gateway("openai/gpt-4o-mini"),
  prompt: "Where can I find the documentation?",
  tools: {
    navigate: navigationTool({ schema }),
  },
});
```

## Features

- **Framework Agnostic** - Works with any JavaScript/TypeScript framework
- **Fuzzy Search** - Smart matching with typo tolerance
- **Custom Filters** - Filter routes with your own logic (permissions, subscriptions, feature flags)
- **Glob Patterns** - Include/exclude routes like tsconfig
- **Zero Config** - Works out of the box with sensible defaults
- **CLI** - Generate schemas from Next.js projects

## Usage

### Manual Schema Definition

```typescript
import { defineSchema, createSchema } from "ai-navigation-tool";

// Option 1: Array of routes
const schema = defineSchema([
  {
    path: "/",
    name: "Home",
    description: "Landing page",
  },
  {
    path: "/docs",
    name: "Documentation",
    aliases: ["help", "guides"],
    keywords: ["learn", "tutorial"],
    category: "docs",
  },
  {
    path: "/admin",
    name: "Admin Panel",
    metadata: { requiresAdmin: true },
    category: "admin",
  },
]);

// Option 2: Fluent builder
const schema = createSchema()
  .route("/", "Home", { description: "Landing page" })
  .route("/docs", "Documentation", { aliases: ["help"] })
  .category("settings", [
    { path: "/settings/profile", name: "Profile" },
    { path: "/settings/account", name: "Account" },
  ])
  .build();
```

### Next.js Auto-Generation

```typescript
import { navigationTool, generateNextSchema } from "ai-navigation-tool/next";

// Generate schema from your app directory
const schema = await generateNextSchema({
  rootDir: "./app",
  exclude: ["api/**", "admin/**"],
});

// Use the generated schema
const result = await generateText({
  model: gateway("openai/gpt-4o-mini"),
  prompt: "Where is the settings page?",
  tools: {
    navigate: navigationTool({ schema }),
  },
});
```

### CLI Usage

```bash
# Generate from Next.js App Router
bunx ai-navigation generate -f next -d ./app -o nav-schema.json

# Generate TypeScript file
bunx ai-navigation generate -f next --format typescript -o nav-schema.ts

# With exclusions
bunx ai-navigation generate -f next --exclude "api/**,admin/**"

# Create manual template
bunx ai-navigation generate -f manual -o nav-schema.ts
```

## Configuration

### Custom Filter Function

The most powerful way to control route visibility. Use your own logic to filter routes:

```typescript
// Define your context type
type UserContext = {
  role: "admin" | "user" | "guest";
  subscription: "free" | "pro" | "enterprise";
  featureFlags: string[];
};

const tool = navigationTool<UserContext>({
  schema,
  // Your custom filter logic
  filter: (route, context) => {
    // Admin-only routes
    if (route.metadata?.requiresAdmin && context.role !== "admin") {
      return false;
    }

    // Subscription-based access
    if (route.metadata?.requiresPro) {
      if (!["pro", "enterprise"].includes(context.subscription)) {
        return false;
      }
    }

    // Feature flag check
    if (route.metadata?.featureFlag) {
      if (!context.featureFlags.includes(route.metadata.featureFlag)) {
        return false;
      }
    }

    return true;
  },
  // Pass your context data
  context: {
    role: currentUser.role,
    subscription: currentUser.subscription,
    featureFlags: getFeatureFlags(currentUser),
  },
});
```

### Async Filter (Database/API Lookup)

```typescript
const tool = navigationTool<{ userId: string }>({
  schema,
  // Filter can be async!
  filter: async (route, ctx) => {
    if (route.metadata?.checkAccess) {
      const hasAccess = await checkUserAccess(ctx.userId, route.path);
      return hasAccess;
    }
    return true;
  },
  context: { userId: session.userId },
});
```

### Glob Patterns (Path-Based Filtering)

```typescript
const tool = navigationTool({
  schema,
  globFilter: {
    include: ["docs/**", "settings/**"],
    exclude: ["**/internal/**", "api/**"],
  },
});
```

### Combining Filters

```typescript
const tool = navigationTool<UserContext>({
  schema,
  // Custom logic filter
  filter: (route, ctx) => {
    if (route.metadata?.requiresAdmin) {
      return ctx.role === "admin";
    }
    return true;
  },
  context: userContext,
  // Path-based filter
  globFilter: {
    exclude: ["api/**", "**/internal/**"],
  },
});
```

### Result Options

```typescript
const tool = navigationTool({
  schema,
  results: {
    mode: "multiple", // or "single" (default)
    maxResults: 5,
    includeConfidence: true,
    threshold: 0.3, // minimum match score
  },
});
```

### Actions

```typescript
const tool = navigationTool({
  schema,
  actions: {
    navigate: true, // Default
    openNewTab: true,
    copyLink: true,
    preview: true,
  },
});
```

## Route Schema

```typescript
type Route = {
  path: string; // URL path
  name: string; // Human-readable name
  description?: string; // Description for AI context
  aliases?: string[]; // Alternative search terms
  keywords?: string[]; // Additional keywords
  category?: string; // Route category
  priority?: number; // Search priority (higher = more important)
  params?: Record<string, string>; // Dynamic parameters
  isIndex?: boolean; // Is this an index page
  isDynamic?: boolean; // Has dynamic segments
  metadata?: Record<string, unknown>; // Custom data for filtering
};
```

## Tool Output

```typescript
type NavigationToolOutput = {
  found: boolean;
  result?: NavigationResult; // Single result
  results?: NavigationResult[]; // Multiple results
  query: string;
  totalRoutes: number;
  error?: string;
};

type NavigationResult = {
  route: Route;
  confidence: number; // 0-1 match score
  url: string;
  action?: NavigationAction;
  matchReason?: string;
};
```

## Examples

### Basic Chat Navigation

```typescript
const result = await generateText({
  model: gateway("openai/gpt-4o-mini"),
  system: "Help users navigate the app.",
  prompt: "I need to change my password",
  tools: {
    navigate: navigationTool({ schema }),
  },
});

// AI will use the tool and respond:
// "You can change your password in Settings > Security.
//  Would you like me to take you there?"
```

### With Multiple Results

```typescript
const tool = navigationTool({
  schema,
  results: { mode: "multiple", maxResults: 3 },
});

// Returns top 3 matches with confidence scores
```

### Server Component with Filters (Next.js)

```typescript
// app/api/chat/route.ts
import { navigationTool, defineSchema } from "ai-navigation-tool";
import { streamText, gateway } from "ai";
import { getSession } from "@/lib/auth";

const schema = defineSchema([
  { path: "/", name: "Home" },
  { path: "/admin", name: "Admin Panel", metadata: { requiresAdmin: true } },
  { path: "/billing", name: "Billing", metadata: { requiresPro: true } },
]);

type UserContext = {
  isAdmin: boolean;
  subscription: string;
};

export async function POST(req: Request) {
  const { messages } = await req.json();
  const session = await getSession();

  const result = streamText({
    model: gateway("openai/gpt-4o-mini"),
    messages,
    tools: {
      navigate: navigationTool<UserContext>({
        schema,
        filter: (route, ctx) => {
          if (route.metadata?.requiresAdmin && !ctx.isAdmin) return false;
          if (route.metadata?.requiresPro && ctx.subscription === "free")
            return false;
          return true;
        },
        context: {
          isAdmin: session.user.role === "admin",
          subscription: session.user.subscription,
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

## License

MIT
