# Reverse proxy to backend TLS

The checked-in forwarding configuration uses mutual TLS between Traefik and the
QNAP backend. Provision certificates and host firewall rules before switching a
deployment to this configuration. Changing repository files alone does not
secure an existing deployment.

The normal Compose stack keeps HTTP on `127.0.0.1:${WEB_PORT:-3010}` for local
development, CI, and a proxy running on the same host. `WEB_BIND_ADDRESS` is
ignored. The optional TLS overlay exposes only port 3443 on the selected host
address. Its Traefik sidecar shares the web container's network namespace and
forwards to `127.0.0.1:3000`; plaintext does not cross the LAN.

The backend uses `deploy/backend-tls/traefik.yml` for its listener and file
provider, and `deploy/backend-tls/dynamic/backend.yml` for routing and TLS.
Port 3443 requires TLS 1.2 or newer, the backend server name, and a client
certificate signed by the dedicated proxy CA. The listener accepts forwarded
headers from that authenticated proxy to preserve the public client address.
Do not issue client certificates from this CA to unrelated callers. The
sidecar enables neither the dashboard nor the Docker provider.

## Provisioning

Use Docker Compose 2.20 or newer. Provision these files outside the repository
through the deployment's certificate management process:

| Location                                                    | File                       | Requirement                                                                                                |
| ----------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Backend certificate directory                               | `server.crt`               | Backend certificate and intermediates, with DNS SAN `cwb-website-backend` and server authentication usage. |
| Backend certificate directory                               | `server.key`               | Matching private key, readable only by its owner and the container's Traefik process.                      |
| Backend certificate directory                               | `client-ca.crt`            | CA that issues the dedicated Traefik client certificate.                                                   |
| Public Traefik `/etc/traefik/dynamic_conf/cwb-backend-tls/` | `server-ca.crt`            | CA that issued the backend certificate.                                                                    |
| Public Traefik `/etc/traefik/dynamic_conf/cwb-backend-tls/` | `client.crt`, `client.key` | Dedicated proxy certificate and intermediates with client authentication usage, and its private key.       |

The public Traefik already mounts `/srv/lexense/config/traefik/dynamic_conf` from
its host at `/etc/traefik/dynamic_conf` read-only with the file provider watching
that directory. Store its three files in the `cwb-backend-tls` subdirectory of
this existing mount. Publishing the forwarding configuration then uses those
files without adding a mount or restarting the shared proxy.

Use a dedicated client CA or issuance policy so unrelated clients cannot obtain
certificates accepted by this backend. Keep private keys outside the source tree
and image build context.
Missing certificates, untrusted issuers, expired certificates, and a backend
hostname mismatch must fail rather than fall back to HTTP or disabled checks.

### QNAP paths and persistent Compose settings

Docker bind mounts resolve on the Docker daemon's host. Running Compose on a Mac
with `--context qnap` does not copy configuration files to QNAP. Copy
`deploy/backend-tls/traefik.yml` and `deploy/backend-tls/dynamic/backend.yml` to
the corresponding paths under
`/share/CACHEDEV1_DATA/homes/neverased/.config/cwb-website/backend-tls` on QNAP.
Its `certs` subdirectory contains only `server.crt`, `server.key`, and
`client-ca.crt`. The mounts are read-only and reject missing source paths.

Keep these non-secret deployment settings in the existing gitignored `.env` on
the machine invoking Compose, alongside its existing application settings:

```dotenv
COMPOSE_FILE=docker-compose.yml:docker-compose.tls.yml
BACKEND_TLS_CONFIG_DIR=/share/CACHEDEV1_DATA/homes/neverased/.config/cwb-website/backend-tls
BACKEND_TLS_CERT_DIR=/share/CACHEDEV1_DATA/homes/neverased/.config/cwb-website/backend-tls/certs
BACKEND_TLS_BIND_ADDRESS=192.168.1.100
```

`COMPOSE_FILE` keeps the TLS service in subsequent plain `docker compose`
deployments. An explicit `-f docker-compose.yml` overrides that selection and
omits TLS, breaking the remote proxy path. If using `-f`, supply both files.
Match the upstream address in `cwb-website-forward.yml` to the selected LAN
address and keep `PAYLOAD_PUBLIC_SERVER_URL=https://wojciechbajer.com`.

For a local Docker daemon, leaving `BACKEND_TLS_CONFIG_DIR` unset or empty uses
`./deploy/backend-tls`. Remote deployments must use paths present on the remote
host. Re-copy configuration changes to QNAP before applying them.

## Migration

With the QNAP settings above, run from the repository directory:

```bash
docker --context qnap compose config --quiet
docker --context qnap compose up --build -d --wait
```

The first command validates interpolation without printing runtime secrets. The
second recreates the application with a loopback HTTP binding and starts the backend Traefik sidecar.
Compose restarts the dependent TLS service after an explicit application update
so both processes share the current network namespace. Keep the `COMPOSE_FILE`
setting on all subsequent updates. Allow a maintenance window while replacing
the old HTTP path.

Before loading `cwb-website-forward.yml` into Traefik, verify the new endpoint
from the proxy host with its dedicated client certificate:

```bash
curl --fail --resolve cwb-website-backend:3443:192.168.1.100 \
  --cacert /srv/lexense/config/traefik/dynamic_conf/cwb-backend-tls/server-ca.crt \
  --cert /srv/lexense/config/traefik/dynamic_conf/cwb-backend-tls/client.crt \
  --key /srv/lexense/config/traefik/dynamic_conf/cwb-backend-tls/client.key \
  -H 'Host: wojciechbajer.com' https://cwb-website-backend:3443/api/health/
```

Restrict TCP 3443 with the host firewall to the Traefik host. Confirm that TCP
3000 and 3010 are unreachable from a different LAN device and that requesting
3443 without a client certificate is rejected. Load the forwarding file only
after those checks pass, then check the public site, CMS login, media upload,
private quote access, and PDF download. Confirm a wrong CA and a mismatched
backend hostname are rejected; never set `insecureSkipVerify` to true.

If validation fails, keep the public router disabled while correcting certificate
or network configuration. A same-host proxy may use the loopback HTTP endpoint;
restoring the old LAN HTTP forwarding path is not a secure rollback.

## Certificate renewal

The initial server and client certificates are valid from
`2026-10-27T16:06:17Z` through `2027-10-27T16:06:17Z`. Renew both before
**27 October 2027** and track expiry in the deployment's operational schedule.
The separate server and client CAs have five-year validity. Their private keys
remain on the Lexense host under
`/home/lexense/.local/share/cwb-backend-pki/20261027`, in an owner-only directory
with mode `0700`; they are not copied to QNAP or mounted into Traefik.

Install renewed leaf certificates and keys with versioned filenames in their
host directories, preserving owner-only key permissions. Update the certificate
and key paths in the backend dynamic configuration and public forwarding
configuration, including their repository copies. This creates an actual
configuration change for the file providers; replacing a PEM file or rewriting
identical YAML alone may leave existing transports unchanged. The public file
provider can apply the new paths without restarting the shared proxy. Repeat
the authenticated health check and rejection checks after renewal before
retiring the old leaf files.

## Local checks and pinned updates

Run `node --test scripts/security-config-regression.mjs` to check the configured
boundaries without starting containers. The CI workflow runs it on every build.
The separate backend TLS regression script uses a local Docker context and
disposable test certificates. It defaults to Docker Desktop.

```bash
SECURITY_TEST_DOCKER_CONTEXT=desktop-linux node --test scripts/backend-tls-regression.mjs
```

Set `SECURITY_TEST_DOCKER_CONTEXT=default` on a Linux CI host whose default
context uses its local Unix socket.
The test refuses SSH and TCP Docker endpoints, removes its fixture containers,
and deletes the temporary test keys when complete.

GitHub Action commits and multi-platform image digests were resolved from their
official GitHub repositories and Docker registry. Renovate proposes updates to
the pinned identities for review. Review action release changes and container
updates before merging; preserving a tag next to a digest makes the intended
release visible without allowing a moved tag to replace the artifact.

Configuration references: [Traefik ServersTransport](https://doc.traefik.io/traefik/reference/routing-configuration/http/load-balancing/serverstransport/),
[Traefik client certificate verification](https://doc.traefik.io/traefik/reference/routing-configuration/http/tls/tls-options/#client-authentication-mtls),
[Traefik file provider](https://doc.traefik.io/traefik/reference/install-configuration/providers/others/file/),
[Traefik v3.7.16 release](https://github.com/traefik/traefik/releases/tag/v3.7.16),
[Compose service dependencies](https://docs.docker.com/reference/compose-file/services/#depends_on),
and [Docker bind mount host requirements](https://docs.docker.com/engine/storage/bind-mounts/#considerations-and-constraints).
