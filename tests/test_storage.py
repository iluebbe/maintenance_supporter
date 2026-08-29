"""Tests for the MaintenanceStore persistent storage module."""

from __future__ import annotations

from unittest.mock import patch

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.storage import (
    _DYNAMIC_TASK_FIELDS,
    STORE_SAVE_DELAY,
    MaintenanceStore,
    extract_dynamic_from_task,
)

from .conftest import TASK_ID_1

# ─── MaintenanceStore unit tests ─────────────────────────────────────


async def test_load_returns_none_when_no_file(hass: HomeAssistant) -> None:
    """Store.async_load returns None when no file exists."""
    store = MaintenanceStore(hass, "test_entry_1")
    result = await store.async_load()
    assert result is None
    # Internal data should be the empty default
    assert store._data == {"version": 1, "tasks": {}}


def test_sanitize_loaded_drops_malformed_elements_but_keeps_the_rest() -> None:
    """P-F9: the container checks are not enough — a single non-dict history
    entry / per-entity runtime value / non-string date marker crashed later at
    read time. Bad ELEMENTS are dropped; the task's other state survives."""
    raw = {
        "version": 1,
        "tasks": {
            "t1": {
                "last_performed": "2026-01-15",
                "last_planned_due": 20260115,  # not a string → dropped
                "due_override": None,  # None is a legitimate "no override"
                "history": [{"type": "completed"}, "junk", None, 3, {"type": "skipped"}],
                "trigger_runtime": {
                    "sensor.a": {"baseline_value": 1},
                    "sensor.b": "junk",
                    "_compound_0_sensor.c": None,
                },
                "checklist_progress": ["step1"],  # must be a dict → dropped
                "adaptive_config": {"enabled": True},
            },
            "t2": {"last_performed": 42, "history": []},
        },
    }
    clean = MaintenanceStore._sanitize_loaded(raw)
    t1 = clean["tasks"]["t1"]
    assert t1["history"] == [{"type": "completed"}, {"type": "skipped"}]
    assert t1["trigger_runtime"] == {"sensor.a": {"baseline_value": 1}}
    assert "checklist_progress" not in t1
    assert "last_planned_due" not in t1
    assert t1["due_override"] is None
    assert t1["last_performed"] == "2026-01-15"
    assert t1["adaptive_config"] == {"enabled": True}
    assert "last_performed" not in clean["tasks"]["t2"]
    assert clean["tasks"]["t2"]["history"] == []
    # The input is never mutated (the caller may still hold it).
    assert raw["tasks"]["t1"]["history"][1] == "junk"


async def test_save_and_load_roundtrip(hass: HomeAssistant) -> None:
    """Data survives a save → load roundtrip."""
    store = MaintenanceStore(hass, "test_entry_2")
    store.init_task("task_1", last_performed="2026-01-15")
    store.append_history("task_1", {"type": "completed", "date": "2026-01-15"})
    await store.async_save()

    # Create a new store instance pointing at the same key
    store2 = MaintenanceStore(hass, "test_entry_2")
    loaded = await store2.async_load()
    assert loaded is not None
    assert store2.get_last_performed("task_1") == "2026-01-15"
    assert len(store2.get_history("task_1")) == 1
    assert store2.get_history("task_1")[0]["type"] == "completed"


async def test_async_remove_deletes_file(hass: HomeAssistant) -> None:
    """async_remove deletes the store file so next load returns None."""
    store = MaintenanceStore(hass, "test_entry_3")
    store.init_task("task_1")
    await store.async_save()

    await store.async_remove()

    store2 = MaintenanceStore(hass, "test_entry_3")
    assert await store2.async_load() is None


async def test_delay_save_calls_store(hass: HomeAssistant) -> None:
    """async_delay_save delegates to the underlying HA Store."""
    store = MaintenanceStore(hass, "test_entry_4")
    with patch.object(store._store, "async_delay_save") as mock_delay:
        store.async_delay_save()
        mock_delay.assert_called_once()
        # First arg is the callback, second is the delay
        args = mock_delay.call_args
        assert args[0][1] == STORE_SAVE_DELAY


# ─── Task state CRUD ─────────────────────────────────────────────────


async def test_init_task_creates_empty_state(hass: HomeAssistant) -> None:
    """init_task creates a task entry with empty history."""
    store = MaintenanceStore(hass, "crud_1")
    store.init_task("t1")
    state = store.get_task_state("t1")
    assert "history" in state
    assert state["history"] == []
    assert "last_performed" not in state


async def test_init_task_with_last_performed(hass: HomeAssistant) -> None:
    """init_task sets last_performed when provided."""
    store = MaintenanceStore(hass, "crud_2")
    store.init_task("t1", last_performed="2026-03-01")
    assert store.get_last_performed("t1") == "2026-03-01"


async def test_get_task_state_unknown_task(hass: HomeAssistant) -> None:
    """get_task_state returns empty dict for unknown task."""
    store = MaintenanceStore(hass, "crud_3")
    assert store.get_task_state("nonexistent") == {}


async def test_remove_task(hass: HomeAssistant) -> None:
    """remove_task deletes all state for a task."""
    store = MaintenanceStore(hass, "crud_4")
    store.init_task("t1", last_performed="2026-01-01")
    store.append_history("t1", {"type": "completed"})
    store.remove_task("t1")
    assert store.get_task_state("t1") == {}


async def test_remove_task_nonexistent_no_error(hass: HomeAssistant) -> None:
    """remove_task on a nonexistent task doesn't raise."""
    store = MaintenanceStore(hass, "crud_5")
    store.remove_task("ghost")  # Should not raise


# ─── last_performed ──────────────────────────────────────────────────


async def test_set_get_last_performed(hass: HomeAssistant) -> None:
    """set_last_performed / get_last_performed roundtrip."""
    store = MaintenanceStore(hass, "lp_1")
    store.set_last_performed("t1", "2026-02-20")
    assert store.get_last_performed("t1") == "2026-02-20"


async def test_get_last_performed_none(hass: HomeAssistant) -> None:
    """get_last_performed returns None for unknown task."""
    store = MaintenanceStore(hass, "lp_2")
    assert store.get_last_performed("t1") is None


# ─── history ─────────────────────────────────────────────────────────


async def test_append_history(hass: HomeAssistant) -> None:
    """append_history adds entries."""
    store = MaintenanceStore(hass, "hist_1")
    store.init_task("t1")
    store.append_history("t1", {"type": "completed", "date": "2026-01-01"})
    store.append_history("t1", {"type": "skipped", "date": "2026-02-01"})
    history = store.get_history("t1")
    assert len(history) == 2
    assert history[0]["type"] == "completed"
    assert history[1]["type"] == "skipped"


async def test_append_history_trims_to_max(hass: HomeAssistant) -> None:
    """append_history trims old entries beyond DEFAULT_MAX_HISTORY_ENTRIES."""
    from custom_components.maintenance_supporter.const import DEFAULT_MAX_HISTORY_ENTRIES

    store = MaintenanceStore(hass, "hist_2")
    store.init_task("t1")
    # Fill to max
    for i in range(DEFAULT_MAX_HISTORY_ENTRIES):
        store.append_history("t1", {"idx": i})
    assert len(store.get_history("t1")) == DEFAULT_MAX_HISTORY_ENTRIES

    # One more should trim the oldest
    store.append_history("t1", {"idx": "overflow"})
    history = store.get_history("t1")
    assert len(history) == DEFAULT_MAX_HISTORY_ENTRIES
    assert history[0]["idx"] == 1  # First entry (idx=0) was trimmed
    assert history[-1]["idx"] == "overflow"


async def test_set_history_replaces(hass: HomeAssistant) -> None:
    """set_history replaces the entire list."""
    store = MaintenanceStore(hass, "hist_3")
    store.init_task("t1")
    store.append_history("t1", {"old": True})
    store.set_history("t1", [{"new": True}])
    assert store.get_history("t1") == [{"new": True}]


async def test_get_history_empty_for_unknown(hass: HomeAssistant) -> None:
    """get_history returns empty list for unknown task."""
    store = MaintenanceStore(hass, "hist_4")
    assert store.get_history("nonexistent") == []


# ─── adaptive_config ─────────────────────────────────────────────────


async def test_adaptive_config_crud(hass: HomeAssistant) -> None:
    """set/get adaptive_config."""
    store = MaintenanceStore(hass, "adapt_1")
    assert store.get_adaptive_config("t1") is None
    config = {"enabled": True, "ewa_alpha": 0.3}
    store.set_adaptive_config("t1", config)
    assert store.get_adaptive_config("t1") == config


# ─── trigger_runtime ─────────────────────────────────────────────────


async def test_trigger_runtime_per_entity(hass: HomeAssistant) -> None:
    """set/get trigger_runtime per entity."""
    store = MaintenanceStore(hass, "trig_1")
    store.set_trigger_runtime("t1", "sensor.temp", {"baseline_value": 25.0})
    store.set_trigger_runtime("t1", "sensor.humidity", {"baseline_value": 50.0})

    assert store.get_trigger_runtime("t1", "sensor.temp") == {"baseline_value": 25.0}
    assert store.get_trigger_runtime("t1", "sensor.humidity") == {"baseline_value": 50.0}
    assert store.get_trigger_runtime("t1", "sensor.missing") == {}


async def test_trigger_runtime_whole_dict(hass: HomeAssistant) -> None:
    """get_trigger_runtime without entity_id returns the full dict."""
    store = MaintenanceStore(hass, "trig_2")
    store.set_trigger_runtime("t1", "sensor.a", {"val": 1})
    store.set_trigger_runtime("t1", "sensor.b", {"val": 2})
    runtime = store.get_trigger_runtime("t1")
    assert "sensor.a" in runtime
    assert "sensor.b" in runtime


async def test_trigger_runtime_update_replaces(hass: HomeAssistant) -> None:
    """set_trigger_runtime REPLACES the entity's dict wholesale.

    Every trigger type writes its complete key set per persist; the old merge
    semantics kept keys from a previous life alive forever (e.g. a #136
    pending window that was already consumed — bug audit 2026-08-22)."""
    store = MaintenanceStore(hass, "trig_3")
    store.set_trigger_runtime("t1", "sensor.x", {"baseline_value": 10.0, "pending_since": "2026-08-01T00:00:00+00:00"})
    store.set_trigger_runtime("t1", "sensor.x", {"accumulated_seconds": 3600.0})
    assert store.get_trigger_runtime("t1", "sensor.x") == {"accumulated_seconds": 3600.0}


async def test_clear_trigger_runtime(hass: HomeAssistant) -> None:
    """clear_trigger_runtime removes all runtime for a task."""
    store = MaintenanceStore(hass, "trig_4")
    store.set_trigger_runtime("t1", "sensor.x", {"val": 1})
    store.clear_trigger_runtime("t1")
    assert store.get_trigger_runtime("t1") == {}


# ─── merge helpers ───────────────────────────────────────────────────


async def test_merge_task_data(hass: HomeAssistant) -> None:
    """merge_task_data overlays Store dynamic data onto static config."""
    store = MaintenanceStore(hass, "merge_1")
    store.init_task("t1", last_performed="2026-01-15")
    store.append_history("t1", {"type": "completed"})
    store.set_adaptive_config("t1", {"enabled": True})

    static = {
        "id": "t1",
        "name": "Test Task",
        "type": "cleaning",
        "interval_days": 30,
    }

    merged = store.merge_task_data("t1", static)
    assert merged["name"] == "Test Task"
    assert merged["interval_days"] == 30
    assert merged["last_performed"] == "2026-01-15"
    assert len(merged["history"]) == 1
    assert merged["adaptive_config"]["enabled"] is True


async def test_merge_task_data_trigger_runtime_into_trigger_config(
    hass: HomeAssistant,
) -> None:
    """merge_task_data injects trigger_runtime into trigger_config._trigger_state."""
    store = MaintenanceStore(hass, "merge_2")
    store.set_trigger_runtime("t1", "sensor.x", {"baseline_value": 100.0})

    static = {
        "id": "t1",
        "name": "Trigger Task",
        "trigger_config": {"type": "threshold", "entity_id": "sensor.x"},
    }

    merged = store.merge_task_data("t1", static)
    tc = merged["trigger_config"]
    assert "_trigger_state" in tc
    assert tc["_trigger_state"]["sensor.x"]["baseline_value"] == 100.0


async def test_merge_all_tasks(hass: HomeAssistant) -> None:
    """merge_all_tasks merges multiple tasks."""
    store = MaintenanceStore(hass, "merge_3")
    store.init_task("t1", last_performed="2026-01-01")
    store.init_task("t2", last_performed="2026-02-01")

    static_tasks = {
        "t1": {"id": "t1", "name": "Task 1"},
        "t2": {"id": "t2", "name": "Task 2"},
    }

    merged = store.merge_all_tasks(static_tasks)
    assert merged["t1"]["last_performed"] == "2026-01-01"
    assert merged["t2"]["last_performed"] == "2026-02-01"


async def test_merge_task_data_no_store_state(hass: HomeAssistant) -> None:
    """merge_task_data returns static data unchanged when Store has no state."""
    store = MaintenanceStore(hass, "merge_4")
    static = {"id": "t1", "name": "Clean"}
    merged = store.merge_task_data("t1", static)
    assert merged == static


# ─── extract_dynamic_from_task ───────────────────────────────────────


def test_extract_dynamic_basic() -> None:
    """extract_dynamic_from_task splits top-level dynamic fields."""
    task = {
        "id": "t1",
        "name": "Test",
        "type": "cleaning",
        "interval_days": 30,
        "last_performed": "2026-01-15",
        "history": [{"type": "completed"}],
        "adaptive_config": {"enabled": True},
    }
    static, dynamic = extract_dynamic_from_task(task)

    # Static should not have dynamic fields
    assert "last_performed" not in static
    assert "history" not in static
    assert "adaptive_config" not in static
    # Static keeps config fields
    assert static["name"] == "Test"
    assert static["interval_days"] == 30

    # Dynamic has extracted fields
    assert dynamic["last_performed"] == "2026-01-15"
    assert dynamic["history"] == [{"type": "completed"}]
    assert dynamic["adaptive_config"]["enabled"] is True


def test_extract_dynamic_no_dynamic_fields() -> None:
    """extract_dynamic_from_task with no dynamic fields returns empty dynamic dict."""
    task = {"id": "t1", "name": "Static Only"}
    static, dynamic = extract_dynamic_from_task(task)
    assert static == {"id": "t1", "name": "Static Only"}
    assert dynamic == {}


def test_extract_dynamic_does_not_mutate_input() -> None:
    """extract_dynamic_from_task does not modify the original dict."""
    task = {
        "id": "t1",
        "last_performed": "2026-01-01",
        "history": [],
    }
    original_keys = set(task.keys())
    extract_dynamic_from_task(task)
    assert set(task.keys()) == original_keys


def test_extract_dynamic_trigger_state() -> None:
    """extract_dynamic_from_task extracts _trigger_state from trigger_config."""
    task = {
        "id": "t1",
        "trigger_config": {
            "type": "threshold",
            "entity_id": "sensor.temp",
            "trigger_above": 30,
            "_trigger_state": {"sensor.temp": {"baseline_value": 25.0}},
        },
    }
    static, dynamic = extract_dynamic_from_task(task)

    # Static trigger_config should not have _trigger_state
    assert "_trigger_state" not in static["trigger_config"]
    assert static["trigger_config"]["type"] == "threshold"
    assert static["trigger_config"]["trigger_above"] == 30

    # Dynamic has trigger_runtime
    assert dynamic["trigger_runtime"]["sensor.temp"]["baseline_value"] == 25.0


async def test_merge_task_data_compound_flat_keys_to_nested(
    hass: HomeAssistant,
) -> None:
    """merge_task_data restructures flat compound keys into nested conditions list.

    The CompoundCoordinatorProxy stores trigger runtime as flat keys like
    '_compound_0_sensor.temp' but CompoundTrigger.async_setup() expects a
    nested 'conditions' list in _trigger_state.
    """
    store = MaintenanceStore(hass, "merge_compound")
    # Simulate what _CompoundCoordinatorProxy writes
    store.set_trigger_runtime("t1", "_compound_0_sensor.temp", {"baseline_value": 42.0})
    store.set_trigger_runtime("t1", "_compound_1_sensor.humidity", {"accumulated_seconds": 3600})

    static = {
        "id": "t1",
        "name": "Compound Task",
        "trigger_config": {"type": "compound", "compound_logic": "AND"},
    }

    merged = store.merge_task_data("t1", static)
    tc = merged["trigger_config"]
    assert "_trigger_state" in tc

    ts = tc["_trigger_state"]
    # Should have a conditions list, not flat keys
    assert "conditions" in ts
    assert len(ts["conditions"]) == 2
    assert ts["conditions"][0]["sensor.temp"]["baseline_value"] == 42.0
    assert ts["conditions"][1]["sensor.humidity"]["accumulated_seconds"] == 3600

    # Flat compound keys should NOT remain at the top level
    assert "_compound_0_sensor.temp" not in ts
    assert "_compound_1_sensor.humidity" not in ts


def test_extract_dynamic_legacy_trigger_keys() -> None:
    """extract_dynamic_from_task moves legacy flat trigger keys."""
    task = {
        "id": "t1",
        "trigger_config": {
            "type": "counter",
            "entity_id": "sensor.meter",
            "trigger_baseline_value": 1234.5,
            "trigger_accumulated_seconds": 3600.0,
        },
    }
    static, dynamic = extract_dynamic_from_task(task)

    # Legacy keys should be gone from static
    assert "trigger_baseline_value" not in static["trigger_config"]
    assert "trigger_accumulated_seconds" not in static["trigger_config"]

    # They should be in trigger_runtime_legacy
    assert "trigger_runtime_legacy" in dynamic
    assert dynamic["trigger_runtime_legacy"]["trigger_baseline_value"] == 1234.5
    assert dynamic["trigger_runtime_legacy"]["trigger_accumulated_seconds"] == 3600.0


# ─── last_planned_due in dynamic fields ────────────────────────────────


def test_dynamic_fields_includes_last_planned_due() -> None:
    """last_planned_due should be in _DYNAMIC_TASK_FIELDS."""
    assert "last_planned_due" in _DYNAMIC_TASK_FIELDS


def test_extract_dynamic_moves_last_planned_due() -> None:
    """extract_dynamic_from_task moves last_planned_due to dynamic dict."""
    task = {
        "id": "abc",
        "name": "Test",
        "interval_anchor": "planned",
        "last_planned_due": "2026-03-01",
        "last_performed": "2026-03-05",
    }
    static, dynamic = extract_dynamic_from_task(task)
    assert "last_planned_due" not in static
    assert dynamic["last_planned_due"] == "2026-03-01"
    assert dynamic["last_performed"] == "2026-03-05"


async def test_merge_task_data_includes_last_planned_due(hass: HomeAssistant) -> None:
    """merge_task_data should overlay last_planned_due from Store."""
    store = MaintenanceStore(hass, "test_lpd")
    state = store._ensure_task("task_1")
    state["last_planned_due"] = "2026-03-01"

    static = {"id": "task_1", "name": "Test", "interval_anchor": "planned"}
    merged = store.merge_task_data("task_1", static)
    assert merged["last_planned_due"] == "2026-03-01"


async def test_merge_compound_keys_without_entity_id(hass: HomeAssistant) -> None:
    """merge_task_data handles _compound_N keys without entity_id suffix."""
    store = MaintenanceStore(hass, "test_compound_no_eid")
    # Key without entity_id suffix (condition-level data)
    store.set_trigger_runtime("t1", "_compound_0", {"some_key": "some_value"})
    # Key with entity_id suffix (per-entity data)
    store.set_trigger_runtime("t1", "_compound_1_sensor.temp", {"baseline_value": 42.0})

    static = {
        "id": "t1",
        "name": "Compound Task",
        "trigger_config": {"type": "compound", "compound_logic": "AND"},
    }

    merged = store.merge_task_data("t1", static)
    tc = merged["trigger_config"]
    ts = tc["_trigger_state"]
    assert "conditions" in ts
    assert len(ts["conditions"]) == 2
    # Condition 0: data merged directly (no entity_id suffix)
    assert ts["conditions"][0]["some_key"] == "some_value"
    # Condition 1: data keyed by entity_id
    assert ts["conditions"][1]["sensor.temp"]["baseline_value"] == 42.0


# ─── extract_dynamic_from_task: trigger_config _trigger_state splits ──────


def test_extract_dynamic_no_trigger_state() -> None:
    """extract_dynamic_from_task with trigger_config but no _trigger_state."""
    from custom_components.maintenance_supporter.storage import extract_dynamic_from_task

    task = {
        "id": TASK_ID_1,
        "name": "Test",
        "last_performed": "2024-01-01",
        "trigger_config": {
            "type": "threshold",
            "trigger_above": 80.0,
            # no _trigger_state
        },
    }
    static, dynamic = extract_dynamic_from_task(task)
    # last_performed should be dynamic
    assert "last_performed" in dynamic
    # trigger_config should remain in static (no runtime to extract)
    assert "trigger_config" in static
    assert "_trigger_state" not in static["trigger_config"]


def test_extract_dynamic_with_trigger_state() -> None:
    """extract_dynamic_from_task with trigger_config containing _trigger_state."""
    from custom_components.maintenance_supporter.storage import extract_dynamic_from_task

    task = {
        "id": TASK_ID_1,
        "name": "Test",
        "trigger_config": {
            "type": "threshold",
            "trigger_above": 80.0,
            "_trigger_state": {"baseline_value": 10.0},
        },
    }
    static, dynamic = extract_dynamic_from_task(task)
    # _trigger_state should be moved to dynamic
    assert "trigger_runtime" in dynamic
    assert dynamic["trigger_runtime"] == {"baseline_value": 10.0}
    assert "_trigger_state" not in static.get("trigger_config", {})


# ─── storage.py lines 229, 232-233 — merge_task_data with trigger_runtime ────


async def test_storage_merge_with_trigger_runtime(hass: HomeAssistant) -> None:
    """storage.py line 211-247: merge_task_data with trigger_runtime populates _trigger_state."""
    from custom_components.maintenance_supporter.storage import MaintenanceStore

    store = MaintenanceStore(hass, "test_entry_runtime")
    task_id = "t1" * 16

    static_data = {
        "id": task_id,
        "name": "Test",
        "trigger_config": {"type": "counter", "entity_id": "sensor.x", "trigger_target_value": 100},
    }
    # Set trigger_runtime in store
    store.set_trigger_runtime(task_id, "sensor.x", {"baseline_value": 50})

    merged = store.merge_task_data(task_id, static_data)
    assert merged["trigger_config"]["_trigger_state"]["sensor.x"]["baseline_value"] == 50


async def test_storage_merge_with_legacy_trigger_runtime(hass: HomeAssistant) -> None:
    """storage.py line 209-210: falls back to trigger_runtime_legacy when trigger_runtime missing."""
    from custom_components.maintenance_supporter.storage import MaintenanceStore

    store = MaintenanceStore(hass, "test_entry_legacy")
    task_id = "t2" * 16

    # Manually inject legacy runtime
    state = store._ensure_task(task_id)
    state["trigger_runtime_legacy"] = {"sensor.y": {"accumulated_seconds": 100}}

    static_data = {
        "id": task_id,
        "name": "Test",
        "trigger_config": {"type": "runtime", "entity_id": "sensor.y"},
    }
    merged = store.merge_task_data(task_id, static_data)
    assert "_trigger_state" in merged.get("trigger_config", {})
