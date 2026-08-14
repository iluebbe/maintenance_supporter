"""Tripwire: the setup wizard and the options flow create IDENTICAL tasks.

The five add-task steps (add_task, time-based, calendar, one-time, manual)
exist in both flows. They were hand-copied twins until the 2026-08 DRY audit
found four drifts (setup flow missing reading_unit / interval_anchor / the
calendar last_performed field; options flow dropping reading_unit on save) and
extracted config_flow_schedule.ScheduleStepsMixin. These tests pin the parity:
a field added to one flow but not the other fails here.
"""

from __future__ import annotations

from typing import Any

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN

# The keys whose values legitimately differ between the two flows: identity
# (fresh uuids), the wall-clock stamp, and dynamic state — during setup no
# Store exists yet so history/last_performed ride entry.data, while the
# options flow initializes both via the live Store.
_FLOW_SPECIFIC_KEYS = {"id", "object_id", "created_at", "history", "last_performed"}

_ADD_TASK_INPUT = {
    "name": "Parity Probe",
    "type": "inspection",
    "schedule_type": "time_based",
    "custom_icon": "mdi:test-tube",
    "priority": "high",
    "labels_text": "alpha, beta",
    "reading_unit": "kWh",
}

_TIME_BASED_INPUT = {
    "interval_days": 42,
    "interval_unit": "days",
    "interval_anchor": "planned",
    "last_performed": "2026-08-01",
    "warning_days": 5,
}


async def _create_task_via_setup_flow(hass: HomeAssistant) -> dict[str, Any]:
    """Drive the setup wizard: object → add task → finish; return the task."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "create_object"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"name": "Parity Object"})
    assert result["step_id"] == "task_menu"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "add_task"})
    assert result["step_id"] == "add_task"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input=dict(_ADD_TASK_INPUT))
    assert result["step_id"] == "time_based"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input=dict(_TIME_BASED_INPUT))
    assert result["step_id"] == "task_menu"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "finish"})
    assert result["type"] == FlowResultType.CREATE_ENTRY
    tasks = result["data"][CONF_TASKS]
    assert len(tasks) == 1
    return next(iter(tasks.values()))


async def _create_task_via_options_flow(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, Any]:
    """Drive the options flow's add-task path on an existing object entry."""
    before = set(entry.data.get(CONF_TASKS, {}))
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "add_task"})
    assert result["step_id"] == "add_task"
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input=dict(_ADD_TASK_INPUT))
    assert result["step_id"] == "opt_time_based"
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input=dict(_TIME_BASED_INPUT))
    assert result["type"] == FlowResultType.MENU
    new_ids = set(entry.data[CONF_TASKS]) - before
    assert len(new_ids) == 1
    return entry.data[CONF_TASKS][new_ids.pop()]


async def test_both_flows_create_the_same_task_record(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
    object_config_entry: MockConfigEntry,
) -> None:
    """End-to-end parity: identical inputs → identical persisted task dicts."""
    setup_task = await _create_task_via_setup_flow(hass)
    options_task = await _create_task_via_options_flow(hass, object_config_entry)

    # The fields that historically drifted must be present on BOTH sides.
    # (interval_anchor is normalized into the nested schedule as "anchor".)
    for task, flow in ((setup_task, "setup"), (options_task, "options")):
        assert task.get("reading_unit") == "kWh", f"{flow} flow dropped reading_unit"
        assert (task.get("schedule") or {}).get("anchor") == "planned", f"{flow} flow dropped interval_anchor"
        assert task.get("labels") == ["alpha", "beta"], f"{flow} flow dropped labels"

    # The setup flow persists last_performed in entry data (no Store exists
    # during setup); the options flow hands it to the Store.
    assert setup_task.get("last_performed") == "2026-08-01"

    normalized_setup = {k: v for k, v in setup_task.items() if k not in _FLOW_SPECIFIC_KEYS}
    normalized_options = {k: v for k, v in options_task.items() if k not in _FLOW_SPECIFIC_KEYS}
    assert normalized_setup == normalized_options


async def test_add_task_step_schemas_are_identical(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
    object_config_entry: MockConfigEntry,
) -> None:
    """Schema-key parity for every twin step (fails fast on one-sided fields)."""

    def keys(result: dict[str, Any]) -> set[str]:
        return {str(getattr(k, "schema", k)) for k in result["data_schema"].schema}

    # kind value on add_task → (setup step_id, options step_id)
    twins = {
        "time_based": ("time_based", "opt_time_based"),
        "weekdays": ("calendar", "opt_calendar"),
        "one_time": ("one_time", "opt_one_time"),
        "manual": ("manual", "opt_manual"),
    }

    for kind, (setup_step, options_step) in twins.items():
        setup = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
        setup = await hass.config_entries.flow.async_configure(setup["flow_id"], {"next_step_id": "create_object"})
        setup = await hass.config_entries.flow.async_configure(setup["flow_id"], user_input={"name": f"Schema {kind}"})
        setup = await hass.config_entries.flow.async_configure(setup["flow_id"], {"next_step_id": "add_task"})
        setup_add_keys = keys(setup)

        options = await hass.config_entries.options.async_init(object_config_entry.entry_id)
        options = await hass.config_entries.options.async_configure(options["flow_id"], {"next_step_id": "add_task"})
        assert setup_add_keys == keys(options), "add_task schemas drifted"

        step_input = {"name": f"Schema {kind}", "schedule_type": kind}
        setup = await hass.config_entries.flow.async_configure(setup["flow_id"], user_input=dict(step_input))
        assert setup["step_id"] == setup_step
        options = await hass.config_entries.options.async_configure(options["flow_id"], user_input=dict(step_input))
        assert options["step_id"] == options_step
        assert keys(setup) == keys(options), f"{setup_step} / {options_step} schemas drifted"

        hass.config_entries.flow.async_abort(setup["flow_id"])
        hass.config_entries.options.async_abort(options["flow_id"])
