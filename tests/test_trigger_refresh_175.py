"""#175: a trigger flip reaches the coordinator now, not on the next tick.

Notifications (and the ``maintenance_supporter_notification`` event) are
decided in the coordinator's refresh from the status change. Before the fix
nothing asked for a refresh when a trigger activated, so the reminder trailed
the flip by up to a full 5-minute update interval. Pins: activation and
deactivation of a threshold trigger and of a compound trigger each request a
(debounced) refresh, and the status-change notification goes out once the
debounce window has passed — long before the periodic tick.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
    ScheduleType,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(notifications_enabled=True, notify_service="notify.test"),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _entry(hass: HomeAssistant, task: dict[str, Any], uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Trigger Test",
        data=build_object_entry_data(object_data=build_object_data(name="Trigger Test"), tasks={TASK_ID_1: task}),
        source="user",
        unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


def _threshold_task(entity: str) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    return build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": "threshold", "entity_id": entity, "entity_ids": [entity], "trigger_above": 30},
    )


async def test_threshold_flip_requests_a_refresh_and_the_reminder_follows_within_the_debounce(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    hass.states.async_set("sensor.t175", "20")
    obj = _entry(hass, _threshold_task("sensor.t175"), "t175")
    await setup_integration(hass, global_entry, obj)
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    notify = AsyncMock()

    with (
        patch.object(coordinator, "async_request_refresh", wraps=coordinator.async_request_refresh) as req,
        patch.object(nm, "async_task_status_changed", notify),
    ):
        hass.states.async_set("sensor.t175", "35")
        await hass.async_block_till_done()
        assert req.await_count >= 1, "activation must ask the coordinator for a refresh"
        # The request is debounced (HA's 10-second cooldown) — let it elapse.
        async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=11))
        await hass.async_block_till_done(wait_background_tasks=True)

    assert notify.await_count >= 1, "the triggered reminder must not wait for the 5-minute tick"
    assert notify.await_args.kwargs["new_status"] == MaintenanceStatus.TRIGGERED


async def test_threshold_deactivation_requests_a_refresh_too(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    hass.states.async_set("sensor.t175b", "35")
    obj = _entry(hass, _threshold_task("sensor.t175b"), "t175b")
    await setup_integration(hass, global_entry, obj)
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator

    with patch.object(coordinator, "async_request_refresh", wraps=coordinator.async_request_refresh) as req:
        hass.states.async_set("sensor.t175b", "20")
        await hass.async_block_till_done()
    assert req.await_count >= 1


async def test_compound_trigger_flips_request_a_refresh(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    hass.states.async_set("sensor.c175a", "10")
    hass.states.async_set("sensor.c175b", "10")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "compound",
            "compound_logic": "and",
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.c175a", "trigger_above": 30},
                {"type": "threshold", "entity_id": "sensor.c175b", "trigger_above": 30},
            ],
        },
    )
    obj = _entry(hass, task, "c175")
    await setup_integration(hass, global_entry, obj)
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator

    with patch.object(coordinator, "async_request_refresh", wraps=coordinator.async_request_refresh) as req:
        hass.states.async_set("sensor.c175a", "35")
        hass.states.async_set("sensor.c175b", "35")
        await hass.async_block_till_done()
        activated = req.await_count
        assert activated >= 1, "compound activation must request a refresh"
        hass.states.async_set("sensor.c175b", "10")
        await hass.async_block_till_done()
        assert req.await_count > activated, "compound deactivation must request a refresh"


async def test_a_real_edge_after_completion_survives_the_refresh(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The post-completion cooldown guards the fallback sweep against a still-low
    sensor; a genuine re-activation from the event-driven trigger lifts it, so
    the refresh the flip now requests does not wipe the fresh latch."""
    hass.states.async_set("sensor.t175c", "20")
    obj = _entry(hass, _threshold_task("sensor.t175c"), "t175c")
    await setup_integration(hass, global_entry, obj)
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator

    hass.states.async_set("sensor.t175c", "35")
    await hass.async_block_till_done()
    assert coordinator.data["tasks"][TASK_ID_1]["_trigger_active"] is True

    await coordinator.complete_maintenance(TASK_ID_1, notes="serviced")
    await hass.async_block_till_done()
    assert TASK_ID_1 in coordinator._recently_completed
    assert coordinator.data["tasks"][TASK_ID_1]["_trigger_active"] is False

    # Still above the limit; a new reading is a real edge for the reset trigger.
    hass.states.async_set("sensor.t175c", "36")
    await hass.async_block_till_done()
    assert TASK_ID_1 not in coordinator._recently_completed, "a real edge lifts the cooldown"
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert coordinator.data["tasks"][TASK_ID_1]["_trigger_active"] is True
