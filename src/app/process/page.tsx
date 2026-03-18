import { ScrambleText } from "@/components/scramble_text";
import { SiteHeader } from "@/components/site_header";
import {
  executionConsole,
  operatingModel,
  operatingSignals,
} from "@/static/siteContent";

import styles from "../subpage.module.css";

export default function ProcessPage() {
  return (
    <main className={styles.page}>
      <div className={styles.pageShell}>
        <SiteHeader currentPath="/process" />

        <section className={styles.lead}>
          <div className={styles.leadCopy}>
            <p className={styles.kicker}>Process</p>
            <ScrambleText
              as="h1"
              className={styles.title}
              text="The operating model, with more air around it."
              speed={0.8}
              step={3}
            />
            <ScrambleText
              as="p"
              className={styles.description}
              text="This is the part that was too compressed on the landing page. The process is simple on purpose: understand the actual signal, map the system, correct what matters, and leave something durable behind."
              delay={120}
              speed={0.45}
              step={1}
            />
          </div>

          <aside className={styles.panel}>
            <p className={styles.panelLabel}>execution loop</p>
            <ul className={styles.stackList}>
              {executionConsole.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className={styles.timeline}>
          {operatingModel.map(({ step, title, text }, index) => (
            <article key={step} className={styles.timelineCard}>
              <p className={styles.timelineStep}>{step}</p>
              <ScrambleText
                as="h2"
                className={styles.timelineTitle}
                text={title}
                delay={220 + index * 70}
                speed={0.55}
                step={2}
              />
              <ScrambleText
                as="p"
                className={styles.cardText}
                text={text}
                delay={280 + index * 70}
                speed={0.45}
                step={1}
              />
            </article>
          ))}
        </section>

        <section className={styles.signalGrid}>
          {operatingSignals.map(({ label, value, detail }, index) => (
            <article key={label} className={styles.signalCard}>
              <p className={styles.panelLabel}>{label}</p>
              <ScrambleText
                as="h2"
                className={styles.signalValue}
                text={value}
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
