"use client";

import { useState } from "react";

export default function CustomNavigationPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Custom Navigation Demo
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          This page demonstrates custom navigation behavior with <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">navigate: false</code>.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Why Disable Default Navigation?
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Sometimes you want to handle navigation yourself:
            </p>
            <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• Show a confirmation dialog before navigating</li>
              <li>• Track analytics before redirecting</li>
              <li>• Open in a modal or sidebar instead</li>
              <li>• Copy the link instead of navigating</li>
              <li>• Perform custom validation or checks</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Schema Configuration
            </h2>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
              <code>{`{
  path: "/custom-navigation",
  name: "Custom Navigation Demo",
  // Disable automatic navigation
  metadata: {
    navigate: false,
    customAction: "copy-link"
  }
}`}</code>
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Custom Handler in Search Dialog
            </h2>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
              <code>{`const handleNavigate = (result: SearchResult) => {
  const route = result.route;
  
  // Check for custom navigation
  if (route.metadata?.navigate === false) {
    const action = route.metadata.customAction;
    
    switch (action) {
      case "copy-link":
        navigator.clipboard.writeText(route.path);
        toast.success("Link copied!");
        break;
      case "preview":
        openPreviewModal(route.path);
        break;
      case "confirm":
        if (confirm("Navigate to " + route.name + "?")) {
          router.push(route.path);
        }
        break;
    }
    return;
  }
  
  // Default navigation
  router.push(route.path);
};`}</code>
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Try It Out
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Search for this page and notice how it copies the link instead of navigating:
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {copied ? "✓ Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
