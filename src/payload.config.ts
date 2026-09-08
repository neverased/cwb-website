import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
} from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Media } from "./cms/collections/Media";
import { Posts } from "./cms/collections/Posts";
import { Users } from "./cms/collections/Users";
import { cmsEmail } from "./cms/email";
import { migrations } from "./migrations";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: { titleSuffix: "— CWB CMS" },
  },
  routes: { admin: "/admin", api: "/api/cms" },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || "",
  collections: [Users, Media, Posts],
  email: cmsEmail,
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter(
        ({ key }) => !["heading", "link", "relationship"].includes(key),
      ),
      HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
      LinkFeature({ enabledCollections: ["posts"] }),
      FixedToolbarFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      connectionTimeoutMillis: 5000,
    },
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
    prodMigrations: migrations,
  }),
  sharp,
  upload: { limits: { fileSize: 10 * 1024 * 1024 } },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  graphQL: { disable: true },
});
