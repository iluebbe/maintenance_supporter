"""The committed frontend bundles must be built from the current manifest.

v2.44.0 shipped a bundle stamped 2.43.0: the manifest was bumped and committed
without rebuilding `frontend/`. The panel compares the version the backend
reports against the one esbuild stamped into the JavaScript, decided the
browser was holding a stale cached file, and showed a *"reload to update the
panel"* banner that **reloading cannot clear** — the served bundle really did
carry the older version. It was reported within hours (#112).

Nothing caught it:

* `frontend-src/__tests__/bundle-version.test.ts` covers the comparison LOGIC,
  and under the test runner the stamp is always ``"dev"``, which disables the
  comparison — it can never see a stale committed artifact.
* CI builds the frontend and then only checks that the output files EXIST. The
  rebuilt artifact is never compared with the committed one, so the difference
  is silently discarded.

This test reads the committed files, so it needs no build and cannot flake on
build nondeterminism between a developer's machine and CI.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import pytest

_ROOT = Path(__file__).resolve().parent.parent
_COMPONENT = _ROOT / "custom_components" / "maintenance_supporter"
_FRONTEND = _COMPONENT / "frontend"

# esbuild writes this as the first line of every bundle (see esbuild.mjs).
_BANNER = re.compile(r"/\*!\s*maintenance_supporter frontend ([0-9]+\.[0-9]+\.[0-9]+)\s*\*/")

# The artifacts a user actually loads. Chunks inherit the entry point's build,
# so stamping the three entries is enough.
_BUNDLES = (
    "maintenance-panel.js",
    "maintenance-card.js",
    "strategy/maintenance-dashboard-strategy.js",
)


def _manifest_version() -> str:
    return str(json.loads((_COMPONENT / "manifest.json").read_text(encoding="utf-8"))["version"])


@pytest.mark.parametrize("name", _BUNDLES)
def test_every_bundle_is_built_from_the_current_manifest(name: str) -> None:
    """A bump without a rebuild is the exact failure that produced #112."""
    path = _FRONTEND / name
    if not path.exists():
        pytest.skip(f"{name} not present in this checkout")

    head = path.read_text(encoding="utf-8", errors="replace")[:200]
    match = _BANNER.search(head)
    assert match, (
        f"{name} carries no version banner. Run `node esbuild.mjs` in "
        f"frontend-src/ — the banner is what proves the committed bundle was "
        f"built from the current source."
    )

    expected = _manifest_version()
    assert match.group(1) == expected, (
        f"{name} was built from manifest version {match.group(1)}, but "
        f"manifest.json now says {expected}. Bumping the version without "
        f"rebuilding the frontend ships a bundle that tells every user to "
        f"reload a panel that reloading cannot fix (#112). Run "
        f"`node esbuild.mjs` in frontend-src/ and commit the result."
    )


def test_the_banner_regex_would_notice_a_stale_stamp() -> None:
    """Guard the guard: a test that silently matches nothing proves nothing."""
    hit = _BANNER.search("/*! maintenance_supporter frontend 1.2.3 */rest")
    assert hit is not None, "the regex no longer matches a well-formed banner"
    assert hit.group(1) == "1.2.3"
    assert _BANNER.search("/*! some other banner 1.2.3 */") is None
