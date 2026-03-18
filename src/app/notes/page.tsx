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
            <ScrambleText
              as="p"
              className={styles.description}
              text="This page is the normal home for writing outside the landing page. For now the notes are still curated in code, which keeps the site static, direct, and easy to deploy."
              delay={120}
              speed={0.45}
              step={1}
            />
          </div>

          <aside className={styles.panel}>
            <p className={styles.panelLabel}>publishing setup</p>
            <ScrambleText
              as="h2"
              className={styles.panelTitle}
              text="Static first, depth later."
              delay={180}
              speed={0.6}
              step={2}
            />
            <ScrambleText
              as="p"
              className={styles.panelText}
              text="Articles can stay code-driven for now and later move to MDX without changing the public structure of the site."
              delay={240}
              speed={0.45}
              step={1}
            />
          </aside>
        </section>

        <section className={styles.notesGrid}>
          {noteQueue.map(({ status, title, summary }, index) => (
            <article
              key={title}
              className={[styles.card, styles.notesCard].join(" ")}
            >
              <div className={styles.noteMeta}>
                <span>{status}</span>
                <span>signal draft</span>
              </div>
              <ScrambleText
                as="h2"
                className={styles.noteTitle}
                text={title}
                delay={320 + index * 70}
                speed={0.55}
                step={2}
              />
              <ScrambleText
                as="p"
                className={styles.noteText}
                text={summary}
                delay={380 + index * 70}
                speed={0.45}
                step={1}
              />
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
