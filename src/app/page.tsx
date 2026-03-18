"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useCallback, useState } from "react";

import { ContactPanel } from "@/components/contact_panel";
import { ScrambleText } from "@/components/scramble_text";
import { SiteHeader } from "@/components/site_header";
import { TerminalLoader } from "@/components/use_scramble";
import {
  coreSignals,
  executionConsole,
  focusModules,
  noteQueue,
  operatingModel,
  operatingSignals,
  terminalFacts,
} from "@/static/siteContent";
import { HACKING } from "@/static/staticText/start";

import styles from "./page.module.css";

export default function Home() {
  const [hasBooted, setHasBooted] = useState(false);
  const [activeFocusId, setActiveFocusId] = useState<
    (typeof focusModules)[number]["id"]
  >(focusModules[0].id);

  const enterSite = useCallback(() => {
    startTransition(() => {
      setHasBooted(true);
    });
  }, []);

  const activeFocus =
    focusModules.find(({ id }) => id === activeFocusId) ?? focusModules[0];
  const activeFacts = terminalFacts.map((fact) =>
    fact.label === "focus"
      ? { ...fact, value: `${activeFocus.label.toLowerCase()} active` }
      : fact,
  );

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
            <ScrambleText
              as="p"
              className={styles.bootDescription}
              text="A temporary terminal veil, then the actual destination: personal brand, operating model, and room for future writing."
              delay={120}
              speed={0.45}
              step={1}
            />

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
        <SiteHeader currentPath="/" />

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
            <ScrambleText
              as="p"
              className={styles.heroDescription}
              text="I work across multimedia production, software engineering, application architecture, and product or company audits. The common theme is signal quality: reducing noise, exposing weak links, and shipping systems that hold up under pressure."
              delay={320}
              speed={0.45}
              step={1}
            />

            <div className={styles.focusTabs}>
              {focusModules.map((module) => (
                <button
                  key={module.id}
                  className={[
                    styles.focusTab,
                    module.id === activeFocus.id ? styles.focusTabActive : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  type="button"
                  aria-pressed={module.id === activeFocus.id}
                  onClick={() => {
                    setActiveFocusId(module.id);
                  }}
                >
                  {module.label}
                </button>
              ))}
            </div>

            <div className={styles.focusPanel}>
              <div className={styles.focusPanelHeader}>
                <p className={styles.deckLabel}>active module</p>
                <span>{activeFocus.status}</span>
              </div>
              <ScrambleText
                as="p"
                className={styles.focusPanelTitle}
                text={activeFocus.label}
                speed={0.7}
                step={2}
              />
              <ScrambleText
                as="p"
                className={styles.focusPanelText}
                text={activeFocus.summary}
                speed={0.45}
                step={1}
              />
            </div>

            <div className={styles.heroActions}>
              <a
                className={styles.primaryAction}
                href="mailto:mail@wojciechbajer.com"
              >
                mail@wojciechbajer.com
              </a>
              <Link className={styles.secondaryAction} href="/services">
                Open service map
              </Link>
            </div>

            <div className={styles.heroFootnote}>
              <span>Based in Poland</span>
              <span>Working worldwide</span>
              <span>Available for selected collaborations</span>
              <span>{activeFocus.status}</span>
            </div>
          </div>

          <aside className={styles.commandDeck}>
            <div className={styles.deckHeader}>
              <div className={styles.deckWindowControls}>
                <span />
                <span />
                <span />
              </div>
              <span className={styles.deckStatus}>
                {activeFocus.label} active
              </span>
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

            <div className={styles.focusConsole}>
              <div className={styles.focusConsoleHeader}>
                <p className={styles.deckLabel}>mission brief</p>
                <span>{activeFocus.status}</span>
              </div>
              <ScrambleText
                as="p"
                className={styles.focusConsoleText}
                text={activeFocus.summary}
                speed={0.45}
                step={1}
              />
              <pre className={styles.commandPreview}>
                <code>{activeFocus.command}</code>
              </pre>
            </div>

            <div className={styles.deckFacts}>
              {activeFacts.map(({ label, value }) => (
                <div key={label} className={styles.factRow}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className={styles.deckBlock}>
              <p className={styles.deckLabel}>loaded tools</p>
              <ul className={styles.signalList}>
                {activeFocus.stack.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        <section className={styles.signalSection}>
          <div className={styles.signalStrip}>
            {operatingSignals.map(({ label, value, detail }, index) => (
              <article key={label} className={styles.signalCard}>
                <p className={styles.deckLabel}>{label}</p>
                <ScrambleText
                  as="h3"
                  text={value}
                  delay={360 + index * 70}
                  speed={0.6}
                  step={2}
                />
                <ScrambleText
                  as="p"
                  className={styles.signalCardText}
                  text={detail}
                  delay={420 + index * 70}
                  speed={0.45}
                  step={1}
                />
              </article>
            ))}
          </div>
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
            <div className={styles.sectionLead}>
              <ScrambleText
                as="p"
                className={styles.sectionDescription}
                text="These are distinct entry points into the same way of working: technical clarity, cleaner systems, and a stronger signal between idea, product, and execution."
                delay={500}
                speed={0.45}
                step={1}
              />
              <Link className={styles.sectionRoute} href="/services">
                Open services page
              </Link>
            </div>
          </div>

          <div className={styles.capabilityGrid}>
            {coreSignals.map(({ id, title, description, detail }, index) => (
              <article key={id} className={styles.capabilityCard}>
                <div className={styles.capabilityHeader}>
                  <span>{id}</span>
                  <p>{title}</p>
                </div>
                <ScrambleText
                  as="h3"
                  text={description}
                  delay={560 + index * 70}
                  speed={0.55}
                  step={2}
                />
                <ScrambleText
                  as="p"
                  text={detail}
                  delay={620 + index * 70}
                  speed={0.45}
                  step={1}
                />
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
            <div className={styles.sectionLead}>
              <ScrambleText
                as="p"
                className={styles.sectionDescription}
                text="The landing page now keeps only the compressed overview. The full process gets its own route, so this section can stay readable instead of trying to carry everything at once."
                delay={600}
                speed={0.45}
                step={1}
              />
              <Link className={styles.sectionRoute} href="/process">
                Open full process page
              </Link>
            </div>
          </div>

          <div className={styles.processGrid}>
            {operatingModel.map(({ step, title, text }, index) => (
              <article key={step} className={styles.processCard}>
                <span className={styles.processStep}>{step}</span>
                <ScrambleText
                  as="h3"
                  text={title}
                  delay={660 + index * 70}
                  speed={0.55}
                  step={2}
                />
                <ScrambleText
                  as="p"
                  text={text}
                  delay={720 + index * 70}
                  speed={0.45}
                  step={1}
                />
              </article>
            ))}
          </div>

          <aside className={styles.processConsole}>
            <div className={styles.focusConsoleHeader}>
              <p className={styles.deckLabel}>execution loop</p>
              <span>landing summary</span>
            </div>
            <ul className={styles.signalList}>
              {executionConsole.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
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
            <div className={styles.sectionLead}>
              <ScrambleText
                as="p"
                className={styles.sectionDescription}
                text="No CMS needed for now. The structure is static and code-driven, which keeps deploys simple and works cleanly with export-based hosting."
                delay={700}
                speed={0.45}
                step={1}
              />
              <Link className={styles.sectionRoute} href="/notes">
                Open notes page
              </Link>
            </div>
          </div>

          <div className={styles.noteGrid}>
            {noteQueue.map(({ status, title, summary }, index) => (
              <article key={title} className={styles.noteCard}>
                <div className={styles.noteMeta}>
                  <span>{status}</span>
                  <span>signal draft</span>
                </div>
                <ScrambleText
                  as="h3"
                  text={title}
                  delay={760 + index * 70}
                  speed={0.55}
                  step={2}
                />
                <ScrambleText
                  as="p"
                  text={summary}
                  delay={820 + index * 70}
                  speed={0.45}
                  step={1}
                />
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
            <div className={styles.sectionLead}>
              <ScrambleText
                as="p"
                className={styles.sectionDescription}
                text="The landing page keeps the direct route visible, but the contact form also has its own page for a cleaner handoff from the main navigation."
                delay={800}
                speed={0.45}
                step={1}
              />
              <Link className={styles.sectionRoute} href="/contact">
                Open contact page
              </Link>
            </div>
          </div>

          <ContactPanel />
        </section>
      </div>
    </main>
  );
}
