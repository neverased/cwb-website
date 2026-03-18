import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const NOW = new Date();

const ROUTES: Array<{
  path: string;
  changeFrequency:
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly";
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/profile/", changeFrequency: "monthly", priority: 0.95 },
  { path: "/services/", changeFrequency: "monthly", priority: 0.9 },
  { path: "/process/", changeFrequency: "monthly", priority: 0.82 },
  { path: "/notes/", changeFrequency: "monthly", priority: 0.72 },
  { path: "/contact/", changeFrequency: "monthly", priority: 0.84 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified: NOW,
    changeFrequency,
    priority,
  }));
}
