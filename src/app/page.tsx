"use client";

import Image from "next/image";
import { startTransition, useCallback, useState } from "react";

import { ScrambleText } from "@/components/scramble_text";
import { TerminalLoader } from "@/components/use_scramble";
import {
  coreSignals,
  noteQueue,
  operatingModel,
  signalStack,
  terminalFacts,
} from "@/static/siteContent";
import { HACKING } from "@/static/staticText/start";

import styles from "./page.module.css";

export default function Home() {
  const [hasBooted, setHasBooted] = useState(false);

  const enterSite = useCallback(() => {
    startTransition(() => {
      setHasBooted(true);
    });
  }, []);

  return (
    <main className={styles.page}>
      <div
        className={[styles.bootLayer, hasBooted ? styles.bootLayerHidden : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={styles.bootShell}>
          <div className={styles.bootCopy}>
            <p className={styles.kicker}>Boot sequence</p>
            <ScrambleText
              as="h1"
              className={styles.bootTitle}
              text="Initializing a sharper public interface."
              speed={0.8}
              step={3}
            />
            <p className={styles.bootDescription}>
              A temporary terminal veil, then the actual destination: personal
              brand, operating model, and room for future writing.
            </p>

            <div className={styles.bootMeta}>
              <span>Operator: Wojciech Bajer</span>
              <span>Output: multimedia + engineering + audits</span>
            </div>

            <button
              className={styles.skipButton}
              type="button"
              onClick={enterSite}
            >
              Skip boot
            </button>
          </div>

          <TerminalLoader texts={HACKING} loop={false} onComplete={enterSite} />
        </div>
      </div>

      <div
        className={[styles.siteShell, hasBooted ? styles.siteShellVisible : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <header className={styles.topbar}>
          <a href="#top" className={styles.brandLockup}>
            <span className={styles.brandPrompt}>cwb://profile</span>
            <span className={styles.brandName}>Wojciech Bajer</span>
          </a>

          <nav className={styles.nav}>
            <a href="#capabilities">Capabilities</a>
            <a href="#process">Process</a>
            <a href="#notes">Notes</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className={styles.hero} id="top">
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Terminal-grade personal brand</p>
            <ScrambleText
              as="h1"
              className={styles.heroTitle}
              text="I build media-heavy products, software systems, and clearer technical decisions."
              delay={240}
              speed={0.9}
              step={3}
            />
            <p className={styles.heroDescription}>
              I work across multimedia production, software engineering,
              application architecture, and product or company audits. The
              common theme is signal quality: reducing noise, exposing weak
              links, and shipping systems that hold up under pressure.
            </p>

            <div className={styles.heroActions}>
              <a
                className={styles.primaryAction}
                href="mailto:mail@wojciechbajer.com"
              >
                mail@wojciechbajer.com
              </a>
              <a className={styles.secondaryAction} href="#notes">
                Open note queue
              </a>
            </div>

            <div className={styles.heroFootnote}>
              <span>Based in Poland</span>
              <span>Working worldwide</span>
              <span>Available for selected collaborations</span>
            </div>
          </div>

          <aside className={styles.commandDeck}>
            <div className={styles.deckHeader}>
              <div className={styles.deckWindowControls}>
                <span />
                <span />
                <span />
              </div>
              <span className={styles.deckStatus}>live operator console</span>
            </div>

            <div className={styles.logoModule}>
              <Image
                className={styles.logo}
                src="/wbc_logo_alpha_kolor_neg.png"
                alt="Consulting Wojciech Bajer logo"
                width={3667}
                height={700}
                priority
              />
            </div>

            <div className={styles.deckFacts}>
              {terminalFacts.map(({ label, value }) => (
                <div key={label} className={styles.factRow}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className={styles.deckBlock}>
              <p className={styles.deckLabel}>active stack</p>
              <ul className={styles.signalList}>
                {signalStack.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        <section className={styles.section} id="capabilities">
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>Capabilities</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="Built for more than a digital business card."
              delay={420}
            />
            <p className={styles.sectionDescription}>
              The site positions you as an operator who can move between
              creative production, engineering, architecture, and independent
              assessment without flattening everything into generic agency
              language.
            </p>
          </div>

          <div className={styles.capabilityGrid}>
            {coreSignals.map(({ id, title, description, detail }) => (
              <article key={id} className={styles.capabilityCard}>
                <div className={styles.capabilityHeader}>
                  <span>{id}</span>
                  <p>{title}</p>
                </div>
                <h3>{description}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="process">
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>Operating model</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="A practical process for audits, architecture, and delivery."
              delay={520}
            />
          </div>

          <div className={styles.processGrid}>
            {operatingModel.map(({ step, title, text }) => (
              <article key={step} className={styles.processCard}>
                <span className={styles.processStep}>{step}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="notes">
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>Field notes</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="Room for essays, breakdowns, and post-audit observations."
              delay={620}
            />
            <p className={styles.sectionDescription}>
              No CMS needed for now. The structure is static and code-driven,
              which keeps deploys simple and works cleanly with export-based
              hosting.
            </p>
          </div>

          <div className={styles.noteGrid}>
            {noteQueue.map(({ status, title, summary }) => (
              <article key={title} className={styles.noteCard}>
                <div className={styles.noteMeta}>
                  <span>{status}</span>
                  <span>signal draft</span>
                </div>
                <h3>{title}</h3>
                <p>{summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className={[styles.section, styles.contactSection].join(" ")}
          id="contact"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>Contact</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="If the system is noisy, unclear, or underbuilt, I can help."
              delay={720}
            />
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <p className={styles.contactLabel}>preferred channel</p>
              <a
                className={styles.contactValue}
                href="mailto:mail@wojciechbajer.com"
              >
                mail@wojciechbajer.com
              </a>
              <p className={styles.contactText}>
                Best for consulting requests, architecture reviews, audits, and
                media-heavy digital product work.
              </p>
            </div>

            <div className={styles.contactCard}>
              <p className={styles.contactLabel}>engagement fit</p>
              <p className={styles.contactValue}>
                strategy, execution, independent review
              </p>
              <p className={styles.contactText}>
                Short diagnostic work, longer architecture engagements, and
                selected builds where the technical direction matters.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
