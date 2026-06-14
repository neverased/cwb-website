---
name: "Wojciech Bajer Consulting"
description: "A terminal-grade brand system for a one-person technical consulting and delivery practice."
colors:
  page-background: "#020807"
  page-background-soft: "#041111"
  surface-panel: "#06100f"
  surface-panel-strong: "#0a1513"
  surface-ink: "#010504"
  foreground: "#f4fff8"
  foreground-strong: "#f6fff8"
  text-muted: "#e2f7eddb"
  text-subtle: "#d6ece1b8"
  accent-mint: "#7effc6"
  accent-mint-soft: "#8ddfba"
  accent-command: "#d9ff8c"
  accent-warning: "#ffaa78"
  credibility-accent: "#d9ff8c"
  mint-border: "#7effcb"
  white-sheen: "#ffffff08"
  mac-red: "#ff5f57"
  mac-amber: "#febc2e"
  mac-green: "#28c840"
typography:
  display:
    fontFamily: "Space Grotesk, Fira Code, monospace"
    fontSize: "clamp(3rem, 5.4vw, 4.95rem)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "0"
  headline:
    fontFamily: "Space Grotesk, Fira Code, monospace"
    fontSize: "2.65rem"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "0"
  title:
    fontFamily: "Fira Code, ui-monospace, Menlo, Monaco, monospace"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
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
    letterSpacing: "0"
rounded:
  chip: "0.12rem"
  nav: "0.16rem"
  panel: "0.35rem"
spacing:
  xs: "0.45rem"
  sm: "0.6rem"
  md: "0.85rem"
  lg: "1rem"
  xl: "1.35rem"
  notch: "0.9rem"
  section-gap: "clamp(4.5rem, 8vw, 8rem)"
  page-x: "clamp(1rem, 3vw, 1.75rem)"
  page-bottom: "5.5rem"
components:
  button-primary:
    backgroundColor: "#7effc624"
    textColor: "{colors.foreground-strong}"
    rounded: "{rounded.chip}"
    padding: "0.9rem 1.15rem"
    height: "3.25rem"
  button-secondary:
    backgroundColor: "{colors.white-sheen}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.chip}"
    padding: "0.9rem 1.15rem"
    height: "3.25rem"
  nav-link-active:
    backgroundColor: "#7effc61a"
    textColor: "{colors.foreground-strong}"
    rounded: "{rounded.nav}"
    padding: "0.46rem 0.72rem"
  terminal-input:
    backgroundColor: "{colors.surface-ink}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.chip}"
    padding: "0.85rem 0.95rem"
    height: "3.2rem"
  terminal-panel:
    backgroundColor: "{colors.surface-panel}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.panel}"
    padding: "1.35rem"
  focus-tab:
    backgroundColor: "{colors.white-sheen}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.chip}"
    padding: "0.55rem 0.7rem"
---

# Design System: Wojciech Bajer Consulting

## 1. Overview

**Creative North Star: "Signal Control Room"**

This is a working diagnostic surface for a one-person technical operator, not an agency brochure. It runs on near-black teal depth, mint structural linework, and acid-lime command output, with Space Grotesk carrying decisive hierarchy over a Fira Code operator voice. The interface is allowed to read as technical because the service is technical, but the terminal identity exists to organize the client's decision, not to obscure it. Every surface should feel concentrated, controlled, and useful: a control panel a client can read at a glance.

The signature structural move is the **chamfered notch**: panels, cards, buttons, inputs, and nav links are cut with a `clip-path` polygon at the top-right and bottom-left, sitting on a near-sharp `0.35rem` base radius. This is the brand's fingerprint. It is deliberately not soft, rounded, or pill-shaped. Depth is carried by dark vertical gradients, 1px low-alpha mint borders, inset hairlines, faint corner grid ticks, and scanlines, never by large drop shadows.

This system explicitly rejects generic agency polish, bloated SaaS landing-page patterns, vague innovation language, decorative case-study theater, and the anonymous-consultancy posture. It also rejects the warm-paper editorial AI default and the navy-and-gold fintech default: the brand lives only in black-green runtime space. Mono is justified here because the operator is literally technical; it is identity, not costume.

**Key Characteristics:**
- Black-green operating surface (`#020807`) with mint diagnostic linework.
- Chamfered-notch geometry on every panel, card, and control (not rounded, not pill).
- Mono-forward voice (Fira Code) with Space Grotesk for client-facing hierarchy.
- Flat by default: depth from gradient, hairline border, and notch, not shadow.
- Motion that reads as booting, scanning, routing, verifying, or output, with reduced-motion fallbacks.
- Direct accountability: operator name, direct email, no abstract company language.

## 2. Colors

A control-room palette: black-green depth carries the page, mint defines structure and system state, lime marks active command output and the RZETELNA proof word, and warm orange flags failure only.

### Primary
- **Control-Room Black** (`#020807`): the page base and full-viewport boot atmosphere. The whole site sits on this near-black teal.
- **Runtime Teal** (`#041111`, `#06100f`, `#0a1513`, `#010504`): page-soft background, panel surfaces, strong panel surfaces, and the deepest input/ink wells. Used as vertical gradients inside panels and cards.
- **Mint Signal** (`#7effc6`, soft `#8ddfba`): active labels, structural borders, focus rings, carets, route markers, progress bar, and the boot cursor. The defining accent.

### Secondary
- **Lime Command** (`#d9ff8c`): terminal prompts (`$`), command output, route-prompt accents, and the flat `RZETELNA` wordmark in the credibility panel. High-signal; keep it rare.
- **Warm Warning** (`#ffaa78`): failed, invalid, or unavailable form states only.

### Tertiary
- **Window Control dots** (`#ff5f57`, `#febc2e`, `#28c840`): only on the boot Terminal Loader's window chrome. Not reused elsewhere as decoration.

### Neutral
- **Terminal Ink** (`#f4fff8`, strong `#f6fff8`): headings, primary copy, button labels, active nav.
- **Muted Phosphor** (`#e2f7eddb` ≈ rgba(226,247,237,0.86); subtle `#d6ece1b8` ≈ rgba(214,236,225,0.72)): descriptive body copy on dark panels. Verified above 4.5:1 on the teal surfaces.
- **Mint Wire** (`#7effcb` at 0.08-0.34 alpha): structural borders, dividers, chips, scanlines, corner brackets, hairline rules.
- **White Sheen** (`#ffffff08` to `#ffffff14`): subtle panel overlays and secondary-button fills.

### Named Rules
**The Black Surface Rule.** The brand lives in black-green runtime space. Do not drift into navy SaaS, purple gradients, warm-paper editorial restraint, or generic dark-tech grey. If the background reads as anything but near-black teal, it is off-brand.

**The Mint Wire Rule.** Mint is structural and thin. 1px strokes, corner brackets, focus rings, scanlines, faint inset hairlines. Never a thick colored side-stripe, never a glow-heavy neon.

**The Command Accent Rule.** Lime (`#d9ff8c`) marks active output, command intent, and the single `RZETELNA` word in the credibility panel. Flat color only; no glow. It guides the eye to the live thing; it does not decorate every component.

**The Credibility Containment Rule.** The lime `RZETELNA` accent and its panel corner brackets stay inside the credibility panel. Do not reuse that treatment on client logos, CTAs, or status elsewhere.

## 3. Typography

**Display Font:** Space Grotesk (with Fira Code, monospace fallback)
**Body / Label Font:** Fira Code (with ui-monospace, Menlo, Monaco fallback)

**Character:** A deliberately technical pairing. Space Grotesk gives the largest statements width and business legibility so the page reads as a client-facing surface; Fira Code keeps the working body, labels, and terminal output in an operator voice. One display family, one mono family, no third typeface.

### Hierarchy
- **Display** (400, `clamp(3rem, 5.4vw, 4.95rem)`, line-height 0.96, tracking 0): the homepage hero H1 and route H1s. Scrambled in on reveal. Capped under 5rem so it states, not shouts.
- **Headline** (400, `2.65rem`, line-height 1.06, tracking 0): major section claims. Drops to ~2.25rem at mobile.
- **Title** (400, `1.1rem`-`1.35rem`, line-height 1.4): route cards, capability/process cards, panel headings.
- **Body** (400, `1rem`-`1.08rem`, line-height 1.75): descriptive prose. Hold copy to roughly 60-70ch (`max-width: 64ch` on hero, `66ch` on section descriptions).
- **Label** (400, `0.7rem`-`0.74rem`, uppercase, tracking 0): route prompts, metadata, form labels, command status, card kickers.

### Named Rules
**The Operator Voice Rule.** Mono is allowed because the brand is a technical operator. Use Space Grotesk for hierarchy so the page reads as a business surface, not a terminal costume.

**The Plain-Tracking Label Rule.** Labels are uppercase mono at `letter-spacing: 0`, not wide-tracked eyebrows. Do not reintroduce `0.18em` tracked kickers above every section; that is the AI-scaffold tell this system avoids.

**The Clear Client Rule.** Technical labels can stay, but the copy around them must state business value in plain language (risk reduced, delivery cleaner, handoff durable).

## 4. Elevation

This system is flat by default. There are no large drop shadows. Depth is built from four flat materials layered together: a dark vertical gradient inside each panel (`linear-gradient(180deg, rgba(7,18,16,0.98), rgba(1,6,5,0.98))`), a 1px low-alpha mint border, an inset bottom hairline (`inset 0 -1px 0 rgba(126,255,203,0.08)`), and the `clip-path` notch that physically cuts the corner. Faint corner grid ticks and scanlines add texture without lift.

### Shadow Vocabulary
- **Inset hairline** (`box-shadow: inset 0 -1px 0 rgba(126,255,203,0.08)`): the only resting "shadow"; a mint underglint at the panel's bottom edge.
- **Focus ring** (`box-shadow: 0 0 0 1px rgba(126,255,203,0.16)` plus `outline: 2px solid rgba(126,255,203,0.72)`): state feedback on inputs and interactive elements, not elevation.

### Named Rules
**The Flat-Runtime Rule.** Surfaces are flat at rest. If you reach for a soft wide drop shadow (blur ≥ 16px) on a card or button, you are off-system. Use the gradient, the border, and the notch instead.

**The Lift-Is-Motion Rule.** Interactive lift is a 2px upward `translateY` on hover, not a shadow bloom. The element moves; it does not float.

## 5. Components

### Buttons
- **Shape:** chamfered notch, near-sharp (`border-radius: 0.12rem` plus `clip-path` cutting the top-right and bottom-left corners ~0.6rem). Never pill, never `≥0.5rem` rounded.
- **Primary:** flat mint-translucent fill (`rgba(126,255,203,0.14)`), 1px mint border (`rgba(126,255,203,0.38)`), ink-strong label (`#f6fff8`), inset hairline, padding `0.9rem 1.15rem`, min-height `3.25rem`. Not a gradient.
- **Secondary:** white-sheen fill (`rgba(255,255,255,0.03)`), quiet 1px border, muted-ink label.
- **Hover / Focus:** `translateY(-2px)` on hover; mint focus ring plus 2px mint outline on `:focus-visible`. Reduced-motion disables the transition.
- **Labels:** verb + object describing the action (`Send project brief`, `Review services`, `Send inquiry`, `View certificate`).

### Inputs / Fields
- **Style:** full-width, min-height `3.2rem`, dark layered fill (`linear-gradient(180deg, rgba(11,22,20,0.92), rgba(4,11,10,0.98))`), 1px mint border at 0.12 alpha, `0.12rem` radius, mint caret (`#7effc6`). Label sits above the input (uppercase mono, `#8ddfba`).
- **Placeholder:** `rgba(198,225,211,0.72)`, kept above 4.5:1; never used as a label.
- **Focus:** border lifts to mint 0.36 plus a 1px mint ring; no glow.
- **Disabled:** `opacity: 0.58`, `not-allowed` cursor (used while the contact bootstrap loads).

### Navigation
- **Style:** sticky pill-row header on desktop inside a notched topbar; brand lockup carries a `cwb://...` route prompt above the uppercase operator name. Nav links are notched chips (`0.16rem` radius), uppercase mono `0.8rem`.
- **States:** default muted-ink; hover lifts `translateY(-1px)` to ink-strong; active uses a mint-translucent fill (`rgba(126,255,203,0.1)`) plus mint border.
- **Mobile (≤760px):** the header becomes a static stacked panel; nav collapses to a 3-column chip grid. Labels never change.

### Cards / Panels
- **Corner Style:** the signature notch (`clip-path` polygon, `--corner-cut: 0.9rem`) on a `0.35rem` base radius.
- **Background:** dark vertical teal gradient; strong panels go a step lighter (`#0a1513`).
- **Border:** 1px mint at 0.08-0.18 alpha.
- **Depth:** inset bottom hairline only (see Elevation). No nested decorative cards; inner modules must carry a real role (route stage, IO cell, terminal line, contact field, logo surface).
- **Internal padding:** `1.35rem` standard; `clamp(1.4rem, 3vw, 2.2rem)` for feature panels.

### Boot Terminal Loader (signature)
A full-viewport brand entrance, not a loading spinner. Centered notched console (`min(58rem, 100%)` wide, `min(34rem, 100dvh - 5rem)` tall) on the black surface, with window-control dots, a stage label plus percent, a scaling mint progress bar, scramble-typed command lines with tone colors, a blinking caret, scanline overlay, and auto-scroll. It completes reliably, exposes a `skip intro` control, persists completion for the session (`sessionStorage`), and is skipped entirely under reduced motion. Content is never gated behind it.

### Command Deck (signature)
The homepage right-column terminal object after boot. A notched panel with a `cwb://focus` prompt header, problem-type tabs that behave as real controls (visible active fill, border, and text contrast), an active route summary card, and a working terminal viewport whose output reflects the selected focus. It must not overpower the H1; it reads as a useful diagnostic control.

### Scramble Text (signature)
Terminal-grade reveal on the hero and section headings via `use-scramble`. The rendered element always keeps `aria-label` set to the final string, so meaning never depends on animation completing.

### Credibility Panel (signature)
RZETELNA Firma proof, not decoration. The `RZETELNA` word uses flat lime command accent (`#d9ff8c`) with no glow. Certificate link, display URL, and mint corner brackets stay contained to this panel.

### Collaboration Logo Surfaces
Partner marks (Dolby, Polestar, Volvo, DHL, Leroy Merlin, Budimex, TDJ) sit in controlled notched surfaces. Dark, light, and yellow backplates are allowed per mark to protect legibility. The grid reads as proof of real delivery contexts; logos only, no category labels beneath them.

## 6. Do's and Don'ts

### Do:
- **Do** keep the black-green (`#020807`), mint (`#7effc6`), lime (`#d9ff8c`), mono-forward terminal identity.
- **Do** apply the chamfered notch (`clip-path` polygon + `0.12`-`0.35rem` radius) to every panel, card, and control; it is the brand's fingerprint.
- **Do** build depth from gradient + 1px mint border + inset hairline + notch. Flat by default.
- **Do** keep direct email and the operator name visible; the one-person model is a trust signal.
- **Do** translate media, software, architecture, and audit work into clarity, risk reduction, execution, and durable handoff.
- **Do** use selected collaborations and RZETELNA as evidence-bearing proof.
- **Do** ship reduced-motion fallbacks for boot, scan, sweep, pulse, scramble, and scroll reveals.
- **Do** keep body copy above 4.5:1 on the teal panels; bump toward `#f4fff8` if a muted value is borderline.

### Don't:
- **Don't** use generic agency polish, bloated SaaS landing patterns, vague innovation language, or decorative case-study theater.
- **Don't** make the site feel like a large anonymous consultancy or bury the operator behind abstract company language.
- **Don't** let the terminal identity get so loud that clients cannot tell what is delivered.
- **Don't** introduce rounded `≥0.5rem` cards or `999px` pill buttons; the system is sharp + notched, not soft.
- **Don't** use gradient text, glassmorphism as decoration, thick colored side-stripe borders, repeated identical icon cards, or the big-number hero-metric template.
- **Don't** pair a 1px border with a soft wide drop shadow (blur ≥ 16px) on the same element (the ghost-card tell).
- **Don't** add wide-tracked uppercase eyebrows above every section, or numbered `01 / 02 / 03` section markers as default scaffolding.
- **Don't** spread the lime credibility accent or boot window-dot colors into unrelated UI.
- **Don't** use em dashes anywhere in copy; use commas, colons, semicolons, periods, or parentheses.
- **Don't** change URL structure, nav labels, form field names, logo treatment, or legal and credibility copy without explicit approval.
