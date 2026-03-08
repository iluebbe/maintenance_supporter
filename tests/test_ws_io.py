"""Tests for WebSocket IO handlers (websocket/io.py)."""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.io import (
    ws_export_csv,
    ws_export_data,
    ws_generate_qr,
    ws_get_templates,
    ws_import_csv,
    ws_import_json,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
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
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_ws_io",
    )
    entry.add_to_hass(hass)
    return entry


# ─── ws_get_templates ────────────────────────────────────────────────────


async def test_get_templates(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test get_templates returns categories and templates."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_get_templates.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/templates",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "categories" in result
    assert "templates" in result
    assert isinstance(result["categories"], dict)
    assert isinstance(result["templates"], list)
    assert len(result["templates"]) > 0

    # Check template structure
    tmpl = result["templates"][0]
    assert "id" in tmpl
    assert "name" in tmpl
    assert "category" in tmpl
    assert "tasks" in tmpl
    if tmpl["tasks"]:
        tt = tmpl["tasks"][0]
        assert "name" in tt
        assert "type" in tt
        assert "schedule_type" in tt


# ─── ws_export_data ──────────────────────────────────────────────────────


async def test_export_data_json(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test JSON export."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_export_data.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/export",
        "format": "json",
        "include_history": True,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["format"] == "json"
    assert isinstance(result["data"], str)
    assert "Pool Pump" in result["data"]


async def test_export_data_yaml(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test YAML export (no objects to avoid HA repr issues)."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_export_data.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/export",
        "format": "yaml",
        "include_history": True,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["format"] == "yaml"
    assert isinstance(result["data"], str)
    assert "version" in result["data"]


async def test_export_data_no_history(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test export without history."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_export_data.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/export",
        "include_history": False,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert isinstance(result["data"], str)


# ─── ws_export_csv ───────────────────────────────────────────────────────


async def test_export_csv(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test CSV export."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_export_csv.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/csv/export",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "csv" in result
    csv_data = result["csv"]
    assert "object_name" in csv_data  # header
    assert "Pool Pump" in csv_data


async def test_export_csv_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test CSV export with no objects."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_export_csv.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/csv/export",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # Should still have header row
    assert "object_name" in result["csv"]


# ─── ws_import_csv ───────────────────────────────────────────────────────


async def test_import_csv_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing empty CSV."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_import_csv.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/csv/import",
        "csv_content": "object_name,task_name\n",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "empty_csv"


async def test_import_csv_valid(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing valid CSV creates entries."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    csv = (
        "object_name,task_name,task_type,schedule_type,interval_days,warning_days\n"
        "Test Pump,Oil Change,service,time_based,90,14\n"
        "Test Pump,Filter Clean,cleaning,time_based,30,7\n"
    )

    await ws_import_csv.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/csv/import",
        "csv_content": csv,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["total"] == 1  # 1 object
    assert result["created"] == 1
    assert len(result["imported"]) == 1
    assert result["imported"][0]["name"] == "Test Pump"
    assert result["imported"][0]["task_count"] == 2


async def test_import_csv_multiple_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing CSV with multiple objects."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    csv = (
        "object_name,task_name,task_type,schedule_type,interval_days,warning_days\n"
        "Pump A,Oil Change,service,time_based,90,14\n"
        "Pump B,Filter Clean,cleaning,time_based,30,7\n"
    )

    await ws_import_csv.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/csv/import",
        "csv_content": csv,
    })

    result = conn.send_result.call_args[0][1]
    assert result["total"] == 2  # 2 objects
    assert result["created"] == 2


# ─── ws_import_json ──────────────────────────────────────────────────────


async def test_import_json_valid(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing valid JSON creates entries with all fields."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json
    json_data = json.dumps({
        "version": 1,
        "objects": [{
            "object": {
                "name": "JSON Pump",
                "manufacturer": "Acme",
                "model": "X100",
                "area_id": "garage",
                "installation_date": "2024-01-15",
            },
            "tasks": [
                {
                    "name": "Oil Change",
                    "type": "service",
                    "enabled": True,
                    "schedule_type": "time_based",
                    "interval_days": 90,
                    "interval_anchor": "planned",
                    "warning_days": 14,
                    "last_performed": "2025-12-01",
                    "notes": "Use 5W-30",
                    "checklist": ["Drain old oil", "Replace filter"],
                    "history": [{"date": "2025-12-01", "notes": "Done"}],
                },
                {
                    "name": "Filter Clean",
                    "type": "cleaning",
                    "schedule_type": "time_based",
                    "interval_days": 30,
                },
            ],
        }],
    })

    await ws_import_json.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["total"] == 1
    assert result["created"] == 1
    assert len(result["imported"]) == 1
    assert result["imported"][0]["name"] == "JSON Pump"
    assert result["imported"][0]["task_count"] == 2


async def test_import_json_multiple_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing JSON with multiple objects."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json
    json_data = json.dumps({
        "version": 1,
        "objects": [
            {"object": {"name": "Pump A"}, "tasks": [{"name": "Task 1"}]},
            {"object": {"name": "Pump B"}, "tasks": [{"name": "Task 2"}]},
        ],
    })

    await ws_import_json.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    result = conn.send_result.call_args[0][1]
    assert result["total"] == 2
    assert result["created"] == 2


async def test_import_json_invalid_json(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing invalid JSON returns error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_import_json.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": "not valid json {{{",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_json"


async def test_import_json_missing_objects_key(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing JSON without 'objects' key returns error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_import_json.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": '{"version": 1}',
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_format"


async def test_import_json_empty_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing JSON with empty objects array returns error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_import_json.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": '{"version": 1, "objects": []}',
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "empty"


async def test_import_json_missing_name(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing JSON with missing object name reports error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json
    json_data = json.dumps({
        "version": 1,
        "objects": [{"object": {}, "tasks": [{"name": "Task 1"}]}],
    })

    await ws_import_json.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 0
    assert len(result["errors"]) == 1
    assert result["errors"][0]["reason"] == "missing name"


async def test_import_json_duplicate_name_reports_error(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing JSON with an existing object name reports error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json

    # First import succeeds
    json_data = json.dumps({
        "version": 1,
        "objects": [{"object": {"name": "Dup Pump"}, "tasks": [{"name": "T1"}]}],
    })
    await ws_import_json.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })
    assert conn.send_result.call_args[0][1]["created"] == 1

    # Second import of same name fails
    conn.reset_mock()
    await ws_import_json.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 2, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 0
    assert len(result["errors"]) == 1


async def test_import_json_skips_computed_fields(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that computed fields in export JSON are ignored on import."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json
    json_data = json.dumps({
        "version": 1,
        "objects": [{
            "entry_id": "old_entry_id",
            "object": {"name": "Computed Test"},
            "tasks": [{
                "id": "old_task_id",
                "name": "Task With Computed",
                "type": "cleaning",
                "interval_days": 30,
                "status": "overdue",
                "days_until_due": -5,
                "next_due": "2025-01-01",
                "times_performed": 10,
                "total_cost": 500.0,
                "average_duration": 45,
            }],
        }],
    })

    await ws_import_json.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1
    # The entry_id should be new, not the old one
    assert result["imported"][0]["entry_id"] != "old_entry_id"


async def test_import_json_with_trigger_config(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that trigger_config is preserved on import."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json
    trigger_config = {
        "type": "threshold",
        "entity_ids": ["sensor.temperature"],
        "trigger_above": 30.0,
    }
    json_data = json.dumps({
        "version": 1,
        "objects": [{
            "object": {"name": "Trigger Test"},
            "tasks": [{
                "name": "Threshold Task",
                "schedule_type": "sensor_based",
                "trigger_config": trigger_config,
            }],
        }],
    })

    await ws_import_json.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1

    # Verify the entry was created with trigger_config
    entry_id = result["imported"][0]["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    tasks = entry.data.get(CONF_TASKS, {})
    task = list(tasks.values())[0]
    assert task["trigger_config"] == trigger_config


# ─── ws_generate_qr ──────────────────────────────────────────────────────


async def test_generate_qr_object(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test QR code generation for an object."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_generate_qr.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": object_entry.entry_id,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "svg_data_uri" in result
    assert result["svg_data_uri"].startswith("data:image/svg+xml,")
    assert "url" in result
    assert "maintenance-supporter" in result["url"]
    assert "label" in result
    assert result["label"]["object_name"] == "Pool Pump"
    assert result["label"]["task_name"] is None


async def test_generate_qr_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test QR code generation for a specific task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_generate_qr.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "action": "complete",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result["url"]
    assert "action=complete" in result["url"]
    assert result["label"]["task_name"] == "Filter Cleaning"


async def test_generate_qr_with_base_url(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test QR code generation with custom base URL."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_generate_qr.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": object_entry.entry_id,
        "base_url": "https://my-ha.example.com",
    })

    result = conn.send_result.call_args[0][1]
    assert result["url"].startswith("https://my-ha.example.com/maintenance-supporter")


async def test_generate_qr_not_found_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test QR generation with non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_generate_qr.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": "nonexistent",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_generate_qr_not_found_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test QR generation with non-existent task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_generate_qr.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_generate_qr_rejects_global(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test QR generation rejects global entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_generate_qr.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": global_entry.entry_id,
    })

    conn.send_error.assert_called_once()
