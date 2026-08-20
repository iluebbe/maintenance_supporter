"""Journey: "push me only about the urgent stuff" — priority routing (#134).

The exact setup from Discussion #134, driven end-to-end through the real
coordinator notification path: a household keeps a daily digest for
everything but wants phone pushes only for HIGH-priority tasks. They save a
"High priority" view and point the notification scope at it.

* a high- AND a low-priority task turn overdue on the SAME refresh —
  only the high one reaches the notification manager,
* deleting the scoped view degrades to "notify about everything"
  (a stale scope must never silence the household),
* and the task sensors expose priority for automations.
"""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_SCOPE_VIEW_ID,
    CONF_NOTIFY_SERVICE,
    CONF_QUIET_HOURS_ENABLED,
    CONF_SAVED_FILTER_VIEWS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
)

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

HIGH_TASK = "task_high"
LOW_TASK = "task_low"
VIEW_ID = "view-high-prio"


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
        options={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.mobile_app",
            CONF_NOTIFY_OVERDUE_ENABLED: True,
            CONF_QUIET_HOURS_ENABLED: False,
            CONF_NOTIFY_SCOPE_VIEW_ID: VIEW_ID,
            CONF_SAVED_FILTER_VIEWS: [
                {
                    "id": VIEW_ID,
                    "name": "High priority",
                    "filters": {"priority": "high"},
                }
            ],
        },
    )
    entry.add_to_hass(hass)
    return entry


def _robot(hass: HomeAssistant) -> MockConfigEntry:
    fresh = (dt_util.now().date() - timedelta(days=5)).isoformat()
    high = build_task_data(task_id=HIGH_TASK, name="Refill Water", interval_days=30, last_performed=fresh)
    high["priority"] = "high"
    low = build_task_data(task_id=LOW_TASK, name="Replace Brush", interval_days=30, last_performed=fresh)
    low["priority"] = "low"
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Robot Vac",
        data=build_object_entry_data(
            object_data=build_object_data(name="Robot Vac"),
            tasks={HIGH_TASK: high, LOW_TASK: low},
        ),
        source="user",
        unique_id="maintenance_supporter_journey_prio",
    )
    entry.add_to_hass(hass)
    return entry


async def _age_both_tasks(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    """Both tasks turn overdue on the same refresh (store-side, no reload)."""
    coordinator = entry.runtime_data.coordinator
    old = dt_util.now().date() - timedelta(days=45)
    await coordinator.reset_maintenance(HIGH_TASK, date=old)
    await coordinator.reset_maintenance(LOW_TASK, date=old)
    await hass.async_block_till_done()


async def test_journey_high_priority_view_routes_the_push(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    robot = _robot(hass)
    await setup_integration(hass, global_entry, robot)

    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    sent = AsyncMock()
    with patch.object(nm, "async_task_status_changed", sent):
        await _age_both_tasks(hass, robot)

    notified = {c.kwargs["task_id"] for c in sent.call_args_list}
    assert HIGH_TASK in notified, "the high-priority overdue must push"
    assert LOW_TASK not in notified, "the low-priority overdue must be scoped out"

    # The sensors carry the routing dimension for user automations too.
    reg = er.async_get(hass)
    states = {
        e.entity_id: hass.states.get(e.entity_id)
        for e in er.async_entries_for_config_entry(reg, robot.entry_id)
        if e.domain == "sensor"
    }
    prios = sorted(s.attributes.get("priority") for s in states.values() if s)
    assert prios == ["high", "low"]


async def test_journey_deleted_scope_view_never_silences(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A stale scope id (view deleted) means 'no scope', not 'no pushes'."""
    hass.config_entries.async_update_entry(
        global_entry,
        options={
            **dict(global_entry.options),
            CONF_SAVED_FILTER_VIEWS: [],  # the view is gone; the scope id dangles
        },
    )
    robot = _robot(hass)
    await setup_integration(hass, global_entry, robot)

    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    sent = AsyncMock()
    with patch.object(nm, "async_task_status_changed", sent):
        await _age_both_tasks(hass, robot)

    notified = {c.kwargs["task_id"] for c in sent.call_args_list}
    assert notified == {HIGH_TASK, LOW_TASK}
