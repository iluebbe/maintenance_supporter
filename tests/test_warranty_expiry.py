"""Tests for the per-object ``warranty_expiry`` field (#67).

Covers every surface the field travels through:
- the dataclass round-trip (``MaintenanceObject``),
- the config-flow sanitizer length cap,
- the WebSocket create/update handlers incl. ISO-date validation,
- the WS single-object response builder,
- JSON export, and
- CSV export/import round-trip.
"""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_DATE_LENGTH,
)
from custom_components.maintenance_supporter.export import build_export_data
from custom_components.maintenance_supporter.helpers.csv_handler import (
    export_objects_csv,
    import_objects_csv,
)
from custom_components.maintenance_supporter.helpers.sanitize import cap_object_fields
from custom_components.maintenance_supporter.models.maintenance_object import (
    MaintenanceObject,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_create_object,
    ws_get_object,
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


def _conn() -> MagicMock:
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
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Pool Pump"),
            tasks={TASK_ID_1: build_task_data(last_performed="2024-06-01")},
        ),
        source="user",
        unique_id="maintenance_supporter_pool_pump_warranty",
    )
    entry.add_to_hass(hass)
    return entry


def _object_entry(hass: HomeAssistant, name: str, unique: str, **fields) -> MockConfigEntry:
    obj_data = build_object_data(name=name)
    obj_data.update(fields)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=obj_data,
            tasks={TASK_ID_1: build_task_data()},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Dataclass round-trip ───────────────────────────────────────────────────


def test_model_roundtrips_warranty_expiry() -> None:
    obj = MaintenanceObject(name="Boiler", warranty_expiry="2031-03-01")
    d = obj.to_dict()
    assert d["warranty_expiry"] == "2031-03-01"
    assert MaintenanceObject.from_dict(d).warranty_expiry == "2031-03-01"


def test_model_warranty_defaults_none() -> None:
    assert MaintenanceObject(name="X").to_dict()["warranty_expiry"] is None
    assert MaintenanceObject.from_dict({"name": "X"}).warranty_expiry is None


# ─── Sanitizer cap ──────────────────────────────────────────────────────────


def test_cap_object_fields_truncates_warranty() -> None:
    obj = {"name": "X", "warranty_expiry": "2030-01-01" + ("x" * 100)}
    cap_object_fields(obj)
    assert len(obj["warranty_expiry"]) == MAX_DATE_LENGTH


# ─── WS create / update ─────────────────────────────────────────────────────


async def test_ws_create_object_with_warranty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(ws_create_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "Warranty Object",
        "warranty_expiry": "2030-12-31",
    })
    conn.send_result.assert_called_once()
    entries = [
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.title == "Warranty Object"
    ]
    assert len(entries) == 1
    assert entries[0].data[CONF_OBJECT]["warranty_expiry"] == "2030-12-31"


async def test_ws_create_object_invalid_warranty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(ws_create_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "Bad Warranty",
        "warranty_expiry": "not-a-date",
    })
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_date"


async def test_ws_update_object_warranty(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "warranty_expiry": "2029-06-15",
    })
    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert entry.data[CONF_OBJECT]["warranty_expiry"] == "2029-06-15"


async def test_ws_update_object_invalid_warranty(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(ws_update_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "warranty_expiry": "2029/06/15",
    })
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_date"


async def test_ws_get_object_exposes_warranty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    entry = _object_entry(
        hass, "Warranty Read", "warranty_read", warranty_expiry="2032-02-02"
    )
    await setup_integration(hass, global_entry, entry)
    conn = _conn()
    await call_ws_handler(ws_get_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object",
        "entry_id": entry.entry_id,
    })
    obj_resp = conn.send_result.call_args[0][1]["object"]
    assert obj_resp["warranty_expiry"] == "2032-02-02"


# ─── JSON export ────────────────────────────────────────────────────────────


async def test_export_includes_warranty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    entry = _object_entry(
        hass, "Exported", "exported_warranty", warranty_expiry="2033-03-03"
    )
    await setup_integration(hass, global_entry, entry)

    data = build_export_data(hass, include_history=False)
    exported = [e for e in data["objects"] if e["object"]["name"] == "Exported"]
    assert exported
    assert exported[0]["object"]["warranty_expiry"] == "2033-03-03"


# ─── CSV export / import round-trip ─────────────────────────────────────────


async def test_csv_roundtrips_warranty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    entry = _object_entry(
        hass, "CSV Object", "csv_warranty",
        warranty_expiry="2034-04-04", installation_date="2020-01-01",
    )
    await setup_integration(hass, global_entry, entry)

    csv_text = export_objects_csv(hass)
    assert "object_warranty_expiry" in csv_text  # header column present
    assert "2034-04-04" in csv_text

    parsed = import_objects_csv(csv_text, hass=hass)
    target = [o for o in parsed if o["object"]["name"] == "CSV Object"]
    assert target
    assert target[0]["object"]["warranty_expiry"] == "2034-04-04"
    assert target[0]["object"]["installation_date"] == "2020-01-01"
