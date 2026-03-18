import type { Metadata } from "next";

export const SITE_URL = "https://wojciechbajer.com";
export const SITE_NAME = "Wojciech Bajer";
export const DEFAULT_TITLE =
  "Wojciech Bajer | Multimedia, Software, Architecture, Audits";
export const DEFAULT_DESCRIPTION =
  "Wojciech Bajer works across multimedia, software engineering, application architecture, and independent product or technology audits.";
export const PERSON_NAME = "Wojciech Bajer";
export const CONTACT_EMAIL = "mail@wojciechbajer.com";
export const PROFILE_PATH = "/profile/";
export const DEFAULT_KEYWORDS = [
  "Wojciech Bajer",
  "multimedia",
  "software engineering",
  "application architecture",
  "technical audits",
  "product audits",
  "audio",
  "video",
  "frontend systems",
  "consulting",
] as const;

const hasFileExtension = (path: string) => /\.[a-z0-9]+$/i.test(path);

export const normalizePath = (path: string) => {
  if (path === "/" || path === "") {
    return "/";
  }

  if (path.includes("#") || path.includes("?")) {
    const url = new URL(path, SITE_URL);
    const pathname = hasFileExtension(url.pathname)
      ? url.pathname
      : url.pathname.endsWith("/")
        ? url.pathname
        : `${url.pathname}/`;

    return `${pathname}${url.search}${url.hash}`;
  }

  if (hasFileExtension(path)) {
    return path;
  }

  return path.endsWith("/") ? path : `${path}/`;
};

export const absoluteUrl = (path = "/") => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (path.startsWith("#")) {
    return new URL(path, SITE_URL).toString();
  }

  const url = new URL(SITE_URL);
  const normalizedPath = normalizePath(path);

  if (normalizedPath.includes("#") || normalizedPath.includes("?")) {
    const resolved = new URL(normalizedPath, SITE_URL);

    return resolved.toString();
  }

  url.pathname = normalizedPath;

  return url.toString();
};

export const PERSON_ID = absoluteUrl(`${PROFILE_PATH}#person`);
export const WEBSITE_ID = absoluteUrl("/#website");

export const openGraphImagePath = (path = "/") => {
  const normalizedPath = normalizePath(path);

  return normalizedPath === "/"
    ? "/opengraph-image.png"
    : `${normalizedPath}opengraph-image.png`;
};

interface MetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

export const buildMetadata = ({
  title,
  description,
  path,
  keywords = [],
}: MetadataOptions): Metadata => {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(openGraphImagePath(path));

  return {
    title,
    description,
    keywords: [...DEFAULT_KEYWORDS, ...keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
};

type JsonLdNode = Record<string, unknown>;

interface BreadcrumbItem {
  name: string;
  path: string;
}

export const buildJsonLdGraph = (nodes: JsonLdNode[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

export const buildBreadcrumbJsonLd = (items: BreadcrumbItem[]) => ({
  "@type": "BreadcrumbList",
  "@id": absoluteUrl(`${items[items.length - 1]?.path ?? "/"}#breadcrumb`),
  itemListElement: items.map(({ name, path }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    item: absoluteUrl(path),
  })),
});

interface WebPageNodeOptions {
  type?: string;
  name: string;
  description: string;
  path: string;
  breadcrumbId?: string;
  about?: JsonLdNode[];
  mainEntity?: JsonLdNode;
}

export const buildWebPageNode = ({
  type = "WebPage",
  name,
  description,
  path,
  breadcrumbId,
  about,
  mainEntity,
}: WebPageNodeOptions) => ({
  "@type": type,
  "@id": absoluteUrl(`${path}#webpage`),
  url: absoluteUrl(path),
  name,
  description,
  inLanguage: "en",
  isPartOf: {
    "@id": WEBSITE_ID,
  },
  breadcrumb: breadcrumbId
    ? {
        "@id": breadcrumbId,
      }
    : undefined,
  about,
  mainEntity,
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: absoluteUrl(openGraphImagePath(path)),
  },
});

export const personGraphNode = {
  "@id": PERSON_ID,
  "@type": "Person",
  name: PERSON_NAME,
  url: absoluteUrl(PROFILE_PATH),
  email: `mailto:${CONTACT_EMAIL}`,
  jobTitle:
    "Multimedia consultant, software engineer, application architect, and auditor",
  description: DEFAULT_DESCRIPTION,
  image: absoluteUrl(openGraphImagePath("/")),
  knowsAbout: [
    "Multimedia production",
    "Audio workflows",
    "Video workflows",
    "Software engineering",
    "Frontend systems",
    "Application architecture",
    "Technical audits",
    "Product audits",
  ],
};

export const websiteGraphNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: absoluteUrl("/"),
  description: DEFAULT_DESCRIPTION,
  inLanguage: "en",
  publisher: {
    "@id": PERSON_ID,
  },
};
