import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// TODO: simplify config structure
type Config = {
  style: "new-york";
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
  installationType: "cli" | "manual";
};

const configAtom = atomWithStorage<Config>("config", {
  style: "new-york",
  packageManager: "pnpm",
  installationType: "cli",
});

export function useConfig() {
  return useAtom(configAtom);
}
