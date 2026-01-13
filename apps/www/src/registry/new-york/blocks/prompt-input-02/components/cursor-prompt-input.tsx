"use client";

import {
  ArrowUpIcon,
  BugIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GithubIcon,
  ImageIcon,
  RocketIcon,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import {
  PromptInput,
  type PromptInputMessage,
  PromptInputProvider,
  usePromptInputController,
} from "@/registry/new-york/blocks/prompt-input";
import { cn } from "@/registry/new-york/lib/utils";
import { Button } from "@/registry/new-york/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover";
import { Switch } from "@/registry/new-york/ui/switch";

interface Repository {
  name: string;
  owner: string;
}

const repositories: Repository[] = [
  { name: "tag-v2", owner: "Verosoft-Design" },
  { name: "2D-game", owner: "Montekkundan" },
  { name: "aafreen", owner: "Montekkundan" },
  { name: "ai", owner: "Montekkundan" },
  { name: "ai_browser", owner: "Montekkundan" },
];

const models = [
  { id: "gpt-5.2", label: "GPT-5.2" },
  { id: "opus-4.5", label: "Opus 4.5" },
  { id: "gemini-3-pro", label: "Gemini 3 Pro" },
];

const promptPresets = {
  securityAudit:
    "Review the last 10 merged PRs for any security vulnerabilities or potential data leaks. Step through the PRs one at a time, checking out the codebase at the time the PR was merged. Once you are done with all of the PRs, report your findings. Do not write any code, and do not report your findings until you have reviewed all of the PRs.\n\nRemember: Be extremely thorough. No security vulnerabilities can slip through.",
  improveAgents:
    "Review the repository and improve the AGENTS.md instructions. Be explicit and practical: document how to run the project (dev, build, test), where key code lives, coding conventions, and any gotchas (env vars, required services, typical workflows). Preserve existing intent, remove ambiguity, and keep the final AGENTS.md concise but complete. If multiple AGENTS.md files exist, ensure scope rules are respected and there is no conflicting guidance.",
  solveTodo:
    "Find a TODO in this codebase that represents a real missing feature, bug, or cleanup (not a low-value note). Explain why you chose it, implement the fix, and ensure it works end-to-end. Add or update tests if the project already has tests for that area. Keep the change minimal and focused. Finally, summarize what changed and how to verify it locally.",
} as const;

function CursorQuickActions({
  textareaRef,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const controller = usePromptInputController();

  const setPreset = (text: string) => {
    controller.textInput.setInput(text);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  return (
    <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
      <Button
        className="h-9 rounded-full px-4"
        onClick={() => setPreset(promptPresets.securityAudit)}
        size="sm"
        type="button"
        variant="outline"
      >
        Run security audit
      </Button>
      <Button
        className="h-9 rounded-full px-4"
        onClick={() => setPreset(promptPresets.improveAgents)}
        size="sm"
        type="button"
        variant="outline"
      >
        Improve AGENTS.md
      </Button>
      <Button
        className="h-9 rounded-full px-4"
        onClick={() => setPreset(promptPresets.solveTodo)}
        size="sm"
        type="button"
        variant="outline"
      >
        Solve a TODO
      </Button>
    </div>
  );
}

export function CursorPromptInput() {
  const [repoOpen, setRepoOpen] = useState(false);
  const [repoQuery, setRepoQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const [modelOpen, setModelOpen] = useState(false);
  const [useMultipleModels, setUseMultipleModels] = useState(false);
  const [model, setModel] = useState(models[0].id);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredRepos = useMemo(() => {
    const q = repoQuery.trim().toLowerCase();
    if (!q) {
      return repositories;
    }
    return repositories.filter((repo) => {
      const haystack = `${repo.name} ${repo.owner}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [repoQuery]);

  const modelLabel =
    models.find((m) => m.id === model)?.label ?? models[0].label;

  const handleSubmit = (message: PromptInputMessage) => {
    // eslint-disable-next-line no-console
    console.log("cursor-prompt", {
      message,
      repository: selectedRepo,
      model,
      useMultipleModels,
    });
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-3 flex items-center justify-start">
        <Popover
          onOpenChange={(open) => {
            setRepoOpen(open);
            if (!open) {
              setRepoQuery("");
            }
          }}
          open={repoOpen}
        >
          <PopoverTrigger asChild>
            <Button
              className="h-8 gap-1 px-2 text-muted-foreground"
              size="sm"
              type="button"
              variant="ghost"
            >
              <span>
                {selectedRepo ? selectedRepo.name : "Select repository"}
              </span>
              <ChevronDownIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[320px] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                onValueChange={setRepoQuery}
                placeholder="Search repositories..."
                value={repoQuery}
              />
              <CommandList className="max-h-72">
                <CommandEmpty>No repositories found.</CommandEmpty>
                <CommandGroup>
                  {filteredRepos.map((repo) => {
                    const isSelected =
                      selectedRepo?.name === repo.name &&
                      selectedRepo?.owner === repo.owner;

                    return (
                      <CommandItem
                        className="flex items-start gap-2"
                        key={`${repo.owner}/${repo.name}`}
                        onSelect={() => {
                          setSelectedRepo(repo);
                          setRepoOpen(false);
                        }}
                      >
                        <div
                          className={cn(
                            "mt-1 size-2 shrink-0 rounded-full",
                            isSelected
                              ? "bg-foreground"
                              : "bg-muted-foreground/40"
                          )}
                        />
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {repo.name}
                          </div>
                          <div className="truncate text-muted-foreground text-xs">
                            {repo.owner}
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>

            <div className="border-t p-1">
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-accent"
                onClick={() => undefined}
                type="button"
              >
                <GithubIcon className="size-4 text-muted-foreground" />
                <span className="flex-1">Manage GitHub</span>
                <ExternalLinkIcon className="size-4 text-muted-foreground" />
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <PromptInputProvider>
        <PromptInput
          className="mx-auto w-full"
          onSubmit={handleSubmit}
          size="lg"
          variant="outline"
        >
          <PromptInput.Body className="items-start px-4 py-2">
            <PromptInput.Textarea
              className="min-h-36 text-base"
              minRows={6}
              placeholder="Ask Cursor to build, fix bugs, explore"
              ref={textareaRef}
            />
          </PromptInput.Body>

          <PromptInput.Footer className="items-center px-3 pb-3">
            <PromptInput.Tools className="gap-0">
              <DropdownMenu onOpenChange={setModelOpen} open={modelOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="h-8 gap-1 rounded-md px-2 text-muted-foreground"
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    {modelLabel}
                    <ChevronDownIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-1">
                  <div className="flex items-center justify-between gap-3 px-2 py-1.5">
                    <span className="text-sm">Use Multiple Models</span>
                    <Switch
                      checked={useMultipleModels}
                      onCheckedChange={setUseMultipleModels}
                    />
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    onValueChange={setModel}
                    value={model}
                  >
                    {models.map((m) => (
                      <DropdownMenuRadioItem key={m.id} value={m.id}>
                        {m.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </PromptInput.Tools>

            <PromptInput.Tools className="gap-1">
              <PromptInput.Button
                aria-label="Add image"
                className="rounded-md"
                size="icon-sm"
              >
                <ImageIcon className="size-4" />
              </PromptInput.Button>
              <PromptInput.Submit
                aria-label="Send"
                className="rounded-full"
                size="icon-sm"
                variant="secondary"
              >
                <ArrowUpIcon className="size-4" />
              </PromptInput.Submit>
            </PromptInput.Tools>
          </PromptInput.Footer>
        </PromptInput>

        <CursorQuickActions textareaRef={textareaRef} />
      </PromptInputProvider>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground text-sm">
          Try these examples to get started
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <Button
            className="h-10 rounded-full px-4"
            type="button"
            variant="outline"
          >
            <FileTextIcon className="size-4" />
            Write documentation
          </Button>
          <Button
            className="h-10 rounded-full px-4"
            type="button"
            variant="outline"
          >
            <RocketIcon className="size-4" />
            Optimize performance
          </Button>
          <Button
            className="h-10 rounded-full px-4"
            type="button"
            variant="outline"
          >
            <BugIcon className="size-4" />
            Find and fix 3 bugs
          </Button>
        </div>
      </div>
    </div>
  );
}
