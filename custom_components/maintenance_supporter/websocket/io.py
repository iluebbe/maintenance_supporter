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
    MAX_IMPORT_PAYLOAD_BYTES,
    MAX_JSON_IMPORT_PAYLOAD_BYTES,
)
from ..helpers.global_options import get_default_warning_days
from ..helpers.qr_generator import (
    _ACTION_ICON_MAP,
    build_qr_url,
    generate_qr_svg,
    generate_qr_svg_data_uri,
)
from ..websocket.tasks import _check_nfc_tag_duplicate, _validate_trigger_config

_LOGGER = logging.getLogger(__name__)


def _iso_marker(value: Any) -> str | None:
    """Keep ``value`` only if it parses as an ISO date/datetime, else drop it.

    ``paused_at`` is a *marker* whose mere presence means "paused"; a garbage
    value imported from a hand-edited/foreign backup would otherwise freeze the
    object as paused forever (and a malformed ``paused_until`` means auto-resume
    never fires). Validate on import so only a real timestamp restores the state.
    """
    from datetime import date, datetime

    if not isinstance(value, str) or not value.strip():
        return None
    s = value.strip()
    try:
        datetime.fromisoformat(s.replace("Z", "+00:00"))
        return s
    except ValueError:
        try:
            date.fromisoformat(s)
            return s
        except ValueError:
            return None


def _sanitize_history(history: Any) -> list[dict[str, Any]]:
    """Scrub imported history entries: drop a non-finite/negative ``cost``.

    Every live write path range-guards cost, but import copied history verbatim
    and ``json.loads``/``yaml.safe_load`` both accept ``NaN``/``Infinity``. Such
    a value would poison budget aggregation (a `+inf` fake "budget exceeded"
    alert, or `nan` silently disabling all alerts). The completion still counts;
    only the bad cost is removed.
    """
    import math

    if not isinstance(history, list):
        return []
    out: list[dict[str, Any]] = []
    for entry in history:
        if not isinstance(entry, dict):
            continue
        clean = dict(entry)
        cost = clean.get("cost")
        if isinstance(cost, bool) or not isinstance(cost, (int, float)) or not math.isfinite(cost) or cost < 0:
            clean.pop("cost", None)
        out.append(clean)
    return out


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/version"})
@websocket_api.async_response
async def ws_version(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """The installed integration version (manifest).

    Roadmap guard 2 — stale-bundle handshake: the panel compares this against
    the version esbuild stamped into its bundle and offers a reload when a
    cached old frontend is talking to a newer backend (HA's service worker
    updates stale-while-revalidate, so this happens routinely after updates).
    """
    from homeassistant.loader import async_get_integration

    integration = await async_get_integration(hass, DOMAIN)
    connection.send_result(msg["id"], {"version": integration.version})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/templates",
        # v2.21.1: the caller's UI language — template/task names arrive
        # localized. Falls back to the server language.
        vol.Optional("language"): vol.All(str, vol.Length(max=10)),
    }
)
@websocket_api.async_response
async def ws_get_templates(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all maintenance templates.

    Every template is returned with a ``disabled`` flag (v2.21 gallery
    curation): the pickers hide disabled ones client-side, while the Settings
    section needs the full list to render the toggles.
    """
    from ..helpers.i18n import normalize_language, normalize_language_code
    from ..templates import (
        TEMPLATE_CATEGORIES,
        TEMPLATES,
        get_disabled_template_ids,
        localize_template_text,
    )

    disabled = get_disabled_template_ids(hass)
    lang = normalize_language_code(msg.get("language")) if msg.get("language") else normalize_language(hass)

    result = {
        "categories": {cat_id: {k: v for k, v in cat.items()} for cat_id, cat in TEMPLATE_CATEGORIES.items()},
        "templates": [
            {
                "id": t.id,
                "name": localize_template_text(t.name, lang),
                "category": t.category,
                "disabled": t.id in disabled,
                "tasks": [
                    {
                        "name": localize_template_text(tt.name, lang),
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
        # Selective export: restrict to these object entry_ids (omit = all).
        vol.Optional("entry_ids"): [vol.All(str, vol.Length(max=MAX_ID_LENGTH))],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_export_data(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Export all (or a selection of) maintenance data as JSON or YAML."""
    from ..export import build_export_data, serialize_export

    fmt = msg.get("format", "json")
    include_history = msg.get("include_history", True)
    entry_ids = set(msg["entry_ids"]) if msg.get("entry_ids") else None

    # Phase 1: gather data on the event loop (accesses HA APIs)
    data = build_export_data(hass, include_history=include_history, entry_ids=entry_ids)

    # Phase 2: serialize in executor (CPU-bound, no HA API calls)
    result = await hass.async_add_executor_job(serialize_export, data, fmt)

    connection.send_result(msg["id"], {"format": fmt, "data": result})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/csv/export",
        vol.Optional("entry_ids"): [vol.All(str, vol.Length(max=MAX_ID_LENGTH))],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_export_csv(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Export all (or a selection of) maintenance data as CSV."""
    from ..helpers.csv_handler import export_objects_csv

    entry_ids = set(msg["entry_ids"]) if msg.get("entry_ids") else None
    csv_data = export_objects_csv(hass, entry_ids=entry_ids)
    connection.send_result(msg["id"], {"csv": csv_data})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/objects/csv",
        vol.Optional("entry_ids"): [vol.All(str, vol.Length(max=MAX_ID_LENGTH))],
    }
)
@websocket_api.async_response
async def ws_export_objects_csv(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Export one row per maintenance object as CSV (#67), all or a selection.

    Not admin-gated: it exposes only the asset fields the panel already sends
    to every user via ``maintenance_supporter/objects`` (no cost/history).
    """
    from ..helpers.csv_handler import export_object_records_csv

    entry_ids = set(msg["entry_ids"]) if msg.get("entry_ids") else None
    csv_data = export_object_records_csv(hass, entry_ids=entry_ids)
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
    if len(csv_content) > MAX_IMPORT_PAYLOAD_BYTES:
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


def _parse_structured(raw: str) -> Any:
    """Parse JSON *or* YAML export content into a Python object.

    Both formats are accepted so every structured export (JSON and YAML)
    round-trips back through the importer. Raises ValueError if the content
    parses to neither a mapping nor a list.
    """
    try:
        return json_mod.loads(raw)
    except (json_mod.JSONDecodeError, ValueError):
        pass
    import yaml  # type: ignore[import-untyped]

    try:
        loaded = yaml.safe_load(raw)
    except yaml.YAMLError as err:
        raise ValueError("not valid JSON or YAML") from err
    # safe_load returns a bare string/scalar for non-structured text (e.g. a
    # CSV blob) — require an object/array so those route elsewhere cleanly.
    if not isinstance(loaded, (dict, list)):
        raise ValueError("not valid JSON or YAML")
    return loaded


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
    """Import maintenance objects from JSON or YAML content (from /export)."""
    raw = msg["json_content"]
    if len(raw) > MAX_JSON_IMPORT_PAYLOAD_BYTES:
        connection.send_error(msg["id"], "too_large", "Content exceeds 10MB limit")
        return

    try:
        data = _parse_structured(raw)
    except ValueError:
        connection.send_error(msg["id"], "invalid_format", "Content is not valid JSON or YAML")
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
        # Guard against malformed-but-schema-valid input (the schema only checks
        # json_content is a str): a non-dict entry / non-dict object would raise
        # AttributeError and escape the per-object try/except below.
        if not isinstance(obj_entry, dict):
            errors.append({"name": f"object {idx + 1}", "reason": "not an object"})
            continue
        obj_data = obj_entry.get("object", {})
        if not isinstance(obj_data, dict):
            errors.append({"name": f"object {idx + 1}", "reason": "invalid object data"})
            continue
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
            "warranty_expiry": obj_data.get("warranty_expiry"),
            # Imported counterparts of the export fields above; length-capped by
            # cap_object_fields and the frontend only renders http(s) doc URLs.
            "documentation_url": obj_data.get("documentation_url"),
            "notes": obj_data.get("notes"),
            # 2.19: device link / parent hierarchy — same-instance restores
            # keep them valid; stale ids degrade gracefully at read time.
            "ha_device_id": obj_data.get("ha_device_id"),
            "parent_entry_id": obj_data.get("parent_entry_id"),
            # 2.20: seasonal pause round-trips (a paused pool restored in
            # winter stays paused); replace-flow lineage ids are the same
            # instance-specific story as parent_entry_id above.
            "paused_at": _iso_marker(obj_data.get("paused_at")),
            "paused_until": _iso_marker(obj_data.get("paused_until")),
            "predecessor_entry_id": obj_data.get("predecessor_entry_id"),
            "replaced_by_entry_id": obj_data.get("replaced_by_entry_id"),
            "task_ids": [],
        }

        # Spare parts: regenerate ids (like tasks) and remember the mapping so
        # task-side links (consumes_parts / part_ref) can be rewritten below.
        # Stock is dynamic Store state — collected here, written after setup.
        from uuid import uuid4 as _uuid4

        part_id_map: dict[str, str] = {}
        import_parts: dict[str, dict[str, Any]] = {}
        part_stocks: dict[str, float] = {}
        parts_list = obj_entry.get("parts", [])
        if isinstance(parts_list, list):
            for part_entry in parts_list:
                if not isinstance(part_entry, dict) or not (part_entry.get("name") or "").strip():
                    continue
                old_id = str(part_entry.get("id") or "")
                new_id = _uuid4().hex
                pdata = {k: v for k, v in part_entry.items() if k != "stock"}
                pdata["id"] = new_id
                # Drop a non-http(s) product_url — the WS write path validates it
                # via _clean_url, but import copied it verbatim, so a crafted
                # backup could persist a javascript: link (the panel now also
                # guards the href, but keep bad data out of storage).
                _purl = pdata.get("product_url")
                if isinstance(_purl, str) and _purl.strip().lower().startswith(("http://", "https://")):
                    pdata["product_url"] = _purl.strip()  # store trimmed so the render guard matches
                else:
                    pdata.pop("product_url", None)
                import_parts[new_id] = pdata
                if old_id:
                    part_id_map[old_id] = new_id
                stock = part_entry.get("stock")
                if isinstance(stock, (int, float)) and not isinstance(stock, bool) and stock >= 0:
                    part_stocks[new_id] = stock

        import_tasks: dict[str, dict[str, Any]] = {}
        # old task id → new id, so document task-links (task_ids) can be
        # remapped onto the freshly generated tasks (mirrors part_id_map).
        task_id_map: dict[str, str] = {}
        tasks_list = obj_entry.get("tasks", [])
        if not isinstance(tasks_list, list):
            tasks_list = []
        for task_entry in tasks_list:
            if not isinstance(task_entry, dict):
                continue
            task_name = (task_entry.get("name") or "").strip()
            if not task_name:
                continue
            task_id = uuid4().hex
            old_task_id = str(task_entry.get("id") or "")
            if old_task_id:
                task_id_map[old_task_id] = task_id
            task_data: dict[str, Any] = {
                "id": task_id,
                "object_id": obj_id,
                "name": task_name,
                "type": task_entry.get("type", "custom"),
                "enabled": task_entry.get("enabled", True),
                "schedule_type": task_entry.get("schedule_type", "time_based"),
                "warning_days": task_entry.get("warning_days", get_default_warning_days(hass)),
                "history": _sanitize_history(task_entry.get("history", [])),
            }
            for key in (
                # Provenance + lifecycle — mirror the export builder so an
                # archived task stays archived and created_at (the next_due
                # fallback anchor) survives the round trip.
                "created_at",
                "archived_at",
                "archived_reason",
                "interval_days",
                "interval_unit",
                "due_date",
                "interval_anchor",
                "last_planned_due",
                # per-occurrence postpone (round-trips like last_planned_due)
                "due_override",
                # nested recurrence (calendar kinds) — config-flow normalize
                # treats it as authoritative when present.
                "schedule",
                "last_performed",
                "notes",
                "documentation_url",
                "custom_icon",
                "nfc_tag_id",
                "responsible_user_id",
                "entity_slug",
                "trigger_config",
                "adaptive_config",
                "checklist",
                "schedule_time",
                # v2.17+ / #83 fields — mirror the export builder so a JSON
                # backup round-trips them (validated/clamped just below).
                "priority",
                "labels",
                "earliest_completion_days",
                "on_complete_action",
                "quick_complete_defaults",
                "assignee_pool",
                "required_completion_fields",
                "rotation_strategy",
                "reading_unit",
                # spare parts (ids remapped below)
                "consumes_parts",
                "part_ref",
            ):
                val = task_entry.get(key)
                if val is not None:
                    task_data[key] = val

            # #130: history entries carry used_parts, and since they are
            # editable (stock reconciled by delta), the part ids must follow
            # the regenerated ones. Own-part ids remap via part_id_map; links
            # into another object's pool (entry_id set) are kept verbatim —
            # if that entry doesn't exist in this instance they degrade to
            # the safe recorded-only path, name preserved.
            for hist_entry in task_data.get("history") or []:
                used = hist_entry.get("used_parts")
                if not isinstance(used, list):
                    continue
                for link in used:
                    if (
                        isinstance(link, dict)
                        and not link.get("entry_id")
                        and link.get("part_id") in part_id_map
                    ):
                        link["part_id"] = part_id_map[link["part_id"]]

            # Remap part links to the regenerated part ids; drop dangling ones.
            links = task_data.get("consumes_parts")
            if isinstance(links, list):
                remapped = []
                for link in links:
                    if not isinstance(link, dict):
                        continue
                    foreign = str(link.get("entry_id") or "").strip()
                    if foreign:
                        # A link to another object's pool (#111). Import mints
                        # new entry ids, so the reference only means anything
                        # if that object is present in THIS instance — keep it
                        # then, drop it otherwise rather than restore a link
                        # that points nowhere.
                        if hass.config_entries.async_get_entry(foreign) is not None:
                            remapped.append(dict(link))
                    elif link.get("part_id") in part_id_map:
                        remapped.append(
                            {"part_id": part_id_map[link["part_id"]], "quantity": link.get("quantity", 1)}
                        )
                if remapped:
                    task_data["consumes_parts"] = remapped
                else:
                    task_data.pop("consumes_parts", None)
            elif links is not None:
                task_data.pop("consumes_parts", None)
            ref = task_data.get("part_ref")
            if isinstance(ref, dict) and ref.get("part_id") in part_id_map:
                task_data["part_ref"] = {"part_id": part_id_map[ref["part_id"]]}
            elif ref is not None:
                task_data.pop("part_ref", None)

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
            # A rotation task must carry its effective assignee (imports from
            # pre-seeding exports may lack one) — same rule as create/update.
            from ..helpers.sanitize import seed_rotation_assignee

            seed_rotation_assignee(task_data)
            # Sanitize checklist: only keep string items within length budget,
            # cap total items. Drops malformed entries silently rather than
            # rejecting the whole import — same forgiving model as the other
            # fields above.
            cl = task_data.get("checklist")
            if cl is not None:
                if not isinstance(cl, list):
                    task_data.pop("checklist", None)
                else:
                    cleaned = [item.strip() for item in cl if isinstance(item, str) and len(item) <= MAX_CHECKLIST_ITEM_LENGTH]
                    cleaned = [c for c in cleaned if c]
                    task_data["checklist"] = cleaned[:MAX_CHECKLIST_ITEMS]

            # schedule_time: strict HH:MM, otherwise drop
            st = task_data.get("schedule_time")
            if st is not None:
                if not isinstance(st, str) or not re.fullmatch(r"^([01]\d|2[0-3]):[0-5]\d$", st):
                    task_data.pop("schedule_time", None)

            # Validate an imported trigger_config the same way the WS create/update
            # path does — strip unknown keys, normalize entity_ids, and drop it
            # entirely if invalid — so import isn't a hole around trigger validation.
            tc = task_data.get("trigger_config")
            if isinstance(tc, dict):
                errors, _warnings = _validate_trigger_config(hass, tc)
                if errors:
                    task_data.pop("trigger_config", None)
            elif tc is not None:
                task_data.pop("trigger_config", None)

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
                    "parts": import_parts,
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

            # Restore tracked part stocks into the new entry's Store.
            if part_stocks:
                new_entry = hass.config_entries.async_get_entry(result["result"].entry_id)
                rd_new = getattr(new_entry, "runtime_data", None) if new_entry else None
                store_new = getattr(rd_new, "store", None) if rd_new else None
                if store_new is not None:
                    for pid, stock_val in part_stocks.items():
                        store_new.set_part_stock(pid, stock_val)
                    await store_new.async_save()

            # (roadmap P6) recreate document metadata + web-links for the object
            # (blobs travel via the /config backup; a JSON-only import leaves
            # file docs dangling, which the storage-hygiene repair issue catches).
            import_docs = obj_entry.get("documents")
            if isinstance(import_docs, list) and import_docs:
                from .. import DOCUMENT_STORE_KEY

                doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
                if doc_store is not None:
                    await doc_store.async_import_documents(
                        obj_id, import_docs, task_id_map=task_id_map, part_id_map=part_id_map
                    )
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
        vol.Optional("action", default="view"): vol.In(["view", "complete", "quick_complete"]),
        vol.Optional("url_mode", default="server"): vol.In(["server", "local", "companion"]),
        vol.Optional("base_url"): vol.All(vol.Url(), vol.Length(max=512)),
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
            hass,
            entry_id,
            task_id=task_id,
            action=action,
            base_url_override=base_url,
            url_mode=url_mode,
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
            [vol.In(["view", "complete", "skip", "quick_complete"])],
            vol.Length(min=1, max=4),
        ),
        vol.Optional("url_mode", default="server"): vol.In(["server", "local", "companion"]),
        vol.Optional("base_url"): vol.All(vol.Url(), vol.Length(max=512)),
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
    all_entries = [entry for entry in hass.config_entries.async_entries(DOMAIN) if entry.unique_id != GLOBAL_UNIQUE_ID]
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
            targets.append((entry.entry_id, obj_name, task_id, task_data.get("name", "")))

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
