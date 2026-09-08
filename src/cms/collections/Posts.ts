import type { CollectionConfig } from "payload";

import { authenticated, publishedOrAuthenticated } from "../access";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Post", plural: "Posts" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "publishedAt", "updatedAt"],
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    readVersions: authenticated,
  },
  versions: { drafts: true, maxPerDoc: 50 },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (data && !data.slug && !originalDoc?.slug && data.title) {
          data.slug = slugify(data.title);
        }
        return data;
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data._status === "published" && !data.publishedAt) {
          data.publishedAt =
            originalDoc?.publishedAt || new Date().toISOString();
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true, maxLength: 160 },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      maxLength: 180,
      admin: {
        description:
          "URL under /notes/. Generated from the title when left empty on creation.",
      },
      validate: (value: string | null | undefined) =>
        Boolean(value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
        "Use lowercase letters, numbers and hyphens.",
    },
    { name: "excerpt", type: "textarea", required: true, maxLength: 320 },
    { name: "coverImage", type: "upload", relationTo: "media" },
    { name: "content", type: "richText", required: true },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        description:
          "Set on first publication. This is a display date, not a publication schedule.",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
  ],
};
