# Motion and surfaces

Load this reference only when animation, glass, texture, or cinematic media is part of the chosen direction.

Motion should communicate state, spatial relationships, or narrative. A static surface is valid. Choose CSS for simple state transitions; use an installed motion library when the interaction warrants it. Use one owner for each animated property and clean up subscriptions, timers, observers, and GSAP contexts when components unmount.

## Optional techniques

- A brief opacity/transform transition can clarify entry or state change. Keep essential content available if JavaScript fails and disable unnecessary movement for reduced-motion users.
- Sticky media or stacked cards can support a story. Preserve reading order, keyboard reachability, touch behavior, and an ordinary scrolling alternative. Avoid scroll hijacking.
- A gallery can use drag, arrows, or native scrolling. Ensure controls are discoverable without hover; provide alternatives to dragging when needed.
- Shared-element or layout transitions can explain a changed arrangement. Do not require every list to stagger or every active component to animate continuously.
- A liquid-glass treatment can combine a translucent surface, inner highlight, and restrained blur. Check contrast over the actual background and provide an opaque fallback when needed.

Favor transform and opacity for frequent animation, limit expensive blur/filters, and profile effects that stutter. Use will-change sparingly. Decorative grain should not capture pointer events or obscure text; choose placement based on actual compositing cost instead of forcing a full-screen overlay.

For looping or auto-moving content, consider pause controls, reduced-motion alternatives, and whether it distracts from the primary task. Never animate a status indicator to imply activity or live data that does not exist. Avoid persistent motion when a single state transition conveys the same meaning.
