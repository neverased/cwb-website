import { ScrambleText } from "@/components/scramble_text";
import { credibilitySignal } from "@/static/siteContent";

import styles from "./credibility_panel.module.css";

interface CredibilityPanelProps {
  className?: string;
}

export const CredibilityPanel = ({ className }: CredibilityPanelProps) => {
  return (
    <section
      className={[styles.panel, className ?? ""].filter(Boolean).join(" ")}
      aria-label={credibilitySignal.kicker}
    >
      <div className={styles.copy}>
        <p className={styles.kicker}>{credibilitySignal.kicker}</p>
        <ScrambleText
          as="h2"
          className={styles.title}
          text={credibilitySignal.title}
          speed={0.75}
          step={2}
        />
        <ScrambleText
          as="p"
          className={styles.description}
          text={credibilitySignal.description}
          delay={120}
          speed={0.45}
          step={1}
        />
      </div>

      <div className={styles.actions}>
        <a
          className={styles.button}
          href={credibilitySignal.href}
          target="_blank"
          rel="noreferrer"
        >
          {credibilitySignal.actionLabel}
        </a>
        <a
          className={styles.link}
          href={credibilitySignal.href}
          target="_blank"
          rel="noreferrer"
        >
          {credibilitySignal.displayUrl}
        </a>
      </div>
    </section>
  );
};
