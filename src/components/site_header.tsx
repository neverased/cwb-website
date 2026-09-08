import Link from "next/link";

import { MobileNav } from "./mobile_nav";
import styles from "./site_header.module.css";

const NAV_ITEMS = [
  { href: "/services/", label: "Services" },
  { href: "/#work", label: "Collaborations" },
  { href: "/profile/", label: "About" },
  { href: "/process/", label: "Process" },
  { href: "/notes/", label: "Notes" },
] as const;

export const SiteHeader = ({ currentPath }: { currentPath: string }) => {
  const links = NAV_ITEMS.map(({ href, label }) => (
    <Link
      key={href}
      href={href}
      className={styles.navLink}
      aria-current={
        currentPath.replace(/\/$/, "") === href.replace(/\/$/, "")
          ? "page"
          : undefined
      }
    >
      {label}
    </Link>
  ));
  return (
    <header className={styles.topbar}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <Link
        href="/"
        className={styles.brandLockup}
        aria-label="Wojciech Bajer — home"
      >
        <span className={styles.brandMark} aria-hidden="true">
          wb<span>_</span>
        </span>
        <span className={styles.brandName}>
          Wojciech Bajer<span>Independent consultant</span>
        </span>
      </Link>
      <nav className={styles.desktopNav} aria-label="Primary">
        {links}
      </nav>
      <Link
        href="/contact/"
        className={styles.contactLink}
        aria-current={currentPath === "/contact" ? "page" : undefined}
      >
        Let’s talk <span aria-hidden="true">↗</span>
      </Link>
      <MobileNav key={currentPath}>{links}</MobileNav>
    </header>
  );
};
