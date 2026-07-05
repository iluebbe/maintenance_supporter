"""Purpose-specific triggers for the HA automation editor (2026.7+).

HA 2026.7 made intent-based ("purpose-specific") triggers the default
automation UI, and they are extensible by integrations: this module
contributes building blocks like *"A maintenance task became overdue"* so
users never have to know our entity naming or bus-event names.

The triggers are state-based on the per-task ENUM sensors
(``ok / due_soon / overdue / triggered / archived``). ``triggers.yaml``
narrows the UI entity picker to this integration's sensors; at runtime the
DomainSpec matches ENUM sensors within the chosen target (our task sensors
are the only ENUM entities this integration provides — the summary and
document-storage sensors carry different device classes).

Compatibility: cores as old as our 2025.7 minimum DO import this module at
component load (trigger platforms are processed eagerly), but the intent
framework's building blocks (``helpers.automation.DomainSpec``, the trigger
factories) only exist on recent cores — hence the import guard, which turns
this module into a no-op (zero registered triggers) instead of a logged
ImportError on every boot.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant

from .const import MaintenanceStatus

if TYPE_CHECKING:
    from homeassistant.helpers.trigger import Trigger

try:  # pragma: no cover - exercised only on cores without the framework
    from homeassistant.components.sensor import DOMAIN as SENSOR_DOMAIN
    from homeassistant.components.sensor import SensorDeviceClass
    from homeassistant.helpers.automation import DomainSpec
    from homeassistant.helpers.trigger import make_entity_target_state_trigger
except ImportError:  # HA core too old for purpose-specific triggers
    TRIGGERS: dict[str, type[Trigger]] = {}
else:
    _TASK_SENSOR_SPECS: dict[str, DomainSpec] = {
        SENSOR_DOMAIN: DomainSpec(device_class=SensorDeviceClass.ENUM),
    }

    TRIGGERS = {
        "task_became_overdue": make_entity_target_state_trigger(
            _TASK_SENSOR_SPECS, MaintenanceStatus.OVERDUE
        ),
        "task_became_due_soon": make_entity_target_state_trigger(
            _TASK_SENSOR_SPECS, MaintenanceStatus.DUE_SOON
        ),
        "sensor_trigger_activated": make_entity_target_state_trigger(
            _TASK_SENSOR_SPECS, MaintenanceStatus.TRIGGERED
        ),
        "task_became_ok": make_entity_target_state_trigger(
            _TASK_SENSOR_SPECS, MaintenanceStatus.OK
        ),
    }


async def async_get_triggers(hass: HomeAssistant) -> dict[str, type[Trigger]]:
    """Return the triggers for maintenance tasks."""
    return TRIGGERS
