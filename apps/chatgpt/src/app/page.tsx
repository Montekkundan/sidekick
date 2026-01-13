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
          src="/next.svg"
          width={100}
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs font-semibold text-3xl text-black leading-10 tracking-tight dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg text-zinc-600 leading-8 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              className="font-medium text-zinc-950 dark:text-zinc-50"
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              className="font-medium text-zinc-950 dark:text-zinc-50"
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            >
              Learning
            </a>{" "}
            center.
          </p>
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
                href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMontekkundan%2Fshadturbo&env=NEXT_PUBLIC_WEB_URL&envDescription=Your%20website%20URL&envLink=https%3A%2F%2Fgithub.com%2FMontekkundan%2Fshadturbo%2Fblob%2Fmain%2Fapps%2Fweb%2F.env.example&project-name=shadturbo&repository-name=shadturbo&demo-title=shadturbo&demo-description=Minimal%20starter%20repo%20that%20includes%20a%20Next.js%20app%20and%20a%20shadcn%20design%20system.&demo-url=https%3A%2F%2Fshadturbo.vercel.app&demo-image=https%3A%2F%2Fshadturbo.vercel.app%2Fapi%2Fog"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Image
                  alt="Vercel logomark"
                  className="dark:invert"
                  height={16}
                  src="/vercel.svg"
                  width={16}
                />
                Deploy Now
              </a>
            </Button>

            <Button asChild className="w-full md:w-[158px]" variant="outline">
              <a
                className="flex items-center justify-center"
                href="https://nextjs.org/docs/app/getting-started"
                rel="noopener noreferrer"
                target="_blank"
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
