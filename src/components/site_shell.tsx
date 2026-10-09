import Link from "next/link";
import type { ReactNode } from "react";

import { CONTACT_EMAIL } from "@/lib/seo";

import { SiteHeader } from "./site_header";
import { MotionReveal, SiteMotion } from "./site_motion";
import styles from "./site_shell.module.css";

export const SiteShell = ({
  currentPath,
  children,
}: {
  currentPath: string;
  children: ReactNode;
}) => (
  <SiteMotion className={styles.shell}>
    <SiteHeader currentPath={currentPath} />
    <main id="main-content" tabIndex={-1}>
      {children}
    </main>
    <footer className={styles.footer}>
      <div>
        <Link href="/" className={styles.signature}>
          Wojciech Bajer<span aria-hidden="true">_</span>
        </Link>
        <p>Independent thinking. Hands-on delivery.</p>
      </div>
      <nav aria-label="Footer">
        <Link href="/services/">Services</Link>
        <Link href="/notes/">Notes</Link>
        <a href={`mailto:${CONTACT_EMAIL}`}>Email</a>
      </nav>
      <span className={styles.location}>
        Based in Poland · Working worldwide
      </span>
    </footer>
  </SiteMotion>
);

export const ContactCallout = () => (
  <section className={styles.callout} aria-labelledby="callout-title">
    <MotionReveal>
      <p className="eyebrow">The next step is a conversation</p>
      <h2 id="callout-title">Start with your context.</h2>
      <p>Share the goal, the obstacle, and what needs to move forward.</p>
    </MotionReveal>
    <div className={styles.calloutActions}>
      <a href={`mailto:${CONTACT_EMAIL}`} className={styles.calloutEmail}>
        {CONTACT_EMAIL}
      </a>
      <Link href="/contact/" className="text-link">
        Or send a brief <span aria-hidden="true">↗</span>
      </Link>
    </div>
  </section>
);
