import { Button } from "@repo/design-system/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <Image
          alt="Next.js logo"
          className="dark:invert"
          height={20}
          priority
          src="/examples/fuma-mdx/next.svg"
          width={100}
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs font-semibold text-3xl text-black leading-10 tracking-tight dark:text-zinc-50">
            To get started, read the cookbook
          </h1>
        </div>
        <div className="flex flex-col gap-4 font-medium text-base sm:flex-row">
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              asChild
              className="w-full md:w-[158px]"
              size="default"
              variant="default"
            >
              <a
                className="flex items-center justify-center gap-2"
                href="/docs/cookbook"
                rel="noopener noreferrer"
              >
                Cookbook
              </a>
            </Button>

            <Button asChild className="w-full md:w-[158px]" variant="outline">
              <a
                className="flex items-center justify-center"
                href="/examples/fuma-mdx/docs"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
