import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      BETTER_AUTH_SECRET: z.string().min(1),
      BETTER_AUTH_URL: z.string().url(),
      VERCEL_CLIENT_ID: z.string().min(1),
      VERCEL_CLIENT_SECRET: z.string().min(1),
    },
    client: {
      NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),
    },
    runtimeEnv: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      VERCEL_CLIENT_ID: process.env.VERCEL_CLIENT_ID,
      VERCEL_CLIENT_SECRET: process.env.VERCEL_CLIENT_SECRET,
      NEXT_PUBLIC_BETTER_AUTH_URL:
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL,
    },
  });
