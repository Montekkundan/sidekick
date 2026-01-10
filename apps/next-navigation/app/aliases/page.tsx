export default function AliasesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Aliases & Keywords Demo
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          This page demonstrates how aliases and keywords improve discoverability.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Multiple Ways to Find This Page
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              This page can be found using any of these search terms:
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Aliases:
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["alternative names", "synonyms", "search terms", "nicknames"].map((alias) => (
                    <code key={alias} className="rounded bg-blue-50 px-2 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {alias}
                    </code>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Keywords:
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["discoverability", "search optimization", "multiple terms", "seo"].map((keyword) => (
                    <code key={keyword} className="rounded bg-green-50 px-2 py-1 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      {keyword}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Schema Configuration
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Add aliases and keywords to make routes easier to find:
            </p>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
              <code>{`{
  path: "/aliases",
  name: "Aliases & Keywords Demo",
  aliases: [
    "alternative names",
    "synonyms",
    "search terms"
  ],
  keywords: [
    "discoverability",
    "search optimization",
    "multiple terms"
  ]
}`}</code>
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Best Practices
            </h2>
            <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• Use aliases for common alternative names users might search for</li>
              <li>• Add keywords for related concepts and terms</li>
              <li>• Include common misspellings if they&apos;re predictable</li>
              <li>• Think about how users would describe the page in conversation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
