import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import https from "node:https";
import http from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const context = process.env.SECURITY_TEST_DOCKER_CONTEXT ?? "desktop-linux";
assert.ok(
  ["desktop-linux", "default"].includes(context),
  "TLS tests require Docker Desktop or the explicitly selected local default context",
);

function command(binary, args, options = {}) {
  const result = spawnSync(binary, args, {
    encoding: "utf8",
    timeout: 120_000,
    ...options,
  });
  assert.equal(
    result.status,
    0,
    `${binary} ${args[0]} failed: ${result.stderr || result.error}`,
  );
  return result.stdout.trim();
}

function docker(args) {
  return command("docker", ["--context", context, ...args]);
}

function dockerLogs(name) {
  const result = spawnSync("docker", ["--context", context, "logs", name], {
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.equal(result.status, 0);
  return result.stdout + result.stderr;
}

const endpoint = JSON.parse(docker(["context", "inspect", context]))[0]
  .Endpoints.docker.Host;
assert.ok(
  endpoint.startsWith("unix://"),
  "TLS tests require a local Unix-socket Docker engine",
);

function request(port, options, body = "", secure = true) {
  return new Promise((resolve, reject) => {
    const req = (secure ? https : http).request(
      {
        hostname: "127.0.0.1",
        port,
        path: "/quotes/test-offer/",
        method: body ? "POST" : "GET",
        agent: false,
        ...options,
      },
      (response) => {
        let data = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () =>
          resolve({ status: response.statusCode, body: data }),
        );
      },
    );
    req.setTimeout(5_000, () =>
      req.destroy(new Error("TLS request timed out")),
    );
    req.on("error", reject);
    req.end(body);
  });
}

test(
  "backend mTLS preserves requests and rejects unauthorized transport",
  { timeout: 240_000 },
  async (t) => {
    const directory = await mkdtemp(path.join(tmpdir(), "cwb-backend-tls-"));
    const names = [
      `cwb-tls-app-${process.pid}`,
      `cwb-tls-proxy-${process.pid}`,
    ];
    const openssl = (args) => command("openssl", args, { cwd: directory });
    try {
      openssl([
        "req",
        "-x509",
        "-newkey",
        "rsa:2048",
        "-nodes",
        "-days",
        "1",
        "-subj",
        "/CN=CWB disposable test CA",
        "-keyout",
        "ca.key",
        "-out",
        "client-ca.crt",
      ]);
      for (const [name, usage] of [
        ["server", "serverAuth"],
        ["client", "clientAuth"],
      ]) {
        openssl([
          "req",
          "-new",
          "-newkey",
          "rsa:2048",
          "-nodes",
          "-subj",
          `/CN=${name}`,
          "-keyout",
          `${name}.key`,
          "-out",
          `${name}.csr`,
        ]);
        await writeFile(
          path.join(directory, `${name}.ext`),
          `extendedKeyUsage=${usage}\nsubjectAltName=DNS:cwb-website-backend\n`,
        );
        openssl([
          "x509",
          "-req",
          "-in",
          `${name}.csr`,
          "-CA",
          "client-ca.crt",
          "-CAkey",
          "ca.key",
          "-CAcreateserial",
          "-days",
          "1",
          "-extfile",
          `${name}.ext`,
          "-out",
          `${name}.crt`,
        ]);
      }
      openssl([
        "req",
        "-x509",
        "-newkey",
        "rsa:2048",
        "-nodes",
        "-days",
        "1",
        "-subj",
        "/CN=Untrusted disposable test client",
        "-keyout",
        "untrusted.key",
        "-out",
        "untrusted.crt",
      ]);
      const nodeImage = (await readFile("Dockerfile", "utf8")).match(
        /^FROM (\S+) AS base/m,
      )[1];
      const proxyImage = (
        await readFile("docker-compose.tls.yml", "utf8")
      ).match(/image:\s+(\S+)/)[1];
      const fixture = `require('node:http').createServer((req,res)=>{let size=0;req.on('data',chunk=>size+=chunk.length);req.on('end',()=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({fixture:true,path:req.url,method:req.method,host:req.headers.host,protocol:req.headers['x-forwarded-proto'],client:req.headers['x-forwarded-for']?.split(',')[0]?.trim(),size}));});}).listen(3000,'127.0.0.1');`;
      docker([
        "run",
        "--detach",
        "--name",
        names[0],
        "--publish",
        "127.0.0.1::3443",
        nodeImage,
        "node",
        "-e",
        fixture,
      ]);
      const port = Number(
        docker(["port", names[0], "3443/tcp"]).split(":").at(-1),
      );
      const startProxy = () =>
        docker([
          "run",
          "--detach",
          "--name",
          names[1],
          "--network",
          `container:${names[0]}`,
          "--read-only",
          "--mount",
          `type=bind,source=${path.resolve("deploy/backend-tls/traefik.yml")},target=/etc/traefik/traefik.yml,readonly`,
          "--mount",
          `type=bind,source=${path.resolve("deploy/backend-tls/dynamic")},target=/etc/traefik/dynamic,readonly`,
          "--mount",
          `type=bind,source=${directory},target=/etc/traefik/tls,readonly`,
          "--entrypoint",
          "traefik",
          proxyImage,
          "--configFile=/etc/traefik/traefik.yml",
        ]);
      startProxy();
      const ca = await readFile(path.join(directory, "client-ca.crt"));
      const cert = await readFile(path.join(directory, "client.crt"));
      const key = await readFile(path.join(directory, "client.key"));
      const valid = {
        ca,
        cert,
        key,
        servername: "cwb-website-backend",
        headers: {
          Host: "wojciechbajer.com",
          "X-Forwarded-For": "203.0.113.10",
        },
      };
      let ready;
      for (let attempt = 0; attempt < 50; attempt++) {
        try {
          ready = await request(port, valid);
          break;
        } catch (error) {
          if (attempt === 49)
            throw new Error(`${error.message}\n${dockerLogs(names[1])}`);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      await t.test(
        "trusted client retains URL, host, method and upload body",
        async () => {
          assert.equal(ready.status, 200);
          assert.deepEqual(JSON.parse(ready.body), {
            fixture: true,
            path: "/quotes/test-offer/",
            method: "GET",
            host: "wojciechbajer.com",
            protocol: "https",
            client: "203.0.113.10",
            size: 0,
          });
          const body = "x".repeat(1_100_000);
          const post = await request(
            port,
            { ...valid, path: "/api/cms/media/" },
            body,
          );
          assert.equal(post.status, 200);
          assert.deepEqual(JSON.parse(post.body), {
            fixture: true,
            path: "/api/cms/media/",
            method: "POST",
            host: "wojciechbajer.com",
            protocol: "https",
            client: "203.0.113.10",
            size: body.length,
          });
        },
      );
      await t.test(
        "missing or untrusted client certificate never reaches the application",
        async () => {
          for (const options of [
            { ...valid, cert: undefined, key: undefined },
            {
              ...valid,
              cert: await readFile(path.join(directory, "untrusted.crt")),
              key: await readFile(path.join(directory, "untrusted.key")),
            },
          ]) {
            await assert.rejects(request(port, options));
          }
        },
      );
      await t.test("wrong server CA and hostname are rejected", async () => {
        await assert.rejects(
          request(port, {
            ...valid,
            ca: await readFile(path.join(directory, "untrusted.crt")),
          }),
        );
        await assert.rejects(
          request(port, { ...valid, servername: "wrong-backend.example" }),
        );
        await assert.rejects(request(port, { ...valid, servername: "" }));
      });
      await t.test(
        "plaintext requests to the TLS port are rejected",
        async () => {
          const response = await request(port, {}, "", false);
          assert.equal(response.status, 404);
          assert.ok(!response.body.includes('"fixture":true'));
        },
      );
      await t.test(
        "missing client CA fails closed instead of disabling authentication",
        async () => {
          docker(["rm", "--force", names[1]]);
          await rename(
            path.join(directory, "client-ca.crt"),
            path.join(directory, "client-ca.saved"),
          );
          startProxy();
          let observedFailure = false;
          for (let attempt = 0; attempt < 50; attempt++) {
            if (
              dockerLogs(names[1]).includes(
                "building TLS config: invalid certificate",
              )
            ) {
              observedFailure = true;
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          assert.equal(
            observedFailure,
            true,
            `The fixture must observe the missing CA configuration being loaded: ${dockerLogs(names[1])}`,
          );
          await assert.rejects(
            request(port, { ...valid, cert: undefined, key: undefined }),
          );
        },
      );
    } finally {
      for (const name of names.reverse()) {
        spawnSync("docker", ["--context", context, "rm", "--force", name], {
          encoding: "utf8",
        });
      }
      await rm(directory, { recursive: true, force: true });
    }
  },
);
