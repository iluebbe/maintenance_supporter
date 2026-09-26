"""Assist intents — the edge paths the happy-path suites leave out.

Covers what a voice answer must do when the world is not tidy: archived tasks
and unloaded objects stay out of the spoken snapshot, a task whose object went
away between matching and acting yields an honest failure (not a crash), the
satellite's own area override decides the room, and an inert (paused) task
cannot be postponed or skipped by voice.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import patch

import pytest
from homeassistant.config_entries import ConfigEntryDisabler
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import intent as intent_mod
from custom_components.maintenance_supporter.const import (
    CONF_SNOOZE_DURATION_HOURS,
    CONF_TASKS,
    DOMAIN,
)
from custom_components.maintenance_supporter.intent import (
    INTENT_COMPLETE_TASK,
    INTENT_LIST_TASKS,
    INTENT_PART_STOCK,
    INTENT_POSTPONE_TASK,
    INTENT_SKIP_TASK,
    INTENT_SNOOZE_TASK,
    INTENT_TASK_DUE,
    INTENT_TASK_INSTRUCTIONS,
    _describe,
    _match_tasks,
    _task_snapshot,
    async_setup_intents,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    setup_integration,
)


@pytest.fixture(autouse=True)
async def _intents_registered(hass: HomeAssistant) -> None:
    await async_setup_intents(hass)


def _overdue(name: str, task_id: str = TASK_ID_1) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    return build_task_data(task_id=task_id, name=name, last_performed=last, interval_days=30)


def _fresh(name: str, task_id: str = TASK_ID_1) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=5)).isoformat()
    return build_task_data(task_id=task_id, name=name, last_performed=last, interval_days=30)


async def _ask(
    hass: HomeAssistant,
    intent_type: str,
    slots: dict[str, Any] | None = None,
    **kwargs: Any,
) -> intent.IntentResponse:
    return await intent.async_handle(
        hass,
        "test",
        intent_type,
        {k: {"value": v} for k, v in (slots or {}).items()},
        language="en",
        **kwargs,
    )


def _speech(response: intent.IntentResponse) -> str:
    return str(response.speech.get("plain", {}).get("speech", ""))


# ─── the spoken snapshot ─────────────────────────────────────────────────


async def test_archived_tasks_and_unloaded_objects_are_not_spoken(hass: HomeAssistant) -> None:
    """An archived task is retired, and a disabled object has no coordinator —
    neither may appear in "what maintenance is due?"."""
    g = make_global_entry(hass)
    archived = _overdue("Retired Pump Check", TASK_ID_2)
    archived["archived_at"] = dt_util.now().isoformat()
    live = make_object_entry(
        hass,
        tasks={TASK_ID_1: _overdue("Filter Cleaning"), TASK_ID_2: archived},
        name="Pool Pump",
        uid="edge_live",
    )
    disabled = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Old Boiler",
        data=build_object_entry_data(
            object_data=build_object_data(name="Old Boiler", object_id="boiler_off"),
            tasks={"t_boiler": _overdue("Boiler Service", "t_boiler")},
        ),
        source="user",
        unique_id="maintenance_supporter_edge_disabled",
        disabled_by=ConfigEntryDisabler.USER,
    )
    disabled.add_to_hass(hass)
    await setup_integration(hass, g, live)

    rows = _task_snapshot(hass)
    names = {r["name"] for r in rows}
    assert names == {"Filter Cleaning"}

    speech = _speech(await _ask(hass, INTENT_LIST_TASKS))
    assert "Filter Cleaning" in speech
    assert "Retired Pump Check" not in speech
    assert "Boiler Service" not in speech


def test_single_letter_queries_do_not_fuzzy_match_everything() -> None:
    """Tokens shorter than two characters are ignored; a query made only of
    them must not degrade into "match every task"."""
    snap = [
        {"name": "Oil Change", "object_name": "Car"},
        {"name": "Tyre Check", "object_name": "Car"},
    ]
    assert _match_tasks("a b", snap) == []
    # ...but an exact single-letter task name still wins.
    snap.append({"name": "X", "object_name": "Lab"})
    assert _match_tasks("x", snap) == [snap[2]]


def test_describe_triggered_and_undated_tasks() -> None:
    """A sensor-triggered task is spoken as such; a task with no due day at all
    falls back to its raw status instead of inventing a number."""
    triggered = {"name": "Filter", "object_name": "Pool", "status": "triggered", "days_until_due": 12}
    assert _describe(triggered, "en") == "Filter on Pool (triggered)"

    undated = {"name": "Filter", "object_name": "Pool", "status": "ok", "days_until_due": None}
    assert _describe(undated, "en") == "Filter on Pool (ok)"


async def test_the_satellite_entitys_own_area_wins(hass: HomeAssistant) -> None:
    """A satellite entity moved into a room (entity-level area override,
    no device at all) answers 'here' for that room."""
    g = make_global_entry(hass)
    kitchen = ar.async_get(hass).async_get_or_create("Kitchen")
    cellar = ar.async_get(hass).async_get_or_create("Cellar")
    obj_k = build_object_data(name="Coffee Machine", object_id="coffee")
    obj_k["area_id"] = kitchen.id
    obj_c = build_object_data(name="Boiler", object_id="boiler")
    obj_c["area_id"] = cellar.id
    e_k = make_object_entry(hass, tasks={TASK_ID_1: _overdue("Descale")}, name="Coffee Machine", uid="k", object_data=obj_k)
    e_c = make_object_entry(hass, tasks={TASK_ID_2: _overdue("Service", TASK_ID_2)}, name="Boiler", uid="c", object_data=obj_c)
    await setup_integration(hass, g, e_k, e_c)

    ent_reg = er.async_get(hass)
    sat = ent_reg.async_get_or_create("assist_satellite", "mock_satellite", "sat_no_device")
    ent_reg.async_update_entity(sat.entity_id, area_id=cellar.id)

    speech = _speech(await _ask(hass, INTENT_LIST_TASKS, {"scope": "here"}, satellite_id=sat.entity_id))
    assert "Service" in speech
    assert "Descale" not in speech


# ─── not found, for every name-taking intent ──────────────────────────────


@pytest.mark.parametrize(
    "intent_type",
    [INTENT_TASK_INSTRUCTIONS, INTENT_TASK_DUE, INTENT_SNOOZE_TASK, INTENT_POSTPONE_TASK, INTENT_SKIP_TASK],
)
async def test_an_unknown_name_is_refused_by_every_intent(hass: HomeAssistant, intent_type: str) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _fresh("Oil Change")}, name="Car", uid="nf")
    await setup_integration(hass, g, obj)
    before = get_task_store_state(hass, obj.entry_id, TASK_ID_1)

    slots: dict[str, Any] = {"name": "warp core alignment"}
    if intent_type == INTENT_POSTPONE_TASK:
        slots["days"] = 3
    response = await _ask(hass, intent_type, slots)

    assert response.error_code == intent.IntentResponseErrorCode.NO_VALID_TARGETS
    assert "warp core alignment" in _speech(response)
    assert get_task_store_state(hass, obj.entry_id, TASK_ID_1) == before


# ─── the object vanished between matching and acting ──────────────────────


def _stale_row(**over: Any) -> dict[str, Any]:
    row = {
        "entry_id": "entry_that_was_removed",
        "task_id": TASK_ID_1,
        "object_name": "Car",
        "area_id": None,
        "name": "Oil Change",
        "responsible_user_id": None,
        "status": "overdue",
        "days_until_due": -3,
        "next_due": None,
        "phase": None,
        "priority": "normal",
    }
    row.update(over)
    return row


@pytest.mark.parametrize(
    ("intent_type", "slots"),
    [
        (INTENT_COMPLETE_TASK, {"name": "oil change"}),
        (INTENT_POSTPONE_TASK, {"name": "oil change", "days": 2}),
        (INTENT_SKIP_TASK, {"name": "oil change"}),
    ],
)
async def test_an_object_removed_mid_request_fails_cleanly(hass: HomeAssistant, intent_type: str, slots: dict[str, Any]) -> None:
    """The snapshot matched a task, but its entry is gone by the time the
    action runs — the answer is a spoken failure, never an AttributeError."""
    with patch.object(intent_mod, "_task_snapshot", return_value=[_stale_row()]):
        response = await _ask(hass, intent_type, slots)

    assert response.error_code == intent.IntentResponseErrorCode.FAILED_TO_HANDLE
    assert "oil change" in _speech(response)


async def test_postpone_by_days_survives_a_malformed_due_date(hass: HomeAssistant) -> None:
    """A garbage next_due in the snapshot must not abort the postpone; it
    counts from today instead."""
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _fresh("Oil Change")}, name="Car", uid="pp_bad")
    await setup_integration(hass, g, obj)
    row = _stale_row(entry_id=obj.entry_id, next_due="not-a-date", days_until_due=25)

    with patch.object(intent_mod, "_task_snapshot", return_value=[row]):
        response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "days": 4})

    assert response.error_code is None, _speech(response)
    expected = (dt_util.now().date() + timedelta(days=4)).isoformat()
    assert obj.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1].get("due_override") == expected
    assert expected in _speech(response)


# ─── inert tasks refuse lifecycle actions by voice ────────────────────────


async def _paused_object(hass: HomeAssistant, uid: str) -> MockConfigEntry:
    g = make_global_entry(hass)
    od = build_object_data(name="Lawn Mower", object_id=f"mower_{uid}")
    od["paused_at"] = dt_util.now().isoformat()
    obj = make_object_entry(hass, tasks={TASK_ID_1: _fresh("Blade Sharpening")}, name="Lawn Mower", uid=uid, object_data=od)
    await setup_integration(hass, g, obj)
    return obj


async def test_postponing_a_paused_objects_task_is_refused(hass: HomeAssistant) -> None:
    obj = await _paused_object(hass, "pp_paused")
    future = (dt_util.now().date() + timedelta(days=40)).isoformat()

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "blade sharpening", "date": future})

    assert response.error_code == intent.IntentResponseErrorCode.FAILED_TO_HANDLE
    assert get_task_store_state(hass, obj.entry_id, TASK_ID_1).get("due_override") is None
    assert obj.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1].get("due_override") is None


async def test_skip_lock_is_spoken_not_raised(hass: HomeAssistant) -> None:
    """#150: a task with skipping turned off answers "skipping is turned off"
    and leaves the history untouched."""
    g = make_global_entry(hass)
    task = _overdue("Smoke Alarm Test")
    task["allow_skip"] = False
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Hallway", uid="skip_lock")
    await setup_integration(hass, g, obj)

    response = await _ask(hass, INTENT_SKIP_TASK, {"name": "smoke alarm test"})

    assert response.error_code is None
    assert _speech(response) == "Skipping is turned off for 'Smoke Alarm Test'."
    history = get_task_store_state(hass, obj.entry_id, TASK_ID_1).get("history", [])
    assert not [h for h in history if h.get("type") == "skipped"]


# ─── instructions: only what belongs to THIS task ─────────────────────────


async def test_instructions_ignore_other_tasks_documents_and_ghost_parts(hass: HomeAssistant) -> None:
    """A manual linked to a sibling task, and a consumes_parts link to a part
    that no longer exists, are not guidance for this task."""
    from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY

    g = make_global_entry(hass)
    lonely = _fresh("Belt Change")
    lonely["consumes_parts"] = [{"part_id": "deleted_part", "quantity": 2}]
    sibling = _fresh("Drum Clean", TASK_ID_2)
    obj = make_object_entry(hass, tasks={TASK_ID_1: lonely, TASK_ID_2: sibling}, name="Dryer", uid="guide_ghost")
    await setup_integration(hass, g, obj)

    doc_store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc = await doc_store.async_add_weblink(obj.data["object"]["id"], url="https://x/drum", title="Drum manual")
    await doc_store.async_update(doc["id"], task_ids=[TASK_ID_2])

    speech = _speech(await _ask(hass, INTENT_TASK_INSTRUCTIONS, {"name": "belt change"}))
    assert speech.startswith("There are no stored instructions")
    assert "Drum manual" not in speech

    sibling_speech = _speech(await _ask(hass, INTENT_TASK_INSTRUCTIONS, {"name": "drum clean"}))
    assert "linked document 'Drum manual'" in sibling_speech


# ─── snooze + stock wording ───────────────────────────────────────────────


async def test_snooze_speaks_whole_hours_without_a_decimal(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, options={CONF_SNOOZE_DURATION_HOURS: 6.0})
    obj = make_object_entry(hass, tasks={TASK_ID_1: _overdue("Oil Change")}, name="Car", uid="snooze_float")
    await setup_integration(hass, g, obj)

    response = await _ask(hass, INTENT_SNOOZE_TASK, {"name": "oil change"})

    assert _speech(response) == "Snoozed reminders for 'Oil Change' on Car for 6 hours."


async def test_a_malformed_part_record_is_skipped_by_the_stock_lookup(hass: HomeAssistant) -> None:
    """The part snapshot reads entry data directly (no runtime needed): a
    non-dict part record is skipped, and without a store stock is unknown —
    spoken as "not tracked", never as zero."""
    make_global_entry(hass)
    make_object_entry(
        hass,
        tasks={TASK_ID_1: _fresh("Service")},
        name="Softener",
        uid="stock_bad",
        extra_data={"parts": {"p_bad": "not-a-part", "p1": {"id": "p1", "name": "Salt bag"}}},
    )

    rows = intent_mod._part_snapshot(hass)
    assert [(r["name"], r["object_name"], r["stock"]) for r in rows] == [("Salt bag", "Softener", None)]
    response = await _ask(hass, INTENT_PART_STOCK, {"name": "salt"})
    assert response.error_code is None
    assert _speech(response) == "Stock isn't tracked for Salt bag."
