import { NextResponse } from "next/server";
import { navigationTool } from "ai-navigation-tool";
import { generateText, gateway } from "ai";
import { schema, filters, type UserContext } from "@/lib/schema";

/**
 * Create navigation tool with custom filter
 * 
 * The filter function receives each route and the context you provide.
 * Return true to include the route, false to exclude it.
 */
const createNavTool = (userContext: UserContext) => navigationTool<UserContext>({
  schema,
  // Generic filter - YOU decide the logic
  filter: filters.combined,
  // Pass whatever context YOUR app needs
  context: userContext,
  results: {
    mode: "multiple",
    maxResults: 5,
    includeConfidence: true,
    threshold: 0.2,
  },
});

// Default navigation tool (no filtering - shows all routes)
const defaultNavTool = navigationTool({
  schema,
  results: {
    mode: "multiple",
    maxResults: 5,
    includeConfidence: true,
    threshold: 0.2,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, userContext } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required", found: false, query: "" },
        { status: 400 }
      );
    }

    // Use filter if userContext is provided, otherwise show all routes
    const navTool = userContext 
      ? createNavTool(userContext as UserContext)
      : defaultNavTool;

    try {
      // Use AI SDK with navigation tool - force tool to be called
      const result = await generateText({
        model: gateway("openai/gpt-4o-mini"),
        system: "You are a navigation assistant. Use the navigate tool to search for routes based on the user's query.",
        prompt: query,
        tools: {
          navigate: navTool,
        },
        toolChoice: "required", // Force the model to call a tool
        maxSteps: 1, // Only need one step since we're forcing the tool
      });

      // Check toolResults - the result is in `output` not `result`
      if (result.toolResults && result.toolResults.length > 0) {
        const navResult = result.toolResults.find((r: { toolName: string }) => r.toolName === "navigate");
        if (navResult && "output" in navResult) {
          return NextResponse.json(navResult.output);
        }
      }

      // Check steps for tool results
      if (result.steps && result.steps.length > 0) {
        for (const step of result.steps) {
          if (step.toolResults && step.toolResults.length > 0) {
            const navResult = step.toolResults.find((r: { toolName: string }) => r.toolName === "navigate");
            if (navResult && "output" in navResult) {
              return NextResponse.json(navResult.output);
            }
          }
        }
      }

      // Extract tool results from the AI response
      const toolCalls = result.toolCalls || [];
      const navigationResult = toolCalls.find((call) => call.toolName === "navigate");

      if (navigationResult && "result" in navigationResult) {
        return NextResponse.json(navigationResult.result);
      }
    } catch (aiError) {
      console.error("AI SDK error:", aiError);
      return NextResponse.json(
        {
          error: `AI navigation failed: ${aiError instanceof Error ? aiError.message : String(aiError)}`,
          found: false,
          query,
        },
        { status: 500 }
      );
    }

    // Should not reach here if toolChoice is required
    return NextResponse.json({
      found: false,
      query,
      error: "Tool was not called",
    });
  } catch (error) {
    console.error("Navigation error:", error);
    return NextResponse.json(
      {
        error: "Failed to process navigation request",
        found: false,
        query: "",
      },
      { status: 500 }
    );
  }
}
