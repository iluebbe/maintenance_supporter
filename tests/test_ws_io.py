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

    await ws_get_templates.__wrapped__(hass, conn, {
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

    await ws_export_data.__wrapped__(hass, conn, {
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

    await ws_export_data.__wrapped__(hass, conn, {
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

    await ws_export_data.__wrapped__(hass, conn, {
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

    await ws_export_csv.__wrapped__(hass, conn, {
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

    await ws_export_csv.__wrapped__(hass, conn, {
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

    await ws_import_csv.__wrapped__.__wrapped__(hass, conn, {
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

    await ws_import_csv.__wrapped__.__wrapped__(hass, conn, {
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

    await ws_import_csv.__wrapped__.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/csv/import",
        "csv_content": csv,
    })

    result = conn.send_result.call_args[0][1]
    assert result["total"] == 2  # 2 objects
    assert result["created"] == 2


# ─── ws_generate_qr ──────────────────────────────────────────────────────


async def test_generate_qr_object(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test QR code generation for an object."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_generate_qr.__wrapped__(hass, conn, {
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

    await ws_generate_qr.__wrapped__(hass, conn, {
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

    await ws_generate_qr.__wrapped__(hass, conn, {
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

    await ws_generate_qr.__wrapped__(hass, conn, {
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

    await ws_generate_qr.__wrapped__(hass, conn, {
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

    await ws_generate_qr.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": global_entry.entry_id,
    })

    conn.send_error.assert_called_once()
