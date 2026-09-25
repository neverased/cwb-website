# Branded client quotes

The user selected the expanded online-offer and PDF variant and authorized implementation. This is a new subsystem within the existing Next.js 16 / Payload 3 / PostgreSQL application. Work is local; deployment and sending offers remain under the owner's control.

## Outcome

The owner prepares a quote in Payload. A client opens a random per-quote URL, enters that quote's password, compares packages and optional additions, downloads a branded PDF, and optionally records acceptance of the exact price configuration and revision. No client accounts are introduced.

## Editing and presentation

- A private Quotes collection with Payload drafts and version history, useful admin tabs, duplication, and owner-only editing. A reusable quote can serve as a template through duplication; duplication resets sharing credentials and acceptance.
- Identity: quote number/title, client name/company/email/details, issuer name/email/details, issue date, valid-until date, language (Polish or English), currency (PLN/EUR/USD/GBP).
- Narrative: summary, named scope sections, assumptions, exclusions, delivery timeline, payment terms and closing notes.
- One to five packages, with named line items, descriptions, quantities (up to three decimal places), units, net unit prices (two decimal places), VAT percentages, and an optional per-quote percentage discount. Optional additions are priced with the same algorithm.
- Totals use integer minor currency units, with explicit per-line rounding: quantity times unit price, then discount, then VAT. Browser, server acceptance and PDF share one calculation module. Client-submitted totals are never trusted.
- The public view uses the existing wb_ mark, Space Grotesk/Fira Code, dark background and mint accents. Responsive tables retain readable descriptions and totals. PDF is A4, light, branded, paginated, and embeds fonts supporting Polish text. PDF generation runs locally on the server without Chromium or a third-party service.
- Downloaded PDFs cannot be revoked; the online offer and download endpoint can be revoked.

## Access and state

- Quotes are private through the CMS REST API, version API and all client routes. Clients never receive CMS user accounts. Public client data is produced by an explicit allowlist and excludes password hashes and internal fields.
- Random public identifier plus a per-quote password. Store scrypt hashes only; the plain password field is virtual and not retained in versions or logs. A signed HttpOnly/SameSite cookie is scoped to one quote and expires after at most eight hours. Password rotation invalidates prior sessions. Access can be disabled or given a separate expiry.
- Server-side authorization is required before rendering content or generating a PDF. Generic metadata and unavailable states do not reveal customer names or quote titles. Private responses use no-store and noindex; offers are absent from sitemap.
- PostgreSQL-backed global and per-quote login attempt limits survive process restarts. Same-origin validation protects modifying endpoints, and request sizes and selections are bounded.
- Draft edits must not leak to clients. Publishing updates the client-visible revision. An expired commercial validity date blocks acceptance, independently of access expiry.
- Optional acceptance records name/email, selected package/additions, server-calculated totals, timestamp, revision and an immutable content snapshot. It is a recorded client decision, not an advertised qualified electronic signature. Concurrent or stale acceptance must not overwrite a prior decision or accept changed terms. Accepted quote content is frozen; corrections use a duplicate. Access can still be revoked.
- Quote documents use their own content and generated PDFs; the existing public Media library is not used to store private documents. Arbitrary private uploads are outside this implementation.

## Persistence and verification

Use committed Payload migrations and generated types. Keep public posts/media behavior unchanged. Verify money arithmetic, selection validation, credential rotation, malformed cookies, expiry, draft privacy, denied CMS reads, cross-quote access, replay/concurrency, PDF authorization and rendered output. Run existing lint/tests, TypeScript and production build, then exercise the workflow against a disposable local PostgreSQL instance and browser at desktop/mobile widths.
