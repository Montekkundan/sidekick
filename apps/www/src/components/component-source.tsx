import fs from "node:fs/promises";
import path from "node:path";
import { cn } from "@repo/design-system/lib/utils";
import type * as React from "react";
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper";
import { CopyButton } from "@/components/copy-button";
import { getIconForLanguageExtension } from "@/components/icons";
import { highlightCode } from "@/lib/highlight-code";
import { getRegistryItem } from "@/lib/registry";

export async function ComponentSource({
  name,
  src,
  title,
  language,
  collapsible = true,
  className,
}: React.ComponentProps<"div"> & {
  name?: string;
  src?: string;
  title?: string;
  language?: string;
  collapsible?: boolean;
}) {
  if (!(name || src)) {
    return null;
  }

  let code: string | undefined;

  if (name) {
    const item = await getRegistryItem(name);
    code = item?.files?.[0]?.content;
  }

  if (src) {
    const file = await fs.readFile(path.join(process.cwd(), src), "utf-8");
    code = file;
  }

  if (!code) {
    return null;
  }

  // Fix imports for docs (consumer-facing).
  // Convert internal registry imports to the typical installed paths.
  code = code
    // Registry style folders.
    .replaceAll(/@\/registry\/[\w-]+\/blocks\//g, "@/components/ui/")
    .replaceAll(/@\/registry\/[\w-]+\/ui\//g, "@/components/ui/")
    .replaceAll(/@\/registry\/[\w-]+\/hooks\//g, "@/hooks/")
    .replaceAll(/@\/registry\/[\w-]+\/lib\//g, "@/lib/")
    .replaceAll(/@\/registry\/[\w-]+\/components\//g, "@/components/")
    // Monorepo-only imports.
    .replaceAll(
      /@repo\/design-system\/components\/ai-elements\//g,
      "@ai-elements/"
    )
    .replaceAll(/@repo\/design-system\/components\/ui\//g, "@/components/ui/");

  // Replace export default with export.
  code = code.replaceAll("export default", "export");
  code = code.replaceAll("/* eslint-disable react/no-children-prop */\n", "");

  const lang = language ?? title?.split(".").pop() ?? "tsx";
  const highlightedCode = await highlightCode(code, lang);

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={lang}
          title={title}
        />
      </div>
    );
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <ComponentCode
        code={code}
        highlightedCode={highlightedCode}
        language={lang}
        title={title}
      />
    </CodeCollapsibleWrapper>
  );
}

function ComponentCode({
  code,
  highlightedCode,
  language,
  title,
}: {
  code: string;
  highlightedCode: string;
  language: string;
  title: string | undefined;
}) {
  return (
    <figure className="[&>pre]:max-h-96" data-rehype-pretty-code-figure="">
      {title && (
        <figcaption
          className="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
          data-language={language}
          data-rehype-pretty-code-title=""
        >
          {getIconForLanguageExtension(language)}
          {title}
        </figcaption>
      )}
      <CopyButton value={code} />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  );
}
