import * as fs from "node:fs";
import * as path from "node:path";

/**
 * CLI for AI Navigation Tool
 *
 * Usage:
 *   ai-navigation generate --framework next --dir ./app --output nav-schema.json
 *   ai-navigation generate --framework manual --output nav-schema.ts
 */

type Framework = "next" | "next-pages" | "manual";

interface GenerateOptions {
  framework: Framework;
  dir: string;
  output: string;
  include?: string[];
  exclude?: string[];
  baseUrl?: string;
  format: "json" | "typescript";
}

const HELP_TEXT = `
AI Navigation Tool CLI

Usage:
  ai-navigation generate [options]

Commands:
  generate    Generate a navigation schema from your project

Options:
  --framework, -f   Framework to use (next, next-pages, manual)
  --dir, -d         Directory to scan (default: ./app or ./pages)
  --output, -o      Output file path (default: nav-schema.json)
  --include         Glob patterns to include (comma-separated)
  --exclude         Glob patterns to exclude (comma-separated)
  --base-url        Base URL prefix for all routes
  --format          Output format: json or typescript (default: json)
  --help, -h        Show this help message

Examples:
  # Generate schema from Next.js App Router
  ai-navigation generate -f next -d ./app -o nav-schema.json

  # Generate TypeScript schema with exclusions
  ai-navigation generate -f next --exclude "api/**,admin/**" --format typescript

  # Create empty manual schema template
  ai-navigation generate -f manual -o nav-schema.ts
`;

const parseArgs = (args: string[]): GenerateOptions => {
  const options: GenerateOptions = {
    framework: "next",
    dir: "./app",
    output: "nav-schema.json",
    format: "json",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "--framework":
      case "-f":
        options.framework = nextArg as Framework;
        i++;
        break;
      case "--dir":
      case "-d":
        options.dir = nextArg;
        i++;
        break;
      case "--output":
      case "-o":
        options.output = nextArg;
        i++;
        break;
      case "--include":
        options.include = nextArg.split(",").map((s) => s.trim());
        i++;
        break;
      case "--exclude":
        options.exclude = nextArg.split(",").map((s) => s.trim());
        i++;
        break;
      case "--base-url":
        options.baseUrl = nextArg;
        i++;
        break;
      case "--format":
        options.format = nextArg as "json" | "typescript";
        i++;
        break;
      case "--help":
      case "-h":
        console.log(HELP_TEXT);
        process.exit(0);
    }
  }

  // Auto-detect format from output extension
  if (options.output.endsWith(".ts")) {
    options.format = "typescript";
  }

  return options;
};

const generateManualTemplate = (): string => {
  return `import { defineSchema } from "ai-navigation-tool";

/**
 * Navigation schema for your application
 * Add your routes here
 */
export const schema = defineSchema([
  {
    path: "/",
    name: "Home",
    description: "Landing page",
  },
  {
    path: "/docs",
    name: "Documentation",
    description: "Learn how to use the app",
    aliases: ["help", "guides"],
    keywords: ["learn", "tutorial"],
    category: "docs",
  },
  {
    path: "/settings",
    name: "Settings",
    description: "Configure your preferences",
    permissions: ["user"],
    category: "settings",
  },
  // Add more routes here...
]);
`;
};

const formatAsJson = (schema: unknown): string => {
  return JSON.stringify(schema, null, 2);
};

const formatAsTypeScript = (schema: unknown): string => {
  const json = JSON.stringify(schema, null, 2);
  return `import type { NavigationSchema } from "ai-navigation-tool";

/**
 * Auto-generated navigation schema
 * Generated at: ${new Date().toISOString()}
 */
export const schema: NavigationSchema = ${json};
`;
};

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  const command = args[0];

  if (command !== "generate") {
    console.error(`Unknown command: ${command}`);
    console.log("Run 'ai-navigation --help' for usage.");
    process.exit(1);
  }

  const options = parseArgs(args.slice(1));

  console.log(`🧭 AI Navigation Tool`);
  console.log(`Framework: ${options.framework}`);
  console.log(`Directory: ${options.dir}`);
  console.log(`Output: ${options.output}`);

  try {
    let output: string;

    if (options.framework === "manual") {
      output = generateManualTemplate();
      console.log("\n✨ Generated manual schema template");
    } else {
      // Dynamic import for Next.js generator
      const { generateNextSchema, generateNextPagesSchema } = await import(
        "./generators/next"
      );

      const generator =
        options.framework === "next-pages"
          ? generateNextPagesSchema
          : generateNextSchema;

      const schema = await generator({
        rootDir: options.dir,
        include: options.include,
        exclude: options.exclude,
        baseUrl: options.baseUrl,
      });

      console.log(`\n✨ Found ${schema.routes.length} routes`);

      output =
        options.format === "typescript"
          ? formatAsTypeScript(schema)
          : formatAsJson(schema);
    }

    // Ensure output directory exists
    const outputDir = path.dirname(options.output);
    if (outputDir && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write output file
    fs.writeFileSync(options.output, output, "utf-8");
    console.log(`\n✅ Schema saved to ${options.output}`);
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

main();
