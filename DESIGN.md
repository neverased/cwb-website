---
name: "Wojciech Bajer Consulting"
description: "A terminal-grade brand system for a one-person technical consulting and delivery practice."
colors:
  page-background: "#020807"
  page-background-soft: "#041111"
  panel-top: "#0a1211"
  panel-bottom: "#050b0b"
  foreground: "#f4fff8"
  foreground-strong: "#f6fff8"
  text-muted: "#d6ece1c7"
  text-muted-strong: "#e2f7eddb"
  mint-signal: "#8ddfba"
  mint-active: "#7effc6"
  lime-command: "#d9ff8c"
  warm-warning: "#ffaa78"
  credibility-red: "#e14545"
  mint-border: "#7effcb1f"
  mint-border-strong: "#7effcb38"
  white-sheen: "#ffffff08"
  terminal-black: "#030a09"
  mac-red: "#ff5f57"
  mac-amber: "#febc2e"
  mac-green: "#28c840"
typography:
  display:
    fontFamily: "Space Grotesk, Fira Code, monospace"
    fontSize: "clamp(2.5rem, 5vw, 4.8rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Space Grotesk, Fira Code, monospace"
    fontSize: "clamp(1.9rem, 3vw, 3.1rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Fira Code, ui-monospace, Menlo, Monaco, monospace"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.08em"
  body:
    fontFamily: "Fira Code, ui-monospace, Menlo, Monaco, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Fira Code, ui-monospace, Menlo, Monaco, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  input: "1rem"
  module: "1.15rem"
  card: "1.5rem"
  hero-panel: "2rem"
  panel: "1.75rem"
  mobile-panel: "1.4rem"
  pill: "999px"
spacing:
  xs: "0.45rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.35rem"
  xl: "2.2rem"
  section-gap: "clamp(3rem, 6vw, 5rem)"
  page-x: "clamp(1rem, 3vw, 1.75rem)"
  page-bottom: "4.5rem"
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, rgba(115,255,190,0.16), rgba(221,255,139,0.18))"
    borderColor: "{colors.mint-border-strong}"
    textColor: "{colors.foreground-strong}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.15rem"
    minHeight: "3.2rem"
  button-secondary:
    backgroundColor: "{colors.white-sheen}"
    borderColor: "#ffffff1a"
    textColor: "{colors.text-muted-strong}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.15rem"
    minHeight: "3.2rem"
  nav-pill-active:
    backgroundColor: "rgba(126, 255, 203, 0.1)"
    textColor: "{colors.foreground-strong}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.7rem"
  terminal-input:
    backgroundColor: "{colors.panel-bottom}"
    borderColor: "#7effcb24"
    textColor: "{colors.foreground}"
    rounded: "{rounded.input}"
    padding: "0.85rem 0.95rem"
    minHeight: "3.2rem"
  terminal-panel:
    backgroundColor: "{colors.panel-bottom}"
    borderColor: "{colors.mint-border}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.card}"
    padding: "1.35rem"
  route-tab:
    backgroundColor: "{colors.white-sheen}"
    activeBackgroundColor: "rgba(126, 255, 203, 0.08)"
    textColor: "{colors.text-muted-strong}"
    rounded: "0.85rem"
  credibility-panel:
    accentColor: "{colors.credibility-red}"
    backgroundColor: "{colors.panel-bottom}"
    borderColor: "{colors.mint-border}"
---

# Design System: Wojciech Bajer Consulting

## 1. Overview

**Creative North Star: "Signal Control Room"**

This brand system is a working diagnostic surface for a one-person technical operator. It should feel dark, concentrated, controlled, and useful. The interface is allowed to look technical because the service is technical, but the terminal identity must help clients understand the offer instead of forcing them to decode it.

The site is a brand surface with conversion intent. Its job is to route potential clients from a messy concern into a clear next action: email Wojciech, open the service map, review the process, or check credibility. The one-person model is part of the trust signal. Avoid corporate abstraction.

The current identity is terminal-grade: near-black teal depth, mint linework, acid-lime command accents, dense mono labels, Space Grotesk display type, selected partner marks, RZETELNA credibility, and controlled scanning or scramble motion.

**Key Characteristics:**
- Dark teal-black operating surface with mint diagnostic linework.
- Mono-forward interface voice with Space Grotesk for decisive hierarchy.
- Dense but organized modules that explain routing, fit, process, proof, and contact.
- Motion that reads as booting, scanning, routing, or terminal output.
- Direct accountability: email, operator name, and no anonymous agency posture.

## 2. Site Structure

Primary routes:

- `/`: homepage, hero route selection, outcomes, proof, capabilities, process summary, contact.
- `/profile`: operator profile, core workstreams, selected collaborations, credibility, direct routes.
- `/services`: service map for multimedia, software, architecture, and audits.
- `/process`: operating model from diagnosis to handoff.
- `/notes`: topic queue and diagnostic writing entry points.
- `/contact`: direct email, credibility, protected form.

Primary navigation labels must remain: `Home`, `Profile`, `Services`, `Process`, `Notes`, `Contact`.

Primary conversion path:

1. Hero direct email.
2. Contact section email.
3. `/contact` email panel.
4. Protected contact form.

The protected form is secondary. It must always preserve the direct email route when loading, disabled, or unavailable.

## 3. Colors

The palette is a control-room palette. Black-green depth carries the site, mint defines structure and system state, lime marks active command output, and red is reserved for the RZETELNA credibility mark.

### Primary

- **Control-Room Black:** `#020807` for the page base and full-page atmosphere.
- **Runtime Teal:** `#041111`, `#0a1211`, and `#050b0b` for page gradients, panels, cards, shells, and input surfaces.
- **Mint Signal:** `#8ddfba` and `#7effc6` for active labels, borders, focus rings, carets, route dots, and diagnostic states.

### Secondary

- **Lime Command:** `#d9ff8c` for terminal prompts, command output, active markers, and high-signal details. Keep it rare.
- **Warm Warning:** `#ffaa78` for failed or unavailable form states.
- **Credibility Red:** `#e14545` only for the RZETELNA accent. It should not become a general brand color.

### Neutral

- **Terminal Ink:** `#f4fff8` and `#f6fff8` for headings, main copy, buttons, and active nav.
- **Muted Phosphor:** `rgba(214, 236, 225, 0.78)` and `rgba(226, 247, 237, 0.86)` for descriptive copy.
- **Mint Wire:** low-alpha mint for structural borders, dividers, chips, scanlines, and corner brackets.
- **White Sheen:** `rgba(255,255,255,0.03)` to `rgba(255,255,255,0.08)` for subtle panel overlays.

### Rules

**The Black Surface Rule.** Do not drift into navy SaaS, purple gradients, beige editorial restraint, or generic dark tech. The brand lives in black-green runtime space.

**The Mint Wire Rule.** Mint borders stay thin and structural. Use 1px strokes, corner brackets, focus rings, scanlines, and subtle glow. Do not use thick colored side borders.

**The Command Accent Rule.** Lime marks active output or command intent. It should guide the eye, not decorate every component.

## 4. Typography

**Display Font:** Space Grotesk, with Fira Code and monospace fallback.
**Body Font:** Fira Code, with system monospace fallbacks.
**Label Font:** Fira Code.

The pairing is intentionally technical. Space Grotesk gives the largest statements enough width and business legibility. Fira Code keeps the working surface in an operator voice.

### Hierarchy

- **Display:** `clamp(2.5rem, 5vw, 4.8rem)`, 400, `0.98`, `-0.04em`. Use for route H1s and the homepage hero.
- **Section headline:** `clamp(1.9rem, 3vw, 3.1rem)`, 400, `1.02`, `-0.04em`. Use for major section claims.
- **Panel title:** `1.1rem` to `1.35rem`, 400, `1.35` to `1.45`. Use in route cards, process cards, and contact panels.
- **Body:** `1rem`, 400, `1.65` to `1.75`. Keep prose around 60 to 70ch on content surfaces and tighter inside modules.
- **Labels:** `0.7rem` to `0.76rem`, uppercase, `0.14em` to `0.22em`. Use for route prompts, metadata, form labels, and command status.

### Rules

**The Operator Voice Rule.** Mono is allowed because the brand is a technical operator. Use Space Grotesk for hierarchy so the site reads as a client-facing business surface, not a terminal costume.

**The Tight Display Rule.** `-0.04em` is the floor. Do not tighten display text further.

**The Clear Client Rule.** Technical labels can stay, but surrounding copy must explain the business value in plain language.

## 5. Layout

### Global Page

The page uses a dark full-width atmospheric background with radial mint and warm highlights, subtle grid lines, scanline overlays, and a constrained shell. Use `page-x` side padding and `section-gap` vertical rhythm. Avoid floating page-section cards. Cards are for modules and repeated items only.

### Homepage

The homepage opens with a two-column hero:

- Left: brand logo, H1, plain value proposition, direct email CTA, service-map CTA.
- Right: interactive command deck with problem-type tabs, active route card, and terminal output.

Below the hero, the flow is:

1. Outcome strip.
2. Credibility panel.
3. Collaboration proof and logo wall.
4. Capability cards.
5. Process summary and execution console.
6. Contact section.

The hero terminal element must not overpower the headline. It should feel like a useful diagnostic control, not a giant decorative widget.

### Subpages

Subpages use a consistent lead pattern:

- Header.
- Lead copy with route kicker, scrambled H1, description.
- Right-side panel, diagram, or digest.
- Content sections using panels, cards, IO grids, timelines, or logo surfaces.

Use this pattern for `/profile`, `/services`, `/process`, `/notes`, and `/contact` so the site feels like one system.

### Responsive Rules

- Desktop: use asymmetrical two-column layouts where they clarify route and action.
- Tablet and mobile: collapse hero, panels, route boards, process grids, logos, and form grids to one column.
- Header becomes a static stacked panel around `760px`.
- Keep text inside buttons, tabs, cards, and route nodes from overflowing. Reduce copy or scale locally before allowing layout breakage.

## 6. Components

### Site Header

Sticky pill header on desktop. Mobile becomes a stacked rounded panel. The brand lockup has a route prompt (`cwb://...`) above the uppercase name. Active nav uses a mint translucent pill. Keep labels unchanged.

### Hero Logo

Use the existing `wbc_logo_alpha_kolor_neg.png` treatment in the hero. It should be visible enough to carry the brand, but not compete with the H1. Preserve the negative logo treatment on dark backgrounds.

### Command Deck

The homepage command deck is the main terminal identity object after the boot sequence. It includes:

- Window controls.
- Active route status.
- Problem-type tabs.
- Route summary card.
- Working terminal viewport.

Tabs should behave like clear controls, not decorative chips. Active state must be visible through fill, border, and text contrast.

### Terminal Loader

The boot sequence is a brand entrance, not a loading spinner. It uses a terminal shell, progress bar, stage labels, command lines, tone colors, cursor, and auto-scroll. It should complete reliably, preserve a readable default state, and avoid blocking access after the first session. Reduced motion must disable pulsing and blinking where needed.

### Scramble Text

Use scramble on hero and section headings as a terminal-grade reveal. It must not be the only source of content meaning: the rendered element keeps `aria-label` set to the final text.

### Cards and Panels

Standard panels use:

- 1px low-alpha mint border.
- Black-green vertical gradient.
- Subtle scanlines.
- Inset white hairline.
- Soft black depth.
- Radius between `1rem` and `1.75rem`, with `2rem` reserved for the hero command deck.

Do not nest decorative cards. Inner modules need a real role: route stage, IO cell, terminal line, contact field, credibility proof, or logo surface.

### Buttons and Links

Primary action: mint-to-lime translucent fill, mint border, foreground text, pill radius.

Secondary action: white-sheen fill or transparent surface, quiet border, muted foreground.

Labels should describe the action: `Email Wojciech`, `Open service map`, `Open contact page`, `Send inquiry`.

### Contact Panel

Contact uses a two-column grid:

- Direct route card with `mail@wojciechbajer.com`.
- Protected form card.

Fields: `name`, `email`, `scope`, `message`, `challenge_answer`, plus hidden anti-spam and challenge fields. Keep field names unchanged unless explicitly approved.

States:

- Loading: form disabled, email still ready.
- Ready: challenge prompt visible and form enabled.
- Sent: success banner.
- Invalid: validation banner.
- Error or unavailable: direct email banner.

### Credibility Panel

The RZETELNA Firma panel is proof, not decoration. Preserve the red `RZETELNA` accent, certificate link, display URL, sweep, and pulse. Do not let red spread into unrelated UI.

### Collaboration Logos

Partner marks live in controlled logo surfaces. Light, dark, and yellow surfaces may differ to protect mark legibility. The grid should read as proof of real delivery contexts, not a logo-collecting wall.

## 7. Motion

Motion language:

- Boot sequence: terminal initialization.
- Hero background: scanning rail, sweep, and ring movement.
- Command deck and panels: subtle HUD sweeps.
- Credibility: verification sweep and pulse.
- Scramble: route and section heading reveal.
- Contact: channel sweep and signal pulse.

Rules:

- Motion must communicate scanning, routing, loading, verification, or output.
- Do not animate layout properties when transform, opacity, or background-position can do the job.
- Every animation family needs a `prefers-reduced-motion: reduce` fallback.
- Content must be visible by default. Do not gate readability on JS animation completion.

## 8. SEO And Platform Notes

The site uses Next.js App Router conventions:

- `src/app/layout.tsx` owns root metadata, viewport, Google fonts, and global CSS.
- Each route exports metadata through `buildMetadata`.
- `sitemap.ts` and `robots.ts` are static route files.
- `opengraph-image.tsx` files generate route-level OG images.
- Structured data uses `WebSite`, `Person`, `WebPage`, `CollectionPage`, `ContactPage`, `ProfilePage`, breadcrumbs, item lists, and service nodes.
- Contact uses route handlers under `/api/contact` and `/api/contact/bootstrap`.

Keep canonical paths, sitemap routes, and nav labels aligned when adding pages.

## 9. Do's And Don'ts

### Do

- Preserve the black-green, mint, lime, mono-forward terminal identity.
- Make the offer understandable to non-technical clients.
- Keep direct email and direct accountability visible.
- Connect technical work to clarity, risk reduction, execution, and durable handoff.
- Use selected collaborations and RZETELNA proof as evidence-bearing elements.
- Keep reduced-motion fallbacks for boot, scan, sweep, pulse, and scramble effects.
- Keep contrast high on dark tinted panels.

### Don't

- Do not use generic agency polish.
- Do not use bloated SaaS landing-page patterns.
- Do not use vague innovation language.
- Do not use decorative case-study theater.
- Do not make the site feel like a large anonymous consultancy.
- Do not make the terminal identity so loud that clients cannot tell what is delivered.
- Do not use gradient text, thick side-stripe borders, glass cards as decoration, repeated icon cards, or repeated tiny uppercase labels unless the route language truly needs them.
- Do not change URL structure, nav labels, form field names, logo treatment, or legal and credibility copy without explicit approval.
