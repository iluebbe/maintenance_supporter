"""Tests for the Store migration (ConfigEntry.data → Store).

Covers: one-time migration, idempotency, crash recovery, multi-entry,
and legacy trigger runtime keys.
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    MaintenanceTypeEnum,
    ScheduleType,
)
from custom_components.maintenance_supporter.storage import (
    MaintenanceStore,
    async_migrate_to_store,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

# ─── async_migrate_to_store unit tests ───────────────────────────────


async def test_migration_extracts_dynamic_fields(
    hass: HomeAssistant,
) -> None:
    """Migration moves last_performed, history, adaptive_config to Store."""
    store = MaintenanceStore(hass, "mig_1")

    entry_data = build_object_entry_data(
        tasks={
            TASK_ID_1: build_task_data(
                last_performed="2026-01-15",
                history=[{"type": "completed", "date": "2026-01-15"}],
            ),
        }
    )
    # Inject adaptive_config into task
    entry_data[CONF_TASKS][TASK_ID_1]["adaptive_config"] = {"enabled": True}

    cleaned = await async_migrate_to_store(hass, "mig_1", entry_data, store)

    # Cleaned entry should NOT have dynamic fields
    task_static = cleaned[CONF_TASKS][TASK_ID_1]
    assert "last_performed" not in task_static
    assert "history" not in task_static
    assert "adaptive_config" not in task_static

    # Store should have them
    assert store.get_last_performed(TASK_ID_1) == "2026-01-15"
    assert len(store.get_history(TASK_ID_1)) == 1
    assert store.get_adaptive_config(TASK_ID_1) == {"enabled": True}


async def test_migration_preserves_static_fields(
    hass: HomeAssistant,
) -> None:
    """Migration keeps static config fields in entry data."""
    store = MaintenanceStore(hass, "mig_2")

    entry_data = build_object_entry_data(
        tasks={
            TASK_ID_1: build_task_data(
                name="Oil Change",
                task_type=MaintenanceTypeEnum.SERVICE,
                interval_days=90,
                warning_days=14,
                last_performed="2026-01-01",
            ),
        }
    )

    cleaned = await async_migrate_to_store(hass, "mig_2", entry_data, store)
    task = cleaned[CONF_TASKS][TASK_ID_1]

    assert task["name"] == "Oil Change"
    assert task["type"] == MaintenanceTypeEnum.SERVICE
    assert task["interval_days"] == 90
    assert task["warning_days"] == 14
    assert task["id"] == TASK_ID_1


async def test_migration_idempotent(hass: HomeAssistant) -> None:
    """If Store already has data, migration returns original entry_data unchanged."""
    store = MaintenanceStore(hass, "mig_3")
    # Pre-populate store
    store.init_task(TASK_ID_1, last_performed="2026-01-01")
    await store.async_save()

    entry_data = build_object_entry_data(
        tasks={
            TASK_ID_1: build_task_data(last_performed="2026-02-01"),
        }
    )

    result = await async_migrate_to_store(hass, "mig_3", entry_data, store)

    # Should return original data unchanged (identity check)
    assert result is entry_data
    # Store should still have old data (not overwritten)
    assert store.get_last_performed(TASK_ID_1) == "2026-01-01"


async def test_migration_crash_recovery(hass: HomeAssistant) -> None:
    """If HA crashed before migration completed, re-running is safe.

    Simulates: Store file doesn't exist (deleted or never created),
    but ConfigEntry still has dynamic data.  Migration should re-extract.
    """
    store = MaintenanceStore(hass, "mig_4")

    entry_data = build_object_entry_data(
        tasks={
            TASK_ID_1: build_task_data(
                last_performed="2026-01-15",
                history=[{"type": "completed", "date": "2026-01-15"}],
            ),
        }
    )

    # First migration
    cleaned = await async_migrate_to_store(hass, "mig_4", entry_data, store)
    assert "last_performed" not in cleaned[CONF_TASKS][TASK_ID_1]

    # Simulate crash: delete store, re-create
    await store.async_remove()
    store2 = MaintenanceStore(hass, "mig_4")

    # Re-run with ORIGINAL data (ConfigEntry wasn't updated before crash)
    cleaned2 = await async_migrate_to_store(hass, "mig_4", entry_data, store2)
    assert store2.get_last_performed(TASK_ID_1) == "2026-01-15"
    assert len(store2.get_history(TASK_ID_1)) == 1


async def test_migration_multiple_tasks(hass: HomeAssistant) -> None:
    """Migration handles multiple tasks in a single entry."""
    store = MaintenanceStore(hass, "mig_5")

    entry_data = build_object_entry_data(
        tasks={
            TASK_ID_1: build_task_data(
                task_id=TASK_ID_1,
                name="Task A",
                last_performed="2026-01-01",
                history=[{"date": "2026-01-01"}],
            ),
            TASK_ID_2: build_task_data(
                task_id=TASK_ID_2,
                name="Task B",
                last_performed="2026-02-01",
                history=[{"date": "2026-02-01"}, {"date": "2026-01-01"}],
            ),
        }
    )

    cleaned = await async_migrate_to_store(hass, "mig_5", entry_data, store)

    # Both tasks should be clean
    assert "last_performed" not in cleaned[CONF_TASKS][TASK_ID_1]
    assert "last_performed" not in cleaned[CONF_TASKS][TASK_ID_2]

    # Both should be in Store
    assert store.get_last_performed(TASK_ID_1) == "2026-01-01"
    assert store.get_last_performed(TASK_ID_2) == "2026-02-01"
    assert len(store.get_history(TASK_ID_1)) == 1
    assert len(store.get_history(TASK_ID_2)) == 2


async def test_migration_no_tasks(hass: HomeAssistant) -> None:
    """Migration handles an entry with no tasks gracefully."""
    store = MaintenanceStore(hass, "mig_6")
    entry_data = build_object_entry_data(tasks={})

    cleaned = await async_migrate_to_store(hass, "mig_6", entry_data, store)
    assert cleaned[CONF_TASKS] == {}


async def test_migration_trigger_state_extracted(
    hass: HomeAssistant,
) -> None:
    """Migration extracts _trigger_state from trigger_config into Store."""
    store = MaintenanceStore(hass, "mig_7")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "trigger_above": 30,
            "_trigger_state": {
                "sensor.temp": {"baseline_value": 25.0, "accumulated_seconds": 0}
            },
        },
    )

    entry_data = build_object_entry_data(tasks={TASK_ID_1: task})
    cleaned = await async_migrate_to_store(hass, "mig_7", entry_data, store)

    # _trigger_state should be gone from static config
    tc = cleaned[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert "_trigger_state" not in tc
    assert tc["type"] == "threshold"
    assert tc["trigger_above"] == 30

    # Store should have it as trigger_runtime
    runtime = store.get_trigger_runtime(TASK_ID_1, "sensor.temp")
    assert runtime["baseline_value"] == 25.0


async def test_migration_legacy_flat_trigger_keys(
    hass: HomeAssistant,
) -> None:
    """Migration extracts legacy flat trigger_* keys from trigger_config."""
    store = MaintenanceStore(hass, "mig_8")

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.meter",
            "trigger_baseline_value": 1000.0,
            "trigger_change_count": 5,
        },
    )

    entry_data = build_object_entry_data(tasks={TASK_ID_1: task})
    cleaned = await async_migrate_to_store(hass, "mig_8", entry_data, store)

    # Legacy keys gone from static
    tc = cleaned[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert "trigger_baseline_value" not in tc
    assert "trigger_change_count" not in tc

    # They should be in the store's dynamic state
    state = store.get_task_state(TASK_ID_1)
    assert "trigger_runtime_legacy" in state
    assert state["trigger_runtime_legacy"]["trigger_baseline_value"] == 1000.0
    assert state["trigger_runtime_legacy"]["trigger_change_count"] == 5


# ─── Integration-level migration tests ──────────────────────────────


async def test_setup_entry_triggers_migration(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """async_setup_entry migrates old-format entry to Store on first load."""
    last_perf = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last_perf,
        history=[{"type": "completed", "date": last_perf}],
    )
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Washer",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_washer",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    # After setup, dynamic fields should be in Store, not in entry.data
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    task_data = refreshed.data[CONF_TASKS][TASK_ID_1]
    assert "last_performed" not in task_data
    assert "history" not in task_data

    # Store should have them
    rd = refreshed.runtime_data
    assert rd.store is not None
    assert rd.store.get_last_performed(TASK_ID_1) == last_perf
    assert len(rd.store.get_history(TASK_ID_1)) == 1


async def test_setup_entry_idempotent_on_reload(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """Reloading an already-migrated entry doesn't re-migrate."""
    last_perf = (dt_util.now().date() - timedelta(days=5)).isoformat()
    task = build_task_data(last_performed=last_perf)
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Dryer",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_dryer",
    )
    entry.add_to_hass(hass)

    # First load: migration happens
    await setup_integration(hass, global_config_entry, entry)
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    assert "last_performed" not in refreshed.data[CONF_TASKS][TASK_ID_1]

    # Unload and reload: migration should be idempotent
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    refreshed2 = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed2 is not None
    rd = refreshed2.runtime_data
    assert rd.store.get_last_performed(TASK_ID_1) == last_perf


async def test_remove_entry_cleans_up_store(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """Deleting a config entry also removes its Store file."""
    task = build_task_data(last_performed="2026-01-01")
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Dishwasher",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_dishwasher",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_config_entry, entry)

    entry_id = entry.entry_id

    # Remove the entry
    await hass.config_entries.async_remove(entry_id)
    await hass.async_block_till_done()

    # A fresh store should find nothing
    store_check = MaintenanceStore(hass, entry_id)
    assert await store_check.async_load() is None


async def test_migration_multi_entry(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """Multiple object entries each get their own Store file."""
    lp1 = (dt_util.now().date() - timedelta(days=10)).isoformat()
    lp2 = (dt_util.now().date() - timedelta(days=20)).isoformat()

    entry1 = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Entry A",
        data=build_object_entry_data(
            object_data=build_object_data(name="Entry A", object_id="aaaa" * 8),
            tasks={TASK_ID_1: build_task_data(last_performed=lp1)},
        ),
        source="user",
        unique_id="maintenance_supporter_entry_a",
    )
    entry2 = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Entry B",
        data=build_object_entry_data(
            object_data=build_object_data(name="Entry B", object_id="bbbb" * 8),
            tasks={TASK_ID_1: build_task_data(last_performed=lp2)},
        ),
        source="user",
        unique_id="maintenance_supporter_entry_b",
    )
    entry1.add_to_hass(hass)
    entry2.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry1, entry2)

    entry1_refreshed = hass.config_entries.async_get_entry(entry1.entry_id)
    assert entry1_refreshed is not None
    rd1 = entry1_refreshed.runtime_data
    entry2_refreshed = hass.config_entries.async_get_entry(entry2.entry_id)
    assert entry2_refreshed is not None
    rd2 = entry2_refreshed.runtime_data

    assert rd1.store.get_last_performed(TASK_ID_1) == lp1
    assert rd2.store.get_last_performed(TASK_ID_1) == lp2
