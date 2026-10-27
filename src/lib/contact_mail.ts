import nodemailer from "nodemailer";

import type { ContactEvaluation } from "@/lib/contact";
import { smtpTransportOptions } from "@/lib/smtp";

const DEFAULT_CONTACT_EMAIL = "mail@wojciechbajer.com";

const cleanLine = (value: string) => value.replace(/[\r\n]/g, " ").trim();

export const sendContactEmail = async (evaluation: ContactEvaluation) => {
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
  const transporter = nodemailer.createTransport(smtpTransportOptions());

  await transporter.sendMail({
    to: recipient,
    from: `Wojciech Bajer Website <${fromAddress}>`,
    replyTo: `${safeName} <${safeEmail}>`,
    subject: "[wojciechbajer.com] New contact inquiry",
    text: body,
  });
};
