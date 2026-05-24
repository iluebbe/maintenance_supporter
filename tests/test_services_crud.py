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


async def test_add_object_service_creates_entry(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
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


async def test_add_object_service_rejects_unsafe_url(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
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


async def test_add_task_service_adds_task(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """add_task adds a task to an object created via add_object (chained)."""
    await setup_integration(hass, global_config_entry)

    obj = await hass.services.async_call(
        DOMAIN, "add_object", {"name": "Boiler"}, blocking=True, return_response=True
    )
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


async def test_add_task_service_interval_unit_and_due_date(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """add_task service persists interval_unit (months) and a one-time due_date."""
    await setup_integration(hass, global_config_entry)
    obj = await hass.services.async_call(
        DOMAIN, "add_object", {"name": "HVAC"}, blocking=True, return_response=True
    )
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]

    res = await hass.services.async_call(
        DOMAIN, "add_task",
        {"entry_id": entry_id, "name": "Quarterly", "interval_days": 3,
         "interval_unit": "months"},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry_id)
    monthly = entry.data[CONF_TASKS][res["task_id"]]
    assert read_legacy_fields(monthly)["interval_days"] == 3
    assert read_legacy_fields(monthly)["interval_unit"] == "months"

    res2 = await hass.services.async_call(
        DOMAIN, "add_task",
        {"entry_id": entry_id, "name": "Inspect", "schedule_type": "one_time",
         "due_date": "2026-09-01"},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry_id)
    oneshot = entry.data[CONF_TASKS][res2["task_id"]]
    assert read_legacy_fields(oneshot)["schedule_type"] == "one_time"
    assert read_legacy_fields(oneshot)["due_date"] == "2026-09-01"


async def test_add_task_service_rejects_unknown_entry(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
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
