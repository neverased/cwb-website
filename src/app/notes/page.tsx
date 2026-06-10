import { ScrambleText } from "@/components/scramble_text";
import { SiteHeader } from "@/components/site_header";
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
import { noteQueue } from "@/static/siteContent";

import styles from "../subpage.module.css";

const NOTES_TITLE = "Notes | Wojciech Bajer";
const NOTES_DESCRIPTION =
  "Diagnostic topics and field observations on architecture, multimedia systems, delivery, and audit work.";

export const metadata = buildMetadata({
  title: NOTES_TITLE,
  description: NOTES_DESCRIPTION,
  path: "/notes/",
  keywords: [
    "technical notes",
    "architecture essays",
    "audit observations",
    "software and multimedia writing",
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
      "@type": "CreativeWork",
      name: title,
      description: summary,
      author: {
        "@id": PERSON_ID,
      },
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
    <main className={styles.page}>
      <StructuredData data={notesPageJsonLd} />

      <div className={styles.pageShell}>
        <SiteHeader currentPath="/notes" />

        <section className={styles.lead}>
          <div className={styles.leadCopy}>
            <p className={styles.kicker}>Notes</p>
            <ScrambleText
              as="h1"
              className={styles.title}
              text="Diagnostic topics and field observations."
              speed={0.8}
              step={3}
            />
            <p className={styles.description}>
              These are the themes I use to explain recurring architecture,
              delivery, multimedia, and audit problems. They double as useful
              entry points when a brief is still forming.
            </p>
          </div>

          <aside className={styles.panel}>
            <p className={styles.panelLabel}>topic map</p>
            <h2 className={styles.panelTitle}>Start with the problem area.</h2>
            <p className={styles.panelText}>
              If one of these areas matches what you are seeing, it is usually
              enough context to begin a focused review.
            </p>
          </aside>
        </section>

        <section className={styles.notesGrid}>
          {noteQueue.map(({ status, title, summary }) => (
            <article
              key={title}
              className={[styles.card, styles.notesCard].join(" ")}
            >
              <div className={styles.noteMeta}>
                <span>{status}</span>
                <span>review area</span>
              </div>
              <h2 className={styles.noteTitle}>{title}</h2>
              <p className={styles.noteText}>{summary}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
