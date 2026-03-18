import { ContactPanel } from "@/components/contact_panel";
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
  PERSON_ID,
  personGraphNode,
  websiteGraphNode,
} from "@/lib/seo";

import styles from "../subpage.module.css";

const CONTACT_TITLE = "Contact | Wojciech Bajer";
const CONTACT_DESCRIPTION =
  "Direct contact page for consulting, multimedia systems work, software delivery, architecture reviews, and independent audits.";

export const metadata = buildMetadata({
  title: CONTACT_TITLE,
  description: CONTACT_DESCRIPTION,
  path: "/contact/",
  keywords: [
    "contact Wojciech Bajer",
    "consulting inquiry",
    "architecture review contact",
    "technical audit contact",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact/" },
]);

const contactPageJsonLd = buildJsonLdGraph([
  websiteGraphNode,
  personGraphNode,
  breadcrumbJsonLd,
  buildWebPageNode({
    type: "ContactPage",
    name: CONTACT_TITLE,
    description: CONTACT_DESCRIPTION,
    path: "/contact/",
    breadcrumbId: absoluteUrl("/contact/#breadcrumb"),
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

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <StructuredData data={contactPageJsonLd} />

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
            <p className={styles.description}>
              If the system is noisy, unclear, or underbuilt, send the brief
              directly. The site stays static, while the form is handled by PHP
              on hosting.
            </p>
          </div>

          <aside className={styles.panel}>
            <p className={styles.panelLabel}>delivery route</p>
            <h2 className={styles.panelTitle}>
              Static frontend, local PHP handler.
            </h2>
            <p className={styles.panelText}>
              No external form backend is required on dhosting. The landing page
              and this route both submit to the same contact.php.
            </p>
          </aside>
        </section>

        <CredibilityPanel />

        <ContactPanel />
      </div>
    </main>
  );
}
