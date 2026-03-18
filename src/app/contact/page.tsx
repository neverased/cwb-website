import { CredibilityPanel } from "@/components/credibility_panel";
import { ContactPanel } from "@/components/contact_panel";
import { ScrambleText } from "@/components/scramble_text";
import { SiteHeader } from "@/components/site_header";

import styles from "../subpage.module.css";

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={styles.pageShell}>
        <SiteHeader currentPath="/contact" />

        <section className={styles.lead}>
          <div className={styles.leadCopy}>
            <p className={styles.kicker}>Contact</p>
            <ScrambleText
              as="h1"
              className={styles.title}
              text="Direct route, no middle layer."
              speed={0.8}
              step={3}
            />
            <ScrambleText
              as="p"
              className={styles.description}
              text="If the system is noisy, unclear, or underbuilt, send the brief directly. The site stays static, while the form is handled by PHP on hosting."
              delay={120}
              speed={0.45}
              step={1}
            />
          </div>

          <aside className={styles.panel}>
            <p className={styles.panelLabel}>delivery route</p>
            <ScrambleText
              as="h2"
              className={styles.panelTitle}
              text="Static frontend, local PHP handler."
              delay={180}
              speed={0.6}
              step={2}
            />
            <ScrambleText
              as="p"
              className={styles.panelText}
              text="No external form backend is required on dhosting. The landing page and this route both submit to the same contact.php."
              delay={240}
              speed={0.45}
              step={1}
            />
          </aside>
        </section>

        <CredibilityPanel />

        <ContactPanel />
      </div>
    </main>
  );
}
