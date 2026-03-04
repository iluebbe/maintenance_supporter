"""The Maintenance Supporter integration."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import Event, HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
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
    SIGNAL_NEW_OBJECT_ENTRY,
)
from .coordinator import MaintenanceCoordinator
from .frontend import async_register_card
from .helpers.notification_manager import NotificationManager
from .panel import async_register_panel, async_unregister_panel
from .storage import MaintenanceStore, async_migrate_to_store
from .websocket import async_register_commands

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
NOTIFICATION_MANAGER_KEY = "_notification_manager"


@dataclass
class MaintenanceSupporterData:
    """Runtime data for a Maintenance Supporter config entry."""

    coordinator: MaintenanceCoordinator | None = None
    store: MaintenanceStore | None = None


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
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="no_coordinator_for_entity",
                translation_placeholders={"entity_id": entity_id},
            )
        task_id = _get_task_id_for_entity(hass, entity_id)
        if task_id is None:
            raise ServiceValidationError(
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
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="no_coordinator_for_entity",
                translation_placeholders={"entity_id": entity_id},
            )
        task_id = _get_task_id_for_entity(hass, entity_id)
        if task_id is None:
            raise ServiceValidationError(
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
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="no_coordinator_for_entity",
                translation_placeholders={"entity_id": entity_id},
            )
        task_id = _get_task_id_for_entity(hass, entity_id)
        if task_id is None:
            raise ServiceValidationError(
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
        from .export import build_export_data, serialize_export_to_file  # noqa: PLC0415

        fmt = call.data.get("format", "json")
        include_history = call.data.get("include_history", True)

        # Phase 1: gather data on the event loop (accesses HA APIs)
        data = build_export_data(hass, include_history=include_history)

        # Phase 2: serialize in executor (CPU-bound, no HA API calls)
        file_path = hass.config.path(f"maintenance_export.{fmt}")
        await hass.async_add_executor_job(serialize_export_to_file, data, fmt, file_path)

        # Fire lightweight event (file path only, not the full payload)
        hass.bus.async_fire(
            f"{DOMAIN}_export_completed",
            {"format": fmt, "file_path": file_path},
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
        # entry_id is a 32-char hex UUID, task_id is a 32-char hex UUID
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

        # Split on underscore — entry_id and task_id contain no underscores
        parts = remainder.split("_", 1)
        if len(parts) != 2 or not parts[0] or not parts[1]:
            _LOGGER.warning("Invalid notification action format: %s", action)
            return

        entry_id, task_id = parts

        config_entry = hass.config_entries.async_get_entry(entry_id)
        runtime_data = getattr(config_entry, "runtime_data", None) if config_entry else None
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

    unsub_notification = hass.bus.async_listen(
        "mobile_app_notification_action", _handle_notification_action
    )

    # Register listener for NFC tag scans → complete linked tasks
    async def _handle_tag_scanned(event: Event) -> None:
        """Handle tag_scanned events — complete task linked to NFC tag."""
        tag_id = event.data.get("tag_id", "")
        if not tag_id:
            return

        # Search all entries for a task with matching nfc_tag_id
        for ce in hass.config_entries.async_entries(DOMAIN):
            if ce.unique_id == GLOBAL_UNIQUE_ID:
                continue
            tasks = ce.data.get(CONF_TASKS, {})
            for task_id, task_data in tasks.items():
                if task_data.get("nfc_tag_id") != tag_id:
                    continue
                # Found matching task
                runtime_data = getattr(ce, "runtime_data", None)
                if not runtime_data or not getattr(
                    runtime_data, "coordinator", None
                ):
                    _LOGGER.warning(
                        "No coordinator for NFC tag match (entry=%s)",
                        ce.entry_id,
                    )
                    continue
                _LOGGER.info(
                    "Completing task %s via NFC tag scan (%s)",
                    task_id,
                    tag_id,
                )
                user_id = event.context.user_id if event.context else None
                await runtime_data.coordinator.complete_maintenance(
                    task_id=task_id,
                    completed_by=user_id,
                    notes="Completed via NFC tag",
                )
                return

        # No match found — not our tag, ignore silently

    unsub_tag = hass.bus.async_listen("tag_scanned", _handle_tag_scanned)

    # Store unsub callbacks so they can be cleaned up when domain is unloaded
    hass.data[DOMAIN]["_event_unsubs"] = [unsub_notification, unsub_tag]

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
        # Maintenance object entry: create Store + coordinator
        store = MaintenanceStore(hass, entry.entry_id)

        # Migrate dynamic state from ConfigEntry.data → Store (one-time)
        cleaned_data = await async_migrate_to_store(
            hass, entry.entry_id, entry.data, store
        )
        if cleaned_data is not entry.data:
            hass.config_entries.async_update_entry(entry, data=dict(cleaned_data))

        coordinator = MaintenanceCoordinator(hass, entry, store)
        entry.runtime_data = MaintenanceSupporterData(
            coordinator=coordinator, store=store
        )
        await coordinator.async_config_entry_first_refresh()

        # Notify WS subscribers that a new object entry is available
        from homeassistant.helpers.dispatcher import async_dispatcher_send  # noqa: PLC0415

        async_dispatcher_send(hass, SIGNAL_NEW_OBJECT_ENTRY, entry.entry_id)

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

    # Clean up domain data if no entries left
    if not hass.config_entries.async_entries(DOMAIN):
        nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
        if nm is not None:
            await nm.async_unload()
        for unsub in hass.data.get(DOMAIN, {}).get("_event_unsubs", []):
            unsub()
        hass.data.pop(DOMAIN, None)

    return unload_ok


async def async_remove_entry(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Clean up store file when a config entry is permanently deleted."""
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        return
    store = MaintenanceStore(hass, entry.entry_id)
    await store.async_remove()
    _LOGGER.debug("Removed store for entry %s", entry.entry_id)


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

    config_entry = hass.config_entries.async_get_entry(config_entry_id)
    if config_entry is None:
        return None

    runtime_data: MaintenanceSupporterData | None = getattr(config_entry, "runtime_data", None)
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
    # Sensor unique_id: maintenance_supporter_{slug}_{task_id}
    # Binary sensor: maintenance_supporter_{slug}_{task_id}_overdue
    from .const import CONF_TASKS
    tasks: dict[str, Any] = config_entry.data.get(CONF_TASKS, {})
    for task_id in tasks:
        if f"_{task_id}" in unique_id:
            return str(task_id)

    return None
