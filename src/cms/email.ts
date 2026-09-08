import nodemailer from "nodemailer";
import type { EmailAdapter } from "payload";

export const cmsEmail: EmailAdapter = () => ({
  name: "cwb-smtp",
  defaultFromAddress: process.env.CONTACT_FROM || "mail@wojciechbajer.com",
  defaultFromName: "CWB CMS",
  sendEmail: async (message) => {
    if (!process.env.SMTP_HOST)
      throw new Error("Configure SMTP_HOST to send CMS password reset emails.");
    const secure = process.env.SMTP_SECURE === "true";
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || (secure ? 465 : 587)),
      secure,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
    return transport.sendMail(message);
  },
});
