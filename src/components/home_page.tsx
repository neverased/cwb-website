"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import styles from "@/app/page.module.css";
import { ContactPanel } from "@/components/contact_panel";
import { CredibilityPanel } from "@/components/credibility_panel";
import { ScrambleText } from "@/components/scramble_text";
import { SiteHeader } from "@/components/site_header";
import { TerminalLoader } from "@/components/use_scramble";
import {
  clientOutcomes,
  collaborationProofPoints,
  coreSignals,
  executionConsole,
  focusModules,
  operatingModel,
  selectedCollaborations,
  workingTerminalLines,
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
    // Keep the in-memory session flag if storage is unavailable.
  }
};

export const HomePage = () => {
  const [hasBooted, setHasBooted] = useState(hasBootedInMemory);
  const [activeFocusId, setActiveFocusId] = useState<
    (typeof focusModules)[number]["id"]
  >(focusModules[0].id);

  const completeBoot = useCallback(() => {
    persistBootState();
    setHasBooted(true);
  }, []);

  useEffect(() => {
    if (!readPersistedBootState()) {
      return;
    }

    hasBootedInMemory = true;
    setHasBooted(true);
  }, []);

  useEffect(() => {
    if (hasBooted) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      completeBoot();
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      completeBoot();
    }, 4800);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, [completeBoot, hasBooted]);

  const activeFocus =
    focusModules.find(({ id }) => id === activeFocusId) ?? focusModules[0];
  const deckTerminalLines = [
    activeFocus.command,
    ...workingTerminalLines.slice(1, 4),
  ];

  return (
    <main className={styles.page}>
      {!hasBooted ? (
        <div className={styles.bootLayer} aria-hidden="true">
          <TerminalLoader
            texts={HACKING}
            loop={false}
            onComplete={completeBoot}
          />
        </div>
      ) : null}

      <div className={styles.siteShell}>
        <SiteHeader currentPath="/" />

        <section className={styles.hero} id="top">
          <div className={styles.heroCopy}>
            <Image
              className={styles.heroLogo}
              src="/wbc_logo_alpha_kolor_neg.png"
              alt="Consulting Wojciech Bajer logo"
              width={3667}
              height={700}
              style={{ height: "auto" }}
              priority
            />
            <ScrambleText
              as="h1"
              className={styles.heroTitle}
              text="Clear decisions. Cleaner delivery."
              delay={240}
              speed={0.9}
              step={3}
            />
            <p className={styles.heroDescription}>
              For founders, product leads, and hiring teams facing unclear
              technical decisions: I turn messy media, software, architecture,
              and audit work into usable plans, artifacts, and hands-on
              delivery.
            </p>

            <div className={styles.heroActions}>
              <a
                className={styles.primaryAction}
                href="mailto:mail@wojciechbajer.com"
              >
                Send project brief
              </a>
              <Link className={styles.secondaryAction} href="/services">
                Review services
              </Link>
            </div>

            <div className={styles.heroProof} aria-label="Credibility signals">
              <span>RZETELNA Firma member</span>
              <span>Selected work across media, product, and systems</span>
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

            <div
              className={styles.focusTabs}
              aria-label="Common client situations"
            >
              <p className={styles.focusTabsLabel}>Common client situations</p>
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

            <div className={styles.routeCard}>
              <div className={styles.routeCardHeader}>
                <p className={styles.deckLabel}>what this fixes</p>
                <span>{activeFocus.status}</span>
              </div>
              <h2 className={styles.routeCardTitle}>{activeFocus.label}</h2>
              <p className={styles.routeCardText}>{activeFocus.summary}</p>
              <ul className={styles.routeOutputList}>
                {activeFocus.stack.slice(0, 2).map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </div>

            <div className={styles.terminalViewport}>
              <div className={styles.terminalViewportHeader}>
                <p className={styles.deckLabel}>diagnostic output</p>
                <span>sample read</span>
              </div>
              <div aria-label="Working diagnostic terminal output">
                {deckTerminalLines.map((line) => (
                  <p
                    key={line}
                    className={
                      line.startsWith("$")
                        ? styles.terminalCommand
                        : styles.terminalOutput
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className={styles.signalSection}>
          <h2 className={styles.srOnly}>Client outcomes</h2>
          <div className={styles.signalStrip}>
            {clientOutcomes.map(({ label, value, detail }) => (
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
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="Work seen under real delivery pressure."
              delay={400}
            />
            <p className={styles.sectionDescription}>
              Selected organizations from multimedia, engineering, and delivery
              contexts where timing, quality, and technical judgment all had to
              hold together.
            </p>
          </div>

          <div className={styles.proofStrip}>
            {collaborationProofPoints.map(({ label, text }) => (
              <article key={label} className={styles.proofPoint}>
                <p className={styles.deckLabel}>{label}</p>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <div className={styles.collaborationGrid}>
            {selectedCollaborations.map(
              ({ name, src, width, height, surface }) => (
                <article key={name} className={styles.collaborationCard}>
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
                </article>
              ),
            )}
          </div>
        </section>

        <section className={styles.section} id="capabilities">
          <div className={styles.sectionHeading}>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="Four ways to remove technical uncertainty."
              delay={420}
            />
            <div className={styles.sectionLead}>
              <p className={styles.sectionDescription}>
                Each service starts with the same discipline: inspect the
                current reality, name the constraint, and leave a next move the
                team can use.
              </p>
              <Link className={styles.sectionRoute} href="/services">
                Review services
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
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="Evidence first, then decisions teams can use."
              delay={520}
            />
            <div className={styles.sectionLead}>
              <p className={styles.sectionDescription}>
                The output is a cleaner picture of risk, a decision route, and
                artifacts the team can keep using.
              </p>
              <Link className={styles.sectionRoute} href="/process">
                See process
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
            <div className={styles.processConsoleHeader}>
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

        <section
          className={[styles.section, styles.contactSection].join(" ")}
          id="contact"
        >
          <div className={styles.sectionHeading}>
            <ScrambleText
              as="h2"
              className={styles.sectionTitle}
              text="Send the useful context directly."
              delay={720}
            />
            <div className={styles.sectionLead}>
              <p className={styles.sectionDescription}>
                A short note is enough when the situation is urgent, messy, or
                hard to frame. Start with what is blocked and what has to
                change.
              </p>
              <Link className={styles.sectionRoute} href="/contact">
                Start contact
              </Link>
            </div>
          </div>

          <ContactPanel />
        </section>
      </div>
    </main>
  );
};
