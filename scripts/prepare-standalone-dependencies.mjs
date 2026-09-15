import { access, cp } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const standaloneDir = path.resolve(".next/standalone");
await access(path.join(standaloneDir, "server.js"));

// A production image omitted semver/functions/compare-build.js even though it
// appeared in the trace manifest. Copy the complete package after Next's copy
// step, preserving the real dependency path used by sharp (including pnpm).
const requireFromSharp = createRequire(import.meta.resolve("sharp"));
const semverDir = path.dirname(requireFromSharp.resolve("semver/package.json"));
await cp(
  semverDir,
  path.join(standaloneDir, path.relative(process.cwd(), semverDir)),
  { recursive: true },
);
