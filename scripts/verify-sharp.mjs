import assert from "node:assert/strict";

import sharp from "sharp";

// Run inside the standalone image so host dependencies cannot hide missing files.
const { data, info } = await sharp({
  create: {
    width: 2,
    height: 2,
    channels: 3,
    background: "#ffffff",
  },
})
  .resize(1, 1)
  .png()
  .toBuffer({ resolveWithObject: true });

assert.equal(info.width, 1);
assert.equal(info.height, 1);
assert.equal(info.format, "png");
assert(data.length > 0);
console.log("PASS: standalone sharp loads and processes an image");
