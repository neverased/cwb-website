import type SMTPTransport from "nodemailer/lib/smtp-transport";

export const smtpTransportOptions = (): SMTPTransport.Options => {
  const host = process.env.SMTP_HOST;
  if (!host) throw new Error("SMTP_HOST is required for mail delivery");
  const secureValue = (process.env.SMTP_SECURE ?? "false").trim().toLowerCase();
  if (!["", "0", "false", "no", "1", "true", "yes"].includes(secureValue)) {
    throw new Error("SMTP_SECURE must be a boolean");
  }
  const secure = ["1", "true", "yes"].includes(secureValue);
  const portValue = process.env.SMTP_PORT || String(secure ? 465 : 587);
  const port = Number(portValue);
  if (
    !/^\d+$/.test(portValue) ||
    !Number.isSafeInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error("SMTP_PORT must be a valid port");
  }
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  return {
    host,
    port,
    secure,
    requireTLS: !secure,
    tls: { rejectUnauthorized: true },
    auth: user || pass ? { user, pass } : undefined,
  };
};
