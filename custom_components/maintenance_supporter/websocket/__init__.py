"""WebSocket API for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
import os
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback

from ..const import (
    BATTERY_FLEET_EXCLUDED,
    BATTERY_FLEET_OBJECT_FLAG,
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
        merged = store.merge_all_tasks(tasks_data)
        # #73: overlay the in-cycle checklist ticks HERE rather than via the
        # merge whitelist — merged dicts feed MaintenanceTask.from_dict all
        # over the coordinator, and this field is presentation state the model
        # never needs.
        for tid, td in merged.items():
            progress = store.get_task_state(tid).get("checklist_progress")
            if progress:
                td["checklist_progress"] = progress
        return merged
    return tasks_data


# How many recent history entries ride in the LIST payload. Chosen to cover
# every non-detail consumer: the quick-actions dialog shows the last 20, the
# detail header the last 3, the calendar card averages costs (≈stable over
# 20), the strategy looks up the latest matching entry. The detail view's
# full timeline/charts fetch everything via `task/history` instead.
#
# The env override exists ONLY for the benchmark harness: setting
# MS_HISTORY_WINDOW to a huge value reproduces the pre-diet payload on the
# same build, so before/after is a measured A/B on identical data instead of
# an extrapolation. Never documented, never read anywhere else.
_HISTORY_WINDOW = int(os.environ.get("MS_HISTORY_WINDOW", "20"))


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
                infos.append(
                    {
                        "entity_id": eid,
                        "friendly_name": state_obj.attributes.get("friendly_name", eid),
                        "unit_of_measurement": state_obj.attributes.get("unit_of_measurement"),
                        "min": state_obj.attributes.get("min"),
                        "max": state_obj.attributes.get("max"),
                        "step": state_obj.attributes.get("step"),
                    }
                )

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
        # v2.20 (#83): unit for `reading`-type tasks; values live in history.
        "reading_unit": task_data.get("reading_unit"),
        # Spare parts: consumption links ([{part_id, quantity}]) and, on an
        # auto-created "buy" reminder, the owning part marker ({part_id}).
        "consumes_parts": task_data.get("consumes_parts"),
        "part_ref": task_data.get("part_ref"),
        "priority": task_data.get("priority", "normal"),
        # v2.10.0 archive: archived_at is the persisted timestamp (None = active);
        # `archived` is the convenience bool the frontend filters on; reason is
        # manual | auto | object. All read from the persisted (static) task dict.
        "archived": task_data.get("archived_at") is not None,
        "archived_at": task_data.get("archived_at"),
        "archived_reason": task_data.get("archived_reason"),
        "responsible_user_id": task_data.get("responsible_user_id"),
        "assignee_pool": task_data.get("assignee_pool", []),
        "required_completion_fields": task_data.get("required_completion_fields", []),
        "rotation_strategy": task_data.get("rotation_strategy"),
        "earliest_completion_days": task_data.get("earliest_completion_days"),
        "entity_slug": task_data.get("entity_slug"),
        # Auto-derived entity_ids for this task's sensor + binary_sensor.
        # Lookup via entity registry by unique_id so we get the actual
        # registered entity_id (which can differ from the unique_id when the
        # user has renamed it). None when registry lookup fails (rare).
        "sensor_entity_id": (
            er.async_get(hass).async_get_entity_id(
                "sensor",
                "maintenance_supporter",
                f"maintenance_supporter_{object_slug}_{task_id}",
            )
            if object_slug
            else None
        ),
        "binary_sensor_entity_id": (
            er.async_get(hass).async_get_entity_id(
                "binary_sensor",
                "maintenance_supporter",
                f"maintenance_supporter_{object_slug}_{task_id}_overdue",
            )
            if object_slug
            else None
        ),
        "trigger_config": trigger_config,
        # Battery Fleet: marks the single aggregate task so the detail view
        # renders the battery section instead of the generic trigger card.
        "battery_fleet_task": task_data.get("battery_fleet_task", False),
        "trigger_entity_info": trigger_entity_info,
        "trigger_entity_infos": trigger_entity_infos,
        "checklist": task_data.get("checklist", []),
        # #73: in-cycle ticks ({item text: bool}, store-merged) — lets the
        # detail view show progress without completing, and the complete
        # dialog prefill what was already done.
        "checklist_progress": task_data.get("checklist_progress", {}),
        "labels": task_data.get("labels", []),
        # Payload diet (perf, 2026-08): the LIST response carries only the
        # most recent entries — at 150+ tasks the full histories dominated
        # the `objects` payload (407 KB measured at just 8 entries/task) and
        # every list consumer reads at most the last 20 (quick-dialog) or an
        # aggregate. The task-detail view fetches the FULL history lazily
        # via `task/history`; `history_count` tells it (and any badge)
        # what exists beyond the window.
        "history": (task_data.get("history") or [])[-_HISTORY_WINDOW:],
        "history_count": len(task_data.get("history") or []),
        # v1.3.0 — both fields are persisted by ws_create_task / ws_update_task
        # and consumed by helpers/action_listener.py on EVENT_TASK_COMPLETED, but
        # were missing from this response builder until issue #50. Without them
        # the task-dialog hydrate path (`task.on_complete_action`) sees undefined
        # on every reload, the user thinks "save didn't work", and the next save
        # of any other field wipes the persisted action because the dialog's
        # local state for the action fields is empty (writes back null).
        "on_complete_action": task_data.get("on_complete_action"),
        "quick_complete_defaults": task_data.get("quick_complete_defaults"),
        # Per-occurrence postpone: the active override date (or null) so the
        # panel can badge "postponed to …" and offer to clear it.
        "due_override": task_data.get("due_override"),
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


_EMPTY_LIST: list[Any] = []
_EMPTY_DICT: dict[str, Any] = {}


def _strip_empty(d: dict[str, Any]) -> dict[str, Any]:
    """Drop keys whose value is None, [] or {} (compact mode, perf wave 2 #3).

    Measured on a 121-task instance: 52 % of the objects payload was keys
    carrying one of these three empties. Only clients that OPT IN via
    ``compact: true`` get stripped responses — they hydrate the handful of
    list/dict-typed keys back client-side (helpers/hydrate-objects.ts; the
    two lists are pinned against each other by test_ws_compact_mode).
    Scalars stay droppable without a table because absent and null read the
    same through JS ``== null`` / ``||`` access. False, 0 and "" are kept —
    they are meaningful values, not absences.
    """
    return {k: v for k, v in d.items() if not (v is None or v in (_EMPTY_LIST, _EMPTY_DICT))}


def _build_object_response(
    hass: HomeAssistant,
    entry: ConfigEntry,
    coordinator_data: dict[str, Any] | None,
    *,
    compact: bool = False,
) -> dict[str, Any]:
    """Build a full object response dict (compact: empty keys stripped)."""
    from ..const import slugify_object_name

    obj_data = entry.data.get(CONF_OBJECT, {})
    tasks_data = _get_merged_tasks(entry)
    ct_tasks = (coordinator_data or {}).get(CONF_TASKS, {})
    object_slug = slugify_object_name(obj_data.get("name", "unknown"))

    tasks = [_build_task_summary(hass, tid, tdata, ct_tasks.get(tid), object_slug) for tid, tdata in tasks_data.items()]

    # (roadmap P2) attached-document count for the objects-table paperclip badge,
    # plus a per-task count so each task row can carry its own document badge.
    from .. import DOCUMENT_STORE_KEY

    doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    object_id = obj_data.get("id", "")
    object_docs = doc_store.for_object(object_id) if doc_store is not None and object_id else []
    document_count = len(object_docs)
    task_doc_counts: dict[str, int] = {}
    for _doc in object_docs:
        for _tid in _doc.get("task_ids") or []:
            task_doc_counts[_tid] = task_doc_counts.get(_tid, 0) + 1
    for _task in tasks:
        _task["document_count"] = task_doc_counts.get(_task["id"], 0)

    # Spare parts: full definition + merged stock + the derived helpers the
    # panel renders (is_low, resolved shopping URL). EVERY persisted field is
    # exposed (#50 field-completeness class).
    from ..const import CONF_PART_SEARCH_URL_TEMPLATE, CONF_PARTS
    from ..helpers.global_options import get_global_options
    from ..helpers.i18n import normalize_language
    from ..helpers.parts import part_is_low, resolve_shopping_url

    rd_parts = getattr(entry, "runtime_data", None)
    part_store = getattr(rd_parts, "store", None) if rd_parts else None
    search_template = get_global_options(hass).get(CONF_PART_SEARCH_URL_TEMPLATE)
    lang = normalize_language(hass)
    parts_payload = []
    for part in (entry.data.get(CONF_PARTS) or {}).values():
        stock = part_store.get_part_stock(part["id"]) if part_store else None
        parts_payload.append(
            {
                **part,
                "stock": stock,
                "is_low": part_is_low(part, stock),
                "shopping_url": resolve_shopping_url(part, search_template, lang),
            }
        )

    resp: dict[str, Any] = {
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
            "ha_device_id": obj_data.get("ha_device_id"),
            "parent_entry_id": obj_data.get("parent_entry_id"),
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
            # v2.20 (N3) seasonal pause: `paused` bool + the optional
            # auto-resume date for the "Paused until …" badge.
            "paused": obj_data.get("paused_at") is not None,
            "paused_at": obj_data.get("paused_at"),
            "paused_until": obj_data.get("paused_until"),
            # v2.20 (N1) replace-flow lineage, both directions.
            "predecessor_entry_id": obj_data.get("predecessor_entry_id"),
            "replaced_by_entry_id": obj_data.get("replaced_by_entry_id"),
            # Battery-fleet markers (field-completeness audit, #50 class):
            # the fleet flag existed only task-level in the response while
            # the OBJECT flag drives find_fleet_entry — consumers (and our
            # own visual harness) had to detect the fleet via a task.
            "battery_fleet": obj_data.get(BATTERY_FLEET_OBJECT_FLAG, False),
            "battery_fleet_excluded": obj_data.get(BATTERY_FLEET_EXCLUDED, []),
            # (roadmap P2) count of attached documents (files + web-links) for
            # the objects-table paperclip badge; computed, not persisted.
            "document_count": document_count,
            # An UPLOADED manual (category tag "manual") is the same affordance
            # as documentation_url — expose them so the "manual" column and the
            # object header can fall back instead of rendering "—" next to an
            # object that plainly has its manual attached.
            "manual_docs": [
                {
                    "id": d.get("id"),
                    "title": d.get("title") or d.get("filename") or "",
                    "kind": d.get("kind"),
                    "url": d.get("url"),
                }
                for d in object_docs
                if "manual" in (d.get("tags") or [])
            ],
        },
        "tasks": tasks,
        "parts": parts_payload,
    }
    if compact:
        resp["object"] = _strip_empty(resp["object"])
        resp["tasks"] = [_strip_empty(t) for t in tasks]
        resp = _strip_empty(resp)
    return resp


def _get_global_entry(hass: HomeAssistant) -> ConfigEntry | None:
    """Get the global config entry (thin re-export of the shared helper)."""
    from ..helpers.global_options import get_global_entry

    return get_global_entry(hass)


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
            ref
            for ref in old_refs
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
        ws_set_adaptive,
        ws_set_environmental_entity,
    )
    from .battery_fleet import (
        ws_battery_fleet_history,
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_overview,
        ws_battery_fleet_set_excluded,
        ws_battery_fleet_setup,
        ws_battery_fleet_status,
    )
    from .dashboard import (
        ws_get_budget_status,
        ws_get_settings,
        ws_get_statistics,
        ws_notify_user_targets,
        ws_schedule_preview,
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
    from .integration_setups import (
        ws_adopt_integration_setups,
        ws_discover_integration_setups,
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
        ws_version,
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
        ws_pause_object,
        ws_replace_object,
        ws_resume_object,
        ws_unarchive_object,
        ws_update_object,
    )
    from .parts import (
        ws_create_part,
        ws_delete_part,
        ws_restock_part,
        ws_update_part,
    )
    from .problem_sensors import (
        ws_adopt_problem_sensors,
        ws_discover_problem_sensors,
    )
    from .saved_views import (
        ws_delete_saved_view,
        ws_list_saved_views,
        ws_save_saved_view,
    )
    from .tags import ws_list_tags
    from .tasks import (
        ws_archive_task,
        ws_checklist_progress,
        ws_complete_task,
        ws_create_task,
        ws_delete_task,
        ws_duplicate_task,
        ws_list_tasks,
        ws_postpone_task,
        ws_quick_complete_task,
        ws_reset_task,
        ws_skip_task,
        ws_snooze_task,
        ws_task_history,
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
    websocket_api.async_register_command(hass, ws_pause_object)
    websocket_api.async_register_command(hass, ws_resume_object)
    websocket_api.async_register_command(hass, ws_replace_object)
    websocket_api.async_register_command(hass, ws_create_task)
    websocket_api.async_register_command(hass, ws_update_task)
    websocket_api.async_register_command(hass, ws_delete_task)
    websocket_api.async_register_command(hass, ws_duplicate_task)
    websocket_api.async_register_command(hass, ws_archive_task)
    websocket_api.async_register_command(hass, ws_unarchive_task)
    websocket_api.async_register_command(hass, ws_list_tasks)
    websocket_api.async_register_command(hass, ws_task_history)
    websocket_api.async_register_command(hass, ws_complete_task)
    websocket_api.async_register_command(hass, ws_quick_complete_task)
    websocket_api.async_register_command(hass, ws_checklist_progress)
    websocket_api.async_register_command(hass, ws_skip_task)
    websocket_api.async_register_command(hass, ws_reset_task)
    websocket_api.async_register_command(hass, ws_snooze_task)
    websocket_api.async_register_command(hass, ws_postpone_task)
    websocket_api.async_register_command(hass, ws_create_part)
    websocket_api.async_register_command(hass, ws_update_part)
    websocket_api.async_register_command(hass, ws_delete_part)
    websocket_api.async_register_command(hass, ws_restock_part)
    websocket_api.async_register_command(hass, ws_update_history_entry)
    websocket_api.async_register_command(hass, ws_get_templates)
    websocket_api.async_register_command(hass, ws_version)
    websocket_api.async_register_command(hass, ws_export_data)
    websocket_api.async_register_command(hass, ws_get_budget_status)
    websocket_api.async_register_command(hass, ws_schedule_preview)
    websocket_api.async_register_command(hass, ws_export_csv)
    websocket_api.async_register_command(hass, ws_export_objects_csv)
    websocket_api.async_register_command(hass, ws_import_csv)
    websocket_api.async_register_command(hass, ws_import_json)
    websocket_api.async_register_command(hass, ws_discover_problem_sensors)
    websocket_api.async_register_command(hass, ws_adopt_problem_sensors)
    websocket_api.async_register_command(hass, ws_battery_fleet_overview)
    websocket_api.async_register_command(hass, ws_battery_fleet_history)
    websocket_api.async_register_command(hass, ws_battery_fleet_status)
    websocket_api.async_register_command(hass, ws_battery_fleet_setup)
    websocket_api.async_register_command(hass, ws_battery_fleet_mark_replaced)
    websocket_api.async_register_command(hass, ws_battery_fleet_set_excluded)
    websocket_api.async_register_command(hass, ws_discover_integration_setups)
    websocket_api.async_register_command(hass, ws_adopt_integration_setups)
    websocket_api.async_register_command(hass, ws_list_saved_views)
    websocket_api.async_register_command(hass, ws_save_saved_view)
    websocket_api.async_register_command(hass, ws_delete_saved_view)
    websocket_api.async_register_command(hass, ws_get_groups)
    websocket_api.async_register_command(hass, ws_create_group)
    websocket_api.async_register_command(hass, ws_update_group)
    websocket_api.async_register_command(hass, ws_delete_group)
    websocket_api.async_register_command(hass, ws_analyze_interval)
    websocket_api.async_register_command(hass, ws_apply_suggestion)
    websocket_api.async_register_command(hass, ws_seasonal_overrides)
    websocket_api.async_register_command(hass, ws_set_adaptive)
    websocket_api.async_register_command(hass, ws_set_environmental_entity)
    websocket_api.async_register_command(hass, ws_generate_qr)
    websocket_api.async_register_command(hass, ws_batch_generate_qr)
    websocket_api.async_register_command(hass, ws_get_settings)
    websocket_api.async_register_command(hass, ws_update_global_settings)
    websocket_api.async_register_command(hass, ws_test_notification)
    websocket_api.async_register_command(hass, ws_notify_user_targets)
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


def foreign_part_resolver(hass):
    """Callback for ``sanitize_consumes_parts``: which parts an entry owns.

    Returns None for an entry that does not exist or is not a maintenance
    object, so a link to it is dropped rather than trusted.
    """
    from ..const import CONF_PARTS, DOMAIN, GLOBAL_UNIQUE_ID

    def _resolve(entry_id: str):
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
            return None
        return set(entry.data.get(CONF_PARTS) or {})

    return _resolve
