import { getLLMText } from "@/lib/get-llm-text";
import { source } from "@/lib/source";

// cached forever
export const revalidate = false;

export async function GET() {
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  const content = `Welcome to Sidekick documentation.

Full documentation: /llms-full.txt

${scanned.join("\n\n")}`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
