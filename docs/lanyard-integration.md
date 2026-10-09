# Home page portrait lanyard

The home page hero presents Wojciech's portrait on a draggable, reversible ID
card. The service explorer now sits alongside the introduction to the services
section; its query-string selection and contact links are unchanged.

The subsequent [Signal redesign](design/2026-10-09-signal.md) adds the shared
Motion control and a taller desktop composition, with a 340px stage on narrow
phones. Global pause honors the device preference and preserves the card's
independent local pause. The historical verification below covers the original
Lanyard integration; the linked report covers its redesigned surroundings.

## Source and assets

- Adapted from [React Bits Lanyard](https://reactbits.dev/components/lanyard),
  [revision 3329f3bde763a37a2a89b24598e9f50fa0d4de3d](https://github.com/DavidHDev/react-bits/blob/3329f3bde763a37a2a89b24598e9f50fa0d4de3d/src/ts-default/Components/Lanyard/Lanyard.tsx).
- The upstream [license](licenses/react-bits.md) is retained.
- `src/components/lanyard/lanyard.tsx` retains the upstream Three.js geometry,
  material and physics implementation. Local changes use CSS Modules, readiness
  and failure callbacks, keyboard flipping, toggle state, and explicit suspension
  when the document or component is hidden.
- `public/lanyard/wojciech-bajer.svg` contains the supplied `Profile_pic_wb.jpg`
  unchanged as an embedded JPEG, with a branded header and nameplate. The photo
  is neither generated nor retouched. The same asset serves the canvas texture
  and the static fallback. `reverse.svg` and `strap.svg` carry the reverse-side
  artwork and strap print. No remote textures, models, or image services are used.

## Behavior and performance

- Three.js loads in a separate chunk when the figure enters the viewport and
  motion is enabled. Reduced-motion visitors receive the static card by default.
- Drag to move, click to flip, or focus the canvas and press Enter/Space to flip.
  Pause removes the canvas; Animate restores it. The profile link remains an
  ordinary, keyboard-accessible link.
- The static portrait remains visible during loading, without JavaScript, on
  failed imports or unavailable/lost WebGL. A texture failure also restores the
  fallback; if the portrait asset itself is unavailable, its alternative text
  still identifies the person. Rendering stops after the
  physical motion settles, while offscreen, and when the document is hidden.
- Cleanup releases GPU resources, observers, event handlers and animation frames.

## Local verification, 2026-10-09

- `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm exec tsc --noEmit`,
  `pnpm test:seo` (4 tests), and `pnpm build` passed.
- Browser checks passed for pointer drag, Enter/Space flipping, pause/resume,
  service selection/contact routing, live reduced-motion changes, context loss,
  no-JavaScript and unavailable-WebGL fallback. No uncaught JavaScript errors
  occurred during the normal interaction checks.
- No horizontal overflow at 320, 390, 768, 1024 or 1440 px. Desktop and mobile
  captures were visually inspected. Reduced-motion requests do not download
  Three.js; Next development mode still downloads its small async-loader stub.
- The local standalone production build also passed desktop rendering, emulated
  mobile touch-tap/drag, and reduced-motion checks without JavaScript errors.
  Its deferred Three.js chunk transferred 150,004 compressed bytes.
- The build reports existing `metadataBase` and macOS duplicate libvips warnings.
  The lockfile keeps the pre-existing Sharp resolutions; unrelated dependency
  cleanup is outside this change. CMS/database and production deployment were
  not exercised.

## Scoped design audit

`impeccable detect` on the changed UI files produced 21 advisory findings and
zero blocking findings. No detector rules or values were suppressed.

| Dimension | Score | Evidence / limit |
| --- | --- | --- |
| Accessibility | 3/4 | Keyboard flip, visible focus, named controls, portrait alternative and reduced motion checked; no formal assistive-technology audit |
| Performance | 3/4 | Deferred Three.js, idle/offscreen suspension and cleanup; physical devices were not profiled |
| Responsive design | 4/4 | 320–1440 px, no horizontal overflow, controls at least 44 px high |
| Theming | 3/4 | Uses current page tokens; artwork and physical materials intentionally contain fixed colors |
| Implementation integrity | 4/4 | Requested React Bits behavior, original portrait, retained service navigation and fallbacks |

The implementation is consistent with the current rendered site. The advisory
findings were reviewed as follows:

- The initial new border-color literals were replaced with existing CSS tokens.
- Fifteen font-size advisories are on unchanged home-page rules. `DESIGN.md`
  describes an older palette, typography and component treatment than the
  current `globals.css` and page. They are baseline documentation drift, not
  regressions from adding the lanyard. The design document was not rewritten.
- The 0.65 rem clip radius and 0.9 rem fallback-card radius model the physical
  object requested by the user. Applying generic panel rules to them is a false
  positive. They intentionally match the rounded Three.js card and hardware.
- The new 0.85 rem profile link and 0.25 rem control radius follow current site
  links/buttons. Their mismatch with the old design document is intentional.
- The gold and graphite values belong to unselected upstream material presets.
  This integration selects silver; the unused alternatives do not affect the
  site's color palette. These are false positives for this rendered surface.
