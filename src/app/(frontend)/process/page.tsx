import { ContactCallout, SiteShell } from "@/components/site_shell";
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
import { processArtifacts, processFlow } from "@/static/siteContent";

import styles from "../subpage.module.css";

const PROCESS_TITLE = "Process | Wojciech Bajer";
const PROCESS_DESCRIPTION =
  "Operating model for audits, architecture, software delivery, and multimedia systems work by Wojciech Bajer.";

export const metadata = buildMetadata({
  title: PROCESS_TITLE,
  description: PROCESS_DESCRIPTION,
  path: "/process/",
  keywords: [
    "technical process",
    "operating model",
    "architecture review process",
    "audit workflow",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Process", path: "/process/" },
]);

const processListJsonLd = {
  "@type": "ItemList",
  "@id": absoluteUrl("/process/#steps"),
  itemListElement: processFlow.map(({ step, title, summary }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Thing",
      name: `${step} ${title}`,
      description: summary,
    },
  })),
};

const processPageJsonLd = buildJsonLdGraph([
  websiteGraphNode,
  personGraphNode,
  breadcrumbJsonLd,
  processListJsonLd,
  buildWebPageNode({
    name: PROCESS_TITLE,
    description: PROCESS_DESCRIPTION,
    path: "/process/",
    breadcrumbId: absoluteUrl("/process/#breadcrumb"),
    about: [
      {
        "@id": PERSON_ID,
      },
    ],
    mainEntity: {
      "@id": absoluteUrl("/process/#steps"),
    },
  }),
]);

export default function ProcessPage() {
  return (
    <SiteShell currentPath="/process">
      <StructuredData data={processPageJsonLd} />
      <section className={styles.lead}>
        <p className="eyebrow">Process / From context to action</p>
        <h1 className={styles.title}>
          A clear path.
          <br />
          <span>Useful at every step.</span>
        </h1>
        <p className={styles.description}>
          Understand the situation, make the important decisions, and leave your
          team with work it can use. Here is how we get there.
        </p>
      </section>
      <ol className={styles.pipeline}>
        {processFlow.map(({ step, title, summary, input, output }) => (
          <li key={step}>
            <span className={styles.stepNumber}>{step}</span>
            <div>
              <h2>{title}</h2>
              <p>{summary}</p>
              <dl>
                <div>
                  <dt>We start with</dt>
                  <dd>{input}</dd>
                </div>
                <div>
                  <dt>You leave with</dt>
                  <dd>{output}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ol>
      <section className={styles.artifacts}>
        <p className="eyebrow">The handoff</p>
        <h2 className="section-title">The work stays useful.</h2>
        <div className={styles.artifactGrid}>
          {processArtifacts.map(({ label, detail }) => (
            <article key={label}>
              <h3>{label}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>
      <ContactCallout />
    </SiteShell>
  );
}
