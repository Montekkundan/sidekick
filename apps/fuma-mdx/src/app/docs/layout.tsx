import {
  SidekickInset,
  SidekickProvider,
} from "@repo/design-system/components/ui/sidekick";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { AskSidekick } from "@/components/ask-sidekick";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <SidekickProvider defaultOpen={false}>
      <SidekickInset>
        <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
          {children}
        </DocsLayout>
      </SidekickInset>
      <AskSidekick />
    </SidekickProvider>
  );
}
