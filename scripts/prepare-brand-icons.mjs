import { writeFile } from "node:fs/promises";

import sharp from "sharp";

// Run after prepare-brand-assets.mjs. Preserve the original symbol's ratio/colors.
// PNG-backed ICO entries cover browser tabs and larger shortcut previews.
const entries = [];
for (const size of [16, 32, 48, 256]) {
  const artworkWidth = Math.round(size * 0.82);
  const artwork = await sharp("public/brand/mark.png")
    .resize({ width: artworkWidth })
    .png()
    .toBuffer();
  const png = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#0b0f10",
    },
  })
    .composite([{ input: artwork, gravity: "center" }])
    .png()
    .toBuffer();
  entries.push({ size, png });
}

const header = Buffer.alloc(6 + entries.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(entries.length, 4);
let offset = header.length;
entries.forEach(({ size, png }, index) => {
  const position = 6 + index * 16;
  header.writeUInt8(size === 256 ? 0 : size, position);
  header.writeUInt8(size === 256 ? 0 : size, position + 1);
  header.writeUInt16LE(1, position + 4);
  header.writeUInt16LE(32, position + 6);
  header.writeUInt32LE(png.length, position + 8);
  header.writeUInt32LE(offset, position + 12);
  offset += png.length;
});
await writeFile(
  "src/app/favicon.ico",
  Buffer.concat([header, ...entries.map(({ png }) => png)]),
);
