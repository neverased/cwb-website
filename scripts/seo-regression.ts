import assert from "node:assert/strict";
import { test } from "node:test";

import nextConfig from "../next.config.mjs";
import robots from "../src/app/robots";
import { absoluteUrl, buildMetadata, openGraphImagePath } from "../src/lib/seo";

test("theme client hints cannot restart public-page requests", async () => {
  assert(nextConfig.headers);
  const rules = await nextConfig.headers();
  const isThemeHint = ({ key }: { key: string }) =>
    ["accept-ch", "critical-ch"].includes(key.toLowerCase());
  assert(
    !rules
      .filter((rule) => rule.source === "/:path*")
      .some((rule) => rule.headers.some(isThemeHint)),
    "Public pages must not request color-scheme client hints",
  );
  assert(
    rules.some(
      (rule) =>
        rule.source === "/admin/:path*" && rule.headers.some(isThemeHint),
    ),
    "Keep automatic theme selection for the CMS",
  );
});

test("pagination keeps its canonical URL but shares the listing image", () => {
  const metadata = buildMetadata({
    title: "Notes — Page 2 | Wojciech Bajer",
    description: "Older technical notes.",
    path: "/notes/?page=2",
  });
  assert.equal(
    metadata.alternates?.canonical,
    "https://wojciechbajer.com/notes/?page=2",
  );
  assert.equal(openGraphImagePath("/notes/?page=2"), "/notes/opengraph-image");
  assert.equal(
    openGraphImagePath("/services/#audits"),
    "/services/opengraph-image",
  );
  assert.deepEqual(metadata.twitter?.images, [
    "https://wojciechbajer.com/notes/opengraph-image/",
  ]);
});

test("canonical URL normalization preserves queries, fragments and media files", () => {
  assert.equal(
    absoluteUrl("/notes?page=2"),
    "https://wojciechbajer.com/notes/?page=2",
  );
  assert.equal(
    absoluteUrl("/notes/?page=2#list"),
    "https://wojciechbajer.com/notes/?page=2#list",
  );
  assert.equal(
    absoluteUrl("/api/cms/media/file/cover.webp"),
    "https://wojciechbajer.com/api/cms/media/file/cover.webp",
  );
});

test("robots allows public CMS image files while excluding the API and admin", () => {
  const rules = robots().rules;
  assert(!Array.isArray(rules));
  const paths = (value: string | string[] | undefined) =>
    typeof value === "string" ? [value] : value || [];
  const canCrawl = (path: string) => {
    const longest = (prefixes: string[]) =>
      Math.max(
        -1,
        ...prefixes
          .filter((prefix) => path.startsWith(prefix))
          .map((prefix) => prefix.length),
      );
    return longest(paths(rules.allow)) >= longest(paths(rules.disallow));
  };
  for (const path of [
    "/",
    "/notes/example/",
    "/_next/static/chunk.js",
    "/api/cms/media/file/cover.webp",
  ]) {
    assert(canCrawl(path), `Crawlers must be able to fetch ${path}`);
  }
  for (const path of [
    "/admin/",
    "/admin/login/",
    "/api/cms/posts/",
    "/api/cms/media/",
    "/api/contact/",
  ]) {
    assert(!canCrawl(path), `Do not crawl ${path}`);
  }
});
