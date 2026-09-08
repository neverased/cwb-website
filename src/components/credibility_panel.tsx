import { credibilitySignal } from "@/static/siteContent";

import styles from "./credibility_panel.module.css";

export const CredibilityPanel = ({
  className = "",
}: {
  className?: string;
}) => (
  <aside
    className={`${styles.panel} ${className}`}
    aria-label="Company credibility"
  >
    <div>
      <p className={styles.title}>Rzetelna Firma member</p>
      <p className={styles.description}>
        Company information and credibility certificate.
      </p>
    </div>
    <a
      className="text-link"
      href={credibilitySignal.href}
      target="_blank"
      rel="noreferrer"
    >
      View certificate <span aria-hidden="true">↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  </aside>
);
