"""Completion sources and their provenance notes are one table (tripwire).

Pins (DRY/drift round 2026-09-12): every ``complete_maintenance(source=…)``
literal in the package is a member of ``COMPLETION_SOURCES``; every
UNATTENDED surface (button, to-do, voice, notification action, NFC,
shopping list) has a canned note in ``COMPLETION_PROVENANCE_NOTES`` and
passes exactly that note (the wording used to live in six call sites, and
voice / the notification action passed none); the coordinator resolves the
effective source once.
"""

from __future__ import annotations

import ast
from pathlib import Path
from typing import Any

from custom_components.maintenance_supporter.const import COMPLETION_PROVENANCE_NOTES, COMPLETION_SOURCES

_PACKAGE = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter"
_UNATTENDED = {"button", "todo", "voice", "notification_action", "nfc", "shopping_list"}


def _completion_calls() -> list[tuple[str, dict[str, ast.expr]]]:
    """``(file, {keyword: value-node})`` for every ``complete_maintenance(...)`` call."""
    calls: list[tuple[str, dict[str, ast.expr]]] = []
    for path in _PACKAGE.rglob("*.py"):
        tree = ast.parse(path.read_text(encoding="utf-8"))
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == "complete_maintenance":
                calls.append((str(path.relative_to(_PACKAGE)), {kw.arg: kw.value for kw in node.keywords if kw.arg}))
    return calls


def _const(node: ast.expr | None) -> Any:
    return node.value if isinstance(node, ast.Constant) else None


def test_every_source_literal_is_a_known_source() -> None:
    calls = _completion_calls()
    assert len(calls) >= 9, "expected the nine completion surfaces (plus auto-recovery)"
    literals = {_const(kw.get("source")) for _, kw in calls if isinstance(kw.get("source"), ast.Constant)}
    assert literals, "no source literals found"
    assert literals <= set(COMPLETION_SOURCES), sorted(literals - set(COMPLETION_SOURCES))


def test_unattended_sources_have_and_use_the_provenance_note() -> None:
    assert set(COMPLETION_PROVENANCE_NOTES) == _UNATTENDED
    assert set(COMPLETION_SOURCES) >= _UNATTENDED
    assert all(isinstance(v, str) and v for v in COMPLETION_PROVENANCE_NOTES.values())
    seen: set[str] = set()
    for file, kw in _completion_calls():
        if _const(kw.get("unattended")) is not True:
            continue
        source = _const(kw.get("source"))
        assert source in _UNATTENDED, f"{file}: unattended completion with source {source!r} has no provenance entry"
        notes = kw.get("notes")
        assert (
            isinstance(notes, ast.Subscript)
            and isinstance(notes.value, ast.Name)
            and notes.value.id == "COMPLETION_PROVENANCE_NOTES"
            and _const(notes.slice) == source
        ), f"{file}: {source} must take its note from COMPLETION_PROVENANCE_NOTES[{source!r}]"
        seen.add(source)
    assert seen == _UNATTENDED, f"unattended surfaces not found as callers: {sorted(_UNATTENDED - seen)}"


def test_coordinator_resolves_the_effective_source_once() -> None:
    src = (_PACKAGE / "coordinator.py").read_text(encoding="utf-8")
    assert src.count('"auto_recovery" if auto else None') == 1
