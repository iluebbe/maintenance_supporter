"""Tripwire: form/schema bounds must come from the shared constants.

The interval and warning-day caps live in ONE place each
(``const.MAX_INTERVAL_DAYS`` via ``helpers.task_fields.INTERVAL_DAYS_RANGE``,
and ``helpers.task_fields.WARNING_DAYS_RANGE``). A DRY audit (2026-07-10)
found the literals ``max=3650`` / ``max=365`` copy-pasted into a dozen
config-flow selectors and one WS schema — meaning a change to the shared cap
would silently desync the UI forms from ``cap_task_fields`` and the WS
schemas. This test scans the sources so a new hardcoded copy fails CI with a
pointer to the constants instead of shipping.
"""

from __future__ import annotations

import re
from pathlib import Path

COMPONENT = Path(__file__).parent.parent / "custom_components" / "maintenance_supporter"

# Every surface that builds selector/schema bounds for task intervals or
# warning days. New flow modules should be added here.
SCANNED = [
    "config_flow.py",
    "config_flow_trigger.py",
    "config_flow_helpers.py",
    "config_flow_options_task_add.py",
    "config_flow_options_task_crud.py",
    "config_flow_options_task_adaptive.py",
    "websocket/analysis.py",
    "websocket/tasks_crud.py",
]

# The shared caps, as literals that must never reappear inline.
FORBIDDEN = re.compile(r"\bmax=(?:3650|365)\b")


def test_no_hardcoded_interval_or_warning_bounds() -> None:
    offenders: list[str] = []
    for rel in SCANNED:
        path = COMPONENT / rel
        assert path.is_file(), f"scanned file moved/renamed: {rel} — update SCANNED"
        for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if FORBIDDEN.search(line):
                offenders.append(f"{rel}:{lineno}: {line.strip()}")
    assert not offenders, (
        "Hardcoded interval/warning bound(s) found — use INTERVAL_DAYS_RANGE / "
        "WARNING_DAYS_RANGE from helpers.task_fields (or a named module "
        "constant for a deliberate one-off cap):\n" + "\n".join(offenders)
    )


def test_shared_ranges_still_match_const() -> None:
    """The ranges themselves must stay anchored to const.MAX_INTERVAL_DAYS."""
    from custom_components.maintenance_supporter.const import MAX_INTERVAL_DAYS
    from custom_components.maintenance_supporter.helpers.task_fields import (
        INTERVAL_DAYS_RANGE,
        WARNING_DAYS_RANGE,
    )

    assert INTERVAL_DAYS_RANGE == (1, MAX_INTERVAL_DAYS)
    assert WARNING_DAYS_RANGE[0] == 0
    assert WARNING_DAYS_RANGE[1] <= MAX_INTERVAL_DAYS
