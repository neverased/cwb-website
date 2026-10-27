import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildContactBootstrap,
  evaluateContactSubmission,
} from "../src/lib/contact";

const now = 1_700_000_010;
const options = (storageDir: string) => ({
  now,
  secret: "contact-security-regression",
  storage_dir: storageDir,
  rate_limit_max_attempts: 3,
  rate_limit_window_seconds: 60,
});
const post = async (storageDir: string, email: string, at = now) => {
  const bootstrap = await buildContactBootstrap({
    ...options(storageDir),
    now: at - 10,
    challenge_first: 4,
    challenge_second: 5,
  });
  return {
    name: "Test Sender",
    email,
    scope: "architecture",
    message: "I would like a review of our application architecture.",
    challenge_answer: "9",
    contact_nonce: bootstrap.nonce,
    contact_issued_at: String(bootstrap.issued_at),
    contact_token: bootstrap.token,
    challenge_first: "4",
    challenge_second: "5",
  };
};

const child = async (storageDir: string, index: string) => {
  const results = await Promise.all(
    Array.from({ length: 8 }, async (_, attempt) =>
      evaluateContactSubmission(
        { remoteAddress: "203.0.113.10" },
        await post(storageDir, `sender-${index}-${attempt}@example.com`),
        options(storageDir),
      ),
    ),
  );
  console.log(JSON.stringify(results.map((result) => result.classification)));
};

const runChild = (storageDir: string, index: number) =>
  new Promise<string[]>((resolve, reject) => {
    const processHandle = spawn(
      process.execPath,
      [
        "--import",
        "tsx",
        fileURLToPath(import.meta.url),
        "child",
        storageDir,
        String(index),
      ],
      { stdio: ["ignore", "pipe", "pipe"], timeout: 15_000 },
    );
    let stdout = "";
    let stderr = "";
    processHandle.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    processHandle.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    processHandle.once("error", reject);
    processHandle.once("close", (code) => {
      if (code !== 0)
        return reject(new Error(`Contact child failed: ${stderr}`));
      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(error);
      }
    });
  });

const main = async () => {
  if (process.argv[2] === "child") {
    await child(process.argv[3], process.argv[4]);
    return;
  }
  if (process.argv[2] === "email") {
    const result = await evaluateContactSubmission(
      {},
      {
        name: "Test Sender",
        message: "A normal contact message.",
        email: `sender@${"a.".repeat(250_000)}@`,
      },
      options(process.argv[3]),
    );
    assert.equal(result.classification, "reject");
    return;
  }
  const storageDir = await mkdtemp(
    path.join(tmpdir(), "cwb-contact-security-"),
  );
  try {
    const results = (
      await Promise.all(
        Array.from({ length: 4 }, (_, index) => runChild(storageDir, index)),
      )
    ).flat();
    assert.equal(
      results.filter((result) => result === "accept").length,
      3,
      "Concurrent submissions across processes must share one committed IP limit",
    );
    assert.equal(results.length, 32);
    console.log("PASS: concurrent contact admission across processes");
    const limited = await evaluateContactSubmission(
      { remoteAddress: "203.0.113.10" },
      await post(storageDir, "new-email-after-limit@example.com"),
      options(storageDir),
    );
    assert.equal(limited.classification, "quarantine");
    assert.equal(
      limited.quarantine_path,
      null,
      "Throttled traffic must not keep storing full submissions",
    );
    console.log("PASS: throttled submissions do not append quarantine records");
    const capacityDir = path.join(storageDir, "capacity");
    const cappedPolicy = { ...options(capacityDir), rate_limit_max_keys: 4 };
    const capacityResults = [];
    for (let index = 0; index < 3; index++) {
      capacityResults.push(
        await evaluateContactSubmission(
          { remoteAddress: `203.0.113.${index + 20}` },
          await post(capacityDir, `capacity-${index}@example.com`),
          cappedPolicy,
        ),
      );
    }
    assert.deepEqual(
      capacityResults.map((result) => result.classification),
      ["accept", "accept", "quarantine"],
      "Arbitrary identities cannot grow the rate-limit store past its capacity",
    );
    const afterExpiry = await evaluateContactSubmission(
      { remoteAddress: "203.0.113.99" },
      await post(capacityDir, "after-expiry@example.com"),
      { ...cappedPolicy, now: now + 61 },
    );
    assert.equal(
      afterExpiry.classification,
      "accept",
      "Expired keys release capacity",
    );
    console.log("PASS: bounded rate-limit keys and expiry");
    const quarantineDir = path.join(storageDir, "quarantine-capacity");
    const quarantinePolicy = {
      ...options(quarantineDir),
      quarantine_max_bytes: 1024,
      quarantine_retention_days: 1,
    };
    let savedPath: string | null = null;
    for (let index = 0; index < 10; index++) {
      const result = await evaluateContactSubmission(
        { remoteAddress: `198.51.100.${index + 10}` },
        {
          ...(await post(quarantineDir, `quarantine-${index}@example.com`)),
          company: "Bot",
        },
        quarantinePolicy,
      );
      assert.equal(result.classification, "quarantine");
      savedPath ??= result.quarantine_path;
    }
    assert.ok(savedPath, "The first suspicious submission remains reviewable");
    assert.ok(
      (await stat(savedPath)).size <= 1024,
      "Quarantine has a total byte cap",
    );
    assert.ok(
      (await readFile(savedPath, "utf8")).includes("quarantine-0@example.com"),
    );
    const later = now + 8 * 86400;
    const retained = await evaluateContactSubmission(
      { remoteAddress: "198.51.100.50" },
      {
        ...(await post(quarantineDir, "new-day@example.com", later)),
        company: "Bot",
      },
      { ...quarantinePolicy, now: later },
    );
    assert.ok(retained.quarantine_path);
    await assert.rejects(
      stat(savedPath),
      { code: "ENOENT" },
      "Expired quarantine partitions are removed",
    );
    console.log("PASS: bounded quarantine and retention");
    await new Promise<void>((resolve, reject) => {
      const processHandle = spawn(
        process.execPath,
        [
          "--import",
          "tsx",
          fileURLToPath(import.meta.url),
          "email",
          storageDir,
        ],
        { stdio: "ignore", timeout: 1500 },
      );
      processHandle.once("error", reject);
      processHandle.once("close", (code, signal) => {
        if (code === 0) resolve();
        else
          reject(
            new Error(
              `Oversized malformed email exceeded its bounded validation budget (${signal ?? code})`,
            ),
          );
      });
    });
    console.log(
      "PASS: oversized adversarial email rejects within a bounded CPU budget",
    );
  } finally {
    await rm(storageDir, { recursive: true, force: true });
  }
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
