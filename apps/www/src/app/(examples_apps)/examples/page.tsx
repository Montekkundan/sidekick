import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface ExampleCard {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  external?: boolean;
}

const examples: ExampleCard[] = [
  // {
  //   title: "Next Navigation",
  //   description: "Examples served from the navigation microfrontend.",
  //   href: "/examples/next-navigation",
  //   imageSrc: "/next.svg",
  // },
  {
    title: "Fuma-MDX",
    description: "Examples served from the MDX microfrontend.",
    href: "/examples/fuma-mdx",
    imageSrc: "/examples/fuma-mdx/fuma-mdx.jpeg",
  },
  {
    title: "Help Page",
    description: "Examples served from the Help Page microfrontend.",
    href: "/examples/help-page",
    imageSrc: "/examples/help-page/help-page.jpeg",
  },
  {
    title: "ChatGPT",
    description: "Examples served from the ChatGPT microfrontend.",
    href: "/examples/chatgpt",
    imageSrc: "/examples/chatgpt/chatgpt.jpeg",
  },
  {
    title: "Cursor Editor",
    description: "Examples served from the Cursor Editor microfrontend.",
    href: "/examples/cursor-editor",
    imageSrc: "/examples/cursor-editor/cursor-editor.jpeg",
  },
];

function ExampleGridCard({
  title,
  description,
  href,
  imageSrc,
  external,
}: ExampleCard) {
  const linkProps = external
    ? { target: "_blank", rel: "noreferrer" }
    : undefined;

  return (
    <Link
      className="group relative overflow-hidden rounded-2xl border bg-background/20 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-background/30 hover:shadow-lg"
      href={href}
      {...linkProps}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-semibold text-xl">{title}</h2>
            <ArrowUpRightIcon className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="mt-1 line-clamp-2 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="pointer-events-none mt-6">
        <div className="relative h-40 w-full overflow-hidden rounded-xl border bg-muted/20">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <Image
            alt={title}
            className="absolute bottom-0 left-1/2 w-[420px] max-w-none -translate-x-1/2 translate-y-6 object-contain opacity-90 transition-transform duration-300 group-hover:translate-y-4"
            height={240}
            src={imageSrc}
            width={420}
          />
        </div>
      </div>
    </Link>
  );
}

export default function Page() {
  return (
    <div
      className="relative z-10 flex min-h-svh flex-col bg-background"
      data-slot="layout"
    >
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="mb-8 space-y-2">
            <h1 className="font-semibold text-3xl">Examples</h1>
            <p className="max-w-2xl text-muted-foreground">
              Small example apps mounted under your microfrontend routes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {examples.map((example) => (
              <ExampleGridCard key={example.href} {...example} />
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
