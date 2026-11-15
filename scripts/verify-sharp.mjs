import assert from "node:assert/strict";
import { globSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import sharp from "sharp";

// Run inside the standalone image so host dependencies cannot hide missing files.
const { data, info } = await sharp({
  create: {
    width: 2,
    height: 2,
    channels: 3,
    background: "#ffffff",
  },
})
  .resize(1, 1)
  .png()
  .toBuffer({ resolveWithObject: true });

assert.equal(info.width, 1);
assert.equal(info.height, 1);
assert.equal(info.format, "png");
assert(data.length > 0);
console.log("PASS: standalone sharp loads and processes an image");

const pgManifests = globSync(
  "node_modules/{pg,.pnpm/*/node_modules/pg}/package.json",
);
assert(pgManifests.length > 0, "Standalone must include the PostgreSQL driver");
for (const manifest of pgManifests) {
  const metadata = JSON.parse(readFileSync(manifest, "utf8"));
  assert.equal(metadata.name, "pg");
  const pgDir = path.dirname(path.resolve(manifest));
  const requireFromPg = createRequire(path.join(pgDir, "package.json"));
  const { Client } = requireFromPg(pgDir);
  assert.equal(typeof Client, "function");
  const { serialize } = requireFromPg("pg-protocol");
  const query = serialize.query("SELECT 1");
  assert.equal(query[0], 0x51);
  assert.equal(query.readInt32BE(1), 13);
  assert.equal(query.subarray(5).toString(), "SELECT 1\0");
}
console.log("PASS: standalone PostgreSQL driver loads and serializes a query");
