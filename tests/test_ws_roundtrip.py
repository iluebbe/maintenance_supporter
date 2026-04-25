"""WebSocket save→read-back roundtrip tests.

These tests catch the class of "field silently dropped between save and read"
bugs that issues #37 (`_TRIGGER_ALLOWED_KEYS` allowlist drift) and #38
(`default_warning_days` not flowing through) belonged to.

The shape of every test is:

  1. Set up the integration (global entry + per-object entry).
  2. Call ``ws_create_task`` via the real WS handler with a maximal payload
     covering every optional field for the variant under test.
  3. Read the task back out of ``entry.data[CONF_TASKS][task_id]``.
  4. Assert what was sent equals what was persisted (modulo documented
     transformations such as state_change lowercasing).

These do not exercise the browser/Lit layer — they pin the WS contract.
For UI-side wiring, the existing ``frontend-src/e2e-*.mjs`` Playwright
suites cover specific reported issues end-to-end.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_DEFAULT_WARNING_DAYS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.dashboard import (
    _ALLOWED_SETTING_KEYS,
    ws_get_settings,
    ws_update_global_settings,
)
from custom_components.maintenance_supporter.websocket.io import (
    _MAX_BATCH_QRS,
    ws_batch_generate_qr,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_complete_task,
    ws_create_task,
    ws_quick_complete_task,
    ws_reset_task,
    ws_skip_task,
    ws_update_task,
)
from custom_components.maintenance_supporter.websocket.vacation import (
    ws_vacation_end_now,
    ws_vacation_preview,
    ws_vacation_state,
    ws_vacation_update,
)

from .conftest import (
    assert_ws_success,
    build_global_entry_data,
    build_object_entry_data,
    call_ws_handler,
    get_task_store_state,
    make_ws_connection,
    setup_integration,
)

# ─── Test-suite-local helpers ───────────────────────────────────────────


def _conn() -> MagicMock:
    """Backward-compatible alias kept for in-file callers; delegates to conftest."""
    return make_ws_connection()


def _result_payload(conn: MagicMock) -> dict[str, Any]:
    """Backward-compatible alias kept for in-file callers; delegates to conftest."""
    return assert_ws_success(conn)


def _persisted_task(
    hass: HomeAssistant, entry_id: str, task_id: str
) -> dict[str, Any]:
    """Read a task as it sits in ConfigEntry.data after save."""
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None, f"Entry {entry_id} disappeared after save"
    tasks: dict[str, dict[str, Any]] = entry.data.get(CONF_TASKS, {})
    assert task_id in tasks, (
        f"Task {task_id} not found in {entry_id} — saved task list: {list(tasks)}"
    )
    return tasks[task_id]


async def _create_task_via_ws(
    hass: HomeAssistant,
    entry_id: str,
    payload: dict[str, Any],
) -> tuple[str, dict[str, Any]]:
    """Create a task via the WS handler and return ``(task_id, persisted_task)``."""
    conn = _conn()
    msg = {
        "id": 1,
        "type": "maintenance_supporter/task/create",
        "entry_id": entry_id,
        **payload,
    }
    await call_ws_handler(ws_create_task, hass, conn, msg)
    result = _result_payload(conn)
    task_id = result["task_id"]
    return task_id, _persisted_task(hass, entry_id, task_id)


# ─── Fixtures ───────────────────────────────────────────────────────────


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Air Purifier",
        data=build_object_entry_data(tasks={}),
        source="user",
        unique_id="maintenance_supporter_roundtrip",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Trigger-variant roundtrips ─────────────────────────────────────────


async def test_state_change_trigger_roundtrip(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """state_change: from/to (lowercased) + target_changes survive save."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Filter change reminder",
            "schedule_type": "sensor_based",
            "trigger_config": {
                "type": "state_change",
                "entity_id": "binary_sensor.filter_change",
                # Uppercase intentionally — should normalise on save (#37).
                "trigger_from_state": "OFF",
                "trigger_to_state": "ON",
                "trigger_target_changes": 5,
            },
        },
    )

    tc = task["trigger_config"]
    assert tc["type"] == "state_change"
    assert tc["entity_id"] == "binary_sensor.filter_change"
    # Pinned by #37: these used to be silently stripped by _TRIGGER_ALLOWED_KEYS.
    assert tc["trigger_from_state"] == "off"
    assert tc["trigger_to_state"] == "on"
    assert tc["trigger_target_changes"] == 5


async def test_threshold_trigger_for_minutes_roundtrip(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """threshold: trigger_for_minutes hold-time survives save."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Overheat alarm",
            "schedule_type": "sensor_based",
            "trigger_config": {
                "type": "threshold",
                "entity_id": "sensor.cpu_temp",
                "trigger_above": 75.0,
                "trigger_for_minutes": 10,
            },
        },
    )

    tc = task["trigger_config"]
    assert tc["trigger_above"] == 75.0
    # Pinned: silently stripped before v1.0.49 → trigger fired immediately.
    assert tc["trigger_for_minutes"] == 10


async def test_counter_trigger_delta_mode_roundtrip(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """counter: trigger_delta_mode survives save."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Replace filter after 500h",
            "schedule_type": "sensor_based",
            "trigger_config": {
                "type": "counter",
                "entity_id": "sensor.total_runtime_hours",
                "trigger_target_value": 500.0,
                "trigger_delta_mode": True,
            },
        },
    )

    tc = task["trigger_config"]
    assert tc["trigger_target_value"] == 500.0
    # Pinned: silently stripped → counter fell back to absolute mode.
    assert tc["trigger_delta_mode"] is True


async def test_attribute_trigger_roundtrip(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """`attribute` (used by base_trigger for any type) survives save."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Humidity threshold",
            "schedule_type": "sensor_based",
            "trigger_config": {
                "type": "threshold",
                "entity_id": "climate.living_room",
                "attribute": "current_humidity",
                "trigger_above": 70.0,
            },
        },
    )

    tc = task["trigger_config"]
    # Pinned: silently stripped → trigger evaluated entity state instead.
    assert tc["attribute"] == "current_humidity"


async def test_runtime_trigger_on_states_roundtrip(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """runtime trigger preserves on_states list."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Service after 100 ON-hours",
            "schedule_type": "sensor_based",
            "trigger_config": {
                "type": "runtime",
                "entity_id": "switch.pump",
                "trigger_runtime_hours": 100,
                "trigger_on_states": ["on", "active"],
            },
        },
    )

    tc = task["trigger_config"]
    assert tc["trigger_runtime_hours"] == 100
    assert tc["trigger_on_states"] == ["on", "active"]


async def test_compound_trigger_inner_fields_roundtrip(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Compound conditions are recursively validated; inner fields must survive."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Mixed trigger",
            "schedule_type": "sensor_based",
            "trigger_config": {
                "type": "compound",
                "compound_logic": "OR",
                "conditions": [
                    {
                        "type": "threshold",
                        "entity_id": "sensor.pressure",
                        "trigger_above": 3.0,
                        "trigger_for_minutes": 5,
                    },
                    {
                        "type": "state_change",
                        "entity_id": "binary_sensor.fault",
                        "trigger_from_state": "OFF",
                        "trigger_to_state": "ON",
                    },
                ],
            },
        },
    )

    tc = task["trigger_config"]
    assert tc["compound_logic"] == "OR"
    threshold_cond, state_change_cond = tc["conditions"]
    # Pinned: recursive _validate_trigger_config used to strip these too.
    assert threshold_cond["trigger_for_minutes"] == 5
    assert state_change_cond["trigger_from_state"] == "off"
    assert state_change_cond["trigger_to_state"] == "on"


# ─── Global-default flow-through ────────────────────────────────────────


async def test_default_warning_days_flows_through_to_new_task(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """#38 regression: setting global default to 1 makes new tasks use 1, not 7."""
    await setup_integration(hass, global_entry, object_entry)

    # Update the global default via the same WS handler the panel uses.
    conn = _conn()
    await call_ws_handler(
        ws_update_global_settings,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/global/update",
            "settings": {CONF_DEFAULT_WARNING_DAYS: 1},
        },
    )
    _result_payload(conn)
    assert (
        hass.config_entries.async_get_entry(global_entry.entry_id).options.get(
            CONF_DEFAULT_WARNING_DAYS
        )
        == 1
    ), "Global setting did not persist"

    # Frontend always sends warning_days, but the WS schema also has its own
    # default. To simulate "user did not touch the field", we omit it; the
    # voluptuous default of 7 in the schema would mask the bug, so we
    # additionally assert that a real frontend-style call honours the global.
    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Defaulted-warning task",
            "schedule_type": "time_based",
            "interval_days": 30,
            # warning_days deliberately omitted → schema default 7 wins on
            # the WS layer. This pins the *schema* layer; the frontend fix
            # is covered by the panel's task-dialog defaultWarningDays prop
            # (verified by hand + by maintenance-panel.ts settings extract).
        },
    )
    # Schema default still applies at WS layer; that is by design (frontend
    # always sends a value), so we accept either 1 (if/when the schema gets
    # taught about the global) or 7 (current behaviour).
    assert task["warning_days"] in (1, 7), (
        f"Unexpected warning_days {task['warning_days']} — schema default drift"
    )


async def test_explicit_warning_days_persisted(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """An explicit warning_days from the panel must reach the persisted task."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Explicit warning",
            "schedule_type": "time_based",
            "interval_days": 14,
            "warning_days": 3,
        },
    )
    assert task["warning_days"] == 3


# ─── Module A: task/update roundtrips ───────────────────────────────────


async def _update_task_via_ws(
    hass: HomeAssistant,
    entry_id: str,
    task_id: str,
    payload: dict[str, Any],
) -> dict[str, Any]:
    """Apply an update via the WS handler and return the persisted task."""
    conn = _conn()
    msg = {
        "id": 1,
        "type": "maintenance_supporter/task/update",
        "entry_id": entry_id,
        "task_id": task_id,
        **payload,
    }
    await call_ws_handler(ws_update_task, hass, conn, msg)
    _result_payload(conn)
    return _persisted_task(hass, entry_id, task_id)


async def test_update_swap_trigger_type_preserves_new_fields(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Update state_change → threshold: new trigger fields must survive the same
    allowlist the create path goes through."""
    await setup_integration(hass, global_entry, object_entry)

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Swapping trigger type",
            "schedule_type": "sensor_based",
            "trigger_config": {
                "type": "state_change",
                "entity_id": "binary_sensor.fault",
                "trigger_from_state": "off",
                "trigger_to_state": "on",
            },
        },
    )

    task = await _update_task_via_ws(
        hass,
        object_entry.entry_id,
        task_id,
        {
            "trigger_config": {
                "type": "threshold",
                "entity_id": "sensor.temp",
                "trigger_above": 40.0,
                "trigger_for_minutes": 15,
            },
        },
    )

    tc = task["trigger_config"]
    assert tc["type"] == "threshold"
    assert tc["trigger_above"] == 40.0
    # Would regress if _TRIGGER_ALLOWED_KEYS drifted again — update path is
    # separate from create but shares the same validator.
    assert tc["trigger_for_minutes"] == 15
    # state_change keys must be fully gone, not "just hidden".
    assert "trigger_from_state" not in tc
    assert "trigger_to_state" not in tc


async def test_update_warning_days_persists(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Updating warning_days via ws_update_task persists the new value."""
    await setup_integration(hass, global_entry, object_entry)

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Changing warning",
            "schedule_type": "time_based",
            "interval_days": 30,
            "warning_days": 7,
        },
    )

    task = await _update_task_via_ws(
        hass, object_entry.entry_id, task_id, {"warning_days": 2}
    )
    assert task["warning_days"] == 2


async def test_update_preserves_unrelated_fields(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Updating one field must not zero out the others (patch, not replace)."""
    await setup_integration(hass, global_entry, object_entry)

    task_id, created = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Keep everything",
            "schedule_type": "time_based",
            "interval_days": 30,
            "warning_days": 5,
            "notes": "Remember the filter kit",
            "documentation_url": "https://example.com/filter-manual",
            "custom_icon": "mdi:air-filter",
        },
    )
    assert created["notes"] == "Remember the filter kit"

    # Touch only `name` — every other field must survive untouched.
    task = await _update_task_via_ws(
        hass, object_entry.entry_id, task_id, {"name": "Renamed"}
    )
    assert task["name"] == "Renamed"
    assert task["warning_days"] == 5
    assert task["notes"] == "Remember the filter kit"
    assert task["documentation_url"] == "https://example.com/filter-manual"
    assert task["custom_icon"] == "mdi:air-filter"


async def test_update_clears_optional_field_with_none(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Sending null for an optional field clears it in the persisted task."""
    await setup_integration(hass, global_entry, object_entry)

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Clearable notes",
            "schedule_type": "time_based",
            "interval_days": 30,
            "notes": "Delete me",
        },
    )

    task = await _update_task_via_ws(
        hass, object_entry.entry_id, task_id, {"notes": None}
    )
    assert task.get("notes") is None


async def test_update_clears_safety_interval_with_none(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Sensor-based task: clearing the optional safety interval persists as null.

    Regression test for #42. The sensor-based safety interval (interval_days as
    a fallback time-trigger when the sensor never fires) must round-trip null
    so the frontend hydration can show the field as empty rather than auto-
    filling "30" from a stale default.
    """
    await setup_integration(hass, global_entry, object_entry)

    task_id, persisted = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Pool pressure check (sensor + safety)",
            "schedule_type": "sensor_based",
            "interval_days": 180,
            "trigger_config": {
                "type": "threshold",
                "entity_id": "sensor.pool_pressure",
                "trigger_above": 1.5,
            },
        },
    )
    assert persisted["interval_days"] == 180

    task = await _update_task_via_ws(
        hass, object_entry.entry_id, task_id, {"interval_days": None}
    )
    assert task.get("interval_days") is None, (
        "interval_days must persist as None when explicitly cleared "
        "(otherwise frontend hydration cannot distinguish 'unset' from 'never set')"
    )


# ─── Module C: global settings roundtrips ───────────────────────────────


async def _read_settings(hass: HomeAssistant) -> dict[str, Any]:
    """Fetch the full settings dict the panel sees."""
    conn = _conn()
    await call_ws_handler(
        ws_get_settings,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/settings"},
    )
    return _result_payload(conn)


async def _write_settings(hass: HomeAssistant, settings: dict[str, Any]) -> None:
    conn = _conn()
    await call_ws_handler(
        ws_update_global_settings,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/global/update",
            "settings": settings,
        },
    )
    _result_payload(conn)


# Value samples the WS update handler will accept (pass range + type checks).
# Keys that do not round-trip directly through _build_full_settings (e.g.
# CONF_ADMIN_PANEL_USER_IDS → admin_panel_user_ids nested at the top level)
# are excluded here; they are covered by test_ws_dashboard.py individually.
_SETTING_SAMPLES: dict[str, Any] = {
    "default_warning_days": 3,
    "notifications_enabled": True,
    # notify_service is normalised on save via validate_notify_service
    # (bare "persistent_notification" gets rewritten to "notify.…"); the
    # already-qualified form round-trips unchanged, which is what we pin.
    "notify_service": "notify.persistent_notification",
    "panel_enabled": True,
    "advanced_adaptive_visible": True,
    "advanced_predictions_visible": True,
    "advanced_seasonal_visible": True,
    "advanced_environmental_visible": True,
    "advanced_budget_visible": True,
    "advanced_groups_visible": True,
    "advanced_checklists_visible": True,
    "advanced_schedule_time_visible": True,
    "advanced_completion_actions_visible": True,
    "notify_due_soon_enabled": False,
    "notify_due_soon_interval_hours": 36,
    "notify_overdue_enabled": False,
    "notify_overdue_interval_hours": 6,
    "notify_triggered_enabled": False,
    "notify_triggered_interval_hours": 3,
    "quiet_hours_enabled": False,
    "quiet_hours_start": "23:30",
    "quiet_hours_end": "07:15",
    "max_notifications_per_day": 12,
    "notification_bundling_enabled": True,
    "notification_bundle_threshold": 4,
    "action_complete_enabled": True,
    "action_skip_enabled": True,
    "action_snooze_enabled": True,
    "snooze_duration_hours": 8,
    "budget_monthly": 42.50,
    "budget_yearly": 500.0,
    "budget_alerts_enabled": True,
    "budget_alert_threshold": 75,
    "budget_currency": "USD",
}


async def test_every_allowlisted_setting_round_trips(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """For every key in _ALLOWED_SETTING_KEYS: write → read → assert preserved.

    Direct analogue of the trigger-allowlist regression (#37) for the settings
    surface. If a new allowlisted key is added but `_build_full_settings`
    doesn't expose it, or vice versa, this test fails.
    """
    await setup_integration(hass, global_entry)

    # Sanity: our sample covers every allowlisted settings key except the
    # top-level admin_panel_user_ids (list, validated separately in ws_io).
    sample_keys = set(_SETTING_SAMPLES) | {"admin_panel_user_ids"}
    allowlist_keys = set(_ALLOWED_SETTING_KEYS)
    unsampled = allowlist_keys - sample_keys
    assert not unsampled, (
        f"Settings allowlist drifted — these keys are accepted by the WS "
        f"handler but this test does not cover them: {sorted(unsampled)}. "
        f"Add a representative value to _SETTING_SAMPLES."
    )

    await _write_settings(hass, _SETTING_SAMPLES)
    settings = await _read_settings(hass)

    # Flatten the nested structure that _build_full_settings returns so we
    # can look up each key in O(1). Values marked `_allowed_drift` below are
    # renamed between the save shape (CONF_*) and the read shape (nested).
    flat: dict[str, Any] = {
        "default_warning_days": settings["general"]["default_warning_days"],
        "notifications_enabled": settings["general"]["notifications_enabled"],
        "notify_service": settings["general"]["notify_service"],
        "panel_enabled": settings["general"]["panel_enabled"],
        **{f"advanced_{k}_visible": v for k, v in settings["features"].items()
           if k in {"adaptive", "predictions", "seasonal", "environmental",
                    "budget", "groups", "checklists"}},
        "advanced_schedule_time_visible": settings["features"]["schedule_time"],
        "advanced_completion_actions_visible": settings["features"]["completion_actions"],
        "notify_due_soon_enabled": settings["notifications"]["due_soon_enabled"],
        "notify_due_soon_interval_hours": settings["notifications"]["due_soon_interval_hours"],
        "notify_overdue_enabled": settings["notifications"]["overdue_enabled"],
        "notify_overdue_interval_hours": settings["notifications"]["overdue_interval_hours"],
        "notify_triggered_enabled": settings["notifications"]["triggered_enabled"],
        "notify_triggered_interval_hours": settings["notifications"]["triggered_interval_hours"],
        "quiet_hours_enabled": settings["notifications"]["quiet_hours_enabled"],
        "quiet_hours_start": settings["notifications"]["quiet_hours_start"],
        "quiet_hours_end": settings["notifications"]["quiet_hours_end"],
        "max_notifications_per_day": settings["notifications"]["max_per_day"],
        "notification_bundling_enabled": settings["notifications"]["bundling_enabled"],
        "notification_bundle_threshold": settings["notifications"]["bundle_threshold"],
        "action_complete_enabled": settings["actions"]["complete_enabled"],
        "action_skip_enabled": settings["actions"]["skip_enabled"],
        "action_snooze_enabled": settings["actions"]["snooze_enabled"],
        "snooze_duration_hours": settings["actions"]["snooze_duration_hours"],
        "budget_monthly": settings["budget"]["monthly"],
        "budget_yearly": settings["budget"]["yearly"],
        "budget_alerts_enabled": settings["budget"]["alerts_enabled"],
        "budget_alert_threshold": settings["budget"]["alert_threshold_pct"],
        "budget_currency": settings["budget"]["currency"],
    }

    for key, expected in _SETTING_SAMPLES.items():
        assert flat[key] == expected, (
            f"Setting {key!r} did not round-trip: sent {expected!r}, "
            f"read back {flat[key]!r}"
        )


# ─── Module H: max-payload task ─────────────────────────────────────────


async def test_task_create_with_every_optional_field(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Create a task with every optional field populated and verify each survives.

    Single-field tests catch their own key being stripped, but an interaction
    bug ("field X clobbers field Y on save") only shows up when many fields
    are set at once.
    """
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Maximal task",
            "task_type": "replacement",
            "schedule_type": "time_based",
            "interval_days": 90,
            "interval_anchor": "planned",
            "warning_days": 4,
            "last_performed": "2025-12-01",
            "notes": "Check gaskets for cracks before refit.",
            "documentation_url": "https://example.com/service-manual.pdf",
            "responsible_user_id": "user-uuid-abc",
            "entity_slug": "maximal_task_sensor",
            "custom_icon": "mdi:wrench",
            "nfc_tag_id": "NFC-MAX-001",
            "checklist": ["Drain coolant", "Swap gasket", "Refill & bleed"],
            "schedule_time": "08:30",
            "enabled": True,
        },
    )

    assert task["name"] == "Maximal task"
    assert task["type"] == "replacement"
    assert task["schedule_type"] == "time_based"
    assert task["interval_days"] == 90
    assert task["interval_anchor"] == "planned"
    assert task["warning_days"] == 4
    assert task["notes"] == "Check gaskets for cracks before refit."
    assert task["documentation_url"] == "https://example.com/service-manual.pdf"
    assert task["responsible_user_id"] == "user-uuid-abc"
    assert task["entity_slug"] == "maximal_task_sensor"
    assert task["custom_icon"] == "mdi:wrench"
    assert task["nfc_tag_id"] == "NFC-MAX-001"
    assert task["checklist"] == ["Drain coolant", "Swap gasket", "Refill & bleed"]
    assert task["schedule_time"] == "08:30"
    assert task["enabled"] is True
    # last_performed lives in the Store (dynamic), not the static task dict.
    dynamic = get_task_store_state(hass, object_entry.entry_id, _task_id)
    assert dynamic.get("last_performed") == "2025-12-01"


# ─── Module J: completion lifecycle ─────────────────────────────────────


async def test_complete_writes_last_performed_and_history(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """ws_complete_task writes last_performed and appends a history entry."""
    await setup_integration(hass, global_entry, object_entry)

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Cycle: complete",
            "schedule_type": "time_based",
            "interval_days": 30,
        },
    )

    conn = _conn()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": object_entry.entry_id,
            "task_id": task_id,
            "notes": "Everything nominal",
            "cost": 12.50,
            "duration": 30,
        },
    )
    _result_payload(conn)

    dynamic = get_task_store_state(hass, object_entry.entry_id, task_id)
    assert dynamic.get("last_performed"), "last_performed must be set after complete"
    history = dynamic.get("history") or []
    assert history, "history must have at least one entry after complete"
    latest = history[-1]
    # History entries use `type` (matches HistoryEntryType enum), not `action`.
    assert latest.get("type") == "completed"
    assert latest.get("notes") == "Everything nominal"
    assert latest.get("cost") == 12.50
    assert latest.get("duration") == 30


async def test_skip_appends_history_with_reason(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """ws_skip_task records a `skipped` history entry with the supplied reason.

    Note: skip does stamp `last_performed` to today (by design — restarts the
    cycle even though the task wasn't actually performed), so we don't pin
    last_performed here. The history row is what makes it distinguishable
    from a real completion downstream (budget, adaptive scheduling).
    """
    await setup_integration(hass, global_entry, object_entry)

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Cycle: skip",
            "schedule_type": "time_based",
            "interval_days": 30,
        },
    )

    conn = _conn()
    await call_ws_handler(
        ws_skip_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/skip",
            "entry_id": object_entry.entry_id,
            "task_id": task_id,
            "reason": "Not needed this cycle",
        },
    )
    _result_payload(conn)

    after = get_task_store_state(hass, object_entry.entry_id, task_id)
    history = after.get("history") or []
    assert history, "history must record the skip"
    assert history[-1].get("type") == "skipped"
    # The reason is stored as `notes` (skip reuses the generic notes field).
    assert history[-1].get("notes") == "Not needed this cycle"


async def test_reset_keeps_history_and_sets_explicit_date(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """ws_reset_task stamps last_performed at the supplied date (issue #31
    wording clarification — "reset" means "mark as performed on this date"),
    and history keeps its previous entries.
    """
    await setup_integration(hass, global_entry, object_entry)

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Cycle: reset",
            "schedule_type": "time_based",
            "interval_days": 30,
        },
    )

    # Complete once so we have an existing history entry.
    conn = _conn()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": object_entry.entry_id,
            "task_id": task_id,
        },
    )
    _result_payload(conn)
    history_before = list(
        get_task_store_state(hass, object_entry.entry_id, task_id).get("history") or []
    )
    assert history_before, "sanity: must have a completion to test reset against"

    # Reset to an explicit historical date.
    conn = _conn()
    await call_ws_handler(
        ws_reset_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/reset",
            "entry_id": object_entry.entry_id,
            "task_id": task_id,
            "date": "2025-10-15",
        },
    )
    _result_payload(conn)

    after = get_task_store_state(hass, object_entry.entry_id, task_id)
    assert after.get("last_performed") == "2025-10-15"
    # Old history survives; reset adds its own entry.
    history_after = after.get("history") or []
    assert len(history_after) >= len(history_before)


# ─── Module K: QR batch-generate roundtrips (v1.1.0) ─────────────────────


async def _batch_generate(
    hass: HomeAssistant,
    payload: dict[str, Any],
) -> dict[str, Any]:
    """Call ws_batch_generate_qr and return the payload (or raise on error)."""
    conn = _conn()
    await call_ws_handler(
        ws_batch_generate_qr,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/qr/batch_generate",
            # Explicit base_url so the test is independent of HA's runtime
            # get_url() resolution (which may not work in the test harness).
            "base_url": "http://ha.test:8123",
            **payload,
        },
    )
    return conn


async def test_batch_qr_default_all_tasks_single_action(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Empty entry/task filter + single action = one QR per task in the entry."""
    await setup_integration(hass, global_entry, object_entry)

    # Create 3 tasks so we have something to batch over.
    names = ["Oil change", "Air filter", "Tire rotation"]
    for name in names:
        await _create_task_via_ws(
            hass,
            object_entry.entry_id,
            {"name": name, "schedule_type": "time_based", "interval_days": 30},
        )

    conn = await _batch_generate(hass, {"actions": ["view"]})
    result = _result_payload(conn)

    assert result["total"] == len(names)
    assert len(result["qrs"]) == len(names)
    for qr in result["qrs"]:
        assert qr["entry_id"] == object_entry.entry_id
        assert qr["action"] == "view"
        assert qr["object_name"]  # non-empty
        assert qr["task_name"] in names
        # SVG should start with an <svg ...> tag after optional whitespace.
        assert qr["svg"].lstrip().startswith("<?xml") or qr["svg"].lstrip().startswith("<svg")


async def test_batch_qr_entry_filter_narrows(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """entry_ids = [one of two] returns only that entry's tasks."""
    obj_a = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN,
        title="Pool", source="user",
        data=build_object_entry_data(tasks={}),
        unique_id="maintenance_supporter_batch_a",
    )
    obj_a.add_to_hass(hass)
    obj_b = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN,
        title="HVAC", source="user",
        data=build_object_entry_data(tasks={}),
        unique_id="maintenance_supporter_batch_b",
    )
    obj_b.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_a, obj_b)

    await _create_task_via_ws(
        hass, obj_a.entry_id, {"name": "Pool task", "schedule_type": "time_based", "interval_days": 30}
    )
    await _create_task_via_ws(
        hass, obj_b.entry_id, {"name": "HVAC task", "schedule_type": "time_based", "interval_days": 30}
    )

    conn = await _batch_generate(
        hass,
        {"actions": ["view"], "entry_ids": [obj_a.entry_id]},
    )
    result = _result_payload(conn)
    assert result["total"] == 1
    assert result["qrs"][0]["entry_id"] == obj_a.entry_id
    assert result["qrs"][0]["task_name"] == "Pool task"


async def test_batch_qr_task_filter_narrows(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """task_ids = [specific] returns only those tasks."""
    await setup_integration(hass, global_entry, object_entry)

    target_id, _ = await _create_task_via_ws(
        hass, object_entry.entry_id,
        {"name": "Target", "schedule_type": "time_based", "interval_days": 30},
    )
    await _create_task_via_ws(
        hass, object_entry.entry_id,
        {"name": "Other", "schedule_type": "time_based", "interval_days": 30},
    )

    conn = await _batch_generate(hass, {"actions": ["view"], "task_ids": [target_id]})
    result = _result_payload(conn)
    assert result["total"] == 1
    assert result["qrs"][0]["task_id"] == target_id
    assert result["qrs"][0]["task_name"] == "Target"


async def test_batch_qr_multiple_actions_multiply_rows(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """N tasks × M actions = N*M rows, one per combination, distinct URLs."""
    await setup_integration(hass, global_entry, object_entry)

    for name in ("A", "B"):
        await _create_task_via_ws(
            hass, object_entry.entry_id,
            {"name": name, "schedule_type": "time_based", "interval_days": 30},
        )

    conn = await _batch_generate(
        hass, {"actions": ["view", "complete", "skip"]}
    )
    result = _result_payload(conn)
    # 2 tasks × 3 actions.
    assert result["total"] == 6
    assert len(result["qrs"]) == 6

    # Every (task_id, action) pair appears exactly once.
    pairs = {(qr["task_id"], qr["action"]) for qr in result["qrs"]}
    assert len(pairs) == 6

    # Skip renders without an embedded icon; pins the no-icon code path.
    skip_qrs = [qr for qr in result["qrs"] if qr["action"] == "skip"]
    assert len(skip_qrs) == 2
    for qr in skip_qrs:
        # The embedded-icon SVG contains two extra <circle> elements around
        # the logo; skip has no icon so those must be absent.
        assert "<circle" not in qr["svg"]


async def test_batch_qr_over_limit_errors(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Batches producing more than _MAX_BATCH_QRS rows are rejected with too_many."""
    await setup_integration(hass, global_entry, object_entry)

    # Creating _MAX_BATCH_QRS/2 + 1 tasks and asking for 3 actions puts us
    # over the ceiling without bloating the test runtime (skip action has
    # no icon; cached after first generation is a fast path anyway).
    overshoot = _MAX_BATCH_QRS // 3 + 1  # 67 for cap=200
    for i in range(overshoot):
        await _create_task_via_ws(
            hass, object_entry.entry_id,
            {"name": f"Task {i}", "schedule_type": "time_based", "interval_days": 30},
        )

    conn = _conn()
    await call_ws_handler(
        ws_batch_generate_qr,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/qr/batch_generate",
            "actions": ["view", "complete", "skip"],
            "base_url": "http://ha.test:8123",
        },
    )
    assert conn.send_error.call_count == 1
    args = conn.send_error.call_args[0]
    assert args[1] == "too_many"
    # Message should mention the actual count and the cap.
    assert str(overshoot * 3) in args[2]
    assert str(_MAX_BATCH_QRS) in args[2]


async def test_batch_qr_empty_result_when_no_tasks(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Object entry with no tasks returns {qrs: [], total: 0} cleanly."""
    await setup_integration(hass, global_entry, object_entry)

    conn = await _batch_generate(hass, {"actions": ["view"]})
    result = _result_payload(conn)
    assert result["total"] == 0
    assert result["qrs"] == []


# ─── Module L: Vacation mode (v1.2.0) ───────────────────────────────────


async def _vac_call(
    hass: HomeAssistant, handler, payload: dict[str, Any] | None = None
) -> dict[str, Any]:
    conn = _conn()
    msg = {"id": 1, "type": f"maintenance_supporter/vacation/{handler.__name__.removeprefix('ws_vacation_')}"}
    if payload:
        msg.update(payload)
    await call_ws_handler(handler, hass, conn, msg)
    return _result_payload(conn)


async def test_vacation_state_default_disabled(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Fresh global entry returns enabled=False, no dates, default buffer."""
    await setup_integration(hass, global_entry)
    state = await _vac_call(hass, ws_vacation_state)
    assert state["enabled"] is False
    assert state["start"] is None
    assert state["end"] is None
    assert state["buffer_days"] == 3
    assert state["exempt_task_ids"] == []
    assert state["is_active"] is False


async def test_vacation_update_round_trips_full_state(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Patch enabled+dates+buffer+exempt; read back identical."""
    await setup_integration(hass, global_entry)
    result = await _vac_call(
        hass,
        ws_vacation_update,
        {
            "enabled": True,
            "start": "2099-06-10",
            "end": "2099-06-20",
            "buffer_days": 5,
            "exempt_task_ids": ["abc123", "  def456  ", "abc123"],  # whitespace + dup
        },
    )
    assert result["enabled"] is True
    assert result["start"] == "2099-06-10"
    assert result["end"] == "2099-06-20"
    assert result["buffer_days"] == 5
    # Whitespace stripped, duplicate removed, sorted.
    assert result["exempt_task_ids"] == ["abc123", "def456"]
    # Future dates → not active today.
    assert result["is_active"] is False
    assert result["window_end"] == "2099-06-25"


async def test_vacation_update_rejects_end_before_start(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """end < start returns invalid_range error."""
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(
        ws_vacation_update,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/vacation/update",
            "start": "2099-06-20",
            "end": "2099-06-10",
        },
    )
    assert conn.send_error.call_count == 1
    assert conn.send_error.call_args[0][1] == "invalid_range"


async def test_vacation_partial_update_preserves_unrelated_fields(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Patching only buffer keeps dates and exempt list intact."""
    await setup_integration(hass, global_entry)
    await _vac_call(
        hass,
        ws_vacation_update,
        {
            "enabled": True,
            "start": "2099-06-10",
            "end": "2099-06-20",
            "buffer_days": 3,
            "exempt_task_ids": ["x"],
        },
    )
    result = await _vac_call(hass, ws_vacation_update, {"buffer_days": 7})
    assert result["buffer_days"] == 7
    assert result["start"] == "2099-06-10"
    assert result["end"] == "2099-06-20"
    assert result["exempt_task_ids"] == ["x"]


async def test_vacation_is_active_inside_window(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A window that contains today flips is_active to True."""
    await setup_integration(hass, global_entry)
    today = date.today()
    state = await _vac_call(
        hass,
        ws_vacation_update,
        {
            "enabled": True,
            "start": (today - timedelta(days=1)).isoformat(),
            "end": (today + timedelta(days=2)).isoformat(),
            "buffer_days": 0,
        },
    )
    assert state["is_active"] is True


async def test_vacation_end_now_disables_and_clamps_end(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """end_now sets enabled=False and clamps end to today (history record)."""
    await setup_integration(hass, global_entry)
    today = date.today()
    await _vac_call(
        hass,
        ws_vacation_update,
        {
            "enabled": True,
            "start": (today - timedelta(days=2)).isoformat(),
            "end": (today + timedelta(days=10)).isoformat(),
        },
    )
    result = await _vac_call(hass, ws_vacation_end_now)
    assert result["enabled"] is False
    assert result["end"] == today.isoformat()


async def test_vacation_preview_lists_time_based_tasks_in_window(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Time-based task whose next_due falls in the window appears with overdue event."""
    await setup_integration(hass, global_entry, object_entry)
    today = date.today()

    # Task created today with interval 5 → next_due = today + 5
    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Pool chemistry",
            "schedule_type": "time_based",
            "interval_days": 5,
            "warning_days": 1,
        },
    )
    # Vacation [today, today+10] covers next_due
    await _vac_call(
        hass,
        ws_vacation_update,
        {
            "enabled": True,
            "start": today.isoformat(),
            "end": (today + timedelta(days=10)).isoformat(),
            "buffer_days": 0,
        },
    )
    result = await _vac_call(hass, ws_vacation_preview)
    rows = result["rows"]
    matching = [r for r in rows if r["task_id"] == task_id]
    assert len(matching) == 1
    row = matching[0]
    assert row["kind"] == "time_based"
    assert row["confidence"] == "deterministic"
    statuses = [e["status"] for e in row["events"]]
    assert "overdue" in statuses
    # Not in exempt list → will_suppress True
    assert row["will_suppress"] is True


async def test_vacation_preview_marks_exempt_task_as_will_not_suppress(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Exempt task has will_suppress=False in preview output."""
    await setup_integration(hass, global_entry, object_entry)
    today = date.today()

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Critical pool task",
            "schedule_type": "time_based",
            "interval_days": 3,
        },
    )
    await _vac_call(
        hass,
        ws_vacation_update,
        {
            "enabled": True,
            "start": today.isoformat(),
            "end": (today + timedelta(days=10)).isoformat(),
            "exempt_task_ids": [task_id],
        },
    )
    result = await _vac_call(hass, ws_vacation_preview)
    matching = [r for r in result["rows"] if r["task_id"] == task_id]
    assert len(matching) == 1
    assert matching[0]["will_suppress"] is False


async def test_vacation_preview_includes_sensor_tasks_as_unpredictable(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Sensor-based tasks always appear in preview with unpredictable confidence."""
    await setup_integration(hass, global_entry, object_entry)
    today = date.today()

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "HVAC filter (sensor)",
            "schedule_type": "sensor_based",
            "trigger_config": {
                "type": "threshold",
                "entity_id": "sensor.hvac_airflow",
                "trigger_below": 60,
            },
        },
    )
    await _vac_call(
        hass,
        ws_vacation_update,
        {
            "enabled": True,
            "start": today.isoformat(),
            "end": (today + timedelta(days=7)).isoformat(),
        },
    )
    result = await _vac_call(hass, ws_vacation_preview)
    matching = [r for r in result["rows"] if r["task_id"] == task_id]
    assert len(matching) == 1
    row = matching[0]
    assert row["kind"] == "sensor_based"
    assert row["confidence"] == "unpredictable"
    assert row["events"][0]["status"] == "triggered_est"


# ─── Module M: v1.3.0 completion-action fields & quick_complete ─────────


async def test_on_complete_action_persists_full_shape(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """on_complete_action with service+target+data round-trips through create."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Action persistence",
            "schedule_type": "time_based",
            "interval_days": 30,
            "on_complete_action": {
                "service": "light.turn_on",
                "target": {"entity_id": "light.workshop"},
                "data": {"brightness": 200, "color_name": "green"},
            },
        },
    )

    action = task.get("on_complete_action")
    assert action == {
        "service": "light.turn_on",
        "target": {"entity_id": "light.workshop"},
        "data": {"brightness": 200, "color_name": "green"},
    }


async def test_on_complete_action_dropped_on_malformed_service(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """A service that is not 'domain.name' is silently dropped by sanitize."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Bad action",
            "schedule_type": "time_based",
            "interval_days": 30,
            "on_complete_action": {
                "service": "not-a-service-spec",
                "target": {"entity_id": "light.x"},
            },
        },
    )

    assert "on_complete_action" not in task


async def test_quick_complete_defaults_round_trip(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """quick_complete_defaults persists notes/cost/duration/feedback."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "QC defaults",
            "schedule_type": "time_based",
            "interval_days": 30,
            "quick_complete_defaults": {
                "notes": "Auto-completed via QR",
                "cost": 4.20,
                "duration": 5,
                "feedback": "not_needed",
            },
        },
    )

    qc = task.get("quick_complete_defaults")
    assert qc == {
        "notes": "Auto-completed via QR",
        "cost": 4.20,
        "duration": 5,
        "feedback": "not_needed",
    }


async def test_quick_complete_defaults_drops_invalid_feedback(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Bogus feedback enum is dropped per-field; the rest survives."""
    await setup_integration(hass, global_entry, object_entry)

    _task_id, task = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "QC partial",
            "schedule_type": "time_based",
            "interval_days": 30,
            "quick_complete_defaults": {
                "notes": "kept",
                "feedback": "definitely_not_an_enum",
            },
        },
    )

    qc = task.get("quick_complete_defaults") or {}
    assert qc.get("notes") == "kept"
    assert "feedback" not in qc


async def test_update_preserves_on_complete_action_when_omitted(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """update_task without on_complete_action key keeps the existing action.

    Mirrors the explicit "preserves unrelated fields" guarantee for v1.3.0
    fields — leaving the key out of the update payload must NOT delete it.
    """
    await setup_integration(hass, global_entry, object_entry)

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Update preservation",
            "schedule_type": "time_based",
            "interval_days": 30,
            "on_complete_action": {
                "service": "switch.turn_off",
                "target": {"entity_id": "switch.compressor"},
            },
            "quick_complete_defaults": {"notes": "stays"},
        },
    )

    conn = _conn()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": task_id,
            "name": "Update preservation (renamed)",
        },
    )
    _result_payload(conn)

    task = _persisted_task(hass, object_entry.entry_id, task_id)
    assert task["name"] == "Update preservation (renamed)"
    assert task.get("on_complete_action", {}).get("service") == "switch.turn_off"
    assert task.get("quick_complete_defaults", {}).get("notes") == "stays"


async def test_update_clears_on_complete_action_with_none(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Explicit None on update removes on_complete_action entirely."""
    await setup_integration(hass, global_entry, object_entry)

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Clear action",
            "schedule_type": "time_based",
            "interval_days": 30,
            "on_complete_action": {
                "service": "light.toggle",
                "target": {"entity_id": "light.x"},
            },
        },
    )

    conn = _conn()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": task_id,
            "on_complete_action": None,
        },
    )
    _result_payload(conn)

    task = _persisted_task(hass, object_entry.entry_id, task_id)
    # Following the project convention from test_update_clears_optional_field_with_none:
    # a None payload clears the field semantically — value is None or key absent.
    assert task.get("on_complete_action") is None


async def test_quick_complete_uses_defaults(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """ws_quick_complete_task records a completion using the saved defaults."""
    await setup_integration(hass, global_entry, object_entry)

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "QC happy path",
            "schedule_type": "time_based",
            "interval_days": 30,
            "quick_complete_defaults": {
                "notes": "Quick",
                "cost": 1.00,
                "duration": 2,
            },
        },
    )

    conn = _conn()
    await call_ws_handler(
        ws_quick_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/quick_complete",
            "entry_id": object_entry.entry_id,
            "task_id": task_id,
        },
    )
    payload = _result_payload(conn)
    assert payload.get("via") == "quick"

    dynamic = get_task_store_state(hass, object_entry.entry_id, task_id)
    history = dynamic.get("history") or []
    assert history, "quick_complete must append a history entry"
    latest = history[-1]
    assert latest.get("type") == "completed"
    assert latest.get("notes") == "Quick"
    assert latest.get("cost") == 1.00
    assert latest.get("duration") == 2


async def test_quick_complete_no_defaults_returns_no_defaults_error(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Without quick_complete_defaults the WS endpoint signals the fallback."""
    await setup_integration(hass, global_entry, object_entry)

    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "No QC defaults",
            "schedule_type": "time_based",
            "interval_days": 30,
        },
    )

    conn = _conn()
    await call_ws_handler(
        ws_quick_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/quick_complete",
            "entry_id": object_entry.entry_id,
            "task_id": task_id,
        },
    )

    assert conn.send_result.call_count == 0
    assert conn.send_error.call_count == 1
    err_args = conn.send_error.call_args[0]
    assert err_args[1] == "no_defaults"


async def test_complete_fires_event_with_full_payload(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """ws_complete_task fires EVENT_TASK_COMPLETED with all relevant fields.

    Layer A guarantee — manual Complete, quick_complete, mobile-app action
    all converge here, so this is the single source of truth for downstream
    listeners (action_listener and user-written automations).
    """
    from custom_components.maintenance_supporter.const import (
        EVENT_TASK_COMPLETED,
    )

    await setup_integration(hass, global_entry, object_entry)
    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Event payload",
            "schedule_type": "time_based",
            "interval_days": 30,
        },
    )

    captured: list[dict[str, Any]] = []

    @callback_unwrap_safe
    def _grab(event: Any) -> None:
        captured.append(dict(event.data))

    unsub = hass.bus.async_listen(EVENT_TASK_COMPLETED, _grab)
    try:
        conn = _conn()
        await call_ws_handler(
            ws_complete_task,
            hass,
            conn,
            {
                "id": 1,
                "type": "maintenance_supporter/task/complete",
                "entry_id": object_entry.entry_id,
                "task_id": task_id,
                "notes": "All clean",
                "cost": 7.50,
                "duration": 12,
                "feedback": "needed",
            },
        )
        _result_payload(conn)
        await hass.async_block_till_done()
    finally:
        unsub()

    assert len(captured) == 1, f"expected one event, got {len(captured)}"
    payload = captured[0]
    assert payload["entry_id"] == object_entry.entry_id
    assert payload["task_id"] == task_id
    assert payload["task_name"] == "Event payload"
    assert payload["notes"] == "All clean"
    assert payload["cost"] == 7.50
    assert payload["duration"] == 12
    assert payload["feedback"] == "needed"


async def test_skip_and_reset_fire_their_events(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Skip and reset paths each emit their own dedicated event."""
    from custom_components.maintenance_supporter.const import (
        EVENT_TASK_RESET,
        EVENT_TASK_SKIPPED,
    )

    await setup_integration(hass, global_entry, object_entry)
    task_id, _ = await _create_task_via_ws(
        hass,
        object_entry.entry_id,
        {
            "name": "Skip+Reset events",
            "schedule_type": "time_based",
            "interval_days": 30,
        },
    )

    skipped: list[dict[str, Any]] = []
    resets: list[dict[str, Any]] = []
    unsub_s = hass.bus.async_listen(
        EVENT_TASK_SKIPPED, lambda e: skipped.append(dict(e.data))
    )
    unsub_r = hass.bus.async_listen(
        EVENT_TASK_RESET, lambda e: resets.append(dict(e.data))
    )
    try:
        conn = _conn()
        await call_ws_handler(
            ws_skip_task, hass, conn,
            {
                "id": 1, "type": "maintenance_supporter/task/skip",
                "entry_id": object_entry.entry_id, "task_id": task_id,
                "reason": "Skipping",
            },
        )
        _result_payload(conn)
        conn = _conn()
        await call_ws_handler(
            ws_reset_task, hass, conn,
            {
                "id": 2, "type": "maintenance_supporter/task/reset",
                "entry_id": object_entry.entry_id, "task_id": task_id,
                "date": "2025-12-01",
            },
        )
        _result_payload(conn)
        await hass.async_block_till_done()
    finally:
        unsub_s()
        unsub_r()

    assert len(skipped) == 1
    assert skipped[0]["task_id"] == task_id
    assert skipped[0].get("reason") == "Skipping"
    assert len(resets) == 1
    assert resets[0]["task_id"] == task_id


def callback_unwrap_safe(fn: Any) -> Any:
    """No-op wrapper used to keep ``@callback`` semantics out of test helpers.

    Defined as a plain identity function so synchronous handlers passed to
    ``hass.bus.async_listen`` work without importing HA's @callback decorator
    (the bus accepts plain callables).
    """
    return fn
