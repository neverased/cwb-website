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
import {
  executionConsole,
  processArtifacts,
  processFlow,
} from "@/static/siteContent";

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
    <main className={styles.page}>
      <StructuredData data={processPageJsonLd} />

      <div className={styles.pageShell}>
        <SiteHeader currentPath="/process" />

        <section className={styles.lead}>
          <div className={styles.leadCopy}>
            <p className={styles.kicker}>Process</p>
            <ScrambleText
              as="h1"
              className={styles.title}
              text="The operating model, with more air around it."
              speed={0.8}
              step={3}
            />
            <p className={styles.description}>
              This is the part that was too compressed on the landing page. The
              process is simple on purpose: understand the actual signal, map
              the system, correct what matters, and leave something durable
              behind.
            </p>
          </div>

          <aside className={[styles.panel, styles.processControl].join(" ")}>
            <p className={styles.panelLabel}>execution loop</p>
            <div className={styles.loopRail}>
              {executionConsole.map((item, index) => (
                <div key={item} className={styles.loopStep}>
                  <span className={styles.loopIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className={styles.loopLabel}>{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className={styles.boardSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Operating flow</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="A connected pipeline instead of a stack of paragraphs."
              speed={0.78}
              step={3}
            />
          </div>

          <div className={styles.pipelineGrid}>
            {processFlow.map(
              ({ step, title, summary, input, operation, output, markers }) => (
                <article
                  key={step}
                  className={[styles.timelineCard, styles.pipelineCard].join(
                    " ",
                  )}
                >
                  <div className={styles.pipelineHead}>
                    <p className={styles.timelineStep}>{step}</p>
                    <div className={styles.pipelineMarkers}>
                      {markers.map((marker) => (
                        <span key={marker} className={styles.pipelineMarker}>
                          {marker}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h2 className={styles.timelineTitle}>{title}</h2>
                  <p className={styles.cardText}>{summary}</p>

                  <div className={styles.ioGrid}>
                    <div className={styles.ioCell}>
                      <span className={styles.ioLabel}>input</span>
                      <p className={styles.ioValue}>{input}</p>
                    </div>
                    <div className={styles.ioCell}>
                      <span className={styles.ioLabel}>operation</span>
                      <p className={styles.ioValue}>{operation}</p>
                    </div>
                    <div className={styles.ioCell}>
                      <span className={styles.ioLabel}>output</span>
                      <p className={styles.ioValue}>{output}</p>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        <section className={styles.artifactSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Artifacts delivered</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="The work should leave usable artifacts, not just temporary relief."
              speed={0.78}
              step={3}
            />
          </div>

          <div className={styles.artifactGrid}>
            {processArtifacts.map(({ label, detail }) => (
              <article
                key={label}
                className={[styles.signalCard, styles.artifactCard].join(" ")}
              >
                <p className={styles.panelLabel}>{label}</p>
                <p className={styles.cardText}>{detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
