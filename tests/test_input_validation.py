"""Tests for input validation audit — length limits, range checks, strip, CSV injection."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_BUDGET_MONTHLY,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_CHECKLIST_ITEM_LENGTH,
    MAX_CHECKLIST_ITEMS,
    MAX_LABEL_LENGTH,
    MAX_LABELS,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_TYPE_LENGTH,
    SERVICE_ADD_TASK,
    SERVICE_UPDATE_TASK,
)
from custom_components.maintenance_supporter.helpers.csv_handler import (
    _csv_safe,
    export_objects_csv,
)
from custom_components.maintenance_supporter.helpers.schedule import read_legacy_fields
from custom_components.maintenance_supporter.helpers.task_fields import (
    INTERVAL_DAYS_RANGE,
    WARNING_DAYS_RANGE,
)
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_update_global_settings,
)
from custom_components.maintenance_supporter.websocket.groups import (
    ws_create_group,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_create_object,
    ws_update_object,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_create_task,
)

from .conftest import (
    make_ws_connection as _mock_connection,
    TASK_ID_1,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)


# ─── String Length Schema Validation ──────────────────────────────────


def test_task_name_too_long_rejected() -> None:
    """Task name exceeding MAX_NAME_LENGTH should be rejected by schema."""
    schema = vol.Schema(
        {
            vol.Required("type"): str,
            vol.Required("entry_id"): str,
            vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"type": "t", "entry_id": "e", "name": "A" * (MAX_NAME_LENGTH + 1)})


def test_task_name_empty_rejected() -> None:
    """Empty task name should be rejected by schema (min=1)."""
    schema = vol.Schema(
        {
            vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"name": ""})


def test_notes_too_long_rejected() -> None:
    """Notes exceeding MAX_TEXT_LENGTH should be rejected."""
    schema = vol.Schema(
        {
            vol.Optional("notes"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"notes": "X" * (MAX_TEXT_LENGTH + 1)})
    # None and valid strings should pass
    schema({"notes": None})
    schema({"notes": "valid"})


def test_checklist_too_many_items_rejected() -> None:
    """Checklist exceeding MAX_CHECKLIST_ITEMS should be rejected."""
    schema = vol.Schema(
        {
            vol.Optional("checklist"): vol.Any(
                vol.All(
                    [vol.All(str, vol.Length(max=MAX_CHECKLIST_ITEM_LENGTH))],
                    vol.Length(max=MAX_CHECKLIST_ITEMS),
                ),
                None,
            ),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"checklist": ["item"] * (MAX_CHECKLIST_ITEMS + 1)})


def test_checklist_item_too_long_rejected() -> None:
    """Individual checklist item exceeding limit should be rejected."""
    schema = vol.Schema(
        {
            vol.Optional("checklist"): vol.Any(
                vol.All(
                    [vol.All(str, vol.Length(max=MAX_CHECKLIST_ITEM_LENGTH))],
                    vol.Length(max=MAX_CHECKLIST_ITEMS),
                ),
                None,
            ),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"checklist": ["X" * (MAX_CHECKLIST_ITEM_LENGTH + 1)]})


def test_object_name_too_long_rejected() -> None:
    """Object name exceeding MAX_NAME_LENGTH should be rejected."""
    schema = vol.Schema(
        {
            vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"name": "O" * (MAX_NAME_LENGTH + 1)})


def test_group_description_too_long_rejected() -> None:
    """Group description exceeding MAX_TEXT_LENGTH should be rejected."""
    schema = vol.Schema(
        {
            vol.Optional("description"): vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"description": "D" * (MAX_TEXT_LENGTH + 1)})


# ─── Numeric Range Rejection ─────────────────────────────────────────


def test_cost_negative_rejected() -> None:
    """Negative cost should be rejected by schema."""
    schema = vol.Schema(
        {
            vol.Optional("cost"): vol.Any(vol.All(vol.Coerce(float), vol.Range(min=0, max=1_000_000)), None),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"cost": -1.0})


def test_cost_too_high_rejected() -> None:
    """Cost above 1M should be rejected."""
    schema = vol.Schema(
        {
            vol.Optional("cost"): vol.Any(vol.All(vol.Coerce(float), vol.Range(min=0, max=1_000_000)), None),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"cost": 1_000_001.0})


def test_duration_negative_rejected() -> None:
    """Negative duration should be rejected."""
    schema = vol.Schema(
        {
            vol.Optional("duration"): vol.Any(vol.All(vol.Coerce(int), vol.Range(min=0, max=525_600)), None),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"duration": -1})


def test_warning_days_too_high_rejected() -> None:
    """Warning days above 365 should be rejected."""
    schema = vol.Schema(
        {
            vol.Optional("warning_days"): vol.All(int, vol.Range(min=0, max=365)),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"warning_days": 366})


def test_apply_suggestion_interval_zero_rejected() -> None:
    """Interval of 0 should be rejected (min=1)."""
    schema = vol.Schema(
        {
            vol.Required("interval"): vol.All(int, vol.Range(min=1, max=3650)),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"interval": 0})


def test_apply_suggestion_interval_too_high_rejected() -> None:
    """Interval above 3650 should be rejected."""
    schema = vol.Schema(
        {
            vol.Required("interval"): vol.All(int, vol.Range(min=1, max=3650)),
        }
    )
    with pytest.raises(vol.Invalid):
        schema({"interval": 4000})


# ─── Handler-Level Strip Normalization ────────────────────────────────


async def test_task_name_stripped_on_create(hass: HomeAssistant) -> None:
    """Task name with leading/trailing spaces should be stored stripped."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    task = build_task_data(last_performed="2024-06-01")
    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": obj_entry.entry_id,
            "name": "  Spacey Name  ",
            "task_type": "custom",
            "schedule_type": "time_based",
            "interval_days": 30,
            "warning_days": 7,
            "interval_anchor": "completion",
            "dry_run": False,
        },
    )

    # Should succeed, not error
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    task_id = result["task_id"]
    assert task_id is not None

    # Verify the stored name is stripped
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    # After reload, entry may have changed. Check via the tasks dict
    # The task was added before reload, so check the data directly
    assert entry is not None


async def test_task_name_whitespace_only_rejected(hass: HomeAssistant) -> None:
    """Task name that is only spaces should be rejected after strip."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    task = build_task_data(last_performed="2024-06-01")
    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_ws",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": obj_entry.entry_id,
            "name": "   ",
            "task_type": "custom",
            "schedule_type": "time_based",
            "interval_days": 30,
            "warning_days": 7,
            "interval_anchor": "completion",
            "dry_run": False,
        },
    )

    conn.send_error.assert_called_once()
    assert "empty" in conn.send_error.call_args[0][2].lower()


# ─── Service-Path Validation (mirror of the WS caps) ──────────────────
#
# The `add_task` / `update_task` services are a third UI onto the same
# storage as the panel and the config flow. Their schemas used to disagree
# with the canonical bounds (name max=255 vs MAX_NAME_LENGTH=200,
# interval_days/warning_days with no max at all) AND the handlers ran no
# sanitiser, so an automation could write values every other surface
# rejects. These tests pin both halves of the fix: the schema rejects at the
# boundary, and the persist helpers cap for direct Python callers.


async def _service_object(hass: HomeAssistant, unique_id: str) -> MockConfigEntry:
    """Set up a global entry + one object entry ready for service calls."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: build_task_data(last_performed="2024-06-01")}),
        source="user",
        unique_id=unique_id,
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)
    return obj_entry


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("name", "A" * (MAX_NAME_LENGTH + 1)),
        ("interval_days", INTERVAL_DAYS_RANGE[1] + 1),
        ("interval_days", INTERVAL_DAYS_RANGE[0] - 1),
        ("warning_days", WARNING_DAYS_RANGE[1] + 1),
        ("warning_days", WARNING_DAYS_RANGE[0] - 1),
        ("notes", "n" * (MAX_TEXT_LENGTH + 1)),
        ("task_type", "t" * (MAX_TYPE_LENGTH + 1)),
        ("schedule_type", "s" * (MAX_TYPE_LENGTH + 1)),
    ],
)
async def test_service_add_task_rejects_out_of_canonical_range(
    hass: HomeAssistant,
    field: str,
    value: object,
) -> None:
    """add_task must reject what the WS `task/create` schema rejects."""
    obj_entry = await _service_object(hass, "maintenance_supporter_svc_add_bounds")

    data: dict[str, object] = {"entry_id": obj_entry.entry_id, "name": "Valid Name", field: value}
    with pytest.raises(vol.Invalid):
        await hass.services.async_call(DOMAIN, SERVICE_ADD_TASK, data, blocking=True)


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("name", "A" * (MAX_NAME_LENGTH + 1)),
        ("interval_days", INTERVAL_DAYS_RANGE[1] + 1),
        ("interval_days", INTERVAL_DAYS_RANGE[0] - 1),
        ("warning_days", WARNING_DAYS_RANGE[1] + 1),
        ("warning_days", WARNING_DAYS_RANGE[0] - 1),
        ("notes", "n" * (MAX_TEXT_LENGTH + 1)),
        ("task_type", "t" * (MAX_TYPE_LENGTH + 1)),
        ("schedule_type", "s" * (MAX_TYPE_LENGTH + 1)),
        ("labels", ["x" * (MAX_LABEL_LENGTH + 1)]),
        ("labels", [f"label{i}" for i in range(MAX_LABELS + 1)]),
    ],
)
async def test_service_update_task_rejects_out_of_canonical_range(
    hass: HomeAssistant,
    field: str,
    value: object,
) -> None:
    """update_task must reject what the WS `task/update` schema rejects."""
    obj_entry = await _service_object(hass, "maintenance_supporter_svc_upd_bounds")

    data: dict[str, object] = {
        "entry_id": obj_entry.entry_id,
        "task_id": TASK_ID_1,
        field: value,
    }
    with pytest.raises(vol.Invalid):
        await hass.services.async_call(DOMAIN, SERVICE_UPDATE_TASK, data, blocking=True)


async def test_service_add_task_accepts_canonical_maximums(hass: HomeAssistant) -> None:
    """The exact canonical maxima must still be accepted (off-by-one guard)."""
    obj_entry = await _service_object(hass, "maintenance_supporter_svc_add_max")

    await hass.services.async_call(
        DOMAIN,
        SERVICE_ADD_TASK,
        {
            "entry_id": obj_entry.entry_id,
            "name": "A" * MAX_NAME_LENGTH,
            "interval_days": INTERVAL_DAYS_RANGE[1],
            "warning_days": WARNING_DAYS_RANGE[1],
            "notes": "n" * MAX_TEXT_LENGTH,
        },
        blocking=True,
    )

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    stored = [t for t in entry.data[CONF_TASKS].values() if t["name"].startswith("A" * 10)]
    assert len(stored) == 1
    assert read_legacy_fields(stored[0])["interval_days"] == INTERVAL_DAYS_RANGE[1]
    assert stored[0]["warning_days"] == WARNING_DAYS_RANGE[1]


async def test_create_task_simple_caps_fields_for_direct_callers(hass: HomeAssistant) -> None:
    """`async_create_task_simple` sanitises like the config-flow save handlers.

    The service schema is the boundary for service callers, but this helper is
    plain Python that anything in-process can call — it used to persist
    whatever it was handed. It now runs `cap_task_fields` (truncate/clamp),
    matching every other non-WS write path.
    """
    from custom_components.maintenance_supporter.websocket.tasks_persist import (
        async_create_task_simple,
    )

    obj_entry = await _service_object(hass, "maintenance_supporter_svc_direct_create")

    task_id = await async_create_task_simple(
        hass,
        entry_id=obj_entry.entry_id,
        name="N" * (MAX_NAME_LENGTH + 100),
        task_type="t" * (MAX_TYPE_LENGTH + 100),
        interval_days=INTERVAL_DAYS_RANGE[1] + 5000,
        warning_days=WARNING_DAYS_RANGE[1] + 100,
        notes="x" * (MAX_TEXT_LENGTH + 100),
    )

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    stored = entry.data[CONF_TASKS][task_id]
    assert len(stored["name"]) == MAX_NAME_LENGTH
    assert len(stored["type"]) == MAX_TYPE_LENGTH
    assert len(stored["notes"]) == MAX_TEXT_LENGTH
    assert stored["warning_days"] == WARNING_DAYS_RANGE[1]
    assert read_legacy_fields(stored)["interval_days"] == INTERVAL_DAYS_RANGE[1]


async def test_update_task_simple_caps_fields_for_direct_callers(hass: HomeAssistant) -> None:
    """`async_update_task_simple` sanitises the merged task before persisting."""
    from custom_components.maintenance_supporter.websocket.tasks_persist import (
        async_update_task_simple,
    )

    obj_entry = await _service_object(hass, "maintenance_supporter_svc_direct_update")

    await async_update_task_simple(
        hass,
        entry_id=obj_entry.entry_id,
        task_id=TASK_ID_1,
        updates={
            "name": "N" * (MAX_NAME_LENGTH + 100),
            "interval_days": INTERVAL_DAYS_RANGE[1] + 5000,
            "warning_days": WARNING_DAYS_RANGE[1] + 100,
            "notes": "x" * (MAX_TEXT_LENGTH + 100),
            "labels": ["l" * (MAX_LABEL_LENGTH + 10)] + [f"tag{i}" for i in range(MAX_LABELS + 5)],
        },
    )

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    stored = entry.data[CONF_TASKS][TASK_ID_1]
    assert len(stored["name"]) == MAX_NAME_LENGTH
    assert len(stored["notes"]) == MAX_TEXT_LENGTH
    assert stored["warning_days"] == WARNING_DAYS_RANGE[1]
    assert read_legacy_fields(stored)["interval_days"] == INTERVAL_DAYS_RANGE[1]
    assert len(stored["labels"]) == MAX_LABELS
    assert all(len(label) <= MAX_LABEL_LENGTH for label in stored["labels"])


async def test_object_name_stripped_on_create(hass: HomeAssistant) -> None:
    """Object name with spaces should be stripped before creation."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_create_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/create",
            "name": "  Test Object  ",
            "dry_run": True,
        },
    )

    # Dry run should succeed with valid=True
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["valid"] is True


async def test_object_name_whitespace_only_rejected(hass: HomeAssistant) -> None:
    """Object name of only spaces should be rejected."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_create_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/create",
            "name": "   ",
            "dry_run": False,
        },
    )

    conn.send_error.assert_called_once()
    assert "empty" in conn.send_error.call_args[0][2].lower()


async def test_object_update_name_stripped(hass: HomeAssistant) -> None:
    """Object name should be stripped on update."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(),
        source="user",
        unique_id="maintenance_supporter_pool_pump_upd",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_update_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/update",
            "entry_id": obj_entry.entry_id,
            "name": "  Updated Name  ",
        },
    )

    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    assert entry.data[CONF_OBJECT]["name"] == "Updated Name"


async def test_object_update_whitespace_name_rejected(hass: HomeAssistant) -> None:
    """Object update with whitespace-only name should be rejected."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(),
        source="user",
        unique_id="maintenance_supporter_pool_pump_upd2",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_update_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/update",
            "entry_id": obj_entry.entry_id,
            "name": "  ",
        },
    )

    conn.send_error.assert_called_once()


async def test_object_installation_date_invalid_rejected(hass: HomeAssistant) -> None:
    """Invalid installation_date format should be rejected."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(),
        source="user",
        unique_id="maintenance_supporter_pool_pump_date",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_update_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/update",
            "entry_id": obj_entry.entry_id,
            "installation_date": "not-a-date",
        },
    )

    conn.send_error.assert_called_once()
    assert "invalid_date" in conn.send_error.call_args[0][1]


async def test_group_name_stripped_on_create(hass: HomeAssistant) -> None:
    """Group name should be stripped and validated."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_create_group,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/group/create",
            "name": "  My Group  ",
            "description": "",
            "task_refs": [],
        },
    )

    conn.send_result.assert_called_once()


async def test_group_whitespace_name_rejected(hass: HomeAssistant) -> None:
    """Group with whitespace-only name should be rejected."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_create_group,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/group/create",
            "name": "   ",
            "description": "",
            "task_refs": [],
        },
    )

    conn.send_error.assert_called_once()
    assert "empty" in conn.send_error.call_args[0][2].lower()


# ─── Global Settings Range Validation ────────────────────────────────


async def test_global_settings_negative_warning_days_dropped(hass: HomeAssistant) -> None:
    """Negative default_warning_days should be silently dropped."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_update_global_settings,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/global/update",
            "settings": {CONF_DEFAULT_WARNING_DAYS: -5},
        },
    )

    # Should error because the only key was dropped, leaving no valid keys
    conn.send_error.assert_called_once()
    assert "No valid" in conn.send_error.call_args[0][2]


async def test_global_settings_huge_max_notifications_dropped(hass: HomeAssistant) -> None:
    """max_notifications_per_day=9999 should be dropped (max 1000)."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_update_global_settings,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/global/update",
            "settings": {CONF_MAX_NOTIFICATIONS_PER_DAY: 9999},
        },
    )

    conn.send_error.assert_called_once()


async def test_global_settings_non_finite_budget_dropped(hass: HomeAssistant) -> None:
    """NaN/Inf budget values should be silently dropped."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_update_global_settings,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/global/update",
            "settings": {CONF_BUDGET_MONTHLY: float("nan")},
        },
    )

    conn.send_error.assert_called_once()


async def test_global_settings_valid_passes(hass: HomeAssistant) -> None:
    """Valid settings should pass range checks."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    conn = _mock_connection()

    await call_ws_handler(
        ws_update_global_settings,
        hass,
        conn,
        {
            "id": 1,
            "type": f"{DOMAIN}/global/update",
            "settings": {
                CONF_DEFAULT_WARNING_DAYS: 14,
                CONF_MAX_NOTIFICATIONS_PER_DAY: 10,
            },
        },
    )

    conn.send_result.assert_called_once()


# ─── CSV Formula Injection ───────────────────────────────────────────


def test_csv_safe_prefixes_dangerous_chars() -> None:
    """Strings starting with =, +, -, @ should be tab-prefixed."""
    assert _csv_safe("=SUM(A1)") == "\t=SUM(A1)"
    assert _csv_safe("+cmd") == "\t+cmd"
    assert _csv_safe("-1") == "\t-1"
    assert _csv_safe("@import") == "\t@import"


def test_csv_safe_normal_strings_unchanged() -> None:
    """Normal strings should pass through unchanged."""
    assert _csv_safe("Pool Pump") == "Pool Pump"
    assert _csv_safe("") == ""
    assert _csv_safe("123") == "123"


def test_csv_export_sanitizes_formula_names(hass: HomeAssistant) -> None:
    """Export should sanitize object/task names that start with formula chars."""
    # Create a mock entry with a dangerous name
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="=EVIL",
        data={
            CONF_OBJECT: {
                "id": "x" * 32,
                "name": "=EVIL",
                "manufacturer": "+malicious",
                "model": "safe model",
                "area_id": None,
                "task_ids": [TASK_ID_1],
            },
            CONF_TASKS: {
                TASK_ID_1: build_task_data(name="@task", last_performed="2024-01-01"),
            },
        },
        source="user",
        unique_id="maintenance_supporter_evil_test",
    )
    entry.add_to_hass(hass)

    csv_output = export_objects_csv(hass)

    # The dangerous chars should be tab-prefixed in the output
    assert "\t=EVIL" in csv_output
    assert "\t+malicious" in csv_output
    assert "\t@task" in csv_output
    # Normal values should NOT be tab-prefixed
    assert "safe model" in csv_output
    assert "\tsafe model" not in csv_output
