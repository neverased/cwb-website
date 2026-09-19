import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostContent } from "@/components/post_content";
import { ContactCallout, SiteShell } from "@/components/site_shell";
import { StructuredData } from "@/components/structured_data";
import { formatPostDate, getPublishedPost } from "@/lib/posts";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildJsonLdGraph,
  PERSON_ID,
  PERSON_NAME,
  personGraphNode,
  SITE_NAME,
  WEBSITE_ID,
  websiteGraphNode,
} from "@/lib/seo";

import styles from "./post.module.css";

export const dynamic = "force-dynamic";

type Args = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const cover = typeof post.coverImage === "object" ? post.coverImage : null;
  const images = [
    {
      url: absoluteUrl(cover?.url || "/notes/opengraph-image"),
      alt: cover?.alt || post.title,
      width: cover?.width || 1200,
      height: cover?.height || 630,
    },
  ];
  return {
    title: `${post.title} | ${PERSON_NAME}`,
    description: post.excerpt,
    authors: [{ name: PERSON_NAME, url: absoluteUrl("/profile/") }],
    alternates: { canonical: absoluteUrl(`/notes/${post.slug}/`) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/notes/${post.slug}/`),
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt,
      authors: [absoluteUrl("/profile/")],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images,
    },
  };
}

export default async function PostPage({ params }: Args) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const cover = typeof post.coverImage === "object" ? post.coverImage : null;
  const path = `/notes/${post.slug}/`;
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Notes", path: "/notes/" },
    { name: post.title, path },
  ]);
  return (
    <SiteShell currentPath="/notes">
      <StructuredData
        data={buildJsonLdGraph([
          websiteGraphNode,
          personGraphNode,
          breadcrumb,
          {
            "@type": "WebPage",
            "@id": absoluteUrl(`${path}#webpage`),
            url: absoluteUrl(path),
            name: post.title,
            description: post.excerpt,
            inLanguage: "en",
            isPartOf: { "@id": WEBSITE_ID },
            breadcrumb: { "@id": breadcrumb["@id"] },
            mainEntity: { "@id": absoluteUrl(`${path}#article`) },
          },
          {
            "@type": "BlogPosting",
            "@id": absoluteUrl(`${path}#article`),
            url: absoluteUrl(path),
            headline: post.title,
            description: post.excerpt,
            inLanguage: "en",
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: {
              "@id": PERSON_ID,
            },
            publisher: { "@id": PERSON_ID },
            mainEntityOfPage: { "@id": absoluteUrl(`${path}#webpage`) },
            ...(cover?.url ? { image: absoluteUrl(cover.url) } : {}),
          },
        ])}
      />
      <article className={styles.post}>
        <Link className="text-link" href="/notes/">
          ← All notes
        </Link>
        <header className={styles.header}>
          <p className="eyebrow">
            By{" "}
            <Link href="/profile/" rel="author">
              {PERSON_NAME}
            </Link>
          </p>
          {post.publishedAt && (
            <time className="eyebrow" dateTime={post.publishedAt}>
              {formatPostDate(post.publishedAt)}
            </time>
          )}
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </header>
        {cover?.url && (
          <img
            className={styles.cover}
            src={cover.url}
            alt={cover.alt}
            width={cover.width || undefined}
            height={cover.height || undefined}
          />
        )}
        <div className={styles.content}>
          <PostContent content={post.content} />
        </div>
      </article>
      <ContactCallout />
    </SiteShell>
  );
}
