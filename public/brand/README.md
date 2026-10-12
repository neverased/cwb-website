# Original brand artwork

These assets are lossless crops of `public/wbc_logo_alpha_kolor_neg.png`
and `public/wbc_logo_alpha_kolor_pos.png`. Their colors and shapes are unchanged.

- `logo-on-dark.png`: full lockup with cyan lettering, 3217 × 405.
- `logo-on-light.png`: full lockup with navy lettering for print, 3217 × 405.
- `mark.png`: the original symbol, 1179 × 355.

Regenerate the crops and favicon from the repository root:

```sh
node scripts/prepare-brand-assets.mjs
node scripts/prepare-brand-icons.mjs
```

The shared `BrandLogo` component chooses the compact mark for mobile headers
and the positive full logo for printing. Metadata images and PDFs embed local
artwork, without depending on a running web server.

The lanyard SVGs embed these PNGs as data URLs to work as standalone WebGL
textures. If the source artwork changes, update the embedded copies as well.
Keep the authentic portrait intact.
