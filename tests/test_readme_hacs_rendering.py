"""The README as HACS shows it inside Home Assistant.

Before rendering a repository's README, HACS rewrites its links with
regular expressions (hacs/frontend ``src/tools/markdown.ts``, ported in
:func:`hacs_markdown`). Two traps follow from them:

* A relative link gets the GitHub prefix in front of the FIRST ``(`` of the
  match. In a badge line ``[![Tests](https://img…)](docs/…)`` that is the
  image's parenthesis, so the image points at
  ``…/blob/<version>/https://img…`` and renders broken.
* A relative link is only rewritten when no absolute URL follows it on the
  same line; otherwise it stays relative and leads nowhere inside HA.

GitHub resolves the same README correctly, so this only shows in HACS (the
Tests and Coverage badges rendered as broken images up to v2.98.0). Every
link and image must survive the rewrite: absolute, or an in-page anchor HACS
maps itself.
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest

_ROOT = Path(__file__).resolve().parents[1]
_REPO = "iluebbe/maintenance_supporter"
_VERSION = "v0.0.0"


def _shows_github_web(text: str) -> bool:
    low = text.lower()
    return ".md" in low or ".markdown" in low


def hacs_markdown(text: str) -> str:
    """hacs/frontend ``markdownWithRepositoryContext`` (the link rewriting),
    ported as is: JavaScript's ``String.replace(str, str)`` replaces the
    first occurrence only, and ``.`` stops at a line break in both."""
    text = re.sub(
        r"https://github\.com/([^/]+)/([^/]+)/blob/([^\s]+)",
        lambda m: m.group(0) if _shows_github_web(m.group(0)) else f"https://raw.githubusercontent.com/{m.group(1)}/{m.group(2)}/{m.group(3)}",
        text,
    )

    def relative(m: re.Match[str]) -> str:
        x = m.group(0)
        web = _shows_github_web(x)
        base = f"https://github.com/{_REPO}/blob" if web else f"https://raw.githubusercontent.com/{_REPO}"
        return x.replace("(/", "(", 1).replace("(", f"({base}/{_VERSION}/", 1)

    text = re.sub(r"\[.*?\]\([^#](?!.*?://).*?\)", relative, text)
    return re.sub(r"\[.*\]\(#.*\)", lambda m: m.group(0).replace("(#", "(/hacs/repository/1#", 1), text)


def _broken_targets(markdown: str) -> list[str]:
    """Link and image targets that do not work after the rewrite: still
    relative, or an absolute URL glued behind another one."""
    broken = []
    for lineno, line in enumerate(hacs_markdown(markdown).splitlines(), start=1):
        for target in re.findall(r"\]\(([^)\s]+)", line):
            if target.startswith("/hacs/repository/"):
                continue
            if not target.startswith(("https://", "http://")) or target.count("://") != 1:
                broken.append(f"line {lineno}: {target}")
    return broken


def test_the_port_reproduces_the_badge_breakage() -> None:
    """The two traps, as HACS produced them for v2.98.0."""
    badge = "[![Tests](https://img.shields.io/badge/x.svg)](docs/ARCHITECTURE.md#tests)"
    assert hacs_markdown(badge) == (
        f"[![Tests](https://github.com/{_REPO}/blob/{_VERSION}/https://img.shields.io/badge/x.svg)](docs/ARCHITECTURE.md#tests)"
    )
    assert _broken_targets(badge)
    follows = "[ROADMAP.md](ROADMAP.md) — ideas via [Discussions](https://github.com/x/y/discussions)"
    assert "](ROADMAP.md)" in hacs_markdown(follows)
    alone = "[Features](docs/FEATURES.md#a) and more"
    assert hacs_markdown(alone) == f"[Features](https://github.com/{_REPO}/blob/{_VERSION}/docs/FEATURES.md#a) and more"
    assert not _broken_targets(alone)


def test_every_readme_link_survives_the_hacs_rewrite() -> None:
    readme = _ROOT / "README.md"
    if not readme.exists():
        pytest.skip("README.md not mounted in this environment (enforced in CI)")
    broken = _broken_targets(readme.read_text(encoding="utf-8"))
    assert not broken, (
        "these README links break in HACS (write them absolute, "
        f"https://github.com/{_REPO}/blob/master/…):\n  " + "\n  ".join(broken)
    )
