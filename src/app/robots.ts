import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // CMS uploads are public article images, even though their URLs use /api/.
      allow: ["/", "/api/cms/media/file/"],
      disallow: ["/admin/", "/api/", "/quotes/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
