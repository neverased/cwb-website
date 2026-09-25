# Branded Client Quotes Implementation Plan

> Execution: native coordination with independent workers for collection/domain, client UI, and PDF implementation. The user has authorized the expanded variant. Integrate and verify in this session; do not push, deploy, or send offers.

**Goal:** Prepare branded, password-protected quotes in Payload, with packages, additions, exact totals, PDF export and optional acceptance.

**Architecture:** Private Payload quote documents feed an allowlisted public model. Node route handlers authenticate a per-quote cookie and calculate prices using shared integer arithmetic. PostgreSQL handles durable throttling and atomic acceptance; PDFKit renders embedded-font PDFs on the server.

**Tech Stack:** Existing Next.js 16, Payload 3.90.2, React, PostgreSQL; PDFKit and embedded open-source fonts.

**Spec:** `docs/superpowers/specs/2026-09-25-client-quotes-design.md`

## Global constraints

- Preserve existing public website, posts and media behavior.
- No client CMS accounts, no public quote data or password material in HTML before authorization, no production changes.
- PLN/EUR/USD/GBP, Polish/English, two decimal money precision, three decimal quantity precision.
- One shared money algorithm; trust server calculations only.
- Protect PDF with the same access rules as the page; no remote rendering service.

## Review focus

1. Fractional quantities, discount and per-line VAT rounding: domain regression tests.
2. Draft saves, password rotation, expiry and cross-quote cookie replay: integration tests.
3. Stale/concurrent acceptance and later edits: database integration tests.
4. Long descriptions, Polish characters, multipage documents: PDF extraction and visual review.
5. Mobile tables, keyboard interaction and useful error recovery: browser inspection.

## Tasks

- [x] Define the shared QuoteContent/PublicQuote/QuoteSelection/QuoteTotals interfaces in `src/lib/quotes/types.ts`; add domain and credential regression cases before their implementation.
- [x] Implement `src/lib/quotes/calculations.ts`, `presentation.ts`, `credentials.ts` and the private `src/cms/collections/Quotes.ts`, including validation, draft behavior and duplication resets.
- [x] Implement allowlisted retrieval, secure session cookies, persistent login limits and atomic acceptance in `src/lib/quotes/server.ts` and `/api/quotes/[publicId]/…` route handlers. Ensure unknown IDs, changed credentials, disabled access and stale revisions are denied.
- [x] Implement `/quotes/[publicId]/` and isolated client components, with package/addition selection, item totals, accessible acceptance form and protected PDF link. Match existing design tokens.
- [x] Implement `renderQuotePdf(quote, selection)` in `src/lib/quotes/pdf.ts`, using shared calculations and embedded fonts. Verify Polish text and long-document pagination.
- [x] Register the collection, generate types/import map/migration, and add durable throttling and acceptance invariants to the database migration. Run on disposable local PostgreSQL only.
- [x] Run domain/security regressions, CMS/HTTP integration and concurrency checks, existing tests, lint, typecheck and production build. Inspect desktop/mobile UI and generated PDF, correct failures, then document the owner's workflow in README.

## Verification evidence

- Fresh migration applied successfully to a disposable PostgreSQL 17 database in Docker Desktop, explicitly using the local desktop-linux context.
- Quote domain regressions passed: decimal rounding, selection validation, credentials, CMS hook safeguards, password visibility/editability configuration, duplication and accepted-content protection.
- PDF regression passed for Polish (3 pages), long content (17 pages), and accepted English (3 pages). Text extraction and glyph-bound checks covered all 23 pages; rendered pages were visually reviewed.
- Production standalone build and TypeScript passed. Lint, existing contact and SEO regressions passed.
- HTTP/database quote regression passed against the production standalone server: private pages/API/PDF, draft separation, cookie scope, password rotation, expiry, stale/concurrent acceptance, exact stored totals, accepted snapshot, history, duplication and durable throttling.
- Existing CMS publishing regression passed against that server, including public pages, social images, uploads, revisions, sitemap and pagination.
- Browser review covered 1366px desktop and 390px mobile layouts with no horizontal overflow, keyboard selection, recalculated totals, PDF download, logout and CMS link copying.
- Browser review found Payload's field read permission and default virtual-field readOnly setting hid/disabled the password input. Both were fixed with regression coverage; the final production build shows an editable, empty password field.
- Added quote regression steps to the existing Linux CI workflow. Hosted CI and the Docker image build were not run in this session.
- Local fictional demo is retained for review. No production deployment, push or client messages were performed.

Next.js emits a non-blocking metadataBase warning during the build. The frontend layout already defines metadataBase; the public-page metadata regression checks passed.
