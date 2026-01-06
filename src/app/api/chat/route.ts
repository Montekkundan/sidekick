import { streamText } from "ai";

import {
  createGatewayModel,
  type GatewayConfig,
} from "@/registry/new-york/lib/gateway";

export const runtime = "edge";

export async function POST(req: Request) {
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
