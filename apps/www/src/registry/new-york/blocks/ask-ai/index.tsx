"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/registry/new-york/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar";
import { Button } from "@/registry/new-york/ui/button";

export type AskAIButtonProps = {
  avatarSrc?: string;
  avatarFallback?: string;
  className?: string;
  onClick?: () => void;
};

export function AskAIButton({
  avatarSrc = "https://github.com/montekkundan.png",
  avatarFallback = "MK",
  className,
  onClick,
}: AskAIButtonProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg bg-zinc-900 p-2",
        className
      )}
    >
      <Button
        className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
        onClick={onClick}
        variant="outline"
      >
        Ask AI
      </Button>
      <Avatar>
        <AvatarImage alt="User" src={avatarSrc} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
    </div>
  );
}

export type AskAILabelProps = {
  label?: string;
  className?: string;
};

export function AskAILabel({
  label = "Ask AI about this page",
  className,
}: AskAILabelProps) {
  return (
    <span className={cn("flex items-center gap-3 text-zinc-400", className)}>
      <MessageCircle className="size-5" />
      {label}
    </span>
  );
}
