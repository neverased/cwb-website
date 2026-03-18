"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useCallback, useLayoutEffect, useState } from "react";

import styles from "@/app/page.module.css";
import { ContactPanel } from "@/components/contact_panel";
import { CredibilityPanel } from "@/components/credibility_panel";
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
  selectedCollaborations,
  terminalFacts,
} from "@/static/siteContent";
import { HACKING } from "@/static/staticText/start";

const BOOT_SESSION_KEY = "cwb.boot.completed";

let hasBootedInMemory = false;

const readPersistedBootState = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(BOOT_SESSION_KEY) === "1";
  } catch {
    return false;
  }
};

const persistBootState = () => {
  hasBootedInMemory = true;

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(BOOT_SESSION_KEY, "1");
  } catch {
    // Ignore storage failures and keep the in-memory session flag.
  }
};

export const HomePage = () => {
  const [hasBooted, setHasBooted] = useState(hasBootedInMemory);
  const [activeFocusId, setActiveFocusId] = useState<
    (typeof focusModules)[number]["id"]
  >(focusModules[0].id);

  useLayoutEffect(() => {
    if (!readPersistedBootState()) {
      return;
    }

    hasBootedInMemory = true;
    setHasBooted(true);
  }, []);

  const enterSite = useCallback(() => {
    persistBootState();

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
        <SiteHeader currentPath="/" />

        <section className={styles.hero} id="top">
          <div className={styles.heroBackdrop} aria-hidden="true">
            <span className={styles.heroSweep} />
            <span className={styles.heroSweepSecondary} />
            <span className={styles.heroRing} />
            <span className={styles.heroRail} />
          </div>

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
              <p className={styles.focusPanelTitle}>{activeFocus.label}</p>
              <p className={styles.focusPanelText}>{activeFocus.summary}</p>
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
              <p className={styles.focusConsoleText}>{activeFocus.summary}</p>
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
            {operatingSignals.map(({ label, value, detail }) => (
              <article key={label} className={styles.signalCard}>
                <p className={styles.deckLabel}>{label}</p>
                <h3>{value}</h3>
                <p className={styles.signalCardText}>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.credibilitySection}>
          <CredibilityPanel />
        </section>

        <section className={styles.section} id="collaborations">
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>Selected collaborations</p>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="Work delivered for recognized teams and larger systems."
              delay={400}
            />
            <p className={styles.sectionDescription}>
              A few organizations I have worked with across multimedia,
              engineering, and delivery contexts. The section keeps the same
              terminal frame, but now uses the actual partner marks.
            </p>
          </div>

          <div className={styles.collaborationGrid}>
            {selectedCollaborations.map(
              ({ name, tag, src, width, height, surface }) => (
                <article key={name} className={styles.collaborationCard}>
                  <p className={styles.deckLabel}>{tag}</p>
                  <div
                    className={[
                      styles.collaborationSurface,
                      surface === "light"
                        ? styles.collaborationSurfaceLight
                        : "",
                      surface === "dark" ? styles.collaborationSurfaceDark : "",
                      surface === "yellow"
                        ? styles.collaborationSurfaceYellow
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <Image
                      className={styles.collaborationLogo}
                      src={src}
                      alt={`${name} logo`}
                      width={width}
                      height={height}
                      sizes="(max-width: 720px) calc(100vw - 5rem), (max-width: 1100px) calc(50vw - 3rem), 26rem"
                    />
                  </div>
                  <p className={styles.collaborationName}>{name}</p>
                </article>
              ),
            )}
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
              <p className={styles.sectionDescription}>
                These are distinct entry points into the same way of working:
                technical clarity, cleaner systems, and a stronger signal
                between idea, product, and execution.
              </p>
              <Link className={styles.sectionRoute} href="/services">
                Open services page
              </Link>
            </div>
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
            <div className={styles.sectionLead}>
              <p className={styles.sectionDescription}>
                The landing page now keeps only the compressed overview. The
                full process gets its own route, so this section can stay
                readable instead of trying to carry everything at once.
              </p>
              <Link className={styles.sectionRoute} href="/process">
                Open full process page
              </Link>
            </div>
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
              <p className={styles.sectionDescription}>
                The structure is static and code-driven, which keeps deploys
                simple and works cleanly with export-based hosting.
              </p>
              <Link className={styles.sectionRoute} href="/notes">
                Open notes page
              </Link>
            </div>
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
            <div className={styles.sectionLead}>
              <p className={styles.sectionDescription}>
                Contact me short and sweet, or longer and more detailed.
              </p>
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
};
