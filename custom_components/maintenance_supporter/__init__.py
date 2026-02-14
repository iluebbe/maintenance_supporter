"""The Maintenance Supporter integration."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import Event, HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import (
    config_validation as cv,
    device_registry as dr,
    entity_registry as er,
)
from homeassistant.helpers.typing import ConfigType

from .const import (
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SEASONAL,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_GROUPS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_PANEL_ENABLED,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    PLATFORMS,
    SERVICE_COMPLETE,
    SERVICE_EXPORT,
    SERVICE_RESET,
    SERVICE_SKIP,
)
from .coordinator import MaintenanceCoordinator
from .frontend import async_register_card
from .helpers.notification_manager import NotificationManager
from .panel import async_register_panel, async_unregister_panel
from .websocket import async_register_commands

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
NOTIFICATION_MANAGER_KEY = "_notification_manager"


@dataclass
class MaintenanceSupporterData:
    """Runtime data for a Maintenance Supporter config entry."""

    coordinator: MaintenanceCoordinator | None = None


type MaintenanceSupporterConfigEntry = ConfigEntry[MaintenanceSupporterData]


# --- Service Schemas ---
SERVICE_COMPLETE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): cv.entity_id,
        vol.Optional("notes"): cv.string,
        vol.Optional("cost"): vol.Coerce(float),
        vol.Optional("duration"): vol.Coerce(int),
    }
)

SERVICE_RESET_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): cv.entity_id,
        vol.Optional("date"): cv.date,
    }
)

SERVICE_SKIP_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): cv.entity_id,
        vol.Optional("reason"): cv.string,
    }
)

SERVICE_EXPORT_SCHEMA = vol.Schema(
    {
        vol.Optional("format", default="json"): vol.In(["json", "yaml"]),
        vol.Optional("include_history", default=True): cv.boolean,
    }
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Maintenance Supporter integration."""
    hass.data.setdefault(DOMAIN, {})

    # Create the notification manager (shared across all entries)
    hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] = NotificationManager(hass)

    async def _handle_complete(call: ServiceCall) -> None:
        """Handle the complete service call."""
        entity_id = call.data[ATTR_ENTITY_ID]
        coordinator = _get_coordinator_for_entity(hass, entity_id)
        if coordinator is None:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="no_coordinator_for_entity",
                translation_placeholders={"entity_id": entity_id},
            )
        task_id = _get_task_id_for_entity(hass, entity_id)
        if task_id is None:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="no_task_for_entity",
                translation_placeholders={"entity_id": entity_id},
            )
        await coordinator.complete_maintenance(
            task_id=task_id,
            notes=call.data.get("notes"),
            cost=call.data.get("cost"),
            duration=call.data.get("duration"),
        )

    async def _handle_reset(call: ServiceCall) -> None:
        """Handle the reset service call."""
        entity_id = call.data[ATTR_ENTITY_ID]
        coordinator = _get_coordinator_for_entity(hass, entity_id)
        if coordinator is None:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="no_coordinator_for_entity",
                translation_placeholders={"entity_id": entity_id},
            )
        task_id = _get_task_id_for_entity(hass, entity_id)
        if task_id is None:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="no_task_for_entity",
                translation_placeholders={"entity_id": entity_id},
            )
        await coordinator.reset_maintenance(
            task_id=task_id,
            date=call.data.get("date"),
        )

    async def _handle_skip(call: ServiceCall) -> None:
        """Handle the skip service call."""
        entity_id = call.data[ATTR_ENTITY_ID]
        coordinator = _get_coordinator_for_entity(hass, entity_id)
        if coordinator is None:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="no_coordinator_for_entity",
                translation_placeholders={"entity_id": entity_id},
            )
        task_id = _get_task_id_for_entity(hass, entity_id)
        if task_id is None:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="no_task_for_entity",
                translation_placeholders={"entity_id": entity_id},
            )
        await coordinator.skip_maintenance(
            task_id=task_id,
            reason=call.data.get("reason"),
        )

    async def _handle_export(call: ServiceCall) -> None:
        """Handle the export_data service call."""
        from .export import export_maintenance_data  # noqa: PLC0415

        fmt = call.data.get("format", "json")
        include_history = call.data.get("include_history", True)
        result = export_maintenance_data(hass, fmt=fmt, include_history=include_history)
        # Fire an event with the exported data so automations can use it
        hass.bus.async_fire(
            f"{DOMAIN}_export_completed",
            {"format": fmt, "data": result},
        )

    hass.services.async_register(
        DOMAIN, SERVICE_COMPLETE, _handle_complete, schema=SERVICE_COMPLETE_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_RESET, _handle_reset, schema=SERVICE_RESET_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SKIP, _handle_skip, schema=SERVICE_SKIP_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_EXPORT, _handle_export, schema=SERVICE_EXPORT_SCHEMA
    )

    # Register WebSocket commands
    async_register_commands(hass)

    # Register Lovelace card (always available)
    await async_register_card(hass)

    # Register listener for mobile app notification action buttons
    async def _handle_notification_action(event: Event) -> None:
        """Handle mobile_app_notification_action events from Companion App."""
        action = event.data.get("action", "")
        if not action.startswith("MS_"):
            return

        # Parse action: MS_COMPLETE_{entry_id}_{task_id}
        #                MS_SKIP_{entry_id}_{task_id}
        #                MS_SNOOZE_{entry_id}_{task_id}
        # entry_id is a 26-char ULID, task_id is a 32-char UUID hex
        if action.startswith("MS_COMPLETE_"):
            action_type = "complete"
            remainder = action[len("MS_COMPLETE_"):]
        elif action.startswith("MS_SKIP_"):
            action_type = "skip"
            remainder = action[len("MS_SKIP_"):]
        elif action.startswith("MS_SNOOZE_"):
            action_type = "snooze"
            remainder = action[len("MS_SNOOZE_"):]
        else:
            return

        # Validate format: {26-char entry_id}_{32-char task_id}
        if len(remainder) != 59 or remainder[26] != "_":
            _LOGGER.warning("Invalid notification action format: %s", action)
            return

        entry_id = remainder[:26]
        task_id = remainder[27:]

        runtime_data = hass.data.get(DOMAIN, {}).get(entry_id)
        if not runtime_data or not hasattr(runtime_data, "coordinator") or not runtime_data.coordinator:
            _LOGGER.warning(
                "No coordinator found for notification action (entry_id=%s)", entry_id
            )
            return

        if action_type == "complete":
            _LOGGER.info("Completing task %s via notification action", task_id)
            await runtime_data.coordinator.complete_maintenance(task_id=task_id)
        elif action_type == "skip":
            _LOGGER.info("Skipping task %s via notification action", task_id)
            await runtime_data.coordinator.skip_maintenance(
                task_id=task_id, reason="Skipped from notification"
            )
        elif action_type == "snooze":
            _LOGGER.info("Snoozing task %s via notification action", task_id)
            nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
            if nm is not None:
                nm.snooze_task(entry_id, task_id)

    hass.bus.async_listen(
        "mobile_app_notification_action", _handle_notification_action
    )

    return True


def _detect_advanced_feature_usage(
    hass: HomeAssistant, global_options: dict[str, Any]
) -> dict[str, bool]:
    """Scan existing entries to detect which advanced features are in use."""
    adaptive = False
    predictions = False
    seasonal = False
    environmental = False
    checklists = False

    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        tasks = entry.data.get(CONF_TASKS, {})
        for task_data in tasks.values():
            ac = task_data.get("adaptive_config") or {}
            if ac.get("enabled"):
                adaptive = True
            if ac.get("sensor_prediction_enabled"):
                predictions = True
            if ac.get("seasonal_enabled"):
                seasonal = True
            if ac.get("environmental_entity"):
                environmental = True
            if task_data.get("checklist"):
                checklists = True

    budget = (
        global_options.get(CONF_BUDGET_MONTHLY, 0) > 0
        or global_options.get(CONF_BUDGET_YEARLY, 0) > 0
    )
    groups = bool(global_options.get(CONF_GROUPS, {}))

    return {
        CONF_ADVANCED_ADAPTIVE: adaptive,
        CONF_ADVANCED_PREDICTIONS: predictions,
        CONF_ADVANCED_SEASONAL: seasonal,
        CONF_ADVANCED_ENVIRONMENTAL: environmental,
        CONF_ADVANCED_BUDGET: budget,
        CONF_ADVANCED_GROUPS: groups,
        CONF_ADVANCED_CHECKLISTS: checklists,
    }


async def async_setup_entry(
    hass: HomeAssistant, entry: MaintenanceSupporterConfigEntry
) -> bool:
    """Set up Maintenance Supporter from a config entry."""
    is_global = entry.unique_id == GLOBAL_UNIQUE_ID

    if is_global:
        # Global entry: no coordinator needed, just store reference
        entry.runtime_data = MaintenanceSupporterData()

        # One-time migration: auto-enable advanced feature flags for existing users
        options = dict(entry.options or entry.data)
        if CONF_ADVANCED_ADAPTIVE not in options:
            flags = _detect_advanced_feature_usage(hass, options)
            options.update(flags)
            hass.config_entries.async_update_entry(entry, options=options)
            _LOGGER.info("Migrated advanced feature flags: %s", flags)

        # Register panel if enabled in options
        if entry.options.get(CONF_PANEL_ENABLED, False):
            await async_register_panel(hass)

        # Listen for options changes (panel toggle)
        entry.async_on_unload(
            entry.add_update_listener(_async_global_options_updated)
        )

        _LOGGER.debug("Global config entry set up: %s", entry.entry_id)
    else:
        # Maintenance object entry: create coordinator
        coordinator = MaintenanceCoordinator(hass, entry)
        entry.runtime_data = MaintenanceSupporterData(coordinator=coordinator)
        await coordinator.async_config_entry_first_refresh()

        # Store reference for calendar/service lookups
        hass.data[DOMAIN][entry.entry_id] = entry.runtime_data

        _LOGGER.debug(
            "Maintenance object entry set up: %s (%s)",
            entry.title,
            entry.entry_id,
        )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def _async_global_options_updated(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """React to global options changes (e.g. panel toggle)."""
    panel_enabled = entry.options.get(CONF_PANEL_ENABLED, False)
    if panel_enabled:
        await async_register_panel(hass)
    else:
        await async_unregister_panel(hass)


async def async_unload_entry(
    hass: HomeAssistant, entry: MaintenanceSupporterConfigEntry
) -> bool:
    """Unload a config entry."""
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        # Unregister panel when global entry is unloaded
        await async_unregister_panel(hass)

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok and entry.unique_id != GLOBAL_UNIQUE_ID:
        hass.data[DOMAIN].pop(entry.entry_id, None)

    # Clean up domain data if no entries left
    if not hass.config_entries.async_entries(DOMAIN):
        nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
        if nm is not None:
            await nm.async_unload()
        hass.data.pop(DOMAIN, None)

    return unload_ok


async def async_remove_config_entry_device(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    device_entry: dr.DeviceEntry,
) -> bool:
    """Allow device removal when it has no entities."""
    entity_registry = er.async_get(hass)
    return not er.async_entries_for_device(entity_registry, device_entry.id)


def _get_coordinator_for_entity(
    hass: HomeAssistant, entity_id: str
) -> MaintenanceCoordinator | None:
    """Find the coordinator that manages the given entity."""
    entity_registry = er.async_get(hass)
    entry = entity_registry.async_get(entity_id)
    if entry is None:
        return None

    config_entry_id = entry.config_entry_id
    if config_entry_id is None:
        return None

    runtime_data = hass.data.get(DOMAIN, {}).get(config_entry_id)
    if runtime_data is None:
        return None

    return runtime_data.coordinator


def _get_task_id_for_entity(
    hass: HomeAssistant, entity_id: str
) -> str | None:
    """Extract the task ID from an entity's unique_id."""
    entity_registry = er.async_get(hass)
    entry = entity_registry.async_get(entity_id)
    if entry is None or entry.unique_id is None:
        return None

    # unique_id format: maintenance_supporter_{object_slug}_{task_id}
    # task_id is a 32-char hex UUID without dashes at the end
    unique_id = entry.unique_id
    prefix = "maintenance_supporter_"
    if not unique_id.startswith(prefix):
        return None

    # The task_id is the last 32 characters (UUID hex)
    remainder = unique_id[len(prefix):]
    # Find the task_id: last part after the object slug
    # Object slug could have underscores, so we find the task_id
    # by looking at what config entry this entity belongs to
    config_entry_id = entry.config_entry_id
    if config_entry_id is None:
        return None

    config_entry = hass.config_entries.async_get_entry(config_entry_id)
    if config_entry is None:
        return None

    # Look up which task matches this unique_id
    from .const import CONF_TASKS
    tasks = config_entry.data.get(CONF_TASKS, {})
    for task_id in tasks:
        if unique_id.endswith(f"_{task_id}"):
            return task_id

    return None
