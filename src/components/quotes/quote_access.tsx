"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import styles from "./quote_styles.module.css";

export function QuoteAccess({ publicId }: { publicId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    setPending(true);
    setError("");
    try {
      const response = await fetch(
        `/api/quotes/${encodeURIComponent(publicId)}/unlock/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
          cache: "no-store",
        },
      );
      if (!response.ok) {
        setError(
          response.status === 429
            ? "Zbyt wiele prób. Odczekaj kilka minut i spróbuj ponownie."
            : "Nie udało się otworzyć oferty. Sprawdź hasło lub skontaktuj się z osobą, która ją przygotowała.",
        );
        setPending(false);
        return;
      }
      router.refresh();
    } catch {
      setError(
        "Nie udało się połączyć. Sprawdź połączenie i spróbuj ponownie.",
      );
      setPending(false);
    }
  }

  return (
    <main className={styles.accessPage} lang="pl">
      <div className={styles.accessBrand} aria-label="Wojciech Bajer">
        wb<span>_</span>
      </div>
      <section className={styles.accessPanel} aria-labelledby="access-title">
        <p className={styles.eyebrow}>Indywidualna oferta</p>
        <h1 id="access-title">Dobry projekt zaczyna się od rozmowy.</h1>
        <p className={styles.accessIntro}>
          Twoja oferta jest gotowa. Wpisz otrzymane hasło, aby poznać zakres
          współpracy i wycenę.
        </p>
        <form onSubmit={unlock} className={styles.accessForm}>
          <label className={styles.field}>
            <span>Hasło do oferty</span>
            <input
              type="password"
              name="password"
              required
              maxLength={256}
              autoComplete="current-password"
              autoCapitalize="none"
              spellCheck={false}
              disabled={pending}
              aria-describedby={error ? "access-error" : undefined}
            />
          </label>
          {error && (
            <p id="access-error" className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button
            className={styles.primaryButton}
            type="submit"
            disabled={pending}
          >
            {pending ? "Otwieranie oferty…" : "Otwórz ofertę"}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <p className={styles.smallText}>
          Nie masz hasła? Poproś o nie osobę, która przesłała Ci link.
        </p>
      </section>
      <p className={styles.accessFooter}>
        Oferta dostępna wyłącznie dla jej odbiorcy.
      </p>
    </main>
  );
}

export function QuoteUnavailable() {
  return (
    <main className={styles.accessPage} lang="pl">
      <div className={styles.accessBrand} aria-label="Wojciech Bajer">
        wb<span>_</span>
      </div>
      <section
        className={styles.accessPanel}
        aria-labelledby="unavailable-title"
      >
        <p className={styles.eyebrow}>Indywidualna oferta</p>
        <h1 id="unavailable-title">Ta oferta jest niedostępna.</h1>
        <p className={styles.accessIntro}>
          Sprawdź otrzymany link lub skontaktuj się z osobą, która przygotowała
          ofertę.
        </p>
      </section>
    </main>
  );
}

export function QuoteIncomplete() {
  return (
    <main className={styles.accessPage} lang="pl">
      <div className={styles.accessBrand} aria-label="Wojciech Bajer">
        wb<span>_</span>
      </div>
      <section
        className={styles.accessPanel}
        aria-labelledby="incomplete-title"
      >
        <p className={styles.eyebrow}>Podgląd szkicu</p>
        <h1 id="incomplete-title">Jeszcze kilka szczegółów.</h1>
        <p className={styles.accessIntro}>
          Uzupełnij wymagane pola, daty oraz pozycje cenowe we wszystkich
          dodanych wariantach i dodatkach. Następnie zapisz szkic w panelu, aby
          zobaczyć gotową ofertę.
        </p>
        <p className={styles.accessIntro}>
          <a className={styles.inlineLink} href="/admin/collections/quotes/">
            Wróć do wycen w panelu
          </a>
        </p>
      </section>
    </main>
  );
}
