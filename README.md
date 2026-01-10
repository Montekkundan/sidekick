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
