import path from "node:path";

import type { CollectionConfig } from "payload";

import { authenticated } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    // Uploads are runtime data on a volume, not build inputs to trace.
    staticDir: path.resolve(
      /* turbopackIgnore: true */ process.env.PAYLOAD_UPLOAD_DIR ||
        "storage/media",
    ),
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ],
    imageSizes: [{ name: "thumbnail", width: 480, height: 320, fit: "inside" }],
    adminThumbnail: "thumbnail",
  },
  fields: [
    { name: "alt", label: "Alternative text", type: "text", required: true },
  ],
};
