import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";

// Set LIVE_STATE_IGNORE_SOURCE=HEAD to run the same contract against committed
// ignore rules when demonstrating the pre-fix behavior. CI uses the worktree.
const source = process.env.LIVE_STATE_IGNORE_SOURCE || "working-tree";
assert.ok(["working-tree", "HEAD"].includes(source));
const context = process.env.SECURITY_TEST_DOCKER_CONTEXT || "desktop-linux";
const repository = path.resolve(import.meta.dirname, "..");
const secretMarker = `FAKE_LOCAL_CAPABILITY_${randomUUID()}`;
const retained = {
  ".impeccable/live/config.json": '{"pageFiles":["src/page.html"]}\n',
  ".impeccable/design.json": '{"components":[]}\n',
  "src/page.html": "<p>Ordinary source must remain available.</p>\n",
};
const sensitive = [
  ".impeccable/live/server.json",
  ".impeccable/live/sessions/example.jsonl",
  ".impeccable/live/annotations/session-example/screenshot.png",
  ".impeccable/live/pending-manual-edits.json",
  ".impeccable/live/manual-edit-apply-transaction.json",
  ".impeccable/live/cache/future-generated-state.json",
  ".impeccable-live.json",
  ".impeccable-live/sessions/example.jsonl",
  ".impeccable-live/annotations/session-example/screenshot.png",
];
let directory;
let fixture;

function command(binary, args, { allowedStatuses = [0], ...options } = {}) {
  const result = spawnSync(binary, args, {
    cwd: repository,
    encoding: "utf8",
    timeout: 120_000,
    maxBuffer: 4 * 1024 * 1024,
    ...options,
  });
  assert.ok(
    allowedStatuses.includes(result.status),
    `${binary} ${args[0]} failed: ${result.stderr || result.error || result.status}`,
  );
  return result.stdout;
}

function docker(args) {
  const env = { ...process.env };
  delete env.BUILDX_BUILDER;
  delete env.DOCKER_HOST;
  return command("docker", ["--context", context, ...args], { env });
}

before(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "cwb-live-state-exclusion-"));
  fixture = path.join(directory, "fixture");
  await mkdir(fixture);
  for (const name of [".gitignore", ".dockerignore"]) {
    const content =
      source === "HEAD"
        ? command("git", ["show", `HEAD:${name}`])
        : await readFile(path.join(repository, name), "utf8");
    await writeFile(path.join(fixture, name), content);
  }
  for (const [name, content] of [
    ...Object.entries(retained),
    ...sensitive.map((name) => [name, `${secretMarker}:${name}\n`]),
  ]) {
    const destination = path.join(fixture, name);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content);
  }
  await writeFile(
    path.join(fixture, "Dockerfile"),
    "FROM scratch\nCOPY . /context/\n",
  );
  command("git", ["init", "--quiet", fixture]);
});

after(async () => {
  if (directory) await rm(directory, { recursive: true, force: true });
});

test(`${source}: Git excludes generated capabilities and retains shared configuration`, () => {
  const names = [...sensitive, ...Object.keys(retained)];
  const ignored = new Set(
    command(
      "git",
      ["-C", fixture, "check-ignore", "--no-index", "--stdin", "-z"],
      {
        input: names.join("\0") + "\0",
        allowedStatuses: [0, 1],
      },
    )
      .split("\0")
      .filter(Boolean),
  );
  for (const name of Object.keys(retained)) {
    assert.ok(
      !ignored.has(name),
      `Shared file was incorrectly ignored: ${name}`,
    );
  }
  assert.deepEqual(
    sensitive.filter((name) => !ignored.has(name)),
    [],
    "Generated capabilities and session data must not be eligible for Git staging",
  );
});

test(`${source}: exported Docker context excludes generated capabilities and retains source`, async () => {
  const endpoint = JSON.parse(docker(["context", "inspect", context]))[0]
    .Endpoints.docker.Host;
  assert.ok(
    endpoint.startsWith("unix://"),
    "Use a local Docker context, never an SSH/TCP deployment context",
  );
  const output = path.join(directory, "export");
  // The context-associated builder is explicit, so neither the user's active
  // context nor a separately selected buildx builder can select a remote host.
  docker([
    "buildx",
    "build",
    "--builder",
    context,
    "--network=none",
    "--no-cache",
    "--progress=plain",
    "--output",
    `type=local,dest=${output}`,
    fixture,
  ]);
  const exported = path.join(output, "context");
  const allFiles = [];
  async function walk(parent, prefix = "") {
    for (const entry of await readdir(parent, { withFileTypes: true })) {
      const name = path.posix.join(prefix, entry.name);
      if (entry.isDirectory()) await walk(path.join(parent, entry.name), name);
      else allFiles.push(name);
    }
  }
  await walk(exported);
  for (const [name, expected] of Object.entries(retained)) {
    assert.equal(await readFile(path.join(exported, name), "utf8"), expected);
  }
  const leakedMarkers = [];
  for (const name of allFiles) {
    if (
      (await readFile(path.join(exported, name))).includes(
        Buffer.from(secretMarker),
      )
    )
      leakedMarkers.push(name);
  }
  assert.deepEqual(
    leakedMarkers,
    [],
    "Actual COPY context must contain no fake capability, journal, annotation, or staged-edit markers",
  );
  assert.ok(
    sensitive.every((name) => !allFiles.includes(name)),
    "Sensitive generated paths must be absent",
  );
});
