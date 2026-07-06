"""Meter-reading task type (#83, v2.20): reading_unit config + reading_value history.

The `reading` MaintenanceTypeEnum value exists since 2.18; this adds the
reading-specific data: a per-task display unit and a recorded value on each
completion (the delta view derives from consecutive history entries).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
)
from custom_components.maintenance_supporter.websocket.tasks_crud import (
    ws_create_task,
    ws_update_task,
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


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


def _make_entry(hass: HomeAssistant, unique_id: str = "meter") -> MockConfigEntry:
    task = build_task_data(task_id=TASK_ID_1, name="Read power meter", interval_days=30)
    task["type"] = "reading"
    task["reading_unit"] = "kWh"
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Power Meter",
        data=build_object_entry_data(
            object_data=build_object_data(name="Power Meter"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Model ───────────────────────────────────────────────────────────────────


def test_model_roundtrips_reading_unit_and_value() -> None:
    task = MaintenanceTask.from_dict(
        {"id": TASK_ID_1, "name": "Meter", "type": "reading", "interval_days": 30, "reading_unit": "m³"}
    )
    assert task.reading_unit == "m³"
    assert task.to_dict()["reading_unit"] == "m³"

    task.complete(reading_value=1234.5)
    (entry,) = [h for h in task.history if h["type"] == "completed"]
    assert entry["reading_value"] == 1234.5

    # A lean non-reading completion carries no reading key.
    other = MaintenanceTask.from_dict({"id": "b" * 32, "name": "Clean", "type": "cleaning", "interval_days": 7})
    other.complete()
    assert "reading_value" not in other.history[-1]
    assert "reading_unit" not in other.to_dict()


# ─── WS complete + delta chain ───────────────────────────────────────────────


async def test_ws_complete_records_reading_values(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from unittest.mock import patch

    obj_entry = _make_entry(hass)
    await setup_integration(hass, global_entry, obj_entry)
    coordinator = obj_entry.runtime_data.coordinator

    real_monotonic = __import__("time").monotonic
    offsets = iter((0, 60, 120))

    for i, value in enumerate((1000.0, 1123.5, 1250.0)):
        # Step past the manual-completion dedup window between readings.
        with patch(
            "custom_components.maintenance_supporter.coordinator.time.monotonic",
            side_effect=(lambda off: lambda: real_monotonic() + off)(next(offsets)),
        ):
            await call_ws_handler(
                ws_complete_task,
                hass,
                _conn(),
                {
                    "id": 10 + i,
                    "type": "maintenance_supporter/task/complete",
                    "entry_id": obj_entry.entry_id,
                    "task_id": TASK_ID_1,
                    "reading_value": value,
                },
            )
        await hass.async_block_till_done()

    merged = coordinator._get_merged_tasks_data()[TASK_ID_1]
    readings = [h["reading_value"] for h in merged["history"] if "reading_value" in h]
    assert readings == [1000.0, 1123.5, 1250.0]
    # The delta the panel derives from consecutive entries: +123.5, +126.5.
    from itertools import pairwise

    deltas = [b - a for a, b in pairwise(readings)]
    assert deltas == [123.5, 126.5]


async def test_reading_unit_via_ws_create_update_and_summary(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "meter_crud")
    await setup_integration(hass, global_entry, obj_entry)

    # Create with a unit…
    conn = _conn()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": obj_entry.entry_id,
            "name": "Water meter",
            "task_type": "reading",
            "interval_days": 30,
            "reading_unit": "m³",
        },
    )
    await hass.async_block_till_done()
    new_task_id = conn.send_result.call_args[0][1]["task_id"]
    assert obj_entry.data[CONF_TASKS][new_task_id]["reading_unit"] == "m³"

    # …update it…
    await call_ws_handler(
        ws_update_task,
        hass,
        _conn(),
        {
            "id": 2,
            "type": "maintenance_supporter/task/update",
            "entry_id": obj_entry.entry_id,
            "task_id": new_task_id,
            "reading_unit": "liters",
        },
    )
    await hass.async_block_till_done()
    assert obj_entry.data[CONF_TASKS][new_task_id]["reading_unit"] == "liters"

    # …and the panel sees it (summary exposure).
    from custom_components.maintenance_supporter.websocket import (
        _build_object_response,
    )

    resp = _build_object_response(hass, obj_entry, None)
    by_id = {t["id"]: t for t in resp["tasks"]}
    assert by_id[new_task_id]["reading_unit"] == "liters"
    assert by_id[TASK_ID_1]["reading_unit"] == "kWh"


async def test_complete_service_accepts_reading_value(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from homeassistant.helpers import entity_registry as er

    obj_entry = _make_entry(hass, "meter_service")
    await setup_integration(hass, global_entry, obj_entry)

    reg = er.async_get(hass)
    sensor_eid = next(
        e.entity_id
        for e in er.async_entries_for_config_entry(reg, obj_entry.entry_id)
        if e.domain == "sensor" and not e.unique_id.endswith("_next_due")
    )
    await hass.services.async_call(
        DOMAIN,
        "complete",
        {"entity_id": sensor_eid, "reading_value": 42.5},
        blocking=True,
    )
    await hass.async_block_till_done()

    merged = obj_entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    assert merged["history"][-1]["reading_value"] == 42.5


def test_sanitizer_caps_reading_unit() -> None:
    from custom_components.maintenance_supporter.helpers.sanitize import (
        cap_task_fields,
    )

    task: dict[str, Any] = {"name": "Meter", "reading_unit": "x" * 200}
    cap_task_fields(task)
    assert len(task["reading_unit"]) == 32
