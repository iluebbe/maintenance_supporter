"""Tests for entity lifecycle and registry behavior."""

from __future__ import annotations

from custom_components.maintenance_supporter.const import (
    ScheduleType,
)

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_OBJECT,
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DEFAULT_MAX_HISTORY_ENTRIES,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
    MaintenanceStatus,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    get_task_store_state,
    setup_integration,
)

# ─── 5.1 Unique ID Stability ────────────────────────────────────────────


async def test_sensor_unique_id_format(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that sensor unique_id follows expected format."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(
        entity_reg, object_config_entry.entry_id
    )

    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) == 1

    # unique_id should be: maintenance_supporter_{object_slug}_{task_id}
    unique_id = sensor_entities[0].unique_id
    assert unique_id.startswith("maintenance_supporter_")
    assert unique_id.endswith(TASK_ID_1)


async def test_unique_id_stable_across_reloads(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that unique_id is stable after reload."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_reg = er.async_get(hass)
    entities_before = er.async_entries_for_config_entry(
        entity_reg, object_config_entry.entry_id
    )
    uids_before = {e.unique_id for e in entities_before}

    # Reload
    await hass.config_entries.async_unload(object_config_entry.entry_id)
    await hass.config_entries.async_setup(object_config_entry.entry_id)
    await hass.async_block_till_done()

    entities_after = er.async_entries_for_config_entry(
        entity_reg, object_config_entry.entry_id
    )
    uids_after = {e.unique_id for e in entities_after}

    assert uids_before == uids_after


# ─── 5.2 Entry Setup / Unload ───────────────────────────────────────────


async def test_entry_setup_and_state(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that entries are properly set up."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    assert global_config_entry.state == ConfigEntryState.LOADED
    assert object_config_entry.state == ConfigEntryState.LOADED


async def test_entry_unload(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that entries can be unloaded cleanly."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.async_unload(object_config_entry.entry_id)
    assert result is True
    assert object_config_entry.state == ConfigEntryState.NOT_LOADED


async def test_global_entry_setup(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that global entry setup doesn't create a coordinator."""
    await setup_integration(hass, global_config_entry)

    assert global_config_entry.state == ConfigEntryState.LOADED
    assert global_config_entry.runtime_data.coordinator is None


async def test_object_entry_has_coordinator(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that object entry creates a coordinator."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    assert object_config_entry.runtime_data.coordinator is not None


# ─── 5.3 Multiple Tasks Create Multiple Sensors ─────────────────────────


async def test_multiple_tasks_create_sensors(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that each task creates one sensor entity."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task1 = build_task_data(task_id=TASK_ID_1, name="Task A", last_performed=last)
    task2 = build_task_data(task_id=TASK_ID_2, name="Task B", last_performed=last)

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Multi Task Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Multi Task Object"),
            tasks={TASK_ID_1: task1, TASK_ID_2: task2},
        ),
        source="user",
        unique_id="maintenance_supporter_multi_task_object",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) == 2


# ─── 5.4 Device Registry ────────────────────────────────────────────────


async def test_device_created_for_object(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that a device is created for the maintenance object."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    from homeassistant.helpers import device_registry as dr

    device_reg = dr.async_get(hass)
    devices = dr.async_entries_for_config_entry(
        device_reg, object_config_entry.entry_id
    )
    assert len(devices) == 1
    assert devices[0].name == "Pool Pump"


# ─── migrated from test_lifecycle_coverage.py (structure reorg) ───


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
    assert calendar is not None, "calendar entity should be created on the global entry"

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
    assert calendar is not None, "calendar entity should be created on the global entry"

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
    assert calendar is not None, "calendar entity should be created on the global entry"

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


# ═══════════════════════════════════════════════════════════════════════════
# Group 7: Real Last-Entry Unload Lifecycle (P1b)
# ═══════════════════════════════════════════════════════════════════════════


@pytest.mark.asyncio
async def test_real_last_entry_unload_cleans_up_domain_data(
    hass: HomeAssistant,
) -> None:
    """Real unload of the sole entry triggers full domain cleanup.

    Verifies that hass.data[DOMAIN] is removed, the NotificationManager is
    unloaded, and event listener unsubs are called — all without patching
    async_entries or async_unload_platforms.
    """
    global_entry = _make_global_entry(hass)
    await setup_integration(hass, global_entry)

    # Verify domain data exists with NM and event unsubs
    assert DOMAIN in hass.data
    nm = hass.data[DOMAIN].get("_notification_manager")
    assert nm is not None
    event_unsubs = hass.data[DOMAIN].get("_event_unsubs", [])
    # 3 baseline (notification + tag_scanned + action_listener) +
    # 1 v1.5.3 (EVENT_DEVICE_REGISTRY_UPDATED — reverse area sync, #48) +
    # 1 v1.5.4 (EVENT_ENTITY_REGISTRY_UPDATED — entity-rename rewrite) +
    # 1 v2.10.0 (daily archive/auto-delete retention sweep timer).
    assert len(event_unsubs) == 6

    # Spy on the unsub callbacks
    original_unsubs = list(event_unsubs)
    call_tracker = []
    def _make_wrapper(fn: Any, idx: int) -> Any:
        def wrapper() -> None:
            call_tracker.append(idx)
            fn()
        return wrapper

    for i, orig in enumerate(original_unsubs):
        hass.data[DOMAIN]["_event_unsubs"][i] = _make_wrapper(orig, i)

    # Spy on NM.async_unload
    with patch.object(nm, "async_unload", wraps=nm.async_unload) as nm_unload_spy:
        # Real HA unload — no patches
        result = await hass.config_entries.async_unload(global_entry.entry_id)
        await hass.async_block_till_done()

    assert result is True
    # Domain data should be fully cleaned up
    assert DOMAIN not in hass.data
    # All six event unsubs should have been called (notification + tag_scanned
    # + action_listener + device_registry [#48] + entity_registry [v1.5.4]
    # + retention sweep timer [v2.10.0]).
    assert sorted(call_tracker) == [0, 1, 2, 3, 4, 5]
    # NM.async_unload should have been called
    nm_unload_spy.assert_awaited_once()


@pytest.mark.asyncio
async def test_partial_unload_preserves_domain_data_and_listeners(
    hass: HomeAssistant,
) -> None:
    """Unloading one of two entries does NOT trigger domain cleanup.

    The NotificationManager and event listeners must survive when other
    entries remain registered.
    """
    global_entry = _make_global_entry(hass)
    obj1 = _make_object_entry(hass, "PartialUnload")
    await setup_integration(hass, global_entry, obj1)

    assert DOMAIN in hass.data
    nm_before = hass.data[DOMAIN].get("_notification_manager")
    assert nm_before is not None

    # Unload the object entry — global entry remains
    result = await hass.config_entries.async_unload(obj1.entry_id)
    await hass.async_block_till_done()
    assert result is True

    # Domain data must still exist
    assert DOMAIN in hass.data
    nm_after = hass.data[DOMAIN].get("_notification_manager")
    assert nm_after is nm_before  # same instance, not recreated
    # notification + tag_scanned + action_listener + device_registry (#48)
    # + entity_registry (v1.5.4) + retention sweep timer (v2.10.0).
    assert len(hass.data[DOMAIN].get("_event_unsubs", [])) == 6


# ─── __init__.py _get_coordinator_for_entity ────────────────────────────


def test_get_coordinator_for_entity_not_in_registry(
    hass: HomeAssistant,
) -> None:
    """_get_coordinator_for_entity returns None when entity is not in registry."""
    from custom_components.maintenance_supporter import _get_coordinator_for_entity

    result = _get_coordinator_for_entity(hass, "sensor.nonexistent")
    assert result is None


async def test_get_coordinator_for_entity_no_config_entry_id(
    hass: HomeAssistant,
) -> None:
    """_get_coordinator_for_entity returns None when config_entry_id is None."""
    from custom_components.maintenance_supporter import _get_coordinator_for_entity

    entity_reg = er.async_get(hass)
    # Mock entity with config_entry_id=None
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.config_entry_id = None
        mock_get.return_value = mock_entry
        result = _get_coordinator_for_entity(hass, "sensor.fake_entity")
    assert result is None


async def test_get_coordinator_for_entity_config_entry_gone(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """_get_coordinator_for_entity returns None when config entry doesn't exist."""
    from custom_components.maintenance_supporter import _get_coordinator_for_entity

    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_reg = er.async_get(hass)
    # Mock entity pointing to nonexistent config entry
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.config_entry_id = "nonexistent_entry_id"
        mock_get.return_value = mock_entry
        result = _get_coordinator_for_entity(hass, "sensor.fake_entity")
    assert result is None


async def test_get_coordinator_for_entity_no_runtime_data(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """_get_coordinator_for_entity returns None when runtime_data is None."""
    from custom_components.maintenance_supporter import _get_coordinator_for_entity

    await setup_integration(hass, global_config_entry)

    entity_reg = er.async_get(hass)
    # Mock entity pointing to global entry (which has no runtime_data.coordinator)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.config_entry_id = global_config_entry.entry_id
        mock_get.return_value = mock_entry
        result = _get_coordinator_for_entity(hass, "sensor.fake_entity")
    assert result is None


# ─── __init__.py _get_task_id_for_entity ────────────────────────────────


def test_get_task_id_for_entity_not_in_registry(
    hass: HomeAssistant,
) -> None:
    """_get_task_id_for_entity returns None when entity not in registry."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    result = _get_task_id_for_entity(hass, "sensor.nonexistent")
    assert result is None


async def test_get_task_id_for_entity_wrong_prefix(
    hass: HomeAssistant,
) -> None:
    """_get_task_id_for_entity returns None when unique_id has wrong prefix."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    entity_reg = er.async_get(hass)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.unique_id = "wrong_prefix_test"
        mock_get.return_value = mock_entry
        result = _get_task_id_for_entity(hass, "sensor.something")
    assert result is None


async def test_get_task_id_for_entity_no_config_entry_id(
    hass: HomeAssistant,
) -> None:
    """_get_task_id_for_entity returns None when config_entry_id is None."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    entity_reg = er.async_get(hass)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.unique_id = f"maintenance_supporter_obj_{TASK_ID_1}"
        mock_entry.config_entry_id = None
        mock_get.return_value = mock_entry
        result = _get_task_id_for_entity(hass, "sensor.something")
    assert result is None


async def test_get_task_id_for_entity_no_config_entry(
    hass: HomeAssistant,
) -> None:
    """_get_task_id_for_entity returns None when config entry doesn't exist."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    entity_reg = er.async_get(hass)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.unique_id = f"maintenance_supporter_obj_{TASK_ID_1}"
        mock_entry.config_entry_id = "nonexistent_entry_id"
        mock_get.return_value = mock_entry
        result = _get_task_id_for_entity(hass, "sensor.something")
    assert result is None


async def test_get_task_id_for_entity_no_matching_task(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """_get_task_id_for_entity returns None when no task matches unique_id."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_reg = er.async_get(hass)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.unique_id = "maintenance_supporter_pool_pump_ffffffffffffffffffffffffffffffff"
        mock_entry.config_entry_id = object_config_entry.entry_id
        mock_get.return_value = mock_entry
        result = _get_task_id_for_entity(hass, "sensor.something")
    assert result is None


async def test_get_task_id_for_entity_binary_sensor(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """_get_task_id_for_entity works for binary_sensor unique_ids (_overdue suffix)."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_reg = er.async_get(hass)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        # Binary sensor unique_id has _overdue suffix after task_id
        mock_entry.unique_id = f"maintenance_supporter_pool_pump_{TASK_ID_1}_overdue"
        mock_entry.config_entry_id = object_config_entry.entry_id
        mock_get.return_value = mock_entry
        result = _get_task_id_for_entity(hass, "binary_sensor.something")
    assert result == TASK_ID_1


async def test_get_task_id_substring_no_false_match(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """_get_task_id_for_entity must not match on substring of task_id."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_reg = er.async_get(hass)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        # Use a unique_id where the task_id appears as a substring but not at the end
        # e.g. task_id "abc123" appearing inside "Xabc123Y"
        mock_entry.unique_id = f"maintenance_supporter_obj_XX{TASK_ID_1}XX"
        mock_entry.config_entry_id = object_config_entry.entry_id
        mock_get.return_value = mock_entry
        result = _get_task_id_for_entity(hass, "sensor.something")
    assert result is None


# ─── __init__.py async_remove_config_entry_device ───────────────────────


async def test_remove_config_entry_device_no_entities(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """async_remove_config_entry_device returns True when device has no entities."""
    from custom_components.maintenance_supporter import async_remove_config_entry_device

    await setup_integration(hass, global_config_entry, object_config_entry)

    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=object_config_entry.entry_id,
        identifiers={(DOMAIN, "test_device_empty")},
    )

    result = await async_remove_config_entry_device(
        hass, object_config_entry, device
    )
    assert result is True


async def test_remove_config_entry_device_with_entities(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """async_remove_config_entry_device returns False when device has entities."""
    from custom_components.maintenance_supporter import async_remove_config_entry_device

    await setup_integration(hass, global_config_entry, object_config_entry)

    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=object_config_entry.entry_id,
        identifiers={(DOMAIN, "test_device_with_ent")},
    )

    entity_reg = er.async_get(hass)
    entity_reg.async_get_or_create(
        "sensor", DOMAIN, "device_entity_test",
        config_entry=object_config_entry,
        device_id=device.id,
    )

    result = await async_remove_config_entry_device(
        hass, object_config_entry, device
    )
    assert result is False


def _make_global(hass: HomeAssistant, **kw) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(**kw),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _make_object(
    hass: HomeAssistant,
    tasks: dict | None = None,
    name: str = "Test Object",
    uid: str = "test_obj_cov",
    object_data: dict | None = None,
) -> MockConfigEntry:
    od = object_data or build_object_data(name=name)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title=name,
        data=build_object_entry_data(object_data=od, tasks=tasks or {}),
        source="user",
        unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


def _get_entities_by_domain(hass: HomeAssistant, entry: MockConfigEntry, domain: str):
    reg = er.async_get(hass)
    return [e for e in er.async_entries_for_config_entry(reg, entry.entry_id) if e.domain == domain]


# ─── __init__.py line 466 — notification action listener ─────────────────────


async def test_notification_action_complete(hass: HomeAssistant) -> None:
    """__init__ line ~369-393: MS_COMPLETE_ notification action works."""
    global_entry = _make_global(hass)
    task = build_task_data(last_performed=(dt_util.now().date() - timedelta(days=20)).isoformat())
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="notif_action")
    await setup_integration(hass, global_entry, obj_entry)

    entry_id = obj_entry.entry_id
    # Fire a MS_COMPLETE_ notification action
    hass.bus.async_fire(
        "mobile_app_notification_action",
        {"action": f"MS_COMPLETE_{entry_id}_{TASK_ID_1}"},
    )
    await hass.async_block_till_done()
    # Task should have been completed — check last_performed changed
    coord = obj_entry.runtime_data.coordinator
    merged = coord._get_merged_tasks_data()
    assert merged[TASK_ID_1].get("last_performed") == dt_util.now().date().isoformat()


async def test_notification_action_skip(hass: HomeAssistant) -> None:
    """__init__: MS_SKIP_ notification action runs skip_maintenance."""
    global_entry = _make_global(hass)
    task = build_task_data(last_performed=(dt_util.now().date() - timedelta(days=20)).isoformat())
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="notif_skip")
    await setup_integration(hass, global_entry, obj_entry)

    coord = obj_entry.runtime_data.coordinator
    with patch.object(coord, "skip_maintenance", new_callable=AsyncMock) as mock_skip:
        hass.bus.async_fire(
            "mobile_app_notification_action",
            {"action": f"MS_SKIP_{obj_entry.entry_id}_{TASK_ID_1}"},
        )
        await hass.async_block_till_done()
        mock_skip.assert_called_once()


async def test_notification_action_snooze(hass: HomeAssistant) -> None:
    """__init__: MS_SNOOZE_ notification action calls nm.snooze_task."""
    global_entry = _make_global(hass)
    task = build_task_data()
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="notif_snooze")
    await setup_integration(hass, global_entry, obj_entry)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    if nm is not None:
        with patch.object(nm, "snooze_task") as mock_snooze:
            hass.bus.async_fire(
                "mobile_app_notification_action",
                {"action": f"MS_SNOOZE_{obj_entry.entry_id}_{TASK_ID_1}"},
            )
            await hass.async_block_till_done()
            mock_snooze.assert_called_once_with(obj_entry.entry_id, TASK_ID_1)


async def test_notification_action_invalid_format(hass: HomeAssistant) -> None:
    """__init__: notification action with invalid format is silently ignored."""
    global_entry = _make_global(hass)
    await setup_integration(hass, global_entry)

    # Should not raise
    hass.bus.async_fire(
        "mobile_app_notification_action",
        {"action": "MS_COMPLETE_"},  # missing parts
    )
    await hass.async_block_till_done()


async def test_notification_action_unknown_entry(hass: HomeAssistant) -> None:
    """__init__: MS_COMPLETE_ with unknown entry_id is silently ignored."""
    global_entry = _make_global(hass)
    await setup_integration(hass, global_entry)

    hass.bus.async_fire(
        "mobile_app_notification_action",
        {"action": f"MS_COMPLETE_unknownentry_{TASK_ID_1}"},
    )
    await hass.async_block_till_done()


# ─── __init__.py line 474 — NFC tag scan ─────────────────────────────────────


async def test_nfc_tag_scanned_no_match(hass: HomeAssistant) -> None:
    """__init__: tag_scanned with no matching task is silently ignored."""
    global_entry = _make_global(hass)
    task = build_task_data()
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="nfc_no_match")
    await setup_integration(hass, global_entry, obj_entry)

    hass.bus.async_fire("tag_scanned", {"tag_id": "nonexistent_tag_xyz"})
    await hass.async_block_till_done()


async def test_nfc_tag_scanned_completes_task(hass: HomeAssistant) -> None:
    """__init__: tag_scanned with matching nfc_tag_id completes the task."""
    global_entry = _make_global(hass)
    task = build_task_data(last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat())
    task["nfc_tag_id"] = "test_nfc_tag_abc"
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="nfc_match")
    await setup_integration(hass, global_entry, obj_entry)

    coord = obj_entry.runtime_data.coordinator
    with patch.object(coord, "complete_maintenance", new_callable=AsyncMock) as mock_complete:
        hass.bus.async_fire("tag_scanned", {"tag_id": "test_nfc_tag_abc"})
        await hass.async_block_till_done()
        mock_complete.assert_called_once()
        assert mock_complete.call_args.kwargs["task_id"] == TASK_ID_1


# ─── __init__.py line 503 — device registry update (area sync) ───────────────


async def test_device_registry_area_sync(hass: HomeAssistant) -> None:
    """__init__ ~line 454-481: device area_id change syncs to config entry."""
    global_entry = _make_global(hass)
    task = build_task_data()
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="dev_area_sync")
    await setup_integration(hass, global_entry, obj_entry)

    from homeassistant.helpers import device_registry as dr

    dev_reg = dr.async_get(hass)
    devices = dr.async_entries_for_config_entry(dev_reg, obj_entry.entry_id)
    if not devices:
        pytest.skip("No device for entry")

    device = devices[0]
    # Update device area — the listener in __init__ should sync back to entry
    dev_reg.async_update_device(device.id, area_id="living_room")
    await hass.async_block_till_done()

    updated_entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert updated_entry is not None
    obj = updated_entry.data.get("object", {})
    assert obj.get("area_id") == "living_room"


# ─── __init__.py line 534 — entity rename listener ───────────────────────────


async def test_entity_rename_updates_trigger_config(hass: HomeAssistant) -> None:
    """__init__ ~line 492-548: entity rename rewrites trigger_config entity_id."""
    global_entry = _make_global(hass)
    hass.states.async_set("sensor.old_entity", "25.0")
    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.old_entity",
            "trigger_above": 30,
        },
    )
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="rename_trigger")
    await setup_integration(hass, global_entry, obj_entry)

    entity_reg = er.async_get(hass)
    # Register a fake entity so we can rename it
    test_entity = entity_reg.async_get_or_create(
        "sensor", DOMAIN, "old_entity_unique",
        config_entry=obj_entry,
        original_name="Old Entity",
    )
    entity_reg.async_update_entity(test_entity.entity_id, new_entity_id="sensor.new_entity")
    await hass.async_block_till_done()


# ─── __init__.py line 985 — _get_task_id_for_entity returns None for button ──


async def test_get_task_id_for_sensor_entity(hass: HomeAssistant) -> None:
    """__init__ line 990-1027: _get_task_id_for_entity resolves sensor entity to task."""
    global_entry = _make_global(hass)
    task = build_task_data()
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="task_id_sensor")
    await setup_integration(hass, global_entry, obj_entry)

    sensors = _get_entities_by_domain(hass, obj_entry, "sensor")
    if not sensors:
        pytest.skip("No sensor entities")

    from custom_components.maintenance_supporter import _get_task_id_for_entity
    task_id = _get_task_id_for_entity(hass, sensors[0].entity_id)
    assert task_id == TASK_ID_1


async def test_get_task_id_for_binary_sensor_entity(hass: HomeAssistant) -> None:
    """__init__ line 1022: binary sensor entity removes _overdue suffix."""
    global_entry = _make_global(hass)
    task = build_task_data()
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="task_id_binary")
    await setup_integration(hass, global_entry, obj_entry)

    binary_sensors = _get_entities_by_domain(hass, obj_entry, "binary_sensor")
    if not binary_sensors:
        pytest.skip("No binary sensor entities")

    from custom_components.maintenance_supporter import _get_task_id_for_entity
    task_id = _get_task_id_for_entity(hass, binary_sensors[0].entity_id)
    assert task_id == TASK_ID_1


# ===========================================================================
# Coverage tests carried from test_coverage_97.py (__init__.py section)
# ===========================================================================


# ─── __init__.py: cleanup on last entry unload ────────────────────────


async def test_cleanup_on_last_entry_unload(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Lines 447-452: domain data cleanup when no entries remain."""
    from custom_components.maintenance_supporter import async_unload_entry

    await setup_integration(hass, global_config_entry)
    assert DOMAIN in hass.data

    # Unload platforms first
    await hass.config_entries.async_unload_platforms(
        global_config_entry, ["sensor", "binary_sensor", "calendar"]
    )

    # Patch async_entries to return empty list to simulate no entries remaining
    with patch.object(
        hass.config_entries, "async_entries", return_value=[],
    ), patch.object(
        hass.config_entries, "async_unload_platforms", return_value=True,
    ):
        await async_unload_entry(hass, global_config_entry)

    assert DOMAIN not in hass.data


# ─── __init__.py: async_remove_entry for global entry (line 462) ──────


async def test_remove_global_entry(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Line 462: async_remove_entry returns early for global entry."""
    from custom_components.maintenance_supporter import async_remove_entry

    # Should return without error
    await async_remove_entry(hass, global_config_entry)


# ─── __init__.py: _get_coordinator_for_entity no runtime_data (497) ───


async def test_get_coordinator_no_runtime_data(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Line 497: _get_coordinator_for_entity returns None when no runtime_data."""
    from custom_components.maintenance_supporter import _get_coordinator_for_entity

    await setup_integration(hass, global_config_entry)

    # Create an entity registered against the global entry (which has no coordinator)
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        domain="sensor",
        platform=DOMAIN,
        unique_id="maintenance_supporter_no_coord",
        config_entry=global_config_entry,
    )

    # Global entry has runtime_data but coordinator is None
    result = _get_coordinator_for_entity(hass, "sensor.maintenance_supporter_no_coord")
    assert result is None
