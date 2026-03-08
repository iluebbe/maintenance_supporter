"""Tests for lifecycle coverage gaps.

Covers: multi-object selective unload, calendar aggregation after object
changes, notification manager state isolation, history trimming edge cases,
and miscellaneous edge cases (global unload ordering, NFC after unload).
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECT,
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DEFAULT_MAX_HISTORY_ENTRIES,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
    MaintenanceStatus,
    MaintenanceTypeEnum,
    ScheduleType,
)

from .conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    get_task_store_state,
    setup_integration,
)

# ---------------------------------------------------------------------------
# Helpers for creating multiple distinct objects
# ---------------------------------------------------------------------------

_OBJ_COUNTER = 0


def _next_id() -> str:
    """Generate a unique 32-char hex id."""
    global _OBJ_COUNTER
    _OBJ_COUNTER += 1
    return f"{_OBJ_COUNTER:0>32x}"


def _make_global_entry(
    hass: HomeAssistant,
    *,
    notifications_enabled: bool = False,
    notify_service: str = "",
) -> MockConfigEntry:
    """Create and register a global config entry."""
    data = build_global_entry_data(
        notifications_enabled=notifications_enabled,
        notify_service=notify_service,
    )
    # Disable quiet hours so notification tests aren't blocked by time-of-day
    options: dict[str, Any] = {
        **data,
        CONF_QUIET_HOURS_ENABLED: False,
        CONF_NOTIFY_OVERDUE_ENABLED: True,
    }
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        options=options,
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _make_object_entry(
    hass: HomeAssistant,
    name: str,
    *,
    task_id: str | None = None,
    last_performed_days_ago: int = 20,
    interval_days: int = 30,
    nfc_tag_id: str | None = None,
    history: list[dict[str, Any]] | None = None,
) -> MockConfigEntry:
    """Create and register a maintenance object config entry."""
    obj_id = _next_id()
    tid = task_id or _next_id()
    last_performed = (
        dt_util.now().date() - timedelta(days=last_performed_days_ago)
    ).isoformat()

    task = build_task_data(
        task_id=tid,
        name=f"{name} Task",
        last_performed=last_performed,
        interval_days=interval_days,
        object_id=obj_id,
        history=history,
    )
    if nfc_tag_id is not None:
        task["nfc_tag_id"] = nfc_tag_id

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name, object_id=obj_id),
            tasks={tid: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{name.lower().replace(' ', '_')}",
    )
    entry.add_to_hass(hass)
    return entry


def _get_coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    """Get the coordinator from a loaded entry."""
    ce = hass.config_entries.async_get_entry(entry.entry_id)
    assert ce is not None
    rd = getattr(ce, "runtime_data", None)
    assert rd is not None
    return rd.coordinator


def _get_store(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    """Get the store from a loaded entry."""
    ce = hass.config_entries.async_get_entry(entry.entry_id)
    assert ce is not None
    return ce.runtime_data.store


def _get_task_ids(entry: MockConfigEntry) -> list[str]:
    """Return the task IDs from entry data."""
    return list(entry.data.get(CONF_TASKS, {}).keys())


# ═══════════════════════════════════════════════════════════════════════════
# Group 1: Multi-Object Selective Unload
# ═══════════════════════════════════════════════════════════════════════════


@pytest.mark.asyncio
async def test_unload_one_of_three_objects_others_still_work(
    hass: HomeAssistant,
) -> None:
    """Unloading one object leaves others fully functional."""
    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(hass, "Obj1")
    obj2 = _make_object_entry(hass, "Obj2")
    obj3 = _make_object_entry(hass, "Obj3")

    await setup_integration(hass, global_entry, obj1, obj2, obj3)

    # All three should be loaded
    for e in (obj1, obj2, obj3):
        ce = hass.config_entries.async_get_entry(e.entry_id)
        assert ce is not None
        assert ce.state == ConfigEntryState.LOADED

    # Unload obj2
    result = await hass.config_entries.async_unload(obj2.entry_id)
    await hass.async_block_till_done()
    assert result is True

    # obj2 should be not loaded
    ce2 = hass.config_entries.async_get_entry(obj2.entry_id)
    assert ce2 is not None
    assert ce2.state == ConfigEntryState.NOT_LOADED

    # obj1 coordinator still works
    coord1 = _get_coordinator(hass, obj1)
    assert coord1 is not None
    assert coord1.data is not None

    # obj3 coordinator still works
    coord3 = _get_coordinator(hass, obj3)
    assert coord3 is not None
    assert coord3.data is not None


@pytest.mark.asyncio
async def test_unload_object_then_complete_task_on_remaining(
    hass: HomeAssistant,
) -> None:
    """After unloading one object, completing a task on another still works."""
    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(hass, "ObjA", last_performed_days_ago=60, interval_days=30)
    obj2 = _make_object_entry(hass, "ObjB", last_performed_days_ago=60, interval_days=30)

    await setup_integration(hass, global_entry, obj1, obj2)

    # Unload obj1
    await hass.config_entries.async_unload(obj1.entry_id)
    await hass.async_block_till_done()

    # Complete task on obj2
    coord2 = _get_coordinator(hass, obj2)
    task_id = _get_task_ids(obj2)[0]
    await coord2.complete_maintenance(task_id=task_id)
    await hass.async_block_till_done()

    # Verify store was updated
    state = get_task_store_state(hass, obj2.entry_id, task_id)
    assert state.get("last_performed") is not None


@pytest.mark.asyncio
async def test_unload_reload_object_preserves_store(
    hass: HomeAssistant,
) -> None:
    """Unloading and reloading an object preserves its store data."""
    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(hass, "ObjReload")

    await setup_integration(hass, global_entry, obj1)

    task_id = _get_task_ids(obj1)[0]

    # Complete task so store has a history entry
    coord = _get_coordinator(hass, obj1)
    await coord.complete_maintenance(task_id=task_id, notes="first completion")
    await hass.async_block_till_done()

    # Record last_performed
    state_before = get_task_store_state(hass, obj1.entry_id, task_id)
    lp_before = state_before.get("last_performed")
    assert lp_before is not None

    # Unload
    await hass.config_entries.async_unload(obj1.entry_id)
    await hass.async_block_till_done()

    # Reload
    await hass.config_entries.async_setup(obj1.entry_id)
    await hass.async_block_till_done()

    # Store should still have the history
    state_after = get_task_store_state(hass, obj1.entry_id, task_id)
    assert state_after.get("last_performed") == lp_before
    history = state_after.get("history", [])
    assert len(history) >= 1
    assert history[-1].get("notes") == "first completion"


@pytest.mark.asyncio
async def test_remove_entry_deletes_store_file(
    hass: HomeAssistant,
) -> None:
    """Removing an entry triggers async_remove_entry to clean up the store."""
    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(hass, "ObjRemove")

    await setup_integration(hass, global_entry, obj1)

    task_id = _get_task_ids(obj1)[0]

    # Complete so store has data
    coord = _get_coordinator(hass, obj1)
    await coord.complete_maintenance(task_id=task_id)
    await hass.async_block_till_done()

    # Remove entry entirely
    with patch(
        "custom_components.maintenance_supporter.storage.MaintenanceStore.async_remove",
        new_callable=AsyncMock,
    ) as mock_remove:
        await hass.config_entries.async_remove(obj1.entry_id)
        await hass.async_block_till_done()
        mock_remove.assert_called_once()


# ═══════════════════════════════════════════════════════════════════════════
# Group 2: Calendar Aggregation After Object Changes
# ═══════════════════════════════════════════════════════════════════════════


@pytest.mark.asyncio
async def test_calendar_reflects_three_objects(
    hass: HomeAssistant,
) -> None:
    """Calendar returns events from all loaded objects."""
    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(hass, "CalObj1", last_performed_days_ago=10, interval_days=30)
    obj2 = _make_object_entry(hass, "CalObj2", last_performed_days_ago=20, interval_days=30)
    obj3 = _make_object_entry(hass, "CalObj3", last_performed_days_ago=5, interval_days=60)

    await setup_integration(hass, global_entry, obj1, obj2, obj3)

    calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
    if calendar is None:
        pytest.skip("Calendar entity not created")

    now = dt_util.now()
    events = await calendar.async_get_events(
        hass, now - timedelta(days=90), now + timedelta(days=365)
    )

    # Each object has 1 task → expect at least 3 events
    assert len(events) >= 3

    # Verify all three objects appear in event summaries
    summaries = " ".join(e.summary or "" for e in events)
    assert "CalObj1" in summaries
    assert "CalObj2" in summaries
    assert "CalObj3" in summaries


@pytest.mark.asyncio
async def test_calendar_after_object_unload(
    hass: HomeAssistant,
) -> None:
    """After unloading an object, its events disappear from the calendar."""
    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(hass, "CalUnload1", last_performed_days_ago=10, interval_days=30)
    obj2 = _make_object_entry(hass, "CalUnload2", last_performed_days_ago=10, interval_days=30)
    obj3 = _make_object_entry(hass, "CalUnload3", last_performed_days_ago=10, interval_days=30)

    await setup_integration(hass, global_entry, obj1, obj2, obj3)

    calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
    if calendar is None:
        pytest.skip("Calendar entity not created")

    now = dt_util.now()
    events_before = await calendar.async_get_events(
        hass, now - timedelta(days=90), now + timedelta(days=365)
    )
    summaries_before = " ".join(e.summary or "" for e in events_before)
    assert "CalUnload2" in summaries_before

    # Remove obj2 (calendar iterates async_entries, so unload alone
    # won't hide it — the entry must be fully removed)
    await hass.config_entries.async_remove(obj2.entry_id)
    await hass.async_block_till_done()

    # Invalidate cache
    calendar.invalidate_cache()

    events_after = await calendar.async_get_events(
        hass, now - timedelta(days=90), now + timedelta(days=365)
    )
    summaries_after = " ".join(e.summary or "" for e in events_after)
    assert "CalUnload2" not in summaries_after
    assert "CalUnload1" in summaries_after
    assert "CalUnload3" in summaries_after


@pytest.mark.asyncio
async def test_calendar_event_updates_after_task_completion(
    hass: HomeAssistant,
) -> None:
    """After completing an overdue task, calendar event changes status."""
    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(
        hass, "CalComplete", last_performed_days_ago=60, interval_days=30
    )

    await setup_integration(hass, global_entry, obj1)

    calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
    if calendar is None:
        pytest.skip("Calendar entity not created")

    now = dt_util.now()
    events_before = await calendar.async_get_events(
        hass, now - timedelta(days=90), now + timedelta(days=365)
    )
    cal_events = [e for e in events_before if "CalComplete" in (e.summary or "")]
    assert len(cal_events) >= 1
    # Should have overdue prefix
    assert "\U0001f534" in (cal_events[0].summary or "")  # 🔴

    # Complete task
    coord = _get_coordinator(hass, obj1)
    task_id = _get_task_ids(obj1)[0]
    await coord.complete_maintenance(task_id=task_id)
    await hass.async_block_till_done()

    # Invalidate cache, query again
    calendar.invalidate_cache()
    events_after = await calendar.async_get_events(
        hass, now - timedelta(days=1), now + timedelta(days=365)
    )
    cal_events_after = [e for e in events_after if "CalComplete" in (e.summary or "")]
    assert len(cal_events_after) >= 1
    # Should now have OK prefix (🟢) instead of overdue
    assert "\U0001f534" not in (cal_events_after[0].summary or "")  # no 🔴
    assert "\U0001f7e2" in (cal_events_after[0].summary or "")  # 🟢


# ═══════════════════════════════════════════════════════════════════════════
# Group 3: NotificationManager State Isolation
# ═══════════════════════════════════════════════════════════════════════════


@pytest.mark.asyncio
async def test_notification_state_isolated_between_objects(
    hass: HomeAssistant,
) -> None:
    """Snoozing one object's task does not affect another object's notifications."""
    global_entry = _make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test"
    )
    obj1 = _make_object_entry(hass, "NotifObj1", last_performed_days_ago=60, interval_days=30)
    obj2 = _make_object_entry(hass, "NotifObj2", last_performed_days_ago=60, interval_days=30)

    await setup_integration(hass, global_entry, obj1, obj2)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    task_id_1 = _get_task_ids(obj1)[0]
    task_id_2 = _get_task_ids(obj2)[0]

    # Send notifications for both — patch at class level since instance attr is read-only
    with patch(
        "homeassistant.core.ServiceRegistry.async_call",
        new_callable=AsyncMock,
    ):
        await nm.async_task_status_changed(
            entry_id=obj1.entry_id,
            task_id=task_id_1,
            task_name="Task1",
            object_name="NotifObj1",
            new_status=MaintenanceStatus.OVERDUE,
            days_until_due=-30,
        )
        await nm.async_task_status_changed(
            entry_id=obj2.entry_id,
            task_id=task_id_2,
            task_name="Task2",
            object_name="NotifObj2",
            new_status=MaintenanceStatus.OVERDUE,
            days_until_due=-30,
        )

    # Both should have _last_notified entries
    key1 = f"{obj1.entry_id}_{task_id_1}_{MaintenanceStatus.OVERDUE}"
    key2 = f"{obj2.entry_id}_{task_id_2}_{MaintenanceStatus.OVERDUE}"
    assert key1 in nm._last_notified
    assert key2 in nm._last_notified

    # Snooze obj1's task
    nm.snooze_task(obj1.entry_id, task_id_1)

    # obj1 should be snoozed
    snooze_key1 = f"{obj1.entry_id}_{task_id_1}_{MaintenanceStatus.OVERDUE}"
    assert snooze_key1 in nm._snoozed_until

    # obj2 should NOT be snoozed
    snooze_key2 = f"{obj2.entry_id}_{task_id_2}_{MaintenanceStatus.OVERDUE}"
    assert snooze_key2 not in nm._snoozed_until


@pytest.mark.asyncio
async def test_notification_manager_survives_partial_unload(
    hass: HomeAssistant,
) -> None:
    """NotificationManager state persists when only one object is unloaded."""
    global_entry = _make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test"
    )
    obj1 = _make_object_entry(hass, "NMSurvive1", last_performed_days_ago=60, interval_days=30)
    obj2 = _make_object_entry(hass, "NMSurvive2", last_performed_days_ago=60, interval_days=30)

    await setup_integration(hass, global_entry, obj1, obj2)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    task_id_2 = _get_task_ids(obj2)[0]

    # Trigger notification for obj2
    with patch(
        "homeassistant.core.ServiceRegistry.async_call",
        new_callable=AsyncMock,
    ):
        await nm.async_task_status_changed(
            entry_id=obj2.entry_id,
            task_id=task_id_2,
            task_name="Task2",
            object_name="NMSurvive2",
            new_status=MaintenanceStatus.OVERDUE,
            days_until_due=-30,
        )

    key2 = f"{obj2.entry_id}_{task_id_2}_{MaintenanceStatus.OVERDUE}"
    assert key2 in nm._last_notified

    # Unload obj1
    await hass.config_entries.async_unload(obj1.entry_id)
    await hass.async_block_till_done()

    # NotificationManager should still exist and have obj2 state
    nm_after = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm_after is not None
    assert key2 in nm_after._last_notified

    # Re-sending for obj2 within interval should be rate-limited (state survived)
    with patch(
        "homeassistant.core.ServiceRegistry.async_call",
        new_callable=AsyncMock,
    ) as mock_call:
        await nm_after.async_task_status_changed(
            entry_id=obj2.entry_id,
            task_id=task_id_2,
            task_name="Task2",
            object_name="NMSurvive2",
            new_status=MaintenanceStatus.OVERDUE,
            days_until_due=-30,
        )
        # Should NOT have sent (rate limited by previous notification)
        mock_call.assert_not_called()


@pytest.mark.asyncio
async def test_notification_manager_cleared_on_full_unload(
    hass: HomeAssistant,
) -> None:
    """NotificationManager state is cleared when async_unload is called."""
    global_entry = _make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test"
    )
    obj1 = _make_object_entry(hass, "NMClear1", last_performed_days_ago=60, interval_days=30)

    await setup_integration(hass, global_entry, obj1)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    assert nm is not None

    task_id = _get_task_ids(obj1)[0]

    # Trigger notification so NM has state
    with patch(
        "homeassistant.core.ServiceRegistry.async_call",
        new_callable=AsyncMock,
    ):
        await nm.async_task_status_changed(
            entry_id=obj1.entry_id,
            task_id=task_id,
            task_name="Task1",
            object_name="NMClear1",
            new_status=MaintenanceStatus.OVERDUE,
            days_until_due=-30,
        )

    key = f"{obj1.entry_id}_{task_id}_{MaintenanceStatus.OVERDUE}"
    assert key in nm._last_notified

    # Snooze so _snoozed_until has data too
    nm.snooze_task(obj1.entry_id, task_id)
    assert len(nm._snoozed_until) > 0

    # Call async_unload directly (the cleanup mechanism)
    await nm.async_unload()

    # All internal state should be cleared
    assert len(nm._last_notified) == 0
    assert len(nm._snoozed_until) == 0
    assert nm._daily_count == 0
    assert nm._daily_reset_date is None


# ═══════════════════════════════════════════════════════════════════════════
# Group 4: History Trimming & Large Data
# ═══════════════════════════════════════════════════════════════════════════


@pytest.mark.asyncio
async def test_history_trimmed_at_max_entries(
    hass: HomeAssistant,
) -> None:
    """Adding history beyond DEFAULT_MAX_HISTORY_ENTRIES trims the oldest."""
    # Build 50 existing history entries
    existing_history = [
        {
            "timestamp": (
                dt_util.now() - timedelta(days=DEFAULT_MAX_HISTORY_ENTRIES - i)
            ).isoformat(),
            "type": HistoryEntryType.COMPLETED,
            "notes": f"entry_{i}",
        }
        for i in range(DEFAULT_MAX_HISTORY_ENTRIES)
    ]
    assert len(existing_history) == DEFAULT_MAX_HISTORY_ENTRIES

    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(
        hass,
        "HistTrim",
        last_performed_days_ago=60,
        interval_days=30,
        history=existing_history,
    )

    await setup_integration(hass, global_entry, obj1)

    task_id = _get_task_ids(obj1)[0]

    # Complete task → adds 51st entry
    coord = _get_coordinator(hass, obj1)
    await coord.complete_maintenance(task_id=task_id, notes="new_completion")
    await hass.async_block_till_done()

    # Verify history is capped
    state = get_task_store_state(hass, obj1.entry_id, task_id)
    history = state.get("history", [])
    assert len(history) == DEFAULT_MAX_HISTORY_ENTRIES

    # Newest entry should be the completion
    assert history[-1]["notes"] == "new_completion"
    assert history[-1]["type"] == HistoryEntryType.COMPLETED

    # Oldest entry should NOT be entry_0 (it was trimmed)
    assert history[0]["notes"] != "entry_0"


@pytest.mark.asyncio
async def test_many_tasks_per_object(
    hass: HomeAssistant,
) -> None:
    """An object with 20 tasks loads all tasks correctly."""
    task_count = 20
    tasks: dict[str, dict[str, Any]] = {}
    obj_id = _next_id()
    for i in range(task_count):
        tid = _next_id()
        last_days = 10 + i  # varied
        lp = (dt_util.now().date() - timedelta(days=last_days)).isoformat()
        tasks[tid] = build_task_data(
            task_id=tid,
            name=f"Task_{i:02d}",
            last_performed=lp,
            interval_days=30,
            object_id=obj_id,
        )

    global_entry = _make_global_entry(hass)
    obj_data = build_object_data(name="ManyTasks", object_id=obj_id)
    obj_data["task_ids"] = list(tasks.keys())

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="ManyTasks",
        data={CONF_OBJECT: obj_data, CONF_TASKS: tasks},
        source="user",
        unique_id="maintenance_supporter_many_tasks",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_entry, entry)

    coord = _get_coordinator(hass, entry)
    assert coord is not None
    assert coord.data is not None
    data_tasks = coord.data.get(CONF_TASKS, {})
    assert len(data_tasks) == task_count


@pytest.mark.asyncio
async def test_many_objects_simultaneous(
    hass: HomeAssistant,
) -> None:
    """Loading 10 objects simultaneously all succeed."""
    global_entry = _make_global_entry(hass)
    objects = [
        _make_object_entry(hass, f"Multi{i:02d}", last_performed_days_ago=10 + i)
        for i in range(10)
    ]

    await setup_integration(hass, global_entry, *objects)

    # All should be loaded
    for obj in objects:
        ce = hass.config_entries.async_get_entry(obj.entry_id)
        assert ce is not None
        assert ce.state == ConfigEntryState.LOADED

    # All coordinators should have data
    for obj in objects:
        coord = _get_coordinator(hass, obj)
        assert coord is not None
        assert coord.data is not None

    # Calendar should have events for all 10
    calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
    if calendar is not None:
        now = dt_util.now()
        events = await calendar.async_get_events(
            hass, now - timedelta(days=90), now + timedelta(days=365)
        )
        assert len(events) >= 10


# ═══════════════════════════════════════════════════════════════════════════
# Group 5: Edge Cases
# ═══════════════════════════════════════════════════════════════════════════


@pytest.mark.asyncio
async def test_global_unload_before_objects_no_crash(
    hass: HomeAssistant,
) -> None:
    """Unloading the global entry first does not crash."""
    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(hass, "GlobalFirst")

    await setup_integration(hass, global_entry, obj1)

    # Unload global while obj1 is still loaded — should not raise
    result = await hass.config_entries.async_unload(global_entry.entry_id)
    await hass.async_block_till_done()
    assert result is True

    # obj1 should still be loaded (its own unload wasn't triggered)
    ce = hass.config_entries.async_get_entry(obj1.entry_id)
    assert ce is not None
    assert ce.state == ConfigEntryState.LOADED


@pytest.mark.asyncio
async def test_nfc_tag_scan_after_object_unload(
    hass: HomeAssistant,
) -> None:
    """Firing tag_scanned for an unloaded object does not crash."""
    tag_id = "test-nfc-tag-123"
    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(
        hass, "NFCObj", nfc_tag_id=tag_id, last_performed_days_ago=60, interval_days=30
    )

    await setup_integration(hass, global_entry, obj1)

    # Unload obj1
    await hass.config_entries.async_unload(obj1.entry_id)
    await hass.async_block_till_done()

    # Fire tag_scanned — should not raise even though coordinator is gone
    hass.bus.async_fire("tag_scanned", {"tag_id": tag_id, "device_id": "some_device"})
    await hass.async_block_till_done()
    # If we got here without exception, test passes
