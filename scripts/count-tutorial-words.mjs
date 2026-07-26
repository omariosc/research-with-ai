const routes = [
  "/agentic-research",
  "/interactive-paper",
  "/annotation-tools",
];
const conservativeLimit = 3600;

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text) {
  return text.match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("word-count", `${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
let failed = false;

for (const route of routes) {
  const response = await worker.fetch(
    new Request(`http://localhost${route}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
  if (!response.ok) {
    throw new Error(`${route} rendered with HTTP ${response.status}`);
  }
  const count = countWords(visibleText(await response.text()));
  process.stdout.write(`${route}: ${count} visible words\n`);
  if (count > conservativeLimit) {
    failed = true;
    process.stderr.write(
      `${route} exceeds the conservative ${conservativeLimit}-word release limit.\n`,
    );
  }
}

if (failed) process.exitCode = 1;
