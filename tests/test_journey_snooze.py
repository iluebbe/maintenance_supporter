"""Journey: snooze is a session thing (B4 / L3 — pins a surprising contract).

Snoozing a task silences its reminders for a while. But the snooze lives only
in the NotificationManager's in-memory ``_snoozed_until`` map, and that manager
is rebuilt from scratch on every Home Assistant restart. So the real contract —
which no test stated — is: a snooze survives a config-entry *reload*, but a full
HA *restart* forgets it and the task can notify again immediately. This journey
pins exactly that, and in doing so exercises the harness distinction between an
entry reload (shared runtime kept) and a full restart (shared runtime rebuilt).

If snooze is ever made persistent, this test's last assertion flips and tells
us to update the contract deliberately.

See docs/design/user-journeys.md (B4 snooze, L3 snooze × lifecycle).
"""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import NOTIFICATION_MANAGER_KEY
from custom_components.maintenance_supporter.const import (
    CONF_QUIET_HOURS_ENABLED,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.tasks import ws_snooze_task

from .conftest import (
    make_ws_connection as _conn,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
from .journey import simulate_full_restart, simulate_restart


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data={
            **build_global_entry_data(notifications_enabled=True, notify_service="notify.test"),
            CONF_QUIET_HOURS_ENABLED: False,
        },
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry




def _object(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Boiler",
        # Task is OK (recently done, long interval) so the coordinator doesn't
        # seed _last_notified for the overdue status at setup — otherwise the
        # manual overdue calls below would hit the repeat gate, not the snooze.
        data=build_object_entry_data(
            object_data=build_object_data(name="Boiler", object_id="objid_boiler"),
            tasks={TASK_ID_1: build_task_data(interval_days=3650, last_performed="2026-07-01")},
        ),
        source="user",
        unique_id="maintenance_supporter_boiler",
    )
    entry.add_to_hass(hass)
    return entry


async def _overdue(hass: HomeAssistant, entry_id: str) -> None:
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    await nm.async_task_status_changed(entry_id, TASK_ID_1, "Service", "Boiler", "overdue", days_until_due=-5)
    await hass.async_block_till_done()


async def test_snooze_survives_reload_but_not_a_full_restart(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    mock = AsyncMock()
    hass.services.async_register("notify", "test", mock)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)

    # Sanity: an overdue task notifies when nothing is suppressing it.
    await _overdue(hass, obj.entry_id)
    assert mock.called, "baseline: overdue task should notify"

    # Snooze it → the reminder is silenced.
    mock.reset_mock()
    await call_ws_handler(
        ws_snooze_task,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/task/snooze", "entry_id": obj.entry_id, "task_id": TASK_ID_1},
    )
    await hass.async_block_till_done()
    await _overdue(hass, obj.entry_id)
    assert not mock.called, "snoozed task should be silent"

    # A config-entry RELOAD keeps the shared NotificationManager, so the snooze
    # is still in effect afterwards (only the object entry reloads).
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    mock.reset_mock()
    await _overdue(hass, obj.entry_id)
    assert not mock.called, "snooze should survive a plain entry reload"

    # A FULL restart rebuilds the shared NotificationManager from scratch — the
    # in-memory snooze is gone, so the task notifies again.
    await simulate_full_restart(hass, global_entry, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    mock.reset_mock()
    await _overdue(hass, obj.entry_id)
    assert mock.called, "a full restart must forget the in-memory snooze (session-only contract)"
