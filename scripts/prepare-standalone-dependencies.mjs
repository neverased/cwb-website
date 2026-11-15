import { access, cp, realpath } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const standaloneDir = path.resolve(".next/standalone");
await access(path.join(standaloneDir, "server.js"));

// Standalone tracing/copying can omit runtime modules from Sharp, semver and
// pg-protocol. Restore the complete packages after Next's copy step, preserving
// their resolved dependency paths (including pnpm).
const sharpDir = await realpath("node_modules/sharp");
const requireFromSharp = createRequire(import.meta.resolve("sharp"));
const semverDir = path.dirname(requireFromSharp.resolve("semver/package.json"));
const requireFromAdapter = createRequire(
  import.meta.resolve("@payloadcms/db-postgres"),
);
const requireFromPg = createRequire(requireFromAdapter.resolve("pg"));
const protocolDir = await realpath(
  path.dirname(path.dirname(requireFromPg.resolve("pg-protocol"))),
);
for (const packageDir of [sharpDir, semverDir, protocolDir]) {
  await cp(
    packageDir,
    path.join(standaloneDir, path.relative(process.cwd(), packageDir)),
    { recursive: true },
  );
}
