import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const sharpDir = await realpath("node_modules/sharp");
const requireFromSharp = createRequire(import.meta.resolve("sharp"));
const semverDir = path.dirname(requireFromSharp.resolve("semver/package.json"));
const helper = new URL(
  "./prepare-standalone-dependencies.mjs",
  import.meta.url,
);

for (const layout of ["flat", "pnpm"]) {
  test(`standalone packaging restores omitted Sharp modules with ${layout} dependencies`, async () => {
    const projectDir = await mkdtemp(path.join(tmpdir(), "cwb-standalone-"));
    const standaloneDir = path.join(projectDir, ".next/standalone");
    const sharpPath =
      layout === "pnpm"
        ? "node_modules/.pnpm/sharp@fixture/node_modules/sharp"
        : "node_modules/sharp";
    const semverPath =
      layout === "pnpm"
        ? "node_modules/.pnpm/semver@fixture/node_modules/semver"
        : "node_modules/semver";

    try {
      await cp(sharpDir, path.join(projectDir, sharpPath), { recursive: true });
      await cp(semverDir, path.join(projectDir, semverPath), {
        recursive: true,
      });
      if (layout === "pnpm") {
        await symlink(
          path.relative("node_modules", sharpPath),
          path.join(projectDir, "node_modules/sharp"),
        );
        await symlink(
          path.relative(path.dirname(sharpPath), semverPath),
          path.join(projectDir, path.dirname(sharpPath), "semver"),
        );
      }

      await mkdir(path.join(standaloneDir, sharpPath, "dist"), {
        recursive: true,
      });
      await writeFile(path.join(standaloneDir, "server.js"), "");
      for (const entry of [
        "package.json",
        "dist/index.mjs",
        "dist/index.cjs",
      ]) {
        await cp(
          path.join(projectDir, sharpPath, entry),
          path.join(standaloneDir, sharpPath, entry),
        );
      }
      const helperPath = path.join(projectDir, "prepare-standalone.mjs");
      await cp(helper, helperPath);
      const result = spawnSync(process.execPath, [helperPath], {
        cwd: projectDir,
        encoding: "utf8",
      });
      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(
        (await readdir(path.join(standaloneDir, sharpPath, "dist"))).sort(),
        (await readdir(path.join(sharpDir, "dist"))).sort(),
        "Restore Sharp's complete ESM and CommonJS distributions",
      );
      assert.deepEqual(
        await readFile(path.join(standaloneDir, sharpPath, "dist/channel.mjs")),
        await readFile(path.join(sharpDir, "dist/channel.mjs")),
      );
      assert.deepEqual(
        await readFile(
          path.join(standaloneDir, semverPath, "functions/compare-build.js"),
        ),
        await readFile(path.join(semverDir, "functions/compare-build.js")),
        "Preserve the earlier repair for incomplete semver copies",
      );
    } finally {
      await rm(projectDir, { recursive: true, force: true });
    }
  });
}
