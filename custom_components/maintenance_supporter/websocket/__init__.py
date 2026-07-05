"""WebSocket API for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback

from ..const import (
    CONF_GROUPS,
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from ..helpers.aggregate import get_object_entries, get_runtime_data

_LOGGER = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Shared helpers (used by handler submodules)
# ---------------------------------------------------------------------------


# Re-exported under historical underscore names for handler submodules
# (analysis.py, vacation.py) that import them from this package. The actual
# logic lives in helpers.aggregate (single source for cross-entry aggregation).
_get_object_entries = get_object_entries
_get_runtime_data = get_runtime_data


def _get_merged_tasks(entry: ConfigEntry) -> dict[str, Any]:
    """Return merged task data (static ConfigEntry + dynamic Store) for an entry."""
    tasks_data = entry.data.get(CONF_TASKS, {})
    rd = getattr(entry, "runtime_data", None)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        return store.merge_all_tasks(tasks_data)
    return tasks_data


def _build_task_summary(
    hass: HomeAssistant,
    task_id: str,
    task_data: dict[str, Any],
    coordinator_task: dict[str, Any] | None,
    object_slug: str | None = None,
) -> dict[str, Any]:
    """Build a task summary dict for WS responses.

    object_slug (when provided) lets the response include the auto-derived
    sensor + binary_sensor entity_ids for this task, so frontend cards can
    use HA's native entity_ids: filter pattern without re-implementing the
    slugify logic.
    """
    from homeassistant.helpers import entity_registry as er

    from ..entity.triggers import normalize_entity_ids
    from ..helpers.schedule import Schedule, read_legacy_fields

    ct = coordinator_task or {}

    # Recurrence is echoed in the flat shape the task-dialog expects (derived
    # from whichever storage shape this task uses — see read_legacy_fields /
    # issue #58) AND as the nested `schedule` object, which is the only way to
    # express the calendar kinds (weekdays / nth_weekday / day_of_month).
    sched = read_legacy_fields(task_data)
    schedule_obj = Schedule.parse(task_data).to_dict()

    # Enrich trigger config with entity friendly name and state info
    trigger_config = task_data.get("trigger_config")
    trigger_entity_info: dict[str, Any] | None = None
    trigger_entity_infos: list[dict[str, Any]] | None = None

    if trigger_config:
        entity_ids = normalize_entity_ids(trigger_config)

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
        "schedule_type": sched["schedule_type"],
        "interval_days": sched["interval_days"],
        # interval_unit + due_date are persisted by ws_create_task/ws_update_task
        # and the config/options flows. They MUST be echoed here (same #50 trap as
        # on_complete_action below): without interval_unit the task-dialog hydrates
        # `task.interval_unit || "days"` = "days", so the next save silently resets
        # a months/years task back to days and corrupts next_due. (issue #58)
        "interval_unit": sched["interval_unit"],
        "due_date": sched["due_date"],
        "interval_anchor": sched["interval_anchor"],
        # Nested recurrence object — the frontend reads this for the calendar
        # kinds; the flat fields above remain for interval/one_time back-compat.
        "schedule": schedule_obj,
        "last_planned_due": task_data.get("last_planned_due"),
        "schedule_time": task_data.get("schedule_time"),
        "warning_days": task_data.get("warning_days", DEFAULT_WARNING_DAYS),
        "last_performed": task_data.get("last_performed"),
        "notes": task_data.get("notes"),
        "documentation_url": task_data.get("documentation_url"),
        "custom_icon": task_data.get("custom_icon"),
        "nfc_tag_id": task_data.get("nfc_tag_id"),
        "priority": task_data.get("priority", "normal"),
        # v2.10.0 archive: archived_at is the persisted timestamp (None = active);
        # `archived` is the convenience bool the frontend filters on; reason is
        # manual | auto | object. All read from the persisted (static) task dict.
        "archived": task_data.get("archived_at") is not None,
        "archived_at": task_data.get("archived_at"),
        "archived_reason": task_data.get("archived_reason"),
        "responsible_user_id": task_data.get("responsible_user_id"),
        "assignee_pool": task_data.get("assignee_pool", []),
        "rotation_strategy": task_data.get("rotation_strategy"),
        "entity_slug": task_data.get("entity_slug"),
        # Auto-derived entity_ids for this task's sensor + binary_sensor.
        # Lookup via entity registry by unique_id so we get the actual
        # registered entity_id (which can differ from the unique_id when the
        # user has renamed it). None when registry lookup fails (rare).
        "sensor_entity_id": (
            er.async_get(hass).async_get_entity_id(
                "sensor", "maintenance_supporter",
                f"maintenance_supporter_{object_slug}_{task_id}",
            ) if object_slug else None
        ),
        "binary_sensor_entity_id": (
            er.async_get(hass).async_get_entity_id(
                "binary_sensor", "maintenance_supporter",
                f"maintenance_supporter_{object_slug}_{task_id}_overdue",
            ) if object_slug else None
        ),
        "trigger_config": trigger_config,
        "trigger_entity_info": trigger_entity_info,
        "trigger_entity_infos": trigger_entity_infos,
        "checklist": task_data.get("checklist", []),
        "labels": task_data.get("labels", []),
        "history": task_data.get("history", []),
        # v1.3.0 — both fields are persisted by ws_create_task / ws_update_task
        # and consumed by helpers/action_listener.py on EVENT_TASK_COMPLETED, but
        # were missing from this response builder until issue #50. Without them
        # the task-dialog hydrate path (`task.on_complete_action`) sees undefined
        # on every reload, the user thinks "save didn't work", and the next save
        # of any other field wipes the persisted action because the dialog's
        # local state for the action fields is empty (writes back null).
        "on_complete_action": task_data.get("on_complete_action"),
        "quick_complete_defaults": task_data.get("quick_complete_defaults"),
        # Computed fields from coordinator
        "status": ct.get("_status", "ok"),
        "is_done": ct.get("_is_done", False),
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
    from ..const import slugify_object_name

    obj_data = entry.data.get(CONF_OBJECT, {})
    tasks_data = _get_merged_tasks(entry)
    ct_tasks = (coordinator_data or {}).get(CONF_TASKS, {})
    object_slug = slugify_object_name(obj_data.get("name", "unknown"))

    tasks = [
        _build_task_summary(hass, tid, tdata, ct_tasks.get(tid), object_slug)
        for tid, tdata in tasks_data.items()
    ]

    # (roadmap P2) attached-document count for the objects-table paperclip badge.
    from .. import DOCUMENT_STORE_KEY

    doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    object_id = obj_data.get("id", "")
    document_count = (
        len(doc_store.for_object(object_id)) if doc_store is not None and object_id else 0
    )

    return {
        "entry_id": entry.entry_id,
        "object": {
            "id": obj_data.get("id", ""),
            "name": obj_data.get("name", ""),
            "area_id": obj_data.get("area_id"),
            "manufacturer": obj_data.get("manufacturer"),
            "model": obj_data.get("model"),
            "serial_number": obj_data.get("serial_number"),
            "installation_date": obj_data.get("installation_date"),
            # (#67): warranty expiry — exposed for the asset table + detail view
            "warranty_expiry": obj_data.get("warranty_expiry"),
            # v1.4.0 (#43): expose to the frontend so the manual link
            # renders in the object detail header AND, since v1.4.1, on
            # every task detail page belonging to this object.
            "documentation_url": obj_data.get("documentation_url"),
            # v1.4.10 (#46): free-form notes shown below the meta block.
            "notes": obj_data.get("notes"),
            # v2.10.0 archive: object-level archived state. `archived` bool +
            # the raw timestamp so the panel can hide it by default and show
            # "archived on …" in the Archived section.
            "archived": obj_data.get("archived_at") is not None,
            "archived_at": obj_data.get("archived_at"),
            # (roadmap P2) count of attached documents (files + web-links) for
            # the objects-table paperclip badge; computed, not persisted.
            "document_count": document_count,
        },
        "tasks": tasks,
    }


def _get_global_entry(hass: HomeAssistant) -> ConfigEntry | None:
    """Get the global config entry."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            return entry
    return None


def _load_object_entry(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    *,
    not_found_message: str = "Object not found",
) -> ConfigEntry | None:
    """Resolve ``msg["entry_id"]`` to an OBJECT entry (not the global one).

    Sends a ``not_found`` WS error and returns None when the entry is
    missing, belongs to another domain, or is the global entry. Callers
    must early-return on None — same shape as the manual guard pattern
    that was duplicated across 12 WS handlers before this helper.

    The helper centralises the three-part guard introduced ad-hoc in
    every CRUD handler (entry None / wrong domain / global) so future
    additions can't forget any of the three checks.
    """
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", not_found_message)
        return None
    return entry


def object_id_for_entry(entry: ConfigEntry) -> str:
    """Return the stable document key for an object entry.

    Documents are keyed by the object's own ``id`` (a uuid hex persisted in the
    entry data) rather than the ``entry_id`` so the association survives
    export/import — an imported object keeps its id but gets a fresh entry_id.
    Falls back to ``entry_id`` only for legacy entries created before object ids
    existed.
    """
    oid = entry.data.get(CONF_OBJECT, {}).get("id")
    return oid if isinstance(oid, str) and oid else entry.entry_id


def cleanup_group_refs(
    hass: HomeAssistant,
    *,
    entry_id: str | None = None,
    task_id: str | None = None,
) -> None:
    """Remove deleted task/object references from all groups.

    Pass entry_id to remove all refs for that object.
    Pass task_id to remove refs for a specific task.
    """
    global_entry = _get_global_entry(hass)
    if global_entry is None:
        return

    options = dict(global_entry.options or global_entry.data)
    groups = options.get(CONF_GROUPS)
    if not groups:
        return

    groups = dict(groups)
    changed = False
    for gid, group in groups.items():
        old_refs = group.get("task_refs", [])
        new_refs = [
            ref for ref in old_refs
            if not (
                (entry_id is not None and ref.get("entry_id") == entry_id)
                or (task_id is not None and ref.get("task_id") == task_id)
            )
        ]
        if len(new_refs) != len(old_refs):
            groups[gid] = {**group, "task_refs": new_refs}
            changed = True

    if changed:
        options[CONF_GROUPS] = groups
        hass.config_entries.async_update_entry(global_entry, options=options)


# ---------------------------------------------------------------------------
# Re-exports for backward compatibility (used by tests)
# ---------------------------------------------------------------------------

from .tasks import (  # noqa: F401
    _validate_compound_trigger,
    _validate_trigger_config,
)

# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    """Register all WebSocket commands."""
    from .analysis import (
        ws_analyze_interval,
        ws_apply_suggestion,
        ws_seasonal_overrides,
        ws_set_environmental_entity,
    )
    from .dashboard import (
        ws_get_budget_status,
        ws_get_settings,
        ws_get_statistics,
        ws_subscribe,
        ws_test_notification,
        ws_update_global_settings,
    )
    from .documents import (
        ws_documents_add_link,
        ws_documents_delete,
        ws_documents_list,
        ws_documents_search,
        ws_documents_storage,
        ws_documents_update,
    )
    from .groups import (
        ws_create_group,
        ws_delete_group,
        ws_get_groups,
        ws_update_group,
    )
    from .io import (
        ws_batch_generate_qr,
        ws_export_csv,
        ws_export_data,
        ws_export_objects_csv,
        ws_generate_qr,
        ws_get_templates,
        ws_import_csv,
        ws_import_json,
    )
    from .objects import (
        ws_archive_object,
        ws_create_from_template,
        ws_create_object,
        ws_delete_object,
        ws_duplicate_object,
        ws_entity_attributes,
        ws_get_object,
        ws_get_objects,
        ws_unarchive_object,
        ws_update_object,
    )
    from .tags import ws_list_tags
    from .tasks import (
        ws_archive_task,
        ws_complete_task,
        ws_create_task,
        ws_delete_task,
        ws_duplicate_task,
        ws_list_tasks,
        ws_quick_complete_task,
        ws_reset_task,
        ws_skip_task,
        ws_unarchive_task,
        ws_update_history_entry,
        ws_update_task,
    )
    from .users import ws_assign_user, ws_list_users, ws_tasks_by_user
    from .vacation import (
        ws_vacation_end_now,
        ws_vacation_preview,
        ws_vacation_state,
        ws_vacation_update,
    )

    websocket_api.async_register_command(hass, ws_get_objects)
    websocket_api.async_register_command(hass, ws_get_object)
    websocket_api.async_register_command(hass, ws_get_statistics)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_create_object)
    websocket_api.async_register_command(hass, ws_update_object)
    websocket_api.async_register_command(hass, ws_delete_object)
    websocket_api.async_register_command(hass, ws_duplicate_object)
    websocket_api.async_register_command(hass, ws_create_from_template)
    websocket_api.async_register_command(hass, ws_archive_object)
    websocket_api.async_register_command(hass, ws_unarchive_object)
    websocket_api.async_register_command(hass, ws_create_task)
    websocket_api.async_register_command(hass, ws_update_task)
    websocket_api.async_register_command(hass, ws_delete_task)
    websocket_api.async_register_command(hass, ws_duplicate_task)
    websocket_api.async_register_command(hass, ws_archive_task)
    websocket_api.async_register_command(hass, ws_unarchive_task)
    websocket_api.async_register_command(hass, ws_list_tasks)
    websocket_api.async_register_command(hass, ws_complete_task)
    websocket_api.async_register_command(hass, ws_quick_complete_task)
    websocket_api.async_register_command(hass, ws_skip_task)
    websocket_api.async_register_command(hass, ws_reset_task)
    websocket_api.async_register_command(hass, ws_update_history_entry)
    websocket_api.async_register_command(hass, ws_get_templates)
    websocket_api.async_register_command(hass, ws_export_data)
    websocket_api.async_register_command(hass, ws_get_budget_status)
    websocket_api.async_register_command(hass, ws_export_csv)
    websocket_api.async_register_command(hass, ws_export_objects_csv)
    websocket_api.async_register_command(hass, ws_import_csv)
    websocket_api.async_register_command(hass, ws_import_json)
    websocket_api.async_register_command(hass, ws_get_groups)
    websocket_api.async_register_command(hass, ws_create_group)
    websocket_api.async_register_command(hass, ws_update_group)
    websocket_api.async_register_command(hass, ws_delete_group)
    websocket_api.async_register_command(hass, ws_analyze_interval)
    websocket_api.async_register_command(hass, ws_apply_suggestion)
    websocket_api.async_register_command(hass, ws_seasonal_overrides)
    websocket_api.async_register_command(hass, ws_set_environmental_entity)
    websocket_api.async_register_command(hass, ws_generate_qr)
    websocket_api.async_register_command(hass, ws_batch_generate_qr)
    websocket_api.async_register_command(hass, ws_get_settings)
    websocket_api.async_register_command(hass, ws_update_global_settings)
    websocket_api.async_register_command(hass, ws_test_notification)
    websocket_api.async_register_command(hass, ws_list_users)
    websocket_api.async_register_command(hass, ws_assign_user)
    websocket_api.async_register_command(hass, ws_tasks_by_user)
    websocket_api.async_register_command(hass, ws_entity_attributes)
    websocket_api.async_register_command(hass, ws_list_tags)
    websocket_api.async_register_command(hass, ws_vacation_state)
    websocket_api.async_register_command(hass, ws_vacation_update)
    websocket_api.async_register_command(hass, ws_vacation_preview)
    websocket_api.async_register_command(hass, ws_vacation_end_now)
    websocket_api.async_register_command(hass, ws_documents_list)
    websocket_api.async_register_command(hass, ws_documents_storage)
    websocket_api.async_register_command(hass, ws_documents_add_link)
    websocket_api.async_register_command(hass, ws_documents_update)
    websocket_api.async_register_command(hass, ws_documents_delete)
    websocket_api.async_register_command(hass, ws_documents_search)
