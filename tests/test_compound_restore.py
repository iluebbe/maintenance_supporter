"""Compound trigger condition-state restoration (merge-on-read contract).

When a compound task is reconstructed, ``CompoundTrigger.async_setup`` must
inject each condition's persisted runtime state (from the merged
``_trigger_state["conditions"][idx]``) into the per-condition config passed to
``create_triggers`` — so sub-triggers rehydrate their counters after a restart.
Empty/out-of-range condition state must NOT be injected.

(The old ConfigEntry-write fallback these once accompanied was removed when
trigger runtime state moved fully into the Store; these cover the surviving
read/restore path.)
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock, patch

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.entity.triggers.compound import (
    CompoundTrigger,
)

from .conftest import TASK_ID_1

_CONDITIONS = [
    {
        "type": "threshold",
        "entity_id": "sensor.temp",
        "entity_ids": ["sensor.temp"],
        "trigger_above": 30.0,
    },
    {
        "type": "threshold",
        "entity_id": "sensor.humidity",
        "entity_ids": ["sensor.humidity"],
        "trigger_above": 70.0,
    },
]


async def _captured_condition_configs(hass: HomeAssistant, persisted_conditions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Run CompoundTrigger.async_setup and capture the per-condition configs."""
    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    mock_entity = MagicMock()
    mock_entity.entity_id = "sensor.test_compound"
    mock_entity._task_id = TASK_ID_1
    mock_entity.coordinator = MagicMock()

    trigger_config: dict[str, Any] = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [dict(c) for c in _CONDITIONS],
        "_trigger_state": {"conditions": persisted_conditions},
    }
    trigger = CompoundTrigger(hass, mock_entity, trigger_config)

    captured: list[dict[str, Any]] = []
    from custom_components.maintenance_supporter.entity.triggers import (
        create_triggers as _real_ct,
    )

    def _capturing_ct(*args: Any, **kwargs: Any) -> Any:
        if "trigger_config" in kwargs:
            captured.append(dict(kwargs["trigger_config"]))
        elif len(args) >= 3:
            captured.append(dict(args[2]))
        return _real_ct(*args, **kwargs)

    with patch(
        "custom_components.maintenance_supporter.entity.triggers.create_triggers",
        side_effect=_capturing_ct,
    ):
        await trigger.async_setup()
    return captured


async def test_compound_setup_restores_condition_state(hass: HomeAssistant) -> None:
    """Each condition with persisted state gets it injected as _trigger_state."""
    persisted = [
        {"sensor.temp": {"accumulated_seconds": 7200.0, "baseline_value": 20.0}},
        {"sensor.humidity": {"accumulated_seconds": 1800.0}},
    ]
    captured = await _captured_condition_configs(hass, persisted)
    assert len(captured) == 2
    assert captured[0]["_trigger_state"] == persisted[0]
    assert captured[1]["_trigger_state"] == persisted[1]


async def test_compound_setup_restores_partial_conditions(hass: HomeAssistant) -> None:
    """Fewer persisted states than conditions: idx 0 injected, idx 1 (out of range) not."""
    persisted = [{"sensor.temp": {"baseline_value": 15.0}}]
    captured = await _captured_condition_configs(hass, persisted)
    assert len(captured) == 2
    assert captured[0]["_trigger_state"] == persisted[0]
    assert "_trigger_state" not in captured[1]


async def test_compound_setup_skips_empty_condition_state(hass: HomeAssistant) -> None:
    """An empty (falsy) condition state dict is NOT injected."""
    captured = await _captured_condition_configs(hass, [{}, {}])
    assert len(captured) == 2
    assert "_trigger_state" not in captured[0]
    assert "_trigger_state" not in captured[1]
