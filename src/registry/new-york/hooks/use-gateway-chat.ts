/**
 * useGatewayChat Hook
 * Simplifies integration of AI Gateway with chat components
 */

"use client";

import { useChat as useAIChat, type UseChatOptions } from "ai/react";
import type { GatewayConfig } from "@/registry/new-york/lib/gateway";

export interface UseGatewayChatOptions
	extends Omit<UseChatOptions, "api" | "body"> {
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
export function useGatewayChat(options: UseGatewayChatOptions = {}) {
	const { gateway, api = "/api/chat", body, ...chatOptions } = options;

	return useAIChat({
		api,
		body: gateway
			? {
					...body,
					gateway,
				}
			: body,
		...chatOptions,
	});
}
