"use client";

import { type FormEvent, useEffect, useState } from "react";

import styles from "./contact_panel.module.css";

const CONTACT_EMAIL = "mail@wojciechbajer.com";

const CONTACT_FEEDBACK = {
  sent: {
    title: "Message sent.",
    text: "I received your inquiry and will reply directly by email.",
  },
  invalid: {
    title: "Check the form.",
    text: "Please complete the required fields and try again.",
  },
  error: {
    title: "Message not sent.",
    text: "The form is not available right now. Please use direct email.",
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

type ContactStatus = keyof typeof CONTACT_FEEDBACK;

interface ContactResponse {
  status: ContactStatus;
}

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

const isContactStatus = (value: string | null): value is ContactStatus => {
  return value === "sent" || value === "invalid" || value === "error";
};

const isContactResponse = (value: unknown): value is ContactResponse => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.status === "string" && isContactStatus(candidate.status)
  );
};

const fetchContactBootstrap = async (
  signal?: AbortSignal,
): Promise<ContactBootstrap> => {
  const response = await fetch("/api/contact/bootstrap/", {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("bootstrap request failed");
  }

  const payload: unknown = await response.json();

  if (!isContactBootstrap(payload)) {
    throw new Error("invalid bootstrap payload");
  }

  return payload;
};

interface ContactPanelProps {
  className?: string;
}

export const ContactPanel = ({ className }: ContactPanelProps) => {
  const [contactStatus, setContactStatus] = useState<ContactStatus | null>(
    null,
  );
  const [bootstrapState, setBootstrapState] = useState<BootstrapState>({
    status: "loading",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("contact");

    if (isContactStatus(status)) {
      setContactStatus(status);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const loadBootstrap = async () => {
      try {
        const payload = await fetchContactBootstrap(abortController.signal);
        setBootstrapState({
          status: "ready",
          data: payload,
        });
      } catch {
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
  const isFormDisabled = !isBootstrapReady || isSubmitting;
  const secureStatus =
    bootstrapState.status === "unavailable"
      ? {
          title: "Secure channel unavailable.",
          text: "The protected form is unavailable right now. Direct email is ready.",
        }
      : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!isBootstrapReady || isSubmitting) {
      return;
    }

    event.preventDefault();

    const form = event.currentTarget;
    setContactStatus(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      const payload: unknown = await response.json();

      if (!isContactResponse(payload)) {
        throw new Error("invalid contact response");
      }

      setContactStatus(payload.status);

      if (payload.status === "sent") {
        form.reset();
      }
    } catch {
      setContactStatus("error");
    } finally {
      setBootstrapState({
        status: "loading",
      });

      try {
        const payload = await fetchContactBootstrap();
        setBootstrapState({
          status: "ready",
          data: payload,
        });
      } catch {
        setBootstrapState({
          status: "unavailable",
        });
      }

      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={[styles.contactGrid, className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={[styles.contactCard, styles.contactDirectCard].join(" ")}>
        <p className={styles.contactLabel}>direct route</p>
        <a className={styles.contactValue} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        <p className={styles.contactText}>
          Best for consulting requests, architecture reviews, audits, and
          media-heavy digital product work.
        </p>

        <div className={styles.contactSignalGrid}>
          <div>
            <p className={styles.contactLabel}>engagement fit</p>
            <p className={styles.contactText}>
              strategy, execution, independent review
            </p>
          </div>
          <div>
            <p className={styles.contactLabel}>first note</p>
            <p className={styles.contactText}>
              What is blocked, risky, underbuilt, or worth reviewing?
            </p>
          </div>
        </div>
      </div>

      <div className={[styles.contactCard, styles.contactFormCard].join(" ")}>
        <p className={styles.contactLabel}>protected form</p>

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
          action="/api/contact/"
          method="post"
          onSubmit={handleSubmit}
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
                disabled={isFormDisabled}
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
                disabled={isFormDisabled}
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
                disabled={isFormDisabled}
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
                disabled={isFormDisabled}
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
                  Form channel is preparing. Direct email is ready now.
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
                disabled={isFormDisabled}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>

          <div className={styles.formFooter}>
            <p className={styles.formHint}>
              Form route is optional. Direct email is fastest.
            </p>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isFormDisabled}
            >
              {isSubmitting
                ? "Sending..."
                : bootstrapState.status === "loading"
                  ? "Preparing form"
                  : "Send inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
