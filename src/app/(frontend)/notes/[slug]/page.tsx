import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostContent } from "@/components/post_content";
import { ContactCallout, SiteShell } from "@/components/site_shell";
import { StructuredData } from "@/components/structured_data";
import { formatPostDate, getPublishedPost } from "@/lib/posts";
import { absoluteUrl, PERSON_NAME } from "@/lib/seo";

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
      url: absoluteUrl(cover?.url || "/opengraph-image"),
      alt: cover?.alt || post.title,
    },
  ];
  return {
    title: `${post.title} | ${PERSON_NAME}`,
    description: post.excerpt,
    alternates: { canonical: absoluteUrl(`/notes/${post.slug}/`) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/notes/${post.slug}/`),
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt,
      authors: [PERSON_NAME],
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
  return (
    <SiteShell currentPath="/notes">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: {
            "@type": "Person",
            name: PERSON_NAME,
            url: absoluteUrl("/profile/"),
          },
          mainEntityOfPage: absoluteUrl(`/notes/${post.slug}/`),
          ...(cover?.url ? { image: absoluteUrl(cover.url) } : {}),
        }}
      />
      <article className={styles.post}>
        <Link className="text-link" href="/notes/">
          ← All notes
        </Link>
        <header className={styles.header}>
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
