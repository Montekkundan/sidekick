import Link from "next/link";
import { CommandMenu } from "@/components/command-menu";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { SiteConfig } from "@/components/site-config";
import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";
// import blocks from "@/registry/__blocks__.json"
import { Button } from "@/registry/new-york/ui/button";
import { Separator } from "@/registry/new-york/ui/separator";

export function SiteHeader() {
  const pageTree = source.pageTree;

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="**:data-[slot=separator]:!h-4 3xl:fixed:container flex h-(--header-height) items-center">
          <MobileNav
            className="flex lg:hidden"
            items={siteConfig.navItems}
            tree={pageTree}
          />
          <Button
            asChild
            className="hidden size-8 lg:flex"
            size="icon"
            variant="ghost"
          >
            <Link href="/">
              {/* TODO add logo  */}
              {/* <Icons.logo className="size-5" /> */}
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
          </Button>
          <MainNav className="hidden lg:flex" items={siteConfig.navItems} />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
              <CommandMenu navItems={siteConfig.navItems} tree={pageTree} />
            </div>
            <Separator
              className="ml-2 hidden lg:block"
              orientation="vertical"
            />
            {/* <GitHubLink /> */}
            {/* <Separator orientation="vertical" className="3xl:flex hidden" /> */}
            <SiteConfig className="3xl:flex hidden" />
            <Separator orientation="vertical" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
