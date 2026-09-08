import type { MetadataRoute } from "next";

import { getPostSitemapEntries } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const NOW = new Date();

const ROUTES: Array<{
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/profile/", changeFrequency: "monthly", priority: 0.95 },
  { path: "/services/", changeFrequency: "monthly", priority: 0.9 },
  { path: "/process/", changeFrequency: "monthly", priority: 0.82 },
  { path: "/notes/", changeFrequency: "monthly", priority: 0.72 },
  { path: "/contact/", changeFrequency: "monthly", priority: 0.84 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostSitemapEntries();
  return [
    ...ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified: NOW,
      changeFrequency,
      priority,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/notes/${post.slug}/`),
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
