import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";

export async function getPublishedPosts(page = 1) {
  const payload = await getPayload({ config });
  return payload.find({
    collection: "posts",
    overrideAccess: false,
    draft: false,
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 12,
    page,
    depth: 1,
    select: { title: true, slug: true, excerpt: true, publishedAt: true },
  });
}

export const getPublishedPost = cache(async (slug: string) => {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "posts",
    overrideAccess: false,
    draft: false,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
    },
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
});

export async function getPostSitemapEntries() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "posts",
    overrideAccess: false,
    draft: false,
    where: { _status: { equals: "published" } },
    pagination: false,
    depth: 0,
    select: { slug: true, updatedAt: true },
  });
  return result.docs;
}

export const formatPostDate = (date: string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(date),
  );
