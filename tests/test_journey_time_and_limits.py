"""Journeys H1 (downtime catch-up), K1 (history growth), G1 (revoke mid-session).

See docs/design/user-journeys.md.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_fire_time_changed,
)

from custom_components.maintenance_supporter.const import (
    CONF_ADMIN_PANEL_USER_IDS,
    CONF_OPERATOR_WRITE_ENABLED,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
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
from .journey import simulate_restart


def _make_entry(hass: HomeAssistant, unique_id: str, tasks: dict[str, Any]) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Journey Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Journey Object"),
            tasks=tasks,
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── H1: weeks of downtime must not produce a notification storm ────────────


async def test_downtime_catchup_no_storm_but_reminders_resume(
    hass: HomeAssistant,
) -> None:
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(
            notifications_enabled=True,
            notify_service="notify.mobile_app",
        ),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    # Three weeks "offline": several tasks went overdue in the meantime.
    long_ago = (dt_util.now().date() - timedelta(days=40)).isoformat()
    tasks = {
        TASK_ID_1: build_task_data(
            task_id=TASK_ID_1,
            last_performed=long_ago,
            interval_days=14,
        ),
        "b" * 32: build_task_data(
            task_id="b" * 32,
            name="Second",
            last_performed=long_ago,
            interval_days=7,
        ),
        "c" * 32: build_task_data(
            task_id="c" * 32,
            name="Third",
            last_performed=long_ago,
            interval_days=30,
        ),
    }
    obj_entry = _make_entry(hass, "downtime", tasks)

    calls: list[Any] = []

    async def handler(call: Any) -> None:
        calls.append(dict(call.data))

    hass.services.async_register("notify", "mobile_app", handler)

    # "Boot": the first refresh seeds notification state — NO storm.
    await setup_integration(hass, global_entry, obj_entry)
    await hass.async_block_till_done()
    assert not calls, f"boot after downtime sent {len(calls)} notifications"

    # The overdue repeat interval (12h default) later fires ONE reminder per
    # task — reminders resume, they weren't lost. Backdate the seeded
    # last-notified stamps past the interval instead of shrinking the
    # interval: a tiny interval (0.0001 h = 0.36 s) raced the wall clock on
    # fast CI runners (seed → refresh in under 0.36 s ⇒ 0 sends, flaky red).
    from datetime import datetime as _dt
    from datetime import timedelta as _td

    nm = hass.data[DOMAIN]["_notification_manager"]
    assert nm._last_notified, "boot did not seed the notification state"
    for key, stamp in list(nm._last_notified.items()):
        if isinstance(stamp, _dt):
            nm._last_notified[key] = stamp - _td(hours=13)

    coordinator = obj_entry.runtime_data.coordinator
    with patch.object(nm, "_is_quiet_hours", return_value=False):
        await coordinator.async_refresh()
        await hass.async_block_till_done()
    assert len(calls) == 3, "repeat reminders did not resume after downtime"


# ─── K1: sensor flapping must not evict the completion record ────────────────


def test_flapping_trigger_never_evicts_completions() -> None:
    task = MaintenanceTask.from_dict(
        {"id": "t", "object_id": "o", "name": "Flap", "type": "service", "schedule_type": "sensor_based", "warning_days": 3}
    )
    # A real service record: 40 completions with costs.
    for i in range(40):
        task.add_history_entry(HistoryEntryType.COMPLETED, cost=10.0 + i)
    # Then a sensor flaps for a week: 1000 trigger activations.
    for _ in range(1000):
        task.add_history_entry(HistoryEntryType.TRIGGERED, trigger_value=1.0)

    completed = [h for h in task.history if h.get("type") == HistoryEntryType.COMPLETED]
    assert len(completed) == 40, "trigger noise evicted completions"
    assert len(task.history) <= 500
    assert task.times_performed == 40
    assert task.total_cost == sum(10.0 + i for i in range(40))


def test_history_cap_still_bounds_lifecycle_only_growth() -> None:
    task = MaintenanceTask.from_dict(
        {
            "id": "t",
            "object_id": "o",
            "name": "Busy",
            "type": "cleaning",
            "schedule_type": "time_based",
            "interval_days": 1,
            "warning_days": 1,
        }
    )
    for _ in range(700):
        task.add_history_entry(HistoryEntryType.COMPLETED)
    assert len(task.history) == 500  # FIFO fallback still applies


# ─── G1: revoking operator write takes effect mid-session ───────────────────


async def test_operator_write_revoke_applies_to_next_call(
    hass: HomeAssistant,
) -> None:
    """G1: permissions are evaluated PER CALL — flipping the delegation
    switch off rejects the operator's very next call, no reload needed.

    Calls go through the DECORATED handler (call_ws_handler would unwrap
    the @require_write guard away); the guard raises Unauthorized
    synchronously, exactly as in test_ws_permission_matrix.
    """
    from homeassistant.exceptions import Unauthorized

    from custom_components.maintenance_supporter.websocket.tasks_crud import (
        ws_update_task,
    )

    operator = MockUser(id="op-uid", name="Operator").add_to_hass(hass)

    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options={
            CONF_ADMIN_PANEL_USER_IDS: ["op-uid"],
            CONF_OPERATOR_WRITE_ENABLED: True,
        },
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    obj_entry = _make_entry(
        hass,
        "revoke",
        {TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
    )
    await setup_integration(hass, global_entry, obj_entry)

    conn = MagicMock()
    conn.user = operator

    # Delegated: the operator's edit goes through (guard passes; the
    # decorated handler schedules the async body).
    ws_update_task(
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "notes": "operator was here",
        },
    )
    await hass.async_block_till_done()
    conn.send_error.assert_not_called()
    assert obj_entry.data[CONF_TASKS][TASK_ID_1]["notes"] == "operator was here"

    # The admin revokes delegation MID-SESSION — the operator's next call is
    # rejected synchronously by the guard.
    hass.config_entries.async_update_entry(
        global_entry,
        options={**dict(global_entry.options), CONF_OPERATOR_WRITE_ENABLED: False},
    )
    conn2 = MagicMock()
    conn2.user = operator
    with pytest.raises(Unauthorized):
        ws_update_task(
            hass,
            conn2,
            {
                "id": 2,
                "type": "maintenance_supporter/task/update",
                "entry_id": obj_entry.entry_id,
                "task_id": TASK_ID_1,
                "notes": "should be rejected",
            },
        )
    await hass.async_block_till_done()
    assert obj_entry.data[CONF_TASKS][TASK_ID_1]["notes"] == "operator was here"


# Silence the unused-import linter for the time helper kept for future H2/H3
# journeys (DST / timezone), which will need async_fire_time_changed.
_ = async_fire_time_changed
