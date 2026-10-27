import nodemailer from "nodemailer";
import type { EmailAdapter } from "payload";

import { smtpTransportOptions } from "@/lib/smtp";

export const cmsEmail: EmailAdapter = () => ({
  name: "cwb-smtp",
  defaultFromAddress: process.env.CONTACT_FROM || "mail@wojciechbajer.com",
  defaultFromName: "CWB CMS",
  sendEmail: async (message) => {
    if (!process.env.SMTP_HOST)
      throw new Error("Configure SMTP_HOST to send CMS password reset emails.");
    const transport = nodemailer.createTransport(smtpTransportOptions());
    return transport.sendMail(message);
  },
});
