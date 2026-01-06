/**
 * Example Chat API Route with Gateway Support
 * Copy this to your app/api/chat/route.ts
 */

import { streamText } from "ai";
import {
	createGatewayModel,
	type GatewayConfig,
} from "@/registry/new-york/lib/gateway";

export const runtime = "edge";

export async function POST(req: Request) {
	try {
		const { messages, gateway } = await req.json();

		// If gateway config is provided, use it
		// Otherwise, you can implement your own model logic
		if (!gateway) {
			return new Response(
				JSON.stringify({
					error: "Gateway configuration is required",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const model = createGatewayModel(gateway as GatewayConfig);

		const result = streamText({
			model,
			messages,
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
			},
		);
	}
}
