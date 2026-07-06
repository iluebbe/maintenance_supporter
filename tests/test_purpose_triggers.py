"""Purpose-specific triggers + conditions (HA 2026.7 automation editor).

The integration contributes intent-based building blocks
(``maintenance_supporter.task_became_overdue`` …) to the new default
automation UI. These tests guard:

* drift between ``trigger.py``/``condition.py``, their ``*.yaml`` descriptors,
  and the ``strings.json`` translations (a missing key = silent English or a
  broken editor entry), and
* the actual firing/evaluation semantics against ENUM task-sensor states.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

import yaml
from homeassistant.core import Context, HomeAssistant, callback
from homeassistant.helpers.condition import async_validate_condition_config
from homeassistant.helpers.condition import async_from_config as condition_from_config
from homeassistant.helpers.trigger import (
    async_initialize_triggers,
    async_validate_trigger_config,
)

from custom_components.maintenance_supporter.condition import CONDITIONS
from custom_components.maintenance_supporter.trigger import TRIGGERS

COMPONENT = Path("custom_components/maintenance_supporter")

_LOGGER = logging.getLogger(__name__)


def _yaml_keys(name: str) -> set[str]:
    data = yaml.safe_load((COMPONENT / name).read_text(encoding="utf-8"))
    return {k for k in data if not k.startswith(".")}


def _strings_section(name: str) -> dict[str, Any]:
    data = json.loads((COMPONENT / "strings.json").read_text(encoding="utf-8"))
    return data[name]  # type: ignore[no-any-return]


# ─── drift guards ───────────────────────────────────────────────────────────


def test_trigger_registry_yaml_and_strings_agree() -> None:
    keys = set(TRIGGERS)
    assert keys == _yaml_keys("triggers.yaml")
    strings = _strings_section("triggers")
    assert keys == set(strings)
    for entry in strings.values():
        assert entry["name"] and entry["description"]
        assert set(entry["fields"]) == {"behavior", "for"}


def test_condition_registry_yaml_and_strings_agree() -> None:
    keys = set(CONDITIONS)
    assert keys == _yaml_keys("conditions.yaml")
    strings = _strings_section("conditions")
    assert keys == set(strings)
    for entry in strings.values():
        assert entry["name"] and entry["description"]


def test_translations_carry_trigger_sections() -> None:
    # test_i18n enforces full key parity; this is the cheap tripwire that the
    # sections exist at all (so a future locale file can't ship without them).
    for f in (COMPONENT / "translations").glob("*.json"):
        data = json.loads(f.read_text(encoding="utf-8"))
        assert set(data["triggers"]) == set(TRIGGERS), f.name
        assert set(data["conditions"]) == set(CONDITIONS), f.name


# ─── functional: trigger fires on state transition ──────────────────────────


async def _arm(hass: HomeAssistant, trigger: str, target: dict[str, Any], calls: list[str]) -> None:
    """Validate + attach a new-style trigger, recording fired entity ids."""

    @callback
    def action(run_variables: dict[str, Any], context: Context | None = None) -> None:
        calls.append(run_variables["trigger"]["entity_id"])

    def log_cb(level: int, msg: str, **kwargs: Any) -> None:
        _LOGGER.log(level, "%s", msg)

    validated = await async_validate_trigger_config(hass, [{"platform": trigger, "target": target}])
    await async_initialize_triggers(hass, validated, action, domain="test", name="t", log_cb=log_cb)


def _set_task_state(hass: HomeAssistant, entity_id: str, state: str) -> None:
    hass.states.async_set(entity_id, state, {"device_class": "enum"})


async def test_task_became_overdue_fires(hass: HomeAssistant) -> None:
    entity = "sensor.family_car_oil_change"
    _set_task_state(hass, entity, "ok")
    await hass.async_block_till_done()

    calls: list[str] = []
    await _arm(hass, "maintenance_supporter.task_became_overdue", {"entity_id": entity}, calls)

    _set_task_state(hass, entity, "due_soon")
    await hass.async_block_till_done()
    assert not calls  # only the overdue transition fires this trigger

    _set_task_state(hass, entity, "overdue")
    await hass.async_block_till_done()
    assert calls == [entity]

    # Staying overdue (attribute-only change) must not re-fire.
    hass.states.async_set(entity, "overdue", {"device_class": "enum", "x": 1})
    await hass.async_block_till_done()
    assert calls == [entity]


async def test_sensor_trigger_activated_fires(hass: HomeAssistant) -> None:
    entity = "sensor.hvac_filter_replacement"
    _set_task_state(hass, entity, "ok")
    await hass.async_block_till_done()

    calls: list[str] = []
    await _arm(
        hass,
        "maintenance_supporter.sensor_trigger_activated",
        {"entity_id": entity},
        calls,
    )

    _set_task_state(hass, entity, "triggered")
    await hass.async_block_till_done()
    assert calls == [entity]


async def test_non_enum_sensor_is_filtered_out(hass: HomeAssistant) -> None:
    # A targeted non-ENUM sensor never matches the DomainSpec — the trigger
    # simply doesn't attach to it (our task sensors are the only ENUM
    # entities this integration provides).
    entity = "sensor.random_numeric"
    hass.states.async_set(entity, "1")
    await hass.async_block_till_done()

    calls: list[str] = []
    await _arm(hass, "maintenance_supporter.task_became_overdue", {"entity_id": entity}, calls)
    hass.states.async_set(entity, "overdue")
    await hass.async_block_till_done()
    assert not calls


# ─── functional: conditions evaluate task state ─────────────────────────────


async def _check(hass: HomeAssistant, condition: str, target: dict[str, Any]) -> bool:
    validated = await async_validate_condition_config(
        hass,
        {"condition": condition, "target": target, "options": {"behavior": "any"}},
    )
    checker = await condition_from_config(hass, validated)
    return bool(checker(hass, {}))


async def test_task_is_overdue_condition(hass: HomeAssistant) -> None:
    entity = "sensor.pool_pump_impeller_cleaning"
    _set_task_state(hass, entity, "ok")
    await hass.async_block_till_done()
    assert not await _check(hass, "maintenance_supporter.task_is_overdue", {"entity_id": entity})

    _set_task_state(hass, entity, "overdue")
    await hass.async_block_till_done()
    assert await _check(hass, "maintenance_supporter.task_is_overdue", {"entity_id": entity})


async def test_task_needs_attention_condition_covers_both_states(
    hass: HomeAssistant,
) -> None:
    entity = "sensor.smoke_detectors_battery"
    for state, expected in (
        ("ok", False),
        ("due_soon", False),
        ("overdue", True),
        ("triggered", True),
    ):
        _set_task_state(hass, entity, state)
        await hass.async_block_till_done()
        assert (
            await _check(
                hass,
                "maintenance_supporter.task_needs_attention",
                {"entity_id": entity},
            )
            is expected
        ), state
