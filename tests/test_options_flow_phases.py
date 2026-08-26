"""Options-flow minimal phase editor (#139) + its text format.

The flow's edit_phases step is a single textarea: one line per sequence
step, "Name: item; item" sets a phase's checklist. Pins:
- serializer/parser round-trip, id stability via case-insensitive name match
- panel-only per-phase overrides (parts / required fields) SURVIVE a flow edit
- the flow step hydrates, saves through _apply_phase_fields, and clamps or
  clears the Store cursor exactly like ws_update_task
"""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_PARTS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.phases import (
    parse_phases_text,
    phases_to_text,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

PHASES = {
    "flip": {"name": "Flip blades", "checklist": ["Loosen", "Flip"]},
    "replace": {
        "name": "Replace blades",
        "consumes_parts": [{"part_id": "p_1", "quantity": 2}],
        "required_completion_fields": ["cost"],
    },
}
SEQUENCE = ["flip", "flip", "replace"]


# ─── text format ─────────────────────────────────────────────────────────


def test_serializer_one_line_per_step_checklist_on_first_mention() -> None:
    text = phases_to_text(PHASES, SEQUENCE)
    assert text.splitlines() == [
        "Flip blades: Loosen; Flip",
        "Flip blades",
        "Replace blades",
    ]


def test_parser_round_trips_and_keeps_existing_ids() -> None:
    text = phases_to_text(PHASES, SEQUENCE)
    defs, seq = parse_phases_text(text, PHASES)
    assert seq == SEQUENCE  # ids matched by name, not re-slugged
    assert defs["flip"]["checklist"] == ["Loosen", "Flip"]
    # panel-only overrides survive the flow edit untouched
    assert defs["replace"]["consumes_parts"] == [{"part_id": "p_1", "quantity": 2}]
    assert defs["replace"]["required_completion_fields"] == ["cost"]


def test_parser_name_match_is_case_insensitive() -> None:
    defs, seq = parse_phases_text("FLIP BLADES\nreplace blades", PHASES)
    assert seq == ["flip", "replace"]
    assert defs["flip"]["name"] == "FLIP BLADES"  # display name follows the edit


def test_parser_new_names_get_slug_ids() -> None:
    defs, seq = parse_phases_text("Small service\nSmall service\nBig service: drain oil; new filter", {})
    assert seq == ["small-service", "small-service", "big-service"]
    assert defs["big-service"]["checklist"] == ["drain oil", "new filter"]
    assert "checklist" not in defs["small-service"]


def test_parser_empty_text_clears() -> None:
    assert parse_phases_text("", PHASES) == ({}, [])
    assert parse_phases_text("   \n  \n", PHASES) == ({}, [])


def test_parser_first_checklist_line_wins() -> None:
    defs, _ = parse_phases_text("Flip: a; b\nFlip: c", {})
    assert defs["flip"]["checklist"] == ["a", "b"]


# ─── flow step ───────────────────────────────────────────────────────────


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    last_performed = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(last_performed=last_performed)
    task["phases"] = {pid: dict(d) for pid, d in PHASES.items()}
    # The fixture references part p_1 — it must exist or _apply_phase_fields
    # drops the link on save.
    task["phases"]["replace"]["consumes_parts"] = [{"part_id": "p_1", "quantity": 2}]
    task["phase_sequence"] = list(SEQUENCE)
    data = build_object_entry_data(tasks={TASK_ID_1: task})
    data[CONF_PARTS] = {"p_1": {"id": "p_1", "name": "Blade set"}}
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Mower",
        data=data,
        source="user", unique_id="maintenance_supporter_phases_flow",
    )
    entry.add_to_hass(hass)
    return entry


async def _open_edit_phases(hass: HomeAssistant, object_entry: MockConfigEntry):
    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"}
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], user_input={"selected_task": TASK_ID_1, "go_back": False}
    )
    return await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_phases"}
    )


async def test_edit_phases_form_hydrates_current_cycle(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    result = await _open_edit_phases(hass, object_entry)
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "edit_phases"
    default = result["data_schema"]({})["phases_text"]
    assert default.splitlines() == [
        "Flip blades: Loosen; Flip",
        "Flip blades",
        "Replace blades",
    ]


async def test_edit_phases_submit_saves_and_preserves_overrides(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = object_entry.runtime_data.store
    store.set_phase_cursor(TASK_ID_1, 2)

    result = await _open_edit_phases(hass, object_entry)
    # Drop the second "Flip blades" step: 3 steps -> 2, cursor 2 must clamp.
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"phases_text": "Flip blades: Loosen; Flip\nReplace blades", "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    task = entry.data[CONF_TASKS][TASK_ID_1]
    assert task["phase_sequence"] == ["flip", "replace"]
    assert task["phases"]["flip"]["checklist"] == ["Loosen", "Flip"]
    # panel-only overrides survived the flow edit
    assert task["phases"]["replace"]["consumes_parts"] == [{"part_id": "p_1", "quantity": 2}]
    assert task["phases"]["replace"]["required_completion_fields"] == ["cost"]
    # store cursor clamped against the shortened sequence (2 % 2 = 0)
    assert store.get_task_state(TASK_ID_1).get("phase_cursor") == 0


async def test_edit_phases_empty_text_removes_cycle_and_cursor(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = object_entry.runtime_data.store
    store.set_phase_cursor(TASK_ID_1, 1)

    result = await _open_edit_phases(hass, object_entry)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], user_input={"phases_text": "", "go_back": False}
    )
    assert result["type"] == FlowResultType.MENU

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    task = entry.data[CONF_TASKS][TASK_ID_1]
    assert "phases" not in task
    assert "phase_sequence" not in task
    assert "phase_cursor" not in store.get_task_state(TASK_ID_1)


async def test_edit_phases_in_task_action_menu(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"}
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], user_input={"selected_task": TASK_ID_1, "go_back": False}
    )
    assert result["type"] == FlowResultType.MENU
    assert "edit_phases" in result["menu_options"]
