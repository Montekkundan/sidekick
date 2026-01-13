import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      DATABASE_URL: z.string().min(1),
      DATABASE_AUTH_TOKEN: z.string().optional(),
    },
    client: {},
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
      DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    },
  });
