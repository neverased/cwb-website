# Source analysis

Start with the whole image. Identify the page or screen type, primary task, visual hierarchy, grid, dominant media, and the relation between sections. Record only the measurements and decisions needed for faithful implementation.

## What to inspect

- The header, hero, content order, and footer boundaries; recurring column alignments and maximum widths.
- Heading scale, line length, weight, letter spacing, and contrast with body copy. Do not force a fixed headline line count across languages and viewport sizes.
- Section rhythm and density: large pauses at narrative boundaries, tighter spacing within groups.
- Image aspect ratios, subject placement, masks, frames, and intentional cropping. Preserve recognizable source assets rather than substitute generic photos.
- Buttons, form labels, borders, shadows, corner radii, separators, and icon stroke weight. Avoid inventing extra nested frames when the source is flat.
- Real navigation and likely interaction semantics. A still image does not prove how an interaction works; use the existing implementation or brief as behavioral authority.

Inspect a detail view only when the full source is insufficient. No fixed number of section images is required. If multiple images describe the same product, reconcile their shared palette, typography, navigation, and state rather than treating each as a separate redesign.

## Responsive interpretation

When only a desktop image is supplied, infer a mobile layout from reading order, content priority, and project conventions. Collapse columns when space requires it; keep essential content and actions. Preserve intentional scrollable media without hiding unrelated overflow. Use fluid type and widths instead of clipping or shrinking text to fit a screenshot.

Distinguish observed details from inferred adaptations in the handoff when the distinction matters. A generated comp or screenshot is not a pixel-level specification for unseen states.
