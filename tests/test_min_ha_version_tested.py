"""The oldest Home Assistant hacs.json declares is the one CI's minimum leg runs.

Until 2.96 hacs.json declared 2025.7.0 while every test and type check ran on
2026.9 — a minimum nothing verified (ROADMAP carried it as an open item).
The workflow names the core its pinned pytest-homeassistant-custom-component
release installs, next to HA_MIN_PHT; this keeps that and hacs.json in step.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent


def test_the_declared_minimum_is_the_minimum_ci_runs() -> None:
    workflow = ROOT / ".github" / "workflows" / "tests.yaml"
    if not workflow.exists():
        pytest.skip(".github/ not mounted in this environment (enforced in CI)")
    text = workflow.read_text(encoding="utf-8")
    named = re.search(r"# pytest-homeassistant-custom-component (\d+\.\d+\.\d+) == homeassistant (\S+?),?\n[^\n]*\n[^\n]*\n\s*HA_MIN_PHT: \"(\d+\.\d+\.\d+)\"", text)
    assert named, "tests.yaml must name the core next to HA_MIN_PHT"
    pht_named, core, pht_pinned = named.groups()
    assert pht_named == pht_pinned, f"the comment names pht-cc {pht_named}, HA_MIN_PHT pins {pht_pinned}"
    declared = json.loads((ROOT / "hacs.json").read_text(encoding="utf-8"))["homeassistant"]
    assert declared == core, f"hacs.json declares {declared}, the minimum leg runs {core}"
    assert '"minimum"' in text, "the pytest/typecheck matrix must run the minimum leg"
