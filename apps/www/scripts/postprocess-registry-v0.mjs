import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const REGISTRY_DIR = path.join(ROOT, "public", "r");

const SRC_REGISTRY_PREFIX = "src/registry/";
const STRIP_SRC_PREFIX_RE = /^src\//;

function rewritePathForV0(filePath) {
  if (typeof filePath !== "string") {
    return filePath;
  }

  if (filePath.startsWith(SRC_REGISTRY_PREFIX)) {
    return filePath.replace(STRIP_SRC_PREFIX_RE, "");
  }

  return filePath;
}

function rewriteFilesArray(files) {
  return files.map((file) => {
    if (!file || typeof file !== "object") {
      return file;
    }

    return {
      ...file,
      path: rewritePathForV0(file.path),
    };
  });
}

function rewriteAny(value) {
  if (Array.isArray(value)) {
    for (const entry of value) {
      rewriteAny(entry);
    }
    return value;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value.files)) {
    value.files = rewriteFilesArray(value.files);
  }

  for (const key of Object.keys(value)) {
    if (key === "files") {
      continue;
    }
    rewriteAny(value[key]);
  }

  return value;
}

async function main() {
  const entries = await fs.readdir(REGISTRY_DIR, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name);

  let changedCount = 0;

  for (const filename of jsonFiles) {
    const fullPath = path.join(REGISTRY_DIR, filename);
    const raw = await fs.readFile(fullPath, "utf8");

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`Invalid JSON: ${path.relative(ROOT, fullPath)}`);
    }

    const before = JSON.stringify(parsed);
    const rewritten = rewriteAny(parsed);
    const after = JSON.stringify(rewritten);

    if (before !== after) {
      changedCount += 1;
      await fs.writeFile(
        fullPath,
        `${JSON.stringify(rewritten, null, 2)}\n`,
        "utf8"
      );
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    changedCount === 0
      ? "postprocess-registry-v0: no changes"
      : `postprocess-registry-v0: updated ${changedCount} file(s)`
  );
}

await main();
