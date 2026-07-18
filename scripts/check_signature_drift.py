#!/usr/bin/env python3
"""Weekly upstream-drift check for the suggested-setups signature catalog.

For every integration in scripts/signature_probes.json, fetch the raw upstream
source file(s) the signatures were verified against and check that the probe
strings still appear. A missing string means the upstream integration likely
renamed/removed the entity our signature matches on — the catalog entry needs a
re-dive (docs/design/signature-evaluation-scheme.md).

Deliberately stdlib-only (runs in a bare GitHub runner). Exit codes:
0 = all probes pass, 1 = drift or fetch failure detected (the workflow turns
that into an issue, never into a PR-blocking failure).
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

PROBES_FILE = Path(__file__).parent / "signature_probes.json"
TIMEOUT = 30
HEADERS = {"User-Agent": "maintenance-supporter-signature-drift-check"}


def fetch(url: str) -> str | None:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except (urllib.error.URLError, TimeoutError, OSError) as err:
        print(f"  FETCH FAILED: {url} ({err})")
        return None


def main() -> int:
    probes = json.loads(PROBES_FILE.read_text(encoding="utf-8"))
    probes.pop("_comment", None)

    drifted: list[str] = []
    for domain, probe in sorted(probes.items()):
        texts: list[str] = []
        fetch_failed = False
        for url in probe["urls"]:
            text = fetch(url)
            if text is None:
                fetch_failed = True
            else:
                texts.append(text)
        if fetch_failed and not texts:
            drifted.append(f"{domain}: all source fetches failed")
            print(f"[FAIL] {domain}: could not fetch any probe URL")
            continue
        blob = "\n".join(texts)
        missing = [s for s in probe["strings"] if s not in blob]
        if missing:
            drifted.append(f"{domain}: missing {missing}")
            print(f"[DRIFT] {domain}: {missing} no longer found upstream")
        elif fetch_failed:
            drifted.append(f"{domain}: one of several probe URLs unreachable")
            print(f"[WARN] {domain}: strings ok, but a probe URL failed to fetch")
        else:
            print(f"[ok] {domain}")

    if drifted:
        print("\n=== DRIFT SUMMARY ===")
        for line in drifted:
            print(f"- {line}")
        return 1
    print("\nAll signature probes verified against upstream.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
