---
name: "Wojciech Bajer Consulting"
description: "Signal: a personal technical consulting practice, with graphite surfaces, mint signals and purposeful motion."
colors:
  page-background: "#0b0f10"
  page-background-soft: "#101617"
  page-foreground: "#edf2ef"
  surface-panel: "#111819"
  surface-panel-strong: "#192223"
  surface-ink: "#080c0d"
  accent-mint: "#a3e8be"
  accent-hover: "#c0f3d3"
  action-ink: "#102017"
  accent-command: "#c9dfa5"
  accent-warning: "#f4b394"
  text-muted: "#a8b5b0"
  text-subtle: "#8c9d96"
  border-mint: "#293633"
  rule-soft: "#26322f"
  rule-strong: "#566e61"
  logo-light: "#e8ede8"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(3.5rem, 6.4vw, 6.5rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.065em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(2.25rem, 4.2vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(1.2rem, 2vw, 1.65rem)"
    fontWeight: 500
    lineHeight: 1.3
  display-mobile:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(2.3rem, 10.7vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.06
  title-output:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(1.7rem, 2.65vw, 2.35rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.045em"
  title-output-mobile:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.15
  title-process:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(1.2rem, 1.8vw, 1.55rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  title-compact:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  lead:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1.125rem"
    lineHeight: 1.75
  lead-mobile:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.75
  supporting:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "0.9375rem"
    lineHeight: 1.75
  small:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.6
  compact:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "0.8125rem"
    lineHeight: 1.55
  step-label:
    fontFamily: "Fira Code, ui-monospace, monospace"
    fontSize: "0.72rem"
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Fira Code, ui-monospace, monospace"
    fontSize: "0.75rem"
    lineHeight: 1.6
    letterSpacing: "0.08em"
  metadata:
    fontFamily: "Fira Code, ui-monospace, monospace"
    fontSize: "0.6875rem"
    lineHeight: 1.6
rounded:
  control: "0.2rem"
  field: "0.25rem"
  portrait: "0.4rem"
  panel: "0.5rem"
  lanyard-clip-edge: "0.15rem"
  lanyard-clip: "0.65rem"
  lanyard-card: "0.9rem"
spacing:
  section-gap: "clamp(4rem, 7vw, 7rem)"
  page-x: "clamp(1.25rem, 6.6vw, 6rem)"
  mobile-x: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.accent-mint}"
    textColor: "{colors.action-ink}"
    typography: "{typography.small}"
    rounded: "{rounded.control}"
    padding: "0.8rem 1.2rem"
    height: "3rem"
  button-secondary:
    textColor: "{colors.page-foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.control}"
    padding: "0.8rem 1.2rem"
    height: "3rem"
  input:
    backgroundColor: "{colors.surface-panel}"
    textColor: "{colors.page-foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0.7rem 0.85rem"
    height: "48px"
  navigation:
    textColor: "{colors.text-muted}"
    typography: "{typography.small}"
    height: "44px"
  service-panel:
    backgroundColor: "{colors.surface-panel}"
    textColor: "{colors.page-foreground}"
    padding: "clamp(1.25rem, 2.7vw, 2.25rem) clamp(1.25rem, 3vw, 2.5rem) 0"
  service-choice:
    textColor: "{colors.page-foreground}"
    typography: "{typography.title}"
    padding: "1.25rem 1.2rem 1.25rem 0"
    height: "7.5rem"
  process-stage:
    textColor: "{colors.page-foreground}"
    typography: "{typography.title-process}"
---

# Design System: Wojciech Bajer Consulting

## Overview

**Creative North Star: "Signal"**

Approved on 9 October 2026 from the local interactive Signal study. This replaces the historical boot/HUD styling description; older specs remain historical context. PRODUCT.md continues to define the business, audiences and truthful content requirements.

Wojciech is the visible, accountable specialist. Preserve graphite, muted mint, Space Grotesk hierarchy, Fira Code metadata, the `wb_` mark and the real portrait. The interface communicates technical precision through thin connections, clear outcomes and deliberate timing. Body copy speaks to founders and product teams in plain language.

Use the `wb_` lockup in the site header and the CWB artwork on the physical ID card. Do not repeat the old blue logo in the same hero. Existing source assets and quote/document branding remain available and unchanged.

Public content uses a maximum 1536px outer shell with fluid horizontal padding. Homepage section gaps are 4–7rem on desktop and 3.5rem on phone. The composition alternates the large personal introduction, quiet proof, one decision interface and an ordered process.

**Key Characteristics:**
- A visible, accountable specialist with a real portrait and direct contact.
- Graphite surfaces, muted mint connections and thin structural rules.
- Space Grotesk hierarchy with Fira Code reserved for short metadata.
- One service decision interface and a process that ends in useful artifacts.
- Finite motion, static fallbacks and native navigation.

## Colors

The palette carries technical precision through quiet graphite surfaces and restrained mint signals. Normative color values are in the frontmatter; preserve authentic asset colors.

### Primary
- **Mint Signal** (#a3e8be): selected choices, primary actions, focus and signal arrival.
- **Mint Hover** (#c0f3d3): a lighter interaction state for the primary action.

### Secondary
- **Command Accent** (#c9dfa5): existing supporting accents, used sparingly.
- **Warm Warning** (#f4b394): validation and failure feedback, never decorative urgency.

### Neutral
- **Graphite** (#0b0f10): the page background and darker ink surface.
- **Panel Graphite** (#111819, #192223): tonal separation for panels and their stronger state.
- **Foreground** (#edf2ef): headings and essential copy.
- **Muted and Subtle Text** (#a8b5b0, #8c9d96): descriptive text and short metadata.
- **Structural Rules** (#26322f, #566e61): quiet borders and stronger boundaries between meaningful controls.
- **Logo Light** (#e8ede8): a shared surface for original dark partner marks.

The base is graphite #0b0f10. Panels step up to #111819 or #192223. Mint #a3e8be marks selection, action and a signal arriving at its outcome. Use quiet 1px rules and occasional small corner markers. Controls are almost square with a 0.2rem radius. Large decorative glass pills, thick neon outlines and unrelated purple gradients are outside this direction.

Logo surfaces must preserve each original mark's contrast and proportions. Group compatible logos on shared dark or light surfaces rather than alternating nine separate high-contrast tiles. Optical sizing may vary by mark. Do not invent monochrome variants or scope-of-work claims.

**The Authentic Mark Rule.** Original artwork, partner logos and credibility marks retain their colors and proportions; never invent monochrome variants to match the interface.

## Typography

**Display Font:** Space Grotesk (with sans-serif fallback)
**Body Font:** Space Grotesk (with sans-serif fallback)
**Label/Mono Font:** Fira Code (with ui-monospace, monospace fallback)

**Character:** Large, readable personal statements lead the composition. Mono supplies short technical context without making the visitor decode a terminal.

### Hierarchy

- **Display** (400, `clamp(3.5rem, 6.4vw, 6.5rem)`, line-height 1.06): the personal hero statement.
- **Headline** (500, `clamp(2.25rem, 4.2vw, 4rem)`, line-height 1.08): major section claims.
- **Title** (500, `clamp(1.2rem, 2vw, 1.65rem)`, line-height 1.3): service choice and supporting hierarchy; dedicated output/process variants live in the frontmatter.
- **Body** (400, `1rem`, line-height 1.6–1.75): readable descriptive copy, normally bounded to 40–60ch.
- **Label** (400, `0.75rem`, line-height 1.6): short mono labels; smaller metadata never carries the essential message.

The hero uses two clear lines, with the second in mint. Desktop display scales up to 6.5rem; mobile uses a fluid 2.3–4.5rem range, preserving readable complete words. Section titles use 2.25–4rem. Panel titles may use 1.7–2.35rem; process and supporting headings use 1.2–1.65rem. These component-specific fluid sizes are intentional, not arbitrary replacements for the display hierarchy.

Body text is normally 1rem with 1.6–1.75 line height. Hero description uses 1.125rem (1.0625rem on phone). Supporting copy may use 0.875–0.9375rem. Mono is reserved for short labels (0.72–0.75rem), coordinates of the interface such as service IDs, and short secondary metadata (0.6875rem). Do not reproduce the tiny captions from the study as essential product copy. Existing long-form Notes remain a reading surface.

The frontmatter records recurring component roles rather than every historical size. The service output has its own desktop fluid title and 1.875rem phone title; process stages use the title-process role and a 1.4rem compact title. Phone service descriptions and specialty choices use 0.8125rem, while normal supporting copy uses 0.875rem or 0.9375rem. Existing subpage and long-form typography remains valid in its own reading context; a future typographic migration should be deliberate, not a mechanical response to a detector.

**The Readable Outcome Rule.** Essential copy is visible immediately; animation never controls access to the words. Preserve complete words on narrow phones and keep body lines bounded.

## Elevation

The public interface is flat at rest. Depth comes from tonal surfaces, thin rules and a restrained pointer spotlight on the active service panel. The spotlight exists only for a precise pointer with motion enabled; keyboard focus uses a clear mint border.

The physical Lanyard is an intentional exception: a rounded identity card, metal clip, material highlights and a bounded physical shadow. Its 0.9rem card and 0.65rem clip radii match the established object, not general UI panels. Original artwork, partner logos and credibility marks keep their authentic colors.

### Shadow Vocabulary
- **Physical card shadow** (`0 22px 35px -18px #0009`): limited to the portrait card fallback, matching the physical Lanyard object.
- **Process marker ring** (`0 0 0 1px var(--accent-mint)`): a thin structural edge around an actual process node, not elevation.

**The Object Boundary Rule.** Physical material effects belong to the Lanyard. Do not spread its rounded card shape or cast shadow to ordinary service panels.

## Components

- **Hero:** large two-line statement, plain-language introduction, direct contact action, expertise anchor, real Lanyard. Main content is in the initial HTML.
- **Service explorer:** one module with three needs: review, build, and ongoing direction. All six specialties remain selectable. The selected `?service=` determines the group, result, and exact contact URL. Browser history, modified clicks and no-JavaScript links remain meaningful.
- **Signal path:** connects a chosen need to its result. It is decorative and does not carry exclusive information. The active choice also has text, border and `aria-current` feedback.
- **Process:** four ordered steps, with a horizontal trace on desktop and a vertical one on mobile. Step numbers identify an actual sequence. Service choice numbers identify their corresponding output; neither is a default decorative section marker.
- **Collaboration evidence:** retain the accurate label “Selected collaborations”. Add case studies only with verified scope, materials and results. No invented metrics or project screenshots.
- **Contact:** clear direct email plus the existing protected form. Preserve selected service, input names, validation, recovery and anti-spam behavior.
- **Navigation:** simple horizontal header with a named operator and direct contact action. Responsive native details menu supports keyboard, Escape, outside click and no JS. Do not rename collaborations to “Work” until actual case studies exist.
- **Credibility and private quotes:** keep factual claims, legal content, certificate links and private-client behavior unchanged.

### Buttons and fields

Primary actions use a solid mint fill, dark text, a quiet 0.2rem corner and stable 48px minimum height. Secondary buttons keep a transparent graphite surface and a stronger rule. Arrows may move 2–3px inside the fixed target. Keyboard focus is a 2px mint outline with offset.

Existing contact inputs remain 48px high, with a 0.25rem field radius, 1px stronger rule, panel background and 1rem input text. Keep native validation, visible placeholders, warning borders and disabled states. Existing profile portrait geometry may use the 0.4rem portrait radius; it is not the general control radius.

### Motion contract

One coherent motion language: context, connection, outcome. Existing React Bits Lanyard supplies the physical signature. Small reveals and transitions use native CSS/Web Animations; no second 3D engine or animation runtime is required.

- Hero line entrances: finite 600ms transform/opacity with short offsets, using cubic-bezier(0.22, 1, 0.36, 1).
- Selection feedback: about 180–260ms; signal travel may finish around 600ms without delaying usable content.
- Reveals: use only at major headings and the final invitation, observe once and disconnect. All copy is visible by default and remains present when JavaScript fails.
- Process: each signal segment advances once when its step appears. No scrolling capture, fake progress or timed content gates.
- Buttons: 2–3px internal arrow movement, stable click targets, visible focus. Keyboard and touch users get equivalent functionality.
- The public motion toggle persists an explicit pause for the tab session and honors live `prefers-reduced-motion`. Storage failures cannot prevent pausing. Pausing resolves reveals to visible content and unmounts the optional Lanyard renderer.
- Card pause remains an independent preference. Global resume must not undo a deliberate local card pause. Static portrait, keyboard flip, GPU cleanup and offscreen/hidden-document suspension remain in place.
- Do not add endless background sweeps, text scrambling, pointer replacement, a boot screen, or a second dominant shader.

### Responsive and verification requirements

Use a single-column hero below 900px and a 340px Lanyard stage on narrow phones. Preserve the real portrait proportions; do not distort the texture. At narrow widths the service choices precede the result, and the process is a normal vertical list. All important controls meet a 44px target and have visible keyboard focus.

Before delivery verify 320/390/768/1024/1440px, initial and live reduced motion, global/local pause interaction, no-JavaScript content and routes, query/deep links, Back/Forward, service-to-contact selection and Lanyard fallback. Check semantic headings, contrast and real rendering, then lint, typecheck, relevant regressions and the standalone build. Physical-device performance remains a separate claim requiring measurement.

## Do's and Don'ts

### Do:
- **Do** preserve graphite, muted mint, the wb_ mark, the real portrait and the accountable operator.
- **Do** state outcomes in plain language before technical detail.
- **Do** keep direct email visible and preserve the protected form's routes and recovery.
- **Do** retain original partner marks and add case studies only with verified scope, materials and results.
- **Do** treat process numbers as a real ordered sequence, not decorative section markers.
- **Do** make motion finite, honor live reduced motion and resolve paused reveals to readable content.
- **Do** verify keyboard access, no-JavaScript content, mobile layouts and real rendering before delivery.

### Don't:
- **Don't** use generic agency polish, bloated SaaS landing-page patterns, vague innovation language or decorative case-study theater.
- **Don't** make portfolio design feel more interested in presentation than problem solving.
- **Don't** make the site feel like a large anonymous consultancy or bury the operator behind abstract company language.
- **Don't** use costume hacking copy that obscures the service offer, or jargon-first copy that a non-technical buyer has to decode.
- **Don't** use AI-consultancy hype language such as revolutionize, unlock, supercharge or 10x.
- **Don't** add decorative glass pills, thick neon outlines, unrelated purple gradients or invented performance claims.
- **Don't** add endless background sweeps, text scrambling, pointer replacement, a boot screen or a second dominant shader.
- **Don't** change legal claims, credibility links or private-client behavior as a visual side effect.
