# Platforms and flows

Start from the requested platform and primary task. Keep platform-specific navigation, form behavior, status bars, and system controls coherent. Use current project conventions where an app already exists; do not replace them with a generic phone mockup.

## Screen layout

- Respect the device's top and bottom safe areas, camera cutout, home indicator, and navigation chrome. Avoid placing essential controls beneath them.
- Use a readable type hierarchy and comfortably sized controls. Do not make body text tiny to fit extra cards into one image.
- Keep navigation and the primary action clear. Use tab bars, back navigation, sheets, or drawers according to platform and task.
- If an input state is in scope, consider the keyboard and how content or actions remain visible above it.
- Show only relevant onboarding steps, loading, empty, error, or success states. A concept of one screen does not require a complete onboarding sequence.

## Flow continuity

For a requested multi-screen flow, define the shared palette, type scale, spacing, icon style, navigation position, and component treatment once. Preserve names and data consistently across steps. Distinguish sample content from real user or product facts.

Give each screen a clear purpose and a plausible next or back action. Do not add screens just to increase the pack. Keep the same selected device family and scale across comparable mockups; vary only when demonstrating an explicitly requested platform or device difference.

Device frames can provide context, but the app content remains the deliverable. Flat screenshots are often clearer for implementation handoff. Do not require a particular device model when it conflicts with the platform brief.
