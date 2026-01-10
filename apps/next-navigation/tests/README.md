# Navigation E2E Tests

End-to-end tests for the AI Navigation Tool demo app.

## Prerequisites

1. The demo app must be running:

   ```bash
   bun run dev
   ```

2. The app runs on `http://localhost:3001` by default (or set `API_URL` env var)

## Running Tests

```bash
# Run all navigation tests
bun run test:e2e

# Run with different API URL
API_URL=http://localhost:3000 bun run test:e2e

# Run specific test file
bun test tests/navigation.test.ts
```

## Test Coverage

The tests cover all features documented in [ai-navigation.mdx](../../apps/www/content/docs/tools/ai-navigation.mdx):

### Basic Search (Exact Matching)

- Finding routes by exact name
- High confidence scores for exact matches

### Fuzzy Matching (Typo Tolerance)

- Typos: `fzzy` → `fuzzy`, `bsic serch` → `basic search`
- Missing letters: `hme` → `home`
- Swapped letters: `caetgory` → `category`
- Match reason explanations

### Aliases & Keywords

- Alternative names: `main` → Home, `synonyms` → Aliases
- Keywords: `levenshtein` → Fuzzy Match
- Custom action aliases: `copy link` → Custom Navigation

### Category Filtering

- Routes organized by category (`demo`)
- Category-based search

### Multiple Results & Ranking

- Returns multiple matching routes
- Confidence-based ranking (descending)
- Respects maxResults limit (5)
- Confidence scores between 0-1

### Custom Navigation Actions

- `metadata.navigate: false` support
- `metadata.customAction` support
- Action field in results

### Permissions

- Permission-based route visibility
- Access control aliases

### Route Schema Properties

- `path`, `name`, `description`
- `url`, `priority`, `category`
- `aliases`, `keywords`, `metadata`

### Edge Cases

- Empty query handling
- Very long queries
- Special characters
- Whitespace-only queries
- Irrelevant queries

### Natural Language Queries (AI SDK Integration)

- "show me X" queries
- "where is X" queries
- "how to X" queries
- "find X" queries

## Test Structure

```
tests/
└── navigation.test.ts    # All E2E tests
```

## Adding New Tests

When adding new routes to the schema, add corresponding tests:

```typescript
it("should find NewPage via search", async () => {
  const response = await search("new page");
  expect(response.found).toBe(true);
  const result = response.results?.find((r) => r.route.path === "/new-page");
  expect(result).toBeDefined();
});
```

## Debugging Failed Tests

If tests fail, check:

1. **Is the dev server running?**

   ```bash
   curl http://localhost:3001/api/navigate -X POST -H "Content-Type: application/json" -d '{"query":"home"}'
   ```

2. **Is the schema updated?**
   Check [lib/schema.ts](../lib/schema.ts) for route definitions

3. **Is AI SDK configured?**
   Check `.env` for `OPENAI_API_KEY` or `AI_GATEWAY_API_KEY`

4. **Check route.ts logs:**
   The API route logs full AI SDK response for debugging
