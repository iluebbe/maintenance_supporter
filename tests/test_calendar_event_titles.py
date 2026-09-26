"""#189: a calendar-driven task names the events behind its next due date.

Waste Collection Schedule puts every bin into ONE calendar and names each
pickup after the bin ("Residual waste", "Paper"). The task keeps its own name
("Bins out") and carries the next pickup's event titles — in the coordinator
payload, the WebSocket summary, the task sensor's attributes, the to-do list,
notifications and our own calendar — so the dashboard says which bin goes out.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.calendar import _task_label
from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN
from custom_components.maintenance_supporter.coordinator import _notify_task_label
from custom_components.maintenance_supporter.helpers.calendar_source import (
    MAX_TITLE_LENGTH,
    MAX_TITLES_PER_DAY,
    next_event_titles,
    titles_from_response,
    with_event_titles,
)
from custom_components.maintenance_supporter.helpers.schedule import KIND_CALENDAR, Schedule
from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask
from custom_components.maintenance_supporter.websocket import _build_task_summary

from .conftest import TASK_ID_1, make_object_entry, setup_integration
from .test_calendar_entity_prefetch import BIO, FakeCalendar, _calendar_task, _iso, global_entry

# ─── pure helpers ────────────────────────────────────────────────────────


def test_titles_are_grouped_per_start_day_deduplicated_and_capped() -> None:
    day = date(2026, 10, 6)
    many = [{"start": day.isoformat(), "summary": f"Bin {i}"} for i in range(MAX_TITLES_PER_DAY + 3)]
    response = {
        BIO: {
            "events": [
                {"start": day.isoformat(), "summary": "  Residual   waste "},
                {"start": day.isoformat(), "summary": "Paper"},
                {"start": day.isoformat(), "summary": "Residual waste"},  # duplicate
                {"start": day.isoformat()},  # no summary: skipped, date still counts elsewhere
                {"start": day.isoformat(), "summary": "   "},
                {"start": "2026-10-20", "summary": "x" * (MAX_TITLE_LENGTH + 20)},
                "garbage",
                *many,
            ]
        }
    }
    titles = titles_from_response(BIO, response)
    assert titles[day][:2] == ("Residual waste", "Paper")
    assert len(titles[day]) == MAX_TITLES_PER_DAY
    assert titles[date(2026, 10, 20)] == ("x" * MAX_TITLE_LENGTH,)
    assert titles_from_response(BIO, {"other": {}}) == {}
    assert titles_from_response(BIO, {BIO: {"events": "nope"}}) == {}


def test_a_timed_event_counts_on_its_local_day() -> None:
    local = dt_util.as_local(datetime(2026, 10, 6, 6, 30, tzinfo=dt_util.DEFAULT_TIME_ZONE))
    titles = titles_from_response(BIO, {BIO: {"events": [{"start": local.isoformat(), "summary": "Paper"}]}})
    assert titles == {local.date(): ("Paper",)}


async def test_next_event_titles_undoes_the_offset_and_ignores_other_kinds(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.calendar_source import CALENDAR_OCCURRENCES_KEY

    pickup = date(2026, 10, 6)
    hass.data.setdefault(DOMAIN, {})[CALENDAR_OCCURRENCES_KEY] = {BIO: {"dates": (pickup,), "titles": {pickup: ("Paper",)}, "fetched": 0.0}}
    day_before = Schedule.from_dict({"kind": KIND_CALENDAR, "entity_id": BIO, "offset": -1})
    assert next_event_titles(hass, day_before, pickup - timedelta(days=1)) == ["Paper"]
    assert next_event_titles(hass, day_before, pickup) == [], "a postponed date is no event date"
    assert next_event_titles(hass, day_before, None) == []
    assert next_event_titles(hass, Schedule.from_dict({"kind": "interval", "every": 7}), pickup) == []
    assert next_event_titles(hass, Schedule.from_dict({"kind": KIND_CALENDAR, "entity_id": "calendar.unknown"}), pickup) == []


def test_with_event_titles_leaves_the_label_alone_without_titles() -> None:
    assert with_event_titles("Bins out", ["Residual waste", "Paper"]) == "Bins out · Residual waste, Paper"
    assert with_event_titles("Bins out", []) == "Bins out"
    assert with_event_titles("Bins out", None) == "Bins out"
    assert with_event_titles("Bins out", ["", ""]) == "Bins out"


def test_mirrored_rows_carry_the_titles_too() -> None:
    """The rows on external to-do lists read like our own list."""
    from custom_components.maintenance_supporter.helpers.todo_mirror import mirror_summary

    assert mirror_summary("Bins", {"name": "Bins out", "_next_event_titles": ["Paper"]}) == "Bins: Bins out · Paper"
    assert mirror_summary("Bins", {"name": "Bins out"}) == "Bins: Bins out"


# ─── end to end ──────────────────────────────────────────────────────────


async def test_every_surface_names_the_next_pickup(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    today = dt_util.now().date()
    nxt, later = today - timedelta(days=2), today + timedelta(days=10)
    cal = FakeCalendar(
        hass,
        {
            BIO: [
                {"start": _iso(nxt), "summary": "Residual waste"},
                {"start": _iso(nxt), "summary": "Paper"},
                {"start": _iso(later), "summary": "Bio"},
            ]
        },
    )
    entry = make_object_entry(hass, tasks={TASK_ID_1: _calendar_task(created_at=_iso(today - timedelta(days=30)))}, name="Bins", uid="cal_titles")
    await setup_integration(hass, global_entry, entry)
    cal.arm()
    coordinator = entry.runtime_data.coordinator
    await coordinator.async_refresh_now()
    await hass.async_block_till_done()

    task = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task["_next_due"] == _iso(nxt)
    assert task["_next_event_titles"] == ["Residual waste", "Paper"]
    # The task's own name is untouched — only the labels carry the titles.
    assert hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][TASK_ID_1]["name"] == "Bins out"

    stored = entry.data[CONF_TASKS][TASK_ID_1]
    assert _build_task_summary(hass, TASK_ID_1, stored, task)["next_event_titles"] == ["Residual waste", "Paper"]
    assert _notify_task_label(task) == "Bins out · Residual waste, Paper"

    sensors = [e.entity_id for e in er.async_entries_for_config_entry(er.async_get(hass), entry.entry_id) if e.domain == "sensor"]
    attrs = [hass.states.get(eid).attributes for eid in sensors if hass.states.get(eid) is not None]
    assert any(a.get("next_event_titles") == ["Residual waste", "Paper"] for a in attrs)

    response: dict[str, Any] = await hass.services.async_call(
        "todo", "get_items", {"entity_id": "todo.maintenance"}, blocking=True, return_response=True
    )
    summaries = [i["summary"] for i in response["todo.maintenance"]["items"]]
    assert "Bins: Bins out · Residual waste, Paper" in summaries

    model = MaintenanceTask.from_dict({**stored, "id": TASK_ID_1})
    assert _task_label(model, hass) == "Bins out · Residual waste, Paper"
    assert _task_label(model) == "Bins out", "without hass the plain label"

    # Completing the (overdue) pickup moves to the next one — and its title.
    await coordinator.complete_maintenance(TASK_ID_1, notes=None, unattended=True)
    await hass.async_block_till_done()
    task = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task["_next_due"] == _iso(later)
    assert task["_next_event_titles"] == ["Bio"]


async def test_a_task_of_another_kind_carries_no_titles(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    entry = make_object_entry(
        hass,
        tasks={TASK_ID_1: {"id": TASK_ID_1, "name": "Filter", "type": "cleaning", "enabled": True, "schedule": {"kind": "interval", "every": 30}, "warning_days": 3, "history": []}},
        uid="interval_titles",
    )
    await setup_integration(hass, global_entry, entry)
    task = entry.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task["_next_event_titles"] == []
    assert _notify_task_label(task) == "Filter"
