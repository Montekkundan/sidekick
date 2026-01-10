export default function BasicSearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Basic Search Demo
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          This page demonstrates exact matching search capabilities.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              How It Works
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Basic search matches the query against route names, descriptions, and paths exactly.
              Try searching for terms like:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["basic search", "basic", "search demo", "exact matching"].map((term) => (
                <code key={term} className="rounded bg-zinc-100 px-2 py-1 text-sm dark:bg-zinc-800">
                  {term}
                </code>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Default Navigation Action
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              This page uses the default <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">navigate: true</code> action,
              which means clicking a search result will navigate to the page directly.
            </p>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
              <code>{`{
  path: "/basic-search",
  name: "Basic Search Demo",
  description: "Exact matching search"
  // navigate: true is the default
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
