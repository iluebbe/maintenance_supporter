"""Tests for the add_object / add_task services.

These share the creation primitives (async_create_object / async_persist_task)
with the object/create + task/create WS commands — same code path (DRY).
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_OBJECT_NAME,
    CONF_TASKS,
    DOMAIN,
)
from custom_components.maintenance_supporter.helpers.schedule import (
    read_legacy_fields,
)

from .conftest import setup_integration


async def test_add_object_service_creates_entry(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """add_object creates a maintenance object and returns its entry_id."""
    await setup_integration(hass, global_config_entry)

    result = await hass.services.async_call(
        DOMAIN,
        "add_object",
        {"name": "Garage Door", "manufacturer": "Hörmann"},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()

    entry_id = result["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    assert entry.data[CONF_OBJECT][CONF_OBJECT_NAME] == "Garage Door"
    assert entry.data[CONF_OBJECT]["manufacturer"] == "Hörmann"


async def test_add_object_service_rejects_unsafe_url(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """A non-http(s) documentation_url is rejected."""
    await setup_integration(hass, global_config_entry)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            "add_object",
            {"name": "X", "documentation_url": "javascript:alert(1)"},
            blocking=True,
            return_response=True,
        )


async def test_add_task_service_adds_task(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """add_task adds a task to an object created via add_object (chained)."""
    await setup_integration(hass, global_config_entry)

    obj = await hass.services.async_call(DOMAIN, "add_object", {"name": "Boiler"}, blocking=True, return_response=True)
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]

    res = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": entry_id, "name": "Annual service", "interval_days": 365},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()

    task_id = res["task_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    task = entry.data[CONF_TASKS][task_id]
    assert task["name"] == "Annual service"
    assert read_legacy_fields(task)["interval_days"] == 365


async def test_add_task_service_interval_unit_and_due_date(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """add_task service persists interval_unit (months) and a one-time due_date."""
    await setup_integration(hass, global_config_entry)
    obj = await hass.services.async_call(DOMAIN, "add_object", {"name": "HVAC"}, blocking=True, return_response=True)
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]

    res = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": entry_id, "name": "Quarterly", "interval_days": 3, "interval_unit": "months"},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry_id)
    monthly = entry.data[CONF_TASKS][res["task_id"]]
    assert read_legacy_fields(monthly)["interval_days"] == 3
    assert read_legacy_fields(monthly)["interval_unit"] == "months"

    res2 = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": entry_id, "name": "Inspect", "schedule_type": "one_time", "due_date": "2026-09-01"},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry_id)
    oneshot = entry.data[CONF_TASKS][res2["task_id"]]
    assert read_legacy_fields(oneshot)["schedule_type"] == "one_time"
    assert read_legacy_fields(oneshot)["due_date"] == "2026-09-01"


async def test_add_task_service_calendar_kind(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """add_task service persists a nested calendar schedule (nth_weekday)."""
    await setup_integration(hass, global_config_entry)
    obj = await hass.services.async_call(DOMAIN, "add_object", {"name": "Hallway"}, blocking=True, return_response=True)
    await hass.async_block_till_done()

    res = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": obj["entry_id"], "name": "Smoke alarm", "schedule": {"kind": "nth_weekday", "nth": 1, "weekday": 5}},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(obj["entry_id"])
    task = entry.data[CONF_TASKS][res["task_id"]]
    assert task["schedule"] == {"kind": "nth_weekday", "nth": 1, "weekday": 5}


async def test_add_task_service_rejects_unknown_entry(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """add_task on a non-existent object raises a validation error."""
    await setup_integration(hass, global_config_entry)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            "add_task",
            {"entry_id": "does_not_exist", "name": "X"},
            blocking=True,
            return_response=True,
        )


# ─── update_task / delete_task / list_tasks (service CRUD completion) ────────


async def _create_object_with_task(hass: HomeAssistant, name: str = "Boiler") -> tuple[str, str]:
    obj = await hass.services.async_call(DOMAIN, "add_object", {"name": name}, blocking=True, return_response=True)
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    res = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": entry_id, "name": "Annual service", "interval_days": 365},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    return entry_id, res["task_id"]


async def test_update_task_service_patches_fields(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """update_task changes only the provided fields, keeping the rest."""
    await setup_integration(hass, global_config_entry)
    entry_id, task_id = await _create_object_with_task(hass)

    await hass.services.async_call(
        DOMAIN,
        "update_task",
        {
            "entry_id": entry_id,
            "task_id": task_id,
            "name": "Biennial service",
            "interval_days": 730,
            "priority": "high",
            "labels": ["heating"],
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    task = hass.config_entries.async_get_entry(entry_id).data[CONF_TASKS][task_id]
    assert task["name"] == "Biennial service"
    assert read_legacy_fields(task)["interval_days"] == 730
    assert task["priority"] == "high"
    assert task["labels"] == ["heating"]


async def test_update_task_service_partial_edit_keeps_unit(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """Changing only interval_days keeps a months unit (issue #58 class)."""
    await setup_integration(hass, global_config_entry)
    obj = await hass.services.async_call(DOMAIN, "add_object", {"name": "HVAC"}, blocking=True, return_response=True)
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    res = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": entry_id, "name": "Filter", "interval_days": 3, "interval_unit": "months"},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()

    await hass.services.async_call(
        DOMAIN,
        "update_task",
        {"entry_id": entry_id, "task_id": res["task_id"], "interval_days": 6},
        blocking=True,
    )
    await hass.async_block_till_done()

    fields = read_legacy_fields(hass.config_entries.async_get_entry(entry_id).data[CONF_TASKS][res["task_id"]])
    assert fields["interval_days"] == 6
    assert fields["interval_unit"] == "months"


async def test_update_task_service_unknown_task(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_config_entry)
    entry_id, _task_id = await _create_object_with_task(hass, name="Pump")
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            "update_task",
            {"entry_id": entry_id, "task_id": "nope", "name": "X"},
            blocking=True,
        )


async def test_delete_task_service_removes_task(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_config_entry)
    entry_id, task_id = await _create_object_with_task(hass, name="Gate")

    await hass.services.async_call(
        DOMAIN,
        "delete_task",
        {"entry_id": entry_id, "task_id": task_id},
        blocking=True,
    )
    await hass.async_block_till_done()

    entry = hass.config_entries.async_get_entry(entry_id)
    assert task_id not in entry.data[CONF_TASKS]

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            "delete_task",
            {"entry_id": entry_id, "task_id": task_id},
            blocking=True,
        )


async def test_list_tasks_service_snapshot_and_filters(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """list_tasks returns active tasks with status; filters narrow it."""
    await setup_integration(hass, global_config_entry)
    entry_id, task_id = await _create_object_with_task(hass, name="Car")

    result = await hass.services.async_call(DOMAIN, "list_tasks", {}, blocking=True, return_response=True)
    assert result["count"] == 1
    row = result["tasks"][0]
    assert row["entry_id"] == entry_id
    assert row["task_id"] == task_id
    assert row["object_name"] == "Car"
    assert row["name"] == "Annual service"
    assert row["status"] == "ok"
    assert row["next_due"] is not None

    filtered = await hass.services.async_call(
        DOMAIN,
        "list_tasks",
        {"entry_id": entry_id, "status": "overdue"},
        blocking=True,
        return_response=True,
    )
    assert filtered["count"] == 0

    other = await hass.services.async_call(
        DOMAIN,
        "list_tasks",
        {"entry_id": "not_an_entry"},
        blocking=True,
        return_response=True,
    )
    assert other["count"] == 0
