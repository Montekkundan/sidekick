/**
 * AI Gateway Configuration
 * Supports Vercel AI Gateway, LLM Gateway, and OpenRouter
 */

import type { LanguageModel } from "ai";
import { createGateway } from "ai";
import { llmgateway } from "@llmgateway/ai-sdk-provider";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export type GatewayProvider = "vercel" | "llmgateway" | "openrouter";

export interface GatewayConfig {
	provider?: GatewayProvider;
	apiKey?: string;
	modelId: string;
}

export class GatewayError extends Error {
	constructor(
		message: string,
		public provider?: GatewayProvider,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "GatewayError";
	}
}

/**
 * Vercel AI Gateway Configuration
 * Uses the global gateway() function from AI SDK v6
 */
function createVercelGateway(modelId: string, apiKey?: string): LanguageModel {
	const gatewayApiKey =
		apiKey ||
		process.env.VERCEL_AI_GATEWAY_API_KEY ||
		process.env.AI_GATEWAY_API_KEY;

	if (!gatewayApiKey) {
		throw new GatewayError(
			"Vercel AI Gateway requires VERCEL_AI_GATEWAY_API_KEY or AI_GATEWAY_API_KEY environment variable",
			"vercel",
		);
	}

	try {
		// AI SDK v6 uses createGateway() for API key-based auth.
		const provider = createGateway({ apiKey: gatewayApiKey });
		return provider(modelId);
	} catch (error) {
		throw new GatewayError(
			"Failed to initialize Vercel AI Gateway",
			"vercel",
			error,
		);
	}
}

/**
 * LLM Gateway Configuration
 * Uses @llmgateway/ai-sdk-provider package
 */
function createLLMGateway(modelId: string, apiKey?: string): LanguageModel {
	const gatewayApiKey = apiKey || process.env.LLM_GATEWAY_API_KEY;

	if (!gatewayApiKey) {
		throw new GatewayError(
			"LLM Gateway requires LLM_GATEWAY_API_KEY environment variable or apiKey parameter",
			"llmgateway",
		);
	}

	try {
		// LLM Gateway uses the llmgateway() provider function
		// It automatically uses LLM_GATEWAY_API_KEY from environment
		const typedModelId = modelId as Parameters<typeof llmgateway>[0];
		return llmgateway(typedModelId);
	} catch (error) {
		throw new GatewayError(
			"Failed to initialize LLM Gateway",
			"llmgateway",
			error,
		);
	}
}

/**
 * OpenRouter Configuration
 * Uses @openrouter/ai-sdk-provider package
 */
function createOpenRouterGateway(
	modelId: string,
	apiKey?: string,
): LanguageModel {
	const gatewayApiKey = apiKey || process.env.OPENROUTER_API_KEY;

	if (!gatewayApiKey) {
		throw new GatewayError(
			"OpenRouter requires OPENROUTER_API_KEY environment variable or apiKey parameter",
			"openrouter",
		);
	}

	try {
		const config: {
			apiKey: string;
			headers?: Record<string, string>;
		} = {
			apiKey: gatewayApiKey,
		};

		// Optional: Add HTTP-Referer for rankings
		if (
			process.env.OPENROUTER_SITE_URL ||
			process.env.OPENROUTER_SITE_NAME
		) {
			config.headers = {};
			if (process.env.OPENROUTER_SITE_URL) {
				config.headers["HTTP-Referer"] = process.env.OPENROUTER_SITE_URL;
			}
			if (process.env.OPENROUTER_SITE_NAME) {
				config.headers["X-Title"] = process.env.OPENROUTER_SITE_NAME;
			}
		}

		const openrouter = createOpenRouter(config);
		return openrouter(modelId);
	} catch (error) {
		throw new GatewayError(
			"Failed to initialize OpenRouter",
			"openrouter",
			error,
		);
	}
}

/**
 * Auto-detect available gateway provider
 */
function detectAvailableProvider(): GatewayProvider | null {
	if (
		process.env.VERCEL_AI_GATEWAY_API_KEY ||
		process.env.AI_GATEWAY_API_KEY
	)
		return "vercel";
	if (process.env.LLM_GATEWAY_API_KEY) return "llmgateway";
	if (process.env.OPENROUTER_API_KEY) return "openrouter";
	return null;
}

/**
 * Create a language model with the specified gateway provider
 *
 * @example
 * ```ts
 * // Auto-detect provider from environment
 * const model = createGatewayModel({
 *   modelId: 'openai/gpt-4o'
 * });
 *
 * const result = await generateText({
 *   model,
 *   prompt: 'Hello'
 * });
 *
 * // Using specific provider
 * const model = createGatewayModel({
 *   provider: 'vercel',
 *   modelId: 'anthropic/claude-sonnet-4'
 * });
 *
 * // Using with custom API key
 * const model = createGatewayModel({
 *   provider: 'openrouter',
 *   modelId: 'openai/gpt-4o',
 *   apiKey: 'sk-or-...'
 * });
 * ```
 */
export function createGatewayModel(config: GatewayConfig): LanguageModel {
	const { provider: specifiedProvider, modelId, apiKey } = config;

	// Auto-detect provider if not specified
	const provider = specifiedProvider || detectAvailableProvider();

	if (!provider) {
		throw new GatewayError(
			"No gateway provider configured. Please set one of: VERCEL_AI_GATEWAY_API_KEY, LLM_GATEWAY_API_KEY, or OPENROUTER_API_KEY environment variable",
		);
	}

	switch (provider) {
		case "vercel":
			return createVercelGateway(modelId, apiKey);
		case "llmgateway":
			return createLLMGateway(modelId, apiKey);
		case "openrouter":
			return createOpenRouterGateway(modelId, apiKey);
		default:
			throw new GatewayError(`Unknown gateway provider: ${provider}`, provider);
	}
}

/**
 * Get available environment variables for the current environment
 * Useful for debugging gateway configuration
 */
export function getGatewayEnvironment() {
	return {
		vercel: {
			hasKey: Boolean(
				process.env.VERCEL_AI_GATEWAY_API_KEY ||
					process.env.AI_GATEWAY_API_KEY,
			),
			keyName: "VERCEL_AI_GATEWAY_API_KEY | AI_GATEWAY_API_KEY",
		},
		llmgateway: {
			hasKey: Boolean(process.env.LLM_GATEWAY_API_KEY),
			keyName: "LLM_GATEWAY_API_KEY",
		},
		openrouter: {
			hasKey: Boolean(process.env.OPENROUTER_API_KEY),
			keyName: "OPENROUTER_API_KEY",
			siteUrl: process.env.OPENROUTER_SITE_URL,
			siteName: process.env.OPENROUTER_SITE_NAME,
		},
	};
}
