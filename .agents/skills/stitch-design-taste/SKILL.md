---
name: stitch-design-taste
description: "Write a semantic DESIGN.md for a Google Stitch design request using the chosen brand, layout, type, and interaction rules."
---

# Stitch design specification

Produce a DESIGN.md that describes the requested visual system in natural language supported by precise values. Existing brand and product constraints take precedence over this skill's aesthetic examples. A documentation request does not require a live Stitch connection or new screen generation.

Use the supplied brief, existing tokens, and reference screens. Ask only for material missing choices; do not impose a default font, accent count, asymmetric hero, or mandatory motion. A restrained or static interface is valid.

## Document structure

1. **Purpose and atmosphere:** audience, tasks, density, and chosen visual character.
2. **Color roles:** semantic names, verified color values, and foreground/background relationships.
3. **Typography:** available font families, hierarchy, scale, line length, and locale considerations.
4. **Components:** shape, spacing, states, labels, focus, loading, empty, and error behavior where applicable.
5. **Layout:** grids, max widths, content order, responsive adjustments, and navigation.
6. **Motion:** only chosen interactions, reduced-motion alternatives, and any pause behavior.
7. **Constraints:** actual project requirements and relevant anti-patterns, rather than a copied universal ban list.

Describe why a rule exists. Use the actual project's units and token names with semantic descriptions. Do not claim that 1rem universally equals 14px or that all mobile layouts must collapse to a single column.

If an existing DESIGN.md is in scope, preserve still-valid decisions and update only the requested parts unless replacement is authorized. Treat [the example specification](DESIGN.md) as an illustrative template, not as the target project's identity or factual evidence.

## Working boundaries

The user's brief, existing brand, real content, platform conventions, and repository instructions take precedence over aesthetic examples. Preserve functioning routes, data flows, translations, semantic HTML, keyboard access, visible focus, and responsive behavior within scope.

Use supplied or verified assets and facts. Do not fabricate execution, metrics, prices, dates, contact details, certifications, endorsements, customer logos, or testimonials. Clearly label fictional sample content when a mockup calls for it; never change real values to make a layout look more natural. Check installed dependencies and font availability/licensing before introducing them.

Motion is optional. Respect reduced-motion preferences, keep content usable without animation, provide keyboard/touch equivalents for hover behavior, and avoid decorative loops that obscure status. Check contrast on the actual background; WCAG AA normal text needs 4.5:1, while large text (18pt/24 CSS px, or 14pt/about 18.67 CSS px bold) needs 3:1. Preserve stricter project requirements.

## Completion

Complete the requested artifact or change, then check the affected surface at representative sizes and relevant interaction states. Run focused project checks appropriate to the change. Repeat checks after meaningful fixes or new evidence, not for an arbitrary pass count. Report only checks actually performed and any remaining limitations; do not claim a rendered or generated result without evidence.
