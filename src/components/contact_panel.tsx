"use client";

import { useEffect, useState } from "react";

import styles from "./contact_panel.module.css";

const CONTACT_EMAIL = "mail@wojciechbajer.com";

const CONTACT_FEEDBACK = {
  sent: {
    title: "Transmission received.",
    text: "Your message was delivered. I will reply directly by email.",
  },
  invalid: {
    title: "Transmission rejected.",
    text: "Please check the required fields and try again.",
  },
  error: {
    title: "Delivery failed.",
    text: "The message could not be sent right now. Please use direct email.",
  },
} as const;

interface ContactBootstrap {
  challenge_first: number;
  challenge_prompt: string;
  challenge_second: number;
  issued_at: number;
  nonce: string;
  token: string;
}

type BootstrapState =
  | { status: "loading" }
  | { status: "ready"; data: ContactBootstrap }
  | { status: "unavailable" };

const isContactBootstrap = (value: unknown): value is ContactBootstrap => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.nonce === "string" &&
    typeof candidate.issued_at === "number" &&
    typeof candidate.token === "string" &&
    typeof candidate.challenge_prompt === "string" &&
    typeof candidate.challenge_first === "number" &&
    typeof candidate.challenge_second === "number"
  );
};

interface ContactPanelProps {
  className?: string;
}

export const ContactPanel = ({ className }: ContactPanelProps) => {
  const [contactStatus, setContactStatus] = useState<
    keyof typeof CONTACT_FEEDBACK | null
  >(null);
  const [bootstrapState, setBootstrapState] = useState<BootstrapState>({
    status: "loading",
  });

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("contact");

    if (status === "sent" || status === "invalid" || status === "error") {
      setContactStatus(status);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const loadBootstrap = async () => {
      try {
        const response = await fetch("/contact_bootstrap.php", {
          cache: "no-store",
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("bootstrap request failed");
        }

        const payload: unknown = await response.json();

        if (!isContactBootstrap(payload)) {
          throw new Error("invalid bootstrap payload");
        }

        setBootstrapState({
          status: "ready",
          data: payload,
        });
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setBootstrapState({
          status: "unavailable",
        });
      }
    };

    void loadBootstrap();

    return () => {
      abortController.abort();
    };
  }, []);

  const isBootstrapReady = bootstrapState.status === "ready";
  const secureStatus =
    bootstrapState.status === "loading"
      ? {
          title: "Secure challenge loading.",
          text: "The anti-spam check is loading. If it does not appear, use direct email instead.",
        }
      : bootstrapState.status === "unavailable"
        ? {
            title: "Secure channel unavailable.",
            text: "The protected form is unavailable right now. Use direct email instead.",
          }
        : null;

  return (
    <div
      className={[styles.contactGrid, className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={[styles.contactCard, styles.contactFormCard].join(" ")}>
        <p className={styles.contactLabel}>terminal form</p>

        {contactStatus ? (
          <div
            className={[
              styles.statusBanner,
              contactStatus === "sent"
                ? styles.statusSuccess
                : styles.statusError,
            ].join(" ")}
          >
            <strong>{CONTACT_FEEDBACK[contactStatus].title}</strong>
            <p>{CONTACT_FEEDBACK[contactStatus].text}</p>
          </div>
        ) : null}

        {secureStatus ? (
          <div className={[styles.statusBanner, styles.statusInfo].join(" ")}>
            <strong>{secureStatus.title}</strong>
            <p>
              {secureStatus.text}{" "}
              <a className={styles.inlineLink} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        ) : null}

        <form
          className={styles.terminalForm}
          action="/contact.php"
          method="post"
        >
          {isBootstrapReady ? (
            <>
              <input
                type="hidden"
                name="contact_nonce"
                value={bootstrapState.data.nonce}
              />
              <input
                type="hidden"
                name="contact_issued_at"
                value={bootstrapState.data.issued_at}
              />
              <input
                type="hidden"
                name="contact_token"
                value={bootstrapState.data.token}
              />
              <input
                type="hidden"
                name="challenge_first"
                value={bootstrapState.data.challenge_first}
              />
              <input
                type="hidden"
                name="challenge_second"
                value={bootstrapState.data.challenge_second}
              />
            </>
          ) : null}

          <div className={styles.formGrid}>
            <label className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>name</span>
              <input
                className={styles.terminalInput}
                type="text"
                name="name"
                autoComplete="name"
                required
                maxLength={120}
              />
            </label>

            <label className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>email</span>
              <input
                className={styles.terminalInput}
                type="email"
                name="email"
                autoComplete="email"
                required
                maxLength={160}
              />
            </label>

            <label className={[styles.fieldGroup, styles.fieldSpan].join(" ")}>
              <span className={styles.fieldLabel}>scope</span>
              <input
                className={styles.terminalInput}
                type="text"
                name="scope"
                autoComplete="organization-title"
                maxLength={160}
                placeholder="audit / architecture / multimedia / build"
              />
            </label>

            <label className={[styles.fieldGroup, styles.fieldSpan].join(" ")}>
              <span className={styles.fieldLabel}>message</span>
              <textarea
                className={[styles.terminalInput, styles.terminalTextarea].join(
                  " ",
                )}
                name="message"
                required
                minLength={20}
                maxLength={5000}
                placeholder="What is noisy, blocked, underbuilt, or worth reviewing?"
              />
            </label>

            <label className={[styles.fieldGroup, styles.fieldSpan].join(" ")}>
              <span className={styles.fieldLabel}>human check</span>
              {isBootstrapReady ? (
                <p className={styles.challengePrompt}>
                  {bootstrapState.data.challenge_prompt}
                </p>
              ) : (
                <p className={styles.challengePrompt}>
                  Waiting for secure challenge.
                </p>
              )}
              <input
                className={styles.terminalInput}
                type="text"
                name="challenge_answer"
                autoComplete="off"
                inputMode="numeric"
                maxLength={12}
                required={isBootstrapReady}
                disabled={!isBootstrapReady}
                placeholder="Enter the answer"
              />
            </label>

            <div className={styles.formTrap} aria-hidden="true">
              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>website</span>
                <input
                  className={styles.terminalInput}
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>company</span>
                <input
                  className={styles.terminalInput}
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="organization"
                />
              </label>
              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>full name confirm</span>
                <input
                  className={styles.terminalInput}
                  type="text"
                  name="full_name_confirm"
                  tabIndex={-1}
                  autoComplete="name"
                />
              </label>
            </div>
          </div>

          <div className={styles.formFooter}>
            <p className={styles.formHint}>
              I usually respond within 24 hours.
            </p>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={!isBootstrapReady}
            >
              Transmit inquiry
            </button>
          </div>
        </form>
      </div>

      <div className={styles.contactCard}>
        <p className={styles.contactLabel}>preferred channel</p>
        <a className={styles.contactValue} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        <p className={styles.contactText}>
          Best for consulting requests, architecture reviews, audits, and
          media-heavy digital product work.
        </p>

        <p className={styles.contactLabel}>engagement fit</p>
        <p className={styles.contactValue}>
          strategy, execution, independent review
        </p>
        <p className={styles.contactText}>
          Short diagnostic work, longer architecture engagements, and selected
          builds where the technical direction matters.
        </p>

        <p className={styles.contactLabel}>delivery route</p>
        <p className={styles.contactText}>
          Let's talk about your project and how I can help.
        </p>
      </div>
    </div>
  );
};
