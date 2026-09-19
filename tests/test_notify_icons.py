"""#185: notification icons — per-type defaults, per-kind defaults, the
per-task override, and the ``mdi:`` shape check.

Pins: every ``MaintenanceTypeEnum`` value has a default, every task-less
notification kind has one, the resolution order is task override → battery
fleet → type → kind → fallback, and ``is_valid_icon`` accepts exactly the
``mdi:word(-word)*`` shape up to the length cap.
"""

from __future__ import annotations

import pytest

from custom_components.maintenance_supporter.const import (
    BATTERY_FLEET_TASK_FLAG,
    MAX_NOTIFY_ICON_LENGTH,
    MaintenanceTypeEnum,
)
from custom_components.maintenance_supporter.helpers.notify_hooks import NOTIFICATION_KINDS
from custom_components.maintenance_supporter.helpers.notify_icons import (
    BATTERY_FLEET_NOTIFY_ICON,
    DEFAULT_NOTIFY_ICONS,
    FALLBACK_NOTIFY_ICON,
    KIND_NOTIFY_ICONS,
    is_valid_icon,
    normalize_icon,
    notify_icon_for,
)


def test_every_maintenance_type_has_a_valid_default() -> None:
    assert set(DEFAULT_NOTIFY_ICONS) == {t.value for t in MaintenanceTypeEnum}
    for icon in DEFAULT_NOTIFY_ICONS.values():
        assert is_valid_icon(icon), icon
    assert DEFAULT_NOTIFY_ICONS["cleaning"] == "mdi:broom"
    assert DEFAULT_NOTIFY_ICONS["inspection"] == "mdi:magnify"
    assert DEFAULT_NOTIFY_ICONS["replacement"] == "mdi:swap-horizontal"
    assert DEFAULT_NOTIFY_ICONS["calibration"] == "mdi:tune"
    assert DEFAULT_NOTIFY_ICONS["service"] == "mdi:wrench"
    assert DEFAULT_NOTIFY_ICONS["reading"] == "mdi:counter"
    assert DEFAULT_NOTIFY_ICONS["custom"] == FALLBACK_NOTIFY_ICON == "mdi:wrench-clock"


def test_every_task_less_kind_has_a_valid_default() -> None:
    """Kinds that always carry a task (status, lead_time) resolve through the
    type table; every other kind in the notification matrix needs its own."""
    task_bound = {"status", "lead_time"}
    assert set(KIND_NOTIFY_ICONS) == set(NOTIFICATION_KINDS) - task_bound
    for icon in KIND_NOTIFY_ICONS.values():
        assert is_valid_icon(icon), icon
    assert KIND_NOTIFY_ICONS["bundle"] == KIND_NOTIFY_ICONS["digest"] == "mdi:clipboard-list-outline"
    assert KIND_NOTIFY_ICONS["quiet_end"] == "mdi:weather-sunset-up"
    assert KIND_NOTIFY_ICONS["warranty"] == "mdi:shield-check-outline"
    assert KIND_NOTIFY_ICONS["completed"] == "mdi:check-circle-outline"
    assert KIND_NOTIFY_ICONS["test"] == "mdi:bell-ring-outline"
    assert is_valid_icon(BATTERY_FLEET_NOTIFY_ICON)


@pytest.mark.parametrize(
    "value",
    ["mdi:broom", "mdi:air-filter", "mdi:battery-alert-variant-outline", "mdi:numeric-1-box", "mdi:a"],
)
def test_is_valid_icon_accepts_mdi_names(value: str) -> None:
    assert is_valid_icon(value)


@pytest.mark.parametrize(
    "value",
    [
        "",
        "broom",
        "mdi:",
        "mdi:Broom",
        "mdi:air filter",
        "mdi:air--filter",
        "mdi:-air",
        "mdi:air-",
        "hass:broom",
        "mdi:air_filter",
        " mdi:broom",
        "mdi:broom\n",
        "mdi:" + "a" * MAX_NOTIFY_ICON_LENGTH,
        None,
        42,
        ["mdi:broom"],
    ],
)
def test_is_valid_icon_refuses_the_rest(value: object) -> None:
    assert not is_valid_icon(value)


def test_normalize_icon_strips_and_drops_invalid() -> None:
    assert normalize_icon("  mdi:broom ") == "mdi:broom"
    assert normalize_icon("") is None
    assert normalize_icon("   ") is None
    assert normalize_icon("nope") is None
    assert normalize_icon(None) is None
    assert normalize_icon(7) is None


def test_precedence_task_override_beats_type_beats_kind() -> None:
    # 1. the task's own override wins over everything
    assert notify_icon_for({"type": "cleaning", "notify_icon": "mdi:robot-vacuum"}, "status") == "mdi:robot-vacuum"
    assert notify_icon_for({"type": "cleaning", "notify_icon": "mdi:robot-vacuum"}, "completed") == "mdi:robot-vacuum"
    # ... but a malformed / empty override is ignored, not sent
    assert notify_icon_for({"type": "cleaning", "notify_icon": "broken icon"}, "status") == "mdi:broom"
    assert notify_icon_for({"type": "cleaning", "notify_icon": ""}, "status") == "mdi:broom"
    assert notify_icon_for({"type": "cleaning", "notify_icon": None}, "status") == "mdi:broom"
    # 2. the type default
    assert notify_icon_for({"type": "reading"}, "status") == "mdi:counter"
    assert notify_icon_for({"type": MaintenanceTypeEnum.SERVICE}, "lead_time") == "mdi:wrench"
    # 3. the kind default when the task carries no known type
    assert notify_icon_for({"type": "something-else"}, "bundle") == "mdi:clipboard-list-outline"
    assert notify_icon_for(None, "digest") == "mdi:clipboard-list-outline"
    assert notify_icon_for({}, "test") == "mdi:bell-ring-outline"
    assert notify_icon_for(None, "warranty") == "mdi:shield-check-outline"
    # 4. the fallback
    assert notify_icon_for(None, None) == FALLBACK_NOTIFY_ICON
    assert notify_icon_for({}, "unknown-kind") == FALLBACK_NOTIFY_ICON
    assert notify_icon_for({"type": "custom"}, "status") == FALLBACK_NOTIFY_ICON


def test_completed_kind_keeps_its_own_icon_unless_the_task_overrides() -> None:
    """A completion is news, not a reminder — the check mark beats the type
    default; only the task's own override outranks it."""
    assert notify_icon_for({"type": "cleaning"}, "completed") == "mdi:check-circle-outline"
    assert notify_icon_for({"type": "cleaning", "notify_icon": "mdi:party-popper"}, "completed") == "mdi:party-popper"


def test_battery_fleet_task_gets_the_battery_icon() -> None:
    fleet = {"type": "replacement", BATTERY_FLEET_TASK_FLAG: True}
    assert notify_icon_for(fleet, "status") == BATTERY_FLEET_NOTIFY_ICON
    assert notify_icon_for({**fleet, "notify_icon": "mdi:battery-heart"}, "status") == "mdi:battery-heart"
    assert notify_icon_for({"type": "replacement", BATTERY_FLEET_TASK_FLAG: False}, "status") == "mdi:swap-horizontal"


def test_frontend_default_map_matches_backend() -> None:
    """#185: the task dialog shows the type default from its own copy of the
    map (`frontend-src/helpers/notify-icons.ts`) — keep it identical."""
    import re
    from pathlib import Path

    from custom_components.maintenance_supporter.helpers.notify_icons import DEFAULT_NOTIFY_ICONS, FALLBACK_NOTIFY_ICON

    ts = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter" / "frontend-src" / "helpers" / "notify-icons.ts"
    text = ts.read_text(encoding="utf-8")
    block = text.split("NOTIFY_ICON_DEFAULTS", 1)[1].split("};", 1)[0]
    ts_map = dict(re.findall(r'\n\s*(\w+):\s*"([^"]+)"', block))
    assert ts_map == dict(DEFAULT_NOTIFY_ICONS), "frontend-src/helpers/notify-icons.ts drifted from helpers/notify_icons.py"
    assert f'NOTIFY_ICON_FALLBACK = "{FALLBACK_NOTIFY_ICON}"' in text

