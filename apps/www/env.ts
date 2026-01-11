import { keys as core } from "@repo/next-config/keys";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  extends: [core()],
  server: {
    NAVIGATION_APP_URL: z.string().min(1).default("http://localhost:3001"),
  },
  client: {},
  runtimeEnv: {
    NAVIGATION_APP_URL: process.env.NAVIGATION_APP_URL,
  },
});
