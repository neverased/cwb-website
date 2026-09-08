import { ContactPanel } from "@/components/contact_panel";
import { CredibilityPanel } from "@/components/credibility_panel";
import { SiteShell } from "@/components/site_shell";
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
import { findService } from "@/lib/services";

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

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const query = await searchParams;
  const service = findService(
    typeof query.service === "string" ? query.service : undefined,
  );
  return (
    <SiteShell currentPath="/contact">
      <StructuredData data={contactPageJsonLd} />
      <section className={styles.contactLead}>
        <p className="eyebrow">Contact / Start a conversation</p>
        <h1 className={styles.title}>
          What are you
          <br className={styles.mobileBreak} /> <span>working on?</span>
        </h1>
        <p className={styles.description}>
          Tell me what is blocked, what needs to change, or what you want to
          build.
        </p>
      </section>
      <ContactPanel
        key={service?.id ?? "general"}
        initialService={service?.id}
      />
      <div className={styles.contactCredibility}>
        <CredibilityPanel />
      </div>
    </SiteShell>
  );
}
