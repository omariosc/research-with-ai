import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";
import YAML from "yaml";

const root = new URL(
  "../public/worked-examples/model-container-service/",
  import.meta.url,
);
const rootPath = fileURLToPath(root);

async function text(path) {
  return readFile(new URL(path, root), "utf8");
}

async function walk(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const item = join(path, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(item)));
    if (entry.isFile()) files.push(item);
  }
  return files;
}

function readZipEntries(archive) {
  const minimumEocdBytes = 22;
  const maximumCommentBytes = 65_535;
  let eocdOffset = -1;
  for (
    let offset = archive.length - minimumEocdBytes;
    offset >= Math.max(0, archive.length - minimumEocdBytes - maximumCommentBytes);
    offset -= 1
  ) {
    if (archive.readUInt32LE(offset) === 0x06054b50) {
      eocdOffset = offset;
      break;
    }
  }
  assert.notEqual(eocdOffset, -1, "ZIP end record should be present");

  const entryCount = archive.readUInt16LE(eocdOffset + 10);
  let offset = archive.readUInt32LE(eocdOffset + 16);
  const entries = new Map();

  for (let index = 0; index < entryCount; index += 1) {
    assert.equal(
      archive.readUInt32LE(offset),
      0x02014b50,
      "ZIP central-directory entry should be present",
    );
    const flags = archive.readUInt16LE(offset + 8);
    const method = archive.readUInt16LE(offset + 10);
    const compressedBytes = archive.readUInt32LE(offset + 20);
    const uncompressedBytes = archive.readUInt32LE(offset + 24);
    const nameBytes = archive.readUInt16LE(offset + 28);
    const extraBytes = archive.readUInt16LE(offset + 30);
    const commentBytes = archive.readUInt16LE(offset + 32);
    const localOffset = archive.readUInt32LE(offset + 42);
    const name = archive
      .subarray(offset + 46, offset + 46 + nameBytes)
      .toString("utf8");

    assert.equal(flags & 1, 0, `${name} should not be encrypted`);
    assert.equal(
      archive.readUInt32LE(localOffset),
      0x04034b50,
      `${name} should have a local header`,
    );
    const localNameBytes = archive.readUInt16LE(localOffset + 26);
    const localExtraBytes = archive.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameBytes + localExtraBytes;
    const compressed = archive.subarray(
      dataOffset,
      dataOffset + compressedBytes,
    );
    let content;
    if (method === 0) content = Buffer.from(compressed);
    else if (method === 8) content = inflateRawSync(compressed);
    else assert.fail(`${name} uses unsupported ZIP compression method ${method}`);
    assert.equal(content.length, uncompressedBytes);
    if (!name.endsWith("/")) entries.set(name, content);

    offset += 46 + nameBytes + extraBytes + commentBytes;
  }
  return entries;
}

test("synthetic model bytes match the committed checksum and golden output", async () => {
  const raw = await readFile(new URL("model/model.json", root));
  const checksum = (await text("model/model.sha256")).split(/\s+/)[0];
  assert.equal(createHash("sha256").update(raw).digest("hex"), checksum);

  const model = JSON.parse(raw);
  const features = [0.25, -0.5, 0.75];
  const linear =
    model.bias +
    model.weights.reduce(
      (total, weight, index) => total + weight * features[index],
      0,
    );
  const probability = 1 / (1 + Math.exp(-linear));
  assert.equal(Number(probability.toFixed(6)), 0.619517);
  assert.match(model.intended_use, /not for scientific or clinical decisions/i);
});

test("container profile keeps the teaching API on a least-privilege localhost boundary", async () => {
  const compose = YAML.parse(await text("compose.yaml"));
  const service = compose.services.api;
  assert.deepEqual(service.ports, ["127.0.0.1:8080:8080"]);
  assert.equal(service.read_only, true);
  assert.deepEqual(service.cap_drop, ["ALL"]);
  assert.ok(service.security_opt.includes("no-new-privileges:true"));
  assert.equal(service.secrets[0].target, "api_token");
  assert.match(compose.secrets.api_token.file, /MODEL_API_TOKEN_FILE/);
  assert.match(compose.secrets.api_token.file, /\.secrets\/api_token/);

  const dockerfile = await text("Dockerfile");
  assert.match(dockerfile, /--require-hashes/);
  assert.match(dockerfile, /sha256sum -c model\/model\.sha256/);
  assert.match(dockerfile, /^USER 10001:10001$/m);
  assert.match(dockerfile, /^HEALTHCHECK /m);
});

test("downloadable source tree excludes generated environments and bytecode", async () => {
  const files = await walk(rootPath);
  const relative = files.map((file) => file.replace(rootPath, ""));
  assert.ok(relative.includes("app/main.py"));
  assert.ok(relative.includes("tests/test_api.py"));
  assert.ok(relative.includes("requirements.lock"));
  assert.equal(
    relative.some(
      (file) =>
        file.includes("__pycache__") ||
        file.includes(".pytest_cache") ||
        file.endsWith(".pyc"),
    ),
    false,
  );

  const lock = await text("requirements.lock");
  assert.match(lock, /fastapi==0\.116\.2/);
  assert.match(lock, /uvicorn==0\.35\.0/);
  assert.match(lock, /--hash=sha256:/);
});

test("downloadable ZIP matches its published checksum", async () => {
  const archive = await readFile(
    new URL("../public/worked-examples/model-container-service.zip", import.meta.url),
  );
  const record = await readFile(
    new URL(
      "../public/worked-examples/model-container-service.zip.sha256",
      import.meta.url,
    ),
    "utf8",
  );
  const digest = createHash("sha256").update(archive).digest("hex");
  assert.equal(
    record,
    `${digest}  model-container-service.zip\n`,
  );
});

test("downloadable ZIP mirrors the reviewed source tree byte for byte", async () => {
  const archive = await readFile(
    new URL("../public/worked-examples/model-container-service.zip", import.meta.url),
  );
  const entries = readZipEntries(archive);
  const files = await walk(rootPath);
  const expectedNames = files
    .map(
      (file) =>
        `model-container-service/${file.slice(rootPath.length).replaceAll("\\", "/")}`,
    )
    .sort();

  assert.deepEqual([...entries.keys()].sort(), expectedNames);
  for (const file of files) {
    const name = `model-container-service/${file
      .slice(rootPath.length)
      .replaceAll("\\", "/")}`;
    assert.deepEqual(entries.get(name), await readFile(file), name);
  }
});
