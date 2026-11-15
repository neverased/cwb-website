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
import { fileURLToPath } from "node:url";

const sharpDir = await realpath("node_modules/sharp");
const requireFromSharp = createRequire(import.meta.resolve("sharp"));
const semverDir = path.dirname(requireFromSharp.resolve("semver/package.json"));
const adapterEntry = import.meta.resolve("@payloadcms/db-postgres");
const requireFromAdapter = createRequire(adapterEntry);
const pgDir = path.dirname(path.dirname(requireFromAdapter.resolve("pg")));
const requireFromPg = createRequire(requireFromAdapter.resolve("pg"));
const protocolDir = path.dirname(
  path.dirname(requireFromPg.resolve("pg-protocol")),
);
const adapterDir = path.dirname(path.dirname(fileURLToPath(adapterEntry)));
const helper = new URL(
  "./prepare-standalone-dependencies.mjs",
  import.meta.url,
);

for (const layout of ["flat", "pnpm"]) {
  test(`standalone packaging restores omitted Sharp and PostgreSQL modules with ${layout} dependencies`, async () => {
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
    const adapterPath =
      layout === "pnpm"
        ? "node_modules/.pnpm/adapter@fixture/node_modules/@payloadcms/db-postgres"
        : "node_modules/@payloadcms/db-postgres";
    const pgPath =
      layout === "pnpm"
        ? "node_modules/.pnpm/pg@fixture/node_modules/pg"
        : "node_modules/pg";
    const protocolPath =
      layout === "pnpm"
        ? "node_modules/.pnpm/protocol@fixture/node_modules/pg-protocol"
        : "node_modules/pg-protocol";

    try {
      await cp(sharpDir, path.join(projectDir, sharpPath), { recursive: true });
      await cp(semverDir, path.join(projectDir, semverPath), {
        recursive: true,
      });
      for (const [source, destination] of [
        [adapterDir, adapterPath],
        [pgDir, pgPath],
        [protocolDir, protocolPath],
      ]) {
        await cp(source, path.join(projectDir, destination), {
          recursive: true,
        });
      }
      if (layout === "pnpm") {
        await symlink(
          path.relative("node_modules", sharpPath),
          path.join(projectDir, "node_modules/sharp"),
        );
        await symlink(
          path.relative(path.dirname(sharpPath), semverPath),
          path.join(projectDir, path.dirname(sharpPath), "semver"),
        );
        await mkdir(path.join(projectDir, "node_modules/@payloadcms"), {
          recursive: true,
        });
        await symlink(
          path.relative("node_modules/@payloadcms", adapterPath),
          path.join(projectDir, "node_modules/@payloadcms/db-postgres"),
        );
        await symlink(
          path.relative(path.dirname(path.dirname(adapterPath)), pgPath),
          path.join(projectDir, path.dirname(path.dirname(adapterPath)), "pg"),
        );
        await symlink(
          path.relative(path.dirname(pgPath), protocolPath),
          path.join(projectDir, path.dirname(pgPath), "pg-protocol"),
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
      await mkdir(path.join(standaloneDir, protocolPath, "dist"), {
        recursive: true,
      });
      for (const entry of [
        "package.json",
        "dist/index.js",
        "dist/messages.js",
      ]) {
        await cp(
          path.join(projectDir, protocolPath, entry),
          path.join(standaloneDir, protocolPath, entry),
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
      const protocolCheck = spawnSync(
        process.execPath,
        [
          "-e",
          `const assert = require("node:assert/strict");
           const protocol = require(${JSON.stringify(path.join(standaloneDir, protocolPath))});
           const query = protocol.serialize.query("SELECT 1");
           assert.equal(query[0], 0x51);
           assert.equal(query.readInt32BE(1), 13);
           assert.equal(query.subarray(5).toString(), "SELECT 1\\0");`,
        ],
        { cwd: standaloneDir, encoding: "utf8" },
      );
      assert.equal(
        protocolCheck.status,
        0,
        `PostgreSQL's complete serializer/parser closure must load without source dependencies: ${protocolCheck.stderr}`,
      );
    } finally {
      await rm(projectDir, { recursive: true, force: true });
    }
  });
}
