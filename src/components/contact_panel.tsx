"use client";

import { useEffect, useState } from "react";

import styles from "./contact_panel.module.css";

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

interface ContactPanelProps {
  className?: string;
}

export const ContactPanel = ({ className }: ContactPanelProps) => {
  const [contactStatus, setContactStatus] = useState<
    keyof typeof CONTACT_FEEDBACK | null
  >(null);

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("contact");

    if (status === "sent" || status === "invalid" || status === "error") {
      setContactStatus(status);
    }
  }, []);

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

        <form
          className={styles.terminalForm}
          action="/contact.php"
          method="post"
        >
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
            </div>
          </div>

          <div className={styles.formFooter}>
            <p className={styles.formHint}>
              I usually respond within 24 hours.
            </p>
            <button className={styles.submitButton} type="submit">
              Transmit inquiry
            </button>
          </div>
        </form>
      </div>

      <div className={styles.contactCard}>
        <p className={styles.contactLabel}>preferred channel</p>
        <a className={styles.contactValue} href="mailto:mail@wojciechbajer.com">
          mail@wojciechbajer.com
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
