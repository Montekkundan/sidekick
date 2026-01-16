"use client";
import { ModeSwitcher } from "@/components/mode-switcher";

export function BuilderHeaderActions() {

  return (
    <div className="flex items-center gap-2">
      <ModeSwitcher />
    </div>
  );
}
