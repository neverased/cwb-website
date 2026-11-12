import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

import { JSDOM } from "jsdom";
import {
  deepMerge,
  deepMergeWithCombinedArrays,
  deepMergeWithReactComponents,
  deepMergeWithSourceArrays,
} from "payload";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("Payload merges cannot inherit attacker-controlled target properties", () => {
  const target = JSON.parse(
    '{"__proto__":{"injected":true},"title":"Legitimate content"}',
  );
  const merged = deepMerge<Record<string, unknown>>(target, {
    description: "Updated content",
  });

  assert.equal(Object.getPrototypeOf(merged), Object.prototype);
  assert.equal(merged.injected, undefined);
  assert.equal(merged.title, "Legitimate content");
  assert.equal(merged.description, "Updated content");
  assert.equal(Object.hasOwn(Object.prototype, "injected"), false);
});

test("all Payload merge modes preserve safe own properties and nested data", () => {
  const symbol = Symbol("metadata");
  type Document = { nested: Record<string | symbol, unknown> };
  for (const merge of [
    (target: object, source: object) => deepMerge<Document>(target, source),
    deepMergeWithCombinedArrays<Document>,
    deepMergeWithReactComponents<Document>,
    deepMergeWithSourceArrays<Document>,
  ]) {
    const target = JSON.parse('{"nested":{"__proto__":{"injected":true}}}');
    const source = Object.assign(Object.create(null), {
      nested: { title: "Valid update", [symbol]: "kept" },
    });
    const merged = merge(target, source);
    assert.equal(Object.getPrototypeOf(merged.nested), Object.prototype);
    assert.equal(merged.nested.injected, undefined);
    assert.equal(merged.nested.title, "Valid update");
    assert.equal(merged.nested[symbol], "kept");
    assert.equal(Object.hasOwn(merged.nested, "__proto__"), true);
  }

  const source = JSON.parse('{"__proto__":{"injected":true},"title":"Safe"}');
  const merged = deepMerge<Record<string, unknown>>(
    Object.create(null),
    source,
  );
  assert.equal(Object.getPrototypeOf(merged), Object.prototype);
  assert.equal(merged.injected, undefined);
  assert.equal(merged.title, "Safe");
  assert.equal(Object.hasOwn(merged, "__proto__"), true);

  const combined = deepMerge<Record<string, unknown>>(
    source,
    JSON.parse('{"__proto__":{"other":true}}'),
  );
  assert.equal(Object.getPrototypeOf(combined), Object.prototype);
  assert.equal(combined.injected, undefined);
  assert.equal(combined.other, undefined);
});

test("Payload merge options retain arrays, reference choices and React rendering", () => {
  assert.deepEqual(deepMerge({ items: [1] }, { items: [2] }), {
    items: [1, 2],
  });
  assert.deepEqual(deepMergeWithSourceArrays({ items: [1] }, { items: [2] }), {
    items: [2],
  });
  assert.deepEqual(
    deepMergeWithCombinedArrays(
      { items: [{ id: 1 }] },
      { items: [{ name: "A" }] },
    ),
    { items: [{ id: 1, name: "A" }] },
  );
  const value = { title: "Keep identity" };
  const merged = deepMerge({}, { value }, { clone: false });
  assert.equal(merged.value, value);
  assert.deepEqual(
    deepMerge(
      { items: [1] },
      { items: [2] },
      { arrayMerge: (_, source) => source },
    ),
    { items: [2] },
  );
  const element = createElement("span", null, "CMS component");
  assert.equal(
    renderToStaticMarkup(
      deepMergeWithReactComponents<{ element: typeof element }>({}, { element })
        .element,
    ),
    "<span>CMS component</span>",
  );
});

test("Monaco's sanitizer removes split template expressions from shadow roots", async () => {
  const { default: createDOMPurify } = await import(
    import.meta.resolve("monaco-editor/base/browser/dompurify/dompurify")
  );
  const { window } = new JSDOM("<!doctype html><body></body>");
  try {
    const purify = createDOMPurify(window);
    const host = window.document.createElement("div");
    const root = host.attachShadow({ mode: "open" });
    root.append(
      window.document.createTextNode("$"),
      window.document.createElement("object"),
      window.document.createTextNode("{untrustedExpression}"),
    );
    purify.sanitize(host, { IN_PLACE: true, SAFE_FOR_TEMPLATES: true });
    root.normalize();
    assert(!root.textContent.includes("${untrustedExpression}"));
    assert.equal(
      purify.sanitize(
        '<p>Legitimate text</p><img src="x" onerror="untrusted()">',
      ),
      '<p>Legitimate text</p><img src="x">',
    );
  } finally {
    window.close();
  }
});

test("Drizzle's legacy TypeScript loader still transforms source with patched esbuild", async () => {
  const adapterRequire = createRequire(
    import.meta.resolve("@payloadcms/db-postgres"),
  );
  const drizzleRequire = createRequire(
    adapterRequire.resolve("drizzle-kit/api"),
  );
  const loaderRequire = createRequire(
    drizzleRequire.resolve("@esbuild-kit/esm-loader"),
  );
  const { transform, transformSync } = loaderRequire("@esbuild-kit/core-utils");
  const source = "const value: number = 42; export { value };";
  const synchronous = transformSync(source, "/tmp/cwb-loader-control.ts");
  const module = { exports: {} as { value?: number } };
  runInNewContext(synchronous.code, { module, exports: module.exports });
  assert.equal(module.exports.value, 42);
  const asynchronous = await transform(source, "/tmp/cwb-loader-control.ts");
  const loaded = await import(
    `data:text/javascript;base64,${Buffer.from(asynchronous.code).toString("base64")}`
  );
  assert.equal(loaded.value, 42);
});

test("Lexical's headless DOM still parses and serializes content after the Happy DOM upgrade", async () => {
  const lexicalRequire = createRequire(
    import.meta.resolve("@payloadcms/richtext-lexical"),
  );
  const { withDOM } = lexicalRequire("@lexical/headless/dom");
  const previousWindow = globalThis.window;
  const html = withDOM((window: Window) => {
    const node = window.document.createElement("div");
    node.innerHTML = "<p>CMS <strong>content</strong></p>";
    return node.innerHTML;
  });
  assert.equal(html, "<p>CMS <strong>content</strong></p>");
  assert.equal(globalThis.window, previousWindow);
});
