"""Bug audit 2026-09-27 (tranche 4) — follow-ups found while integrating."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import BATTERY_FLEET_OBJECT_FLAG, DOMAIN, GLOBAL_UNIQUE_ID, MAX_INTERVAL_DAYS

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

TASK = "task_1"


async def _setup(hass: HomeAssistant, *, fleet: bool = False) -> MockConfigEntry:
    g = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    g.add_to_hass(hass)
    task: dict[str, Any] = build_task_data(interval_days=30, last_performed="2026-01-01")
    obj_data = build_object_data(name="Batteries" if fleet else "Boiler", object_id="o1")
    if fleet:
        obj_data[BATTERY_FLEET_OBJECT_FLAG] = True
    obj = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title=obj_data["name"],
        data=build_object_entry_data(object_data=obj_data, tasks={TASK: task}),
        source="user", unique_id=f"maintenance_supporter_{obj_data['name'].lower()}",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, g, obj)
    return obj


async def test_a_postpone_reaches_at_most_one_maximum_interval_out(hass: HomeAssistant) -> None:
    """An override in year 9999 overflowed the calendar entity's "next day"."""
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_postpone_task

    entry = await _setup(hass)
    today = dt_util.now().date()

    async def _postpone(until: str) -> Any:
        conn = make_ws_connection()
        await call_ws_handler(ws_postpone_task, hass, conn, {"id": 1, "type": f"{DOMAIN}/task/postpone", "entry_id": entry.entry_id, "task_id": TASK, "until": until})
        return conn

    far = await _postpone("9999-12-31")
    assert far.send_error.call_args[0][1] == "invalid_date"
    ok = await _postpone((today + timedelta(days=MAX_INTERVAL_DAYS)).isoformat())
    assert ok.send_error.call_count == 0


async def test_the_battery_fleet_object_cannot_be_duplicated(hass: HomeAssistant) -> None:
    """A copy carried the fleet flags and ran a second fleet (double
    triggers and notifications)."""
    from custom_components.maintenance_supporter.websocket.objects import ws_duplicate_object

    entry = await _setup(hass, fleet=True)
    conn = make_ws_connection()
    await call_ws_handler(ws_duplicate_object, hass, conn, {"id": 1, "type": f"{DOMAIN}/object/duplicate", "entry_id": entry.entry_id})
    assert conn.send_error.call_args[0][1] == "invalid_input"
    assert len([e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID]) == 1
