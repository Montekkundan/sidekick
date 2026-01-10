"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type SearchResult = {
  route: {
    path: string;
    name: string;
    description?: string;
    metadata?: Record<string, unknown>;
  };
  confidence: number;
  matchReason?: string;
};

type SearchResponse = {
  found: boolean;
  result?: SearchResult;
  results?: SearchResult[];
  query: string;
  error?: string;
};

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  // Search function
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/navigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data: SearchResponse = await response.json();

      if (data.error) {
        setError(data.error);
        setResults([]);
      } else if (data.results) {
        setResults(data.results);
      } else if (data.result) {
        setResults([data.result]);
      } else {
        setResults([]);
      }
    } catch {
      setError("Failed to search. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  // Handle navigation with custom actions support
  const handleNavigate = (result: SearchResult) => {
    const route = result.route;

    // Check for custom navigation metadata
    if (route.metadata?.navigate === false) {
      const action = route.metadata.customAction as string;

      switch (action) {
        case "copy-link":
          // Copy link to clipboard
          navigator.clipboard.writeText(window.location.origin + route.path);
          setCopied(route.path);
          setTimeout(() => setCopied(null), 2000);
          return;
        case "preview":
          // Open in preview modal (placeholder)
          console.log("Preview:", route.path);
          return;
        case "new-tab":
          // Open in new tab
          window.open(route.path, "_blank", "noopener,noreferrer");
          onOpenChange(false);
          return;
        default:
          break;
      }
    }

    // Default navigation
    router.push(route.path);
    onOpenChange(false);
    setQuery("");
    setResults([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Search input */}
        <div className="flex items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-zinc-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Ask AI where to find..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent py-4 px-3 text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-50"
            autoFocus
          />
          {loading && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
          )}
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-auto p-2">
          {error && (
            <div className="px-3 py-6 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {!error && results.length === 0 && query && !loading && (
            <div className="px-3 py-6 text-center text-sm text-zinc-500">
              No results found. Try a different query.
            </div>
          )}

          {!error && results.length === 0 && !query && (
            <div className="px-3 py-6 text-center text-sm text-zinc-500">
              Ask questions like &quot;Where is settings?&quot; or &quot;Show me documentation&quot;
            </div>
          )}

          {results.map((result, index) => {
            const isCustomAction = result.route.metadata?.navigate === false;
            const customAction = result.route.metadata?.customAction as string;
            const isCopied = copied === result.route.path;

            return (
              <button
                key={result.route.path}
                onClick={() => handleNavigate(result)}
                className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {isCustomAction && customAction === "copy-link" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500"
                    >
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {result.route.name}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {Math.round(result.confidence * 100)}% match
                    </span>
                  </div>
                  <div className="truncate text-sm text-zinc-500">
                    {result.route.path}
                  </div>
                  {result.route.description && (
                    <div className="truncate text-xs text-zinc-400 mt-1">
                      {result.route.description}
                    </div>
                  )}
                  {isCustomAction && (
                    <div className="mt-1 text-xs text-blue-500">
                      {isCopied ? "✓ Copied!" : `Custom action: ${customAction}`}
                    </div>
                  )}
                </div>
                {index === 0 && !isCopied && (
                  <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                    ↵
                  </kbd>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200 px-4 py-2 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Powered by ai-navigation-tool</span>
            <div className="flex items-center gap-2">
              <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                esc
              </kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
