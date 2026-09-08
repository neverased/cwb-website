import Link from "next/link";
import type { ReactNode } from "react";

import { CONTACT_EMAIL } from "@/lib/seo";

import { SiteHeader } from "./site_header";
import styles from "./site_shell.module.css";

export const SiteShell = ({
  currentPath,
  children,
}: {
  currentPath: string;
  children: ReactNode;
}) => (
  <div className={styles.shell}>
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
        <Link href="/notes/">Topics</Link>
        <a href={`mailto:${CONTACT_EMAIL}`}>Email</a>
      </nav>
      <span className={styles.location}>
        Based in Poland · Working worldwide
      </span>
    </footer>
  </div>
);

export const ContactCallout = () => (
  <section className={styles.callout} aria-labelledby="callout-title">
    <div>
      <p className="eyebrow">Your next move</p>
      <h2 id="callout-title">
        Let’s make the next
        <br />
        decision a clear one.
      </h2>
      <p>A short brief is a good place to start.</p>
    </div>
    <Link href="/contact/" className="button">
      Start a conversation <span aria-hidden="true">↗</span>
    </Link>
  </section>
);
