import nodemailer from "nodemailer";

import type { ContactEvaluation } from "@/lib/contact";

const DEFAULT_CONTACT_EMAIL = "mail@wojciechbajer.com";

const cleanLine = (value: string) => value.replace(/[\r\n]/g, " ").trim();

const parseBoolean = (value: string | undefined) => /^(1|true|yes)$/i.test(value ?? "");

const parsePort = (value: string | undefined, secure: boolean) => {
  if (!value) {
    return secure ? 465 : 587;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) ? parsed : secure ? 465 : 587;
};

const getRequiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for contact mail delivery`);
  }

  return value;
};

export const sendContactEmail = async (evaluation: ContactEvaluation) => {
  const secure = parseBoolean(process.env.SMTP_SECURE);
  const host = getRequiredEnv("SMTP_HOST");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const recipient = process.env.CONTACT_RECIPIENT ?? DEFAULT_CONTACT_EMAIL;
  const fromAddress =
    process.env.CONTACT_FROM ?? process.env.SMTP_FROM ?? DEFAULT_CONTACT_EMAIL;
  const safeName = cleanLine(evaluation.fields.name);
  const safeEmail = cleanLine(evaluation.fields.email);
  const safeScope = evaluation.fields.scope
    ? cleanLine(evaluation.fields.scope)
    : "not specified";
  const safeUserAgent = cleanLine(evaluation.user_agent);
  const safeRemoteAddress = cleanLine(evaluation.remote_address);
  const body = [
    "New contact form message from wojciechbajer.com",
    `Name: ${safeName}`,
    `Email: ${safeEmail}`,
    `Scope: ${safeScope}`,
    `Message:\n${evaluation.fields.message}`,
    `Remote address: ${safeRemoteAddress}`,
    `User agent: ${safeUserAgent}`,
  ].join("\n\n");
  const transporter = nodemailer.createTransport({
    host,
    port: parsePort(process.env.SMTP_PORT, secure),
    secure,
    auth:
      user || pass
        ? {
            user,
            pass,
          }
        : undefined,
  });

  await transporter.sendMail({
    to: recipient,
    from: `Wojciech Bajer Website <${fromAddress}>`,
    replyTo: `${safeName} <${safeEmail}>`,
    subject: "[wojciechbajer.com] New contact inquiry",
    text: body,
  });
};
