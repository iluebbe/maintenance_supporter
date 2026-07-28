"""Postpone and skip by voice.

Both were reachable from every surface except the one you use with your hands
full. Postponing is the interesting one: it defers just THIS occurrence and
leaves the cadence alone, which is a different thing from snoozing (mutes
reminders, schedule untouched) and from completing (records history).

The subtlety worth pinning down is what "by three days" counts from. Counting
from the stored due date is right for a task that is not yet due, and wrong for
one that went overdue last month — three days after a date in the past is
still in the past, so the postpone would achieve nothing.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.intent import (
    INTENT_POSTPONE_TASK,
    INTENT_SKIP_TASK,
    async_setup_intents,
)

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

TASK_ID = "task_1"


@pytest.fixture(autouse=True)
async def _intents_registered(hass: HomeAssistant):
    await async_setup_intents(hass)


async def _setup(hass: HomeAssistant, *, last_performed: str, interval_days: int = 30) -> MockConfigEntry:
    g = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    g.add_to_hass(hass)

    task: dict[str, Any] = build_task_data(interval_days=interval_days, last_performed=last_performed)
    task["name"] = "Oil Change"
    obj = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Car",
        data=build_object_entry_data(
            object_data=build_object_data(name="Car", object_id="car"),
            tasks={TASK_ID: task},
        ),
        source="user", unique_id="maintenance_supporter_car",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, g, obj)
    return obj


async def _ask(hass: HomeAssistant, intent_type: str, slots: dict[str, Any]) -> intent.IntentResponse:
    return await intent.async_handle(
        hass, "test", intent_type, {k: {"value": v} for k, v in slots.items()}
    )


def _speech(response: intent.IntentResponse) -> str:
    return str(response.speech.get("plain", {}).get("speech", ""))


def _stored(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, Any]:
    ce = hass.config_entries.async_get_entry(entry.entry_id)
    rd = getattr(ce, "runtime_data", None)
    return dict(rd.coordinator.data[CONF_TASKS][TASK_ID])


# ─── postpone ─────────────────────────────────────────────────────────────


async def test_postponing_by_days_moves_the_due_date(hass: HomeAssistant) -> None:
    """A task due in the future: counted from its due date."""
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=10)).isoformat())
    before = _stored(hass, entry)["_next_due"][:10]

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "days": 5})

    assert response.error_code is None, _speech(response)
    expected = (date.fromisoformat(before) + timedelta(days=5)).isoformat()
    assert _stored(hass, entry).get("due_override") == expected
    assert expected in _speech(response)


async def test_postponing_an_overdue_task_counts_from_today(hass: HomeAssistant) -> None:
    """The case that makes naive arithmetic useless.

    A task overdue by two months, postponed "by three days", must land three
    days from NOW — not three days after a due date that is long past, which
    would still be in the past and change nothing the user can see.
    """
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=90)).isoformat())
    assert _stored(hass, entry)["_days_until_due"] < 0, "fixture is not overdue"

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "days": 3})

    assert response.error_code is None, _speech(response)
    assert _stored(hass, entry).get("due_override") == (today + timedelta(days=3)).isoformat()


async def test_postponing_to_an_explicit_date(hass: HomeAssistant) -> None:
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=10)).isoformat())
    target = (today + timedelta(days=45)).isoformat()

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "date": target})

    assert response.error_code is None, _speech(response)
    assert _stored(hass, entry).get("due_override") == target


async def test_a_date_in_the_past_is_refused(hass: HomeAssistant) -> None:
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=10)).isoformat())
    past = (today - timedelta(days=1)).isoformat()

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "date": past})

    assert response.error_code is not None
    assert not _stored(hass, entry).get("due_override"), "a past date was stored anyway"


async def test_postponing_without_a_when_asks_for_one(hass: HomeAssistant) -> None:
    """Guessing a duration would silently move somebody's schedule."""
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=10)).isoformat())

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change"})

    assert response.error_code is not None
    assert not _stored(hass, entry).get("due_override")


async def test_an_unparseable_date_does_not_silently_fall_back(hass: HomeAssistant) -> None:
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=10)).isoformat())

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "date": "next tuesday"})

    assert response.error_code is not None
    assert not _stored(hass, entry).get("due_override")


async def test_postponing_leaves_the_cadence_alone(hass: HomeAssistant) -> None:
    """The difference from completing: the interval and the history must be
    untouched — this defers one occurrence, it does not record work."""
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=10)).isoformat(), interval_days=30)
    before = _stored(hass, entry)

    await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "days": 5})
    after = _stored(hass, entry)

    # Whatever the payload calls the cadence, none of it may have moved.
    for key in ("interval", "interval_days", "interval_unit", "schedule_type", "schedule"):
        assert after.get(key) == before.get(key), f"{key} changed"
    assert after.get("last_performed") == before.get("last_performed")
    assert len(after.get("history", [])) == len(before.get("history", []))
    # And the override is the ONLY thing that appeared.
    changed = {k for k in set(before) | set(after) if before.get(k) != after.get(k)}
    assert changed <= {"due_override", "_next_due", "_days_until_due", "_status"}, changed


async def test_postponing_an_unknown_task_changes_nothing(hass: HomeAssistant) -> None:
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=10)).isoformat())

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "no such thing", "days": 5})

    assert response.error_code is not None
    assert not _stored(hass, entry).get("due_override")


# ─── skip ─────────────────────────────────────────────────────────────────


async def test_skipping_moves_to_the_next_cycle(hass: HomeAssistant) -> None:
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=40)).isoformat())
    before = _stored(hass, entry)["_next_due"][:10]

    response = await _ask(hass, INTENT_SKIP_TASK, {"name": "oil change"})

    assert response.error_code is None, _speech(response)
    after = _stored(hass, entry)["_next_due"][:10]
    assert after > before, f"the due date did not move ({before} -> {after})"


async def test_skipping_does_not_record_a_completion(hass: HomeAssistant) -> None:
    """A skip is explicitly not work done; counting it would inflate every
    statistic the integration reports."""
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=40)).isoformat())
    before = _stored(hass, entry)

    await _ask(hass, INTENT_SKIP_TASK, {"name": "oil change"})
    after = _stored(hass, entry)

    completions = [h for h in after.get("history", []) if h.get("action") == "completed"]
    assert len(completions) == len(
        [h for h in before.get("history", []) if h.get("action") == "completed"]
    )
    assert after.get("times_performed", 0) == before.get("times_performed", 0)


async def test_the_answer_names_the_new_due_date(hass: HomeAssistant) -> None:
    """Acknowledging the command is not the same as saying what happened."""
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=40)).isoformat())

    response = await _ask(hass, INTENT_SKIP_TASK, {"name": "oil change"})

    assert _stored(hass, entry)["_next_due"][:10] in _speech(response)


async def test_skipping_an_unknown_task_changes_nothing(hass: HomeAssistant) -> None:
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=40)).isoformat())
    before = _stored(hass, entry)["_next_due"][:10]

    response = await _ask(hass, INTENT_SKIP_TASK, {"name": "nothing like this"})

    assert response.error_code is not None
    assert _stored(hass, entry)["_next_due"][:10] == before


async def test_the_object_name_disambiguates_as_everywhere_else(hass: HomeAssistant) -> None:
    """The shared matcher applies here too: "oil change on the car" works."""
    today = dt_util.now().date()
    entry = await _setup(hass, last_performed=(today - timedelta(days=10)).isoformat())

    response = await _ask(
        hass, INTENT_POSTPONE_TASK, {"name": "oil change car", "days": 2}
    )

    assert response.error_code is None, _speech(response)
    assert _stored(hass, entry).get("due_override")
