import type { CollectionConfig } from "payload";

import { authenticated } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email" },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [],
};
