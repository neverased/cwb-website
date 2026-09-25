import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_quotes_language" AS ENUM('pl', 'en');
  CREATE TYPE "public"."enum_quotes_currency" AS ENUM('PLN', 'EUR', 'USD', 'GBP');
  CREATE TYPE "public"."enum_quotes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__quotes_v_version_language" AS ENUM('pl', 'en');
  CREATE TYPE "public"."enum__quotes_v_version_currency" AS ENUM('PLN', 'EUR', 'USD', 'GBP');
  CREATE TYPE "public"."enum__quotes_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "quotes_scope" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar
  );

  CREATE TABLE "quotes_timeline" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "description" varchar,
    "duration" varchar
  );

  CREATE TABLE "quotes_packages_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar,
    "description" varchar,
    "quantity" numeric DEFAULT 1,
    "unit" varchar DEFAULT 'usługa',
    "unit_price" numeric,
    "vat_rate" numeric DEFAULT 23
  );

  CREATE TABLE "quotes_packages" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar,
    "description" varchar,
    "recommended" boolean DEFAULT false
  );

  CREATE TABLE "quotes_addons" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar,
    "description" varchar,
    "quantity" numeric DEFAULT 1,
    "unit" varchar DEFAULT 'usługa',
    "unit_price" numeric,
    "vat_rate" numeric DEFAULT 23
  );

  CREATE TABLE "quotes" (
    "id" serial PRIMARY KEY NOT NULL,
    "number" varchar,
    "title" varchar,
    "language" "enum_quotes_language" DEFAULT 'pl',
    "currency" "enum_quotes_currency" DEFAULT 'PLN',
    "issued_at" timestamp(3) with time zone,
    "valid_until" timestamp(3) with time zone,
    "client_name" varchar,
    "client_company" varchar,
    "client_email" varchar,
    "client_details" varchar,
    "issuer_name" varchar DEFAULT 'Wojciech Bajer',
    "issuer_email" varchar,
    "issuer_details" varchar,
    "summary" varchar,
    "assumptions" varchar,
    "exclusions" varchar,
    "payment_terms" varchar,
    "notes" varchar,
    "discount_percent" numeric DEFAULT 0,
    "public_id" varchar,
    "password_hash" varchar,
    "access_enabled" boolean DEFAULT true,
    "access_expires_at" timestamp(3) with time zone,
    "allow_acceptance" boolean DEFAULT false,
    "revision" varchar,
    "acceptance" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_quotes_status" DEFAULT 'draft'
  );

  CREATE TABLE "_quotes_v_version_scope" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_quotes_v_version_timeline" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "description" varchar,
    "duration" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_quotes_v_version_packages_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "description" varchar,
    "quantity" numeric DEFAULT 1,
    "unit" varchar DEFAULT 'usługa',
    "unit_price" numeric,
    "vat_rate" numeric DEFAULT 23,
    "_uuid" varchar
  );

  CREATE TABLE "_quotes_v_version_packages" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "description" varchar,
    "recommended" boolean DEFAULT false,
    "_uuid" varchar
  );

  CREATE TABLE "_quotes_v_version_addons" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "description" varchar,
    "quantity" numeric DEFAULT 1,
    "unit" varchar DEFAULT 'usługa',
    "unit_price" numeric,
    "vat_rate" numeric DEFAULT 23,
    "_uuid" varchar
  );

  CREATE TABLE "_quotes_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_number" varchar,
    "version_title" varchar,
    "version_language" "enum__quotes_v_version_language" DEFAULT 'pl',
    "version_currency" "enum__quotes_v_version_currency" DEFAULT 'PLN',
    "version_issued_at" timestamp(3) with time zone,
    "version_valid_until" timestamp(3) with time zone,
    "version_client_name" varchar,
    "version_client_company" varchar,
    "version_client_email" varchar,
    "version_client_details" varchar,
    "version_issuer_name" varchar DEFAULT 'Wojciech Bajer',
    "version_issuer_email" varchar,
    "version_issuer_details" varchar,
    "version_summary" varchar,
    "version_assumptions" varchar,
    "version_exclusions" varchar,
    "version_payment_terms" varchar,
    "version_notes" varchar,
    "version_discount_percent" numeric DEFAULT 0,
    "version_public_id" varchar,
    "version_password_hash" varchar,
    "version_access_enabled" boolean DEFAULT true,
    "version_access_expires_at" timestamp(3) with time zone,
    "version_allow_acceptance" boolean DEFAULT false,
    "version_revision" varchar,
    "version_acceptance" jsonb,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__quotes_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "quotes_id" integer;
  ALTER TABLE "quotes_scope" ADD CONSTRAINT "quotes_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quotes_timeline" ADD CONSTRAINT "quotes_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quotes_packages_items" ADD CONSTRAINT "quotes_packages_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quotes_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quotes_packages" ADD CONSTRAINT "quotes_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quotes_addons" ADD CONSTRAINT "quotes_addons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quotes_v_version_scope" ADD CONSTRAINT "_quotes_v_version_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quotes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quotes_v_version_timeline" ADD CONSTRAINT "_quotes_v_version_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quotes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quotes_v_version_packages_items" ADD CONSTRAINT "_quotes_v_version_packages_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quotes_v_version_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quotes_v_version_packages" ADD CONSTRAINT "_quotes_v_version_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quotes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quotes_v_version_addons" ADD CONSTRAINT "_quotes_v_version_addons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quotes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quotes_v" ADD CONSTRAINT "_quotes_v_parent_id_quotes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quotes"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "quotes_scope_order_idx" ON "quotes_scope" USING btree ("_order");
  CREATE INDEX "quotes_scope_parent_id_idx" ON "quotes_scope" USING btree ("_parent_id");
  CREATE INDEX "quotes_timeline_order_idx" ON "quotes_timeline" USING btree ("_order");
  CREATE INDEX "quotes_timeline_parent_id_idx" ON "quotes_timeline" USING btree ("_parent_id");
  CREATE INDEX "quotes_packages_items_order_idx" ON "quotes_packages_items" USING btree ("_order");
  CREATE INDEX "quotes_packages_items_parent_id_idx" ON "quotes_packages_items" USING btree ("_parent_id");
  CREATE INDEX "quotes_packages_order_idx" ON "quotes_packages" USING btree ("_order");
  CREATE INDEX "quotes_packages_parent_id_idx" ON "quotes_packages" USING btree ("_parent_id");
  CREATE INDEX "quotes_addons_order_idx" ON "quotes_addons" USING btree ("_order");
  CREATE INDEX "quotes_addons_parent_id_idx" ON "quotes_addons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "quotes_public_id_idx" ON "quotes" USING btree ("public_id");
  CREATE INDEX "quotes_updated_at_idx" ON "quotes" USING btree ("updated_at");
  CREATE INDEX "quotes_created_at_idx" ON "quotes" USING btree ("created_at");
  CREATE INDEX "quotes__status_idx" ON "quotes" USING btree ("_status");
  CREATE INDEX "_quotes_v_version_scope_order_idx" ON "_quotes_v_version_scope" USING btree ("_order");
  CREATE INDEX "_quotes_v_version_scope_parent_id_idx" ON "_quotes_v_version_scope" USING btree ("_parent_id");
  CREATE INDEX "_quotes_v_version_timeline_order_idx" ON "_quotes_v_version_timeline" USING btree ("_order");
  CREATE INDEX "_quotes_v_version_timeline_parent_id_idx" ON "_quotes_v_version_timeline" USING btree ("_parent_id");
  CREATE INDEX "_quotes_v_version_packages_items_order_idx" ON "_quotes_v_version_packages_items" USING btree ("_order");
  CREATE INDEX "_quotes_v_version_packages_items_parent_id_idx" ON "_quotes_v_version_packages_items" USING btree ("_parent_id");
  CREATE INDEX "_quotes_v_version_packages_order_idx" ON "_quotes_v_version_packages" USING btree ("_order");
  CREATE INDEX "_quotes_v_version_packages_parent_id_idx" ON "_quotes_v_version_packages" USING btree ("_parent_id");
  CREATE INDEX "_quotes_v_version_addons_order_idx" ON "_quotes_v_version_addons" USING btree ("_order");
  CREATE INDEX "_quotes_v_version_addons_parent_id_idx" ON "_quotes_v_version_addons" USING btree ("_parent_id");
  CREATE INDEX "_quotes_v_parent_idx" ON "_quotes_v" USING btree ("parent_id");
  CREATE INDEX "_quotes_v_version_version_public_id_idx" ON "_quotes_v" USING btree ("version_public_id");
  CREATE INDEX "_quotes_v_version_version_updated_at_idx" ON "_quotes_v" USING btree ("version_updated_at");
  CREATE INDEX "_quotes_v_version_version_created_at_idx" ON "_quotes_v" USING btree ("version_created_at");
  CREATE INDEX "_quotes_v_version_version__status_idx" ON "_quotes_v" USING btree ("version__status");
  CREATE INDEX "_quotes_v_created_at_idx" ON "_quotes_v" USING btree ("created_at");
  CREATE INDEX "_quotes_v_updated_at_idx" ON "_quotes_v" USING btree ("updated_at");
  CREATE INDEX "_quotes_v_latest_idx" ON "_quotes_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quotes_fk" FOREIGN KEY ("quotes_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_quotes_id_idx" ON "payload_locked_documents_rels" USING btree ("quotes_id");`);
  await db.execute(sql`
    CREATE TABLE quote_rate_limits (
      key text PRIMARY KEY,
      attempts integer NOT NULL,
      reset_at timestamptz NOT NULL
    );
    CREATE FUNCTION protect_accepted_quote() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF OLD.acceptance IS NOT NULL AND (
        NEW.revision IS DISTINCT FROM OLD.revision OR
        NEW.acceptance IS DISTINCT FROM OLD.acceptance
      ) THEN
        RAISE EXCEPTION 'Accepted quote content and acceptance are immutable';
      END IF;
      RETURN NEW;
    END;
    $$;
    CREATE TRIGGER protect_accepted_quote
      BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION protect_accepted_quote();
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TRIGGER IF EXISTS protect_accepted_quote ON quotes;
    DROP FUNCTION IF EXISTS protect_accepted_quote();
    DROP TABLE IF EXISTS quote_rate_limits;
  `);
  await db.execute(sql`
   ALTER TABLE "quotes_scope" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quotes_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quotes_packages_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quotes_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quotes_addons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quotes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_quotes_v_version_scope" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_quotes_v_version_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_quotes_v_version_packages_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_quotes_v_version_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_quotes_v_version_addons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_quotes_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "quotes_scope" CASCADE;
  DROP TABLE "quotes_timeline" CASCADE;
  DROP TABLE "quotes_packages_items" CASCADE;
  DROP TABLE "quotes_packages" CASCADE;
  DROP TABLE "quotes_addons" CASCADE;
  DROP TABLE "quotes" CASCADE;
  DROP TABLE "_quotes_v_version_scope" CASCADE;
  DROP TABLE "_quotes_v_version_timeline" CASCADE;
  DROP TABLE "_quotes_v_version_packages_items" CASCADE;
  DROP TABLE "_quotes_v_version_packages" CASCADE;
  DROP TABLE "_quotes_v_version_addons" CASCADE;
  DROP TABLE "_quotes_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_quotes_fk";

  DROP INDEX "payload_locked_documents_rels_quotes_id_idx";
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "quotes_id";
  DROP TYPE "public"."enum_quotes_language";
  DROP TYPE "public"."enum_quotes_currency";
  DROP TYPE "public"."enum_quotes_status";
  DROP TYPE "public"."enum__quotes_v_version_language";
  DROP TYPE "public"."enum__quotes_v_version_currency";
  DROP TYPE "public"."enum__quotes_v_version_status";`);
}
