import { ScrambleText } from "@/components/scramble_text";
import { SiteHeader } from "@/components/site_header";
import {
  serviceBoards,
  serviceRouting,
  serviceSignals,
} from "@/static/siteContent";

import styles from "../subpage.module.css";

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.pageShell}>
        <SiteHeader currentPath="/services" />

        <section className={styles.lead}>
          <div className={styles.leadCopy}>
            <p className={styles.kicker}>Services</p>
            <ScrambleText
              as="h1"
              className={styles.title}
              text="Four surfaces, one operating style."
              speed={0.8}
              step={3}
            />
            <p className={styles.description}>
              The work shifts shape depending on what needs clarity: multimedia,
              software, architecture, or audits. The standard stays the same:
              cleaner systems, sharper decisions, and execution that does not
              collapse into noise.
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
              text="Less brochure, more routing board."
              speed={0.78}
              step={3}
            />
            <p className={styles.description}>
              Each surface is framed as a workstream: what enters, what happens
              in the middle, and what leaves the system when the engagement is
              done.
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
                      <span className={styles.matrixDot} />
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
