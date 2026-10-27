import assert from "node:assert/strict";
import { execFile, execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer, type Socket } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { createSecureContext, createServer as createTlsServer, TLSSocket } from "node:tls";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { cmsEmail } from "../src/cms/email";
import { sendContactEmail } from "../src/lib/contact_mail";

const send = (adapter: string) => adapter === "contact"
  ? sendContactEmail({
      classification: "accept", reasons: [], spam_score: 0,
      fields: { name: "Test Sender", email: "sender@example.test", scope: "architecture", message: "A test inquiry." },
      remote_address: "127.0.0.1", user_agent: "mail-regression", quarantine_path: null,
    })
  : cmsEmail({ payload: undefined as never }).sendEmail({
      to: "recipient@example.test", subject: "Test", text: "Reset fixture",
    });

type Mode = "starttls" | "implicit";
const smtpFixture = async (mode: Mode, key: Buffer, cert: Buffer) => {
  const sockets = new Set<Socket>();
  const commands: Array<{ name: string; encrypted: boolean }> = [];
  let deliveries = 0;
  const attach = (socket: Socket, encrypted: boolean, greet = true) => {
    sockets.add(socket);
    socket.on("error", () => {});
    socket.once("close", () => sockets.delete(socket));
    if (greet) socket.write("220 localhost test SMTP\r\n");
    let buffer = "";
    let receivingData = false;
    const onData = (chunk: Buffer) => {
      buffer += String(chunk);
      while (buffer.includes("\r\n")) {
        const end = buffer.indexOf("\r\n");
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        if (receivingData) {
          if (line === ".") {
            receivingData = false;
            deliveries++;
            socket.write("250 stored locally\r\n");
          }
          continue;
        }
        const command = line.split(" ", 1)[0];
        commands.push({ name: command, encrypted });
        if (command === "EHLO" || command === "HELO") {
          socket.write(`250-localhost\r\n${mode === "starttls" && !encrypted ? "250-STARTTLS\r\n" : ""}250 AUTH PLAIN\r\n`);
        } else if (command === "STARTTLS" && mode === "starttls" && !encrypted) {
          socket.removeListener("data", onData);
          socket.write("220 Ready for TLS\r\n");
          const upgraded = new TLSSocket(socket, { isServer: true, secureContext: createSecureContext({ key, cert }) });
          sockets.add(upgraded);
          upgraded.on("error", () => {});
          upgraded.once("close", () => sockets.delete(upgraded));
          upgraded.once("secure", () => attach(upgraded, true, false));
          return;
        } else if (command === "AUTH") socket.write("235 authenticated\r\n");
        else if (command === "DATA") { receivingData = true; socket.write("354 send message\r\n"); }
        else if (command === "QUIT") socket.end("221 bye\r\n");
        else socket.write("250 OK\r\n");
      }
    };
    socket.on("data", onData);
  };
  const server = mode === "implicit"
    ? createTlsServer({ key, cert }, (socket) => attach(socket, true))
    : createServer((socket) => attach(socket, false));
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  return {
    port: address.port, commands, delivered: () => deliveries,
    close: async () => {
      for (const socket of sockets) socket.destroy();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
};

const main = async () => {
  if (process.argv[2] === "send") {
    await send(process.argv[3]);
    return;
  }
  const directory = await mkdtemp(path.join(tmpdir(), "cwb-mail-tls-regression-"));
  const keyPath = path.join(directory, "key.pem");
  const certPath = path.join(directory, "cert.pem");
  try {
    execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1",
      "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost,IP:127.0.0.1",
      "-keyout", keyPath, "-out", certPath], { stdio: "ignore", timeout: 10_000 });
    const key = await readFile(keyPath);
    const cert = await readFile(certPath);
    const runSender = (adapter: string, port: number, secure: string, trusted: boolean) =>
      promisify(execFile)(process.execPath,
        ["--import", "tsx", fileURLToPath(import.meta.url), "send", adapter], {
          timeout: 8000,
          env: { ...process.env, SMTP_HOST: "127.0.0.1", SMTP_PORT: String(port), SMTP_SECURE: secure,
            SMTP_USER: "test-only", SMTP_PASSWORD: "test-only", CONTACT_RECIPIENT: "recipient@example.test",
            CONTACT_FROM: "sender@example.test", NODE_EXTRA_CA_CERTS: trusted ? certPath : "" },
        });
    for (const adapter of ["contact", "CMS"]) {
      for (const [mode, secure] of [["starttls", "false"], ["implicit", "true"], ["implicit", "1"], ["implicit", "yes"]] as const) {
        const fixture = await smtpFixture(mode, key, cert);
        try {
          await runSender(adapter, fixture.port, secure, true);
          assert.equal(fixture.delivered(), 1);
          assert.ok(fixture.commands.some((command) => command.name === "AUTH" && command.encrypted));
          assert.ok(!fixture.commands.some((command) => ["AUTH", "MAIL", "DATA"].includes(command.name) && !command.encrypted));
        } finally { await fixture.close(); }
        console.log(`PASS: ${adapter} ${mode} (${secure}) delivers only after verified TLS`);
      }
      for (const mode of ["starttls", "implicit"] as const) {
        const fixture = await smtpFixture(mode, key, cert);
        try {
          await assert.rejects(runSender(adapter, fixture.port, mode === "implicit" ? "true" : "false", false),
            `${adapter} must reject an untrusted SMTP certificate`);
          assert.equal(fixture.delivered(), 0);
          assert.ok(!fixture.commands.some((command) => ["AUTH", "MAIL", "DATA"].includes(command.name)));
        } finally { await fixture.close(); }
      }
      console.log(`PASS: ${adapter} rejects untrusted certificates for STARTTLS and implicit TLS`);
    }
  } finally { await rm(directory, { recursive: true, force: true }); }
};

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
