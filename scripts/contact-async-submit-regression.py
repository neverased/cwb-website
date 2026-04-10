#!/usr/bin/env python3

from __future__ import annotations

import json
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "http://127.0.0.1:4011"


class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def fail(message: str) -> None:
    raise SystemExit(message)


def wait_for_server() -> None:
    deadline = time.time() + 10

    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"{BASE_URL}/contact_bootstrap.php") as response:
                if response.status == 200:
                    return
        except Exception:
            time.sleep(0.1)

    fail("Timed out waiting for local PHP server.")


def main() -> None:
    server = subprocess.Popen(
        ["php", "-S", "127.0.0.1:4011", "-t", "out"],
        cwd=REPO_ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    try:
        wait_for_server()

        with urllib.request.urlopen(f"{BASE_URL}/contact_bootstrap.php") as response:
            bootstrap = json.load(response)

        opener = urllib.request.build_opener(NoRedirectHandler())
        payload = {
            "name": "Spam Bot",
            "email": "spam@example.com",
            "scope": "seo",
            "message": "Please sell me backlinks and improve Google rankings.",
            "challenge_answer": str(
                bootstrap["challenge_first"] + bootstrap["challenge_second"]
            ),
            "contact_nonce": bootstrap["nonce"],
            "contact_issued_at": str(bootstrap["issued_at"]),
            "contact_token": bootstrap["token"],
            "challenge_first": str(bootstrap["challenge_first"]),
            "challenge_second": str(bootstrap["challenge_second"]),
            "website": "",
            "company": "Injected Corp",
            "full_name_confirm": "",
        }
        request = urllib.request.Request(
            f"{BASE_URL}/contact.php",
            data=urllib.parse.urlencode(payload).encode(),
            method="POST",
            headers={"Accept": "application/json"},
        )

        try:
            with opener.open(request) as response:
                if response.status != 200:
                    fail(f"Expected HTTP 200 for async sent status, got {response.status}.")

                if response.headers.get_content_type() != "application/json":
                    fail(
                        "Expected JSON content type for async submit, got "
                        f"{response.headers.get_content_type()}."
                    )

                body = json.load(response)
        except urllib.error.HTTPError as error:
            if error.code == 303:
                fail("Expected JSON response for async submit, got HTTP 303 redirect.")

            fail(f"Expected HTTP 200 JSON response, got HTTP {error.code}.")

        if body.get("status") != "sent":
            fail(f"Expected JSON sent status, got {body!r}.")
    finally:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()
            server.wait(timeout=5)

    print("Async submit regression checks passed.")


if __name__ == "__main__":
    main()
