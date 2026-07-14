"""WebSocket handlers for object CRUD operations."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util

from ..const import (
    ARCHIVE_REASON_OBJECT,
    CONF_OBJECT,
    CONF_OBJECT_AREA,
    CONF_OBJECT_DOCUMENTATION_URL,
    CONF_OBJECT_INSTALLATION_DATE,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_OBJECT_NOTES,
    CONF_OBJECT_SERIAL_NUMBER,
    CONF_OBJECT_WARRANTY_EXPIRY,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_DATE_LENGTH,
    MAX_ENTITY_ID_LENGTH,
    MAX_ID_LENGTH,
    MAX_META_LENGTH,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_URL_LENGTH,
)
from ..helpers.permissions import require_write
from ..helpers.sanitize import cap_object_fields
from . import (
    _build_object_response,
    _get_object_entries,
    _get_runtime_data,
    _load_object_entry,
    cleanup_group_refs,
)
from .tasks import (  # v1.4.0 (#43): reuse the existing URL safety check
    _is_recurring_schedule,
    _is_safe_url,
)

# The optional object string fields are identical between object/create and
# object/update — define them once so the two schemas can't drift. The caps
# mirror helpers.sanitize._OBJECT_STR_LIMITS (a tripwire test enforces parity),
# which is also applied on persist via cap_object_fields as a safety net.
_OBJECT_STR_FIELD_SCHEMA: dict[Any, Any] = {
    vol.Optional("area_id"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
    vol.Optional("manufacturer"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
    vol.Optional("model"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
    vol.Optional("serial_number"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
    vol.Optional("installation_date"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
    vol.Optional("warranty_expiry"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),  # (#67)
    # v1.4.0 (#43): per-object link to PDF manual / vendor page
    vol.Optional("documentation_url"): vol.Any(vol.All(str, vol.Length(max=MAX_URL_LENGTH)), None),
    # v1.4.10 (#46): free-form notes (part numbers, procedures, etc.)
    vol.Optional("notes"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
    # 2.19: attach the object to an EXISTING HA device (entities land on its
    # device page) / nest under another maintenance object (via_device).
    vol.Optional("ha_device_id"): vol.Any(vol.All(str, vol.Length(max=MAX_ID_LENGTH)), None),
    vol.Optional("parent_entry_id"): vol.Any(vol.All(str, vol.Length(max=MAX_ID_LENGTH)), None),
}


def _validate_device_link(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    *,
    self_entry_id: str | None,
) -> bool:
    """Validate ha_device_id / parent_entry_id; sends the WS error itself.

    The parent chain is walked upwards so an A->B->A cycle (which would make
    the via_device hierarchy unresolvable) is rejected at write time.
    """
    if device_id := msg.get("ha_device_id"):
        from homeassistant.helpers import device_registry as dr

        if dr.async_get(hass).async_get(device_id) is None:
            connection.send_error(msg["id"], "invalid_device", f"No HA device {device_id!r}")
            return False

    if parent_id := msg.get("parent_entry_id"):
        parent = hass.config_entries.async_get_entry(parent_id)
        if parent is None or parent.domain != DOMAIN or parent.unique_id == GLOBAL_UNIQUE_ID:
            connection.send_error(msg["id"], "invalid_parent", f"No maintenance object {parent_id!r}")
            return False
        if self_entry_id is not None:
            cursor: str | None = parent_id
            for _ in range(20):
                if cursor == self_entry_id:
                    connection.send_error(
                        msg["id"],
                        "invalid_parent",
                        "Parent chain would form a cycle",
                    )
                    return False
                cur = hass.config_entries.async_get_entry(cursor) if cursor else None
                cursor = (cur.data.get(CONF_OBJECT, {}) or {}).get("parent_entry_id") if cur else None
                if not cursor:
                    break
    return True


@websocket_api.websocket_command({vol.Required("type"): "maintenance_supporter/objects"})
@websocket_api.async_response
async def ws_get_objects(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all maintenance objects with tasks and computed status."""
    entries = _get_object_entries(hass)
    result = []
    for entry in entries:
        rd = _get_runtime_data(hass, entry.entry_id)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        result.append(_build_object_response(hass, entry, coord_data))

    connection.send_result(msg["id"], {"objects": result})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@websocket_api.async_response
async def ws_get_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return a single object with full task details including history."""
    entry_id = msg["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    rd = _get_runtime_data(hass, entry_id)
    coord_data = rd.coordinator.data if rd and rd.coordinator else None
    connection.send_result(msg["id"], _build_object_response(hass, entry, coord_data))


async def async_create_object(
    hass: HomeAssistant,
    *,
    name: str,
    area_id: str | None = None,
    manufacturer: str | None = None,
    model: str | None = None,
    serial_number: str | None = None,
    installation_date: str | None = None,
    warranty_expiry: str | None = None,
    documentation_url: str | None = None,
    notes: str | None = None,
    ha_device_id: str | None = None,
    parent_entry_id: str | None = None,
) -> str:
    """Create a maintenance object (config entry) and return its entry_id.

    Shared creation primitive for the ``object/create`` WS command and the
    ``add_object`` service (DRY). Inputs are normalized here; callers do their
    own validation/error reporting (the WS layer keeps its specific error
    codes). Raises ValueError if the config flow does not create an entry.
    """
    data = {
        CONF_OBJECT: {
            "id": uuid4().hex,
            CONF_OBJECT_NAME: name.strip(),
            CONF_OBJECT_AREA: area_id,
            CONF_OBJECT_MANUFACTURER: (manufacturer or "").strip() or None,
            CONF_OBJECT_MODEL: (model or "").strip() or None,
            CONF_OBJECT_SERIAL_NUMBER: (serial_number or "").strip() or None,
            CONF_OBJECT_INSTALLATION_DATE: installation_date,
            CONF_OBJECT_WARRANTY_EXPIRY: warranty_expiry,
            CONF_OBJECT_DOCUMENTATION_URL: (documentation_url or "").strip() or None,
            CONF_OBJECT_NOTES: (notes.strip() if isinstance(notes, str) and notes.strip() else None),
            "ha_device_id": ha_device_id,
            "parent_entry_id": parent_entry_id,
            "task_ids": [],
        },
        CONF_TASKS: {},
    }
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "websocket"}, data=data)
    if result["type"] != "create_entry":
        raise ValueError(f"Failed to create object: {result.get('reason', 'unknown')}")
    return result["result"].entry_id


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/create",
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        **_OBJECT_STR_FIELD_SCHEMA,
        vol.Optional("dry_run", default=False): bool,
    }
)
@require_write
@websocket_api.async_response
async def ws_create_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create a new maintenance object via config flow."""
    name = msg["name"].strip()
    if not name:
        connection.send_error(msg["id"], "invalid_input", "Name must not be empty")
        return

    manufacturer = (msg.get("manufacturer") or "").strip() or None
    model = (msg.get("model") or "").strip() or None
    serial_number = (msg.get("serial_number") or "").strip() or None

    # Validate installation_date format if provided
    installation_date = msg.get("installation_date")
    if installation_date:
        from datetime import date as date_cls

        try:
            date_cls.fromisoformat(installation_date)
        except ValueError:
            connection.send_error(msg["id"], "invalid_date", "Invalid installation_date format (expected YYYY-MM-DD)")
            return

    # (#67): validate warranty_expiry format if provided
    warranty_expiry = msg.get("warranty_expiry")
    if warranty_expiry:
        from datetime import date as date_cls

        try:
            date_cls.fromisoformat(warranty_expiry)
        except ValueError:
            connection.send_error(msg["id"], "invalid_date", "Invalid warranty_expiry format (expected YYYY-MM-DD)")
            return

    # v1.4.0 (#43): documentation_url
    documentation_url = (msg.get("documentation_url") or "").strip() or None
    if documentation_url and not _is_safe_url(documentation_url):
        connection.send_error(msg["id"], "invalid_url", "Only http/https URLs are allowed")
        return

    # v1.4.10 (#46): notes (free-form, may contain newlines)
    notes_raw = msg.get("notes")
    notes = notes_raw.strip() if isinstance(notes_raw, str) and notes_raw.strip() else None

    # 2.19: device link / parent hierarchy
    if not _validate_device_link(hass, connection, msg, self_entry_id=None):
        return

    # Dry-run mode: validate only, do not persist
    if msg.get("dry_run"):
        connection.send_result(msg["id"], {"valid": True, "entry_id": None})
        return

    try:
        entry_id = await async_create_object(
            hass,
            name=name,
            area_id=msg.get("area_id"),
            manufacturer=manufacturer,
            model=model,
            serial_number=serial_number,
            installation_date=installation_date,
            warranty_expiry=warranty_expiry,
            documentation_url=documentation_url,
            notes=notes,
            ha_device_id=msg.get("ha_device_id"),
            parent_entry_id=msg.get("parent_entry_id"),
        )
    except ValueError as err:
        connection.send_error(msg["id"], "create_failed", str(err))
        return
    connection.send_result(msg["id"], {"entry_id": entry_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/update",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        **_OBJECT_STR_FIELD_SCHEMA,
    }
)
@require_write
@websocket_api.async_response
async def ws_update_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update an existing maintenance object."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    # Strip and validate name if provided
    if "name" in msg:
        msg["name"] = msg["name"].strip()
        if not msg["name"]:
            connection.send_error(msg["id"], "invalid_input", "Name must not be empty")
            return

    # Strip manufacturer/model/serial_number
    if msg.get("manufacturer"):
        msg["manufacturer"] = msg["manufacturer"].strip() or None
    if msg.get("model"):
        msg["model"] = msg["model"].strip() or None
    if msg.get("serial_number"):
        msg["serial_number"] = msg["serial_number"].strip() or None

    # Validate installation_date format if provided
    if msg.get("installation_date"):
        from datetime import date as date_cls

        try:
            date_cls.fromisoformat(msg["installation_date"])
        except ValueError:
            connection.send_error(msg["id"], "invalid_date", "Invalid installation_date format (expected YYYY-MM-DD)")
            return

    # (#67): validate warranty_expiry format if provided
    if msg.get("warranty_expiry"):
        from datetime import date as date_cls

        try:
            date_cls.fromisoformat(msg["warranty_expiry"])
        except ValueError:
            connection.send_error(msg["id"], "invalid_date", "Invalid warranty_expiry format (expected YYYY-MM-DD)")
            return

    # v1.4.0 (#43): documentation_url
    if "documentation_url" in msg:
        if msg["documentation_url"] is not None:
            stripped = (msg["documentation_url"] or "").strip()
            msg["documentation_url"] = stripped or None
        if msg["documentation_url"] and not _is_safe_url(msg["documentation_url"]):
            connection.send_error(msg["id"], "invalid_url", "Only http/https URLs are allowed")
            return

    # v1.4.10 (#46): notes — strip but keep newlines, empty -> None
    if "notes" in msg:
        if msg["notes"] is not None:
            stripped = msg["notes"].strip()
            msg["notes"] = stripped or None

    # 2.19: device link / parent hierarchy
    if not _validate_device_link(hass, connection, msg, self_entry_id=entry.entry_id):
        return

    new_data = dict(entry.data)
    obj = dict(new_data.get(CONF_OBJECT, {}))

    if "name" in msg:
        # Per-task unique_ids embed the object's name slug — migrate the
        # entity registry on rename or the next reload orphans every entity.
        from ..helpers.entity_rename import migrate_object_unique_ids

        migrate_object_unique_ids(hass, entry, obj.get(CONF_OBJECT_NAME), msg["name"])
        obj[CONF_OBJECT_NAME] = msg["name"]
    if "area_id" in msg:
        obj[CONF_OBJECT_AREA] = msg["area_id"]
    if "manufacturer" in msg:
        obj[CONF_OBJECT_MANUFACTURER] = msg["manufacturer"]
    if "model" in msg:
        obj[CONF_OBJECT_MODEL] = msg["model"]
    if "serial_number" in msg:
        obj[CONF_OBJECT_SERIAL_NUMBER] = msg["serial_number"]
    if "installation_date" in msg:
        obj[CONF_OBJECT_INSTALLATION_DATE] = msg["installation_date"]
    if "warranty_expiry" in msg:
        obj[CONF_OBJECT_WARRANTY_EXPIRY] = msg["warranty_expiry"]
    if "documentation_url" in msg:
        obj[CONF_OBJECT_DOCUMENTATION_URL] = msg["documentation_url"]
    if "notes" in msg:
        obj[CONF_OBJECT_NOTES] = msg["notes"]
    # 2.19: entity->device attachment only changes on entity re-add, so a
    # changed link/parent needs an entry reload (scheduled below).
    device_link_changed = False
    for key in ("ha_device_id", "parent_entry_id"):
        if key in msg and msg[key] != obj.get(key):
            obj[key] = msg[key]
            device_link_changed = True

    # Safety net: cap user strings on persist so this write path matches the
    # create path (which caps via the config flow) and tasks (cap_task_fields).
    cap_object_fields(obj)
    new_data[CONF_OBJECT] = obj
    title = obj.get(CONF_OBJECT_NAME, entry.title)
    hass.config_entries.async_update_entry(entry, data=new_data, title=title)
    if device_link_changed:
        hass.config_entries.async_schedule_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/delete",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_delete_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a maintenance object and all its tasks."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    await hass.config_entries.async_remove(entry.entry_id)
    cleanup_group_refs(hass, entry_id=entry.entry_id)
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/duplicate",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_duplicate_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Clone an object and all its tasks as a fresh, un-started copy.

    A new config entry named "… (copy)" carries over the object's details and
    every task's configuration, but nothing device- or history-specific: the
    serial number is dropped, and each task starts clean (no history /
    last_performed, its own new id, and no unique entity_slug / NFC tag). Ideal
    for fleets of near-identical assets (hotel rooms, identical pumps).
    """
    from copy import deepcopy

    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    src_obj = entry.data.get(CONF_OBJECT, {})
    new_obj = deepcopy(dict(src_obj))
    new_obj["id"] = uuid4().hex
    base_name = str(src_obj.get(CONF_OBJECT_NAME, "")).strip() or "Object"
    new_obj[CONF_OBJECT_NAME] = f"{base_name} (copy)"[:MAX_NAME_LENGTH]
    # Serial number identifies one physical unit — never duplicate it.
    new_obj[CONF_OBJECT_SERIAL_NUMBER] = None
    new_obj["task_ids"] = []
    new_obj.pop("archived_at", None)

    new_tasks: dict[str, Any] = {}
    for src_task in entry.data.get(CONF_TASKS, {}).values():
        task = deepcopy(dict(src_task))
        task_id = uuid4().hex
        task["id"] = task_id
        task["object_id"] = new_obj["id"]
        for key in (
            "entity_slug",
            "nfc_tag_id",
            "history",
            "last_performed",
            "last_planned_due",
            "adaptive_config",
            "archived_at",
            "archived_reason",
        ):
            task.pop(key, None)
        if isinstance(task.get("trigger_config"), dict):
            task["trigger_config"].pop("_trigger_state", None)
        new_tasks[task_id] = task
        new_obj["task_ids"].append(task_id)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "websocket"},
        data={CONF_OBJECT: new_obj, CONF_TASKS: new_tasks},
    )
    if result["type"] != "create_entry":
        connection.send_error(msg["id"], "duplicate_failed", result.get("reason", "unknown"))
        return
    connection.send_result(msg["id"], {"entry_id": result["result"].entry_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/from_template",
        vol.Required("template_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("name"): vol.Any(vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)), None),
        # v2.21.1: the caller's UI language — created object/task names are
        # localized (falls back to the server language).
        vol.Optional("language"): vol.All(str, vol.Length(max=10)),
    }
)
@require_write
@websocket_api.async_response
async def ws_create_from_template(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create an object (with its tasks) from a predefined template.

    Surfaces the config-flow template gallery in the panel: builds the object +
    its tasks from the template and routes them through the same websocket flow
    step used elsewhere (cap + normalize + create).
    """
    from uuid import uuid4

    from ..helpers.i18n import normalize_language
    from ..templates import get_template_by_id, localize_template_text

    template = get_template_by_id(msg["template_id"])
    if template is None:
        connection.send_error(msg["id"], "not_found", "Template not found")
        return

    lang = (msg.get("language") or normalize_language(hass))[:2].lower()
    default_name = localize_template_text(template.name, lang) or template.name
    name = (msg.get("name") or default_name).strip() or default_name
    object_id = uuid4().hex
    new_obj: dict[str, Any] = {
        "id": object_id,
        CONF_OBJECT_NAME: name[:MAX_NAME_LENGTH],
        "task_ids": [],
    }
    new_tasks: dict[str, Any] = {}
    for tt in template.tasks:
        task_id = uuid4().hex
        task: dict[str, Any] = {
            "id": task_id,
            "object_id": object_id,
            "name": localize_template_text(tt.name, lang),
            "type": tt.type,
            "enabled": True,
            "schedule_type": tt.schedule_type,
            "warning_days": tt.warning_days,
        }
        if tt.interval_days is not None:
            task["interval_days"] = tt.interval_days
        if tt.notes:
            task["notes"] = localize_template_text(tt.notes, lang)
        new_tasks[task_id] = task
        new_obj["task_ids"].append(task_id)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "websocket"},
        data={CONF_OBJECT: new_obj, CONF_TASKS: new_tasks},
    )
    if result["type"] != "create_entry":
        connection.send_error(msg["id"], "create_failed", result.get("reason", "unknown"))
        return
    connection.send_result(msg["id"], {"entry_id": result["result"].entry_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/archive",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_archive_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Archive an object and cascade to its active tasks.

    Each currently-active task is archived with reason OBJECT, so a later object
    unarchive restores exactly those. A task already archived (manually/auto)
    keeps its own reason and is left untouched by the cascade.
    """
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    obj = dict(entry.data.get(CONF_OBJECT, {}))
    if obj.get("archived_at") is not None:
        connection.send_error(msg["id"], "already_archived", "Object already archived")
        return

    now_iso = dt_util.now().isoformat()
    new_data = _archived_entry_data(entry.data, now_iso)
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Reload so the object's tasks' triggers tear down and entities go inert.
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True, "archived_at": now_iso})


def _archived_entry_data(entry_data: Any, now_iso: str) -> dict[str, Any]:
    """New entry data with the object archived and active tasks cascaded.

    Shared by ``object/archive`` and the replace flow (which retires the
    predecessor with exactly the same semantics).
    """
    obj = dict(entry_data.get(CONF_OBJECT, {}))
    obj["archived_at"] = now_iso
    # Archiving supersedes a seasonal pause — don't leave both markers.
    obj.pop("paused_at", None)
    obj.pop("paused_until", None)

    new_tasks: dict[str, Any] = {}
    for tid, td in dict(entry_data.get(CONF_TASKS, {})).items():
        td = dict(td)
        if td.get("archived_at") is None:  # cascade only to active tasks
            td["archived_at"] = now_iso
            td["archived_reason"] = ARCHIVE_REASON_OBJECT
        new_tasks[tid] = td

    new_data = dict(entry_data)
    new_data[CONF_OBJECT] = obj
    new_data[CONF_TASKS] = new_tasks
    return new_data


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/unarchive",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_unarchive_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Unarchive an object and un-cascade the tasks it had archived.

    Only tasks archived BY this object (reason OBJECT) are restored; recurring
    ones get a fresh cycle (D2). Tasks archived manually or auto-archived keep
    their archived state — they were retired independently.
    """
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    obj = dict(entry.data.get(CONF_OBJECT, {}))
    if obj.get("archived_at") is None:
        connection.send_error(msg["id"], "not_archived", "Object is not archived")
        return
    obj.pop("archived_at", None)

    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    today_iso = dt_util.now().date().isoformat()

    tasks_data = dict(entry.data.get(CONF_TASKS, {}))
    new_tasks: dict[str, Any] = {}
    for tid, td in tasks_data.items():
        td = dict(td)
        if td.get("archived_reason") == ARCHIVE_REASON_OBJECT:
            td.pop("archived_at", None)
            td.pop("archived_reason", None)
            # Fresh cycle for recurring tasks (D2); last_performed is dynamic →
            # Store when present, else the static dict (legacy).
            if _is_recurring_schedule(td):
                if store is not None:
                    store.set_last_performed(tid, today_iso)
                    state = store._ensure_task(tid)
                    state.pop("last_planned_due", None)
                else:
                    td["last_performed"] = today_iso
                    td.pop("last_planned_due", None)
        new_tasks[tid] = td

    new_data = dict(entry.data)
    new_data[CONF_OBJECT] = obj
    new_data[CONF_TASKS] = new_tasks
    hass.config_entries.async_update_entry(entry, data=new_data)
    if store is not None:
        await store.async_save()

    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/pause",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("until"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
    }
)
@require_write
@websocket_api.async_response
async def ws_pause_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Seasonally pause an object (journey N3).

    Tasks stay visible but read status ``paused``: schedules freeze, triggers
    tear down, nothing notifies. ``until`` (ISO date, optional) auto-resumes
    on that day via the coordinator; without it the pause holds until an
    explicit ``object/resume``.
    """
    from datetime import date as date_cls

    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    obj = dict(entry.data.get(CONF_OBJECT, {}))
    if obj.get("archived_at") is not None:
        connection.send_error(msg["id"], "archived", "An archived object cannot be paused")
        return
    if obj.get("paused_at") is not None:
        connection.send_error(msg["id"], "already_paused", "Object already paused")
        return

    until = msg.get("until")
    if until:
        try:
            until_date = date_cls.fromisoformat(until)
        except ValueError:
            connection.send_error(msg["id"], "invalid_date", "Invalid until format (expected YYYY-MM-DD)")
            return
        if until_date <= dt_util.now().date():
            connection.send_error(msg["id"], "invalid_date", "until must be a future date")
            return

    now_iso = dt_util.now().isoformat()
    obj["paused_at"] = now_iso
    obj["paused_until"] = until or None

    new_data = dict(entry.data)
    new_data[CONF_OBJECT] = obj
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Reload so triggers tear down and every entity repaints as paused.
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(
        msg["id"],
        {"success": True, "paused_at": now_iso, "paused_until": until or None},
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/resume",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_resume_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """End a seasonal pause: schedules re-anchor to a fresh cycle from today.

    Same core as the coordinator's ``paused_until`` auto-resume — the pool
    pump comes back with a clean slate, not five months overdue.
    """
    from ..helpers.pause import build_resumed_entry_data

    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    obj = entry.data.get(CONF_OBJECT, {})
    if obj.get("paused_at") is None:
        connection.send_error(msg["id"], "not_paused", "Object is not paused")
        return

    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    new_data = build_resumed_entry_data(dict(entry.data), store, dt_util.now().date().isoformat())
    hass.config_entries.async_update_entry(entry, data=new_data)
    if store is not None:
        await store.async_save()

    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/replace",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("name"): vol.Any(vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)), None),
    }
)
@require_write
@websocket_api.async_response
async def ws_replace_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Replace a worn-out object with a successor (journey N1).

    The predecessor is archived in place — its full history, costs and
    documents remain browsable, marked with ``replaced_by_entry_id``. The
    successor starts as a pre-filled fresh unit: same task configuration
    (fresh ids, no history), the documents carried over (manuals usually
    outlive the individual machine; blobs are refcounted, not copied), the
    installation date set to today, and serial number / warranty cleared —
    those belong to the specific old unit.
    """
    from copy import deepcopy

    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    src_obj = entry.data.get(CONF_OBJECT, {})
    if src_obj.get("archived_at") is not None:
        connection.send_error(msg["id"], "archived", "An archived object cannot be replaced")
        return

    name = (msg.get("name") or "").strip() or str(src_obj.get(CONF_OBJECT_NAME, "")).strip() or "Object"

    new_obj = deepcopy(dict(src_obj))
    new_obj["id"] = uuid4().hex
    new_obj[CONF_OBJECT_NAME] = name[:MAX_NAME_LENGTH]
    # Unit-specific identity does not transfer to the new machine.
    new_obj[CONF_OBJECT_SERIAL_NUMBER] = None
    new_obj[CONF_OBJECT_WARRANTY_EXPIRY] = None
    new_obj[CONF_OBJECT_INSTALLATION_DATE] = dt_util.now().date().isoformat()
    new_obj["task_ids"] = []
    for key in ("archived_at", "paused_at", "paused_until", "replaced_by_entry_id"):
        new_obj.pop(key, None)
    new_obj["predecessor_entry_id"] = entry.entry_id

    # Carry the parts shelf — the spares don't change when the machine dies.
    # Fresh ids (like tasks); consumption links are remapped below and the
    # tracked stock is copied into the successor's store after creation.
    part_id_map: dict[str, str] = {}
    new_parts: dict[str, Any] = {}
    for src_part in (entry.data.get("parts") or {}).values():
        carried = dict(src_part)
        new_pid = uuid4().hex
        part_id_map[str(carried.get("id"))] = new_pid
        carried["id"] = new_pid
        new_parts[new_pid] = carried

    new_tasks: dict[str, Any] = {}
    for src_task in entry.data.get(CONF_TASKS, {}).values():
        # Auto "buy" reminders are transient reconciler-owned state — the
        # successor's own reconcile recreates one if the carried part is low.
        if src_task.get("part_ref"):
            continue
        task = deepcopy(dict(src_task))
        task_id = uuid4().hex
        task["id"] = task_id
        task["object_id"] = new_obj["id"]
        for key in (
            "entity_slug",
            "nfc_tag_id",
            "history",
            "last_performed",
            "last_planned_due",
            "adaptive_config",
            "archived_at",
            "archived_reason",
        ):
            task.pop(key, None)
        if isinstance(task.get("trigger_config"), dict):
            task["trigger_config"].pop("_trigger_state", None)
        links = task.get("consumes_parts")
        if isinstance(links, list):
            remapped = [
                {"part_id": part_id_map[link["part_id"]], "quantity": link.get("quantity", 1)}
                for link in links
                if isinstance(link, dict) and link.get("part_id") in part_id_map
            ]
            if remapped:
                task["consumes_parts"] = remapped
            else:
                task.pop("consumes_parts", None)
        new_tasks[task_id] = task
        new_obj["task_ids"].append(task_id)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "websocket"},
        data={CONF_OBJECT: new_obj, CONF_TASKS: new_tasks, "parts": new_parts},
    )
    if result["type"] != "create_entry":
        connection.send_error(msg["id"], "replace_failed", result.get("reason", "unknown"))
        return
    new_entry_id: str = result["result"].entry_id

    # Carry the document library over — manuals outlive the machine. Blob
    # refcounts increase; nothing is copied on disk.
    from .. import DOCUMENT_STORE_KEY
    from . import object_id_for_entry

    doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    if doc_store is not None:
        src_docs = doc_store.for_object(object_id_for_entry(entry))
        if src_docs:
            # part_id_map keeps a doc's spare-part links pointing at the carried
            # parts' fresh ids (task links intentionally drop — the successor's
            # tasks restart fresh).
            await doc_store.async_import_documents(new_obj["id"], src_docs, part_id_map=part_id_map)

    # Copy the tracked stock counts (dynamic store state) onto the carried
    # parts, then let the successor's reconcile recreate any needed reminder.
    if part_id_map:
        src_rd = getattr(entry, "runtime_data", None)
        src_store = getattr(src_rd, "store", None) if src_rd else None
        new_entry = hass.config_entries.async_get_entry(new_entry_id)
        new_rd = getattr(new_entry, "runtime_data", None) if new_entry else None
        new_store = getattr(new_rd, "store", None) if new_rd else None
        if src_store is not None and new_store is not None:
            for old_pid, new_pid in part_id_map.items():
                stock = src_store.get_part_stock(old_pid)
                if stock is not None:
                    new_store.set_part_stock(new_pid, stock)
            await new_store.async_save()
        if new_entry is not None:
            from ..parts_runtime import schedule_buy_task_reconcile

            schedule_buy_task_reconcile(hass, new_entry)

    # Retire the predecessor (archive cascade) with the successor pointer.
    now_iso = dt_util.now().isoformat()
    retired = _archived_entry_data(entry.data, now_iso)
    retired_obj = dict(retired[CONF_OBJECT])
    retired_obj["replaced_by_entry_id"] = new_entry_id
    retired[CONF_OBJECT] = retired_obj
    hass.config_entries.async_update_entry(entry, data=retired)
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"entry_id": new_entry_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/entity/attributes",
        vol.Required("entity_id"): vol.All(str, vol.Length(max=MAX_ENTITY_ID_LENGTH)),
    }
)
@callback
def ws_entity_attributes(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return relevant attributes for an entity, combining domain mapping with live state.

    Used by the frontend trigger setup to show a dropdown of suitable attributes
    instead of a free text field.
    """
    from ..helpers.entity_attributes import get_entity_attributes

    result = get_entity_attributes(hass, msg["entity_id"])
    connection.send_result(msg["id"], result)
