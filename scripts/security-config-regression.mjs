import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";

test("browser evidence uses a pinned child process in a read-only agent", async () => {
  const source = await readFile(
    ".codex/agents/04-quality-security/browser-debugger.toml",
    "utf8",
  );
  const result = spawnSync(
    "python3",
    [
      "-c",
      "import json,sys,tomllib; print(json.dumps(tomllib.loads(sys.stdin.read())))",
    ],
    { input: source, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  const config = JSON.parse(result.stdout);
  assert.equal(config.sandbox_mode, "read-only");
  const server = config.mcp_servers.chrome_devtools;
  assert.equal(
    server.url,
    undefined,
    "A process on port 3000 cannot become the tool authority",
  );
  assert.equal(server.command, "npx");
  assert.ok(
    server.args.some((arg) => /^chrome-devtools-mcp@\d+\.\d+\.\d+$/.test(arg)),
  );
  assert.ok(server.args.includes("--isolated"));
});

function compose(files = ["docker-compose.yml"], extraEnv = {}) {
  const result = spawnSync(
    "docker",
    [
      "--context",
      process.env.SECURITY_TEST_DOCKER_CONTEXT ?? "desktop-linux",
      "compose",
      "--env-file",
      "/dev/null",
      ...files.flatMap((file) => ["-f", file]),
      "config",
      "--format",
      "json",
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        POSTGRES_PASSWORD: "disposable-config-test",
        PAYLOAD_SECRET: "disposable-config-test",
        ...extraEnv,
      },
    },
  );
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("third-party actions and container artifacts have immutable identities", async () => {
  for (const name of await readdir(".github/workflows")) {
    if (!/\.ya?ml$/.test(name)) continue;
    const source = await readFile(`.github/workflows/${name}`, "utf8");
    for (const [, reference] of source.matchAll(/\buses:\s*(\S+)/g)) {
      if (reference.startsWith("./")) continue;
      assert.match(
        reference,
        /@[a-f0-9]{40}$/,
        `${name}: ${reference} must use a full commit SHA`,
      );
    }
  }
  const dockerfile = await readFile("Dockerfile", "utf8");
  const frontend = dockerfile.match(/^#\s*syntax=(\S+)/m)?.[1];
  assert.match(
    frontend,
    /@sha256:[a-f0-9]{64}$/,
    "BuildKit frontend must be immutable",
  );
  const stages = new Set();
  for (const [, reference, stage] of dockerfile.matchAll(
    /^FROM\s+(\S+)(?:\s+AS\s+(\S+))?/gim,
  )) {
    if (!stages.has(reference) && reference !== "scratch") {
      assert.match(
        reference,
        /@sha256:[a-f0-9]{64}$/,
        `External image ${reference} must be immutable`,
      );
    }
    if (stage) stages.add(stage);
  }
  for (const service of Object.values(compose().services)) {
    if (service.build) continue;
    assert.match(
      service.image,
      /@sha256:[a-f0-9]{64}$/,
      "Third-party Compose images must be immutable",
    );
  }
});

test("HTTP application ports stay on loopback even with legacy LAN settings", () => {
  const config = compose(undefined, {
    WEB_BIND_ADDRESS: "0.0.0.0",
    WEB_PORT: "3100",
  });
  assert.equal(config.services.web.ports.length, 1);
  assert.equal(config.services.web.ports[0].host_ip, "127.0.0.1");
  assert.equal(
    config.services.web.ports[0].published,
    "3100",
    "Local CMS/CI port override remains supported",
  );
});

test("remote proxy traffic requires verified TLS and the application has no LAN HTTP listener", async () => {
  const config = compose(["docker-compose.yml", "docker-compose.tls.yml"], {
    BACKEND_TLS_BIND_ADDRESS: "192.0.2.10",
    BACKEND_TLS_CERT_DIR: "/tmp/cwb-config-test-certificates",
  });
  const web = config.services.web;
  assert.ok(
    web.ports.every(
      (port) => port.host_ip === "127.0.0.1" || port.target === 3443,
    ),
  );
  assert.ok(
    web.ports.some(
      (port) => port.host_ip === "192.0.2.10" && port.target === 3443,
    ),
  );
  const tls = config.services["backend-tls"];
  assert.equal(
    tls.network_mode,
    "service:web",
    "Plaintext stays in the application network namespace",
  );
  assert.match(tls.image, /^traefik:v\d+\.\d+\.\d+@sha256:[a-f0-9]{64}$/);
  const certificates = tls.volumes.find(
    (mount) => mount.target === "/etc/traefik/tls",
  );
  assert.equal(certificates.read_only, true);
  assert.equal(
    certificates.bind.create_host_path,
    false,
    "Missing provisioning must fail closed",
  );
  const traefik = await readFile("deploy/backend-tls/traefik.yml", "utf8");
  assert.match(traefik, /address:\s*["']?:3443["']?/);
  assert.match(traefik, /directory:\s*\/etc\/traefik\/dynamic/);
  const backend = await readFile(
    "deploy/backend-tls/dynamic/backend.yml",
    "utf8",
  );
  assert.match(backend, /clientAuthType:\s*RequireAndVerifyClientCert/);
  assert.match(backend, /sniStrict:\s*true/);
  assert.match(backend, /minVersion:\s*VersionTLS12/);
  assert.match(
    backend,
    /caFiles:\s*\n\s*- \/etc\/traefik\/tls\/client-ca\.crt/,
  );
  assert.match(backend, /url:\s*["']?http:\/\/127\.0\.0\.1:3000/);
  const forward = await readFile("cwb-website-forward.yml", "utf8");
  const servers = [...forward.matchAll(/url:\s*["']?(https?:\/\/[^"'\s]+)/g)];
  assert.ok(servers.length > 0);
  assert.ok(servers.every(([, url]) => new URL(url).protocol === "https:"));
  assert.match(forward, /serversTransport:\s+cwb-website-backend-tls/);
  assert.match(forward, /insecureSkipVerify:\s+false/);
  assert.match(forward, /rootCAs:/);
  assert.match(forward, /certificates:/);
  assert.match(forward, /serverName:\s+cwb-website-backend/);
});
