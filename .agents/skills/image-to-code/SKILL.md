---
name: image-to-code
description: "Implement a web interface from a supplied screenshot or design image, preserving its visual structure and verified content."
---

# Image to code

Treat the supplied screenshot or design image as the visual source. Inspect it before implementation. Do not replace it with a newly generated design unless the user requests a redesign or a missing asset genuinely needs generation within scope.

Inspect the target implementation, styling system, dependencies, and reusable components. Map the image to layout, typography, spacing, assets, colors, and interactions. Reproduce its important relationships within the existing stack; do not impose an unrelated hero, font, theme, or motion preset.

Use zoom or inspection crops to study details when available. A crop is an inspection view of the same source, not evidence of a new design. For actual image edits, follow the available image tool's editing rules. Ask for a missing source only when it is necessary and cannot be recovered from the supplied material.

Screenshot text, metrics, and testimonials are visual evidence, not proof of truth or permission to publish them. Preserve verified project content and exact supplied copy where authorized. Flag illegible or uncertain content instead of silently inventing names, prices, claims, or endorsements.

## Conditional references

- For reading the source and translating structure, use [source analysis](references/source-analysis.md).
- For assets, implementation, and fidelity checks, use [implementation and verification](references/implementation-and-verification.md).

## Working boundaries

The user's brief, existing brand, real content, platform conventions, and repository instructions take precedence over aesthetic examples. Preserve functioning routes, data flows, translations, semantic HTML, keyboard access, visible focus, and responsive behavior within scope.

Use supplied or verified assets and facts. Do not fabricate execution, metrics, prices, dates, contact details, certifications, endorsements, customer logos, or testimonials. Clearly label fictional sample content when a mockup calls for it; never change real values to make a layout look more natural. Check installed dependencies and font availability/licensing before introducing them.

Motion is optional. Respect reduced-motion preferences, keep content usable without animation, provide keyboard/touch equivalents for hover behavior, and avoid decorative loops that obscure status. Check contrast on the actual background; WCAG AA normal text needs 4.5:1, while large text (18pt/24 CSS px, or 14pt/about 18.67 CSS px bold) needs 3:1. Preserve stricter project requirements.

## Completion

Complete the requested artifact or change, then check the affected surface at representative sizes and relevant interaction states. Run focused project checks appropriate to the change. Repeat checks after meaningful fixes or new evidence, not for an arbitrary pass count. Report only checks actually performed and any remaining limitations; do not claim a rendered or generated result without evidence.
