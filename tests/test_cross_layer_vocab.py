"""Cross-layer guard tests: the TypeScript frontend hardcodes vocabulary that
mirrors backend constants (interval units, schedule kinds). Nothing at build
time keeps the two in sync, so these tests fail CI the moment one side drifts —
the documented parallel-maintenance hazard from the DRY audit.

They read the .ts sources as text (regex) rather than importing them, so they
run in the normal pytest environment with no Node toolchain.
"""

from __future__ import annotations

import re
from pathlib import Path

from custom_components.maintenance_supporter.const import ScheduleType
from custom_components.maintenance_supporter.helpers.dates import INTERVAL_UNITS
from custom_components.maintenance_supporter.helpers.schedule import (
    _CALENDAR_KINDS,
    KIND_MANUAL,
    KIND_ONE_TIME,
)

_FRONTEND_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter" / "frontend-src"


def _read(rel: str) -> str:
    return (_FRONTEND_SRC / rel).read_text(encoding="utf-8")


def _string_array(source: str, const_name: str) -> list[str]:
    """Extract the string literals from `const <const_name> = [...]` in TS."""
    m = re.search(rf"{const_name}\s*=\s*\[([^\]]*)\]", source)
    assert m, f"{const_name} not found in TS source"
    return re.findall(r'"([^"]+)"', m.group(1))


def _object_keys(source: str, const_name: str) -> list[str]:
    """Extract the top-level keys of a `const <name>: ... = { ... }` TS object."""
    m = re.search(rf"{const_name}[^=]*=\s*\{{(.*?)\n\}}", source, re.DOTALL)
    assert m, f"{const_name} not found in TS source"
    return re.findall(r"^\s*([A-Za-z_][\w]*)\s*:", m.group(1), re.MULTILINE)


def test_ts_unit_days_matches_backend_interval_units() -> None:
    """frontend helpers/interval.ts UNIT_DAYS keys == backend INTERVAL_UNITS."""
    ts_units = set(_object_keys(_read("helpers/interval.ts"), "UNIT_DAYS"))
    assert ts_units == set(INTERVAL_UNITS), (
        "UNIT_DAYS (interval.ts) drifted from backend INTERVAL_UNITS "
        f"(helpers/dates.py): TS={sorted(ts_units)} vs PY={sorted(INTERVAL_UNITS)}"
    )


def test_ts_calendar_kinds_matches_backend() -> None:
    """task-dialog.ts CALENDAR_KINDS == backend _CALENDAR_KINDS."""
    ts_cal = set(_string_array(_read("components/task-dialog.ts"), "CALENDAR_KINDS"))
    assert ts_cal == set(_CALENDAR_KINDS), (
        "CALENDAR_KINDS (task-dialog.ts) drifted from backend _CALENDAR_KINDS "
        f"(schedule.py): TS={sorted(ts_cal)} vs PY={sorted(_CALENDAR_KINDS)}"
    )


def test_ts_schedule_type_keys_match_backend_vocab() -> None:
    """task-dialog.ts SCHEDULE_TYPE_KEYS == ScheduleType values ∪ calendar kinds.

    The FE surfaces backend KIND_INTERVAL as the flat ScheduleType "time_based"
    (bridged by legacy_schedule_type), so the expected set is the flat
    ScheduleType enum plus the three nested calendar kinds.
    """
    ts_keys = set(_string_array(_read("components/task-dialog.ts"), "SCHEDULE_TYPE_KEYS"))
    expected = {s.value for s in ScheduleType} | set(_CALENDAR_KINDS)
    assert ts_keys == expected, (
        "SCHEDULE_TYPE_KEYS (task-dialog.ts) drifted from backend schedule vocab: "
        f"TS={sorted(ts_keys)} vs expected={sorted(expected)}"
    )
    # Guard the bridge assumptions the test encodes: manual & one_time are shared
    # flat kinds present on both sides.
    assert KIND_MANUAL in ts_keys and KIND_ONE_TIME in ts_keys
