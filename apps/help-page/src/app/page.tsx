"use client";

import {
  Conversation,
  ConversationContent,
} from "@repo/design-system/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
} from "@repo/design-system/components/ai-elements/message";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design-system/components/ui/avatar";
import { Button } from "@repo/design-system/components/ui/button";
import { Card } from "@repo/design-system/components/ui/card";
import {
  PromptInput,
  PromptInputBody,
  PromptInputCard,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@repo/design-system/components/ui/prompt-input";
import { Sidekick } from "@repo/design-system/components/ui/sidekick";
import { cn } from "@repo/design-system/lib/utils";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  GithubIcon,
  MessageCircleIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  XIcon,
} from "lucide-react";
import React from "react";

function NavLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      className="rounded-md px-2 py-1 text-muted-foreground text-sm hover:text-foreground"
      href={href}
    >
      {children}
    </a>
  );
}

function ThemeToggle() {
  const [dark, setDark] = React.useState(true);

  return (
    <button
      aria-label="Toggle theme"
      className="inline-flex h-7 items-center gap-1 rounded-full border border-border bg-background/60 p-1 text-muted-foreground"
      onClick={() => setDark((v) => !v)}
      type="button"
    >
      <span
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full",
          dark ? "bg-muted text-foreground" : ""
        )}
      >
        <MoonIcon className="size-3.5" />
      </span>
      <span
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full",
          dark ? "" : "bg-muted text-foreground"
        )}
      >
        <SunIcon className="size-3.5" />
      </span>
    </button>
  );
}

function SearchComposer() {
  return (
    <PromptInputCard className="mx-auto w-full max-w-md rounded-full border bg-card/40 shadow-sm backdrop-blur">
      <PromptInput
        className="w-full"
        focusRing={false}
        onSubmit={() => undefined}
        size="sm"
        variant="none"
      >
        <PromptInputBody className="items-center gap-2 px-3 py-1.5">
          <SearchIcon className="size-4 text-muted-foreground" />
          <PromptInputTextarea
            className="!min-h-0 !h-9 !overflow-hidden !px-0 !py-2 flex-1 text-sm"
            placeholder="Search articles..."
            rows={1}
          />
          <div className="flex items-center gap-1">
            <span className="rounded-md border border-border/70 bg-background/60 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              ⌘
            </span>
            <span className="rounded-md border border-border/70 bg-background/60 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              K
            </span>
          </div>
        </PromptInputBody>
      </PromptInput>
    </PromptInputCard>
  );
}

function ListRow({ title }: { title: string }) {
  return (
    <button
      className="flex w-full items-center justify-between rounded-xl border bg-card/30 px-4 py-3 text-left text-foreground text-sm shadow-sm backdrop-blur transition hover:bg-card/40"
      type="button"
    >
      <span className="truncate">{title}</span>
      <ArrowRightIcon className="size-4 text-muted-foreground" />
    </button>
  );
}

function CategoryCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="rounded-2xl border bg-card/30 p-5 shadow-sm backdrop-blur transition hover:bg-card/40">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg border bg-background/20" />
          <h3 className="font-medium text-foreground text-sm">{title}</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}

interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  content: string;
}

function HelpPageSidekick() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      from: "assistant",
      content: "Hi! How can I help you today?",
    },
  ]);

  const handleSubmit = (message: { text: string }) => {
    if (!message.text.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      from: "user",
      content: message.text,
    };
    setMessages((prev) => prev.concat(userMessage));

    setTimeout(() => {
      setMessages((prev) =>
        prev.concat({
          id: String(Date.now() + 1),
          from: "assistant",
          content: "Thanks — I’m looking into that now.",
        })
      );
    }, 600);
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="h-[560px] w-[360px] overflow-hidden rounded-2xl border bg-background shadow-2xl">
          <Sidekick standalone>
            <div className="flex h-12 items-center justify-between border-b px-4">
              <span className="font-semibold text-sm">Help Page</span>
              <Button
                className="h-8 w-8"
                onClick={() => setOpen(false)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <XIcon className="size-4" />
              </Button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-auto p-4">
                <Conversation>
                  <ConversationContent>
                    {messages.map((msg) => (
                      <Message
                        className={
                          msg.from === "user" ? "flex-row-reverse" : "flex-row"
                        }
                        from={msg.from}
                        key={msg.id}
                      >
                        <Avatar className="h-6 w-6 rounded-full">
                          <AvatarImage
                            alt={msg.from === "user" ? "You" : "Assistant"}
                            src={
                              msg.from === "user"
                                ? "https://github.com/montekkundan.png"
                                : "https://github.com/shadcn.png"
                            }
                          />
                          <AvatarFallback>
                            {msg.from === "user" ? "U" : "AI"}
                          </AvatarFallback>
                        </Avatar>
                        <MessageContent>{msg.content}</MessageContent>
                      </Message>
                    ))}
                  </ConversationContent>
                </Conversation>
              </div>

              <div className="border-t p-3">
                <PromptInput onSubmit={handleSubmit} size="sm">
                  <PromptInputBody>
                    <PromptInputTextarea placeholder="Type a message..." />
                  </PromptInputBody>
                  <PromptInputFooter>
                    <PromptInputTools />
                    <PromptInputSubmit />
                  </PromptInputFooter>
                </PromptInput>
              </div>
            </div>
          </Sidekick>
        </div>
      ) : null}

      <Button
        className="size-12 rounded-full bg-orange-500 text-primary-foreground shadow-lg hover:bg-orange-500/90"
        onClick={() => setOpen((prev) => !prev)}
        size="icon"
        type="button"
      >
        {open ? (
          <XIcon className="size-5" />
        ) : (
          <MessageCircleIcon className="size-5" />
        )}
      </Button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      {/* soft vignette + side gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[420px] bg-[radial-gradient(circle_at_left,rgba(255,110,50,0.18),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[420px] bg-[radial-gradient(circle_at_right,rgba(120,90,255,0.18),transparent_68%)]" />

      <header className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-sm border border-orange-400/60 bg-orange-500/20" />
          <span className="text-foreground text-sm">Help Page</span>
        </div>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <NavLink href="https://example.com">Changelog</NavLink>
          <NavLink href="https://example.com">Docs</NavLink>
          <Button className="h-8 rounded-full bg-orange-500 px-4 text-primary-foreground hover:bg-orange-500/90">
            Dashboard
          </Button>
        </nav>
      </header>

      <main className="relative mx-auto w-full max-w-5xl px-6 pb-28">
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 pt-14 text-center">
          <h1 className="font-semibold text-4xl tracking-tight">
            How can we help you today?
          </h1>
          <SearchComposer />
          <p className="text-muted-foreground text-sm">
            You can also contact us via{" "}
            <a className="underline" href="https://example.com">
              Discord
            </a>{" "}
            and{" "}
            <a className="underline" href="https://example.com">
              X
            </a>
            .
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-4xl">
          <h2 className="mb-4 font-medium text-foreground/90 text-sm">
            Popular Articles
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <ListRow title="I have a feature request" />
            <ListRow title="Members management" />
            <ListRow title="Block Previews" />
            <ListRow title="Edit mode" />
            <ListRow title="Join a team" />
            <ListRow title="How to transfer a repository" />
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-4xl">
          <h2 className="mb-4 font-medium text-foreground/90 text-sm">
            Browse Categories
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <CategoryCard
              description="General concepts, basic terminology and tips."
              title="Getting Started"
            />
            <CategoryCard
              description="Forking, privacy settings, templates and more."
              title="Public Content"
            />
            <CategoryCard
              description="Create and manage teams to enhance collaboration and productivity."
              title="Team Management"
            />
            <CategoryCard
              description="Editing content, managing the schema, committing content and everything related."
              title="Repository Dashboard"
            />
            <CategoryCard
              description="Guardrails and common issues you might encounter while working."
              title="Common Errors"
            />
          </div>
        </section>
      </main>

      <footer className="relative border-t px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5">
          <div className="flex items-center gap-2 text-foreground/80 text-sm">
            <div className="size-4 rounded-sm border border-orange-400/60 bg-orange-500/20" />
            <span>Help Page</span>
          </div>
          <p className="text-muted-foreground text-xs">
            © 2025 Help Page — Support portal demo.
          </p>
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
          <div className="flex items-center gap-4 text-muted-foreground">
            <a
              aria-label="X"
              className="hover:text-foreground"
              href="https://example.com"
            >
              <XIcon className="size-4" />
            </a>
            <a
              aria-label="GitHub"
              className="hover:text-foreground"
              href="https://example.com"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              aria-label="Docs"
              className="hover:text-foreground"
              href="https://example.com"
            >
              <ChevronRightIcon className="size-4" />
            </a>
          </div>
        </div>
      </footer>

      <HelpPageSidekick />
    </div>
  );
}
