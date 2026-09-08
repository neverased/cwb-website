import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";

const password = randomBytes(32).toString("hex");
const content = [
  `PAYLOAD_SECRET=${randomBytes(48).toString("hex")}`,
  `POSTGRES_PASSWORD=${password}`,
  `CONTACT_FORM_SECRET=${randomBytes(32).toString("hex")}`,
  "WEB_BIND_ADDRESS=127.0.0.1",
  "WEB_PORT=3000",
  "POSTGRES_PORT=54329",
  `DATABASE_URL=postgres://cwb:${password}@127.0.0.1:54329/cwb`,
  "PAYLOAD_UPLOAD_DIR=storage/media",
  "",
].join("\n");

try {
  await writeFile(new URL("../.env", import.meta.url), content, {
    flag: "wx",
    mode: 0o600,
  });
  console.log(
    "Created .env with random secrets. Start the stack with docker compose up --build -d.",
  );
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.log(
    ".env already exists; existing configuration was preserved. Compare it with .env.example.",
  );
}
