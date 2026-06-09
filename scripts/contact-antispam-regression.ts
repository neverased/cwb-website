import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  buildContactBootstrap,
  classifyContactSubmission,
  evaluateContactSubmission,
  scoreContactSubmissionContent,
} from "../src/lib/contact";

const createStorageDir = () => mkdtemp(path.join(tmpdir(), "cwb-contact-tests-"));

const baseServer = {
  remoteAddress: "203.0.113.10",
  userAgent: "contact-regression",
};

const buildPost = async (
  storageDir: string,
  overrides: Record<string, string> = {},
  now = 1_700_000_010,
) => {
  const bootstrap = await buildContactBootstrap({
    now: now - 10,
    challenge_first: 4,
    challenge_second: 5,
    nonce: `nonce-${Math.random().toString(16).slice(2)}`,
    secret: "test-secret",
    storage_dir: storageDir,
  });

  return {
    name: "Test Sender",
    email: "sender@example.com",
    scope: "architecture",
    message: "I need help with a small architecture review.",
    challenge_answer: String(
      bootstrap.challenge_first + bootstrap.challenge_second,
    ),
    contact_nonce: bootstrap.nonce,
    contact_issued_at: String(bootstrap.issued_at),
    contact_token: bootstrap.token,
    challenge_first: String(bootstrap.challenge_first),
    challenge_second: String(bootstrap.challenge_second),
    website: "",
    company: "",
    full_name_confirm: "",
    ...overrides,
  };
};

const withStorage = async (test: (storageDir: string) => Promise<void>) => {
  const storageDir = await createStorageDir();

  try {
    await test(storageDir);
  } finally {
    await rm(storageDir, {
      recursive: true,
      force: true,
    });
  }
};

const main = async () => {
  assert.equal(
    classifyContactSubmission({
      has_invalid_payload: true,
    }),
    "reject",
  );
  assert.equal(
    classifyContactSubmission({
      honeypot_hits: 1,
    }),
    "quarantine",
  );
  assert.equal(
    classifyContactSubmission({
      spam_score: 5,
      spam_threshold: 5,
    }),
    "quarantine",
  );
  assert.equal(classifyContactSubmission({}), "accept");

  assert.deepEqual(scoreContactSubmissionContent("Useful message with no spam."), {
    score: 0,
    reasons: [],
  });
  assert.equal(
    scoreContactSubmissionContent(
      "Please sell me backlinks and improve Google rankings.",
    ).score,
    6,
  );

  await withStorage(async (storageDir) => {
    const evaluation = await evaluateContactSubmission(
      baseServer,
      await buildPost(storageDir),
      {
        now: 1_700_000_010,
        secret: "test-secret",
        storage_dir: storageDir,
        rate_limit_max_attempts: 3,
        rate_limit_window_seconds: 60,
      },
    );

    assert.equal(evaluation.classification, "accept");
    assert.deepEqual(evaluation.reasons, []);
  });

  await withStorage(async (storageDir) => {
    const evaluation = await evaluateContactSubmission(
      baseServer,
      await buildPost(storageDir, {
        contact_token: "bad-token",
      }),
      {
        now: 1_700_000_010,
        secret: "test-secret",
        storage_dir: storageDir,
      },
    );

    assert.equal(evaluation.classification, "reject");
    assert.ok(evaluation.reasons.includes("invalid_bootstrap_token"));
  });

  await withStorage(async (storageDir) => {
    const evaluation = await evaluateContactSubmission(
      baseServer,
      await buildPost(storageDir, {
        company: "Injected Corp",
      }),
      {
        now: 1_700_000_010,
        secret: "test-secret",
        storage_dir: storageDir,
      },
    );

    assert.equal(evaluation.classification, "quarantine");
    assert.ok(evaluation.reasons.includes("honeypot_company"));
    assert.ok(evaluation.quarantine_path);
  });

  await withStorage(async (storageDir) => {
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      const evaluation = await evaluateContactSubmission(
        baseServer,
        await buildPost(storageDir, {
          email: `sender-${attempt}@example.com`,
        }),
        {
          now: 1_700_000_010 + attempt,
          secret: "test-secret",
          storage_dir: storageDir,
          rate_limit_max_attempts: 3,
          rate_limit_window_seconds: 600,
        },
      );

      assert.equal(
        evaluation.classification,
        attempt < 4 ? "accept" : "quarantine",
      );
    }
  });

  console.log("Contact anti-spam regression checks passed.");
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
