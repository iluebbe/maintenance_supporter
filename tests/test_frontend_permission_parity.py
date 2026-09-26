"""Frontend permission gating ↔ backend WS tiers (DRY audit 2026-09-26).

``frontend-src/helpers/permissions.ts`` is the frontend twin of
``helpers/permissions.py``: ``canWrite()`` mirrors ``user_can_write`` and
``HOUSEHOLD_ACTIONS`` lists the commands behind the actions the UI offers to
EVERY household member (Complete / Skip / Reset / Postpone / Snooze / phase
cursor / checklist ticks). Before, the panel hid Reset / Postpone / Snooze
from non-writers although the server takes them from anyone, while the
Lovelace dialogs gated write actions on ``is_admin`` alone.

These tests tie the TS list to the frozen tier inventory in
``test_ws_permission_matrix._EXPECTED_TIERS``: every household action must be
READ tier, and every read-tier ``task/*`` command that changes a task must be
a household action — so moving a command to another tier (or adding a new
state-changing one) fails CI until the frontend gating follows.
"""

from __future__ import annotations

import re
from pathlib import Path

from .test_ws_permission_matrix import _EXPECTED_TIERS

_PERMISSIONS_TS = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "maintenance_supporter"
    / "frontend-src"
    / "helpers"
    / "permissions.ts"
)
_PREFIX = "maintenance_supporter/"

# Read-tier task/* commands that only READ — everything else under task/ in
# the read tier changes the task and therefore is a household action.
_READ_ONLY_TASK_QUERIES = frozenset(
    {
        "task/analyze_interval",
        "task/history",
        "task/list",
    }
)


def _household_actions() -> list[str]:
    src = _PERMISSIONS_TS.read_text(encoding="utf-8")
    start = src.index("export const HOUSEHOLD_ACTIONS")
    block = src[start : src.index("] as const", start)]
    actions = re.findall(r'"([a-z_/]+)"', block)
    assert actions, "no HOUSEHOLD_ACTIONS parsed from permissions.ts"
    return actions


def test_household_actions_are_read_tier() -> None:
    """The UI offers these to everyone — the server must accept them from
    everyone (no write/admin gate)."""
    wrong = {cmd: _EXPECTED_TIERS.get(_PREFIX + cmd, "<not registered>") for cmd in _household_actions()}
    wrong = {cmd: tier for cmd, tier in wrong.items() if tier != "read"}
    assert not wrong, f"HOUSEHOLD_ACTIONS in permissions.ts that are not read tier on the server: {wrong}"


def test_every_state_changing_read_task_command_is_a_household_action() -> None:
    """A read-tier task command that changes state and is missing from the
    TS list would stay hidden behind canWrite() in the UI although any
    member may run it (the panel's old Reset / Postpone / Snooze gap)."""
    read_task_cmds = {
        cmd.removeprefix(_PREFIX) for cmd, tier in _EXPECTED_TIERS.items() if tier == "read" and cmd.startswith(_PREFIX + "task/")
    }
    expected = read_task_cmds - _READ_ONLY_TASK_QUERIES
    assert set(_household_actions()) == expected, (
        "permissions.ts HOUSEHOLD_ACTIONS drifted from the read-tier task commands "
        f"(missing: {sorted(expected - set(_household_actions()))}, "
        f"extra: {sorted(set(_household_actions()) - expected)}) — "
        "or a new read-only query belongs in _READ_ONLY_TASK_QUERIES"
    )


def test_can_write_mirrors_user_can_write() -> None:
    """canWrite() carries the same three rules as permissions.user_can_write:
    no user → False, admin → True, else delegation switch AND allowlist."""
    src = _PERMISSIONS_TS.read_text(encoding="utf-8").replace("\r\n", "\n")
    body = src[src.index("export function canWrite") :]
    body = body[: body.index("\n}\n") + 2]
    assert "if (!user) return false;" in body
    assert "if (user.is_admin) return true;" in body
    assert "access.operatorWriteEnabled && access.operatorIds.includes(user.id)" in body
