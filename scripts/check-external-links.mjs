import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = [
  "app",
  "lib",
  "docs",
  "public/audits",
  "public/worked-examples",
  "README.md",
  "AI_USE.md",
  "CITATION.cff",
  "THIRD_PARTY_NOTICES.md",
];
const textExtensions = new Set([".cff", ".json", ".md", ".py", ".toml", ".ts", ".tsx"]);
const manualStatuses = new Set([401, 403, 405, 429]);
const failures = [];
const manual = [];
const passed = [];

async function collect(path) {
  const details = await stat(path);
  if (details.isFile()) {
    return textExtensions.has(extname(path)) ? [path] : [];
  }

  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !entry.name.startsWith("."))
      .map((entry) => collect(join(path, entry.name))),
  );
  return nested.flat();
}

const files = (await Promise.all(roots.map(collect))).flat();
const locations = new Map();

for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(/https?:\/\/[^\s"'<>`)]+/g)) {
    const url = match[0].replace(/[.,;:\]}]+$/, "");
    const line = text.slice(0, match.index).split("\n").length;
    const references = locations.get(url) ?? [];
    references.push(`${file}:${line}`);
    locations.set(url, references);
  }
}

async function inspect(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "Research-with-AI-link-check/1.1" },
    });
    if (response.status === 405) {
      await response.body?.cancel();
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          range: "bytes=0-0",
          "user-agent": "Research-with-AI-link-check/1.1",
        },
      });
    }

    const record = { url, status: response.status };
    await response.body?.cancel();
    if (response.ok || (response.status >= 300 && response.status < 400)) {
      passed.push(record);
    } else if (manualStatuses.has(response.status)) {
      manual.push(record);
    } else {
      failures.push(record);
    }
  } catch (error) {
    failures.push({
      url,
      status: error instanceof Error ? error.message : String(error),
    });
  } finally {
    clearTimeout(timer);
  }
}

const queue = [...locations.keys()];
const workers = Array.from({ length: Math.min(8, queue.length) }, async () => {
  while (queue.length > 0) {
    const url = queue.shift();
    if (url) await inspect(url);
  }
});
await Promise.all(workers);

console.log(
  `${locations.size} unique external links: ${passed.length} reachable, ${manual.length} need manual review, ${failures.length} failed.`,
);

for (const record of manual) {
  console.log(
    `MANUAL ${record.status} ${record.url} (${locations.get(record.url).join(", ")})`,
  );
}
for (const record of failures) {
  console.error(
    `FAIL ${record.status} ${record.url} (${locations.get(record.url).join(", ")})`,
  );
}

if (failures.length > 0) process.exitCode = 1;
