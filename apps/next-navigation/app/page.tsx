"use client";

import { useState } from "react";
import { SearchDialog } from "@/components/search-dialog";
import Link from "next/link";

type SearchMode = "basic" | "fuzzy" | "aliases" | "category" | "custom" | "permissions";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<SearchMode>("basic");

  const modes = {
    basic: {
      title: "Basic Search",
      description: "Exact matching with route names and paths",
      examples: ["basic search", "basic", "exact match"],
      tip: "Try searching for exact route names or their descriptions",
      demoPath: "/basic-search",
    },
    fuzzy: {
      title: "Fuzzy Matching",
      description: "Typo-tolerant search using Levenshtein distance",
      examples: ["fuzy", "fzzy match", "typo tolerence"],
      tip: "Misspell 'fuzzy' and watch it still find the right page",
      demoPath: "/fuzzy-match",
    },
    aliases: {
      title: "Aliases & Keywords",
      description: "Search using alternative terms and keywords",
      examples: ["synonyms", "alternative names", "nicknames"],
      tip: "Routes can have multiple aliases for better discoverability",
      demoPath: "/aliases",
    },
    category: {
      title: "Category Filtering",
      description: "Search within specific route categories",
      examples: ["demo pages", "demo category", "all demos"],
      tip: "Organize routes by category for easier navigation",
      demoPath: "/category",
    },
    custom: {
      title: "Custom Navigation",
      description: "Handle navigation with custom actions (copy link, preview, etc.)",
      examples: ["custom navigation", "copy link", "custom handler"],
      tip: "Disable default navigation and implement your own behavior",
      demoPath: "/custom-navigation",
    },
    permissions: {
      title: "Permission-Based",
      description: "Filter routes based on user permissions and roles",
      examples: ["permissions", "access control", "user roles"],
      tip: "Only show routes users have permission to access",
      demoPath: "/permissions",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-zinc-50 dark:to-zinc-400 sm:text-6xl">
            AI Navigation Tool
          </h1>
          <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">
            Universal AI-powered navigation for AI SDK
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Try Search
            <kbd className="ml-2 rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 dark:bg-zinc-900 dark:text-zinc-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Natural Language"
            description="Ask questions in plain English like 'Where is the settings page?'"
            icon="💬"
          />
          <FeatureCard
            title="Fuzzy Matching"
            description="Smart typo tolerance using Levenshtein distance - finds the right page even with spelling mistakes"
            icon="🎯"
          />
          <FeatureCard
            title="Permission Aware"
            description="Automatically filters routes based on user permissions and feature flags"
            icon="🔒"
          />
          <FeatureCard
            title="Framework Agnostic"
            description="Works with Next.js, SvelteKit, Remix, Astro, or any JavaScript framework"
            icon="⚡"
          />
          <FeatureCard
            title="AI SDK Integration"
            description="Built for Vercel AI SDK v6+ with native tool support and streaming"
            icon="🤖"
          />
          <FeatureCard
            title="Auto Generation"
            description="Generate navigation schemas automatically from your file structure with the CLI"
            icon="🔄"
          />
        </div>

        {/* Search Mode Demos */}
        <div className="mt-20">
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Try Different Search Modes
          </h2>
          <p className="mt-2 text-center text-zinc-600 dark:text-zinc-400">
            Click a mode to see example queries, then try them in the search dialog
          </p>

          {/* Mode Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {(Object.keys(modes) as SearchMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setActiveMode(mode)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeMode === mode
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {modes[mode].title}
              </button>
            ))}
          </div>

          {/* Active Mode Content */}
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {modes[activeMode].title}
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {modes[activeMode].description}
            </p>

            <div className="mt-6">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Try these queries:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {modes[activeMode].examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setOpen(true)}
                    className="group rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
                  >
                    &quot;{example}&quot;
                    <span className="ml-2 opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
                💡 {modes[activeMode].tip}
              </p>
              <Link
                href={modes[activeMode].demoPath}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View {modes[activeMode].title} Page
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Installation & Quick Start */}
        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Installation
            </h3>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100">
              <code>bun add ai-navigation-tool</code>
            </pre>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Also works with npm, pnpm, or yarn
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Quick Start
            </h3>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100">
              <code>{`import { navigationTool } from "ai-navigation-tool";

const tool = navigationTool({ schema });`}</code>
            </pre>
          </div>
        </div>

        {/* Full Example */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Complete Example
          </h3>
          <pre className="mt-4 overflow-auto rounded-lg bg-zinc-950 p-6 text-sm text-zinc-100">
            <code>{`import { navigationTool, defineSchema } from "ai-navigation-tool";
import { generateText, gateway } from "ai";

// Define your app's routes
const schema = defineSchema([
  { path: "/", name: "Home" },
  { path: "/docs", name: "Documentation", aliases: ["help", "guides"] },
  { path: "/settings", name: "Settings", permissions: ["user"] },
]);

// Use with AI SDK
const result = await generateText({
  model: gateway("openai/gpt-4o-mini"),
  prompt: "Where can I find the documentation?",
  tools: {
    navigate: navigationTool({ schema }),
  },
});

// AI will understand and navigate to /docs`}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/Montekkundan/sidekick/tree/main/packages/ai-navigation-tool"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/ai-navigation-tool"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              npm
            </a>
            <a
              href="https://sdk.vercel.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              AI SDK
            </a>
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
            Built by{" "}
            <a
              href="https://github.com/Montekkundan"
              className="font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              Montek Kundan
            </a>
          </p>
        </div>
      </div>

      <SearchDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}
