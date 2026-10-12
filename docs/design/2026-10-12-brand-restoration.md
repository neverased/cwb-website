# Original logo and turquoise accents

Implemented locally on 12 October 2026 after approval of the recommended brand
variant. This supersedes the mint palette and typed `wb_` identity described in
the historical Signal redesign report. Prepared as local Conventional Commits;
no publication or push was made.

## Delivered result

- Original full logo in the desktop header and footer; original compact symbol
  in mobile headers. The footer retains the full name on mobile.
- One shared logo component with proportional sizing and the positive artwork
  for print. The source files remain unchanged; prepared assets are lossless
  crops, not redrawn artwork.
- Turquoise `#00e5e5` primary actions and `#80e7e7` text accents on the existing
  graphite surfaces. Navy and magenta remain in the original symbol. Typography,
  page composition and the authentic portrait are retained.
- Original artwork in favicon, Apple/app icons, social sharing images, the
  interactive card, its reverse, strap and static fallback.
- Consistent branding across protected offer access, unavailable/incomplete
  states, offer headers/footers, browser print and generated PDFs. Print uses
  the positive logo and dark teal accents on white.

The header navigation collapses before it crowds the full logo. A footer
overflow discovered at 320 px with 200% text size was corrected. The offer's
mobile footer also keeps the intended logo width instead of stretching it.

`DESIGN.md` and `.impeccable/design.json` describe the approved system. Asset
sources and regeneration commands are documented in `public/brand/README.md`.

## Verification

Final HTTP and integration checks used the local standalone production build
at `http://127.0.0.1:3100`, backed by an isolated disposable PostgreSQL database.
The local article and offer used for visual inspection contain fictional data.

| Check | Result |
| --- | --- |
| `pnpm lint` | Passed |
| `pnpm exec tsc --noEmit` | Passed; production build also typechecked |
| `pnpm test` | Contact, SEO and service regressions passed |
| `pnpm test:quotes` | Domain and PDF regressions passed |
| `pnpm build` | Standalone production build passed |
| `SEO_TEST_URL=http://127.0.0.1:3100 pnpm test:seo:http` | 13 sitemap pages, 19 internal links and 21 images passed; all six service pages checked without JavaScript |
| `pnpm test:quotes:integration` with the isolated local test environment | CMS privacy, password access, protected PDF, revisions, expiry, acceptance snapshots, throttling and logout passed |
| Responsive home/header/footer | Checked at 320, 360, 390, 720, 768, 1100, 1200, 1280 and 1440 px; no horizontal overflow |
| Responsive actual CMS offer | Checked at 320, 390, 768 and 1440 px; no horizontal overflow |
| Enlarged text | Home and offer checked at 320 px with 200% root text size |
| Navigation and fallbacks | Mobile menu, Escape close, native no-JavaScript menu, loaded artwork and reduced-motion card fallback checked |
| Interactive card | Front/reverse artwork and keyboard flip checked |
| Icons/social previews | Eight generated metadata images checked, including a real CMS article; favicon resolutions validated |
| Print/PDF | Positive full logo checked in browser print and generated PDFs; 3-page Polish, 17-page long Polish and 3-page accepted English fixtures passed |
| Original asset preservation | Cropped pixels and embedded card artwork compared to their sources; original portrait retained |
| Independent review / `git diff --check` | No outstanding findings / passed |

The HTTP regression now checks original header/footer artwork, the responsive
symbol source and brand asset availability. The PDF regression checks that the
logo is embedded while retaining the existing offer-content assertions.

Design detector findings were resolved by removing obsolete header styles and
documenting intentional, existing offer typography and corner sizes. The final
scoped detector returned no findings. No new suppressions were added.

Local screenshots are saved under the ignored `.playwright-mcp/` directory:
`brand-final-desktop.png`, `brand-final-mobile.png`, `brand-final-footer.png`,
`brand-card-reverse.png`, `brand-quote-desktop.png`, `brand-quote-mobile.png`,
`brand-quote-access.png` and `brand-article-og-production.png`. PDF and browser
print evidence is in `.playwright-mcp/brand-quotes/`.

## Boundaries

- The build still reports a pre-existing Next.js `metadataBase` warning. Public
  canonical and sharing metadata passed the production HTTP regression.
- Browser verification used Chromium with emulated mobile sizes; physical
  devices, Safari and Firefox were not tested.
- No real contact email was sent. Production data, deployment configuration and
  remote branches were not changed. The running server and fictional CMS
  fixtures are available only in the local review environment.
