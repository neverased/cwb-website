import assert from "node:assert/strict";

import { chromium } from "playwright";

const base = new URL(process.env.CMS_TEST_URL || "http://127.0.0.1:3100");
assert(
  ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname) &&
    ["http:", "https:"].includes(base.protocol),
  "CMS browser checks require a local test stack",
);
const email = process.env.CMS_TEST_EMAIL;
const password = process.env.CMS_TEST_PASSWORD;
assert(email && password, "Set disposable CMS_TEST_EMAIL/PASSWORD");

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ serviceWorkers: "block" });
  const forbiddenRequests = new Set<string>();
  const externalAttempt = Promise.withResolvers<string>();
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    // Payload's existing account avatar is an image, not executable editor
    // code. Keep that one established external resource while blocking CDNs.
    const isGravatarImage =
      request.resourceType() === "image" &&
      url.origin === "https://www.gravatar.com" &&
      url.pathname.startsWith("/avatar/");
    if (
      ["http:", "https:"].includes(url.protocol) &&
      url.origin !== base.origin &&
      !isGravatarImage
    ) {
      forbiddenRequests.add(url.origin);
      externalAttempt.resolve(url.origin);
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });

  const page = await context.newPage();
  page.setDefaultTimeout(60_000);
  page.setDefaultNavigationTimeout(60_000);
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const workerFallbacks: string[] = [];
  let workersStarted = 0;
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
    if (/web worker|falling back/i.test(message.text()))
      workerFallbacks.push(message.text());
  });
  page.on("worker", () => {
    workersStarted++;
  });

  // The API request shares cookies with the browser. Never print the response,
  // which contains an authentication token, or the disposable credentials.
  const login = await page.request.post(
    new URL("/api/cms/users/login/", base).href,
    {
      data: { email, password },
      headers: { Origin: base.origin },
      maxRedirects: 0,
      timeout: 30_000,
    },
  );
  assert.equal(
    login.status(),
    200,
    "Disposable CMS administrator login failed",
  );
  await login.dispose();

  await Promise.race([
    (async () => {
      const response = await page.goto(
        new URL("/admin/collections/quotes/create/", base).href,
        { waitUntil: "domcontentloaded" },
      );
      assert.equal(response?.status(), 200, "Quote creation page must load");
      assert.equal(
        new URL(page.url()).pathname,
        "/admin/collections/quotes/create/",
      );
      await page
        .getByRole("button", { name: "Dostęp i decyzja klienta", exact: true })
        .click();
      await page
        .locator(".monaco-editor")
        .first()
        .waitFor({ state: "visible" });
      await page.waitForFunction(() => {
        const monaco = (
          window as Window & {
            monaco?: typeof import("monaco-editor/editor");
          }
        ).monaco;
        return monaco?.editor.getEditors().some((editor) => {
          const bounds = editor.getDomNode()?.getBoundingClientRect();
          return (
            bounds &&
            bounds.width > 0 &&
            bounds.height > 0 &&
            editor.getModel()?.getLanguageId() === "json"
          );
        });
      });

      const validationCompleted = await page.evaluate(async () => {
        const monaco = (
          window as Window & {
            monaco?: typeof import("monaco-editor/editor");
          }
        ).monaco;
        if (!monaco)
          throw new Error("The visible editor must use local Monaco");
        const editor = monaco.editor.getEditors().find((candidate) => {
          const bounds = candidate.getDomNode()?.getBoundingClientRect();
          return (
            bounds &&
            bounds.width > 0 &&
            bounds.height > 0 &&
            candidate.getModel()?.getLanguageId() === "json"
          );
        });
        const model = editor?.getModel();
        if (!model || !monaco.editor.getModels().includes(model))
          throw new Error(
            "Visible JSON model must belong to shared local Monaco",
          );
        const originalValue = model.getValue();
        const waitForDiagnostics = async (expectErrors: boolean) => {
          const deadline = Date.now() + 30_000;
          while (Date.now() < deadline) {
            const markers = monaco.editor.getModelMarkers({
              resource: model.uri,
            });
            if (markers.length > 0 === expectErrors) return;
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          throw new Error(
            expectErrors
              ? "JSON worker did not report invalid JSON"
              : "JSON worker did not clear diagnostics for valid JSON",
          );
        };
        try {
          // Only modify this unsaved form's client-side model, never submit it.
          model.setValue('{"verification": }');
          await waitForDiagnostics(true);
          model.setValue('{"verification":true}');
          await waitForDiagnostics(false);
          return true;
        } finally {
          model.setValue(originalValue);
        }
      });
      assert(
        validationCompleted,
        "The JSON worker must report and clear syntax diagnostics",
      );
    })(),
    externalAttempt.promise.then((origin) => {
      throw new Error(
        `CMS requested a forbidden external resource from ${origin}`,
      );
    }),
  ]);

  assert.deepEqual(
    [...forbiddenRequests],
    [],
    "CMS editor resources must remain local",
  );
  assert(workersStarted > 0, "JSON validation must start a browser worker");
  assert.equal(
    workerFallbacks.length,
    0,
    "Monaco must not fall back from browser workers",
  );
  assert.equal(pageErrors.length, 0, "CMS emitted a browser page error");
  assert.equal(consoleErrors.length, 0, "CMS emitted a console error");
  console.log(
    "PASS: quote JSON editor uses local Monaco and a working JSON worker without external editor requests or browser errors",
  );
} finally {
  await browser.close();
}
