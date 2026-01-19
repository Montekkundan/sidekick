import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { streamText } from "ai";
import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

import {
  createGatewayModel,
  type GatewayConfig,
} from "@/registry/new-york/lib/gateway";

export const runtime = "edge";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "30s"),
});

export async function POST(req: Request) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json(
      { error: "Bot detected. Access denied." },
      { status: 403 }
    );
  }

  const ip = req.headers.get("x-forwarded-for") ?? "ip";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Ratelimited!", { status: 429 });
  }

  try {
    const { messages, gateway, system } = await req.json();

    if (!gateway?.modelId) {
      return new Response(
        JSON.stringify({ error: "Gateway configuration is required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const model = createGatewayModel(gateway as GatewayConfig);

    // TODO: Swap to a dedicated A2A agent service when we split runtime from UI.
    const result = streamText({
      model,
      messages,
      system,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
