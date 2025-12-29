import { siteConfig } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="3xl:fixed:bg-transparent group-has-[[data-slot=designer]]/body:hidden group-has-[.section-soft]/body:bg-surface/40 group-has-[.docs-nav]/body:pb-20 group-has-[.docs-nav]/body:sm:pb-0 dark:bg-transparent">
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex h-(--footer-height) items-center justify-between">
          <div className="w-full px-1 text-center text-muted-foreground text-xs leading-loose sm:text-sm">
            Built by{" "}
            <a
              className="font-medium underline underline-offset-4"
              href={siteConfig.links.twitter}
              rel="noreferrer"
              target="_blank"
            >
              Montek
            </a>{" "}
            thank you{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="https://x.com/shadcn"
              rel="noreferrer"
              target="_blank"
            >
              Shadcn{" "}
            </a>
            and{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="https://vercel.com/new?utm_source=sidekick_site&utm_medium=web"
              rel="noreferrer"
              target="_blank"
            >
              Vercel
            </a>
            . The source code is available on{" "}
            <a
              className="font-medium underline underline-offset-4"
              href={siteConfig.links.github}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
