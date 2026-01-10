# AI Navigation Demo

A Next.js demo application showcasing the `ai-navigation-tool` package.

## Features

- AI-powered search using natural language
- Fuzzy matching with typo tolerance
- Permission-aware route filtering
- Keyboard shortcut support (⌘K)

## Getting Started

```bash
# From the monorepo root
bun install

# Run the demo
bun run dev --filter @repo/next-navigation
```

## Project Structure

```
app/
├── api/
│   └── navigate/          # API route for navigation tool
├── basic-search/          # Basic search demo
├── fuzzy-match/           # Fuzzy matching demo
├── aliases/               # Aliases & keywords demo
├── category/              # Category filtering demo
├── custom-navigation/     # Custom actions demo
├── permissions/           # Permission-based routing demo
└── page.tsx               # Home page with search modes
components/
├── navigation.tsx         # Top navigation bar
└── search-dialog.tsx      # AI-powered search dialog
lib/
└── schema.ts              # Navigation schema definition
tests/
├── navigation.test.ts     # E2E tests for all features
└── README.md              # Testing documentation
```

## How It Works

1. **Schema Definition** - Routes are defined in `lib/schema.ts` with names, descriptions, and keywords
2. **Navigation Tool** - The `ai-navigation-tool` package provides fuzzy search over the schema
3. **Search Dialog** - Users can search using natural language queries
4. **API Route** - The `/api/navigate` endpoint handles search requests

## Usage

Press `⌘K` (or `Ctrl+K`) to open the search dialog and ask questions like:

- "Where can I find settings?"
- "Show me the documentation"
- "How do I install this?"

## Testing

The demo includes a comprehensive E2E test suite to verify all features of `ai-navigation-tool`.

### Running Tests

```bash
# Start the dev server first
bun run dev -- --port 3001

# Run E2E tests (in another terminal)
bun run test:e2e
```

### Test Coverage

| Feature                | Tests | Description                                                    |
| ---------------------- | ----- | -------------------------------------------------------------- |
| **API Health**         | 2     | Basic API connectivity and response structure                  |
| **Basic Search**       | 4     | Exact name matching, finding specific pages                    |
| **Fuzzy Matching**     | 5     | Typo tolerance (`fzzy` → `fuzzy`), missing/swapped letters     |
| **Aliases & Keywords** | 6     | Alternative search terms (`main` → Home, `synonyms` → Aliases) |
| **Category Filtering** | 2     | Routes organized and filtered by category                      |
| **Multiple Results**   | 4     | Ranking by confidence, respecting maxResults limit             |
| **Custom Actions**     | 4     | `navigate: false`, custom handlers like `copy-link`            |
| **Permissions**        | 3     | Permission-based route filtering                               |
| **Route Properties**   | 5     | Schema fields: path, name, description, url, priority          |
| **Edge Cases**         | 5     | Empty queries, special characters, very long inputs            |
| **Natural Language**   | 4     | Queries like "show me", "where is", "how to", "find"           |
| **Demo Pages**         | 7     | All demo pages accessible via search                           |

**Total: 51 tests, 107 assertions**

### Test Examples

```typescript
// Fuzzy matching with typos
it("should find page despite typos - 'fzzy' -> 'fuzzy'", async () => {
  const response = await search("fzzy");
  expect(response.found).toBe(true);
  const fuzzyResult = response.results?.find(
    (r) => r.route.path === "/fuzzy-match"
  );
  expect(fuzzyResult).toBeDefined();
});

// Alias search
it("should find Home via alias 'main'", async () => {
  const response = await search("main");
  expect(response.found).toBe(true);
  const homeResult = response.results?.find((r) => r.route.path === "/");
  expect(homeResult).toBeDefined();
});

// Natural language queries
it("should understand 'where is' queries", async () => {
  const response = await search("where is fuzzy matching");
  expect(response.found).toBe(true);
});
```
