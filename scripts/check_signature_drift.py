#!/usr/bin/env python3
"""Weekly upstream-drift check for the suggested-setups signature catalog.

For every integration in scripts/signature_probes.json, fetch the raw upstream
source file(s) the signatures were verified against and check that the probe
strings still appear. A missing string means the upstream integration likely
renamed/removed the entity our signature matches on — the catalog entry needs a
re-dive (docs/design/signature-evaluation-scheme.md).

A fetch that fails for a passing reason (rate limit, server error, timeout) is
tried twice more after a pause. If it still fails, the integration is reported
as unverified this week, not as drifted: GitHub's raw host answered 429 for
one of tuya's three files and the strings from that file read as gone (#249).
A file that is not there any more (404) is drift: the source moved.

Deliberately stdlib-only (runs in a bare GitHub runner). Exit codes:
0 = every probe passed or could only not be checked this week, 1 = drift
(the workflow turns that into an issue, never into a PR-blocking failure).
"""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from collections.abc import Callable
from pathlib import Path

PROBES_FILE = Path(__file__).parent / "signature_probes.json"
TIMEOUT = 30
HEADERS = {"User-Agent": "maintenance-supporter-signature-drift-check"}
#: Pauses before the second and the third try of a passing failure.
RETRY_PAUSES = (10.0, 30.0)


class Transient(Exception):
    """A fetch that may work on another try (429, 5xx, timeout, network)."""


class Gone(Exception):
    """The file is not there (404 and other 4xx): the source moved."""


def fetch_once(url: str) -> str:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as err:
        if err.code == 429 or err.code >= 500:
            raise Transient(f"HTTP {err.code}") from err
        raise Gone(f"HTTP {err.code}") from err
    except (urllib.error.URLError, TimeoutError, OSError) as err:
        raise Transient(str(err)) from err


def fetch(url: str, *, once: Callable[[str], str] = fetch_once, sleep: Callable[[float], None] = time.sleep) -> str:
    """The file's text; Transient after the last try, Gone at once."""
    for pause in (*RETRY_PAUSES, None):
        try:
            return once(url)
        except Transient as err:
            if pause is None:
                raise
            print(f"  retry in {pause:.0f} s: {url} ({err})")
            sleep(pause)
    raise AssertionError("unreachable")


def check(probes: dict, fetcher: Callable[[str], str] = fetch) -> tuple[list[str], list[str]]:
    """(drifted, unverified) — one line per integration."""
    drifted: list[str] = []
    unverified: list[str] = []
    for domain, probe in sorted(probes.items()):
        texts: list[str] = []
        gone: list[str] = []
        failed: list[str] = []
        for url in probe["urls"]:
            try:
                texts.append(fetcher(url))
            except Gone as err:
                print(f"  SOURCE GONE: {url} ({err})")
                gone.append(url)
            except Transient as err:
                print(f"  FETCH FAILED: {url} ({err})")
                failed.append(url)
        if gone:
            drifted.append(f"{domain}: source file gone {gone}")
            print(f"[DRIFT] {domain}: a probe URL no longer exists")
            continue
        missing = [s for s in probe["strings"] if s not in "\n".join(texts)]
        if failed and missing:
            # The missing strings may well be in the file that did not load.
            unverified.append(f"{domain}: {len(failed)} of {len(probe['urls'])} source files did not load")
            print(f"[WARN] {domain}: not verified this week, a probe URL failed to fetch")
        elif failed:
            print(f"[ok] {domain} (every string found, one source file did not load)")
        elif missing:
            drifted.append(f"{domain}: missing {missing}")
            print(f"[DRIFT] {domain}: {missing} no longer found upstream")
        else:
            print(f"[ok] {domain}")
    return drifted, unverified


def main() -> int:
    probes = json.loads(PROBES_FILE.read_text(encoding="utf-8"))
    probes.pop("_comment", None)
    drifted, unverified = check(probes)
    if unverified:
        print("\n=== NOT VERIFIED THIS WEEK (fetch failed after retries) ===")
        for line in unverified:
            print(f"- {line}")
    if drifted:
        print("\n=== DRIFT SUMMARY ===")
        for line in drifted:
            print(f"- {line}")
        return 1
    print("\nNo signature drift found upstream.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
