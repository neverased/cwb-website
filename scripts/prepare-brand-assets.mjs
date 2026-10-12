import { mkdir } from "node:fs/promises";

import sharp from "sharp";

// Lossless crops of the supplied artwork. No recoloring or redrawing.
// Keep both original PNGs in public/ as the source of truth.
const lockup = { left: 230, top: 145, width: 3217, height: 405 };
const mark = { left: 230, top: 170, width: 1179, height: 355 };
await mkdir("public/brand", { recursive: true });
for (const [source, target, region] of [
  ["neg", "logo-on-dark", lockup],
  ["pos", "logo-on-light", lockup],
  ["neg", "mark", mark],
]) {
  await sharp(`public/wbc_logo_alpha_kolor_${source}.png`)
    .extract(region)
    .png()
    .toFile(`public/brand/${target}.png`);
}
