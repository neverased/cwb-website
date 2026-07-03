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
  serviceBoards,
  serviceRouting,
  serviceSignals,
} from "@/static/siteContent";

import styles from "../subpage.module.css";

const SERVICES_TITLE = "Services | Wojciech Bajer";
const SERVICES_DESCRIPTION =
  "Service map for multimedia systems, software engineering, application architecture, independent audits, fractional technical leadership, and AI or LLM engineering by Wojciech Bajer.";

export const metadata = buildMetadata({
  title: SERVICES_TITLE,
  description: SERVICES_DESCRIPTION,
  path: "/services/",
  keywords: [
    "multimedia services",
    "software engineering consulting",
    "application architecture consulting",
    "technical audit services",
    "fractional technical leadership",
    "fractional CTO services",
    "AI engineering services",
    "LLM integration consulting",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services/" },
]);

const servicesListJsonLd = {
  "@type": "ItemList",
  "@id": absoluteUrl("/services/#list"),
  itemListElement: serviceBoards.map(({ label, headline }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: label,
      description: headline,
      provider: {
        "@id": PERSON_ID,
      },
    },
  })),
};

const servicesPageJsonLd = buildJsonLdGraph([
  websiteGraphNode,
  personGraphNode,
  breadcrumbJsonLd,
  servicesListJsonLd,
  buildWebPageNode({
    type: "CollectionPage",
    name: SERVICES_TITLE,
    description: SERVICES_DESCRIPTION,
    path: "/services/",
    breadcrumbId: absoluteUrl("/services/#breadcrumb"),
    about: [
      {
        "@id": PERSON_ID,
      },
    ],
    mainEntity: {
      "@id": absoluteUrl("/services/#list"),
    },
  }),
]);

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <StructuredData data={servicesPageJsonLd} />

      <div className={styles.pageShell}>
        <SiteHeader currentPath="/services" />

        <section className={styles.lead}>
          <div className={styles.leadCopy}>
            <p className={styles.kicker}>Services</p>
            <ScrambleText
              as="h1"
              className={styles.title}
              text="Choose the workstream that matches the problem."
              speed={0.8}
              step={3}
            />
            <p className={styles.description}>
              The entry point can be media delivery, a software build,
              architecture direction, an independent audit, ongoing technical
              leadership, or an AI feature that has to become dependable. The
              result should be the same: a clearer situation, visible
              constraints, and work your team can keep using.
            </p>
          </div>

          <aside className={[styles.panel, styles.routeBoard].join(" ")}>
            <div className={styles.routeGrid}>
              <div className={styles.routeLane}>
                <p className={styles.panelLabel}>incoming</p>
                <div className={styles.routeStack}>
                  {serviceRouting.incoming.map((item) => (
                    <span key={item} className={styles.routeNode}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.routeCore}>
                <p className={styles.routeCoreLabel}>service surfaces</p>
                <div className={styles.routeSurfaceList}>
                  {serviceRouting.surfaces.map((item) => (
                    <span key={item} className={styles.routeSurface}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.routeLane}>
                <p className={styles.panelLabel}>outgoing</p>
                <div className={styles.routeStack}>
                  {serviceRouting.outgoing.map((item) => (
                    <span key={item} className={styles.routeNode}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className={styles.boardSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Service map</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="What comes in, what changes, and what leaves."
              speed={0.78}
              step={3}
            />
            <p className={styles.description}>
              Each service is framed as a workstream so the business value is
              visible before the technical details: the trigger, the operation,
              and the usable output.
            </p>
          </div>

          <div className={styles.surfaceGrid}>
            {serviceBoards.map(
              ({
                id,
                label,
                status,
                headline,
                intro,
                stages,
                deliverables,
                fit,
                command,
              }) => (
                <article
                  key={id}
                  className={[styles.card, styles.surfaceCard].join(" ")}
                >
                  <div className={styles.cardHead}>
                    <p className={styles.cardLabel}>{label}</p>
                    <span className={styles.cardMeta}>{status}</span>
                  </div>

                  <h2 className={styles.surfaceTitle}>{headline}</h2>
                  <p className={styles.cardText}>{intro}</p>

                  <div className={styles.surfaceDiagram}>
                    {stages.map(({ label: stageLabel, value }) => (
                      <div key={stageLabel} className={styles.surfaceStage}>
                        <span className={styles.surfaceStageLabel}>
                          {stageLabel}
                        </span>
                        <p className={styles.surfaceStageValue}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <pre className={styles.commandPreview}>
                    <code>{command}</code>
                  </pre>

                  <div className={styles.chipRow}>
                    {deliverables.map((item) => (
                      <span key={item} className={styles.chip}>
                        {item}
                      </span>
                    ))}
                  </div>

                  <p className={styles.surfaceFit}>{fit}</p>
                </article>
              ),
            )}
          </div>
        </section>

        <section className={styles.matrixSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Signal exchange</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="Where the engagement usually starts, and what should remain after it."
              speed={0.78}
              step={3}
            />
          </div>

          <div className={styles.matrixGrid}>
            {serviceSignals.map(({ label, items }) => (
              <article
                key={label}
                className={[styles.panel, styles.matrixBoard].join(" ")}
              >
                <p className={styles.panelLabel}>{label}</p>
                <div className={styles.matrixStack}>
                  {items.map((item) => (
                    <div key={item} className={styles.matrixRow}>
                      <p className={styles.matrixValue}>{item}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
