"""The task services build what they are asked for, or refuse — never a third kind.

The storage model resolves a contradictory recurrence by picking one side, so
update_task reported success for a weekday task switched to ``time_based``
without an interval and quietly made it manual (the weekdays gone), a
``manual`` request with ``interval_days`` made an interval task, and add_task
with ``one_time`` and an interval ``schedule`` made a one-time task without a
date (bug audit 2026-09-29). Earlier tests covered the switches that were
fixed one at a time; this walks every stored kind against every request.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.schedule import Schedule
from custom_components.maintenance_supporter.websocket.tasks_persist import (
    async_create_task_simple,
    async_update_task_simple,
)

from .conftest import build_global_entry_data, build_object_entry_data, build_task_data

STORED: dict[str, dict[str, Any]] = {
    "interval": {"kind": "interval", "every": 30, "unit": "days"},
    "weekdays": {"kind": "weekdays", "weekdays": [0, 3]},
    "one_time": {"kind": "one_time", "due_date": "2026-12-01"},
    "manual": {"kind": "manual"},
}
# request → (the kind it asks for, None when the request itself is contradictory)
REQUESTS: dict[str, tuple[dict[str, Any], str | None]] = {
    "time_based": ({"schedule_type": "time_based"}, "interval"),
    "time_based+interval": ({"schedule_type": "time_based", "interval_days": 14}, "interval"),
    "manual": ({"schedule_type": "manual"}, "manual"),
    "manual+interval": ({"schedule_type": "manual", "interval_days": 14}, None),
    "one_time": ({"schedule_type": "one_time"}, "one_time"),
    "one_time+date": ({"schedule_type": "one_time", "due_date": "2027-01-15"}, "one_time"),
    "one_time+interval schedule": ({"schedule_type": "one_time", "schedule": {"kind": "interval", "every": 3}}, None),
}


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, title="Maintenance Supporter", data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    return entry


async def _object(hass: HomeAssistant, schedule: dict[str, Any] | None = None) -> MockConfigEntry:
    tasks = {}
    if schedule is not None:
        task = {**build_task_data(task_id="t1", name="Task"), "schedule": schedule}
        for key in ("schedule_type", "interval_days", "interval_unit", "interval_anchor"):
            task.pop(key, None)
        tasks = {"t1": task}
    entry = MockConfigEntry(domain=DOMAIN, title="Thing", data=build_object_entry_data(tasks=tasks), unique_id="maintenance_supporter_thing")
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _kind(hass: HomeAssistant, entry: MockConfigEntry, task_id: str) -> str:
    return Schedule.parse(hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][task_id]).kind


@pytest.mark.parametrize("stored", sorted(STORED))
@pytest.mark.parametrize("request_name", sorted(REQUESTS))
async def test_update_task_builds_the_requested_kind_or_refuses(
    hass: HomeAssistant, global_entry: MockConfigEntry, stored: str, request_name: str
) -> None:
    entry = await _object(hass, STORED[stored])
    updates, wanted = REQUESTS[request_name]
    try:
        await async_update_task_simple(hass, entry_id=entry.entry_id, task_id="t1", updates=dict(updates))
    except ValueError:
        # Refused: the task is exactly as it was.
        assert _kind(hass, entry, "t1") == stored
        return
    got = _kind(hass, entry, "t1")
    assert wanted is not None, f"{request_name} on a {stored} task was accepted and made it {got}"
    assert got == wanted, f"{request_name} on a {stored} task made it {got}, not {wanted}"
    if got == "one_time":
        task = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS]["t1"]
        assert Schedule.parse(task).due_date is not None, "a one-time task without a date never comes due"


@pytest.mark.parametrize("request_name", sorted(REQUESTS))
async def test_add_task_builds_the_requested_kind_or_refuses(
    hass: HomeAssistant, global_entry: MockConfigEntry, request_name: str
) -> None:
    entry = await _object(hass)
    fields, wanted = REQUESTS[request_name]
    try:
        task_id = await async_create_task_simple(hass, entry_id=entry.entry_id, name="New", **fields)
    except ValueError:
        return
    got = _kind(hass, entry, task_id)
    assert wanted is not None, f"add_task {request_name} was accepted and made {got}"
    assert got == wanted, f"add_task {request_name} made {got}, not {wanted}"


@pytest.mark.parametrize(
    ("fields", "wanted"),
    [
        ({}, "manual"),  # a bare name stays a manual task, as before
        ({"interval_days": 10}, "interval"),
        ({"due_date": "2027-02-01"}, "one_time"),
        ({"schedule": {"kind": "weekdays", "weekdays": [1]}}, "weekdays"),
    ],
)
async def test_add_task_without_a_type_builds_what_the_fields_describe(
    hass: HomeAssistant, global_entry: MockConfigEntry, fields: dict[str, Any], wanted: str
) -> None:
    entry = await _object(hass)
    task_id = await async_create_task_simple(hass, entry_id=entry.entry_id, name="New", **fields)
    assert _kind(hass, entry, task_id) == wanted
