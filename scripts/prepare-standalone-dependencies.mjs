import { access, cp, realpath } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const standaloneDir = path.resolve(".next/standalone");
await access(path.join(standaloneDir, "server.js"));

// Standalone copies have omitted Sharp's dist modules and semver files even
// when traced. Copy both complete packages after Next's copy step, preserving
// their resolved dependency paths (including pnpm).
const sharpDir = await realpath("node_modules/sharp");
const requireFromSharp = createRequire(import.meta.resolve("sharp"));
const semverDir = path.dirname(requireFromSharp.resolve("semver/package.json"));
for (const packageDir of [sharpDir, semverDir]) {
  await cp(
    packageDir,
    path.join(standaloneDir, path.relative(process.cwd(), packageDir)),
    { recursive: true },
  );
}
