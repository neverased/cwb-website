import assert from "node:assert/strict";
import { test } from "node:test";

import { getPostImageSchema, getPostSocialImage } from "../src/lib/post_seo";
import type { Media } from "../src/payload-types";

const post = { title: "A technical note", slug: "a-technical-note" };

test("coverless articles use their own image in metadata and structured data", () => {
  const image = getPostSocialImage(post);
  assert.deepEqual(image, {
    url: "https://wojciechbajer.com/notes/a-technical-note/opengraph-image/",
    alt: post.title,
    width: 1200,
    height: 630,
  });
  assert.deepEqual(getPostImageSchema(post), {
    "@type": "ImageObject",
    url: image.url,
    caption: image.alt,
    width: image.width,
    height: image.height,
  });
  assert.notEqual(
    getPostSocialImage({ ...post, slug: "another-note" }).url,
    image.url,
  );
});

test("an uploaded cover takes priority and keeps its actual dimensions", () => {
  const coverImage: Media = {
    id: 1,
    alt: "Architecture diagram",
    url: "/api/cms/media/file/architecture.webp",
    width: 1600,
    height: 900,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
  const withCover = { ...post, coverImage };
  const image = getPostSocialImage(withCover);
  assert.deepEqual(image, {
    url: "https://wojciechbajer.com/api/cms/media/file/architecture.webp",
    alt: coverImage.alt,
    width: 1600,
    height: 900,
  });
  assert.equal(getPostImageSchema(withCover).url, image.url);
  assert.equal(getPostImageSchema(withCover).width, image.width);
  assert.equal(getPostImageSchema(withCover).height, image.height);
});

test("unknown cover dimensions are omitted and unresolved covers fall back", () => {
  const coverImage: Media = {
    id: 1,
    alt: "",
    url: "https://images.example.test/cover.webp",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
  assert.deepEqual(getPostSocialImage({ ...post, coverImage }), {
    url: coverImage.url,
    alt: post.title,
  });
  assert(!("width" in getPostImageSchema({ ...post, coverImage })));
  for (const unavailable of [null, 1, { ...coverImage, url: null }]) {
    assert.deepEqual(
      getPostSocialImage({ ...post, coverImage: unavailable }),
      getPostSocialImage(post),
    );
  }
});
