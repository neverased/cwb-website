---
name: "Wojciech Bajer Consulting"
description: "A terminal-grade brand system for a one-person IT services practice."
colors:
  page-background: "#020807"
  page-background-soft: "#041111"
  panel-top: "#0a1211"
  panel-bottom: "#050b0b"
  foreground: "#f4fff8"
  foreground-strong: "#f6fff8"
  text-muted: "#d6ece1c7"
  mint-signal: "#8ddfba"
  mint-active: "#7effc6"
  lime-command: "#d9ff8c"
  mint-border: "#7effcb1f"
  white-sheen: "#ffffff08"
  warm-warning: "#ffaa78"
  credibility-red: "#e14545"
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
    fontSize: "0.76rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  input: "1rem"
  module: "1.2rem"
  card: "1.5rem"
  panel: "1.75rem"
  pill: "999px"
spacing:
  xs: "0.45rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.35rem"
  xl: "2.2rem"
  page-bottom: "4.5rem"
components:
  button-primary:
    backgroundColor: "{colors.white-sheen}"
    textColor: "{colors.foreground-strong}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.15rem"
    height: "3.2rem"
  button-secondary:
    backgroundColor: "{colors.white-sheen}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.15rem"
    height: "3.2rem"
  nav-pill-active:
    backgroundColor: "{colors.mint-border}"
    textColor: "{colors.foreground-strong}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.7rem"
  terminal-input:
    backgroundColor: "{colors.panel-bottom}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.input}"
    padding: "0.85rem 0.95rem"
    height: "3.2rem"
  terminal-card:
    backgroundColor: "{colors.panel-bottom}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.card}"
    padding: "1.35rem"
---

# Design System: Wojciech Bajer Consulting

## 1. Overview

**Creative North Star: "Signal Control Room"**

This system should feel like a live diagnostic surface for a one-person technical operator: dark, concentrated, direct, and built around signal quality. The interface is a brand surface, but it behaves like a working instrument panel. It shows capability, routing, process, and contact without pretending to be a large anonymous agency.

The current identity is terminal-grade: near-black teal depth, mint linework, acid-lime command accents, dense mono labels, and controlled scanning motion. Improvements should preserve that identity while making each screen easier to read, route, and trust. Visual drama is allowed when it reinforces diagnosis, evidence, or controlled execution.

The system explicitly rejects generic agency polish, bloated SaaS landing-page patterns, vague innovation language, decorative case-study theater, and portfolio design that feels more interested in presentation than problem solving.

**Key Characteristics:**
- Dark teal-black operating surface with mint diagnostic linework.
- Mono-forward body voice with Space Grotesk reserved for large display moments.
- Dense but orderly modules, with direct routes and evidence-bearing panels.
- Motion that reads as scanning, loading, or routing, not decoration.
- One-person accountability: direct labels, direct contact, no corporate abstraction.

## 2. Colors

The palette is a restrained control-room palette: black-green depth carries most of the surface, mint defines system state, and acid lime is reserved for command output.

### Primary
- **Control-Room Black:** Use `page-background` for the body and full-page base. It is the default environmental color and should stay dominant.
- **Deep Runtime Teal:** Use `page-background-soft`, `panel-top`, and `panel-bottom` for page gradients, cards, console modules, and input surfaces.
- **Mint Signal:** Use `mint-signal` and `mint-active` for labels, borders, caret color, focus rings, and active diagnostic states.

### Secondary
- **Lime Command:** Use `lime-command` for command prompts, chevrons, selected output, and small high-signal details. It should never compete with primary calls to action.
- **Credibility Red:** Use `credibility-red` only where the RZETELNA brand mark or credibility artifact needs its own emphasis.

### Neutral
- **Terminal Ink:** Use `foreground` and `foreground-strong` for headings, buttons, active nav, and high-contrast copy.
- **Muted Phosphor:** Use `text-muted` for descriptive body copy and explanatory helper text.
- **Mint Wire:** Use `mint-border` for 1px structural borders, dividers, and chip outlines.
- **White Sheen:** Use `white-sheen` for light panel overlays and inactive filled surfaces.

### Named Rules

**The Mint Wire Rule.** Mint borders stay thin and structural. Use 1px strokes, glow rings, and subtle overlays; do not use thick side stripes as decoration.

**The Command Accent Rule.** Lime is for system output and command emphasis. Keep it rare enough that a visitor can instantly identify it as an active signal.

**The Black Surface Rule.** Do not drift into generic navy, purple SaaS gradients, or beige editorial restraint. The brand lives in black-green runtime space.

## 3. Typography

**Display Font:** Space Grotesk, with Fira Code and monospace fallback.
**Body Font:** Fira Code, with system monospace fallbacks.
**Label/Mono Font:** Fira Code, shared with body.

**Character:** The pairing is technical and mechanical without becoming anonymous. Space Grotesk gives the big claims width and presence; Fira Code keeps the rest of the site in an operator voice.

### Hierarchy

- **Display** (400, `clamp(2.5rem, 5vw, 4.8rem)`, `0.98`): Use for route H1s and large strategic statements. Keep max line length tight, usually 10-11ch.
- **Headline** (400, `clamp(1.9rem, 3vw, 3.1rem)`, `1.02`): Use for section-level claims and signature panels.
- **Title** (400, `1.1rem`, `1.45`): Use for module titles, active focus labels, and compact card headings.
- **Body** (400, `1rem`, `1.75`): Use for explanatory copy. Keep normal prose around 60-70ch; tighter module copy may sit at 40-52ch.
- **Label** (400, `0.70rem-0.76rem`, `0.14em-0.22em`, uppercase): Use for route labels, panel labels, nav, chips, form labels, and command metadata.

### Named Rules

**The Operator Voice Rule.** Mono is legitimate here because the brand is technical and diagnostic. Use it for the working surface, but reserve Space Grotesk for decisive hierarchy so the site does not become a costume terminal.

**The Tight Display Rule.** Display letter spacing stops at `-0.04em`. Do not tighten further; the current brand already uses the maximum safe compression.

## 4. Elevation

Depth is a hybrid of tonal layering, glass-like blur, scanline overlays, and soft ambient shadow. Cards and panels are not flat, but the shadow should feel like monitor depth, not paper elevation. The dominant shell pattern uses a mint border, a black-green vertical gradient, an inset white hairline, a soft black shadow, and `backdrop-filter: blur(18px)`.

### Shadow Vocabulary

- **Panel Depth** (`inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 1.5rem 3rem rgba(0, 0, 0, 0.24)`): Use on major cards, header, contact panels, credibility panels, and command decks.
- **Terminal Depth** (`inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 2rem 5rem rgba(0, 0, 0, 0.35)`): Use only for the boot terminal and high-density console modules.
- **Focus Ring** (`0 0 0 1px rgba(126, 255, 203, 0.16)`): Use for focused inputs and small active elements.
- **Signal Glow** (`0 0 1rem rgba(217, 255, 140, 0.55)` or softer): Use for active markers and lime command dots.

### Named Rules

**The Instrument Panel Rule.** Shadows must support layered instrumentation. If an element looks like a floating SaaS card, reduce the shadow or replace it with a border, scanline, or tonal shift.

**The Blur With Purpose Rule.** Backdrop blur belongs on terminal panels and sticky chrome. Do not introduce decorative glass panels where no system layer is being implied.

## 5. Components

### Buttons

- **Shape:** Full-pill command controls (`999px`) with a minimum height around `3.1rem-3.25rem`.
- **Primary:** Mint-to-lime translucent gradient over dark surface, `1px` mint border, foreground text, uppercase mono label, and padding around `0.85rem 1.15rem`.
- **Hover / Focus:** Hover lifts by `translateY(-2px)` and shifts border or background intensity. Focus should use a visible mint ring, not only color.
- **Secondary / Ghost:** Transparent or white-sheen fill with low-contrast border. Use for route navigation and secondary actions only.

### Chips

- **Style:** Pill chips with `1px` mint borders, translucent white or mint background, uppercase mono text, and compact padding.
- **State:** Active chips increase mint background and foreground contrast. Inactive chips stay quiet enough to read as metadata.

### Cards / Containers

- **Corner Style:** Standard cards use a confident radius (`1.5rem`); smaller internal modules use `1rem-1.2rem`; hero boot panels may use `1.75rem`.
- **Background:** Black-green panel gradients with low-opacity radial mint accents and scanline overlays.
- **Shadow Strategy:** Use Panel Depth. Avoid stacking multiple framed cards inside another framed card unless the inner module has a real interactive or diagnostic role.
- **Border:** `1px` mint border at low alpha is the default structural edge.
- **Internal Padding:** Standard card padding is `1.35rem`; dense modules use `0.95rem-1.1rem`; hero/boot panels use fluid padding up to `2.2rem`.

### Inputs / Fields

- **Style:** Dark terminal fields with `1rem` radius, `1px` mint border, Fira Code text, and a mint caret.
- **Focus:** Remove default outline and replace it with stronger mint border plus the Focus Ring shadow.
- **Error / Disabled:** Error states use warm-warning border and tinted background. Disabled or unavailable states must still provide a direct email route.

### Navigation

- **Style:** Sticky pill header on desktop, stacked rounded panel on mobile. The brand lockup uses a route prompt above the uppercase name. Nav links use compact uppercase mono labels with pill active state.
- **States:** Hover lifts or brightens text. Active nav uses a mint translucent fill and foreground-strong text.
- **Mobile:** Header becomes static, vertical, and left-aligned at `760px` and below.

### Signature Component: Terminal Loader

The boot loader is a controlled brand entrance, not a loading spinner. It uses a large terminal panel, status chips, a progress track, blinking cursor, and scanline overlays. It should always have a skip route and reduced-motion fallback.

### Signature Component: Credibility Panel

The credibility panel combines a document-like proof point with the terminal system. Keep the RZETELNA accent red intact, but do not let it define the broader palette.

## 6. Do's and Don'ts

### Do:

- **Do** preserve the terminal-grade identity: black-green surfaces, mint wire borders, lime command accents, and operator-style labels.
- **Do** connect technical choices to business value in copy and hierarchy.
- **Do** keep direct contact and direct accountability visible because the one-person operator model is part of the trust signal.
- **Do** use real partner marks and credibility proof as evidence-bearing visual elements.
- **Do** keep reduced-motion fallbacks for boot, scramble, sweep, pulse, and scan animations.
- **Do** verify contrast whenever muted phosphor text sits on dark tinted panels.

### Don't:

- **Don't** use generic agency polish.
- **Don't** use bloated SaaS landing-page patterns.
- **Don't** use vague innovation language.
- **Don't** use decorative case-study theater.
- **Don't** make the portfolio design feel more interested in presentation than problem solving.
- **Don't** make the site feel like a large anonymous consultancy.
- **Don't** use thick colored side-stripe borders, gradient text, or repeated decorative card grids.
- **Don't** turn every section label into a repeated tiny uppercase eyebrow pattern unless it is serving the terminal route language already present in the site.
