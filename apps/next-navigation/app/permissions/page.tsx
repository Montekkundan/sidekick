export default function PermissionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Custom Filter Demo
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          This page demonstrates the generic <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">filter</code> function 
          for custom route filtering - permissions, subscriptions, feature flags, or any logic you need.
        </p>

        <div className="mt-8 space-y-6">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✨ <strong>New in v2:</strong> Generic filter function replaces the old permissions API.
              Define any filtering logic you need!
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              The Filter Pattern
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Pass a <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">filter</code> function 
              and <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">context</code> to the tool.
              The filter receives each route and your context - you decide the logic.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Example 1: Permission-Based
            </h2>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
              <code>{`navigationTool({
  schema,
  filter: (route, ctx) => {
    // No permissions required = everyone can see
    if (!route.permissions) return true;
    
    // Check if user has required permission
    return route.permissions.every(
      perm => ctx.user.roles.includes(perm)
    );
  },
  context: {
    user: currentUser, // From your auth system
  },
});`}</code>
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Example 2: Subscription-Based
            </h2>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
              <code>{`navigationTool({
  schema,
  filter: (route, ctx) => {
    // Check subscription level
    if (route.metadata?.requiresPro) {
      return ctx.subscription === "pro";
    }
    return true;
  },
  context: {
    subscription: user.subscription, // "free" | "pro"
  },
});`}</code>
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Example 3: Feature Flags
            </h2>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
              <code>{`navigationTool({
  schema,
  filter: (route, ctx) => {
    // Check feature flag
    if (route.featureFlag) {
      return ctx.flags.includes(route.featureFlag);
    }
    return true;
  },
  context: {
    flags: ["beta-dashboard", "new-search"],
  },
});`}</code>
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Example 4: Combined Logic
            </h2>
            <pre className="mt-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
              <code>{`// Define your context type
type MyContext = {
  user: User;
  subscription: string;
  featureFlags: string[];
  locale: string;
};

navigationTool<MyContext>({
  schema,
  filter: (route, ctx) => {
    // Permission check
    if (route.permissions?.includes("admin")) {
      if (ctx.user.role !== "admin") return false;
    }
    
    // Subscription check
    if (route.metadata?.requiresPro) {
      if (ctx.subscription !== "pro") return false;
    }
    
    // Feature flag check
    if (route.featureFlag) {
      if (!ctx.featureFlags.includes(route.featureFlag)) {
        return false;
      }
    }
    
    // Locale check
    if (route.metadata?.locale) {
      if (route.metadata.locale !== ctx.locale) return false;
    }
    
    return true;
  },
  context: {
    user: currentUser,
    subscription: "pro",
    featureFlags: ["beta-feature"],
    locale: "en",
  },
});`}</code>
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Key Benefits
            </h2>
            <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <span><strong>Universal:</strong> Works with any auth system (NextAuth, Clerk, Auth0, custom JWT)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <span><strong>Flexible:</strong> Your logic, your rules - not limited to built-in options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <span><strong>Type-safe:</strong> Use TypeScript generics for full type inference</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <span><strong>Async support:</strong> Filter function can be async for API calls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <span><strong>Composable:</strong> Create reusable filter functions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
