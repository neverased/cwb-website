---
name: design-taste-frontend-v1
description: "Use the legacy high-variance frontend aesthetic when explicitly selected; retain its design dials with current factual and accessibility safeguards."
---

# Legacy frontend taste preset

This is the legacy aesthetic option. Use it when explicitly selected or required by a project's design brief. Its defaults express a style, not exact backward compatibility with unsafe or obsolete workflow instructions.

## Design dials

- `DESIGN_VARIANCE`: 8 by default, from 1 (predictable symmetry) to 10 (expressive asymmetry).
- `MOTION_INTENSITY`: 6 by default, from 1 (static) to 10 (cinematic).
- `VISUAL_DENSITY`: 4 by default, from 1 (gallery spacing) to 10 (compact data display).

Adapt all three to the brief, existing brand, device, and accessibility needs. Use `DESIGN_VARIANCE` consistently for layout choices. A high value suggests varied alignment or image scale, but does not forbid a centered heading. A higher motion value permits purposeful choreography, not mandatory infinite loops.

## Legacy visual vocabulary

Consider asymmetric grids, a restrained accent, precise sans-serif typography, selective glass highlights, and generous grouping. For dense data, use aligned rows, tabular or monospaced numbers, and strong hierarchy. Preserve an existing font, palette, card pattern, or serif when the brief calls for it.

A bento can use consistent radii, subtle borders, clear labels, and small illustrative interactions. Choose the components that communicate actual product behavior. Do not force five animated cards or simulated activity into every dashboard.

## Engineering safeguards

Check package.json, installed library versions, and the styling setup before importing dependencies. Match Tailwind v3/v4 syntax and integration. Respect existing React/Next.js architecture; put browser state and effects in Client Components and keep providers at appropriate boundaries.

Use local state where sufficient. Keep animation properties owned by one engine and clean up effects. Favor transform and opacity for frequent movement, avoid excessive blur, and inspect mobile reading order and overflow. Do not invent missing imports or claim dependencies are installed without evidence.

## Working boundaries

The user's brief, existing brand, real content, platform conventions, and repository instructions take precedence over aesthetic examples. Preserve functioning routes, data flows, translations, semantic HTML, keyboard access, visible focus, and responsive behavior within scope.

Use supplied or verified assets and facts. Do not fabricate execution, metrics, prices, dates, contact details, certifications, endorsements, customer logos, or testimonials. Clearly label fictional sample content when a mockup calls for it; never change real values to make a layout look more natural. Check installed dependencies and font availability/licensing before introducing them.

Motion is optional. Respect reduced-motion preferences, keep content usable without animation, provide keyboard/touch equivalents for hover behavior, and avoid decorative loops that obscure status. Check contrast on the actual background; WCAG AA normal text needs 4.5:1, while large text (18pt/24 CSS px, or 14pt/about 18.67 CSS px bold) needs 3:1. Preserve stricter project requirements.

## Completion

Complete the requested artifact or change, then check the affected surface at representative sizes and relevant interaction states. Run focused project checks appropriate to the change. Repeat checks after meaningful fixes or new evidence, not for an arbitrary pass count. Report only checks actually performed and any remaining limitations; do not claim a rendered or generated result without evidence.
