"use client";

import { useThemeConfig } from "@/components/active-theme";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Label } from "@/registry/new-york/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";

export function ThemeSelector({ className }: React.ComponentProps<"div">) {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Label className="sr-only" htmlFor="theme-selector">
        Theme
      </Label>
      <Select onValueChange={setActiveTheme} value={activeTheme}>
        <SelectTrigger
          className="justify-start border-secondary bg-secondary text-secondary-foreground shadow-none *:data-[slot=select-value]:w-12"
          id="theme-selector"
          size="sm"
        >
          <span className="font-medium">Theme:</span>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent align="end">
          {THEMES.map((theme) => (
            <SelectItem
              className="data-[state=checked]:opacity-50"
              key={theme.name}
              value={theme.name}
            >
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
