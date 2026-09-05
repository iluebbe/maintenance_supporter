"""Battery Fleet setup: one object, type-parts, ONE task (helpers +
websocket/battery_fleet.py)."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_PARTS, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

from .conftest import call_ws_handler, make_ws_connection, setup_integration


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    from .conftest import build_global_entry_data

    entry = MockConfigEntry(domain=DOMAIN, data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    return entry


def _battery(hass: HomeAssistant, name: str, btype: str, qty: int, low: bool, last: str | None = None) -> None:
    hass.states.async_set(
        f"sensor.{name}_battery_plus",
        "8" if low else "80",
        {
            "device_class": "battery",
            "battery_type": btype,
            "battery_quantity": qty,
            "battery_low": low,
            "device_name": name,
            **({"battery_last_replaced": last} if last else {}),
        },
    )


def _fleet_entry(hass: HomeAssistant):
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import find_fleet_entry

    return find_fleet_entry(hass)


async def test_setup_creates_one_object_type_parts_and_single_task(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    _battery(hass, "motion", "CR2450", 1, low=True)
    _battery(hass, "sensor", "AA", 1, low=False)  # non-low AA still yields an AA part

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    result = conn.send_result.call_args[0][1]
    assert result["created"] is True
    assert set(result["types"]) == {"AA", "CR2450"}

    entry = _fleet_entry(hass)
    assert entry is not None
    # exactly ONE task, flagged, threshold-triggered on the low-count sensor.
    tasks = entry.data[CONF_TASKS]
    assert len(tasks) == 1
    (task,) = tasks.values()
    assert task["name"] == "Replace low batteries"
    assert task["battery_fleet_task"] is True
    tc = task["trigger_config"]
    assert tc["type"] == "threshold" and tc["trigger_above"] == 0
    assert tc["entity_ids"] == ["sensor.maintenance_supporter_batteries_to_replace"]
    # one part per battery type present.
    parts = entry.data[CONF_PARTS]
    assert {p["name"] for p in parts.values()} == {"AA battery", "CR2450 battery"}
    assert "batt_aa" in parts and "batt_cr2450" in parts


async def test_setup_is_idempotent_and_reconciles_new_types(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    first = conn.send_result.call_args[0][1]
    assert first["created"] is True

    # A new battery type appears; second setup reconciles (no second fleet).
    _battery(hass, "smoke", "9V", 1, low=False, last="2020-01-01T00:00:00+00:00")
    conn2 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn2, {"id": 2, "type": "x"})
    second = conn2.send_result.call_args[0][1]
    assert second["created"] is False
    assert second["parts_added"] == 1  # the 9V part

    # still exactly one fleet object, one task.
    fleets = [e for e in hass.config_entries.async_entries(DOMAIN) if e.data.get(CONF_OBJECT, {}).get("battery_fleet")]
    assert len(fleets) == 1
    assert len(fleets[0].data[CONF_TASKS]) == 1
    assert "batt_9v" in fleets[0].data[CONF_PARTS]

    # The reconciled part is TRACKED at 0 like a setup-created one — an
    # untracked part (stock None) shows no stock line and never flags for
    # reorder. Found on a real fleet: reconcile-added types sat untracked
    # next to their "0 pcs/2" setup-created siblings.
    rd = fleets[0].runtime_data
    assert rd.store.get_part_stock("batt_9v") == 0


async def test_setup_refuses_without_any_batteries(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert conn.send_error.called
    assert conn.send_error.call_args[0][1] == "not_available"


async def test_setup_works_with_native_batteries_only(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # No Battery Notes at all — just native device_class:battery sensors. The
    # fleet still sets up (object + task, low tracking works), but NO type
    # part is minted: an "UNKNOWN battery" spare with a reorder threshold and
    # an Amazon-search buy link for the literal word UNKNOWN is nonsense
    # (seen on a real fleet at 0 of 22). Typed notes get real parts.
    await setup_integration(hass, global_entry)
    hass.states.async_set("sensor.phone_battery", "10", {"device_class": "battery"})
    hass.states.async_set("sensor.remote_battery", "90", {"device_class": "battery"})

    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_overview,
        ws_battery_fleet_setup,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    result = conn.send_result.call_args[0][1]
    assert result["created"] is True and result["types"] == []
    entry = _fleet_entry(hass)
    assert entry is not None and entry.data[CONF_PARTS] == {}

    # Overview: the 10% native battery is low, the 90% one is not.
    conn2 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn2, {"id": 2, "type": "x"})
    res = conn2.send_result.call_args[0][1]
    assert res["available"] is True and res["has_battery_notes"] is False
    assert res["total"] == 2 and len(res["low"]) == 1
    assert res["low"][0]["entity_id"] == "sensor.phone_battery"


async def test_setup_seeds_localized_names(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # The created object/task/part names + notes follow the caller's UI
    # language (the #106 reporter translated them manually — now unneeded).
    # The server language matches here: since #115, untouched seeded texts
    # CONVERGE on the server language at every reload, so a mismatch would be
    # rewritten — deliberately, and covered by the retranslation tests below.
    hass.config.language = "de"
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x", "language": "de"})
    assert not conn.send_error.called, conn.send_error.call_args
    entry = _fleet_entry(hass)
    assert entry.data[CONF_OBJECT]["name"] == "Batterie-Flotte"
    (task,) = entry.data[CONF_TASKS].values()
    assert task["name"] == "Schwache Batterien ersetzen"
    assert task["notes"].startswith("Gesammelte Batterie-Prüfung")
    part = entry.data[CONF_PARTS]["batt_aa"]
    assert part["name"] == "AA-Batterie"
    assert part["notes"] == "Typische Lebensdauer ~12 Monate."
    # Trigger stays canonical regardless of language.
    assert task["trigger_config"]["entity_id"] == "sensor.maintenance_supporter_batteries_to_replace"


async def test_setup_trigger_carries_both_entity_id_shapes(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # Issue #106: the task-dialog save path gates on the SINGULAR entity_id;
    # a trigger stored with only entity_ids got wiped on an unrelated edit.
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    entry = _fleet_entry(hass)
    (task,) = entry.data[CONF_TASKS].values()
    tc = task["trigger_config"]
    assert tc["entity_id"] == "sensor.maintenance_supporter_batteries_to_replace"
    assert tc["entity_ids"] == ["sensor.maintenance_supporter_batteries_to_replace"]


async def test_update_cannot_null_fleet_trigger(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # #106 belt-and-braces: even a stale/cached frontend bundle that fails to
    # round-trip the trigger (sends trigger_config=null with an unrelated
    # edit) must NOT wipe the fleet task's trigger — the backend ignores the
    # null for the flagged task while every other field still applies.
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import fleet_task_trigger_ok
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    entry = _fleet_entry(hass)
    (task_id,) = entry.data[CONF_TASKS]

    # The reporter's edit as a stale dialog sends it: rename + type + null trigger.
    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn2,
        {
            "id": 2,
            "type": "x",
            "entry_id": entry.entry_id,
            "task_id": task_id,
            "name": "Remplacer les piles",
            "task_type": "replacement",
            "warning_days": 1,
            "trigger_config": None,
        },
    )
    assert not conn2.send_error.called, conn2.send_error.call_args
    entry = _fleet_entry(hass)
    task = entry.data[CONF_TASKS][task_id]
    # Edit applied — but the trigger survived.
    assert task["name"] == "Remplacer les piles"
    assert task["type"] == "replacement"
    assert task["warning_days"] == 1
    assert task["trigger_config"]["type"] == "threshold"
    assert fleet_task_trigger_ok(entry) is True

    # A NORMAL task's trigger is still removable via null (unchanged behavior).
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task

    conn3 = make_ws_connection()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn3,
        {
            "id": 3,
            "type": "x",
            "entry_id": entry.entry_id,
            "name": "Normal sensor task",
            "task_type": "inspection",
            "schedule_type": "sensor_based",
            "trigger_config": {"type": "threshold", "entity_id": "sensor.x", "trigger_above": 5},
        },
    )
    assert not conn3.send_error.called, conn3.send_error.call_args
    entry = _fleet_entry(hass)
    normal_id = next(tid for tid, td in entry.data[CONF_TASKS].items() if td["name"] == "Normal sensor task")
    conn4 = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn4,
        {"id": 4, "type": "x", "entry_id": entry.entry_id, "task_id": normal_id, "trigger_config": None},
    )
    assert not conn4.send_error.called, conn4.send_error.call_args
    entry = _fleet_entry(hass)
    assert entry.data[CONF_TASKS][normal_id].get("trigger_config") is None


async def test_reconcile_repairs_wiped_trigger_keeping_user_edits(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # Repair path for installs broken BEFORE the update guard existed: the
    # stored fleet task has trigger_config=None — re-running setup (the Repair
    # button) restores the canonical trigger without touching the user's edits.
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import fleet_task_trigger_ok
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_overview,
        ws_battery_fleet_setup,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    entry = _fleet_entry(hass)
    (task_id,) = entry.data[CONF_TASKS]

    # Corrupt the stored task directly (what a pre-guard client left behind).
    new_data = dict(entry.data)
    new_tasks = dict(new_data[CONF_TASKS])
    broken_task = dict(new_tasks[task_id])
    broken_task["trigger_config"] = None
    broken_task["name"] = "Remplacer batteries faibles"
    broken_task["type"] = "replacement"
    broken_task["warning_days"] = 1
    new_tasks[task_id] = broken_task
    new_data[CONF_TASKS] = new_tasks
    hass.config_entries.async_update_entry(entry, data=new_data)

    entry = _fleet_entry(hass)
    assert fleet_task_trigger_ok(entry) is False

    # Overview surfaces the broken state (drives the panel's Repair button).
    conn3 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn3, {"id": 3, "type": "x"})
    assert conn3.send_result.call_args[0][1]["task_ok"] is False

    # Re-running setup (the Repair button) restores the canonical trigger.
    conn4 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn4, {"id": 4, "type": "x"})
    res = conn4.send_result.call_args[0][1]
    assert res["created"] is False and res["task_repaired"] is True

    entry = _fleet_entry(hass)
    fixed = entry.data[CONF_TASKS][task_id]
    tc = fixed["trigger_config"]
    assert tc["type"] == "threshold" and tc["trigger_above"] == 0
    assert tc["entity_id"] == "sensor.maintenance_supporter_batteries_to_replace"
    # The user's translations/edits are untouched.
    assert fixed["name"] == "Remplacer batteries faibles"
    assert fixed["type"] == "replacement"
    assert fixed["warning_days"] == 1
    assert fleet_task_trigger_ok(entry) is True


async def test_reconcile_recreates_deleted_fleet_task(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_delete_task

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    entry = _fleet_entry(hass)
    (task_id,) = entry.data[CONF_TASKS]

    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_delete_task, hass, conn2, {"id": 2, "type": "x", "entry_id": entry.entry_id, "task_id": task_id}
    )
    entry = _fleet_entry(hass)
    assert entry.data[CONF_TASKS] == {}

    conn3 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn3, {"id": 3, "type": "x"})
    assert conn3.send_result.call_args[0][1]["task_repaired"] is True
    entry = _fleet_entry(hass)
    tasks = entry.data[CONF_TASKS]
    assert len(tasks) == 1
    (task,) = tasks.values()
    assert task["battery_fleet_task"] is True
    assert task["trigger_config"]["entity_id"] == "sensor.maintenance_supporter_batteries_to_replace"


async def test_mark_replaced_presses_buttons_and_consumes_stock(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_setup,
    )

    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    _battery(hass, "motion", "AA", 1, low=True)
    _battery(hass, "sensor", "CR2032", 1, low=False)
    # The Battery Notes 'replaced' buttons (parallel entities).
    for slug in ("lock", "motion"):
        hass.states.async_set(f"button.{slug}_battery_replaced", "unknown")

    # Set up the fleet, then stock the AA/CR2032 spares so consumption shows.
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    await async_change_part_stock(hass, fleet, "batt_aa", absolute=10)

    from pytest_homeassistant_custom_component.common import async_mock_service

    calls = async_mock_service(hass, "button", "press")

    conn2 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_mark_replaced, hass, conn2, {"id": 2, "type": "x"})
    res = conn2.send_result.call_args[0][1]
    # both low AA devices marked (5 AA total), buttons pressed.
    assert res["marked"] == 2 and res["pressed"] == 2
    assert res["consumed"] == {"batt_aa": 5}
    # AA stock decremented by 5 (10 -> 5).
    rd = fleet.runtime_data
    assert rd.store.get_part_stock("batt_aa") == 5
    # both button presses were issued (to the two replaced buttons).
    pressed_targets = {c.data["entity_id"] for c in calls}
    assert pressed_targets == {"button.lock_battery_replaced", "button.motion_battery_replaced"}


async def test_ws_set_excluded_roundtrip(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # #107: exclude via WS -> battery leaves the overview; include -> back.
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    _battery(hass, "motion", "AA", 1, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_overview,
        ws_battery_fleet_set_excluded,
        ws_battery_fleet_setup,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})

    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_excluded,
        hass,
        conn2,
        {"id": 2, "type": "x", "entity_id": "sensor.lock_battery_plus", "excluded": True},
    )
    assert not conn2.send_error.called, conn2.send_error.call_args

    conn3 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn3, {"id": 3, "type": "x"})
    res = conn3.send_result.call_args[0][1]
    assert res["total"] == 1 and len(res["low"]) == 1
    assert res["low"][0]["entity_id"] == "sensor.motion_battery_plus"
    assert [x["entity_id"] for x in res["excluded"]] == ["sensor.lock_battery_plus"]
    assert res["excluded"][0]["device_name"] == "lock"

    conn4 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_excluded,
        hass,
        conn4,
        {"id": 4, "type": "x", "entity_id": "sensor.lock_battery_plus", "excluded": False},
    )
    conn5 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn5, {"id": 5, "type": "x"})
    res5 = conn5.send_result.call_args[0][1]
    assert res5["total"] == 2 and res5["excluded"] == []


async def test_overview_reports_low_and_grouped_needs(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    _battery(hass, "motion", "AA", 1, low=True)
    _battery(hass, "sensor", "CR2032", 1, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_overview

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn, {"id": 1, "type": "x"})
    res = conn.send_result.call_args[0][1]
    assert res["available"] is True and res["configured"] is False
    assert res["total"] == 3 and len(res["low"]) == 3
    assert res["needs_now"] == {"AA": 5, "CR2032": 1}


# ─── retranslating seeded texts (issue #115) ──────────────────────────────


def test_untouched_english_seed_texts_follow_the_language() -> None:
    """The report: a Danish UI showing Danish everywhere except the task notes
    — a stored snapshot from before localized seeding existed. Untouched
    seeded texts must follow the instance language."""
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import (
        retranslate_seeded_texts,
    )

    entry = MagicMock()
    entry.title = "Battery Fleet"
    entry.data = {
        "object": {"name": "Battery Fleet", "battery_fleet": True},
        "tasks": {
            "t1": {
                "battery_fleet_task": True,
                "name": "Replace low batteries",
                "notes": (
                    "Aggregate battery check. The detail view lists which devices are low "
                    "and which battery types to buy."
                ),
            }
        },
        "parts": {
            "batt_aa": {"name": "AA battery", "notes": "Typical service life ~12 months."},
        },
    }
    hass = MagicMock()

    assert retranslate_seeded_texts(hass, entry, "da") is True
    (_, kwargs) = hass.config_entries.async_update_entry.call_args
    data = kwargs["data"]
    assert data["object"]["name"] == "Batteriflåde"
    assert data["tasks"]["t1"]["name"] == "Udskift svage batterier"
    assert "Samlet batteritjek" in data["tasks"]["t1"]["notes"]
    assert data["parts"]["batt_aa"]["name"] == "AA-batteri"
    assert "12" in data["parts"]["batt_aa"]["notes"]
    assert kwargs["title"] == "Batteriflåde"


def test_a_user_edited_note_is_never_rewritten() -> None:
    """The safety rule: only texts that exactly match a known template variant
    are touched. Anything the user typed stays, whatever the language."""
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import (
        retranslate_seeded_texts,
    )

    entry = MagicMock()
    entry.title = "Batteriflåde"
    entry.data = {
        "object": {"name": "Kellerbatterien", "battery_fleet": True},  # renamed by hand
        "tasks": {
            "t1": {
                "battery_fleet_task": True,
                "name": "Udskift svage batterier",
                "notes": "Nur die Funk-Sensoren, NICHT die Rauchmelder!",  # user's own words
            }
        },
        "parts": {"batt_aa": {"name": "Eneloop Vorrat", "notes": "im Flurschrank"}},
    }
    hass = MagicMock()

    assert retranslate_seeded_texts(hass, entry, "da") is False
    hass.config_entries.async_update_entry.assert_not_called()


def test_retranslation_matches_foreign_variants_and_placeholders() -> None:
    """Danish part names round-trip: "AA-batteri" must be recognised as the
    {type} template with type "AA" and rewritten into the new language —
    including a hyphenated type like Li-ion."""
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import (
        retranslate_seeded_texts,
    )

    entry = MagicMock()
    entry.title = "Batteriflåde"
    entry.data = {
        "object": {"name": "Batteriflåde", "battery_fleet": True},
        "tasks": {},
        "parts": {
            "batt_aa": {"name": "AA-batteri", "notes": ""},
            "batt_li-ion": {"name": "Li-ion-batteri", "notes": ""},
        },
    }
    hass = MagicMock()

    assert retranslate_seeded_texts(hass, entry, "de") is True
    (_, kwargs) = hass.config_entries.async_update_entry.call_args
    parts = kwargs["data"]["parts"]
    assert parts["batt_aa"]["name"] == "AA-Batterie"
    assert parts["batt_li-ion"]["name"] == "Li-ion-Batterie"
    # Already-current texts are a no-op on the second run (idempotent).
    entry.data = kwargs["data"]
    hass2 = MagicMock()
    assert retranslate_seeded_texts(hass2, entry, "de") is False


async def test_ws_set_included_adds_a_heuristic_miss(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#135: a sensor the discovery heuristics miss (no device_class, no
    "battery" in the name, no % unit) joins the roster via a manual include,
    bypassing the heuristic AND the self-charging filter — while exclusion
    stays king and the symmetric setters never stack."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    # A heuristic miss: voltage-style reading, no battery hints at all.
    hass.states.async_set("sensor.side_gate_cell", "42", {"unit_of_measurement": "%"})

    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_overview,
        ws_battery_fleet_set_excluded,
        ws_battery_fleet_set_included,
        ws_battery_fleet_setup,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})

    # Not discovered on its own.
    conn2 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn2, {"id": 2, "type": "x"})
    res = conn2.send_result.call_args[0][1]
    assert all(r["entity_id"] != "sensor.side_gate_cell" for r in res["all"])

    # Include -> appears with its level.
    conn3 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_included,
        hass,
        conn3,
        {"id": 3, "type": "x", "entity_id": "sensor.side_gate_cell", "included": True},
    )
    assert not conn3.send_error.called, conn3.send_error.call_args
    conn4 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn4, {"id": 4, "type": "x"})
    res = conn4.send_result.call_args[0][1]
    row = next(r for r in res["all"] if r["entity_id"] == "sensor.side_gate_cell")
    assert row["level"] == 42

    # Excluding the included battery LIFTS the include (no stacked state):
    conn5 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_excluded,
        hass,
        conn5,
        {"id": 5, "type": "x", "entity_id": "sensor.side_gate_cell", "excluded": True},
    )
    conn6 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn6, {"id": 6, "type": "x"})
    res = conn6.send_result.call_args[0][1]
    assert all(r["entity_id"] != "sensor.side_gate_cell" for r in res["all"])
    # ...and it is NOT in the excluded chips either (the include was lifted,
    # not converted into an exclusion of a heuristic-invisible entity).
    assert all(x["entity_id"] != "sensor.side_gate_cell" for x in res.get("excluded", []))

    # Re-including lifts a real exclusion too (change of mind on a normal row).
    conn7 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_excluded,
        hass,
        conn7,
        {"id": 7, "type": "x", "entity_id": "sensor.lock_battery_plus", "excluded": True},
    )
    conn8 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_included,
        hass,
        conn8,
        {"id": 8, "type": "x", "entity_id": "sensor.lock_battery_plus", "included": True},
    )
    conn9 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn9, {"id": 9, "type": "x"})
    res = conn9.send_result.call_args[0][1]
    assert any(r["entity_id"] == "sensor.lock_battery_plus" for r in res["all"])


async def test_fleet_sensor_batteries_due_attribute(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#135: the fleet low sensor lists what is due as readable lines —
    replace with the type for primaries, recharge for rechargeables."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "CR2", 1, low=True)
    _battery(hass, "vacuum_dock", "Rechargeable", 1, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_setup,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    await hass.async_block_till_done()
    # The summary sensor refreshes on Battery Notes events (its real update
    # path) — the seeded states alone don't repaint the snapshot.
    hass.bus.async_fire("battery_notes_battery_threshold", {})
    await hass.async_block_till_done()

    # Assert on the REAL entity's attributes — the label formatting lives in
    # the sensor, not in the aggregation.
    fleet_state = next(
        st for st in hass.states.async_all("sensor")
        if "batteries_due" in st.attributes
    )
    due = set(fleet_state.attributes["batteries_due"])
    assert "lock — replace (CR2)" in due
    assert "vacuum_dock — recharge" in due
    assert fleet_state.attributes["batteries_due_soon"] == []


def _ring_device(hass: HomeAssistant, slug: str, *, identifiers=None, with_note: bool = True):
    """Registry device with a native battery %, a ``battery_charging`` binary
    (=> ``_is_self_charging`` is True) and optionally a Battery Notes note on
    the SAME device — lurisin's Oura Ring shape (#135)."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = MockConfigEntry(domain="test", data={})
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers=identifiers or {("test", slug)},
        name=slug.replace("_", " ").title(),
    )
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        "sensor", "test", f"{slug}_batt", suggested_object_id=f"{slug}_battery", device_id=device.id
    )
    ent_reg.async_get_or_create(
        "binary_sensor",
        "test",
        f"{slug}_chg",
        suggested_object_id=f"{slug}_charging",
        device_id=device.id,
        original_device_class="battery_charging",
    )
    hass.states.async_set(f"sensor.{slug}_battery", "73", {"device_class": "battery"})
    if with_note:
        ent_reg.async_get_or_create(
            "sensor", "battery_notes", f"{slug}_plus", suggested_object_id=f"{slug}_battery_plus", device_id=device.id
        )
        hass.states.async_set(
            f"sensor.{slug}_battery_plus",
            "73",
            {
                "device_class": "battery",
                "battery_type": "Rechargeable",
                "battery_quantity": 1,
                "battery_low": False,
                "battery_last_replaced": "2026-08-18T19:08:07+00:00",
                "device_name": slug.replace("_", " ").title(),
                # lurisin's real attrs: Battery Notes left this EMPTY.
                "source_entity_id": "",
            },
        )
    return device


async def _overview(hass: HomeAssistant) -> dict:
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_overview

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn, {"id": 99, "type": "x"})
    return conn.send_result.call_args[0][1]


async def test_include_lifts_the_self_charging_skip_for_a_noted_device(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#135 (lurisin's Oura Ring): a NOTED device dropped by the self-charging
    filter joins the roster via a manual include of its battery_plus. The
    v2.61.0 bypass lived only in the native pass, so this exact include was a
    silent no-op: pass 1 dropped the note, and the native pass skipped both
    the note (battery_type attr) and the sibling sensor (device coverage)."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    _ring_device(hass, "oura_ring")

    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_set_excluded,
        ws_battery_fleet_set_included,
        ws_battery_fleet_setup,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})

    # Dropped by the self-charging filter (charging binary on the device).
    res = await _overview(hass)
    assert all("oura" not in r["entity_id"] for r in res["all"])

    # Include the battery_plus -> ONE row, the rich note.
    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_included,
        hass,
        conn2,
        {"id": 2, "type": "x", "entity_id": "sensor.oura_ring_battery_plus", "included": True},
    )
    assert not conn2.send_error.called, conn2.send_error.call_args
    res = await _overview(hass)
    rows = [r for r in res["all"] if "oura" in r["entity_id"]]
    assert len(rows) == 1, rows
    assert rows[0]["entity_id"] == "sensor.oura_ring_battery_plus"
    assert rows[0]["level"] == 73
    assert rows[0]["rechargeable"] is True

    # Excluding it lifts the include (symmetric setters), no excluded chip.
    conn3 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_excluded,
        hass,
        conn3,
        {"id": 3, "type": "x", "entity_id": "sensor.oura_ring_battery_plus", "excluded": True},
    )
    res = await _overview(hass)
    assert all("oura" not in r["entity_id"] for r in res["all"])
    assert all("oura" not in x["entity_id"] for x in res.get("excluded", []))


async def test_include_of_the_native_sibling_lifts_the_whole_device(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#135: the include acts DEVICE-wide — picking the native %-sensor of a
    noted self-charging device surfaces the device once, through its richer
    Battery Notes row (never a degraded duplicate)."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    _ring_device(hass, "oura_ring")

    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_set_included,
        ws_battery_fleet_setup,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_included,
        hass,
        conn2,
        {"id": 2, "type": "x", "entity_id": "sensor.oura_ring_battery", "included": True},
    )
    res = await _overview(hass)
    rows = [r for r in res["all"] if "oura" in r["entity_id"]]
    assert len(rows) == 1, rows
    assert rows[0]["entity_id"] == "sensor.oura_ring_battery_plus"
    assert rows[0]["rechargeable"] is True


async def test_track_self_charging_option(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#135 follow-up: the fleet-wide opt-in surfaces self-charging devices as
    rechargeables — typed "Rechargeable" (native rows too, never "Unknown"),
    kept out of the shopping needs, exclusions still win."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    # A Companion-app phone: native battery, low, no note.
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    t_entry = MockConfigEntry(domain="test", data={})
    t_entry.add_to_hass(hass)
    phone = dr.async_get(hass).async_get_or_create(
        config_entry_id=t_entry.entry_id, identifiers={("mobile_app", "pixel10")}, name="Pixel"
    )
    er.async_get(hass).async_get_or_create(
        "sensor", "test", "pixel_batt", suggested_object_id="pixel_battery", device_id=phone.id
    )
    hass.states.async_set("sensor.pixel_battery", "9", {"device_class": "battery"})

    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_set_excluded,
        ws_battery_fleet_set_track_self_charging,
        ws_battery_fleet_setup,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})

    res = await _overview(hass)
    assert res["track_self_charging"] is False
    assert all(r["entity_id"] != "sensor.pixel_battery" for r in res["all"])

    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_track_self_charging, hass, conn2, {"id": 2, "type": "x", "enabled": True}
    )
    assert not conn2.send_error.called, conn2.send_error.call_args
    res = await _overview(hass)
    assert res["track_self_charging"] is True
    row = next(r for r in res["all"] if r["entity_id"] == "sensor.pixel_battery")
    # Surfaced as a RECHARGEABLE (drives the "— recharge" label), low, and
    # never a shopping need.
    assert row["rechargeable"] is True
    assert row["status"] == "low"
    assert "RECHARGEABLE" not in res["needs_now"] and "UNKNOWN" not in res["needs_now"]

    # Exclusion still wins over the option.
    conn3 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_excluded,
        hass,
        conn3,
        {"id": 3, "type": "x", "entity_id": "sensor.pixel_battery", "excluded": True},
    )
    res = await _overview(hass)
    assert all(r["entity_id"] != "sensor.pixel_battery" for r in res["all"])

    # Un-exclude + switch the option back off -> hidden again (#107 default).
    conn4 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_excluded,
        hass,
        conn4,
        {"id": 4, "type": "x", "entity_id": "sensor.pixel_battery", "excluded": False},
    )
    conn5 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_track_self_charging, hass, conn5, {"id": 5, "type": "x", "enabled": False}
    )
    res = await _overview(hass)
    assert res["track_self_charging"] is False
    assert all(r["entity_id"] != "sensor.pixel_battery" for r in res["all"])


async def test_track_self_charging_requires_a_fleet(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_set_track_self_charging,
    )

    conn = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_track_self_charging, hass, conn, {"id": 1, "type": "x", "enabled": True}
    )
    assert conn.send_error.called
    assert conn.send_error.call_args[0][1] == "not_configured"


async def test_included_dead_note_stays_visible(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#135: the connectivity-noise drop (unavailable, not low, no date) is
    lifted for an entity the user explicitly included — a stated battery
    stays on the roster even while it reads like noise."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    hass.states.async_set(
        "sensor.attic_cam_battery_plus",
        "unavailable",
        {
            "device_class": "battery",
            "battery_type": "18650",
            "battery_quantity": 1,
            "battery_low": False,
            "device_name": "Attic Cam",
        },
    )

    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_set_included,
        ws_battery_fleet_setup,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})

    res = await _overview(hass)
    assert all(r["entity_id"] != "sensor.attic_cam_battery_plus" for r in res["all"])

    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_set_included,
        hass,
        conn2,
        {"id": 2, "type": "x", "entity_id": "sensor.attic_cam_battery_plus", "included": True},
    )
    res = await _overview(hass)
    row = next(r for r in res["all"] if r["entity_id"] == "sensor.attic_cam_battery_plus")
    assert row["available"] is False


async def test_fleet_lists_are_capped(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Security-review hygiene bound: the write-gated include/exclude lists
    refuse to grow past FLEET_LIST_CAP (config-entry bloat), while re-adding
    an entry already on a full list stays a no-op success."""
    import pytest
    from homeassistant.exceptions import HomeAssistantError

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import (
        FLEET_LIST_CAP,
        find_fleet_entry,
        set_battery_excluded,
        set_battery_included,
    )

    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})

    entry = find_fleet_entry(hass)
    assert entry is not None
    new_data = dict(entry.data)
    obj = dict(new_data[CONF_OBJECT])
    obj["battery_fleet_included"] = [f"sensor.cap_probe_{i}" for i in range(FLEET_LIST_CAP)]
    obj["battery_fleet_excluded"] = [f"sensor.cap_out_{i}" for i in range(FLEET_LIST_CAP)]
    new_data[CONF_OBJECT] = obj
    hass.config_entries.async_update_entry(entry, data=new_data)

    with pytest.raises(HomeAssistantError):
        set_battery_included(hass, "sensor.one_too_many", True)
    with pytest.raises(HomeAssistantError):
        set_battery_excluded(hass, "sensor.one_too_many", True)

    # Already-listed entries stay idempotent no-ops, and removal always works.
    assert set_battery_included(hass, "sensor.cap_probe_0", True) is True
    assert set_battery_included(hass, "sensor.cap_probe_1", False) is True
    assert set_battery_excluded(hass, "sensor.cap_out_1", False) is True


async def test_start_reconcile_adds_late_typed_parts_and_prunes_unknown(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#148: a type that becomes known after setup (Matter lock whose typed
    low-only binary appears later) gets its part on the next start, and the
    legacy untouched "UNKNOWN battery" part is pruned."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    assert fleet is not None

    # Simulate the pre-fix world: a legacy UNKNOWN part sits in the fleet.
    data = dict(fleet.data)
    parts = dict(data[CONF_PARTS])
    parts["batt_unknown"] = {**parts["batt_aa"], "id": "batt_unknown", "name": "UNKNOWN battery"}
    data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(fleet, data=data)

    # The lock's battery type appears later (typed low-only binary, #121 shape).
    hass.states.async_set(
        "binary_sensor.back_door_battery_plus_low", "on",
        {"device_class": "battery", "battery_type": "Lithium 3-volt CR2", "battery_quantity": 1, "device_name": "Back Door Lock"},
    )

    # The stock sensor's registry entry, the way v2.70.0 left it behind.
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        "sensor", "maintenance_supporter", "maintenance_supporter_battery_fleet_part_batt_unknown", config_entry=fleet
    )

    await hass.config_entries.async_reload(fleet.entry_id)
    await hass.async_block_till_done()

    fleet = _fleet_entry(hass)
    assert fleet is not None
    parts = fleet.data[CONF_PARTS]
    assert "batt_lithium 3-volt cr2" in parts, sorted(parts)
    assert "batt_unknown" not in parts
    # Added part is tracked at 0 like every setup-created sibling.
    assert fleet.runtime_data.store.get_part_stock("batt_lithium 3-volt cr2") == 0
    # #148 follow-up: the pruned part's stock entries are gone everywhere —
    # store AND entity registry (v2.70.0 left an unavailable orphan sensor
    # whose Delete button HA greys out).
    assert fleet.runtime_data.store.get_part_stock("batt_unknown") is None
    assert not [
        e.entity_id
        for e in er.async_entries_for_config_entry(ent_reg, fleet.entry_id)
        if "_part_batt_unknown" in (e.unique_id or "")
    ]


async def test_start_reconcile_keeps_a_touched_unknown_part(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A legacy UNKNOWN part the user counted stock for is theirs — kept."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    data = dict(fleet.data)
    parts = dict(data[CONF_PARTS])
    parts["batt_unknown"] = {**parts["batt_aa"], "id": "batt_unknown", "name": "UNKNOWN battery"}
    data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(fleet, data=data)
    fleet.runtime_data.store.set_part_stock("batt_unknown", 3)
    await fleet.runtime_data.store.async_save()

    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        "sensor", "maintenance_supporter", "maintenance_supporter_battery_fleet_part_batt_unknown", config_entry=fleet
    )

    await hass.config_entries.async_reload(fleet.entry_id)
    await hass.async_block_till_done()

    fleet = _fleet_entry(hass)
    assert "batt_unknown" in fleet.data[CONF_PARTS]
    assert fleet.runtime_data.store.get_part_stock("batt_unknown") == 3
    # The kept part keeps its stock sensor too — only ORPHANS are swept.
    assert any(
        "_part_batt_unknown" in (e.unique_id or "")
        for e in er.async_entries_for_config_entry(ent_reg, fleet.entry_id)
    )


async def test_start_reconcile_sweeps_orphaned_stock_sensor_registry_entries(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#148 follow-up: an install where the v2.70.0 prune already ran has the
    part gone but the stock sensor's registry entry left behind (unavailable,
    Delete greyed out). The boot reconcile sweeps it."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    assert fleet is not None

    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        "sensor", "maintenance_supporter", "maintenance_supporter_battery_fleet_part_batt_unknown", config_entry=fleet
    )

    await hass.config_entries.async_reload(fleet.entry_id)
    await hass.async_block_till_done()

    assert not [
        e.entity_id
        for e in er.async_entries_for_config_entry(ent_reg, fleet.entry_id)
        if "_part_batt_unknown" in (e.unique_id or "")
    ]
    # Real parts keep their registry entries.
    assert any(
        "_part_batt_aa" in (e.unique_id or "")
        for e in er.async_entries_for_config_entry(ent_reg, fleet.entry_id)
    )


async def test_start_heals_missing_recovery_flag_only(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#156: a fleet task from before auto_complete_on_recovery joined the
    canonical trigger gets the flag at start — and ONLY the flag; a
    deliberately edited threshold stays."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    assert fleet is not None

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import find_fleet_task

    task_id, task_data = find_fleet_task(fleet)
    tc = dict(task_data["trigger_config"])
    tc.pop("auto_complete_on_recovery", None)
    tc["trigger_above"] = 5  # user-edited threshold must survive the heal
    tasks = dict(fleet.data[CONF_TASKS])
    tasks[task_id] = {**task_data, "trigger_config": tc}
    hass.config_entries.async_update_entry(fleet, data={**fleet.data, CONF_TASKS: tasks})

    await hass.config_entries.async_reload(fleet.entry_id)
    await hass.async_block_till_done()
    # The heal triggers one more reload of its own — let it settle.
    await hass.async_block_till_done()

    fleet = _fleet_entry(hass)
    _tid, healed = find_fleet_task(fleet)
    htc = healed["trigger_config"]
    assert htc.get("auto_complete_on_recovery") is True
    assert htc.get("trigger_above") == 5


async def test_start_warns_on_overlapping_fleet_trigger(
    hass: HomeAssistant, global_entry: MockConfigEntry, caplog: pytest.LogCaptureFixture
) -> None:
    """#156 (the reporter's real case): a hand-added ``trigger_below`` above
    the canonical ``trigger_above: 0`` keeps the fleet task triggered forever.
    Start logs a pointed warning and leaves the user's edit alone."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    assert fleet is not None

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import find_fleet_task

    task_id, task_data = find_fleet_task(fleet)
    tc = {**task_data["trigger_config"], "trigger_below": 5}
    tasks = dict(fleet.data[CONF_TASKS])
    tasks[task_id] = {**task_data, "trigger_config": tc}
    hass.config_entries.async_update_entry(fleet, data={**fleet.data, CONF_TASKS: tasks})

    caplog.clear()
    await hass.config_entries.async_reload(fleet.entry_id)
    await hass.async_block_till_done()

    warned = [r.getMessage() for r in caplog.records if r.levelname == "WARNING"]
    assert any("can never auto-complete" in m and "issue #156" in m for m in warned), warned
    fleet = _fleet_entry(hass)
    _tid, kept = find_fleet_task(fleet)
    assert kept["trigger_config"].get("trigger_below") == 5
    assert kept["trigger_config"].get("trigger_above") == 0


async def test_batteries_sensor_exposes_detailed_rows(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """#151/#156: structured due rows (name/type/quantity/level) next to the
    display-line lists."""
    await setup_integration(hass, global_entry)
    _battery(hass, "hue_switch", "CR2450", 1, low=True)
    await hass.async_block_till_done()

    target_eid = None
    for eid in hass.states.async_entity_ids("sensor"):
        if "batteries_to_replace" in eid:
            target_eid = eid
            break
    assert target_eid is not None, "batteries sensor missing"
    # The battery appeared after setup — poke the entity so its attributes
    # re-read the live overview (the homeassistant service isn't loaded in
    # the test hass; use the helper directly).
    from homeassistant.helpers.entity_component import async_update_entity

    await async_update_entity(hass, target_eid)
    await hass.async_block_till_done()
    state = hass.states.get(target_eid)
    assert state is not None, "batteries sensor missing"
    detailed = state.attributes.get("batteries_due_detailed")
    assert isinstance(detailed, list) and detailed, state.attributes
    row = detailed[0]
    assert row["type"] == "CR2450"
    assert row["quantity"] == 1
    assert "level" in row and "name" in row and "rechargeable" in row


async def test_deleted_type_part_stays_deleted_until_an_explicit_setup(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Bug review 2026-09-04: the start-up reconcile re-minted a deleted
    ``batt_<type>`` part on every boot while the type was still in the
    fleet. part/delete now tombstones it, the reconcile honours the
    tombstone, and only an explicit Battery-Fleet setup brings it back."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)
    _battery(hass, "remote", "AAA", 2, low=False)

    from homeassistant.helpers import entity_registry as er

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import reconcile_fleet_parts_at_start
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup
    from custom_components.maintenance_supporter.websocket.parts import ws_delete_part

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    assert fleet is not None and {"batt_aa", "batt_aaa"} <= set(fleet.data[CONF_PARTS])

    # The AAA stock sensor carries a user customisation — deleting the AA
    # part must not touch it (``_part_batt_aa`` is a prefix of ``_part_batt_aaa``).
    ent_reg = er.async_get(hass)
    aaa_eid = next(
        e.entity_id
        for e in er.async_entries_for_config_entry(ent_reg, fleet.entry_id)
        if (e.unique_id or "").endswith("_part_batt_aaa")
    )
    ent_reg.async_update_entity(aaa_eid, name="Keep me")
    # HA restores a deleted entity's customisations when the same unique_id
    # re-registers, so the tell-tale is the registry REMOVE event itself.
    removed: list[str] = []
    hass.bus.async_listen(
        er.EVENT_ENTITY_REGISTRY_UPDATED,
        lambda ev: removed.append(ev.data["entity_id"]) if ev.data.get("action") == "remove" else None,
    )

    conn = make_ws_connection()
    await call_ws_handler(
        ws_delete_part, hass, conn, {"id": 2, "type": "x", "entry_id": fleet.entry_id, "part_id": "batt_aa"}
    )
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()
    fleet = _fleet_entry(hass)
    assert "batt_aa" not in fleet.data[CONF_PARTS]
    assert fleet.data[CONF_OBJECT]["battery_fleet_removed_parts"] == ["batt_aa"]
    assert ent_reg.async_get(aaa_eid) is not None and ent_reg.async_get(aaa_eid).name == "Keep me"
    assert aaa_eid not in removed, removed

    # Next start: the AA lock is still in the fleet — the part must NOT return.
    result = await reconcile_fleet_parts_at_start(hass, fleet, "en")
    assert result["added"] == []
    assert "batt_aa" not in _fleet_entry(hass).data[CONF_PARTS]

    # A NEW type still gets its part (the tombstone is per id, not a freeze).
    _battery(hass, "clock", "C", 1, low=False)
    result = await reconcile_fleet_parts_at_start(hass, _fleet_entry(hass), "en")
    assert result["added"] == ["batt_c"]

    # Explicit setup = "give me the full set again": tombstone cleared, part back.
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 3, "type": "x"})
    assert conn.send_result.call_args[0][1]["parts_added"] == 1
    fleet = _fleet_entry(hass)
    assert "batt_aa" in fleet.data[CONF_PARTS]
    assert "battery_fleet_removed_parts" not in fleet.data[CONF_OBJECT]
    assert fleet.runtime_data.store.get_part_stock("batt_aa") == 0


async def test_start_reconcile_sweep_tolerates_an_object_slug_containing_part(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Bug review 2026-09-04: the orphan sweep split the stock sensor's
    unique_id at the FIRST ``_part_`` — an object slug that itself contains
    ``_part_`` made every live stock sensor look orphaned, and the sweep
    removed its registry entry on every start."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from homeassistant.helpers import entity_registry as er

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import reconcile_fleet_parts_at_start
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    assert fleet is not None

    ent_reg = er.async_get(hass)
    live = ent_reg.async_get_or_create(
        "sensor", "maintenance_supporter", "maintenance_supporter_spare_part_bin_part_batt_aa", config_entry=fleet
    ).entity_id
    orphan = ent_reg.async_get_or_create(
        "sensor", "maintenance_supporter", "maintenance_supporter_spare_part_bin_part_batt_gone", config_entry=fleet
    ).entity_id

    result = await reconcile_fleet_parts_at_start(hass, fleet, "en")
    assert result["orphans_removed"] == 1
    assert ent_reg.async_get(live) is not None
    assert ent_reg.async_get(orphan) is None


def _touch_name(parts: dict, tasks: dict) -> None:
    parts["batt_unknown"]["name"] = "Mystery cells"


def _touch_notes(parts: dict, tasks: dict) -> None:
    parts["batt_unknown"]["notes"] = "Second drawer, left"


def _touch_cost(parts: dict, tasks: dict) -> None:
    parts["batt_unknown"]["cost"] = 1.5


def _touch_threshold(parts: dict, tasks: dict) -> None:
    parts["batt_unknown"]["reorder_threshold"] = 6


def _touch_doc(parts: dict, tasks: dict) -> None:
    parts["batt_unknown"]["doc_id"] = "doc1"


def _touch_link(parts: dict, tasks: dict) -> None:
    tid = next(iter(tasks))
    tasks[tid] = {**tasks[tid], "consumes_parts": [{"part_id": "batt_unknown", "quantity": 1}]}


@pytest.mark.parametrize(
    "touch", [_touch_name, _touch_notes, _touch_cost, _touch_threshold, _touch_doc, _touch_link],
    ids=["name", "notes", "cost", "threshold", "doc", "task_link"],
)
async def test_start_reconcile_keeps_an_unknown_part_the_user_edited(
    hass: HomeAssistant, global_entry: MockConfigEntry, touch
) -> None:
    """Bug review 2026-09-04: "untouched" meant stock/product data/auto-buy
    only — a renamed, annotated, priced, re-thresholded, document-linked or
    task-consumed UNKNOWN part was still pruned on the next start."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    data = dict(fleet.data)
    parts = {pid: dict(p) for pid, p in data[CONF_PARTS].items()}
    parts["batt_unknown"] = {**parts["batt_aa"], "id": "batt_unknown", "name": "UNKNOWN battery"}
    tasks = dict(data[CONF_TASKS])
    touch(parts, tasks)
    data[CONF_PARTS] = parts
    data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(fleet, data=data)

    await hass.config_entries.async_reload(fleet.entry_id)
    await hass.async_block_till_done()

    assert "batt_unknown" in _fleet_entry(hass).data[CONF_PARTS]


async def test_start_reconcile_still_prunes_the_v238_editorial_notes_shape(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The stricter "untouched" test must not spare the ORIGINAL shape: the
    v2.38 seed carried "(editorial)" in the notes, in English only."""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    data = dict(fleet.data)
    parts = dict(data[CONF_PARTS])
    parts["batt_unknown"] = {
        **parts["batt_aa"],
        "id": "batt_unknown",
        "name": "UNKNOWN battery",
        "notes": "Typical service life ~24 months (editorial).",
    }
    data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(fleet, data=data)

    await hass.config_entries.async_reload(fleet.entry_id)
    await hass.async_block_till_done()

    assert "batt_unknown" not in _fleet_entry(hass).data[CONF_PARTS]


async def test_start_reconcile_added_part_gets_its_stock_sensor_in_the_same_start(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Bug review 2026-09-04: a part the start-up reconcile adds had no
    stock sensor until the NEXT restart — on a real boot ``async_at_started``
    fires AFTER the sensor platform read the parts. The reconcile now
    reloads once. (On a running instance the callback runs during the
    platform setup and hides the gap — hence the staged boot below.)"""
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
    from homeassistant.core import CoreState
    from homeassistant.helpers import entity_registry as er

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    assert fleet is not None

    _battery(hass, "remote", "AAA", 2, low=False)
    # Stage a boot: the entry (and its platforms) set up while HA is still
    # starting, the at-started hooks fire afterwards.
    hass.set_state(CoreState.starting)
    await hass.config_entries.async_reload(fleet.entry_id)
    await hass.async_block_till_done()
    hass.set_state(CoreState.running)
    hass.bus.async_fire(EVENT_HOMEASSISTANT_STARTED)
    await hass.async_block_till_done()

    fleet = _fleet_entry(hass)
    assert "batt_aaa" in fleet.data[CONF_PARTS]
    ent_reg = er.async_get(hass)
    eid = next(
        (e.entity_id for e in er.async_entries_for_config_entry(ent_reg, fleet.entry_id) if (e.unique_id or "").endswith("_part_batt_aaa")),
        None,
    )
    assert eid is not None, "no registry entry for the added part's stock sensor"
    state = hass.states.get(eid)
    assert state is not None and state.state == "0", state


# ─── sensorless notes (discussion #162) ───────────────────────────────────


def _type_note(hass: HomeAssistant, slug: str, btype: str, *, last: str | None = None) -> None:
    hass.states.async_set(
        f"sensor.{slug}_battery_type", f"{btype}\u00d71", {"battery_type": btype, "battery_quantity": 1, "note": ""}
    )
    if last:
        hass.states.async_set(f"sensor.{slug}_battery_last_replaced", last, {"device_class": "timestamp"})


async def test_due_without_sensor_option(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """D#162: the fleet-wide toggle (default ON) decides whether a PASSED
    forecast on a sensorless note is due — low in the overview, counted by
    the fleet sensor — or merely soon (B1)."""
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_set_due_without_sensor,
        ws_battery_fleet_setup,
    )

    await setup_integration(hass, global_entry)
    _type_note(hass, "hall_temp", "CR2032", last="2020-01-01T00:00:00+00:00")
    _battery(hass, "lock", "AA", 4, low=False)

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args

    res = await _overview(hass)
    assert res["due_without_sensor"] is True
    assert [r["entity_id"] for r in res["low"]] == ["sensor.hall_temp_battery_type"]
    assert res["low"][0]["no_sensor"] is True and res["needs_now"] == {"CR2032": 1}
    await hass.async_block_till_done()
    # The summary sensor repaints on Battery Notes events (its real update path).
    hass.bus.async_fire("battery_notes_battery_threshold", {})
    await hass.async_block_till_done()
    summary = next(st for st in hass.states.async_all("sensor") if "batteries_due" in st.attributes)
    assert summary.state == "1", "the fleet sensor counts the due note (task trigger)"
    assert summary.attributes["batteries_due"] == ["Hall Temp — replace (CR2032)"]

    conn2 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_set_due_without_sensor, hass, conn2, {"id": 2, "type": "x", "enabled": False})
    assert not conn2.send_error.called, conn2.send_error.call_args
    res = await _overview(hass)
    assert res["due_without_sensor"] is False
    assert res["low"] == [] and res["needs_now"] == {}
    assert [r["entity_id"] for r in res["soon"]] == ["sensor.hall_temp_battery_type"]
    assert res["soon"][0]["days_until"] == 0 and res["soon"][0]["forecast_overdue"] is True

    conn3 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_set_due_without_sensor, hass, conn3, {"id": 3, "type": "x", "enabled": True})
    res = await _overview(hass)
    assert res["due_without_sensor"] is True and len(res["low"]) == 1


async def test_due_without_sensor_requires_a_fleet(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_set_due_without_sensor,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_set_due_without_sensor, hass, conn, {"id": 1, "type": "x", "enabled": False})
    assert conn.send_error.called
    assert conn.send_error.call_args[0][1] == "not_configured"


async def test_setup_works_with_sensorless_notes_only(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """An install whose every note is sensorless (maisun) must still pass the
    setup gate and seed the type parts from the type sensors."""
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    await setup_integration(hass, global_entry)
    _type_note(hass, "hall_temp", "CR2032")
    _type_note(hass, "door", "CR1632")
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    fleet = _fleet_entry(hass)
    assert fleet is not None
    assert {"batt_cr2032", "batt_cr1632"} <= set(fleet.data[CONF_PARTS])


async def test_mark_replaced_presses_the_type_notes_button(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The row's Replaced action for a sensorless note presses the note's
    button — by naming contract, or through the registry when renamed."""
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import async_mock_service

    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_setup,
    )

    await setup_integration(hass, global_entry)
    _type_note(hass, "hall_temp", "CR2032", last="2020-01-01T00:00:00+00:00")
    hass.states.async_set("button.hall_temp_battery_replaced", "unknown")
    # A renamed note: registry siblings share the unique_id base.
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create("sensor", "battery_notes", "k_battery_type", suggested_object_id="kitchen_cell")
    ent_reg.async_get_or_create("button", "battery_notes", "k_battery_replaced_button", suggested_object_id="kitchen_swap")
    hass.states.async_set("sensor.kitchen_cell", "AAA\u00d71", {"battery_type": "AAA", "battery_quantity": 1})
    hass.states.async_set("button.kitchen_swap", "unknown")

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    calls = async_mock_service(hass, "button", "press")

    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_battery_fleet_mark_replaced,
        hass,
        conn2,
        {"id": 2, "type": "x", "entity_ids": ["sensor.hall_temp_battery_type", "sensor.kitchen_cell"]},
    )
    res = conn2.send_result.call_args[0][1]
    assert res["marked"] == 2 and res["pressed"] == 2
    assert {c.data["entity_id"] for c in calls} == {"button.hall_temp_battery_replaced", "button.kitchen_swap"}
