"""Journey: the completion action whose target vanished (F2 blind spot).

A task fires an on_complete_action at ``light.plant_relay``. Someone deletes
that light in Home Assistant. The coordinator flags a repair issue; the user
opens it and either points the action at a new entity or removes it. The repair
flow steps are unit-tested in isolation; this walks the whole loop — detect →
fix → the issue doesn't come back — including across a restart, which is where
a fix that only patched the in-memory copy would silently regress.

See docs/design/user-journeys.md (F2 stale on_complete_action target).
"""

from __future__ import annotations

import time
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    STARTUP_GRACE_PERIOD_SECONDS,
)
from custom_components.maintenance_supporter.repairs import async_create_fix_flow

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)
from .journey import simulate_restart

_GHOST = "light.plant_relay"


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


def _object(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(interval_days=30, last_performed="2026-03-01")
    task["on_complete_action"] = {"service": "light.turn_on", "target": {"entity_id": _GHOST}}
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Greenhouse",
        data=build_object_entry_data(
            object_data=build_object_data(name="Greenhouse", object_id="objid_gh"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_greenhouse",
    )
    entry.add_to_hass(hass)
    return entry


def _coordinator(entry: MockConfigEntry) -> Any:
    return entry.runtime_data.coordinator


async def _rescan_past_grace(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    """Force a coordinator refresh with the startup grace period elapsed, so the
    stale-action scan actually raises/clears the issue (the grace window uses
    time.monotonic, which freeze_time can't move)."""
    coord = _coordinator(entry)
    coord._startup_time = time.monotonic() - STARTUP_GRACE_PERIOD_SECONDS - 100
    await coord.async_refresh()
    await hass.async_block_till_done()


def _issue_id(entry: MockConfigEntry) -> str:
    return f"stale_action_entity_{entry.entry_id}_{TASK_ID_1}_{_GHOST}"


def _action(entry: MockConfigEntry) -> dict[str, Any] | None:
    return entry.data[CONF_TASKS][TASK_ID_1].get("on_complete_action")


async def test_stale_action_target_raises_issue_then_remove_fixes_it(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)

    # The target light doesn't exist → past the grace window, the issue is raised.
    await _rescan_past_grace(hass, obj)
    reg = ir.async_get(hass)
    assert reg.async_get_issue(DOMAIN, _issue_id(obj)) is not None, "stale action target not flagged"

    # Open the repair and choose "remove the action".
    issue = reg.async_get_issue(DOMAIN, _issue_id(obj))
    flow = await async_create_fix_flow(hass, _issue_id(obj), dict(issue.data or {}))
    flow.hass = hass
    flow.data = dict(issue.data or {})
    menu = await flow.async_step_init()
    assert menu["type"] == "menu" and "remove_action" in menu["menu_options"]
    result = await flow.async_step_remove_action(user_input={})
    assert result["type"] == "create_entry", "repair flow did not complete"
    await hass.async_block_till_done()

    # The action is gone from persisted data...
    assert _action(obj) is None, "on_complete_action not removed by the repair"

    # ...and a fresh scan does NOT re-raise the issue (the cause is gone).
    ir.async_delete_issue(hass, DOMAIN, _issue_id(obj))  # simulate HA clearing on fix
    await _rescan_past_grace(hass, obj)
    assert ir.async_get(hass).async_get_issue(DOMAIN, _issue_id(obj)) is None, "issue re-raised after the fix"

    # The fix survives a restart: no action, no re-flagged issue.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert _action(obj) is None, "removed action resurrected after restart"
    await _rescan_past_grace(hass, obj)
    assert ir.async_get(hass).async_get_issue(DOMAIN, _issue_id(obj)) is None


async def test_stale_action_target_replaced_with_a_live_entity_clears(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The other fix: point the action at a real entity → the issue clears and
    the new target persists across a restart."""
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)
    await _rescan_past_grace(hass, obj)
    reg = ir.async_get(hass)
    assert reg.async_get_issue(DOMAIN, _issue_id(obj)) is not None

    # A real replacement entity exists.
    hass.states.async_set("light.grow_lamp", "off")

    issue = reg.async_get_issue(DOMAIN, _issue_id(obj))
    flow = await async_create_fix_flow(hass, _issue_id(obj), dict(issue.data or {}))
    flow.hass = hass
    flow.data = dict(issue.data or {})
    await flow.async_step_init()
    result = await flow.async_step_replace_entity(user_input={"new_entity": "light.grow_lamp"})
    assert result["type"] == "create_entry", "replace step did not complete"
    await hass.async_block_till_done()

    action = _action(obj)
    assert action and action["target"]["entity_id"] == "light.grow_lamp", "action target not repointed"

    # The old issue id no longer applies; a rescan finds a valid target → no issue.
    ir.async_delete_issue(hass, DOMAIN, _issue_id(obj))
    await _rescan_past_grace(hass, obj)
    assert ir.async_get(hass).async_get_issue(DOMAIN, _issue_id(obj)) is None

    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert _action(obj)["target"]["entity_id"] == "light.grow_lamp", "repointed target lost across restart"
