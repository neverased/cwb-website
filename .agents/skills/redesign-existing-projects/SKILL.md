---
name: redesign-existing-projects
description: "Audit and improve an existing interface within its current stack, preserving product facts, behavior, and established constraints."
---

# Redesign an existing interface

Inspect the affected surface, implementation, tests, tokens, assets, and neighboring components before changing it. Determine whether the request is a focused refinement or a replacement visual direction. Preserve incumbent choices outside the requested scope.

Prioritize observed problems: unclear hierarchy, poor contrast, crowded layout, broken navigation, missing states, unreadable copy, or inconsistent components. A common font, centered hero, ordinary card grid, or flat background is not a defect by itself.

## Working approach

1. Identify the highest-impact issue and the existing constraints that govern it.
2. Apply focused changes using the project's stack, package manager, styling system, and patterns. Check dependencies and Tailwind version before new imports or syntax.
3. Preserve real copy, names, metrics, prices, dates, contact information, testimonials, and customer logos. Do not replace round numbers or repeated blog dates with invented variation. Use labeled sample data only for requested mock content.
4. Maintain real links and behavior, translations, semantic controls, keyboard access, visible focus, and meaningful image alternatives. Decorative images may use empty alt text.
5. Verify the affected surface and relevant states after a coherent batch of edits. Repeat targeted checks after fixes; do not run tests after every individual styling change.

## Optional improvements

Typography, palette cleanup, spacing, layout, imagery, and interaction feedback can all improve a surface. Choose those tied to the actual issue. Preserve approved brand fonts and colors unless changing them is in scope. Add loading, empty, validation, or error states when the feature needs them.

Motion, glass, parallax, new component libraries, font swaps, and extra legal or marketing pages are not default redesign requirements. Preserve existing legal links and claims; do not invent policies or certifications to complete a visual checklist.

## Working boundaries

The user's brief, existing brand, real content, platform conventions, and repository instructions take precedence over aesthetic examples. Preserve functioning routes, data flows, translations, semantic HTML, keyboard access, visible focus, and responsive behavior within scope.

Use supplied or verified assets and facts. Do not fabricate execution, metrics, prices, dates, contact details, certifications, endorsements, customer logos, or testimonials. Clearly label fictional sample content when a mockup calls for it; never change real values to make a layout look more natural. Check installed dependencies and font availability/licensing before introducing them.

Motion is optional. Respect reduced-motion preferences, keep content usable without animation, provide keyboard/touch equivalents for hover behavior, and avoid decorative loops that obscure status. Check contrast on the actual background; WCAG AA normal text needs 4.5:1, while large text (18pt/24 CSS px, or 14pt/about 18.67 CSS px bold) needs 3:1. Preserve stricter project requirements.

## Completion

Complete the requested artifact or change, then check the affected surface at representative sizes and relevant interaction states. Run focused project checks appropriate to the change. Repeat checks after meaningful fixes or new evidence, not for an arbitrary pass count. Report only checks actually performed and any remaining limitations; do not claim a rendered or generated result without evidence.
