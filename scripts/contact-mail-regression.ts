import assert from "node:assert/strict";
import { createServer, type Socket } from "node:net";

import { cmsEmail } from "../src/cms/email";
import { sendContactEmail } from "../src/lib/contact_mail";

const evaluation = {
  classification: "accept" as const,
  reasons: [],
  spam_score: 0,
  fields: {
    name: "Test Sender",
    email: "sender@example.test",
    scope: "architecture",
    message: "A test inquiry.",
  },
  remote_address: "127.0.0.1",
  user_agent: "mail-regression",
  quarantine_path: null,
};

const main = async () => {
  const sockets = new Set<Socket>();
  const commands: string[] = [];
  const server = createServer((socket) => {
    sockets.add(socket);
    socket.once("close", () => sockets.delete(socket));
    socket.write("220 localhost test SMTP\r\n");
    let buffer = "";
    let receivingData = false;
    socket.on("data", (chunk) => {
      buffer += String(chunk);
      while (buffer.includes("\r\n")) {
        const end = buffer.indexOf("\r\n");
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        if (receivingData) {
          if (line === ".") {
            receivingData = false;
            socket.write("250 stored locally\r\n");
          }
          continue;
        }
        const command = line.split(" ", 1)[0];
        commands.push(command);
        if (command === "EHLO" || command === "HELO")
          socket.write("250-localhost\r\n250 AUTH PLAIN\r\n");
        else if (command === "STARTTLS")
          socket.write("502 TLS unavailable\r\n");
        else if (command === "AUTH") socket.write("235 authenticated\r\n");
        else if (command === "DATA") {
          receivingData = true;
          socket.write("354 send message\r\n");
        } else if (command === "QUIT") socket.end("221 bye\r\n");
        else socket.write("250 OK\r\n");
      }
    });
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  process.env.SMTP_HOST = "127.0.0.1";
  process.env.SMTP_PORT = String(address.port);
  process.env.SMTP_SECURE = "false";
  process.env.SMTP_USER = "test-only";
  process.env.SMTP_PASSWORD = "test-only";
  process.env.CONTACT_RECIPIENT = "recipient@example.test";
  try {
    for (const [name, send] of [
      ["contact", () => sendContactEmail(evaluation)],
      [
        "CMS",
        () =>
          cmsEmail({ payload: undefined as never }).sendEmail({
            to: "recipient@example.test",
            subject: "Test",
            text: "Reset fixture",
          }),
      ],
    ] as const) {
      commands.length = 0;
      await assert.rejects(
        send,
        `${name} mail must reject an SMTP peer without TLS`,
      );
      assert.ok(commands.includes("EHLO"));
      assert.ok(commands.includes("STARTTLS"));
      assert.ok(
        !commands.includes("AUTH") &&
          !commands.includes("MAIL") &&
          !commands.includes("DATA"),
        "Credentials and message data must never be sent before TLS",
      );
      console.log(
        `PASS: ${name} rejects plaintext SMTP before authentication or message data`,
      );
    }
  } finally {
    for (const socket of sockets) socket.destroy();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
