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
      <div className={styles.verificationLayer} aria-hidden="true">
        <span className={styles.verificationSweep} />
        <span className={styles.verificationPulse} />
      </div>

      <div className={styles.copy}>
        <p className={styles.kicker}>{credibilitySignal.kicker}</p>
        <h2 className={styles.title} aria-label={credibilitySignal.title}>
          <span className={styles.titleAccent}>
            {credibilitySignal.titleAccent}
          </span>
          <ScrambleText
            as="span"
            className={styles.titleRest}
            text={credibilitySignal.titleSuffix}
            speed={0.75}
            step={2}
          />
        </h2>
        <p className={styles.description}>{credibilitySignal.description}</p>
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
