import { ScrambleText } from "@/components/scramble_text";
import { SiteHeader } from "@/components/site_header";
import { noteQueue } from "@/static/siteContent";

import styles from "../subpage.module.css";

export default function NotesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.pageShell}>
        <SiteHeader currentPath="/notes" />

        <section className={styles.lead}>
          <div className={styles.leadCopy}>
            <p className={styles.kicker}>Notes</p>
            <ScrambleText
              as="h1"
              className={styles.title}
              text="Essays, breakdowns, and field observations."
              speed={0.8}
              step={3}
            />
            <p className={styles.description}>
              This page is the normal home for writing outside the landing page.
              For now the notes are still curated in code, which keeps the site
              static, direct, and easy to deploy.
            </p>
          </div>

          <aside className={styles.panel}>
            <p className={styles.panelLabel}>publishing setup</p>
            <h2 className={styles.panelTitle}>Static first, depth later.</h2>
            <p className={styles.panelText}>
              Articles can stay code-driven for now and later move to MDX
              without changing the public structure of the site.
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
                <span>signal draft</span>
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
