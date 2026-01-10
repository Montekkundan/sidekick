export default function FuzzyMatchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Fuzzy Matching Demo
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          This page demonstrates typo-tolerant search using Levenshtein distance.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Try These Typos
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              The fuzzy search algorithm will still find this page even with spelling mistakes:
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                { wrong: "fuzy", right: "fuzzy" },
                { wrong: "mathc", right: "match" },
                { wrong: "fzzy", right: "fuzzy" },
                { wrong: "fuzzie", right: "fuzzy" },
              ].map(({ wrong, right }) => (
                <div key={wrong} className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                  <code className="text-red-500">{wrong}</code>
                  <span className="mx-2 text-zinc-400">→</span>
                  <code className="text-green-500">{right}</code>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              How It Works
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Uses Levenshtein distance to calculate similarity between search query and route names.
              The algorithm calculates the minimum number of single-character edits needed to transform
              one string into another.
            </p>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
              <code>{`const tool = navigationTool({
  schema,
  results: {
    threshold: 0.3, // Lower = more lenient
    includeConfidence: true
  }
});`}</code>
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Confidence Scores
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Each result includes a confidence score (0-1) indicating how well it matches:
            </p>
            <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• 1.0 = Perfect exact match</li>
              <li>• 0.8-0.99 = Very close match (starts with or contains)</li>
              <li>• 0.5-0.79 = Good fuzzy match</li>
              <li>• 0.3-0.49 = Acceptable match (above threshold)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
