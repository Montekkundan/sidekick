/**
 * Gateway Usage Examples
 * Shows how to use the AI Gateway library with different providers
 */

import * as React from "react";
import { generateText, streamText } from "ai";
import { createGatewayModel } from "@/registry/new-york/lib/gateway";
import { useGatewayChat } from "@/registry/new-york/hooks/use-gateway-chat";

// ============================================================================
// Example 1: Auto-Detect Provider
// ============================================================================

export async function exampleAutoDetect() {
	// Gateway automatically detects which provider to use
	// based on available environment variables
	const model = createGatewayModel({
		modelId: "openai/gpt-4o",
	});

	const { text } = await generateText({
		model,
		prompt: "What is the capital of France?",
	});

	return text;
}

// ============================================================================
// Example 2: Using Vercel AI Gateway
// ============================================================================

export async function exampleVercelGateway() {
	// Explicitly use Vercel AI Gateway
	const model = createGatewayModel({
		provider: "vercel",
		modelId: "anthropic/claude-sonnet-4",
	});

	const { text } = await generateText({
		model,
		prompt: "What is quantum computing?",
	});

	return text;
}

// ============================================================================
// Example 3: Using LLM Gateway
// ============================================================================

export async function exampleLLMGateway() {
	// Use LLM Gateway
	const model = createGatewayModel({
		provider: "llmgateway",
		modelId: "openai/gpt-4o",
	});

	const { text } = await generateText({
		model,
		prompt: "Write a vegetarian lasagna recipe for 4 people.",
	});

	return text;
}

// ============================================================================
// Example 4: Using OpenRouter
// ============================================================================

export async function exampleOpenRouter() {
	// Use OpenRouter
	const model = createGatewayModel({
		provider: "openrouter",
		modelId: "openai/gpt-4o",
	});

	const result = streamText({
		model,
		prompt: "Explain machine learning in simple terms.",
	});

	return result;
}

// ============================================================================
// Example 5: Using with Custom API Key
// ============================================================================

export async function exampleWithCustomApiKey() {
	// Pass a custom API key instead of using environment variables
	const model = createGatewayModel({
		provider: "openrouter",
		modelId: "anthropic/claude-3-opus",
		apiKey: "sk-or-v1-...", // Your custom API key
	});

	const { text } = await generateText({
		model,
		prompt: "Tell me a joke.",
	});

	return text;
}

// ============================================================================
// Example 6: Error Handling
// ============================================================================

export async function exampleWithErrorHandling() {
	try {
		const model = createGatewayModel({
			modelId: "openai/gpt-4o",
		});

		const { text } = await generateText({
			model,
			prompt: "Hello, world!",
		});

		return text;
	} catch (error) {
		if (error instanceof Error && error.name === "GatewayError") {
			console.error("Gateway configuration error:", error.message);
			// Handle gateway-specific errors
		}
		throw error;
	}
}

// ============================================================================
// Example 7: Using useGatewayChat Hook
// ============================================================================

export function ExampleChatComponent() {
	const [input, setInput] = React.useState("");
	const { messages, sendMessage, status } = useGatewayChat({
		gateway: {
			modelId: "openai/gpt-4o",
			// provider: 'vercel', // Optional - auto-detects if not specified
		},
		messages: [
			{
				id: "1",
				role: "user",
				parts: [{ type: "text", text: "Hello!" }],
			},
			{
				id: "2",
				role: "assistant",
				parts: [{ type: "text", text: "Hi! How can I help you?" }],
			},
		],
	});
	const isLoading = status === "streaming";

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!input.trim()) return;
		void sendMessage({ text: input });
		setInput("");
	};

	const getMessageText = (message: {
		parts?: Array<{ type: string; text?: string }>;
	}) =>
		message.parts
			?.filter((part) => part.type === "text")
			.map((part) => part.text ?? "")
			.join("") ?? "";

	return (
		<form onSubmit={handleSubmit}>
			<div>
				{messages.map((msg) => (
					<div key={msg.id}>
						<strong>{msg.role}:</strong> {getMessageText(msg)}
					</div>
				))}
			</div>
			<input
				onChange={(event) => setInput(event.target.value)}
				placeholder="Type a message..."
				value={input}
			/>
			<button disabled={isLoading} type="submit">
				Send
			</button>
		</form>
	);
}

// ============================================================================
// Example 8: Using in API Routes (Next.js)
// ============================================================================

export async function POST(request: Request) {
	const { messages, gateway } = await request.json();

	const model = createGatewayModel(gateway);

	const result = streamText({
		model,
		messages,
	});

	return result.toTextStreamResponse();
}

// ============================================================================
// Example 9: Without Gateway (Custom Logic)
// ============================================================================

export function ExampleWithoutGateway() {
	const handleCustomSubmit = (message: { text: string }) => {
		// Implement your own logic without using gateway
		fetch("/api/my-custom-endpoint", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: message.text }),
		});
	};

	// Use PromptInput or any other component with custom logic
	return <div>Custom implementation without gateway</div>;
}
