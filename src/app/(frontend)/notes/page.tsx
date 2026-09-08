import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactCallout, SiteShell } from "@/components/site_shell";
import { StructuredData } from "@/components/structured_data";
import { formatPostDate, getPublishedPosts } from "@/lib/posts";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildJsonLdGraph,
  buildMetadata,
  buildWebPageNode,
  PERSON_ID,
  personGraphNode,
  websiteGraphNode,
} from "@/lib/seo";
import { contactHref } from "@/lib/services";
import { noteQueue } from "@/static/siteContent";

import styles from "../subpage.module.css";

export const dynamic = "force-dynamic";

const NOTES_TITLE = "Notes | Wojciech Bajer";
const NOTES_DESCRIPTION =
  "Notes on architecture, multimedia systems, software delivery, and independent technical reviews.";

export const metadata = buildMetadata({
  title: NOTES_TITLE,
  description: NOTES_DESCRIPTION,
  path: "/notes/",
  keywords: [
    "technical notes",
    "architecture consulting",
    "audit observations",
    "software and multimedia consulting",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Notes", path: "/notes/" },
]);

const notesListJsonLd = {
  "@type": "ItemList",
  "@id": absoluteUrl("/notes/#queue"),
  itemListElement: noteQueue.map(({ title, summary }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Thing",
      name: title,
      description: summary,
    },
  })),
};

const notesPageJsonLd = buildJsonLdGraph([
  websiteGraphNode,
  personGraphNode,
  breadcrumbJsonLd,
  notesListJsonLd,
  buildWebPageNode({
    type: "CollectionPage",
    name: NOTES_TITLE,
    description: NOTES_DESCRIPTION,
    path: "/notes/",
    breadcrumbId: absoluteUrl("/notes/#breadcrumb"),
    about: [
      {
        "@id": PERSON_ID,
      },
    ],
    mainEntity: {
      "@id": absoluteUrl("/notes/#queue"),
    },
  }),
]);

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page: rawPage } = await searchParams;
  const page = rawPage === undefined ? 1 : Number(rawPage);
  if (Array.isArray(rawPage) || !Number.isSafeInteger(page) || page < 1)
    notFound();
  const posts = await getPublishedPosts(page);
  if (page > 1 && page > posts.totalPages) notFound();

  return (
    <SiteShell currentPath="/notes">
      <StructuredData data={notesPageJsonLd} />
      <section className={styles.lead}>
        <p className="eyebrow">Notes / From the work</p>
        <h1 className={styles.title}>
          Ideas, observations
          <br />
          <span>and useful questions.</span>
        </h1>
        <p className={styles.description}>
          Writing on architecture, multimedia, and the decisions behind better
          software.
        </p>
      </section>
      <section aria-label="Published notes" className={styles.topicList}>
        {posts.docs.length ? (
          posts.docs.map((post, index) => (
            <article key={post.id}>
              <span className={styles.stepNumber}>
                {String((page - 1) * 12 + index + 1).padStart(2, "0")}
              </span>
              <div>
                {post.publishedAt && (
                  <time dateTime={post.publishedAt} className="eyebrow">
                    {formatPostDate(post.publishedAt)}
                  </time>
                )}
                <h2>
                  <Link href={`/notes/${post.slug}/`}>{post.title}</Link>
                </h2>
                <p>{post.excerpt}</p>
                <Link className="text-link" href={`/notes/${post.slug}/`}>
                  Read note <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p>
            No notes published yet. Below are some questions worth exploring.
          </p>
        )}
        {posts.totalPages > 1 && (
          <nav className={styles.jumpLinks} aria-label="Notes pagination">
            {posts.hasPrevPage && (
              <Link href={page === 2 ? "/notes/" : `/notes/?page=${page - 1}`}>
                ← Newer notes
              </Link>
            )}
            <span>
              Page {page} of {posts.totalPages}
            </span>
            {posts.hasNextPage && (
              <Link href={`/notes/?page=${page + 1}`}>Older notes →</Link>
            )}
          </nav>
        )}
      </section>
      <p className="eyebrow">Questions worth exploring</p>
      <div className={styles.topicList}>
        {noteQueue.map(({ title, summary, service }, index) => (
          <article key={title}>
            <span className={styles.stepNumber}>0{index + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>{summary}</p>
              <Link className="text-link" href={contactHref(service)}>
                Discuss this topic <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
      <ContactCallout />
    </SiteShell>
  );
}
