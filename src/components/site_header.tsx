import Link from "next/link";

import styles from "./site_header.module.css";

const NAV_ITEMS = [
  { href: "/", label: "Landing" },
  { href: "/profile", label: "Profile" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/notes", label: "Notes" },
  { href: "/contact", label: "Contact" },
] as const;

interface SiteHeaderProps {
  currentPath: string;
}

export const SiteHeader = ({ currentPath }: SiteHeaderProps) => {
  const routePrompt =
    currentPath === "/"
      ? "cwb://profile"
      : currentPath === "/profile"
        ? "cwb://profile/about"
        : `cwb://profile${currentPath}`;

  return (
    <header className={styles.topbar}>
      <Link href="/" className={styles.brandLockup}>
        <span className={styles.brandPrompt}>{routePrompt}</span>
        <span className={styles.brandName}>Wojciech Bajer</span>
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={[
              styles.navLink,
              currentPath === href ? styles.navLinkActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
};
