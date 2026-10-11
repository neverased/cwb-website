import assert from "node:assert/strict";

import { absoluteUrl, SITE_URL } from "../src/lib/seo";
import { servicePages, servicePath } from "../src/lib/service_pages";

// Read-only checks against a running production build with its CMS database.
const base = new URL(process.env.SEO_TEST_URL || "http://127.0.0.1:3100");
const decode = (value: string) =>
  value.replace(
    /&(amp|quot|apos|lt|gt|#39|#x27);/g,
    (entity) =>
      ({
        "&amp;": "&",
        "&quot;": '"',
        "&apos;": "'",
        "&lt;": "<",
        "&gt;": ">",
        "&#39;": "'",
        "&#x27;": "'",
      })[entity]!,
  );
const attributes = (tag: string) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, name, value]) => [
      name,
      decode(value),
    ]),
  );
const tags = (html: string, name: string) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map(([tag]) =>
    attributes(tag),
  );
const fetchPath = (path: string, redirect: RequestRedirect = "follow") =>
  fetch(new URL(path, base), { redirect, signal: AbortSignal.timeout(30000) });
const localPath = (href: string, from = "/") => {
  const url = new URL(href, new URL(from, SITE_URL));
  return url.origin === SITE_URL ? `${url.pathname}${url.search}` : null;
};

const sitemapResponse = await fetchPath("/sitemap.xml", "manual");
assert.equal(sitemapResponse.status, 200, "Sitemap must be available");
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) =>
  decode(url),
);
assert.equal(
  new Set(urls).size,
  urls.length,
  "Sitemap must not duplicate URLs",
);
for (const { id } of servicePages) {
  assert(
    urls.includes(absoluteUrl(servicePath(id))),
    `Missing service in sitemap: ${id}`,
  );
}
assert(
  !urls.some((url) => /\/(quotes|admin|api)\//.test(url)),
  "Private routes cannot enter the sitemap",
);

const titles = new Set<string>();
const descriptions = new Set<string>();
const links = new Set<string>();
const images = new Set<string>();
const htmlByPath = new Map<string, string>();

for (const url of urls) {
  const path = localPath(url);
  assert(path, `Unexpected sitemap origin: ${url}`);
  const response = await fetchPath(path, "manual");
  assert.equal(
    response.status,
    200,
    `${path} must return 200 without a redirect`,
  );
  assert(
    !/noindex/i.test(response.headers.get("x-robots-tag") || ""),
    `${path} has an indexing block`,
  );
  const html = await response.text();
  htmlByPath.set(path, html);
  assert.match(
    html,
    /<html[^>]*lang="en"/,
    `${path} needs the correct language`,
  );
  assert.equal(tags(html, "h1").length, 1, `${path} needs one primary heading`);
  const titleMatches = [...html.matchAll(/<title>([^<]+)<\/title>/g)];
  assert.equal(titleMatches.length, 1, `${path} needs one title`);
  const title = decode(titleMatches[0][1]);
  assert(!titles.has(title), `${path} repeats a page title`);
  titles.add(title);
  const meta = tags(html, "meta");
  const descriptionTags = meta.filter((tag) => tag.name === "description");
  assert.equal(descriptionTags.length, 1, `${path} needs one description`);
  const description = descriptionTags[0].content;
  assert(
    description && !descriptions.has(description),
    `${path} needs a distinct description`,
  );
  descriptions.add(description);
  assert(
    !meta.some(
      (tag) =>
        ["robots", "googlebot"].includes(tag.name) &&
        /noindex/i.test(tag.content),
    ),
    `${path} must be indexable`,
  );
  const canonicals = tags(html, "link").filter(
    (tag) => tag.rel === "canonical",
  );
  assert.deepEqual(
    canonicals.map((tag) => tag.href),
    [url],
    `${path} canonical must match its sitemap URL`,
  );
  assert.equal(
    meta.find((tag) => tag.property === "og:url")?.content,
    url,
    `${path} needs its own OG URL`,
  );

  const graphs = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].flatMap(([, json]) => JSON.parse(json)["@graph"] || []);
  assert(graphs.length, `${path} needs valid structured data`);
  const service = servicePages.find(({ id }) => servicePath(id) === path);
  if (service) {
    assert(
      graphs.some((node) => node["@type"] === "Service" && node.url === url),
      `${path} needs a matching Service entity`,
    );
    assert(
      graphs.some((node) => node["@type"] === "BreadcrumbList"),
      `${path} needs breadcrumbs`,
    );
    assert(
      html.includes(`href="/contact/?service=${service.id}"`),
      `${path} must preserve the contact intent`,
    );
  }
  for (const tag of tags(html, "a")) {
    if (!tag.href) continue;
    const target = localPath(tag.href, path);
    if (target && !/^\/(quotes|admin|api)\//.test(target)) links.add(target);
  }
  for (const tag of tags(html, "img")) {
    assert("alt" in tag, `Image without alt on ${path}`);
    if (tag.src) {
      const target = localPath(tag.src, path);
      if (target) images.add(target);
    }
  }
  for (const tag of meta.filter(
    (item) => item.property === "og:image" || item.name === "twitter:image",
  )) {
    const target = localPath(tag.content, path);
    if (target) images.add(target);
  }
}

for (const { id } of servicePages) {
  const href = `href="${servicePath(id)}"`;
  assert(
    htmlByPath.get("/services/")?.includes(href),
    `Service hub must link to ${id} in server HTML`,
  );
  assert(
    htmlByPath.get("/profile/")?.includes(href),
    `Profile must link to ${id} in server HTML`,
  );
}
for (const path of links) {
  const response = await fetchPath(path);
  assert.equal(response.status, 200, `Broken internal link: ${path}`);
}
for (const path of images) {
  const response = await fetchPath(path);
  assert.equal(response.status, 200, `Broken image: ${path}`);
  assert.match(
    response.headers.get("content-type") || "",
    /^image\//,
    `Expected an image: ${path}`,
  );
}
for (const path of [
  "/services/unknown-service/",
  "/notes/unknown-seo-test-note/",
]) {
  const response = await fetchPath(path);
  assert.equal(response.status, 404, `${path} must not become a soft 404`);
}
console.log(
  `SEO HTTP checks passed: ${urls.length} sitemap pages, ${links.size} internal links, ${images.size} images; all six services discoverable without JavaScript.`,
);
