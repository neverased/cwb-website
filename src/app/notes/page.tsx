import Link from "next/link";

import { ContactCallout, SiteShell } from "@/components/site_shell";
import { StructuredData } from "@/components/structured_data";
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

const NOTES_TITLE = "Topics | Wojciech Bajer";
const NOTES_DESCRIPTION =
  "Conversation starters on architecture, multimedia systems, delivery, and independent technical reviews.";

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
  { name: "Topics", path: "/notes/" },
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

export default function NotesPage() {
  return (
    <SiteShell currentPath="/notes">
      <StructuredData data={notesPageJsonLd} />
      <section className={styles.lead}>
        <p className="eyebrow">Topics / Questions worth exploring</p>
        <h1 className={styles.title}>
          A good question
          <br />
          <span>is a useful start.</span>
        </h1>
        <p className={styles.description}>
          These are recurring themes in my work. If one sounds familiar, use it
          as a starting point for a conversation.
        </p>
      </section>
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
