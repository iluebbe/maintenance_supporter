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

import difflib
import importlib.util
import re
import sys
from pathlib import Path
from types import ModuleType

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
    "docs/GETTING_STARTED.md",
    "CONTRIBUTING.md",
    # The LLM setup skill quotes the same counts (templates, catalog,
    # commands, intents) to an agent that trusts them; it was the one
    # place nothing checked (skill audit 2026-09-30).
    "skills/maintenance-setup-assistant/SKILL.md",
    "skills/maintenance-setup-assistant/references/ws-api.md",
    "skills/maintenance-setup-assistant/references/discovery.md",
    "skills/maintenance-setup-assistant/references/non-smart-catalog.md",
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


def _intent_count() -> int:
    """Registered Assist intents, read from the handler module's constants."""
    from custom_components.maintenance_supporter import intent as intent_module

    return len({value for name, value in vars(intent_module).items() if name.startswith("INTENT_") and isinstance(value, str)})


def _ws_command_count() -> int:
    """Distinct WS command types, read from the frozen permission matrix."""
    matrix = (_ROOT / "tests" / "test_ws_permission_matrix.py").read_text(encoding="utf-8")
    return len(set(re.findall(r'"(maintenance_supporter/[a-z_/]+)"', matrix)))


# A count written out rots like a digit and was invisible to these gates:
# ARCHITECTURE's file tree said "Six Assist/voice intents" while there were 15.
_WORDS = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
    "twenty",
]
_NUMBER = r"(\d[\d,]*|" + "|".join(_WORDS) + r")"


def _tree_span(rel: str, text: str) -> tuple[int, int]:
    """The ARCHITECTURE file tree: its per-module figures ("13 commands: …",
    "8 intents: …") are one module's share, derived by
    scripts/sync_architecture_doc.py and checked in test_architecture_tree_matches_the_code."""
    if rel != "docs/ARCHITECTURE.md" or "## File Structure" not in text:
        return (0, 0)
    start = text.index("```", text.index("## File Structure"))
    return (start, text.index("```", start + 3))


def _assert_quoted_numbers(pattern: str, expected: int, label: str, *, per_module_in_tree: bool = False) -> None:
    """Every `<number> <thing>` phrase in the live docs must quote *expected*."""
    wrong: list[str] = []
    for rel, text in _require_docs():
        tree = _tree_span(rel, text) if per_module_in_tree else (0, 0)
        for match in re.finditer(pattern, text, re.IGNORECASE):
            if tree[0] <= match.start() < tree[1]:
                continue
            word = match.group(1).lower()
            found = _WORDS.index(word) if word in _WORDS else int(word.replace(",", ""))
            if found != expected:
                line = text[: match.start()].count("\n") + 1
                wrong.append(f"{rel}:{line} says {found} {label} (code: {expected}) — {match.group(0)!r}")
    assert not wrong, "stale counts in the docs:\n  " + "\n  ".join(wrong)


# ── The gates ──────────────────────────────────────────────────────────────


def test_documented_language_count() -> None:
    # "the OTHER 21 languages load at runtime" is a legitimate non-total (English
    # is bundled into the JS, the rest are fetched) — only totals are checked.
    _assert_quoted_numbers(r"(?<!other )(?<!remaining )\b" + _NUMBER + r" languages\b", _language_count(), "languages")


def test_documented_template_count() -> None:
    templates, categories = _template_counts()
    _assert_quoted_numbers(r"\b" + _NUMBER + r" (?:object )?templates\b", templates, "templates")
    _assert_quoted_numbers(r"\b" + _NUMBER + r" categories\b", categories, "template categories")


def test_documented_integration_and_signature_counts() -> None:
    integrations, signatures = _signature_counts()
    _assert_quoted_numbers(r"\b" + _NUMBER + r" integrations\b", integrations, "integrations")
    _assert_quoted_numbers(r"\b" + _NUMBER + r" (?:verified )?signatures\b", signatures, "signatures")


def test_documented_intent_count() -> None:
    """The intent list rots the same way every other count does: v2.44 added
    two and the prose still said "six", which is the kind of claim a reader
    checks the docs FOR."""
    _assert_quoted_numbers(
        r"\b" + _NUMBER + r" (?:Assist |voice |Assist/voice )?intents\b", _intent_count(), "intents", per_module_in_tree=True
    )


def test_documented_ws_command_count() -> None:
    _assert_quoted_numbers(
        r"\b" + _NUMBER + r" (?:WS |WebSocket )?commands\b", _ws_command_count(), "WS commands", per_module_in_tree=True
    )


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


# ── Test-suite figures ─────────────────────────────────────────────────────


def _count_matches(pattern: str, files: list[Path]) -> int:
    rx = re.compile(pattern, re.MULTILINE)
    return sum(len(rx.findall(f.read_text(encoding="utf-8"))) for f in files)


def test_documented_test_suite_figures() -> None:
    """The README badge and ARCHITECTURE's test figures went stale twice
    ("3,600+ passed", "3,674 tests across 213 test files" while the suite ran
    4,789 across 293). Counted statically: `def test_` functions and `it(`
    blocks are a floor for the cases a run reports (parametrisation only adds
    to them), files are counted exactly. A figure may lag the suite by up to
    10 % — not every new test file needs a docs edit — but not more, and a
    case count may not claim more than 30 % above the static floor."""
    readme, arch = _ROOT / "README.md", _ROOT / "docs" / "ARCHITECTURE.md"
    if not (readme.exists() and arch.exists()):
        pytest.skip("docs/ not mounted in this environment (enforced in CI)")

    py_files = sorted((_ROOT / "tests").glob("test_*.py"))
    fe_files = sorted((_COMPONENT / "frontend-src" / "__tests__").glob("*.test.ts"))
    py_cases = _count_matches(r"^\s*(?:async\s+)?def test_", py_files)
    fe_cases = _count_matches(r"^\s*it\(", fe_files)
    journeys = len(list((_ROOT / "tests").glob("test_journey_*.py")))

    def num(s: str) -> int:
        return int(s.replace(",", ""))

    checks: list[tuple[str, str, list[tuple[str, int, bool]]]] = [
        # (doc, pattern, [(label, counted, is_case_count) per group])
        (
            "docs/ARCHITECTURE.md",
            r"\*\*([\d,]+) tests\*\* across \*\*([\d,]+) test files\*\*",
            [("backend tests", py_cases, True), ("backend test files", len(py_files), False)],
        ),
        (
            "docs/ARCHITECTURE.md",
            r"\(([\d,]+) backend tests \+ ([\d,]+) frontend tests\)",
            [("backend tests", py_cases, True), ("frontend tests", fe_cases, True)],
        ),
        (
            "docs/ARCHITECTURE.md",
            r"([\d,]+)-test frontend suite in real Chromium across ([\d,]+) spec files",
            [("frontend tests", fe_cases, True), ("frontend spec files", len(fe_files), False)],
        ),
        ("docs/ARCHITECTURE.md", r"([\d,]+)-scenario journey suite", [("journey scenarios", journeys, False)]),
        ("README.md", r"badge/tests-([\d]+)%2B_passed", [("tests (badge)", py_cases + fe_cases, True)]),
    ]
    wrong: list[str] = []
    for rel, pattern, groups in checks:
        match = re.search(pattern, (_ROOT / rel).read_text(encoding="utf-8"))
        if not match:
            wrong.append(f"{rel}: phrase {pattern!r} is gone — update this tripwire with the new wording")
            continue
        for i, (label, counted, is_cases) in enumerate(groups, start=1):
            found = num(match.group(i))
            high = counted * 1.3 if is_cases else counted
            if not counted * 0.9 <= found <= high:
                wrong.append(f"{rel} says {found} {label}; the suite has {counted}{' (static floor)' if is_cases else ''}")
    assert not wrong, "stale test-suite figures:\n  " + "\n  ".join(wrong)


# ── The ARCHITECTURE file tree ─────────────────────────────────────────────

_SYNC_HINT = (
    "run `py -X utf8 scripts/sync_architecture_doc.py` — the pre-commit hook does it on every commit "
    "(enable once per clone: `git config core.hooksPath .githooks`)"
)


def _architecture_sync() -> tuple[ModuleType, str]:
    """scripts/sync_architecture_doc.py, loaded, and the committed doc (LF)."""
    script = _ROOT / "scripts" / "sync_architecture_doc.py"
    doc = _ROOT / "docs" / "ARCHITECTURE.md"
    if not (script.exists() and doc.exists()):
        pytest.skip("docs/ or scripts/ not mounted in this environment (enforced in CI)")
    spec = importlib.util.spec_from_file_location("sync_architecture_doc", script)
    assert spec and spec.loader
    if spec.name not in sys.modules:
        module = importlib.util.module_from_spec(spec)
        # Its dataclasses resolve their (string) annotations through sys.modules.
        sys.modules[spec.name] = module
        spec.loader.exec_module(module)
    return sys.modules[spec.name], doc.read_text(encoding="utf-8").replace("\r\n", "\n")


def test_architecture_tree_matches_the_code() -> None:
    """ARCHITECTURE's file tree is derived from the code — its line counts said
    "as of v2.42.1" fifty releases later, 95 modules were missing and a module
    still listed three of its six commands. Every module listed, nothing listed
    that is gone, the command and intent lists, the file counts and the header's
    source-file figures must be exact; a line count may lag (a contributor
    without the hook) by 10 % or 25 lines, not more."""
    module, text = _architecture_sync()
    result = module.sync(text)
    problems = [f"module missing from the tree: {rel}" for rel in result.added]
    problems += [f"listed but gone: {rel}" for rel in result.removed]
    problems += [
        f"{rel}: {documented} lines documented, {actual} in the file"
        for rel, documented, actual in result.lines
        if abs(documented - actual) > max(25, actual // 10)
    ]

    def without_line_counts(doc: str) -> list[str]:
        return re.sub(r"\s+\(\d[\d,]* lines\)", " (N lines)", doc).splitlines()

    committed, derived = without_line_counts(text), without_line_counts(result.text)
    if not problems and committed != derived:
        diff = difflib.unified_diff(committed, derived, "committed", "derived", lineterm="", n=0)
        problems.append("derived text differs:\n" + "\n".join(list(diff)[:40]))
    assert not problems, f"docs/ARCHITECTURE.md is out of step with the code — {_SYNC_HINT}:\n  " + "\n  ".join(problems)


def test_architecture_sync_is_stable() -> None:
    """A second run changes nothing, so the hook does not rewrite the doc on
    every commit."""
    module, text = _architecture_sync()
    once = module.sync(text).text
    assert module.sync(once).text == once
