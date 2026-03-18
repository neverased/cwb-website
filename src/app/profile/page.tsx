import Image from "next/image";
import Link from "next/link";

import { CredibilityPanel } from "@/components/credibility_panel";
import { ScrambleText } from "@/components/scramble_text";
import { SiteHeader } from "@/components/site_header";
import { StructuredData } from "@/components/structured_data";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildJsonLdGraph,
  buildMetadata,
  buildWebPageNode,
  CONTACT_EMAIL,
  PERSON_ID,
  personGraphNode,
  PROFILE_PATH,
  websiteGraphNode,
} from "@/lib/seo";
import {
  coreSignals,
  operatingSignals,
  selectedCollaborations,
  terminalFacts,
} from "@/static/siteContent";

import styles from "../subpage.module.css";

const PROFILE_TITLE = "Profile | Wojciech Bajer";
const PROFILE_DESCRIPTION =
  "Profile of Wojciech Bajer, covering multimedia systems, software engineering, application architecture, audits, selected collaborations, and direct consulting routes.";

export const metadata = buildMetadata({
  title: PROFILE_TITLE,
  description: PROFILE_DESCRIPTION,
  path: PROFILE_PATH,
  keywords: [
    "Wojciech Bajer profile",
    "about Wojciech Bajer",
    "technical consultant",
    "software and multimedia consultant",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Profile", path: PROFILE_PATH },
]);

const profilePageJsonLd = buildJsonLdGraph([
  websiteGraphNode,
  personGraphNode,
  breadcrumbJsonLd,
  buildWebPageNode({
    type: "ProfilePage",
    name: PROFILE_TITLE,
    description: PROFILE_DESCRIPTION,
    path: PROFILE_PATH,
    breadcrumbId: absoluteUrl(`${PROFILE_PATH}#breadcrumb`),
    about: [
      {
        "@id": PERSON_ID,
      },
    ],
    mainEntity: {
      "@id": PERSON_ID,
    },
  }),
]);

export default function ProfilePage() {
  return (
    <main className={styles.page}>
      <StructuredData data={profilePageJsonLd} />

      <div className={styles.pageShell}>
        <SiteHeader currentPath="/profile" />

        <section className={styles.lead}>
          <div className={styles.leadCopy}>
            <p className={styles.kicker}>Profile</p>
            <ScrambleText
              as="h1"
              className={styles.title}
              text="A technical operator across media, product, and system design."
              speed={0.8}
              step={3}
            />
            <p className={styles.description}>
              This is the cleaner profile route behind the landing page:
              expertise, collaboration signals, and the way I usually enter
              projects that need clearer structure, sharper execution, or an
              outside technical read.
            </p>
          </div>

          <aside className={[styles.panel, styles.matrixBoard].join(" ")}>
            <p className={styles.panelLabel}>profile digest</p>
            <div className={styles.matrixStack}>
              {terminalFacts.map(({ label, value }) => (
                <div key={label} className={styles.matrixRow}>
                  <span className={styles.matrixDot} />
                  <p className={styles.matrixValue}>
                    <strong>{label}</strong>
                    {" // "}
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className={styles.boardSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Core surfaces</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="A profile built around four connected workstreams."
              speed={0.78}
              step={3}
            />
            <p className={styles.description}>
              The disciplines differ, but the operating logic stays the same:
              expose weak links, improve signal quality, and leave systems in a
              more durable state than they started.
            </p>
          </div>

          <div className={styles.signalGrid}>
            {coreSignals.map(({ id, title, description, detail }) => (
              <article
                key={id}
                className={[styles.signalCard, styles.profileSignalCard].join(
                  " ",
                )}
              >
                <p className={styles.panelLabel}>{title}</p>
                <h2 className={styles.signalValue}>{description}</h2>
                <p className={styles.cardText}>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.boardSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Selected collaborations</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="Recognized brands, shipped work, and real delivery pressure."
              speed={0.78}
              step={3}
            />
          </div>

          <div className={styles.logoGrid}>
            {selectedCollaborations.map(
              ({ name, src, width, height, surface, tag }) => (
                <article
                  key={name}
                  className={[styles.card, styles.logoCard].join(" ")}
                >
                  <p className={styles.cardLabel}>{tag}</p>
                  <div
                    className={[
                      styles.logoSurface,
                      surface === "light" ? styles.logoSurfaceLight : "",
                      surface === "dark" ? styles.logoSurfaceDark : "",
                      surface === "yellow" ? styles.logoSurfaceYellow : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <Image
                      className={styles.logoImage}
                      src={src}
                      alt={`${name} logo`}
                      width={width}
                      height={height}
                      sizes="(max-width: 760px) calc(100vw - 4rem), (max-width: 1080px) calc(50vw - 3rem), 21rem"
                    />
                  </div>
                  <p className={styles.logoName}>{name}</p>
                </article>
              ),
            )}
          </div>
        </section>

        <section className={styles.boardSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Working model</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="The themes behind the work, not just the labels on the services."
              speed={0.78}
              step={3}
            />
          </div>

          <div className={styles.signalGrid}>
            {operatingSignals.map(({ label, value, detail }) => (
              <article key={label} className={styles.signalCard}>
                <p className={styles.panelLabel}>{label}</p>
                <h2 className={styles.signalValue}>{value}</h2>
                <p className={styles.cardText}>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.splitGrid}>
          <CredibilityPanel />

          <aside className={styles.panel}>
            <p className={styles.panelLabel}>Direct routes</p>
            <h2 className={styles.panelTitle}>
              Consulting, delivery, and independent review.
            </h2>
            <p className={styles.panelText}>
              Best fit for teams that need architecture clarity, technical
              direction, sharper delivery, or a direct outside read on product
              and process.
            </p>

            <div className={styles.inlineLinks}>
              <a className={styles.routeLink} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              <Link className={styles.routeLink} href="/services">
                Services
              </Link>
              <Link className={styles.routeLink} href="/contact">
                Contact
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
