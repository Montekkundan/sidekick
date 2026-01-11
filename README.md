# Sidekick

AI-powered components for building chat interfaces. Built with [shadcn/ui](https://ui.shadcn.com) principles.

Sidekick provides composable, customizable React components for AI chat experiences. You render messages, it handles the UI — panels, conversations, prompts, and more. Sidekick supports a fully composable API, so you can wrap components or customize them as needed.

## Scripts

### Root Commands

| Script              | Command            | Description                     |
| ------------------- | ------------------ | ------------------------------- |
| `bun run dev`       | `turbo dev`        | Start development server        |
| `bun run build`     | `turbo build`      | Build all apps                  |
| `bun run start`     | `turbo start`      | Start production server         |
| `bun run typecheck` | `turbo typecheck`  | Run TypeScript type checking    |
| `bun run devtools`  | `turbo devtools`   | Visualize Package & Task Graphs |
| `bun run analyze`   | `turbo analyze`    | Bundle analyzer for all apps    |
| `bun run check`     | `ultracite check`  | Lint and format check           |
| `bun run fix`       | `ultracite fix`    | Auto-fix lint and format issues |
| `bun run lint`      | `ultracite check`  | Alias for check                 |
| `bun run format`    | `ultracite fix`    | Alias for fix                   |
| `bun run doctor`    | `ultracite doctor` | Diagnose ultracite setup        |

### www App Commands

| Script                | Command                          | Description                 |
| --------------------- | -------------------------------- | --------------------------- |
| `bun run dev`         | `next dev --turbopack`           | Start Next.js dev server    |
| `bun run dev:inspect` | `next dev --turbopack --inspect` | Dev with Node.js debugger   |
| `bun run build`       | `next build`                     | Build for production        |
| `bun run start`       | `next start`                     | Start production server     |
| `bun run analyze`     | `next experimental-analyze`      | Interactive bundle analyzer |
| `bun run upgrade`     | `next upgrade`                   | Upgrade Next.js version     |

## License

MIT

## Adding New Examples

To add a new example application (e.g., for testing a new UI block), use the `_template` workspace.

1.  Run the generator command:
    ```sh
    bun turbo gen workspace --copy
    ```
2.  Select `apps/_template` as the source to copy.
3.  Give your new app a name (e.g., `examples/dashboard`).
4.  **Important**: When asked if you want to add workspace dependencies, select **No** (or press Enter without selecting any). The template already includes the necessary core dependencies.
5.  **Set a Unique Port**: Open `apps/<your-app>/package.json` and update the `dev` script to use a unique port (e.g., `-p 3002`) so it doesn't conflict with other apps.
    ```json
    "dev": "next dev --turbopack -p 3002"
    ```
6.  **Configure Environment**: Rename `.env.example` to `.env` inside your new app directory and update `NEXT_PUBLIC_APP_URL` to match your new port.
    ```bash
    NEXT_PUBLIC_APP_URL="http://localhost:3002"
    ```
7.  **Optional - Subpath Routing**: If you want this app to run under a specific path (e.g., `/examples/dashboard`), update `next.config.ts`:
    ```ts
    basePath: "/examples/dashboard",
    ```

8.  **Run and View**:
    *   Start the app: `bun turbo dev --filter=<your-app>`
    *   **Crucial**: Because of the `basePath`, your app will **NOT** be at `http://localhost:3002/`.
    *   You **MUST** visit the full path: `http://localhost:3002/examples/dashboard` (or whatever you set as `basePath`).

    > **Note**: If you set a `basePath`, you will need to update the path of any static assets (like images) in your code to include that base path (e.g., `/examples/dashboard/next.svg` instead of `/next.svg`).

To optionally integrate this new app into the main website (so it's accessible via the main domain), follow the guide in [MICROFRONTENDS.md](apps/www/MICROFRONTENDS.md).