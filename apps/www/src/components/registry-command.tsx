import { CodeBlockCommand } from "@/components/code-block-command";
import { APP_URL } from "@/lib/config";

const ensureLeadingSlash = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

export function RegistryCommand({ path }: { path: string }) {
  const url = `${APP_URL}${ensureLeadingSlash(path)}`;
  const npm = `npx shadcn@latest add ${url}`;

  return (
    <CodeBlockCommand
      __bun__={npm.replace(/^npx /, "bunx --bun ")}
      __npm__={npm}
      __pnpm__={npm.replace(/^npx /, "pnpm dlx ")}
      __yarn__={npm.replace(/^npx /, "yarn ")}
    />
  );
}
