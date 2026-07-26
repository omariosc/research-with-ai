import { lstat, readdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const root = "public";
const forbiddenNames = new Set([".DS_Store", ".venv", "__pycache__"]);
const forbiddenExtensions = new Set([".pem", ".pyc"]);
const maximumFileBytes = 5 * 1024 * 1024;
const failures = [];
let fileCount = 0;
let totalBytes = 0;

async function inspect(path) {
  const details = await lstat(path);
  const name = basename(path);

  if (details.isSymbolicLink()) {
    failures.push(`${path}: symbolic links are not allowed in public assets`);
    return;
  }
  if (forbiddenNames.has(name)) {
    failures.push(`${path}: generated or private directory is not publishable`);
    return;
  }
  if (details.isDirectory()) {
    const entries = await readdir(path);
    await Promise.all(entries.map((entry) => inspect(join(path, entry))));
    return;
  }
  if (!details.isFile()) return;

  fileCount += 1;
  totalBytes += details.size;
  if (forbiddenExtensions.has(extname(name))) {
    failures.push(`${path}: generated or sensitive file type is not publishable`);
  }
  if (name === ".env" || name.startsWith(".env.")) {
    failures.push(`${path}: environment files are not publishable`);
  }
  if (details.size > maximumFileBytes) {
    failures.push(
      `${path}: ${details.size} bytes exceeds the 5 MiB public-asset limit`,
    );
  }
}

await inspect(root);

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `${fileCount} public files checked; ${totalBytes} bytes; no generated environments, bytecode, private files, symlinks, or oversized assets.`,
  );
}
