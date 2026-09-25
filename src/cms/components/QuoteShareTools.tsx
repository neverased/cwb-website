"use client";

import { Button, useFormFields } from "@payloadcms/ui";
import { useEffect, useId, useRef, useState } from "react";

import styles from "./QuoteShareTools.module.css";

/** Sharing tools deliberately read only the public identifier, never credentials. */
export function QuoteShareTools() {
  const publicId = useFormFields(([fields]) => fields.publicId?.value);
  const [origin, setOrigin] = useState("");
  const [copyState, setCopyState] = useState<
    "idle" | "copying" | "copied" | "error"
  >("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const componentId = useId();
  const inputId = `${componentId}-link`;
  const helpId = `${componentId}-help`;
  const headingId = `${componentId}-heading`;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const hasId = typeof publicId === "string" && publicId.length > 0;
  const clientUrl =
    hasId && origin ? `${origin}/quotes/${encodeURIComponent(publicId)}/` : "";

  async function copyLink() {
    if (!clientUrl) return;
    setCopyState("copying");
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard is unavailable");
      await navigator.clipboard.writeText(clientUrl);
      setCopyState("copied");
    } catch {
      // The selectable input also works on HTTP and when browser permissions
      // prevent clipboard access. Do not attempt a silent legacy copy command.
      inputRef.current?.focus();
      inputRef.current?.select();
      setCopyState("error");
    }
  }

  return (
    <section className={styles.panel} aria-labelledby={headingId}>
      <h3 className={styles.heading} id={headingId}>
        Udostępnianie oferty
      </h3>
      {!hasId ? (
        <p className={styles.help}>Zapisz szkic, aby utworzyć link.</p>
      ) : (
        <>
          <label className={styles.label} htmlFor={inputId}>
            Link dla klienta
          </label>
          <input
            ref={inputRef}
            className={styles.input}
            id={inputId}
            type="url"
            value={clientUrl}
            readOnly
            spellCheck={false}
            aria-describedby={helpId}
            placeholder="Przygotowywanie linku…"
            onFocus={(event) => event.currentTarget.select()}
          />
          <p className={styles.help} id={helpId}>
            Skopiuj ten link dla klienta, a hasło przekaż osobno. Dostęp wymaga
            opublikowania oferty i włączenia udostępniania.
          </p>
          <div className={styles.actions}>
            <Button
              type="button"
              buttonStyle="primary"
              size="small"
              margin={false}
              disabled={!clientUrl || copyState === "copying"}
              onClick={() => {
                void copyLink();
              }}
            >
              {copyState === "copying" ? "Kopiowanie…" : "Kopiuj link"}
            </Button>
            {clientUrl && (
              <>
                <Button
                  el="anchor"
                  url={clientUrl}
                  newTab
                  buttonStyle="secondary"
                  size="small"
                  margin={false}
                  aria-label="Otwórz ofertę klienta w nowej karcie"
                >
                  Otwórz ofertę klienta
                </Button>
                <Button
                  el="anchor"
                  url={`${clientUrl}?preview=1`}
                  newTab
                  buttonStyle="secondary"
                  size="small"
                  margin={false}
                  aria-label="Otwórz podgląd roboczy w nowej karcie"
                >
                  Podgląd roboczy
                </Button>
              </>
            )}
          </div>
          <p
            className={`${styles.status} ${copyState === "error" ? styles.error : ""}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {copyState === "copied" && "Link skopiowany do schowka."}
            {copyState === "error" &&
              "Nie udało się skopiować linku automatycznie. Link w polu powyżej jest zaznaczony. Skopiuj go ręcznie skrótem Ctrl+C lub ⌘C."}
          </p>
        </>
      )}
      <p className={styles.reminder}>
        Zapisz szkic przed otwarciem podglądu. Podgląd roboczy pokazuje ostatnio
        zapisane zmiany i wymaga zalogowania do panelu. Opublikuj ofertę, aby
        zmiany były widoczne dla klienta.
      </p>
    </section>
  );
}
