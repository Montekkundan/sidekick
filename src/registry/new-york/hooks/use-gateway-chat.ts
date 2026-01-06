/**
 * useGatewayChat Hook
 * Simplifies integration of AI Gateway with chat components
 */

"use client";

import { useChat as useAIChat } from "@ai-sdk/react";
import type { ChatInit, UIMessage } from "ai";
import { TextStreamChatTransport } from "ai";
import type { GatewayConfig } from "@/registry/new-york/lib/gateway";

export interface UseGatewayChatOptions<UI_MESSAGE extends UIMessage = UIMessage>
	extends Omit<ChatInit<UI_MESSAGE>, "transport"> {
	/**
	 * Gateway configuration
	 * If not provided, will use default /api/chat endpoint
	 */
	gateway?: GatewayConfig;
	/**
	 * API endpoint for chat
	 * @default "/api/chat"
	 */
	api?: string;
	/**
	 * Additional body parameters to send with each request
	 */
	body?: Record<string, unknown>;
	/**
	 * Request headers for the chat transport.
	 */
	headers?: Record<string, string> | Headers;
	/**
	 * Fetch implementation override.
	 */
	fetch?: typeof fetch;
	/**
	 * Credentials mode for the transport.
	 */
	credentials?: RequestCredentials;
}

/**
 * Hook for using AI Gateway with chat components
 *
 * @example
 * ```tsx
 * // Auto-detect provider from environment
 * const { messages, input, handleInputChange, handleSubmit } = useGatewayChat({
 *   gateway: {
 *     modelId: 'openai/gpt-4o'
 *   }
 * });
 *
 * // Specify provider explicitly
 * const chat = useGatewayChat({
 *   gateway: {
 *     provider: 'vercel',
 *     modelId: 'anthropic/claude-sonnet-4'
 *   }
 * });
 *
 * // Without gateway (custom API route)
 * const chat = useGatewayChat({
 *   api: '/api/custom-chat'
 * });
 * ```
 */
export function useGatewayChat<UI_MESSAGE extends UIMessage = UIMessage>(
	options: UseGatewayChatOptions<UI_MESSAGE> = {},
) {
	const {
		gateway,
		api = "/api/chat",
		body,
		headers,
		fetch,
		credentials,
		...chatOptions
	} = options;

	const transport = new TextStreamChatTransport<UI_MESSAGE>({
		api,
		headers,
		fetch,
		credentials,
		body: gateway
			? {
					...body,
					gateway,
				}
			: body,
	});

	return useAIChat<UI_MESSAGE>({
		transport,
		...chatOptions,
	});
}
