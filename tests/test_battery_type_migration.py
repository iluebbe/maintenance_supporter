"""Battery fleet: ONE type normalisation (canonical_type) for grouping, part
ids and the lifetime table — and the one-off migration of persisted
``batt_<alias>`` part ids onto ``batt_<canonical>`` (DRY audit 2026-09).

Before: grouping/part ids only upper-cased the label, the lifetime table
folded aliases. A note typed "LR6" minted its own part and shopping chip
while the forecast (and an AA override) treated it as AA.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASK_CONSUMES_PARTS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.battery_fleet_setup import (
    canonical_part_id,
    find_fleet_entry,
    find_fleet_task,
    migrate_fleet_part_ids,
    reconcile_fleet_parts_at_start,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_task_data,
    call_ws_handler,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    return entry


def _battery(hass: HomeAssistant, name: str, btype: str, qty: int, low: bool) -> None:
    hass.states.async_set(
        f"sensor.{name}_battery_plus",
        "8" if low else "80",
        {"device_class": "battery", "battery_type": btype, "battery_quantity": qty, "battery_low": low, "device_name": name},
    )


async def _fleet_with_aa(hass: HomeAssistant, global_entry: MockConfigEntry) -> MockConfigEntry:
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    fleet = find_fleet_entry(hass)
    assert fleet is not None and "batt_aa" in fleet.data[CONF_PARTS]
    return fleet


def _seed_alias_part(hass: HomeAssistant, fleet: MockConfigEntry, old_id: str, *, name: str, from_id: str = "batt_aa", **extra: object) -> None:
    """Plant a pre-migration part the way older versions minted it."""
    data = dict(fleet.data)
    parts = dict(data[CONF_PARTS])
    parts[old_id] = {**parts[from_id], "id": old_id, "name": name, **extra}
    data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(fleet, data=data)


def _set_fleet_task_links(hass: HomeAssistant, fleet: MockConfigEntry, links: list[dict]) -> str:
    task_id, task = find_fleet_task(fleet)  # type: ignore[misc]
    data = dict(fleet.data)
    tasks = dict(data[CONF_TASKS])
    tasks[task_id] = {**task, CONF_TASK_CONSUMES_PARTS: links}
    data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(fleet, data=data)
    return task_id


def _links(entry: MockConfigEntry, task_id: str) -> list[dict]:
    return list(entry.data[CONF_TASKS][task_id].get(CONF_TASK_CONSUMES_PARTS) or [])


def _stock_uids(hass: HomeAssistant, entry_id: str) -> set[str]:
    ent_reg = er.async_get(hass)
    return {e.unique_id for e in er.async_entries_for_config_entry(ent_reg, entry_id) if "_part_" in (e.unique_id or "")}


# ── the id rule ───────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("part_id", "expected"),
    [
        ("batt_aa", None),  # already canonical
        ("batt_lr6", "batt_aa"),
        ("batt_pp3", "batt_9v"),
        ("batt_aa lithium", "batt_aa"),
        ("batt_cr123a lithium", "batt_cr123a"),
        ("batt_cr2032-3v", "batt_cr2032"),
        ("batt_lithium 3-volt cr2", "batt_cr2"),  # chemistry/voltage prefix folds too
        ("batt_unknown", None),  # the legacy prune owns this one
        ("batt_", None),
        ("filter_x", None),  # not a fleet type-part
    ],
)
def test_canonical_part_id(part_id: str, expected: str | None) -> None:
    assert canonical_part_id(part_id) == expected


# ── grouping ─────────────────────────────────────────────────────────────────


async def test_alias_labels_group_under_the_canonical_type(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """needs_now and the minted parts follow canonical_type: an LR6 device
    counts under AA, "aa lithium" too, and no separate part is minted."""
    from custom_components.maintenance_supporter.helpers.battery_fleet import compute_overview, discover_battery_types

    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "LR6", 2, low=True)
    _battery(hass, "remote", "aa lithium", 1, low=True)
    _battery(hass, "sensor", "AA", 4, low=False)
    _battery(hass, "smoke", "PP3", 1, low=True)

    ov = compute_overview(hass)
    assert ov.needs_now == {"AA": 3, "9V": 1}
    assert {r["battery_type"] for r in ov.all} == {"AA", "9V"}
    assert dict(discover_battery_types(hass)) == {"9V": 1, "AA": 7}

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = find_fleet_entry(hass)
    assert fleet is not None
    assert set(fleet.data[CONF_PARTS]) == {"batt_aa", "batt_9v"}
    assert fleet.data[CONF_PARTS]["batt_aa"]["name"] == "AA battery"


async def test_mark_replaced_consumes_the_canonical_part_for_an_alias_note(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import async_mark_replaced

    fleet = await _fleet_with_aa(hass, global_entry)
    _battery(hass, "remote", "LR6", 2, low=True)
    hass.states.async_set("button.remote_battery_replaced", "unknown")
    fleet.runtime_data.store.set_part_stock("batt_aa", 5)
    result = await async_mark_replaced(hass, ["sensor.remote_battery_plus"])
    assert result["consumed"] == {"batt_aa": 2}
    assert fleet.runtime_data.store.get_part_stock("batt_aa") == 3


# ── the migration ────────────────────────────────────────────────────────────


async def test_merge_alias_part_into_the_canonical_one_and_repoint_every_reference(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    fleet = await _fleet_with_aa(hass, global_entry)
    store = fleet.runtime_data.store
    _seed_alias_part(hass, fleet, "batt_lr6", name="LR6 battery", vendor="Cellshop", reorder_threshold=1, restock_quantity=4, auto_buy_task=True, notes="bulk pack in the cellar")
    store.set_part_stock("batt_lr6", 2)
    store.set_part_stock("batt_aa", 3)
    # The fleet task consumes BOTH ids → one link afterwards, quantities folded.
    task_id = _set_fleet_task_links(hass, fleet, [{"part_id": "batt_lr6", "quantity": 1}, {"part_id": "batt_aa", "quantity": 2}])
    store.append_history(
        task_id,
        {"type": "completed", "timestamp": "2026-08-01T10:00:00+00:00", "used_parts": [{"part_id": "batt_lr6", "name": "LR6 battery", "quantity": 2}]},
    )
    # Another object pooling the fleet's LR6 part (link carries the fleet's entry_id).
    other = make_object_entry(
        hass,
        name="Doorbell",
        uid="doorbell",
        tasks={TASK_ID_1: {**build_task_data(name="Swap cells"), CONF_TASK_CONSUMES_PARTS: [{"part_id": "batt_lr6", "quantity": 1, "entry_id": fleet.entry_id}]}},
    )
    await hass.config_entries.async_setup(other.entry_id)
    await hass.async_block_till_done()
    other.runtime_data.store.append_history(
        TASK_ID_1,
        {"type": "completed", "timestamp": "2026-08-02T10:00:00+00:00", "used_parts": [{"part_id": "batt_lr6", "quantity": 1, "entry_id": fleet.entry_id}]},
    )
    # Tombstones: an alias tombstone follows its canonical id; one whose
    # canonical part exists is dropped.
    data = dict(fleet.data)
    data[CONF_OBJECT] = {**data[CONF_OBJECT], "battery_fleet_removed_parts": ["batt_pp3", "batt_lr03"]}
    parts = dict(data[CONF_PARTS])
    parts["batt_aaa"] = {**parts["batt_aa"], "id": "batt_aaa", "name": "AAA battery"}
    data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(fleet, data=data)
    # A stock-sensor registry entry for the alias part, as an older start left it.
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create("sensor", DOMAIN, "maintenance_supporter_battery_fleet_part_batt_lr6", config_entry=fleet)
    assert "maintenance_supporter_battery_fleet_part_batt_aa" in _stock_uids(hass, fleet.entry_id)

    result = await reconcile_fleet_parts_at_start(hass, fleet, "en")
    assert result["migrated"] == {"batt_lr6": "batt_aa"}
    assert result["added"] == []  # no twin minted

    fleet = find_fleet_entry(hass)
    parts = fleet.data[CONF_PARTS]
    assert "batt_lr6" not in parts and "batt_aa" in parts
    merged = parts["batt_aa"]
    assert merged["name"] == "AA battery"  # the canonical part wins on conflicts
    assert merged["vendor"] == "Cellshop"  # union of empty fields
    assert merged["reorder_threshold"] == 1  # the lower threshold
    assert merged["auto_buy_task"] is True  # OR-ed
    assert "bulk pack in the cellar" in merged["notes"]
    assert store.get_part_stock("batt_aa") == 5
    assert store.get_part_stock("batt_lr6") is None
    assert _links(fleet, task_id) == [{"part_id": "batt_aa", "quantity": 3}]
    assert store.get_history(task_id)[-1]["used_parts"] == [{"part_id": "batt_aa", "name": "LR6 battery", "quantity": 2}]
    other = hass.config_entries.async_get_entry(other.entry_id)
    assert _links(other, TASK_ID_1) == [{"part_id": "batt_aa", "quantity": 1, "entry_id": fleet.entry_id}]
    assert other.runtime_data.store.get_history(TASK_ID_1)[-1]["used_parts"] == [{"part_id": "batt_aa", "quantity": 1, "entry_id": fleet.entry_id}]
    assert fleet.data[CONF_OBJECT]["battery_fleet_removed_parts"] == ["batt_9v"]
    uids = _stock_uids(hass, fleet.entry_id)
    assert "maintenance_supporter_battery_fleet_part_batt_lr6" not in uids
    assert "maintenance_supporter_battery_fleet_part_batt_aa" in uids

    # Second run: nothing left to do, nothing double-counted.
    result = await reconcile_fleet_parts_at_start(hass, fleet, "en")
    assert result["migrated"] == {}
    assert store.get_part_stock("batt_aa") == 5
    assert _links(find_fleet_entry(hass), task_id) == [{"part_id": "batt_aa", "quantity": 3}]
    assert await migrate_fleet_part_ids(hass, find_fleet_entry(hass)) == {}


async def test_rename_alias_part_in_place_keeps_stock_and_the_customised_sensor(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """LR6 only: the part is renamed, its seeded name follows, the stock
    sensor's registry entry moves to the new unique_id (a customisation
    survives) and the boot path reloads so the sensor comes back."""
    fleet = await _fleet_with_aa(hass, global_entry)
    store = fleet.runtime_data.store
    _seed_alias_part(hass, fleet, "batt_lr6", name="LR6 battery", notes="Typical service life ~12 months.")
    data = dict(fleet.data)
    parts = dict(data[CONF_PARTS])
    parts.pop("batt_aa")
    data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(fleet, data=data)
    store.remove_part("batt_aa")
    store.set_part_stock("batt_lr6", 2)
    task_id = _set_fleet_task_links(hass, fleet, [{"part_id": "batt_lr6", "quantity": 1}])
    ent_reg = er.async_get(hass)
    # Drop the AA sensor entry the initial setup minted, plant the LR6 one
    # with a user customisation.
    for reg in list(er.async_entries_for_config_entry(ent_reg, fleet.entry_id)):
        if (reg.unique_id or "").endswith("_part_batt_aa"):
            ent_reg.async_remove(reg.entity_id)
    lr6 = ent_reg.async_get_or_create("sensor", DOMAIN, "maintenance_supporter_battery_fleet_part_batt_lr6", config_entry=fleet)
    ent_reg.async_update_entity(lr6.entity_id, name="Drawer AA")

    # The boot path: setup runs the start-up reconcile, which migrates and reloads.
    await hass.config_entries.async_reload(fleet.entry_id)
    await hass.async_block_till_done()

    fleet = find_fleet_entry(hass)
    parts = fleet.data[CONF_PARTS]
    assert set(parts) == {"batt_aa"}
    assert parts["batt_aa"]["name"] == "AA battery"
    assert parts["batt_aa"]["notes"] == "Typical service life ~12 months."
    assert fleet.runtime_data.store.get_part_stock("batt_aa") == 2
    assert _links(fleet, task_id) == [{"part_id": "batt_aa", "quantity": 1}]
    moved = ent_reg.async_get(lr6.entity_id)
    assert moved is not None and moved.unique_id == "maintenance_supporter_battery_fleet_part_batt_aa"
    assert moved.name == "Drawer AA"
    assert "maintenance_supporter_battery_fleet_part_batt_lr6" not in _stock_uids(hass, fleet.entry_id)
    # The live stock sensor is back under the canonical id.
    state = hass.states.get(lr6.entity_id)
    assert state is not None and state.state == "2"


async def test_mixed_case_and_suffixed_labels_fold_onto_one_part(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """``batt_aa lithium`` (from a note typed "AA Lithium") and ``batt_lr6``
    both fold onto ``batt_aa``: the first rename creates it, the second
    merges into it — stock 1 + 2 + 3."""
    fleet = await _fleet_with_aa(hass, global_entry)
    store = fleet.runtime_data.store
    _seed_alias_part(hass, fleet, "batt_aa lithium", name="AA LITHIUM battery")
    _seed_alias_part(hass, fleet, "batt_lr6", name="LR6 battery")
    store.set_part_stock("batt_aa", 1)
    store.set_part_stock("batt_aa lithium", 2)
    store.set_part_stock("batt_lr6", 3)

    moves = await migrate_fleet_part_ids(hass, fleet)
    assert moves == {"batt_aa lithium": "batt_aa", "batt_lr6": "batt_aa"}
    fleet = find_fleet_entry(hass)
    assert set(fleet.data[CONF_PARTS]) == {"batt_aa"}
    assert store.get_part_stock("batt_aa") == 6
    assert await migrate_fleet_part_ids(hass, fleet) == {}


async def test_explicit_setup_migrates_before_reconciling(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The WS setup on an existing fleet folds the alias part first, so the
    reconcile does not mint the canonical twin next to it."""
    fleet = await _fleet_with_aa(hass, global_entry)
    _seed_alias_part(hass, fleet, "batt_pp3", name="PP3 battery")
    fleet.runtime_data.store.set_part_stock("batt_pp3", 4)
    _battery(hass, "smoke", "PP3", 1, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 2, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    result = conn.send_result.call_args[0][1]
    assert result["created"] is False
    assert result["parts_migrated"] == {"batt_pp3": "batt_9v"}
    assert result["parts_added"] == 0
    fleet = find_fleet_entry(hass)
    assert set(fleet.data[CONF_PARTS]) == {"batt_aa", "batt_9v"}
    assert fleet.runtime_data.store.get_part_stock("batt_9v") == 4
