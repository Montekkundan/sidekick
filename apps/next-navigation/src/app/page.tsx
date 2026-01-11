import Image from "next/image";
import { Button } from "@repo/design-system/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <div className="w-full sm:w-auto flex gap-2">
            <Button
              asChild
              className="w-full md:w-[158px]"
              variant="default"
              size="default"
            >
              <a
                href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMontekkundan%2Fshadturbo&env=NEXT_PUBLIC_WEB_URL&envDescription=Your%20website%20URL&envLink=https%3A%2F%2Fgithub.com%2FMontekkundan%2Fshadturbo%2Fblob%2Fmain%2Fapps%2Fweb%2F.env.example&project-name=shadturbo&repository-name=shadturbo&demo-title=shadturbo&demo-description=Minimal%20starter%20repo%20that%20includes%20a%20Next.js%20app%20and%20a%20shadcn%20design%20system.&demo-url=https%3A%2F%2Fshadturbo.vercel.app&demo-image=https%3A%2F%2Fshadturbo.vercel.app%2Fapi%2Fog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Image
                  className="dark:invert"
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={16}
                  height={16}
                />
                Deploy Now
              </a>
            </Button>

            <Button asChild className="w-full md:w-[158px]" variant="outline">
              <a
                href="https://nextjs.org/docs/beta/app/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
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
