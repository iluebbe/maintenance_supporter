"""The numbers quoted in the shipped docs must match the code.

Every count in README/FEATURES/ARCHITECTURE/CONFIGURATION/EXAMPLES rots the
moment a language, template, integration or WS command is added — the
2026-07 audit found the same figure stale in up to seven places at once
("18 languages", "72 commands", "100 integrations / 190 signatures",
"32 templates"), and three documents contradicted themselves internally.

This tripwire computes each figure FROM THE CODE and then scans the docs for
any sentence quoting a different one. Adding a language now fails here until
the prose is updated, which is the whole point.

Deliberately NOT scanned: CHANGELOG.md, ROADMAP.md and docs/design/* record
historical states ("catalog after round 6: 83 integrations") that must keep
their old numbers.
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest

_ROOT = Path(__file__).resolve().parent.parent
_COMPONENT = _ROOT / "custom_components" / "maintenance_supporter"

# Docs whose prose is expected to describe the CURRENT state.
_LIVE_DOCS = (
    "README.md",
    "docs/FEATURES.md",
    "docs/ARCHITECTURE.md",
    "docs/CONFIGURATION.md",
    "docs/EXAMPLES.md",
    "CONTRIBUTING.md",
)


def _docs() -> list[tuple[str, str]]:
    """(relative path, text) for every live doc that exists."""
    out = []
    for rel in _LIVE_DOCS:
        path = _ROOT / rel
        if path.exists():
            out.append((rel, path.read_text(encoding="utf-8")))
    return out


def _require_docs() -> list[tuple[str, str]]:
    docs = _docs()
    if not docs:
        # The ha-maint dev container only mounts custom_components + tests;
        # CI checks out the full repo and enforces this there.
        pytest.skip("docs/ not mounted in this environment (enforced in CI)")
    return docs


# ── Figures, computed from the code ────────────────────────────────────────


def _language_count() -> int:
    return len(list((_COMPONENT / "frontend-src" / "locales").glob("*.json")))


def _template_counts() -> tuple[int, int]:
    from custom_components.maintenance_supporter.templates import TEMPLATE_CATEGORIES, TEMPLATES

    return len(TEMPLATES), len(TEMPLATE_CATEGORIES)


def _signature_counts() -> tuple[int, int]:
    from custom_components.maintenance_supporter.helpers.signatures import SIGNATURES

    return len(SIGNATURES), sum(len(cat.tasks) for cat in SIGNATURES.values())


def _ws_command_count() -> int:
    """Distinct WS command types, read from the frozen permission matrix."""
    matrix = (_ROOT / "tests" / "test_ws_permission_matrix.py").read_text(encoding="utf-8")
    return len(set(re.findall(r'"(maintenance_supporter/[a-z_/]+)"', matrix)))


def _assert_quoted_numbers(pattern: str, expected: int, label: str) -> None:
    """Every `<number> <thing>` phrase in the live docs must quote *expected*."""
    wrong: list[str] = []
    for rel, text in _require_docs():
        for match in re.finditer(pattern, text, re.IGNORECASE):
            found = int(match.group(1).replace(",", ""))
            if found != expected:
                line = text[: match.start()].count("\n") + 1
                wrong.append(f"{rel}:{line} says {found} {label} (code: {expected}) — {match.group(0)!r}")
    assert not wrong, "stale counts in the docs:\n  " + "\n  ".join(wrong)


# ── The gates ──────────────────────────────────────────────────────────────


def test_documented_language_count() -> None:
    # "the OTHER 21 languages load at runtime" is a legitimate non-total (English
    # is bundled into the JS, the rest are fetched) — only totals are checked.
    _assert_quoted_numbers(r"(?<!other )(?<!remaining )\b(\d+) languages\b", _language_count(), "languages")


def test_documented_template_count() -> None:
    templates, categories = _template_counts()
    _assert_quoted_numbers(r"\b(\d+) (?:object )?templates\b", templates, "templates")
    _assert_quoted_numbers(r"\b(\d+) categories\b", categories, "template categories")


def test_documented_integration_and_signature_counts() -> None:
    integrations, signatures = _signature_counts()
    _assert_quoted_numbers(r"\b(\d+) integrations\b", integrations, "integrations")
    _assert_quoted_numbers(r"\b(\d+) (?:verified )?signatures\b", signatures, "signatures")


def test_documented_ws_command_count() -> None:
    _assert_quoted_numbers(r"\b(\d+) (?:WS |WebSocket )?commands\b", _ws_command_count(), "WS commands")


def test_documented_version_matches_manifest() -> None:
    """ARCHITECTURE.md's version line must track manifest.json."""
    import json

    manifest = json.loads((_COMPONENT / "manifest.json").read_text(encoding="utf-8"))
    arch = _ROOT / "docs" / "ARCHITECTURE.md"
    if not arch.exists():
        pytest.skip("docs/ not mounted in this environment (enforced in CI)")
    match = re.search(r"\*\*Version:\*\*\s*([0-9.]+)", arch.read_text(encoding="utf-8"))
    assert match, "ARCHITECTURE.md lost its **Version:** line"
    assert match.group(1) == manifest["version"], (
        f"ARCHITECTURE.md says {match.group(1)}, manifest.json says {manifest['version']}"
    )
