"""Value-level validation of trigger_config numbers (security review 2026-08-21).

The key allowlist and the per-type required fields never looked at the VALUES:
``trigger_for_minutes: "abc"`` or a negative ``trigger_target_changes`` was
stored and only failed at trigger setup, far from its cause. These pin the
type/range checks, the numeric-string coercion, the null-means-unset rule and
the compound-condition prefixing.
"""

from __future__ import annotations

import math

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.websocket.tasks_validation import (
    TRIGGER_RUNTIME_HOURS_MAX,
    _validate_trigger_config,
)

from .conftest import call_ws_handler, make_ws_connection, setup_integration


def _threshold(**extra):
    return {"type": "threshold", "entity_id": "sensor.temp", "trigger_above": 80, **extra}


def test_numeric_strings_are_coerced_and_stored_as_numbers(hass: HomeAssistant) -> None:
    tc = {
        "type": "threshold",
        "entity_id": "sensor.temp",
        "trigger_above": " 80.5 ",
        "trigger_for_minutes": "15",
    }
    errors, _ = _validate_trigger_config(hass, tc)
    assert errors == []
    assert tc["trigger_above"] == 80.5 and isinstance(tc["trigger_above"], float)
    assert tc["trigger_for_minutes"] == 15 and isinstance(tc["trigger_for_minutes"], int)


def test_existing_numbers_keep_their_type(hass: HomeAssistant) -> None:
    """An int stays an int (export snapshots, equality pins) — only strings are converted."""
    tc = {"type": "counter", "entity_id": "sensor.hours", "trigger_target_value": 1000, "trigger_for_minutes": 5.0}
    errors, _ = _validate_trigger_config(hass, tc)
    assert errors == []
    assert tc["trigger_target_value"] == 1000 and isinstance(tc["trigger_target_value"], int)
    assert tc["trigger_for_minutes"] == 5 and isinstance(tc["trigger_for_minutes"], int)


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("trigger_above", "abc"),
        ("trigger_above", True),
        ("trigger_above", [80]),
        ("trigger_above", math.nan),
        ("trigger_below", math.inf),
    ],
)
def test_non_numbers_are_refused_with_the_field_named(hass: HomeAssistant, field, value) -> None:
    tc = {"type": "threshold", "entity_id": "sensor.temp", field: value}
    errors, _ = _validate_trigger_config(hass, tc)
    assert len(errors) == 1 and errors[0].startswith(f"trigger_config.{field} must be a number")


@pytest.mark.parametrize("value", ["abc", -1, 1441, 2.5, True, "1e9"])
def test_for_minutes_must_be_a_whole_number_in_range(hass: HomeAssistant, value) -> None:
    errors, _ = _validate_trigger_config(hass, _threshold(trigger_for_minutes=value))
    assert errors == [f"trigger_config.trigger_for_minutes must be a whole number between 0 and 1440, got {value!r}"]


@pytest.mark.parametrize("value", [0, 1440, "0", 60.0])
def test_for_minutes_boundaries_pass(hass: HomeAssistant, value) -> None:
    tc = _threshold(trigger_for_minutes=value)
    errors, _ = _validate_trigger_config(hass, tc)
    assert errors == [] and isinstance(tc["trigger_for_minutes"], int)


@pytest.mark.parametrize("value", [0, -3, 10_001, 1.5, "many"])
def test_target_changes_must_be_at_least_one(hass: HomeAssistant, value) -> None:
    tc = {"type": "state_change", "entity_id": "switch.valve", "trigger_to_state": "off", "trigger_target_changes": value}
    errors, _ = _validate_trigger_config(hass, tc)
    assert errors == [f"trigger_config.trigger_target_changes must be a whole number between 1 and 10000, got {value!r}"]


@pytest.mark.parametrize("value", [0, -1, TRIGGER_RUNTIME_HOURS_MAX + 1, "x"])
def test_runtime_hours_must_be_positive_and_bounded(hass: HomeAssistant, value) -> None:
    tc = {"type": "runtime", "entity_id": "lawn_mower.m", "trigger_runtime_hours": value}
    errors, _ = _validate_trigger_config(hass, tc)
    assert len(errors) == 1 and errors[0].startswith("trigger_config.trigger_runtime_hours must be a number greater than 0")


def test_runtime_hours_accepts_fractions_and_strings(hass: HomeAssistant) -> None:
    tc = {"type": "runtime", "entity_id": "lawn_mower.m", "trigger_runtime_hours": "8.5"}
    errors, _ = _validate_trigger_config(hass, tc)
    assert errors == [] and tc["trigger_runtime_hours"] == 8.5


def test_delta_counter_needs_a_positive_step(hass: HomeAssistant) -> None:
    tc = {"type": "counter", "entity_id": "sensor.km", "trigger_delta_mode": True, "trigger_target_value": 0}
    errors, _ = _validate_trigger_config(hass, tc)
    assert errors == ["trigger_config.trigger_target_value must be greater than 0 when trigger_delta_mode is on, got 0"]
    # Absolute counters may target any value (a countdown reaching 0).
    tc = {"type": "counter", "entity_id": "sensor.km", "trigger_target_value": 0}
    assert _validate_trigger_config(hass, tc)[0] == []


def test_delta_mode_must_be_a_real_bool(hass: HomeAssistant) -> None:
    tc = {"type": "counter", "entity_id": "sensor.km", "trigger_target_value": 10, "trigger_delta_mode": "yes"}
    errors, _ = _validate_trigger_config(hass, tc)
    assert errors == ["trigger_config.trigger_delta_mode must be true or false, got 'yes'"]


def test_explicit_null_on_optional_fields_means_unset(hass: HomeAssistant) -> None:
    """A client clearing a field sends null — dropped, never refused (and never
    stored, so the trigger's ``> 0`` comparisons can't meet a None)."""
    tc = _threshold(trigger_for_minutes=None, trigger_baseline_value=None, trigger_delta_mode=None)
    errors, _ = _validate_trigger_config(hass, tc)
    assert errors == []
    assert "trigger_for_minutes" not in tc and "trigger_baseline_value" not in tc and "trigger_delta_mode" not in tc


def test_compound_conditions_are_checked_with_their_index(hass: HomeAssistant) -> None:
    tc = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
            {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 1},
            {"type": "threshold", "entity_id": "sensor.b", "trigger_above": "high", "trigger_for_minutes": -5},
        ],
    }
    errors, _ = _validate_trigger_config(hass, tc)
    assert errors == [
        "Condition 1: trigger_config.trigger_above must be a number, got 'high'",
        "Condition 1: trigger_config.trigger_for_minutes must be a whole number between 0 and 1440, got -5",
    ]


async def test_ws_update_task_refuses_bad_trigger_values(
    hass: HomeAssistant, global_config_entry: MockConfigEntry, object_config_entry: MockConfigEntry
) -> None:
    """The write path surfaces the value error to the client instead of
    persisting a config the trigger class would choke on."""
    from custom_components.maintenance_supporter.const import CONF_TASKS
    from custom_components.maintenance_supporter.websocket.tasks import ws_update_task

    await setup_integration(hass, global_config_entry, object_config_entry)
    task_id = next(iter(object_config_entry.data[CONF_TASKS]))
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "entry_id": object_config_entry.entry_id,
            "task_id": task_id,
            "trigger_config": {"type": "threshold", "entity_id": "sensor.temp", "trigger_above": 80, "trigger_for_minutes": "abc"},
        },
    )
    assert conn.send_error.called
    assert "trigger_for_minutes" in str(conn.send_error.call_args)
    stored = hass.config_entries.async_get_entry(object_config_entry.entry_id).data[CONF_TASKS][task_id]
    assert (stored.get("trigger_config") or {}).get("trigger_for_minutes") != "abc"
