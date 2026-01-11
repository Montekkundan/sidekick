# Micro-Frontend Architecture

This project uses [**Next.js Multi-Zones**](https://nextjs.org/docs/app/guides/multi-zones) to stitch together multiple independent Next.js applications into a single unified user experience.

## Overview

Instead of a single monolithic application, we split our codebase into smaller "Apps" that run independently but appear as one website to the user, this is mainly because of all the examples we have.

*   **Main App (`apps/www`)**: Acts as the "Shell" or "Router". It handles the home page and proxies requests to other apps based on the URL path.
*   **Sub Apps (e.g., `apps/next-navigation`)**: Independent Next.js applications that serve specific sections of the site (e.g., `/examples/*`).


## How It Works

1.  **Local Development**: Each app runs on a unique port (e.g., `3000`, `3001`, `3002`).
2.  **Routing**: The Main App (`apps/www`) uses `next.config.ts` to check the URL. If it matches a sub-app's path, it internally fetches the content from that app's running instance.
3.  **Production**: We use environment variables to point to the deployed URL of each app instead of `localhost`.

## How to Add a New Micro-Frontend

Follow this to add a new application to the cluster.

Before everything make sure to have a new example app in the `apps` directory following the [Adding New Examples](../../README.md#adding-new-examples) section.

### 1. Create and Configure the New App
Create your new app (e.g., `apps/dashboard`).

**`apps/dashboard/package.json`**:
Assign a unique port for local dev.
```json
"scripts": {
  "dev": "next dev --turbopack -p 3002"
}
```

**`apps/dashboard/next.config.ts`**:
Set the base path to match its public URL structure.
```typescript
const nextConfig = {
  basePath: "/dashboard", 
  // ...
};
```

### 2. Register the App in the Main Application (`apps/www`)

**`apps/www/env.ts`**:
Define the environment variable for the new app.
```typescript
server: {
  DASHBOARD_APP_URL: z.string().min(1).default("http://localhost:3002"),
},
runtimeEnv: {
  DASHBOARD_APP_URL: process.env.DASHBOARD_APP_URL,
}
```

**`turbo.json`**:
Add the new variable to `globalEnv` so caching works correctly.
```json
"globalEnv": [
  // ... existing envs
  "DASHBOARD_APP_URL"
]
```

**`apps/www/next.config.ts`**:
Add the rewrite rule to route traffic.
```typescript
async rewrites() {
  return [
    // ... existing rules
    {
      source: "/dashboard",
      destination: `${env.DASHBOARD_APP_URL}/dashboard`,
    },
    {
      source: "/dashboard/:path*",
      destination: `${env.DASHBOARD_APP_URL}/dashboard/:path*`,
    },
  ];
}
```

### 3. Nested/Deep Paths
If you want to host multiple apps under a single parent route (e.g., `/examples/app-1`, `/examples/app-2`), simply include the full path in the `basePath` of the respective app.

*   App A `basePath`: `"/examples/app-1"`
*   App B `basePath`: `"/examples/app-2"`

The Main App's rewrites don't care about depth; they just match the string.

## Resources

*   [Next.js Multi-Zones Documentation](https://nextjs.org/docs/app/building-your-application/deploying/multi-zones) - Official guide on this architecture.
*   [Turborepo Microfrontends Guide](https://turborepo.com/docs/guides/microfrontends) - Concepts behind monorepo-based microfrontends.
*   [Vercel Incremental Migration](https://vercel.com/blog/how-vercel-adopted-microfrontends) - Good context on "Strangler Fig" migrations, even though we are using a lighter-weight approach.
