"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { calculateQuote, defaultSelection } from "@/lib/quotes/calculations";
import { formatQuoteMoney } from "@/lib/quotes/presentation";
import type { PublicQuote, QuoteSelection } from "@/lib/quotes/types";

import { quoteCopy } from "./quote_copy";
import styles from "./quote_styles.module.css";

export function QuoteOffer({ quote }: { quote: PublicQuote }) {
  const router = useRouter();
  const accepted = quote.acceptance;
  const content = accepted?.snapshot ?? quote;
  const copy = quoteCopy[content.language];
  const locale = content.language === "pl" ? "pl-PL" : "en-GB";
  const [selection, setSelection] = useState<QuoteSelection>(
    () => accepted?.selection ?? defaultSelection(content),
  );
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [locking, setLocking] = useState(false);
  const [lockError, setLockError] = useState("");
  const [expired, setExpired] = useState(
    () => Date.parse(content.validUntil) <= Date.now(),
  );
  const currentSelection = accepted?.selection ?? selection;
  const totals = accepted?.totals ?? calculateQuote(content, currentSelection);
  const selectedPackage = content.packages.find(
    (item) => item.id === currentSelection.packageId,
  )!;
  const money = (amount: number) =>
    formatQuoteMoney(amount, content.currency, content.language);
  const date = (value: string, includeTime = false) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      ...(includeTime ? { timeStyle: "short" as const } : {}),
      timeZone: "Europe/Warsaw",
    }).format(new Date(value));
  const quantities = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 3,
  });
  const percentages = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  });
  const selectionsLocked = Boolean(accepted) || pending || saved;
  const pdfQuery = new URLSearchParams({
    packageId: currentSelection.packageId,
  });
  for (const id of currentSelection.addonIds) pdfQuery.append("addonId", id);
  if (quote.preview) pdfQuery.set("preview", "1");
  const pdfUrl = `/api/quotes/${encodeURIComponent(quote.publicId)}/pdf/?${pdfQuery.toString()}`;
  const canAccept =
    quote.allowAcceptance && !quote.preview && !expired && !accepted;

  useEffect(() => {
    const refreshExpiry = () =>
      setExpired(Date.parse(content.validUntil) <= Date.now());
    const interval = window.setInterval(refreshExpiry, 15_000);
    return () => window.clearInterval(interval);
  }, [content.validUntil]);

  function selectPackage(packageId: string) {
    setSelection((previous) => ({ ...previous, packageId }));
    setConsent(false);
    setError("");
  }

  function toggleAddon(id: string, checked: boolean) {
    setSelection((previous) => ({
      ...previous,
      addonIds: checked
        ? [...previous.addonIds, id]
        : previous.addonIds.filter((item) => item !== id),
    }));
    setConsent(false);
    setError("");
  }

  async function accept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canAccept || !consent || pending || saved) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    setNeedsRefresh(false);
    try {
      const response = await fetch(
        `/api/quotes/${encodeURIComponent(quote.publicId)}/accept/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: quote.revision,
            packageId: selection.packageId,
            addonIds: selection.addonIds,
            name: String(form.get("name") ?? "").trim(),
            email: String(form.get("email") ?? "").trim(),
            consent: true,
          }),
          cache: "no-store",
        },
      );
      if (!response.ok) {
        const sessionExpired =
          response.status === 401 || response.status === 403;
        setError(
          response.status === 409
            ? copy.stale
            : sessionExpired
              ? copy.sessionError
              : copy.genericError,
        );
        setNeedsRefresh(response.status === 409 || sessionExpired);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError(copy.networkError);
    } finally {
      setPending(false);
    }
  }

  async function lock() {
    setLocking(true);
    setLockError("");
    try {
      const response = await fetch(
        `/api/quotes/${encodeURIComponent(quote.publicId)}/lock/`,
        { method: "POST", cache: "no-store" },
      );
      if (!response.ok) {
        setLockError(copy.lockError);
        setLocking(false);
        return;
      }
      router.refresh();
    } catch {
      setLockError(copy.networkError);
      setLocking(false);
    }
  }

  const packagesToShow = accepted ? [selectedPackage] : content.packages;
  const addonsToShow = accepted
    ? content.addons.filter((item) =>
        currentSelection.addonIds.includes(item.id),
      )
    : content.addons;

  return (
    <div className={styles.quotePage} lang={content.language}>
      <header className={styles.masthead}>
        <div className={styles.brand} aria-label="Wojciech Bajer">
          wb<span>_</span>
        </div>
        <p className={styles.mastheadLabel}>
          {copy.privateOffer}
          {quote.preview && (
            <span className={styles.previewBadge}>
              {content.language === "pl" ? "Podgląd" : "Preview"}
            </span>
          )}
        </p>
        {!quote.preview && (
          <button
            type="button"
            className={styles.lockButton}
            onClick={lock}
            disabled={locking}
          >
            {locking ? copy.locking : copy.lock}
            <span aria-hidden="true">↗</span>
          </button>
        )}
      </header>
      {lockError && (
        <p className={styles.error} role="alert">
          {lockError}
        </p>
      )}

      <main>
        <section className={styles.hero} aria-labelledby="quote-title">
          <div className={styles.heroTopline}>
            <p className={styles.eyebrow}>
              {copy.offer} / {content.number}
            </p>
            {accepted && (
              <span className={styles.statusBadge}>{copy.accepted}</span>
            )}
          </div>
          <h1 id="quote-title">{content.title}</h1>
          <div className={styles.metaGrid}>
            <div>
              <p className={styles.eyebrow}>{copy.preparedFor}</p>
              <p className={styles.metaName}>
                {content.clientCompany || content.clientName}
              </p>
              {content.clientCompany && <p>{content.clientName}</p>}
              {content.clientEmail && (
                <p className={styles.muted}>{content.clientEmail}</p>
              )}
              {content.clientDetails && (
                <p className={styles.details}>{content.clientDetails}</p>
              )}
            </div>
            <div>
              <p className={styles.eyebrow}>{copy.preparedBy}</p>
              <p className={styles.metaName}>{content.issuerName}</p>
              <a
                className={styles.inlineLink}
                href={`mailto:${content.issuerEmail}`}
              >
                {content.issuerEmail}
              </a>
              {content.issuerDetails && (
                <p className={styles.details}>{content.issuerDetails}</p>
              )}
            </div>
            <dl className={styles.dates}>
              <div>
                <dt className={styles.eyebrow}>{copy.issued}</dt>
                <dd>{date(content.issuedAt)}</dd>
              </div>
              <div>
                <dt className={styles.eyebrow}>{copy.valid}</dt>
                <dd>
                  {date(content.validUntil, true)}
                  <span className={styles.timezone}>
                    {content.language === "pl"
                      ? "czas polski"
                      : "Europe/Warsaw"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {accepted && (
          <section className={styles.notice} aria-labelledby="accepted-title">
            <span className={styles.noticeMark} aria-hidden="true">
              ✓
            </span>
            <div>
              <h2 id="accepted-title">{copy.accepted}</h2>
              <p>{copy.acceptedIntro}</p>
              <dl className={styles.acceptedDetails}>
                <div>
                  <dt>{copy.acceptedBy}</dt>
                  <dd>
                    {accepted.name} · {accepted.email}
                  </dd>
                </div>
                <div>
                  <dt>{copy.acceptedDate}</dt>
                  <dd>
                    {date(accepted.acceptedAt, true)} (
                    {content.language === "pl"
                      ? "czas polski"
                      : "Europe/Warsaw"}
                    )
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        )}
        {!accepted && expired && (
          <section
            className={`${styles.notice} ${styles.expired}`}
            aria-labelledby="expired-title"
          >
            <div>
              <h2 id="expired-title">{copy.expired}</h2>
              <p>{copy.expiredHelp}</p>
              <a
                href={`mailto:${content.issuerEmail}`}
                className={styles.inlineLink}
              >
                {content.issuerEmail}
              </a>
            </div>
          </section>
        )}

        <div className={styles.offerLayout}>
          <div className={styles.offerBody}>
            <section className={styles.section} aria-labelledby="intro-title">
              <p className={styles.sectionIndex}>{copy.intro}</p>
              <h2 id="intro-title" className={styles.sectionHeading}>
                {copy.scope}
              </h2>
              <p className={styles.summaryText}>{content.summary}</p>
              {content.scope.length > 0 && (
                <div className={styles.scopeList}>
                  {content.scope.map((section, index) => (
                    <article
                      key={section.id ?? index}
                      className={styles.scopeItem}
                    >
                      <span className={styles.itemIndex} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3>{section.title}</h3>
                        <p>{section.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {content.timeline.length > 0 && (
              <section
                className={styles.section}
                aria-labelledby="timeline-title"
              >
                <h2 id="timeline-title" className={styles.sectionHeading}>
                  {copy.timeline}
                </h2>
                <ol className={styles.timeline}>
                  {content.timeline.map((phase, index) => (
                    <li key={phase.id ?? index}>
                      <span className={styles.timelineStep} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className={styles.timelineTitle}>
                          <h3>{phase.title}</h3>
                          <span>{phase.duration}</span>
                        </div>
                        <p>{phase.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className={styles.section} aria-labelledby="package-title">
              <p className={styles.sectionIndex}>{copy.offer}</p>
              <h2 id="package-title" className={styles.sectionHeading}>
                {accepted ? copy.packageFixed : copy.packageTitle}
              </h2>
              {!accepted && content.packages.length > 1 && (
                <p className={styles.sectionIntro}>{copy.packageIntro}</p>
              )}
              <fieldset
                className={styles.packageList}
                disabled={selectionsLocked}
              >
                <legend className={styles.srOnly}>
                  {accepted ? copy.packageFixed : copy.packageTitle}
                </legend>
                {packagesToShow.map((option) => {
                  const optionTotals = calculateQuote(content, {
                    packageId: option.id,
                    addonIds: [],
                  });
                  const selected = option.id === currentSelection.packageId;
                  return (
                    <label
                      key={option.id}
                      className={`${styles.packageOption} ${selected ? styles.optionSelected : ""}`}
                    >
                      <input
                        type="radio"
                        name="quote-package"
                        value={option.id}
                        checked={selected}
                        onChange={() => selectPackage(option.id)}
                      />
                      <span className={styles.optionBody}>
                        <span className={styles.optionTitle}>
                          {option.name}
                          {option.recommended && (
                            <span className={styles.recommended}>
                              {copy.recommended}
                            </span>
                          )}
                        </span>
                        {option.description && (
                          <span className={styles.optionDescription}>
                            {option.description}
                          </span>
                        )}
                        <span className={styles.optionPrice}>
                          <strong>{money(optionTotals.net)}</strong> {copy.net}
                          <span>
                            {money(optionTotals.gross)} {copy.gross}
                          </span>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              {content.discountPercent > 0 && (
                <p className={styles.smallText}>{copy.discounted}</p>
              )}
              {addonsToShow.length > 0 && (
                <div className={styles.addonsSection}>
                  <h3>{accepted ? copy.includedAddons : copy.addons}</h3>
                  {!accepted && (
                    <p className={styles.sectionIntro}>{copy.addonsIntro}</p>
                  )}
                  <fieldset
                    className={styles.addonList}
                    disabled={selectionsLocked}
                  >
                    <legend className={styles.srOnly}>{copy.addons}</legend>
                    {addonsToShow.map((addon) => {
                      const line = calculateQuote(content, {
                        packageId: currentSelection.packageId,
                        addonIds: [addon.id],
                      }).lines.find(
                        (item) => item.addon && item.item.id === addon.id,
                      )!;
                      return (
                        <label key={addon.id} className={styles.addonOption}>
                          <input
                            type="checkbox"
                            checked={currentSelection.addonIds.includes(
                              addon.id,
                            )}
                            onChange={(event) =>
                              toggleAddon(addon.id, event.target.checked)
                            }
                          />
                          <span className={styles.optionBody}>
                            <span className={styles.optionTitle}>
                              {addon.name}
                            </span>
                            {addon.description && (
                              <span className={styles.optionDescription}>
                                {addon.description}
                              </span>
                            )}
                            <span className={styles.addonPrice}>
                              {money(line.net)} {copy.net}
                              <span>
                                {money(line.gross)} {copy.gross}
                              </span>
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </fieldset>
                </div>
              )}
            </section>

            <section
              className={styles.section}
              aria-labelledby="breakdown-title"
            >
              <h2 id="breakdown-title" className={styles.sectionHeading}>
                {copy.breakdown}
              </h2>
              <p className={styles.sectionIntro}>{selectedPackage.name}</p>
              <table className={styles.priceTable} role="table">
                <caption className={styles.srOnly}>
                  {copy.breakdown}: {selectedPackage.name}
                </caption>
                <thead role="rowgroup">
                  <tr role="row">
                    <th scope="col" role="columnheader">
                      {copy.service}
                    </th>
                    <th scope="col" role="columnheader">
                      {copy.quantity}
                    </th>
                    <th scope="col" role="columnheader">
                      {copy.unitPrice}
                    </th>
                    <th scope="col" role="columnheader">
                      {copy.lineNet}
                    </th>
                    <th scope="col" role="columnheader">
                      {copy.vat}
                    </th>
                    <th scope="col" role="columnheader">
                      {copy.lineGross}
                    </th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {totals.lines.map((line) => (
                    <tr
                      key={`${line.addon ? "addon" : "package"}:${line.item.id}`}
                      role="row"
                    >
                      <th scope="row" role="rowheader">
                        <span className={styles.lineName}>
                          {line.item.name}
                        </span>
                        {line.addon && (
                          <span className={styles.lineBadge}>
                            {copy.optional}
                          </span>
                        )}
                        {line.item.description && (
                          <span className={styles.lineDescription}>
                            {line.item.description}
                          </span>
                        )}
                      </th>
                      <td role="cell" data-label={copy.quantity}>
                        {quantities.format(line.item.quantity)} {line.item.unit}
                      </td>
                      <td role="cell" data-label={copy.unitPrice}>
                        {money(Math.round(line.item.unitPrice * 100))}
                      </td>
                      <td role="cell" data-label={copy.lineNet}>
                        {money(line.net)}
                      </td>
                      <td role="cell" data-label={copy.vat}>
                        {money(line.vat)}
                        <span className={styles.taxRate}>
                          {percentages.format(line.item.vatRate)}%
                        </span>
                      </td>
                      <td role="cell" data-label={copy.lineGross}>
                        {money(line.gross)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={styles.smallText}>
                {copy.allPrices}
                {content.discountPercent > 0 &&
                  ` ${copy.lineNet}: ${copy.afterDiscount}.`}
              </p>
            </section>

            <section className={styles.section} aria-labelledby="terms-title">
              <h2 id="terms-title" className={styles.sectionHeading}>
                {copy.terms}
              </h2>
              <div className={styles.termsList}>
                {content.assumptions && (
                  <article>
                    <h3>{copy.assumptions}</h3>
                    <p>{content.assumptions}</p>
                  </article>
                )}
                {content.exclusions && (
                  <article>
                    <h3>{copy.exclusions}</h3>
                    <p>{content.exclusions}</p>
                  </article>
                )}
                <article>
                  <h3>{copy.paymentTerms}</h3>
                  <p>{content.paymentTerms}</p>
                </article>
                {content.notes && (
                  <article>
                    <h3>{copy.notes}</h3>
                    <p>{content.notes}</p>
                  </article>
                )}
              </div>
            </section>

            {canAccept && (
              <section
                id="acceptance"
                className={`${styles.section} ${styles.acceptanceSection}`}
                aria-labelledby="acceptance-title"
              >
                <h2 id="acceptance-title" className={styles.sectionHeading}>
                  {copy.acceptance}
                </h2>
                <p className={styles.sectionIntro}>{copy.acceptanceIntro}</p>
                <form onSubmit={accept} className={styles.acceptanceForm}>
                  <fieldset disabled={pending || saved}>
                    <legend className={styles.srOnly}>{copy.acceptance}</legend>
                    <div className={styles.formGrid}>
                      <label className={styles.field}>
                        <span>{copy.name}</span>
                        <input
                          type="text"
                          name="name"
                          required
                          autoComplete="name"
                          maxLength={160}
                        />
                      </label>
                      <label className={styles.field}>
                        <span>{copy.email}</span>
                        <input
                          type="email"
                          name="email"
                          required
                          autoComplete="email"
                          maxLength={254}
                          defaultValue={content.clientEmail ?? ""}
                        />
                      </label>
                    </div>
                    <label className={styles.consent}>
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                      />
                      <span>
                        {copy.consent} <strong>{money(totals.gross)}</strong>.
                      </span>
                    </label>
                    <p className={styles.smallText}>{copy.acceptanceNote}</p>
                    {error && (
                      <div className={styles.error} role="alert">
                        <p>{error}</p>
                        {needsRefresh && (
                          <button
                            type="button"
                            className={styles.inlineButton}
                            onClick={() => router.refresh()}
                          >
                            {copy.refresh}
                          </button>
                        )}
                      </div>
                    )}
                    {saved && (
                      <p className={styles.success} role="status">
                        {copy.acceptedWaiting}
                      </p>
                    )}
                    <button
                      type="submit"
                      className={styles.primaryButton}
                      disabled={!consent || pending || saved}
                    >
                      {pending
                        ? copy.accepting
                        : saved
                          ? copy.accepted
                          : copy.accept}
                      <span aria-hidden="true">↗</span>
                    </button>
                  </fieldset>
                </form>
              </section>
            )}
          </div>

          <aside
            className={styles.summaryAside}
            aria-labelledby="summary-title"
          >
            <div className={styles.summaryPanel}>
              <p className={styles.eyebrow}>{copy.priceFor}</p>
              <h2 id="summary-title">{selectedPackage.name}</h2>
              {currentSelection.addonIds.length > 0 && (
                <ul className={styles.selectedAddons}>
                  {content.addons
                    .filter((item) =>
                      currentSelection.addonIds.includes(item.id),
                    )
                    .map((item) => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
              )}
              <dl className={styles.totals}>
                {totals.discount > 0 && (
                  <>
                    <div>
                      <dt>{copy.subtotal}</dt>
                      <dd>{money(totals.subtotal)}</dd>
                    </div>
                    <div className={styles.discountRow}>
                      <dt>
                        {copy.discount} (
                        {percentages.format(content.discountPercent)}%)
                      </dt>
                      <dd>−{money(totals.discount)}</dd>
                    </div>
                  </>
                )}
                <div>
                  <dt>{copy.totalNet}</dt>
                  <dd>{money(totals.net)}</dd>
                </div>
                <div>
                  <dt>{copy.totalVat}</dt>
                  <dd>{money(totals.vat)}</dd>
                </div>
              </dl>
              <div className={styles.grandTotal}>
                <p>{copy.totalGross}</p>
                <strong role="status" aria-live="polite" aria-atomic="true">
                  {money(totals.gross)}
                </strong>
              </div>
              <div className={styles.summaryActions}>
                {canAccept && (
                  <a href="#acceptance" className={styles.primaryButton}>
                    {copy.acceptLink}
                    <span aria-hidden="true">↓</span>
                  </a>
                )}
                <a className={styles.secondaryButton} href={pdfUrl} download>
                  {copy.pdf}
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
              <p className={styles.smallText}>
                {accepted ? copy.pdfAccepted : copy.pdfHelp}
              </p>
              {!accepted && (
                <p className={styles.summaryValidity}>
                  {copy.valid}: {date(content.validUntil, true)} (
                  {content.language === "pl" ? "czas polski" : "Europe/Warsaw"})
                </p>
              )}
            </div>
          </aside>
        </div>

        <section
          className={styles.contactSection}
          aria-labelledby="contact-title"
        >
          <div>
            <p className={styles.eyebrow}>{content.issuerName}</p>
            <h2 id="contact-title">{copy.contact}</h2>
            <p>{copy.contactHelp}</p>
          </div>
          <a
            href={`mailto:${content.issuerEmail}`}
            className={styles.contactLink}
          >
            {content.issuerEmail}
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>
      <footer className={styles.footer}>
        <span className={styles.footerBrand}>
          wb<span>_</span>
        </span>
        <p>{copy.confidential}</p>
        <p>{content.number}</p>
      </footer>
    </div>
  );
}
