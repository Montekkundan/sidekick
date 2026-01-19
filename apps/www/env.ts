import { keys as core } from "@repo/next-config/keys";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  extends: [core()],
  server: {
    NAVIGATION_APP_URL: z.string().min(1).default("http://localhost:3001"),
    FUMA_MDX_URL: z.string().min(1).default("http://localhost:3002"),
    CURSOR_EDITOR_APP_URL: z.string().min(1).default("http://localhost:3003"),
    CHATGPT_APP_URL: z.string().min(1).default("http://localhost:3004"),
    HELP_PAGE_APP_URL: z.string().min(1).default("http://localhost:3005"),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    NAVIGATION_APP_URL: process.env.NAVIGATION_APP_URL,
    FUMA_MDX_URL: process.env.FUMA_MDX_URL,
    CURSOR_EDITOR_APP_URL: process.env.CURSOR_EDITOR_APP_URL,
    CHATGPT_APP_URL: process.env.CHATGPT_APP_URL,
    HELP_PAGE_APP_URL: process.env.HELP_PAGE_APP_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
});
