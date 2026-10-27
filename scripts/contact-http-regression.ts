import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { POST } from "../src/app/api/contact/route";
import { buildContactBootstrap } from "../src/lib/contact";

const main = async () => {
  let produced = 0;
  let canceled = false;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (produced === 64) return controller.close();
      controller.enqueue(
        new TextEncoder().encode(
          (produced++ === 0 ? "ignored=" : "") + "x".repeat(16 * 1024),
        ),
      );
    },
    cancel() {
      canceled = true;
    },
  });
  const request = new Request("https://example.com/api/contact/", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    },
    body,
    duplex: "half",
  } as RequestInit);
  const response = await POST(request);
  assert.equal(response.status, 422);
  assert.equal(
    canceled,
    true,
    "Oversized bodies without Content-Length are canceled before fully reading",
  );
  assert.ok(produced < 64);
  console.log("PASS: streamed contact body is bounded before form parsing");
  for (const referer of [
    "https://attacker.example/trap",
    "//attacker.example/trap",
    "https://[",
    "javascript:alert(1)",
    "https://example.com/other?secret=value",
    null,
  ]) {
    const response = await POST(
      new Request("https://example.com/api/contact/", {
        method: "POST",
        headers: referer ? { referer } : {},
        body: new URLSearchParams({ ignored: "invalid form" }),
      }),
    );
    assert.equal(response.status, 303);
    const target = new URL(
      response.headers.get("location")!,
      "https://example.com",
    );
    assert.equal(
      target.href,
      "https://example.com/contact/?contact=invalid#contact",
      "Every browser response must use the fixed local contact destination",
    );
  }
  console.log("PASS: contact redirects cannot use the Referer destination");
  const storageDir = await mkdtemp(path.join(tmpdir(), "cwb-contact-http-"));
  process.env.CONTACT_FORM_SECRET = "http-regression-only";
  process.env.CONTACT_STORAGE_DIR = storageDir;
  try {
    const bootstrap = await buildContactBootstrap({
      now: Math.floor(Date.now() / 1000) - 10,
    });
    const fields = {
      name: "Test Sender",
      email: "sender@example.com",
      scope: "architecture",
      message: "Please review our application architecture.",
      company: "Bot",
      challenge_answer: String(
        bootstrap.challenge_first + bootstrap.challenge_second,
      ),
      contact_nonce: bootstrap.nonce,
      contact_issued_at: String(bootstrap.issued_at),
      contact_token: bootstrap.token,
      challenge_first: String(bootstrap.challenge_first),
      challenge_second: String(bootstrap.challenge_second),
    };
    const submit = (body: FormData | URLSearchParams) =>
      POST(
        new Request("https://example.com/api/contact/", {
          method: "POST",
          headers: { accept: "application/json" },
          body,
        }),
      );
    const form = () => {
      const data = new FormData();
      for (const [key, value] of Object.entries(fields)) data.set(key, value);
      return data;
    };
    for (const body of [
      new URLSearchParams(fields),
      form(),
      new URLSearchParams({
        ...fields,
        name: "😀".repeat(120),
        message: "😀".repeat(5000),
      }),
    ]) {
      const result = await submit(body);
      assert.equal(
        result.status,
        200,
        "Valid bounded forms preserve success behavior",
      );
      assert.deepEqual(await result.json(), { status: "sent" });
    }
    const filePart = form();
    filePart.set("name", new Blob(["not a contact field"]), "Test Sender");
    const duplicate = form();
    duplicate.append("email", "another@example.com");
    const extra = form();
    extra.append("unexpected", "value");
    for (const body of [filePart, duplicate, extra])
      assert.equal((await submit(body)).status, 422);
    const declared = await POST(
      new Request("https://example.com/api/contact/", {
        method: "POST",
        headers: { accept: "application/json", "content-length": "1000000" },
        body: new URLSearchParams(fields),
      }),
    );
    assert.equal(declared.status, 422);
    console.log(
      "PASS: declared limits, file/duplicate/unknown fields and valid multipart/URL-encoded controls",
    );
  } finally {
    await rm(storageDir, { recursive: true, force: true });
  }
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
