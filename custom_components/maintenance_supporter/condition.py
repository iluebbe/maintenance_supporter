"""Purpose-specific conditions for the HA automation editor (2026.7+).

Companion to :mod:`.trigger` — condition building blocks like *"A maintenance
task is overdue"* for the intent-based automation UI. State-based on the
per-task ENUM sensors; see trigger.py for the targeting rationale and the
old-core import guard.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant

from .const import MaintenanceStatus

if TYPE_CHECKING:
    from homeassistant.helpers.condition import Condition

try:  # pragma: no cover - exercised only on cores without the framework
    from homeassistant.components.sensor import DOMAIN as SENSOR_DOMAIN
    from homeassistant.components.sensor import SensorDeviceClass
    from homeassistant.helpers.automation import DomainSpec
    from homeassistant.helpers.condition import make_entity_state_condition
except ImportError:  # HA core too old for purpose-specific conditions
    CONDITIONS: dict[str, type[Condition]] = {}
else:
    _TASK_SENSOR_SPECS: dict[str, DomainSpec] = {
        SENSOR_DOMAIN: DomainSpec(device_class=SensorDeviceClass.ENUM),
    }

    CONDITIONS = {
        "task_is_overdue": make_entity_state_condition(
            _TASK_SENSOR_SPECS, MaintenanceStatus.OVERDUE
        ),
        "task_is_due_soon": make_entity_state_condition(
            _TASK_SENSOR_SPECS, MaintenanceStatus.DUE_SOON
        ),
        "task_is_triggered": make_entity_state_condition(
            _TASK_SENSOR_SPECS, MaintenanceStatus.TRIGGERED
        ),
        # "Needs attention" = the two states that demand action now.
        "task_needs_attention": make_entity_state_condition(
            _TASK_SENSOR_SPECS,
            {str(MaintenanceStatus.OVERDUE), str(MaintenanceStatus.TRIGGERED)},
        ),
    }


async def async_get_conditions(hass: HomeAssistant) -> dict[str, type[Condition]]:
    """Return the conditions for maintenance tasks."""
    return CONDITIONS
