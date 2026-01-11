import type { ThemeProviderProps } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./providers/theme";

export type DesignSystemProviderProps = ThemeProviderProps & { children?: ReactNode };

export const DesignSystemProvider = ({ children, ...properties }: DesignSystemProviderProps) => (
  <ThemeProvider {...properties}>
    <TooltipProvider>{children}</TooltipProvider>
    <Toaster />
  </ThemeProvider>
);
