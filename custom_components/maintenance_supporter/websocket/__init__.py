"""WebSocket API for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback

if TYPE_CHECKING:
    from .. import MaintenanceSupporterData

from ..const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

_LOGGER = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Shared helpers (used by handler submodules)
# ---------------------------------------------------------------------------


def _get_object_entries(hass: HomeAssistant) -> list[ConfigEntry]:
    """Return all non-global config entries for this domain."""
    return [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.unique_id != GLOBAL_UNIQUE_ID
    ]


def _get_runtime_data(hass: HomeAssistant, entry_id: str) -> MaintenanceSupporterData | None:
    """Get runtime data for a config entry."""
    config_entry = hass.config_entries.async_get_entry(entry_id)
    if config_entry is None:
        return None
    result: MaintenanceSupporterData | None = getattr(config_entry, "runtime_data", None)
    return result


def _get_merged_tasks(entry: ConfigEntry) -> dict[str, Any]:
    """Return merged task data (static ConfigEntry + dynamic Store) for an entry."""
    tasks_data = entry.data.get(CONF_TASKS, {})
    rd = getattr(entry, "runtime_data", None)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        return store.merge_all_tasks(tasks_data)
    return tasks_data


def _build_task_summary(
    hass: HomeAssistant, task_id: str, task_data: dict[str, Any], coordinator_task: dict[str, Any] | None
) -> dict[str, Any]:
    """Build a task summary dict for WS responses."""
    from ..entity.triggers import normalize_entity_ids

    ct = coordinator_task or {}

    # Enrich trigger config with entity friendly name and state info
    trigger_config = task_data.get("trigger_config")
    trigger_entity_info: dict[str, Any] | None = None
    trigger_entity_infos: list[dict[str, Any]] | None = None

    if trigger_config:
        entity_ids = normalize_entity_ids(trigger_config)

        # Compound trigger fallback: collect entity_ids from conditions
        if not entity_ids and trigger_config.get("type") == "compound":
            seen: set[str] = set()
            for cond in trigger_config.get("conditions", []):
                for eid in normalize_entity_ids(cond):
                    if eid not in seen:
                        seen.add(eid)
                        entity_ids.append(eid)

        # Build info for all entities
        infos: list[dict[str, Any]] = []
        for eid in entity_ids:
            state_obj = hass.states.get(eid)
            if state_obj is not None:
                infos.append({
                    "entity_id": eid,
                    "friendly_name": state_obj.attributes.get("friendly_name", eid),
                    "unit_of_measurement": state_obj.attributes.get("unit_of_measurement"),
                    "min": state_obj.attributes.get("min"),
                    "max": state_obj.attributes.get("max"),
                    "step": state_obj.attributes.get("step"),
                })

        # Backwards compat: trigger_entity_info is the first entity
        if infos:
            trigger_entity_info = infos[0]
        # Multi-entity: include all
        if len(infos) > 1:
            trigger_entity_infos = infos

    return {
        "id": task_id,
        "name": task_data.get("name", ""),
        "type": task_data.get("type", "custom"),
        "enabled": task_data.get("enabled", True),
        "schedule_type": task_data.get("schedule_type", "time_based"),
        "interval_days": task_data.get("interval_days"),
        "warning_days": task_data.get("warning_days", 7),
        "last_performed": task_data.get("last_performed"),
        "notes": task_data.get("notes"),
        "documentation_url": task_data.get("documentation_url"),
        "custom_icon": task_data.get("custom_icon"),
        "nfc_tag_id": task_data.get("nfc_tag_id"),
        "responsible_user_id": task_data.get("responsible_user_id"),
        "trigger_config": trigger_config,
        "trigger_entity_info": trigger_entity_info,
        "trigger_entity_infos": trigger_entity_infos,
        "checklist": task_data.get("checklist", []),
        "history": task_data.get("history", []),
        # Computed fields from coordinator
        "status": ct.get("_status", "ok"),
        "days_until_due": ct.get("_days_until_due"),
        "next_due": ct.get("_next_due"),
        "trigger_active": ct.get("_trigger_active", False),
        "trigger_current_value": ct.get("_trigger_current_value"),
        "trigger_entity_state": ct.get("_trigger_entity_state", "available"),
        "trigger_current_delta": ct.get("_trigger_current_delta"),
        "trigger_baseline_value": ct.get("_trigger_baseline_value"),
        "times_performed": ct.get("_times_performed", 0),
        "total_cost": ct.get("_total_cost", 0.0),
        "average_duration": ct.get("_average_duration"),
        # Adaptive scheduling
        "adaptive_config": task_data.get("adaptive_config"),
        "suggested_interval": ct.get("_suggested_interval"),
        "interval_confidence": ct.get("_interval_confidence"),
        "interval_analysis": ct.get("_interval_analysis"),
        # Seasonal scheduling (top-level for easy frontend access)
        "seasonal_factor": (ct.get("_interval_analysis") or {}).get("seasonal_factor"),
        "seasonal_factors": (ct.get("_interval_analysis") or {}).get("seasonal_factors"),
        # Sensor-driven predictions (Phase 3)
        "degradation_rate": ct.get("_degradation_rate"),
        "degradation_trend": ct.get("_degradation_trend"),
        "degradation_r_squared": ct.get("_degradation_r_squared"),
        "days_until_threshold": ct.get("_days_until_threshold"),
        "threshold_prediction_date": ct.get("_threshold_prediction_date"),
        "threshold_prediction_confidence": ct.get("_threshold_prediction_confidence"),
        "environmental_factor": ct.get("_environmental_factor"),
        "environmental_entity": ct.get("_environmental_entity"),
        "environmental_correlation": ct.get("_environmental_correlation"),
        "sensor_prediction_urgency": ct.get("_sensor_prediction_urgency", False),
    }


def _build_object_response(hass: HomeAssistant, entry: ConfigEntry, coordinator_data: dict[str, Any] | None) -> dict[str, Any]:
    """Build a full object response dict."""
    obj_data = entry.data.get(CONF_OBJECT, {})
    tasks_data = _get_merged_tasks(entry)
    ct_tasks = (coordinator_data or {}).get(CONF_TASKS, {})

    tasks = [
        _build_task_summary(hass, tid, tdata, ct_tasks.get(tid))
        for tid, tdata in tasks_data.items()
    ]

    return {
        "entry_id": entry.entry_id,
        "object": {
            "id": obj_data.get("id", ""),
            "name": obj_data.get("name", ""),
            "area_id": obj_data.get("area_id"),
            "manufacturer": obj_data.get("manufacturer"),
            "model": obj_data.get("model"),
            "installation_date": obj_data.get("installation_date"),
        },
        "tasks": tasks,
    }


def _get_global_entry(hass: HomeAssistant) -> ConfigEntry | None:
    """Get the global config entry."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            return entry
    return None


# ---------------------------------------------------------------------------
# Re-exports for backward compatibility (used by tests)
# ---------------------------------------------------------------------------

from .tasks import _validate_compound_trigger, _validate_trigger_config  # noqa: E402, F401


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    """Register all WebSocket commands."""
    from .analysis import (  # noqa: PLC0415
        ws_analyze_interval,
        ws_apply_suggestion,
        ws_seasonal_overrides,
        ws_set_environmental_entity,
    )
    from .dashboard import (  # noqa: PLC0415
        ws_get_budget_status,
        ws_get_settings,
        ws_get_statistics,
        ws_subscribe,
        ws_test_notification,
        ws_update_global_settings,
    )
    from .groups import (  # noqa: PLC0415
        ws_create_group,
        ws_delete_group,
        ws_get_groups,
        ws_update_group,
    )
    from .io import (  # noqa: PLC0415
        ws_export_csv,
        ws_export_data,
        ws_generate_qr,
        ws_get_templates,
        ws_import_csv,
    )
    from .objects import (  # noqa: PLC0415
        ws_create_object,
        ws_delete_object,
        ws_get_object,
        ws_get_objects,
        ws_update_object,
    )
    from .tasks import (  # noqa: PLC0415
        ws_complete_task,
        ws_create_task,
        ws_delete_task,
        ws_list_tasks,
        ws_reset_task,
        ws_skip_task,
        ws_update_task,
    )
    from .users import ws_assign_user, ws_list_users, ws_tasks_by_user  # noqa: PLC0415

    websocket_api.async_register_command(hass, ws_get_objects)
    websocket_api.async_register_command(hass, ws_get_object)
    websocket_api.async_register_command(hass, ws_get_statistics)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_create_object)
    websocket_api.async_register_command(hass, ws_update_object)
    websocket_api.async_register_command(hass, ws_delete_object)
    websocket_api.async_register_command(hass, ws_create_task)
    websocket_api.async_register_command(hass, ws_update_task)
    websocket_api.async_register_command(hass, ws_delete_task)
    websocket_api.async_register_command(hass, ws_list_tasks)
    websocket_api.async_register_command(hass, ws_complete_task)
    websocket_api.async_register_command(hass, ws_skip_task)
    websocket_api.async_register_command(hass, ws_reset_task)
    websocket_api.async_register_command(hass, ws_get_templates)
    websocket_api.async_register_command(hass, ws_export_data)
    websocket_api.async_register_command(hass, ws_get_budget_status)
    websocket_api.async_register_command(hass, ws_export_csv)
    websocket_api.async_register_command(hass, ws_import_csv)
    websocket_api.async_register_command(hass, ws_get_groups)
    websocket_api.async_register_command(hass, ws_create_group)
    websocket_api.async_register_command(hass, ws_update_group)
    websocket_api.async_register_command(hass, ws_delete_group)
    websocket_api.async_register_command(hass, ws_analyze_interval)
    websocket_api.async_register_command(hass, ws_apply_suggestion)
    websocket_api.async_register_command(hass, ws_seasonal_overrides)
    websocket_api.async_register_command(hass, ws_set_environmental_entity)
    websocket_api.async_register_command(hass, ws_generate_qr)
    websocket_api.async_register_command(hass, ws_get_settings)
    websocket_api.async_register_command(hass, ws_update_global_settings)
    websocket_api.async_register_command(hass, ws_test_notification)
    websocket_api.async_register_command(hass, ws_list_users)
    websocket_api.async_register_command(hass, ws_assign_user)
    websocket_api.async_register_command(hass, ws_tasks_by_user)
