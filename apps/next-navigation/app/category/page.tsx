export default function CategoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Category Filtering Demo
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          This page demonstrates how categories help organize and filter routes.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Category: <span className="text-blue-500">demo</span>
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              This page belongs to the &quot;demo&quot; category, along with other demonstration pages.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Search by Category
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Users can search for all pages in a category:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["demo pages", "show demo", "demo category", "all demos"].map((query) => (
                <code key={query} className="rounded bg-zinc-100 px-2 py-1 text-sm dark:bg-zinc-800">
                  {query}
                </code>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Organizing Routes
            </h2>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
              <code>{`const schema = defineSchema([
  // Demo pages
  { path: "/basic-search", category: "demo" },
  { path: "/fuzzy-match", category: "demo" },
  { path: "/aliases", category: "demo" },
  
  // Settings pages
  { path: "/settings/profile", category: "settings" },
  { path: "/settings/account", category: "settings" },
  
  // Documentation pages
  { path: "/docs/getting-started", category: "docs" },
  { path: "/docs/api", category: "docs" },
]);`}</code>
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Use Cases
            </h2>
            <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• Group related pages together (e.g., all settings, all docs)</li>
              <li>• Filter results by category in the UI</li>
              <li>• Show category badges in search results</li>
              <li>• Allow users to browse by category</li>
              <li>• Improve AI understanding of page relationships</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
