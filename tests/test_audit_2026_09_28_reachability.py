"""Regression tests for the reachability audit of 2026-09-28 — features the
docs promised that did not work the way they said (the #192 pattern).

One test (or a small group) per finding; the docstrings name the failure.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.core import Event, HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    ScheduleType,
)

from .conftest import build_object_data, build_task_data, make_global_entry, make_object_entry, setup_integration

TASK = "task_1"


async def _setup(hass: HomeAssistant, tasks: dict[str, dict[str, Any]]) -> MockConfigEntry:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks=tasks, name="Boiler", uid="reach", object_data=build_object_data(name="Boiler", object_id="reach"))
    await setup_integration(hass, g, obj)
    return obj


def _capture(hass: HomeAssistant, event_type: str) -> list[Event]:
    events: list[Event] = []
    hass.bus.async_listen(event_type, events.append)
    return events


def _task(trigger_config: dict[str, Any]) -> dict[str, Any]:
    return build_task_data(
        task_id=TASK, name="Filter", schedule_type=ScheduleType.SENSOR_BASED, interval_days=None, trigger_config=trigger_config
    )


async def test_trigger_events_carry_the_task_ids(hass: HomeAssistant) -> None:
    """EXAMPLES.md tells automations to deep-link with `trigger.event.data`
    ids, but `_trigger_activated` / `_deactivated` carried only the sensor
    entity — the link came out as `?entry_id=&task_id=`."""
    hass.states.async_set("sensor.pressure", "10")
    on, off = _capture(hass, EVENT_TRIGGER_ACTIVATED), _capture(hass, EVENT_TRIGGER_DEACTIVATED)
    entry = await _setup(hass, {TASK: _task({"type": "threshold", "entity_id": "sensor.pressure", "trigger_above": 30})})

    hass.states.async_set("sensor.pressure", "45")
    await hass.async_block_till_done()
    hass.states.async_set("sensor.pressure", "10")
    await hass.async_block_till_done()

    assert [(e.data["entry_id"], e.data["task_id"]) for e in on] == [(entry.entry_id, TASK)]
    assert [(e.data["entry_id"], e.data["task_id"]) for e in off] == [(entry.entry_id, TASK)]


async def test_compound_trigger_events_carry_the_task_ids(hass: HomeAssistant) -> None:
    """The compound trigger fires its own copies of the events — same gap."""
    hass.states.async_set("sensor.a", "10")
    hass.states.async_set("sensor.b", "10")
    on = _capture(hass, EVENT_TRIGGER_ACTIVATED)
    entry = await _setup(
        hass,
        {
            TASK: _task(
                {
                    "type": "compound",
                    "entity_id": "sensor.a",
                    "compound_logic": "OR",
                    "conditions": [
                        {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 30},
                        {"type": "threshold", "entity_id": "sensor.b", "trigger_above": 30},
                    ],
                }
            )
        },
    )
    hass.states.async_set("sensor.b", "45")
    await hass.async_block_till_done()

    # Its conditions fire their own (threshold) events too; all carry the ids.
    compound = [e for e in on if e.data["trigger_type"] == "compound"]
    assert compound, "the compound trigger did not fire"
    assert {(e.data["entry_id"], e.data["task_id"]) for e in on} == {(entry.entry_id, TASK)}


async def test_the_reset_event_carries_the_date_the_logbook_reads(hass: HomeAssistant) -> None:
    """The reset event sent only `reset_date`; the logbook (and the docs) read
    `date`, so every reset showed as "was reset to ?" since 2.19. The logbook
    test fed a hand-built payload — this one sends the real event through."""
    from datetime import date

    from custom_components.maintenance_supporter.const import EVENT_TASK_RESET
    from custom_components.maintenance_supporter.logbook import async_describe_events

    resets = _capture(hass, EVENT_TASK_RESET)
    entry = await _setup(hass, {TASK: build_task_data(task_id=TASK, name="Descale")})
    coordinator = hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator
    await coordinator.reset_maintenance(TASK, date(2026, 7, 1))
    await hass.async_block_till_done()

    assert len(resets) == 1
    data = resets[0].data
    assert str(data["date"]) == "2026-07-01" and data["reset_date"] == data["date"]

    describers: dict[str, Any] = {}
    async_describe_events(hass, lambda _domain, event_type, fn: describers.__setitem__(event_type, fn))
    assert describers[EVENT_TASK_RESET](resets[0])["message"] == "was reset to 2026-07-01"


# ─── Configure dialog: emptied fields clear (audit 2026-09-29) ───────────────
#
# HA's frontend leaves an emptied field OUT of the submission. A schema entry
# with `default=<stored>` then put the old value back, so these fields could
# never be removed in the Configure dialog. The earlier tests submitted ""
# explicitly — a path the real frontend never takes; these omit the key.


async def _options_step(hass: HomeAssistant, entry_id: str, step: str) -> dict[str, Any]:
    result = await hass.config_entries.options.async_init(entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"selected_task": TASK, "go_back": False})
    return await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": step})


async def _setup_for_options(hass: HomeAssistant, task: dict[str, Any]) -> MockConfigEntry:
    from custom_components.maintenance_supporter.const import (
        CONF_ADVANCED_ADAPTIVE,
        CONF_ADVANCED_CHECKLISTS,
        CONF_ADVANCED_SCHEDULE_TIME,
    )

    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK: task}, name="Boiler", uid="clear", object_data=build_object_data(name="Boiler", object_id="clear"))
    await setup_integration(hass, g, obj)
    # setup rewrites the advanced flags, so unlock the steps after it
    hass.config_entries.async_update_entry(
        g, options={**g.options, CONF_ADVANCED_CHECKLISTS: True, CONF_ADVANCED_ADAPTIVE: True, CONF_ADVANCED_SCHEDULE_TIME: True}
    )
    return obj


def _stored(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, Any]:
    from custom_components.maintenance_supporter.const import CONF_TASKS

    return dict(hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][TASK])


async def test_edit_task_clears_emptied_fields(hass: HomeAssistant) -> None:
    """Completion window, time of day, reading slots and the series end."""
    task = build_task_data(task_id=TASK, name="Meters", task_type="reading", schedule_time="08:00")
    task.update(
        earliest_completion_days=3,
        readings=[{"id": "r1", "name": "Water", "unit": "m³"}],
        schedule={**(task.get("schedule") or {"kind": "interval", "every": 30, "unit": "days"}), "ends": {"count": 5}},
    )
    entry = await _setup_for_options(hass, task)
    result = await _options_step(hass, entry.entry_id, "edit_task")
    assert result["step_id"] == "edit_task"
    # the stored values are offered as SUGGESTED values, not defaults
    markers = {str(m.schema): m for m in result["data_schema"].schema}
    for key in ("earliest_completion_days", "schedule_time", "readings_text", "ends_count"):
        assert markers[key].default is vol.UNDEFINED, key
        assert markers[key].description and "suggested_value" in markers[key].description, key

    # what the frontend sends once the four fields are emptied: nothing for them
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"name": "Meters", "type": "reading", "interval_days": 30, "warning_days": 7, "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU
    stored = _stored(hass, entry)
    assert "earliest_completion_days" not in stored
    assert "schedule_time" not in stored
    assert "readings" not in stored
    assert "ends" not in (stored.get("schedule") or {})


async def test_edit_task_keeps_values_the_frontend_resubmits(hass: HomeAssistant) -> None:
    """The other half of the contract: an untouched field arrives with its
    suggested value and stays."""
    task = build_task_data(task_id=TASK, name="Meters", task_type="reading", schedule_time="08:00")
    task.update(earliest_completion_days=3, readings=[{"id": "r1", "name": "Water", "unit": "m³"}])
    entry = await _setup_for_options(hass, task)
    result = await _options_step(hass, entry.entry_id, "edit_task")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Meters", "type": "reading", "interval_days": 30, "warning_days": 7,
            "earliest_completion_days": 3, "schedule_time": "08:00:00", "readings_text": "Water | m³", "go_back": False,
        },
    )
    assert result["type"] == FlowResultType.MENU
    stored = _stored(hass, entry)
    assert stored["earliest_completion_days"] == 3
    assert stored["schedule_time"] == "08:00"
    assert [r["id"] for r in stored["readings"]] == ["r1"]


async def test_checklist_and_phases_clear_when_emptied(hass: HomeAssistant) -> None:
    task = build_task_data(task_id=TASK, name="Blades")
    task.update(
        checklist=["Flip the blade", "Tighten the bolt"],
        phases={"flip": {"name": "Flip"}, "replace": {"name": "Replace"}},
        phase_sequence=["flip", "replace"],
    )
    entry = await _setup_for_options(hass, task)

    result = await _options_step(hass, entry.entry_id, "edit_checklist")
    marker = next(m for m in result["data_schema"].schema if str(m.schema) == "checklist_text")
    assert marker.default is vol.UNDEFINED
    await hass.config_entries.options.async_configure(result["flow_id"], {"go_back": False})
    assert not _stored(hass, entry).get("checklist")

    result = await _options_step(hass, entry.entry_id, "edit_phases")
    marker = next(m for m in result["data_schema"].schema if str(m.schema) == "phases_text")
    assert marker.default is vol.UNDEFINED
    await hass.config_entries.options.async_configure(result["flow_id"], {"go_back": False})
    stored = _stored(hass, entry)
    assert not stored.get("phases") and not stored.get("phase_sequence")


async def test_the_environmental_sensor_is_a_suggested_value(hass: HomeAssistant) -> None:
    """The adaptive step's environmental sensor: its handler already reads
    absence as "no sensor" — the default put the stored one back."""
    task = build_task_data(task_id=TASK, name="Filter")
    task["adaptive_config"] = {"enabled": True, "environmental_entity": "sensor.outdoor_temp"}
    entry = await _setup_for_options(hass, task)
    result = await _options_step(hass, entry.entry_id, "adaptive_scheduling")
    marker = next(m for m in result["data_schema"].schema if str(m.schema) == "environmental_entity")
    assert marker.default is vol.UNDEFINED
    assert marker.description == {"suggested_value": "sensor.outdoor_temp"}


def test_no_mwc_icon_button_in_the_frontend() -> None:
    """`<mwc-icon-button>` is not defined on HA 2026.x: it rendered as a bare
    18 px icon with no button role and no keyboard focus — the card's add and
    complete icons, the icon-style row actions, the object QR and the group
    edit/delete among them (audit 2026-09-29). Use `<ha-icon-button>`."""
    from pathlib import Path

    src = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter" / "frontend-src"
    offenders = [
        str(p.relative_to(src))
        for p in src.rglob("*.ts")
        if "__tests__" not in p.parts
        and "node_modules" not in p.parts
        and not p.name.startswith("ds-")
        and "<mwc-icon-button" in p.read_text(encoding="utf-8")
    ]
    assert not offenders, f"undefined <mwc-icon-button> in: {offenders}"


# --- package C1 (2026-09-29): the task services -----------------------------


async def _service(hass: HomeAssistant, service: str, **data: Any) -> Any:
    from custom_components.maintenance_supporter.const import DOMAIN

    return await hass.services.async_call(DOMAIN, service, data, blocking=True)


async def test_update_task_switches_an_interval_task_to_manual(hass: HomeAssistant) -> None:
    """`schedule_type: manual` was accepted and changed nothing: the stored
    interval rode into the flat overlay and rebuilt the interval."""
    entry = await _setup(hass, {TASK: build_task_data(task_id=TASK, name="Descale", interval_days=30)})
    await _service(hass, "update_task", entry_id=entry.entry_id, task_id=TASK, schedule_type="manual")
    assert _stored(hass, entry)["schedule"] == {"kind": "manual"}


async def test_update_task_switches_to_one_time_and_needs_the_date(hass: HomeAssistant) -> None:
    from homeassistant.exceptions import ServiceValidationError

    entry = await _setup(hass, {TASK: build_task_data(task_id=TASK, name="Descale", interval_days=30)})
    try:
        await _service(hass, "update_task", entry_id=entry.entry_id, task_id=TASK, schedule_type="one_time")
    except ServiceValidationError as err:
        assert "due_date" in str(err.translation_placeholders)
    else:
        raise AssertionError("a one-time switch without a date must be refused")
    assert _stored(hass, entry)["schedule"]["kind"] == "interval", "a refused call changes nothing"

    await _service(hass, "update_task", entry_id=entry.entry_id, task_id=TASK, schedule_type="one_time", due_date="2026-12-01")
    schedule = _stored(hass, entry)["schedule"]
    assert (schedule["kind"], schedule["due_date"]) == ("one_time", "2026-12-01")

    # Echoing the kind the task already has keeps its date.
    await _service(hass, "update_task", entry_id=entry.entry_id, task_id=TASK, schedule_type="one_time", name="Descale once")
    assert _stored(hass, entry)["schedule"]["due_date"] == "2026-12-01"


async def test_an_interval_edit_keeps_its_unit(hass: HomeAssistant) -> None:
    """The switch rule only fires on a change of kind — `time_based` with a new
    interval still keeps the stored unit (the #58 class)."""
    task = build_task_data(task_id=TASK, name="Descale", interval_days=3)
    task["interval_unit"] = "months"
    entry = await _setup(hass, {TASK: task})
    await _service(hass, "update_task", entry_id=entry.entry_id, task_id=TASK, schedule_type="time_based", interval_days=6)
    schedule = _stored(hass, entry)["schedule"]
    assert (schedule["kind"], schedule["every"], schedule["unit"]) == ("interval", 6, "months")


async def test_the_services_refuse_a_sensor_task_they_cannot_build(hass: HomeAssistant) -> None:
    """`sensor_based` was offered, but a service cannot set the trigger — the
    task silently became an interval or manual task."""
    entry = await _setup(hass, {TASK: build_task_data(task_id=TASK, name="Descale", interval_days=30)})
    for service, data in (
        ("add_task", {"entry_id": entry.entry_id, "name": "Salt", "schedule_type": "sensor_based"}),
        ("update_task", {"entry_id": entry.entry_id, "task_id": TASK, "schedule_type": "sensor_based"}),
    ):
        try:
            await _service(hass, service, **data)
        except vol.Invalid:
            continue
        raise AssertionError(f"{service} accepted sensor_based")


async def test_add_task_one_time_needs_its_date(hass: HomeAssistant) -> None:
    from homeassistant.exceptions import ServiceValidationError

    entry = await _setup(hass, {TASK: build_task_data(task_id=TASK, name="Descale", interval_days=30)})
    try:
        await _service(hass, "add_task", entry_id=entry.entry_id, name="Chimney", schedule_type="one_time")
    except ServiceValidationError:
        return
    raise AssertionError("a one-time task without a date must be refused")


async def test_list_tasks_filters_paused_tasks(hass: HomeAssistant) -> None:
    """Tasks of a paused object read `paused`, but the status filter refused it."""
    from custom_components.maintenance_supporter.const import DOMAIN

    od = build_object_data(name="Boiler", object_id="reach")
    od["paused_at"] = "2026-08-01T10:00:00+00:00"
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK: build_task_data(task_id=TASK, name="Descale", interval_days=30)}, name="Boiler", uid="reach", object_data=od)
    await setup_integration(hass, g, obj)
    result = await hass.services.async_call(DOMAIN, "list_tasks", {"status": "paused"}, blocking=True, return_response=True)
    assert [t["task_id"] for t in result["tasks"]] == [TASK]
