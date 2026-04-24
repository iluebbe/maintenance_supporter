"""WebSocket handlers for export, import, CSV, QR, and templates."""

from __future__ import annotations

import json as json_mod
import logging
import re
from functools import lru_cache
from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import (
    CONF_OBJECT,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_CHECKLIST_ITEM_LENGTH,
    MAX_CHECKLIST_ITEMS,
    MAX_ID_LENGTH,
)
from ..helpers.global_options import get_default_warning_days
from ..helpers.qr_generator import (
    _ACTION_ICON_MAP,
    build_qr_url,
    generate_qr_svg,
    generate_qr_svg_data_uri,
)
from ..websocket.tasks import _check_nfc_tag_duplicate

_LOGGER = logging.getLogger(__name__)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/templates"}
)
@websocket_api.async_response
async def ws_get_templates(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all available maintenance templates."""
    from ..templates import TEMPLATE_CATEGORIES, TEMPLATES

    result = {
        "categories": {
            cat_id: {
                k: v for k, v in cat.items()
            }
            for cat_id, cat in TEMPLATE_CATEGORIES.items()
        },
        "templates": [
            {
                "id": t.id,
                "name": t.name,
                "category": t.category,
                "tasks": [
                    {
                        "name": tt.name,
                        "type": tt.type,
                        "schedule_type": tt.schedule_type,
                        "interval_days": tt.interval_days,
                        "warning_days": tt.warning_days,
                    }
                    for tt in t.tasks
                ],
            }
            for t in TEMPLATES
        ],
    }
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/export",
        vol.Optional("format", default="json"): vol.In(["json", "yaml"]),
        vol.Optional("include_history", default=True): bool,
    }
)
@websocket_api.async_response
async def ws_export_data(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Export all maintenance data as JSON or YAML."""
    from ..export import build_export_data, serialize_export

    fmt = msg.get("format", "json")
    include_history = msg.get("include_history", True)

    # Phase 1: gather data on the event loop (accesses HA APIs)
    data = build_export_data(hass, include_history=include_history)

    # Phase 2: serialize in executor (CPU-bound, no HA API calls)
    result = await hass.async_add_executor_job(serialize_export, data, fmt)

    connection.send_result(msg["id"], {"format": fmt, "data": result})


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/csv/export"}
)
@websocket_api.async_response
async def ws_export_csv(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Export all maintenance data as CSV."""
    from ..helpers.csv_handler import export_objects_csv

    csv_data = export_objects_csv(hass)
    connection.send_result(msg["id"], {"csv": csv_data})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/csv/import",
        vol.Required("csv_content"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import_csv(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Import maintenance objects from CSV content."""
    from ..helpers.csv_handler import import_objects_csv

    csv_content = msg["csv_content"]
    # Guard against oversized payloads (max 1MB / 1000 objects)
    if len(csv_content) > 1_048_576:
        connection.send_error(msg["id"], "too_large", "CSV content exceeds 1MB limit")
        return

    objects = import_objects_csv(csv_content, hass=hass)
    if len(objects) > 1000:
        connection.send_error(msg["id"], "too_many", "CSV contains more than 1000 objects")
        return

    if not objects:
        connection.send_error(msg["id"], "empty_csv", "No valid objects found in CSV")
        return

    created = []
    errors: list[dict[str, str]] = []
    for idx, obj_data in enumerate(objects):
        # Check for NFC tag duplicates in CSV-imported tasks
        nfc_warnings: list[str] = []
        for t_data in obj_data.get("tasks", {}).values():
            nfc_val = t_data.get("nfc_tag_id")
            if nfc_val:
                nfc_warn = _check_nfc_tag_duplicate(hass, nfc_val)
                if nfc_warn:
                    nfc_warnings.append(nfc_warn)

        try:
            result = await hass.config_entries.flow.async_init(
                DOMAIN,
                context={"source": "websocket"},
                data={
                    CONF_OBJECT: obj_data["object"],
                    CONF_TASKS: obj_data["tasks"],
                },
            )
        except Exception:
            obj_name = obj_data.get("object", {}).get("name", f"row {idx + 1}")
            _LOGGER.exception("CSV import failed for %s", obj_name)
            errors.append({"name": obj_name, "reason": "unexpected error"})
            continue
        if result["type"] == "create_entry":
            entry_info: dict[str, Any] = {
                "entry_id": result["result"].entry_id,
                "name": obj_data["object"].get("name", ""),
                "task_count": len(obj_data["tasks"]),
            }
            if nfc_warnings:
                entry_info["warnings"] = nfc_warnings
            created.append(entry_info)
        else:
            obj_name = obj_data.get("object", {}).get("name", f"row {idx + 1}")
            errors.append({"name": obj_name, "reason": result.get("reason", "unknown")})

    resp: dict[str, Any] = {
        "imported": created,
        "total": len(objects),
        "created": len(created),
    }
    if errors:
        resp["errors"] = errors
    connection.send_result(msg["id"], resp)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/json/import",
        vol.Required("json_content"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import_json(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Import maintenance objects from JSON content (exported by /export)."""
    raw = msg["json_content"]
    if len(raw) > 10_485_760:
        connection.send_error(msg["id"], "too_large", "JSON content exceeds 10MB limit")
        return

    try:
        data = json_mod.loads(raw)
    except (json_mod.JSONDecodeError, ValueError):
        connection.send_error(msg["id"], "invalid_json", "Content is not valid JSON")
        return

    if not isinstance(data, dict) or "objects" not in data:
        connection.send_error(msg["id"], "invalid_format", "JSON must contain an 'objects' array")
        return

    objects = data["objects"]
    if not isinstance(objects, list):
        connection.send_error(msg["id"], "invalid_format", "'objects' must be an array")
        return

    if len(objects) > 1000:
        connection.send_error(msg["id"], "too_many", "JSON contains more than 1000 objects")
        return

    if not objects:
        connection.send_error(msg["id"], "empty", "No objects found in JSON")
        return

    created = []
    errors: list[dict[str, str]] = []
    for idx, obj_entry in enumerate(objects):
        obj_data = obj_entry.get("object", {})
        obj_name = (obj_data.get("name") or "").strip()
        if not obj_name:
            errors.append({"name": f"object {idx + 1}", "reason": "missing name"})
            continue

        obj_id = uuid4().hex
        import_obj: dict[str, Any] = {
            "id": obj_id,
            "name": obj_name,
            "manufacturer": obj_data.get("manufacturer"),
            "model": obj_data.get("model"),
            "serial_number": obj_data.get("serial_number"),
            "area_id": obj_data.get("area_id"),
            "installation_date": obj_data.get("installation_date"),
            "task_ids": [],
        }

        import_tasks: dict[str, dict[str, Any]] = {}
        for task_entry in obj_entry.get("tasks", []):
            task_name = (task_entry.get("name") or "").strip()
            if not task_name:
                continue
            task_id = uuid4().hex
            task_data: dict[str, Any] = {
                "id": task_id,
                "object_id": obj_id,
                "name": task_name,
                "type": task_entry.get("type", "custom"),
                "enabled": task_entry.get("enabled", True),
                "schedule_type": task_entry.get("schedule_type", "time_based"),
                "warning_days": task_entry.get("warning_days", get_default_warning_days(hass)),
                "history": task_entry.get("history", []),
            }
            for key in (
                "interval_days", "interval_anchor", "last_planned_due",
                "last_performed", "notes", "documentation_url",
                "custom_icon", "nfc_tag_id", "responsible_user_id",
                "entity_slug", "trigger_config", "adaptive_config",
                "checklist", "schedule_time",
            ):
                val = task_entry.get(key)
                if val is not None:
                    task_data[key] = val

            # Sanitize critical fields from import data
            iv = task_data.get("interval_days")
            if iv is not None and (not isinstance(iv, int) or iv < 1):
                task_data.pop("interval_days", None)
            lp = task_data.get("last_performed")
            if lp is not None:
                try:
                    from datetime import date
                    date.fromisoformat(lp)
                except (ValueError, TypeError):
                    task_data.pop("last_performed", None)
            wd = task_data.get("warning_days")
            if not isinstance(wd, int) or wd < 0 or wd > 365:
                task_data["warning_days"] = get_default_warning_days(hass)
            # Sanitize checklist: only keep string items within length budget,
            # cap total items. Drops malformed entries silently rather than
            # rejecting the whole import — same forgiving model as the other
            # fields above.
            cl = task_data.get("checklist")
            if cl is not None:
                if not isinstance(cl, list):
                    task_data.pop("checklist", None)
                else:
                    cleaned = [
                        item.strip()
                        for item in cl
                        if isinstance(item, str) and len(item) <= MAX_CHECKLIST_ITEM_LENGTH
                    ]
                    cleaned = [c for c in cleaned if c]
                    task_data["checklist"] = cleaned[:MAX_CHECKLIST_ITEMS]

            # schedule_time: strict HH:MM, otherwise drop
            st = task_data.get("schedule_time")
            if st is not None:
                if not isinstance(st, str) or not re.fullmatch(
                    r"^([01]\d|2[0-3]):[0-5]\d$", st
                ):
                    task_data.pop("schedule_time", None)

            import_tasks[task_id] = task_data
            import_obj["task_ids"].append(task_id)

        # Check for NFC tag duplicates across imported tasks
        nfc_warnings: list[str] = []
        for t_data in import_tasks.values():
            nfc_val = t_data.get("nfc_tag_id")
            if nfc_val:
                nfc_warn = _check_nfc_tag_duplicate(hass, nfc_val)
                if nfc_warn:
                    nfc_warnings.append(nfc_warn)

        try:
            result = await hass.config_entries.flow.async_init(
                DOMAIN,
                context={"source": "websocket"},
                data={
                    CONF_OBJECT: import_obj,
                    CONF_TASKS: import_tasks,
                },
            )
        except Exception:
            _LOGGER.exception("JSON import failed for %s", obj_name)
            errors.append({"name": obj_name, "reason": "unexpected error"})
            continue
        if result["type"] == "create_entry":
            entry_info: dict[str, Any] = {
                "entry_id": result["result"].entry_id,
                "name": obj_name,
                "task_count": len(import_tasks),
            }
            if nfc_warnings:
                entry_info["warnings"] = nfc_warnings
            created.append(entry_info)
        else:
            errors.append({"name": obj_name, "reason": result.get("reason", "unknown")})

    resp: dict[str, Any] = {
        "imported": created,
        "total": len(objects),
        "created": len(created),
    }
    if errors:
        resp["errors"] = errors
    connection.send_result(msg["id"], resp)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/qr/generate",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("action", default="view"): vol.In(["view", "complete"]),
        vol.Optional("url_mode", default="server"): vol.In(
            ["server", "local", "companion"]
        ),
        vol.Optional("base_url"): vol.Url(),
    }
)
@websocket_api.async_response
async def ws_generate_qr(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Generate a QR code for a maintenance object or task."""
    entry_id = msg["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    obj_data = entry.data.get(CONF_OBJECT, {})
    task_id = msg.get("task_id")
    task_name = None

    if task_id:
        tasks_data = entry.data.get(CONF_TASKS, {})
        if task_id not in tasks_data:
            connection.send_error(msg["id"], "not_found", "Task not found")
            return
        task_name = tasks_data[task_id].get("name", "")

    action = msg.get("action", "view")
    url_mode = msg.get("url_mode", "server")
    base_url = msg.get("base_url")
    try:
        url = build_qr_url(
            hass, entry_id, task_id=task_id, action=action,
            base_url_override=base_url, url_mode=url_mode,
        )
    except ValueError as err:
        connection.send_error(msg["id"], "no_url", str(err))
        return
    from functools import partial

    icon = _ACTION_ICON_MAP.get(action)
    gen_fn = partial(generate_qr_svg_data_uri, url, border=2, icon=icon)
    svg_data_uri = await hass.async_add_executor_job(gen_fn)

    connection.send_result(
        msg["id"],
        {
            "svg_data_uri": svg_data_uri,
            "url": url,
            "label": {
                "object_name": obj_data.get(CONF_OBJECT_NAME, ""),
                "manufacturer": obj_data.get(CONF_OBJECT_MANUFACTURER, ""),
                "model": obj_data.get(CONF_OBJECT_MODEL, ""),
                "task_name": task_name,
            },
        },
    )


# Batch QR generation — used by the "Print QR codes" panel section.
#
# Typical household: 20-30 tasks × 2 actions = 40-60 QRs. Benchmarked at
# ~40 ms each with icon embed (HIGH ECC) → 2.5 s for 60, 7 s for 200.
# The raw SVG is ~32 KB each, so 200 × 32 KB = ~6 MB over the websocket;
# we cap at 200 to keep the payload bounded and the print layout sane
# (generous 6 QRs/A4 page = 34 pages).
_MAX_BATCH_QRS = 200

# LRU cache keyed on (url, icon). Two users printing the same task twice
# in a session hit this cache; so does re-running the batch after
# narrowing the filter. Bounded size so long-running HA instances with
# thousands of task-action combos can't grow the cache forever.
@lru_cache(maxsize=512)
def _cached_qr_svg(url: str, icon: str | None) -> str:
    return generate_qr_svg(url, border=2, icon=icon)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/qr/batch_generate",
        vol.Optional("entry_ids"): vol.All(
            [vol.All(str, vol.Length(max=MAX_ID_LENGTH))],
            vol.Length(max=1000),
        ),
        vol.Optional("task_ids"): vol.All(
            [vol.All(str, vol.Length(max=MAX_ID_LENGTH))],
            vol.Length(max=2000),
        ),
        vol.Required("actions"): vol.All(
            [vol.In(["view", "complete", "skip"])],
            vol.Length(min=1, max=3),
        ),
        vol.Optional("url_mode", default="server"): vol.In(
            ["server", "local", "companion"]
        ),
        vol.Optional("base_url"): vol.Url(),
    }
)
@websocket_api.async_response
async def ws_batch_generate_qr(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Generate multiple QR codes in one call for the print-all-QRs page.

    Resolves (entry × task × action) combinations and returns SVG strings
    ready to inline into a printable grid. Empty ``entry_ids`` / ``task_ids``
    filters mean "all" at that level.
    """
    # Resolve target entries (always exclude the global config entry).
    all_entries = [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.unique_id != GLOBAL_UNIQUE_ID
    ]
    entry_filter = msg.get("entry_ids")
    if entry_filter:
        wanted = set(entry_filter)
        entries = [e for e in all_entries if e.entry_id in wanted]
    else:
        entries = all_entries

    # Build the flat (entry_id, object_name, task_id, task_name) target list,
    # honouring the optional task_ids filter.
    task_filter = set(msg["task_ids"]) if msg.get("task_ids") else None
    targets: list[tuple[str, str, str, str]] = []
    for entry in entries:
        obj_name = entry.data.get(CONF_OBJECT, {}).get(CONF_OBJECT_NAME, "")
        tasks_data = entry.data.get(CONF_TASKS, {})
        for task_id, task_data in tasks_data.items():
            if task_filter is not None and task_id not in task_filter:
                continue
            targets.append(
                (entry.entry_id, obj_name, task_id, task_data.get("name", ""))
            )

    actions: list[str] = msg["actions"]
    total = len(targets) * len(actions)
    if total == 0:
        connection.send_result(msg["id"], {"qrs": [], "total": 0})
        return
    if total > _MAX_BATCH_QRS:
        connection.send_error(
            msg["id"],
            "too_many",
            f"Batch would produce {total} QR codes; the per-request cap is "
            f"{_MAX_BATCH_QRS}. Narrow the object/task/action filter.",
        )
        return

    url_mode = msg.get("url_mode", "server")
    base_url = msg.get("base_url")

    # Generate URL first (fast), then offload the SVG encoding to the executor
    # since it's CPU-bound (~30-40 ms/QR). Each SVG passes through the LRU
    # cache so re-runs after a filter change are near-instant.
    results: list[dict[str, Any]] = []
    for entry_id, obj_name, task_id, task_name in targets:
        for action in actions:
            try:
                url = build_qr_url(
                    hass,
                    entry_id,
                    task_id=task_id,
                    action=action,
                    base_url_override=base_url,
                    url_mode=url_mode,
                )
            except ValueError:
                # No HA URL configured — skip this row rather than fail the
                # whole batch. "server" mode is the only path that raises;
                # "companion" and "local" always resolve.
                continue
            icon = _ACTION_ICON_MAP.get(action)  # None for "skip" (no icon)
            svg = await hass.async_add_executor_job(_cached_qr_svg, url, icon)
            results.append(
                {
                    "entry_id": entry_id,
                    "task_id": task_id,
                    "object_name": obj_name,
                    "task_name": task_name,
                    "action": action,
                    "svg": svg,
                }
            )

    connection.send_result(msg["id"], {"qrs": results, "total": len(results)})
