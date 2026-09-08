"use client";

import { type FormEvent, useEffect, useState } from "react";

import { type ServiceId } from "@/lib/services";
import { services } from "@/static/siteContent";

import styles from "./contact_panel.module.css";

const CONTACT_EMAIL = "mail@wojciechbajer.com";

const CONTACT_FEEDBACK = {
  sent: {
    title: "Message sent.",
    text: "I received your inquiry and will reply directly by email.",
  },
  invalid: {
    title: "Check the form.",
    text: "Review your details and answer the new human check, then try again. Your message is still here.",
  },
  error: {
    title: "Message not sent.",
    text: "Your message is still here. Try again, or send it by direct email.",
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
  initialService?: ServiceId;
}

export const ContactPanel = ({
  className,
  initialService,
}: ContactPanelProps) => {
  const [contactStatus, setContactStatus] = useState<ContactStatus | null>(
    null,
  );
  const [bootstrapState, setBootstrapState] = useState<BootstrapState>({
    status: "loading",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retry, setRetry] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("contact");
    if (isContactStatus(status)) setContactStatus(status);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    let active = true;
    setBootstrapState({ status: "loading" });
    void fetchContactBootstrap(controller.signal)
      .then((data) => {
        if (active) setBootstrapState({ status: "ready", data });
      })
      .catch(() => {
        if (active) setBootstrapState({ status: "unavailable" });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [retry]);

  const ready = bootstrapState.status === "ready";
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopyStatus("Email address copied.");
    } catch {
      setCopyStatus("Select the email address above to copy it.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ready || isSubmitting) return;
    const form = event.currentTarget;
    const body = new FormData(form);
    setContactStatus(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });
      const payload: unknown = await response.json();
      if (
        !isContactResponse(payload) ||
        (payload.status === "sent" && !response.ok)
      ) {
        throw new Error("invalid contact response");
      }
      setContactStatus(payload.status);
      if (payload.status === "sent") form.reset();
    } catch {
      setContactStatus("error");
    } finally {
      // A nonce is single-use. Keep the message, but request a fresh challenge.
      const answer = form.elements.namedItem("challenge_answer");
      if (answer instanceof HTMLInputElement) answer.value = "";
      setBootstrapState({ status: "loading" });
      setIsSubmitting(false);
      setRetry((value) => value + 1);
    }
  };

  return (
    <div
      className={[styles.contactGrid, className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <aside className={styles.direct} aria-label="Direct email">
        <p className="eyebrow">01 / Direct email</p>
        <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        <button
          className={styles.copyButton}
          type="button"
          onClick={() => void copyEmail()}
        >
          Copy email <span aria-hidden="true">⧉</span>
        </button>
        <span className={styles.copyStatus} role="status">
          {copyStatus}
        </span>
        <div className={styles.context}>
          <p>A few lines are enough to start.</p>
          <p>
            Share the goal, the current obstacle, and any timing constraints.
            I’ll reply by email.
          </p>
        </div>
      </aside>
      <div className={styles.formPanel}>
        <p className="eyebrow">02 / Send a brief</p>
        <p className={styles.requiredHint}>
          All fields are required unless marked optional.
        </p>
        <div aria-live="polite" aria-atomic="true">
          {contactStatus && (
            <div
              className={[
                styles.statusBanner,
                contactStatus === "sent" ? styles.success : styles.error,
              ].join(" ")}
            >
              <strong>{CONTACT_FEEDBACK[contactStatus].title}</strong>
              <p>{CONTACT_FEEDBACK[contactStatus].text}</p>
            </div>
          )}
        </div>
        <noscript>
          <p className={styles.statusBanner}>
            The form needs JavaScript. You can always reach me using the direct
            email above.
          </p>
        </noscript>
        <form
          action="/api/contact/"
          method="post"
          onSubmit={handleSubmit}
          aria-label="Send a brief"
          aria-busy={isSubmitting}
        >
          {ready && (
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
          )}
          <div className={styles.formGrid}>
            <label className={styles.field}>
              Name
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                disabled={isSubmitting}
              />
            </label>
            <label className={styles.field}>
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                maxLength={160}
                disabled={isSubmitting}
              />
            </label>
            <label className={[styles.field, styles.full].join(" ")}>
              Service <span className={styles.optional}>(optional)</span>
              <select
                name="scope"
                defaultValue={initialService ?? ""}
                disabled={isSubmitting}
              >
                <option value="">Not sure yet — let’s work it out</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={[styles.field, styles.full].join(" ")}>
              What would you like help with?
              <textarea
                name="message"
                required
                minLength={20}
                maxLength={5000}
                rows={5}
                disabled={isSubmitting}
                aria-label="What would you like help with?"
                aria-describedby="message-hint"
                placeholder="The goal, what’s getting in the way, and your timing…"
              />
              <span className={styles.hint} id="message-hint">
                20–5,000 characters. Please leave out passwords and sensitive
                data.
              </span>
            </label>
            <div className={[styles.challenge, styles.full].join(" ")}>
              {ready ? (
                <label className={styles.field}>
                  Human check{" "}
                  <span className={styles.hint} id="challenge-prompt">
                    {bootstrapState.data.challenge_prompt}
                  </span>
                  <input
                    type="text"
                    name="challenge_answer"
                    autoComplete="off"
                    inputMode="numeric"
                    maxLength={12}
                    required
                    disabled={isSubmitting}
                    aria-label="Human check"
                    aria-describedby="challenge-prompt"
                  />
                </label>
              ) : (
                <div role="status" className={styles.hint}>
                  {bootstrapState.status === "loading" ? (
                    "Preparing the secure form…"
                  ) : (
                    <>
                      <p>
                        The form couldn’t connect. Your details are still here.
                      </p>
                      <button
                        className={styles.retryButton}
                        type="button"
                        onClick={() => setRetry((value) => value + 1)}
                      >
                        Try connecting again <span aria-hidden="true">↻</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className={styles.formTrap} aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
              <label>
                Company
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="organization"
                />
              </label>
              <label>
                Full name confirm
                <input
                  type="text"
                  name="full_name_confirm"
                  tabIndex={-1}
                  autoComplete="name"
                />
              </label>
            </div>
          </div>
          <div className={styles.formFooter}>
            <p className={styles.hint}>
              Your details are used to reply to this inquiry.
            </p>
            <button
              className="button"
              type="submit"
              disabled={!ready || isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Send brief"}{" "}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
