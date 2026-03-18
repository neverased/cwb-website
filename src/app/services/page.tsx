import { ScrambleText } from "@/components/scramble_text";
import { SiteHeader } from "@/components/site_header";
import { coreSignals, focusModules } from "@/static/siteContent";

import styles from "../subpage.module.css";

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.pageShell}>
        <SiteHeader currentPath="/services" />

        <section className={styles.lead}>
          <div className={styles.leadCopy}>
            <p className={styles.kicker}>Services</p>
            <ScrambleText
              as="h1"
              className={styles.title}
              text="Four surfaces, one operating style."
              speed={0.8}
              step={3}
            />
            <ScrambleText
              as="p"
              className={styles.description}
              text="The work shifts shape depending on what needs clarity: multimedia, software, architecture, or audits. The standard stays the same: cleaner systems, sharper decisions, and execution that does not collapse into noise."
              delay={120}
              speed={0.45}
              step={1}
            />
          </div>

          <aside className={styles.panel}>
            <p className={styles.panelLabel}>routing logic</p>
            <ScrambleText
              as="h2"
              className={styles.panelTitle}
              text="Choose the surface, keep the rigor."
              delay={180}
              speed={0.6}
              step={2}
            />
            <ScrambleText
              as="p"
              className={styles.panelText}
              text="These are not separate brands or disconnected offers. They are entry points into the same way of diagnosing, structuring, and shipping work."
              delay={240}
              speed={0.45}
              step={1}
            />
          </aside>
        </section>

        <section className={styles.cardGrid}>
          {focusModules.map(
            ({ id, label, status, summary, command, stack }, index) => (
              <article key={id} className={styles.card}>
                <div className={styles.cardHead}>
                  <p className={styles.cardLabel}>{label}</p>
                  <span className={styles.cardMeta}>{status}</span>
                </div>
                <ScrambleText
                  as="h2"
                  className={styles.cardTitle}
                  text={summary}
                  delay={320 + index * 70}
                  speed={0.55}
                  step={2}
                />
                <pre className={styles.commandPreview}>
                  <code>{command}</code>
                </pre>
                <ul className={styles.stackList}>
                  {stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ),
          )}
        </section>

        <section className={styles.cardGrid}>
          {coreSignals.map(({ id, title, description, detail }, index) => (
            <article key={id} className={styles.card}>
              <div className={styles.cardHead}>
                <p className={styles.cardLabel}>{id}</p>
                <span className={styles.cardMeta}>{title}</span>
              </div>
              <ScrambleText
                as="h2"
                className={styles.cardTitle}
                text={description}
                delay={520 + index * 70}
                speed={0.55}
                step={2}
              />
              <ScrambleText
                as="p"
                className={styles.cardText}
                text={detail}
                delay={580 + index * 70}
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
