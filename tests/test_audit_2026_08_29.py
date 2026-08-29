"""Regression tests for the 2026-08-29 bug audit (backend share).

Each test names the finding it pins; the fixes live in coordinator.py,
websocket/dashboard.py, entity/summary_coordinator.py, __init__.py,
shopping_sync.py, helpers/sensor_predictor.py, sensor.py,
helpers/battery_fleet_setup.py and helpers/device_link.py.
"""

from __future__ import annotations

from datetime import timedelta
from types import SimpleNamespace

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.maintenance_supporter.const import (
    CONF_PARTS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


def _global(hass: HomeAssistant, **options) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), options=options, source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object(hass: HomeAssistant, task: dict, *, uid: str = "audit_obj", parts: dict | None = None) -> MockConfigEntry:
    data = build_object_entry_data(tasks={TASK_ID_1: task})
    if parts:
        data[CONF_PARTS] = parts
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Audit object",
        data=data, source="user", unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


def _overdue_task(**over) -> dict:
    last = (dt_util.now().date() - timedelta(days=40)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, name="Audit task", last_performed=last, interval_days=30)
    task.update(over)
    return task


def _completed(entry: MockConfigEntry) -> list[dict]:
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    return [h for h in merged["history"] if h["type"] == "completed"]


# ── choke-point gates ────────────────────────────────────────────────────


async def test_archived_task_refuses_manual_completion(hass: HomeAssistant) -> None:
    """S-F6: an NFC sticker on a retired machine must not record a completion."""
    g = _global(hass)
    entry = _object(hass, _overdue_task(archived_at="2026-08-01T10:00:00+00:00", archived_reason="manual"))
    await setup_integration(hass, g, entry)

    with pytest.raises(ServiceValidationError) as exc:
        await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, unattended=True, tag_verified=True)
    assert exc.value.translation_key == "task_inactive"
    assert not _completed(entry)


async def test_disabled_task_refuses_manual_completion(hass: HomeAssistant) -> None:
    g = _global(hass)
    entry = _object(hass, _overdue_task(enabled=False))
    await setup_integration(hass, g, entry)
    with pytest.raises(ServiceValidationError) as exc:
        await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, unattended=True)
    assert exc.value.translation_key == "task_inactive"


async def test_completion_window_is_enforced_at_the_choke_point(hass: HomeAssistant) -> None:
    """S-F1: the service / button / NFC surfaces reached the coordinator with
    no earliest_completion_days gate at all."""
    g = _global(hass)
    fresh = (dt_util.now().date() - timedelta(days=2)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, name="Window task", last_performed=fresh, interval_days=60)
    task["earliest_completion_days"] = 3
    entry = _object(hass, task)
    await setup_integration(hass, g, entry)
    coordinator = entry.runtime_data.coordinator

    with pytest.raises(ServiceValidationError) as exc:
        await coordinator.complete_maintenance(TASK_ID_1, unattended=True)
    assert exc.value.translation_key == "too_early"
    assert not _completed(entry)

    # A past-dated backfill is a history correction, not early work.
    await coordinator.complete_maintenance(
        TASK_ID_1, unattended=True, completed_at=dt_util.now() - timedelta(days=10)
    )
    assert len(_completed(entry)) == 1

    # Automatic completions are exempt.
    await coordinator.complete_maintenance(TASK_ID_1, auto=True)


async def test_failed_persist_releases_the_double_tap_guard(hass: HomeAssistant, monkeypatch) -> None:
    """S-F2: a completion that never landed must not swallow the retry."""
    g = _global(hass)
    entry = _object(hass, _overdue_task())
    await setup_integration(hass, g, entry)
    coordinator = entry.runtime_data.coordinator

    async def boom(*a, **kw):
        raise OSError("disk full")

    monkeypatch.setattr(coordinator, "_persist_and_signal_task_change", boom)
    with pytest.raises(OSError):
        await coordinator.complete_maintenance(TASK_ID_1, notes="first try")
    assert TASK_ID_1 not in coordinator._recent_manual_completions
    monkeypatch.undo()

    await coordinator.complete_maintenance(TASK_ID_1, notes="retry")
    # The retry went through (it was NOT swallowed as a double-tap); the
    # first attempt's in-memory mutation before the failed persist is a
    # separate, pre-existing matter (deferred in ROADMAP).
    assert _completed(entry)[-1].get("notes") == "retry"


async def test_backfill_does_not_consume_parts(hass: HomeAssistant) -> None:
    """S-F3: a completion dated before the last one performed no work in the
    current cycle - the automatic consumes_parts must not run for it."""
    g = _global(hass)
    task = _overdue_task(consumes_parts=[{"part_id": "p1", "quantity": 1}])
    entry = _object(hass, task, parts={"p1": {"id": "p1", "name": "Filter", "unit": "pcs"}})
    await setup_integration(hass, g, entry)
    store = entry.runtime_data.store
    store.set_part_stock("p1", 5)
    coordinator = entry.runtime_data.coordinator

    await coordinator.complete_maintenance(TASK_ID_1, unattended=True)
    assert store.get_part_stock("p1") == 4

    await coordinator.complete_maintenance(
        TASK_ID_1, unattended=True, completed_at=dt_util.now() - timedelta(days=20)
    )
    assert store.get_part_stock("p1") == 4  # unchanged
    backfill = [h for h in _completed(entry) if not h.get("used_parts")]
    assert backfill, "the backfill entry records no consumed parts"


async def test_completion_clears_notify_once_state(hass: HomeAssistant) -> None:
    """A1: a status set to notify ONCE stayed silenced forever after completion."""
    from custom_components.maintenance_supporter.helpers.notification_manager import _SENT_ONCE

    g = _global(hass)
    entry = _object(hass, _overdue_task())
    await setup_integration(hass, g, entry)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    key = f"{entry.entry_id}_{TASK_ID_1}_triggered"
    nm._last_notified[key] = _SENT_ONCE

    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, unattended=True)
    assert key not in nm._last_notified

    nm._last_notified[key] = _SENT_ONCE
    await entry.runtime_data.coordinator.skip_maintenance(TASK_ID_1)
    assert key not in nm._last_notified


async def test_backfill_guard_is_swept(hass: HomeAssistant) -> None:
    """S-F7: _recent_backfills grew for the life of the process."""
    g = _global(hass)
    entry = _object(hass, _overdue_task())
    await setup_integration(hass, g, entry)
    coordinator = entry.runtime_data.coordinator
    coordinator._recent_backfills[("x", "2026-01-01")] = 0.0  # ancient monotonic stamp
    await coordinator.async_refresh_now()
    assert ("x", "2026-01-01") not in coordinator._recent_backfills


# ── live subscriptions survive an entry reload ───────────────────────────


async def test_subscription_follows_a_reloaded_coordinator(hass: HomeAssistant) -> None:
    """FE-H1: every task edit reloads the entry; subscribers stayed bound to
    the dead coordinator and other clients froze for that object."""
    from custom_components.maintenance_supporter.websocket.dashboard import ws_subscribe

    g = _global(hass)
    entry = _object(hass, _overdue_task())
    await setup_integration(hass, g, entry)

    conn = make_ws_connection()
    await call_ws_handler(ws_subscribe, hass, conn, {"id": 7, "type": "maintenance_supporter/subscribe"})
    await hass.async_block_till_done()
    baseline = conn.send_message.call_count

    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)

    # A completion on the NEW coordinator must still reach the subscriber.
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, unattended=True)
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=3))
    await hass.async_block_till_done()
    assert conn.send_message.call_count > baseline


async def test_summary_coordinator_follows_a_reloaded_coordinator(hass: HomeAssistant) -> None:
    g = _global(hass)
    entry = _object(hass, _overdue_task())
    await setup_integration(hass, g, entry)
    summary = g.runtime_data.summary_coordinator
    old = entry.runtime_data.coordinator
    assert summary._attached[entry.entry_id][0] is old

    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    new = hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator
    assert new is not old
    assert summary._attached[entry.entry_id][0] is new


# ── shopping sync ────────────────────────────────────────────────────────


async def test_shopping_sync_survives_a_global_entry_reload(hass: HomeAssistant) -> None:
    """v67-F1 / P-F1: the sync was created once per boot and torn down on the
    hub's unload - a reload of the hub entry silently killed the feature."""
    from custom_components.maintenance_supporter.shopping_sync import SHOPPING_SYNC_KEY

    g = _global(hass)
    entry = _object(hass, _overdue_task())
    await setup_integration(hass, g, entry)
    first = hass.data[DOMAIN][SHOPPING_SYNC_KEY]

    await hass.config_entries.async_reload(g.entry_id)
    await hass.async_block_till_done()
    second = hass.data[DOMAIN].get(SHOPPING_SYNC_KEY)
    assert second is not None and second is not first


async def test_shopping_sync_relist_hiccup_does_not_duplicate(hass: HomeAssistant, monkeypatch) -> None:
    """v67-F2a: one failed re-list after add left uid=None and the next pass
    added the row again, forever."""
    from .test_shopping_sync import _setup

    todo, entry, sync = await _setup(hass)
    real_get = sync._get_items
    calls = {"n": 0}

    async def flaky(entity):
        calls["n"] += 1
        if calls["n"] == 2:  # the re-list right after add_item
            return None
        return await real_get(entity)

    monkeypatch.setattr(sync, "_get_items", flaky)
    await sync.async_resync()
    monkeypatch.undo()
    assert sum("Filter" in s for s in todo.summaries()) == 1

    await sync.async_resync()  # adopts the unclaimed row instead of adding another
    assert sum("Filter" in s for s in todo.summaries()) == 1
    (rec,) = sync._data["items"].values()
    assert rec["uid"] is not None


async def test_shopping_sync_claims_rows_positionally_when_provider_rewrites_summaries(hass: HomeAssistant) -> None:
    """v67-F2b: a provider that normalises the text (case, trimming) never
    matched by summary -> one new row per pass, indefinitely."""
    from homeassistant.components.todo import TodoItem, TodoItemStatus

    from .test_shopping_sync import WritableTodoList, _setup

    async def shouting_create(self, item):
        self._n += 1
        self._attr_todo_items.append(
            TodoItem(summary=(item.summary or "").upper(), uid=f"uid-{self._n}", status=TodoItemStatus.NEEDS_ACTION)
        )
        self.async_write_ha_state()

    WritableTodoList.async_create_todo_item = shouting_create  # type: ignore[method-assign]
    try:
        todo, entry, sync = await _setup(hass)
        for _ in range(3):
            await sync.async_resync()
        assert len(todo.summaries()) == 1
        (rec,) = sync._data["items"].values()
        assert rec["uid"] == "uid-1"
    finally:
        del WritableTodoList.async_create_todo_item


# ── sensor predictor: robust cycle boundaries ────────────────────────────


def _series(spec: list[tuple[int, float, float]], noise=None):
    from .test_sensor_predictor import _hourly

    pts = _hourly(spec)
    if noise is None:
        return pts
    out = []
    for i, (ts, v) in enumerate(pts):
        out.append((ts, v + noise(i)))
    return out


def test_noise_against_the_drift_does_not_split_cycles() -> None:
    """C1: hourly wobble >= 20 % of a service-free window's range fragmented
    it into dozens of pseudo-cycles."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

    # 180 days rising 1.0 -> 1.5 with +-0.08 pseudo-noise (deterministic).
    pts = _series([(180 * 24, 1.0, 1.5)], noise=lambda i: 0.08 * (1 if i % 3 == 0 else (-1 if i % 3 == 1 else 0)))
    assert len(SensorPredictor._split_cycles(pts, "down")) == 1


def test_fan_modulation_does_not_split_cycles() -> None:
    """C1: a +0.25 fan-on plateau for 12 h a day is modulation, not a service."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

    pts = _series([(60 * 24, 1.0, 1.4)], noise=lambda i: 0.25 if (i % 24) < 12 else 0.0)
    assert len(SensorPredictor._split_cycles(pts, "both")) == 1


def test_real_refill_still_splits() -> None:
    from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

    pts = _series([(500, 40, 16), (120, 100, 71)])
    assert len(SensorPredictor._split_cycles(pts, "up")) == 2


# ── battery fleet ────────────────────────────────────────────────────────


def test_replaced_button_for_low_only_notes() -> None:
    """B2: #121 low-only notes are binary_sensor.<x>_battery_plus_low."""
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import replaced_button_for

    assert replaced_button_for("sensor.lock_battery_plus") == "button.lock_battery_replaced"
    assert replaced_button_for("binary_sensor.lock_battery_plus_low") == "button.lock_battery_replaced"


def test_fleet_low_count_has_hysteresis() -> None:
    """B1: a cell hovering at its threshold flipped the count and the fleet
    task auto-completed on every dip."""
    from custom_components.maintenance_supporter.sensor import BatteryFleetLowSensor

    sensor = BatteryFleetLowSensor.__new__(BatteryFleetLowSensor)
    sensor._sticky_low = {}

    def ov(level: float | None, low: bool):
        row = {"entity_id": "sensor.hall_battery_plus", "level": level, "low_threshold": 20.0}
        return SimpleNamespace(low=[row] if low else [], all=[row])

    assert sensor._low_count(ov(19, True)) == 1
    assert sensor._low_count(ov(21, False)) == 1  # still within the band
    assert sensor._low_count(ov(None, False)) == 1  # unavailable is no recovery
    assert sensor._low_count(ov(26, False)) == 0  # clearly recovered
    assert sensor._low_count(ov(19, True)) == 1
    sensor._handle_event(SimpleNamespace(event_type="battery_notes_battery_replaced"))  # type: ignore[arg-type]
    assert sensor._low_count(ov(21, False)) == 0  # replacement forgets the memory


# ── device link: declared-minimum core has neither helper API ────────────


def test_shed_owned_devices_without_any_helper_api_is_a_noop(monkeypatch) -> None:
    """HA-F1: on 2025.7.x neither helper function exists; the unguarded
    fallback failed every linked object's migration on each boot."""
    from homeassistant.helpers import helper_integration

    from custom_components.maintenance_supporter.helpers.device_link import shed_owned_devices

    monkeypatch.delattr(helper_integration, "async_remove_helper_devices", raising=False)
    monkeypatch.delattr(helper_integration, "async_remove_helper_config_entry_from_source_device", raising=False)
    shed_owned_devices(None, own_entry_id="own", source_device_id="dev")  # type: ignore[arg-type]
