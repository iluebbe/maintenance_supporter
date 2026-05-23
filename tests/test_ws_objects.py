"""Tests for WebSocket object CRUD handlers (websocket/objects.py)."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket import (
    _build_object_response,
    _build_task_summary,
)
from custom_components.maintenance_supporter.websocket.groups import (
    ws_create_group,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_create_object,
    ws_delete_object,
    ws_get_object,
    ws_get_objects,
    ws_update_object,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(
            object_data=build_object_data(
                name="Pool Pump", area_id="backyard",
                manufacturer="Pentair", model="SuperFlo",
            ),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_pool_pump_ws_obj",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Get Objects ──────────────────────────────────────────────────────────


async def test_ws_get_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test getting all objects."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "objects" in result
    assert len(result["objects"]) == 1
    assert result["objects"][0]["object"]["name"] == "Pool Pump"


async def test_ws_get_objects_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test getting objects when none exist."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})

    result = conn.send_result.call_args[0][1]
    assert result["objects"] == []


# ─── Get Single Object ────────────────────────────────────────────────────


async def test_ws_get_object(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test getting a single object."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object",
        "entry_id": object_entry.entry_id,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["object"]["name"] == "Pool Pump"
    assert len(result["tasks"]) == 1


async def test_ws_get_object_exposes_completion_action_fields(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Regression for issue #50.

    The /object response builder must include ``on_complete_action`` and
    ``quick_complete_defaults`` so the task-edit dialog can hydrate the
    completion-action form on reload. Until this fix the fields were
    silently stripped — user saved the action, reopened the dialog, saw
    empty fields, then any edit to another field overwrote the persisted
    action with null because the dialog re-sends its (empty) local state.
    """
    task = build_task_data(last_performed="2024-06-01")
    task["on_complete_action"] = {
        "service": "button.press",
        "target": {"entity_id": "button.james_reset_sensor"},
    }
    task["quick_complete_defaults"] = {"notes": "vacuum dock pressed", "cost": 0.0}
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Vacuum",
        data=build_object_entry_data(
            object_data=build_object_data(name="Vacuum"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_vacuum_repro_50",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object",
        "entry_id": entry.entry_id,
    })

    result = conn.send_result.call_args[0][1]
    assert len(result["tasks"]) == 1
    task_resp = result["tasks"][0]

    assert "on_complete_action" in task_resp, (
        "Issue #50: on_complete_action must be in WS response so task-edit "
        "dialog can hydrate the completion-action form on reload"
    )
    assert task_resp["on_complete_action"] == {
        "service": "button.press",
        "target": {"entity_id": "button.james_reset_sensor"},
    }

    assert "quick_complete_defaults" in task_resp, (
        "Issue #50 follow-up: quick_complete_defaults has the same bug pattern"
    )
    assert task_resp["quick_complete_defaults"] == {
        "notes": "vacuum dock pressed", "cost": 0.0,
    }


async def test_ws_get_object_exposes_every_persisted_task_field(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Audit test for the issue #50 + #48 pattern: ANY field that lives in
    ``entry.data[CONF_TASKS][task_id]`` and that the frontend's
    MaintenanceTask interface (frontend-src/types.ts) declares as user-
    facing MUST appear in the WS response, otherwise the task-edit dialog
    silently shows empty fields and the next save wipes the persisted value.

    This is the failure mode that caused issue #48 (suggested_area sync)
    and again issue #50 (on_complete_action). Adding any new persisted
    task field requires adding it to ``_build_task_summary``; this test
    is the tripwire.

    Source-of-truth: every key set in this fixture must round-trip.
    """
    task_id = "f" * 32
    fully_loaded_task: dict[str, Any] = {
        "id": task_id,
        "object_id": "obj_audit",
        "name": "Audit Task",
        "type": "service",
        "enabled": True,
        "schedule_type": "time_based",
        "interval_days": 30,
        "interval_unit": "months",
        "due_date": "2026-09-01",
        "interval_anchor": "planned",
        "warning_days": 5,
        "last_performed": "2025-12-01",
        "schedule_time": "09:30",
        "notes": "audit notes",
        "documentation_url": "https://example.com/manual.pdf",
        # responsible_user_id intentionally omitted: integration setup
        # purges any uuid that's not in the live auth registry (orphan
        # cleanup). The field is exposed by _build_task_summary at line
        # ~125 and has its own dedicated tests in
        # test_user_assignment.py — covered, just not by THIS audit.
        "entity_slug": "audit_task",
        "custom_icon": "mdi:wrench",
        "nfc_tag_id": "nfc-abc-123",
        "checklist": ["Step 1", "Step 2"],
        # v1.3.0 — missing until issue #50
        "on_complete_action": {
            "service": "input_boolean.toggle",
            "target": {"entity_id": "input_boolean.test"},
        },
        "quick_complete_defaults": {"notes": "default", "cost": 9.99, "duration": 15},
    }
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Audit",
        data=build_object_entry_data(
            object_data=build_object_data(name="Audit"),
            tasks={task_id: fully_loaded_task},
        ),
        source="user",
        unique_id="maintenance_supporter_audit_full_field_check",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object",
        "entry_id": entry.entry_id,
    })

    result = conn.send_result.call_args[0][1]
    task_resp = result["tasks"][0]

    # Every persisted user-facing field must round-trip non-null.
    # (object_id is internal; created_at is backend-only — both intentionally
    # excluded from the response.)
    expected_persisted_fields = [
        "id", "name", "type", "enabled", "schedule_type",
        "interval_days", "interval_unit", "due_date",
        "interval_anchor", "warning_days",
        "last_performed", "schedule_time",
        "notes", "documentation_url",
        "entity_slug", "custom_icon", "nfc_tag_id",
        "checklist",
        "on_complete_action", "quick_complete_defaults",
    ]
    missing: list[str] = [
        f for f in expected_persisted_fields
        if f not in task_resp or task_resp[f] in (None, "")
    ]
    assert not missing, (
        f"Tripwire: WS response is missing or null for persisted fields: "
        f"{missing}. Same failure mode as issue #50 — extend "
        f"_build_task_summary in websocket/__init__.py to expose them."
    )

    # Spot-check exact value preservation for the v1.3.0 fields that
    # caused the original regression
    assert task_resp["on_complete_action"]["service"] == "input_boolean.toggle"
    assert task_resp["quick_complete_defaults"]["cost"] == 9.99


async def test_ws_get_object_exposes_every_persisted_object_field(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Tripwire (issue #50 pattern) for the object meta — same audit as
    the task version but for ``_build_object_response.object``. Object
    fields all happen to be exposed correctly today, but this test pins
    that and trips if anyone adds a new persisted field to objects
    without exposing it in the response.
    """
    obj_data = build_object_data(
        name="Audit Object",
        area_id="garage",
        manufacturer="ACME",
        model="Widget X",
        serial_number="SN-12345",
    )
    obj_data["installation_date"] = "2024-01-15"
    obj_data["documentation_url"] = "https://example.com/manual.pdf"
    obj_data["notes"] = "Audit notes"

    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Audit Object",
        data=build_object_entry_data(object_data=obj_data),
        source="user",
        unique_id="maintenance_supporter_audit_object_field_check",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object",
        "entry_id": entry.entry_id,
    })

    obj_resp = conn.send_result.call_args[0][1]["object"]

    expected_fields = [
        "id", "name", "area_id", "manufacturer", "model",
        "serial_number", "installation_date", "documentation_url", "notes",
    ]
    missing = [f for f in expected_fields
               if f not in obj_resp or obj_resp[f] in (None, "")]
    assert not missing, (
        f"Tripwire (issue #50 pattern, object edition): _build_object_response "
        f"is missing/null for persisted object fields: {missing}"
    )


async def test_ws_get_object_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test getting non-existent object."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object",
        "entry_id": "nonexistent",
    })

    conn.send_error.assert_called_once()


# ─── Create Object ────────────────────────────────────────────────────────


async def test_ws_create_object_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test creating a basic object."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_create_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "New Object",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "entry_id" in result


async def test_ws_create_object_all_fields(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test creating object with all optional fields."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_create_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "Full Object",
        "area_id": "garage",
        "manufacturer": "Bosch",
        "model": "X100",
        "serial_number": "SN-12345",
    })

    conn.send_result.assert_called_once()
    # Verify serial_number persisted to the new config entry
    entries = [e for e in hass.config_entries.async_entries("maintenance_supporter") if e.title == "Full Object"]
    assert len(entries) == 1
    assert entries[0].data[CONF_OBJECT]["serial_number"] == "SN-12345"


async def test_ws_create_object_dry_run(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test dry run for object creation."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_create_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "Dry Run Object",
        "dry_run": True,
    })

    result = conn.send_result.call_args[0][1]
    assert result["valid"] is True
    assert result["entry_id"] is None


# ─── Update Object ────────────────────────────────────────────────────────


async def test_ws_update_object_name(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test updating object name."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "name": "Updated Pump",
    })

    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert entry.data[CONF_OBJECT]["name"] == "Updated Pump"
    assert entry.title == "Updated Pump"


async def test_ws_update_object_multiple(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test updating multiple object fields."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "manufacturer": "Hayward",
        "model": "MaxFlo",
        "serial_number": "ABC-789",
        "area_id": "pool_house",
    })

    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    obj = entry.data[CONF_OBJECT]
    assert obj["manufacturer"] == "Hayward"
    assert obj["model"] == "MaxFlo"
    assert obj["serial_number"] == "ABC-789"
    assert obj["area_id"] == "pool_house"


async def test_ws_create_and_update_object_with_documentation_url(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """v1.4.0 (#43): documentation_url round-trips through create + update.

    Pinning the per-object 'manual / docs link' field. Includes the safe-URL
    rejection on update (mirrors the existing task documentation_url path)
    and the explicit-clear semantic (sending null clears the field).
    """
    await setup_integration(hass, global_entry, object_entry)

    # Update with valid URL → persisted
    conn = _mock_connection()
    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "documentation_url": "https://example.com/manual.pdf",
    })
    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert entry.data[CONF_OBJECT]["documentation_url"] == "https://example.com/manual.pdf"

    # Update with javascript: URL → rejected
    conn = _mock_connection()
    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 2, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "documentation_url": "javascript:alert(1)",
    })
    conn.send_error.assert_called_once()
    err_args = conn.send_error.call_args[0]
    assert err_args[1] == "invalid_url"
    # Old value must remain intact after the rejected update
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry.data[CONF_OBJECT]["documentation_url"] == "https://example.com/manual.pdf"

    # Update with null → cleared
    conn = _mock_connection()
    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 3, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "documentation_url": None,
    })
    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry.data[CONF_OBJECT]["documentation_url"] is None

    # Create with documentation_url → persisted on the new entry
    conn = _mock_connection()
    await call_ws_handler(ws_create_object, hass, conn, {
        "id": 4, "type": "maintenance_supporter/object/create",
        "name": "Object With Manual",
        "documentation_url": "https://vendor.example/Quick-Guide.pdf",
    })
    conn.send_result.assert_called_once()
    entries = [
        e for e in hass.config_entries.async_entries("maintenance_supporter")
        if e.title == "Object With Manual"
    ]
    assert len(entries) == 1
    assert entries[0].data[CONF_OBJECT]["documentation_url"] == "https://vendor.example/Quick-Guide.pdf"


async def test_ws_create_and_update_object_with_notes(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """v1.4.10 (#46): notes round-trips through create + update.

    Notes are free-form multiline text. They strip leading/trailing whitespace
    but preserve internal newlines. Empty string clears to None.
    """
    await setup_integration(hass, global_entry, object_entry)

    # Update with multiline note → persisted, internal newlines kept
    note = "Filter: PN ACE-7800-X\nReplacement procedure: 1. Power off  2. Open\n3. Replace cartridge"
    conn = _mock_connection()
    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "notes": note,
    })
    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert entry.data[CONF_OBJECT]["notes"] == note

    # Whitespace-only string → cleared to None (treated as "no notes")
    conn = _mock_connection()
    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 2, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "notes": "   \n  ",
    })
    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry.data[CONF_OBJECT]["notes"] is None

    # Explicit null → cleared
    conn = _mock_connection()
    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 3, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "notes": None,
    })
    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry.data[CONF_OBJECT]["notes"] is None

    # Create with notes → persisted on the new entry
    conn = _mock_connection()
    await call_ws_handler(ws_create_object, hass, conn, {
        "id": 4, "type": "maintenance_supporter/object/create",
        "name": "Object With Notes",
        "notes": "Spare key in garage drawer",
    })
    conn.send_result.assert_called_once()
    entries = [
        e for e in hass.config_entries.async_entries("maintenance_supporter")
        if e.title == "Object With Notes"
    ]
    assert len(entries) == 1
    assert entries[0].data[CONF_OBJECT]["notes"] == "Spare key in garage drawer"


async def test_ws_update_object_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test updating non-existent object."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/update",
        "entry_id": "nonexistent",
        "name": "Test",
    })

    conn.send_error.assert_called_once()


# ─── Delete Object ────────────────────────────────────────────────────────


async def test_ws_delete_object(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test deleting an object."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_delete_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/delete",
        "entry_id": object_entry.entry_id,
    })

    conn.send_result.assert_called_once()
    assert conn.send_result.call_args[0][1]["success"] is True


async def test_ws_delete_object_cleans_group_refs(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test that deleting an object removes its references from groups."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    # Create a group referencing a task in the object we'll delete
    await call_ws_handler(ws_create_group, hass, conn, {
        "id": 10, "type": "maintenance_supporter/group/create",
        "name": "Test Group",
        "task_refs": [
            {"entry_id": object_entry.entry_id, "task_id": TASK_ID_1},
            {"entry_id": "other_entry", "task_id": "other_task"},
        ],
    })
    group_id = conn.send_result.call_args[0][1]["group_id"]
    conn.reset_mock()

    # Delete the object
    await call_ws_handler(ws_delete_object, hass, conn, {
        "id": 11, "type": "maintenance_supporter/object/delete",
        "entry_id": object_entry.entry_id,
    })
    conn.send_result.assert_called_once()

    # Verify group no longer references the deleted object's tasks
    ge = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert ge is not None
    refs = ge.options["groups"][group_id]["task_refs"]
    assert len(refs) == 1
    assert refs[0]["entry_id"] == "other_entry"


async def test_ws_delete_object_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test deleting non-existent object."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_delete_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/delete",
        "entry_id": "nonexistent",
    })

    conn.send_error.assert_called_once()


# ─── Unit Tests: Build Helpers ────────────────────────────────────────────


def test_build_task_summary_trigger_info(hass: HomeAssistant) -> None:
    """Test _build_task_summary enriches trigger entity info."""
    hass.states.async_set("sensor.temp", "25.0", {
        "friendly_name": "Temperature",
        "unit_of_measurement": "°C",
    })

    task_data = {
        "name": "Test", "type": "custom",
        "trigger_config": {"entity_id": "sensor.temp", "type": "threshold"},
    }

    result = _build_task_summary(hass, "tid", task_data, None)
    assert result["trigger_entity_info"] is not None
    assert result["trigger_entity_info"]["friendly_name"] == "Temperature"
    assert result["trigger_entity_info"]["unit_of_measurement"] == "°C"


def test_build_task_summary_multi_entity(hass: HomeAssistant) -> None:
    """Test _build_task_summary with multiple entity infos."""
    hass.states.async_set("sensor.temp1", "25.0", {"friendly_name": "Temp 1"})
    hass.states.async_set("sensor.temp2", "30.0", {"friendly_name": "Temp 2"})

    task_data = {
        "name": "Test", "type": "custom",
        "trigger_config": {
            "entity_ids": ["sensor.temp1", "sensor.temp2"],
            "type": "threshold",
        },
    }

    result = _build_task_summary(hass, "tid", task_data, None)
    assert result["trigger_entity_info"]["friendly_name"] == "Temp 1"
    assert result["trigger_entity_infos"] is not None
    assert len(result["trigger_entity_infos"]) == 2


def test_build_task_summary_includes_custom_icon_and_nfc(hass: HomeAssistant) -> None:
    """Test _build_task_summary includes custom_icon and nfc_tag_id."""
    task_data = {
        "name": "Test",
        "type": "custom",
        "custom_icon": "mdi:oil",
        "nfc_tag_id": "tag-abc-123",
    }

    result = _build_task_summary(hass, "tid", task_data, None)
    assert result["custom_icon"] == "mdi:oil"
    assert result["nfc_tag_id"] == "tag-abc-123"


def test_build_task_summary_custom_icon_nfc_default_none(hass: HomeAssistant) -> None:
    """Test _build_task_summary returns None for missing custom_icon/nfc_tag_id."""
    task_data = {"name": "Test", "type": "custom"}

    result = _build_task_summary(hass, "tid", task_data, None)
    assert result["custom_icon"] is None
    assert result["nfc_tag_id"] is None


def test_build_task_summary_compound_trigger_entity_enrichment(hass: HomeAssistant) -> None:
    """Test _build_task_summary enriches entity info for compound triggers."""
    hass.states.async_set("sensor.temp", "25.0", {"friendly_name": "Temperature"})
    hass.states.async_set("sensor.runtime", "100", {"friendly_name": "Runtime Hours"})

    task_data = {
        "name": "Test",
        "type": "custom",
        "trigger_config": {
            "type": "compound",
            "operator": "AND",
            "conditions": [
                {
                    "trigger_config": {
                        "type": "threshold",
                        "entity_id": "sensor.temp",
                        "threshold": 30.0,
                    }
                },
                {
                    "trigger_config": {
                        "type": "runtime",
                        "entity_id": "sensor.runtime",
                        "target_hours": 500,
                    }
                },
            ],
        },
    }

    result = _build_task_summary(hass, "tid", task_data, None)
    # Should have entity info from compound sub-conditions
    assert result["trigger_entity_info"] is not None
    assert result["trigger_entity_info"]["friendly_name"] == "Temperature"
    assert result["trigger_entity_infos"] is not None
    assert len(result["trigger_entity_infos"]) == 2
    names = [info["friendly_name"] for info in result["trigger_entity_infos"]]
    assert "Temperature" in names
    assert "Runtime Hours" in names


def test_build_task_summary_compound_trigger_deduplicates(hass: HomeAssistant) -> None:
    """Test compound trigger entity enrichment deduplicates entity_ids."""
    hass.states.async_set("sensor.temp", "25.0", {"friendly_name": "Temperature"})

    task_data = {
        "name": "Test",
        "type": "custom",
        "trigger_config": {
            "type": "compound",
            "operator": "AND",
            "conditions": [
                {
                    "trigger_config": {
                        "type": "threshold",
                        "entity_id": "sensor.temp",
                        "threshold": 30.0,
                    }
                },
                {
                    "trigger_config": {
                        "type": "threshold",
                        "entity_id": "sensor.temp",
                        "threshold": 40.0,
                    }
                },
            ],
        },
    }

    result = _build_task_summary(hass, "tid", task_data, None)
    # Same entity in both conditions — should appear once
    assert result["trigger_entity_info"] is not None
    assert result["trigger_entity_info"]["friendly_name"] == "Temperature"
    # Only one unique entity, so trigger_entity_infos should be None (not > 1)
    assert result["trigger_entity_infos"] is None


def test_build_object_response_structure(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test _build_object_response returns correct structure."""
    result = _build_object_response(hass, object_entry, None)
    assert "entry_id" in result
    assert "object" in result
    assert "tasks" in result
    assert result["object"]["name"] == "Pool Pump"
    assert result["object"]["manufacturer"] == "Pentair"
    assert "serial_number" in result["object"]
    # v1.4.3 regression: documentation_url field was persisted by the WS
    # update path but `_build_object_response` didn't expose it back to
    # the frontend, so the manual link never rendered in the panel.
    assert "documentation_url" in result["object"]


def test_build_object_response_exposes_documentation_url_value(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """v1.4.3 regression: a saved documentation_url must reach the frontend."""
    from .conftest import build_object_data, build_object_entry_data

    # Build an object entry with documentation_url set
    obj_data = build_object_data(name="With Manual")
    obj_data["documentation_url"] = "https://example.com/manual.pdf"
    entry = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN,
        title="With Manual",
        data=build_object_entry_data(object_data=obj_data, tasks={}),
        source="user",
        unique_id="maintenance_supporter_with_manual",
    )
    entry.add_to_hass(hass)

    result = _build_object_response(hass, entry, None)
    assert result["object"]["documentation_url"] == "https://example.com/manual.pdf", (
        "documentation_url must round-trip through _build_object_response so "
        "the panel can render the manual link"
    )


def test_build_object_response_exposes_notes(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """v1.4.10 (#46): a saved notes string must reach the frontend.

    Mirrors the documentation_url regression test — the same `_build_object_response`
    path is the only conduit between the entry data and the panel renderer.
    """
    from .conftest import build_object_data, build_object_entry_data

    obj_data = build_object_data(name="With Notes")
    obj_data["notes"] = "PN ACE-7800-X\nProcedure: see manual"
    entry = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN,
        title="With Notes",
        data=build_object_entry_data(object_data=obj_data, tasks={}),
        source="user",
        unique_id="maintenance_supporter_with_notes",
    )
    entry.add_to_hass(hass)

    result = _build_object_response(hass, entry, None)
    assert result["object"]["notes"] == "PN ACE-7800-X\nProcedure: see manual", (
        "notes must round-trip through _build_object_response so the "
        "panel can render the notes block in the object detail header"
    )
    # Also verify the key is always present even when notes are unset
    obj_data_empty = build_object_data(name="Without Notes")
    entry2 = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN,
        title="Without Notes",
        data=build_object_entry_data(object_data=obj_data_empty, tasks={}),
        source="user",
        unique_id="maintenance_supporter_without_notes",
    )
    entry2.add_to_hass(hass)
    result2 = _build_object_response(hass, entry2, None)
    assert "notes" in result2["object"]
    assert result2["object"]["notes"] is None
