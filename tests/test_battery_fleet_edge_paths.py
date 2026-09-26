"""Battery fleet — the defensive corners of reading, forecasting and upkeep.

A fleet spans many foreign integrations' entities, so every reader must
survive odd attribute values and recorder hiccups without blanking the
roster; and every upkeep step (mark replaced, record a replacement, fold
alias part ids) must only ever touch what it can prove.
"""

from __future__ import annotations

import logging
from datetime import date
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import (
    BATTERY_FLEET_REMOVED_PARTS,
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers import battery_fleet as bf
from custom_components.maintenance_supporter.helpers.battery_fleet import Battery, lifetime_months
from custom_components.maintenance_supporter.helpers.battery_fleet_setup import (
    RECORDED_REPLACEMENTS_KEY,
    _heal_fleet_trigger_recovery_flag,
    _merge_parts,
    _qty_sum,
    _repoint_links,
    _warn_fleet_trigger_overlap,
    async_consume_type_parts,
    async_mark_replaced,
    async_record_replacement,
    find_fleet_entry,
    find_fleet_task,
    migrate_fleet_part_ids,
)

from .conftest import build_global_entry_data, call_ws_handler, make_object_entry, make_ws_connection, setup_integration

_SP = "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    return entry


def _note(hass: HomeAssistant, name: str, btype: str, qty: int, *, low: bool) -> str:
    eid = f"sensor.{name}_battery_plus"
    hass.states.async_set(
        eid,
        "8" if low else "80",
        {"device_class": "battery", "battery_type": btype, "battery_quantity": qty, "battery_low": low, "device_name": name},
    )
    return eid


async def _fleet(hass: HomeAssistant, global_entry: MockConfigEntry, *, stock: int = 10) -> MockConfigEntry:
    from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    await setup_integration(hass, global_entry)
    _note(hass, "clock", "AA", 1, low=False)  # the fleet needs at least one battery to set up
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    fleet = find_fleet_entry(hass)
    assert fleet is not None and "batt_aa" in fleet.data[CONF_PARTS]
    await async_change_part_stock(hass, fleet, "batt_aa", absolute=stock)
    return fleet


def _bat(name: str = "Lock", *, btype: str = "AA", level: float | None = 60.0, low: bool = False, **kw: Any) -> Battery:
    return Battery(
        entity_id=f"sensor.{name.lower()}_battery_plus",
        device_name=name,
        battery_type=btype,
        quantity=1,
        low=low,
        level=level,
        last_replaced=kw.pop("last_replaced", None),
        **kw,
    )


# ─── reading odd attribute values ─────────────────────────────────────────


@pytest.mark.parametrize(
    ("attrs", "expected"),
    [
        ({"battery_quantity": "3"}, 3),
        ({"battery_quantity": "2 pcs"}, 1),
        ({"battery_quantity": 0}, 1),
        ({"battery_quantity": None}, 1),
        ("not-a-mapping", 1),
    ],
)
def test_battery_quantity_is_always_a_positive_count(attrs: Any, expected: int) -> None:
    assert bf._quantity_of(attrs) == expected


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("2025-03-04 around noon", date(2025, 3, 4)),  # leading ISO date still counts
        ("yesterday", None),
        ("2025-13-45T10:00:00", None),  # impossible date
        ("", None),
    ],
)
def test_last_replaced_parsing_never_raises(raw: str, expected: date | None) -> None:
    assert bf._parse_last_replaced(raw) == expected


def test_predicted_date_uses_the_type_lifetime_and_clamps_the_day() -> None:
    bat = _bat(btype="CR2032", last_replaced=date(2025, 1, 31))
    months = lifetime_months("CR2032")
    y, m = 2025, 1 + months
    y += (m - 1) // 12
    m = (m - 1) % 12 + 1

    # Day 31 cannot exist in every month: the forecast lands on the 28th.
    assert bf._predicted_date(bat) == date(y, m, 28)
    assert bf._predicted_date(_bat(last_replaced=None)) is None


async def test_device_model_key_needs_both_maker_and_model(hass: HomeAssistant) -> None:
    cfg = MockConfigEntry(domain="test", data={})
    cfg.add_to_hass(hass)
    reg = dr.async_get(hass)
    full = reg.async_get_or_create(config_entry_id=cfg.entry_id, identifiers={("test", "a")}, manufacturer="ACME", model="Door X")
    maker_only = reg.async_get_or_create(config_entry_id=cfg.entry_id, identifiers={("test", "b")}, manufacturer="ACME")

    assert bf.device_model_key(hass, full.id) == "acme|door x"
    assert bf.device_model_key(hass, maker_only.id) == ""
    assert bf.device_model_key(hass, "no-such-device") == ""
    assert bf.device_model_key(hass, None) == ""
    assert bf._is_self_charging(hass, None) is False


# ─── recorder hiccups never blank the roster ──────────────────────────────


async def test_a_failing_trend_regression_falls_back_and_is_cached(hass: HomeAssistant) -> None:
    bats = [_bat("Hallway", level=70.0)]
    boom = AsyncMock(side_effect=RuntimeError("recorder busy"))

    with patch(f"{_SP}.async_predict_below", boom):
        first = await bf.async_trend_predictions(hass, bats)
        second = await bf.async_trend_predictions(hass, bats)

    assert first == {} and second == {}
    assert boom.await_count == 1, "the miss is cached like any other"


async def test_a_failing_level_history_leaves_the_sparkline_out(hass: HomeAssistant) -> None:
    bats = [_bat("Hallway", level=70.0), _bat("Porch", level=40.0)]

    async def _fetch(self: Any, entity_id: str, days: int) -> list[tuple[float, float]]:
        if entity_id == "sensor.hallway_battery_plus":
            raise RuntimeError("recorder busy")
        return [(1000.0 + i, 40.0) for i in range(5)]

    with patch(f"{_SP}._async_fetch_statistics_points", _fetch):
        out = await bf.async_level_history(hass, bats)

    assert set(out) == {"sensor.porch_battery_plus"}


async def test_an_unexpected_auto_record_failure_is_logged_and_released(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    eid = "sensor.lock_battery_plus"
    bf._auto_record_inflight(hass).add(eid)

    with (
        patch(
            "custom_components.maintenance_supporter.helpers.battery_fleet_setup.async_record_replacement",
            AsyncMock(side_effect=RuntimeError("store locked")),
        ),
        caplog.at_level(logging.WARNING),
    ):
        await bf._async_auto_record(hass, eid)

    assert f"Automatic replacement record for {eid} failed" in caplog.text
    assert eid not in bf._auto_record_inflight(hass), "a failed record must not block the next recovery"


# ─── upkeep: mark replaced / record replacement ───────────────────────────


async def test_mark_replaced_only_consumes_what_was_actually_pressed(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A note without a replaced button records nothing, so nothing may be
    taken from stock; an entity that is not a battery is ignored."""
    lock = _note(hass, "lock", "AA", 4, low=True)
    remote = _note(hass, "remote", "AA", 2, low=True)
    fleet = await _fleet(hass, global_entry, stock=10)
    hass.states.async_set("button.lock_battery_replaced", "unknown")
    presses = async_mock_service(hass, "button", "press")

    result = await async_mark_replaced(hass, [lock, remote, "sensor.not_a_battery"])
    await hass.async_block_till_done()

    assert result == {"marked": 1, "pressed": 1, "consumed": {"batt_aa": 4}}
    assert [c.data["entity_id"] for c in presses] == ["button.lock_battery_replaced"]
    assert fleet.runtime_data.store.get_part_stock("batt_aa") == 6


async def test_consuming_without_a_fleet_or_types_is_a_no_op(hass: HomeAssistant) -> None:
    assert await async_consume_type_parts(hass, {"AA": 2}) == {}  # no fleet at all
    assert await async_consume_type_parts(hass, {}) == {}


async def test_the_recorded_replacement_memory_is_bounded(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.helpers.battery_lifetime import fleet_store_and_task

    cfg = MockConfigEntry(domain="test", data={})
    cfg.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=cfg.entry_id, identifiers={("test", "lock")}, name="Lock")
    er.async_get(hass).async_get_or_create(
        "sensor", "battery_notes", "lock_plus", suggested_object_id="lock_battery_plus", device_id=device.id
    )
    lock = _note(hass, "lock", "AA", 2, low=False)
    async_mock_service(hass, "battery_notes", "set_battery_replaced")
    fleet = await _fleet(hass, global_entry, stock=10)
    store, task_id = fleet_store_and_task(hass)
    history = {f"sensor.old_{i}_battery_plus": "2025-01-01" for i in range(500)}
    store.update_task_state(task_id, **{RECORDED_REPLACEMENTS_KEY: history})

    result = await async_record_replacement(hass, lock, "2026-09-20T10:00:00+00:00")

    assert result["consumed"] == {"batt_aa": 2}
    recorded = store.get_task_state(task_id)[RECORDED_REPLACEMENTS_KEY]
    assert len(recorded) == 500
    assert recorded[lock] == "2026-09-20"
    assert "sensor.old_0_battery_plus" not in recorded  # the oldest entry made room
    assert "sensor.old_499_battery_plus" in recorded


# ─── the fleet task's trigger health ──────────────────────────────────────


def _entry_with_fleet_task(trigger: dict[str, Any]) -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        data={
            CONF_OBJECT: {"battery_fleet": True},
            CONF_TASKS: {"t": {"battery_fleet_task": True, "name": "Replace", "trigger_config": trigger}},
        },
    )


def test_a_hand_rewired_fleet_trigger_is_not_healed(hass: HomeAssistant) -> None:
    """Only the canonical low-count trigger gets the recovery flag added; a
    trigger the user pointed elsewhere is theirs."""
    entry = _entry_with_fleet_task({"type": "threshold", "entity_id": "sensor.my_own_counter", "trigger_above": 0})

    assert _heal_fleet_trigger_recovery_flag(hass, entry) is False
    assert "auto_complete_on_recovery" not in entry.data[CONF_TASKS]["t"]["trigger_config"]


def test_non_overlapping_fleet_limits_raise_no_warning(caplog: pytest.LogCaptureFixture) -> None:
    entry = _entry_with_fleet_task({"type": "threshold", "trigger_above": 2, "trigger_below": 1})

    with caplog.at_level(logging.WARNING):
        assert _warn_fleet_trigger_overlap(entry) is False
    assert "issue #156" not in caplog.text


# ─── alias part-id folding ────────────────────────────────────────────────


def test_merge_takes_the_folded_parts_limits_when_the_kept_one_has_none() -> None:
    keep = {"id": "batt_aa", "name": "AA battery", "reorder_threshold": None, "restock_quantity": 8}
    gone = {
        "id": "batt_lr6",
        "name": "LR6 battery",
        "reorder_threshold": 3,
        "restock_quantity": 6,
        "notes": "Typical service life ~24 months.",
    }

    merged = _merge_parts(keep, gone)

    assert merged["reorder_threshold"] == 3
    assert merged["restock_quantity"] == 6  # the lower one
    assert "notes" not in merged  # the seeded lifetime line is not carried over


def test_link_quantities_fold_with_odd_values_counting_as_one() -> None:
    assert _qty_sum(2, 3) == 5
    assert _qty_sum("two", None) == 2
    assert _qty_sum(True, 0.5) == 1.5

    links, changed = _repoint_links(
        ["legacy-string-link", {"part_id": "batt_lr6", "quantity": "x"}, {"part_id": "batt_aa", "quantity": 2}],
        {"batt_lr6": "batt_aa"},
        owner_id="fleet",
        foreign=False,
    )

    assert changed is True
    assert links == ["legacy-string-link", {"part_id": "batt_aa", "quantity": 3}]


async def test_migration_repoints_the_auto_buy_marker_and_skips_plain_history(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    fleet = await _fleet(hass, global_entry)
    store = fleet.runtime_data.store
    data = dict(fleet.data)
    parts = dict(data[CONF_PARTS])
    parts["batt_lr6"] = {**parts["batt_aa"], "id": "batt_lr6", "name": "LR6 battery"}
    tasks = dict(data[CONF_TASKS])
    tasks["buy_lr6"] = {"id": "buy_lr6", "name": "Buy LR6", "part_ref": {"part_id": "batt_lr6"}}
    hass.config_entries.async_update_entry(fleet, data={**data, CONF_PARTS: parts, CONF_TASKS: tasks})
    fleet_task_id, _ = find_fleet_task(fleet)
    plain = {"type": "completed", "timestamp": "2026-08-01T10:00:00+00:00", "notes": "swapped by hand"}
    store.append_history(fleet_task_id, plain)
    # An object without tasks cannot pool from the fleet — nothing to touch.
    empty = make_object_entry(hass, tasks={}, name="Empty Shelf", uid="empty_shelf")
    await hass.config_entries.async_setup(empty.entry_id)
    await hass.async_block_till_done()
    empty_data_before = dict(empty.data)

    moves = await migrate_fleet_part_ids(hass, fleet)

    assert moves == {"batt_lr6": "batt_aa"}
    assert fleet.data[CONF_TASKS]["buy_lr6"]["part_ref"] == {"part_id": "batt_aa"}
    assert store.get_history(fleet_task_id)[-1] == plain
    assert dict(empty.data) == empty_data_before


async def test_a_tombstone_for_a_live_canonical_part_is_dropped(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The user deleted an "LR6" part once; LR6 is AA now, and the AA part is
    live — the tombstone means nothing any more and is removed on its own."""
    fleet = await _fleet(hass, global_entry)
    obj = {**fleet.data[CONF_OBJECT], BATTERY_FLEET_REMOVED_PARTS: ["batt_lr6"]}
    hass.config_entries.async_update_entry(fleet, data={**fleet.data, CONF_OBJECT: obj})
    parts_before = dict(fleet.data[CONF_PARTS])

    assert await migrate_fleet_part_ids(hass, fleet) == {}

    assert BATTERY_FLEET_REMOVED_PARTS not in fleet.data[CONF_OBJECT]
    assert fleet.data[CONF_PARTS] == parts_before
