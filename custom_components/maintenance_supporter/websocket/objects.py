"""WebSocket handlers for object CRUD operations."""

from __future__ import annotations

from copy import deepcopy
from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.util import dt as dt_util

from ..const import (
    ARCHIVE_REASON_OBJECT,
    BATTERY_FLEET_OBJECT_FLAG,
    CONF_OBJECT,
    CONF_OBJECT_AREA,
    CONF_OBJECT_DOCUMENTATION_URL,
    CONF_OBJECT_INSTALLATION_DATE,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_OBJECT_NOTES,
    CONF_OBJECT_PLACE,
    CONF_OBJECT_REMIND_ON_SITE,
    CONF_OBJECT_SERIAL_NUMBER,
    CONF_OBJECT_WARRANTY_EXPIRY,
    CONF_TASKS,
    DOCUMENT_STORE_KEY,
    DOMAIN,
    MAX_DATE_LENGTH,
    MAX_ENTITY_ID_LENGTH,
    MAX_META_LENGTH,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_URL_LENGTH,
)
from ..helpers.aggregate import (
    get_coordinator_data,
    get_object_entries,
    get_runtime_data,
    get_store,
    is_object_entry,
    name_or_title,
    object_id_for_entry,
)
from ..helpers.device_link import is_maintenance_device
from ..helpers.device_swap import move_tasks_to_device, old_device_ids
from ..helpers.entity_attributes import get_entity_attributes
from ..helpers.entity_rename import migrate_object_unique_ids
from ..helpers.global_options import cleanup_group_refs
from ..helpers.i18n import normalize_language, normalize_language_code
from ..helpers.object_create import async_create_object
from ..helpers.object_names import name_changed_onto_taken, name_taken, unique_object_name
from ..helpers.parts import PART_REF_FIELD, map_part_links
from ..helpers.pause import build_resumed_entry_data, reanchor_recurring_task, wants_fresh_cycle
from ..helpers.permissions import require_write
from ..helpers.sanitize import cap_object_fields, strip_object_reference, strip_task_runtime_state
from ..helpers.shared_parts import async_relink_history, borrowed_part_ids, relink_borrowers
from ..helpers.task_origin import ORIGIN_KEY
from ..helpers.template_usage import OBJECT_TEMPLATE_ID
from ..helpers.url_safety import is_safe_url
from ..helpers.ws_errors import send_translated_error, send_unsafe_url_error
from ..parts_runtime import schedule_buy_task_reconcile
from . import (
    ID_FIELD,
    _build_object_response,
    _get_object_entries,
    _load_object_entry,
    _parse_iso_date,
    _parse_pause_until,
)

# The optional object string fields are identical between object/create and
# object/update — define them once so the two schemas can't drift. The caps
# mirror helpers.sanitize._OBJECT_STR_LIMITS (a tripwire test enforces parity),
# which is also applied on persist via cap_object_fields as a safety net.
_OBJECT_STR_FIELD_SCHEMA: dict[Any, Any] = {
    vol.Optional("area_id"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
    # 2026-10 places: an HA zone's entity id; null / "" / "zone.home" = home.
    vol.Optional("place"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
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
    vol.Optional("ha_device_id"): vol.Any(ID_FIELD, None),
    vol.Optional("parent_entry_id"): vol.Any(ID_FIELD, None),
}


def _carry_parts_shelf(src_parts: Any, *, keep_doc_links: bool) -> tuple[dict[str, str], dict[str, Any]]:
    """Copy an object's spare-part definitions with FRESH ids.

    Returns ``(old→new id map, new parts)``. Shared by object/replace and
    object/duplicate so a copy never shares part ids with its source.
    ``keep_doc_links=False`` drops a part's ``doc_id``: a duplicate does not
    copy the documents, and a manual of ANOTHER object would dangle once that
    object is gone.
    """
    part_id_map: dict[str, str] = {}
    new_parts: dict[str, Any] = {}
    for src_part in (src_parts or {}).values():
        if not isinstance(src_part, dict):
            continue
        carried = dict(src_part)
        new_pid = uuid4().hex
        part_id_map[str(carried.get("id"))] = new_pid
        carried["id"] = new_pid
        if not keep_doc_links:
            carried.pop("doc_id", None)
        new_parts[new_pid] = carried
    return part_id_map, new_parts


def _remap_own_part_links(task: dict[str, Any], part_id_map: dict[str, str], own_entry_id: str) -> dict[str, Any]:
    """Point a copied task's links to its OWN object's parts at the fresh ids.

    Task-level AND phase-level links (helpers.parts.map_part_links — replace
    walked the task level only, and a phase kept consuming the retired
    predecessor's part; bug audit 2026-09-27). A link into ANOTHER object's
    pool (#111) is carried verbatim; an own link to a part the shelf does not
    carry is dropped rather than left pointing at nothing.
    """
    def _rewrite(link: dict[str, Any]) -> dict[str, Any] | None:
        owner = str(link.get("entry_id") or "")
        if owner and owner != own_entry_id:
            return link
        part_id = str(link.get("part_id") or "")
        if part_id not in part_id_map:
            return None
        return {"part_id": part_id_map[part_id], "quantity": link.get("quantity", 1)}

    remapped, _changed = map_part_links(task, _rewrite)
    return remapped


def _validate_object_dates(connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> bool:
    """False (after sending ``invalid_date``) when a present installation_date
    / warranty_expiry (#67) is not ``YYYY-MM-DD`` — shared by create and update."""
    for field in ("installation_date", "warranty_expiry"):
        if msg.get(field):
            parsed = _parse_iso_date(connection, msg["id"], msg[field], field=field)
            if parsed is None:
                return False
            # Stored as YYYY-MM-DD: a compact "20261001" was kept as typed.
            msg[field] = parsed.isoformat()
    return True


def _validate_device_link(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    *,
    self_entry_id: str | None,
    stored: dict[str, Any] | None = None,
) -> bool:
    """Validate ha_device_id / parent_entry_id; sends the WS error itself.

    The parent chain is walked upwards so an A->B->A cycle (which would make
    the via_device hierarchy unresolvable) is rejected at write time.

    ``stored`` is the object being updated: a value it already holds was
    checked when it was written and is not checked again. The edit dialog
    re-sends both on every save, and an object whose parent had been deleted
    could not be saved at all (``invalid_parent``, bug audit 2026-10-16, W3);
    a parent that is gone by now is cleared instead.
    """
    stored = stored or {}
    if (device_id := msg.get("ha_device_id")) and device_id != stored.get("ha_device_id"):
        device = dr.async_get(hass).async_get(device_id)
        if device is None:
            connection.send_error(msg["id"], "invalid_device", f"No HA device {device_id!r}")
            return False
        # A device of our own domain is never a valid link target: it is this
        # object's own maintenance device (or a sibling object's). The picker
        # cannot exclude them, and ours carries the SAME NAME as the appliance
        # — three prod objects spent months linked to their own doppelgänger
        # before anyone noticed. For object hierarchy there is parent_entry_id.
        if is_maintenance_device(hass, device):
            connection.send_error(
                msg["id"],
                "self_link_device",
                "That device belongs to Maintenance Supporter itself (the object's "
                "maintenance twin, not the appliance) — pick the device owned by the "
                "appliance's integration; it usually carries the same name",
            )
            return False

    parent_id = msg.get("parent_entry_id")
    if parent_id and parent_id == stored.get("parent_entry_id"):
        if not is_object_entry(hass.config_entries.async_get_entry(parent_id)):
            msg["parent_entry_id"] = None
        return True
    if parent_id:
        parent = hass.config_entries.async_get_entry(parent_id)
        if not is_object_entry(parent):
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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/objects",
        # Opt-in (perf wave 2 #3): strip keys whose value is None/[]/{} from
        # the object + task summaries. Own panel/card pass this and hydrate
        # the list/dict keys back; consumers that don't ask keep the full,
        # every-field shape (#50 contract untouched).
        vol.Optional("compact", default=False): bool,
    }
)
@websocket_api.async_response
async def ws_get_objects(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all maintenance objects with tasks and computed status."""
    compact = bool(msg.get("compact", False))
    entries = _get_object_entries(hass)
    result = []
    for entry in entries:
        coord_data = get_coordinator_data(hass, entry.entry_id)
        result.append(_build_object_response(hass, entry, coord_data, compact=compact))

    connection.send_result(msg["id"], {"objects": result})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object",
        vol.Required("entry_id"): ID_FIELD,
    }
)
@websocket_api.async_response
async def ws_get_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return a single object with full task details including history."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    coord_data = get_coordinator_data(hass, entry.entry_id)
    connection.send_result(msg["id"], _build_object_response(hass, entry, coord_data))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/create",
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        **_OBJECT_STR_FIELD_SCHEMA,
        vol.Optional("remind_on_site"): bool,
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
        send_translated_error(connection, msg["id"], "invalid_input", "Name must not be empty", translation_key="name_empty")
        return
    # A taken name is refused the way a rename onto it is — before the dry
    # run too, which called it valid; the create then failed with a bare
    # "already_configured" (DRY audit 2026-10-12, BI5-A2).
    if name_taken(hass, name):
        send_translated_error(connection, msg["id"], "invalid_input", "Another object already has this name", translation_key="object_name_taken")
        return

    manufacturer = (msg.get("manufacturer") or "").strip() or None
    model = (msg.get("model") or "").strip() or None
    serial_number = (msg.get("serial_number") or "").strip() or None

    # Validate installation_date / warranty_expiry (#67) format if provided
    if not _validate_object_dates(connection, msg):
        return
    installation_date = msg.get("installation_date")
    warranty_expiry = msg.get("warranty_expiry")

    # v1.4.0 (#43): documentation_url
    documentation_url = (msg.get("documentation_url") or "").strip() or None
    if documentation_url and not is_safe_url(documentation_url):
        send_unsafe_url_error(connection, msg["id"])
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
            place=msg.get("place"),
            remind_on_site=msg.get("remind_on_site") is True,
        )
    except ValueError as err:
        connection.send_error(msg["id"], "create_failed", str(err))
        return
    connection.send_result(msg["id"], {"entry_id": entry_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/update",
        vol.Required("entry_id"): ID_FIELD,
        vol.Optional("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        **_OBJECT_STR_FIELD_SCHEMA,
        vol.Optional("remind_on_site"): bool,
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
            send_translated_error(connection, msg["id"], "invalid_input", "Name must not be empty", translation_key="name_empty")
            return
        # The same name rule as every create path (helpers.object_names): a
        # rename onto another object's name went through, and the next
        # create of that name — or a replace under it — failed confusingly
        # (bug audit 2026-09-27). Only a CHANGED name is checked: the dialog
        # re-sends the name on every save, and the successor of a replace
        # legitimately shares its archived predecessor's name.
        if name_changed_onto_taken(hass, entry, msg["name"]):
            send_translated_error(connection, msg["id"], "invalid_input", "Another object already has this name", translation_key="object_name_taken")
            return

    # Strip manufacturer/model/serial_number
    if msg.get("manufacturer"):
        msg["manufacturer"] = msg["manufacturer"].strip() or None
    if msg.get("model"):
        msg["model"] = msg["model"].strip() or None
    if msg.get("serial_number"):
        msg["serial_number"] = msg["serial_number"].strip() or None

    # Validate installation_date / warranty_expiry (#67) format if provided
    if not _validate_object_dates(connection, msg):
        return

    # v1.4.0 (#43): documentation_url
    if "documentation_url" in msg:
        if msg["documentation_url"] is not None:
            stripped = (msg["documentation_url"] or "").strip()
            msg["documentation_url"] = stripped or None
        if msg["documentation_url"] and not is_safe_url(msg["documentation_url"]):
            send_unsafe_url_error(connection, msg["id"])
            return

    # v1.4.10 (#46): notes — strip but keep newlines, empty -> None
    if "notes" in msg:
        if msg["notes"] is not None:
            stripped = msg["notes"].strip()
            msg["notes"] = stripped or None

    # 2.19: device link / parent hierarchy
    if not _validate_device_link(hass, connection, msg, self_entry_id=entry.entry_id, stored=entry.data.get(CONF_OBJECT) or {}):
        return

    new_data = dict(entry.data)
    obj = dict(new_data.get(CONF_OBJECT, {}))

    if "name" in msg:
        # Per-task unique_ids embed the object's name slug — migrate the
        # entity registry on rename or the next reload orphans every entity.
        migrate_object_unique_ids(hass, entry, obj.get(CONF_OBJECT_NAME), msg["name"])
        obj[CONF_OBJECT_NAME] = msg["name"]
    if "area_id" in msg:
        obj[CONF_OBJECT_AREA] = msg["area_id"]
    if "place" in msg:
        obj[CONF_OBJECT_PLACE] = msg["place"]
    if "remind_on_site" in msg:
        obj[CONF_OBJECT_REMIND_ON_SITE] = msg["remind_on_site"]
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
    swap_report = None
    new_device = msg.get("ha_device_id")
    if new_device and new_device != obj.get("ha_device_id"):
        # A new device for this object (the appliance was replaced, or
        # re-paired and came back under a new id): its sensor triggers,
        # completion actions and adopted-task fingerprints follow it.
        tasks = dict(new_data.get(CONF_TASKS) or {})
        moved_tasks, swap_report = move_tasks_to_device(
            hass, tasks, old_device_ids(obj, tasks.values(), new_device), new_device, user_id=connection.user.id
        )
        new_data[CONF_TASKS] = moved_tasks
    for key in ("ha_device_id", "parent_entry_id"):
        if key in msg and msg[key] != obj.get(key):
            obj[key] = msg[key]
            device_link_changed = True

    # Safety net: cap user strings on persist so this write path matches the
    # create path (which caps via the config flow) and tasks (cap_task_fields).
    cap_object_fields(obj)
    new_data[CONF_OBJECT] = obj
    title = name_or_title(obj, entry.title)
    hass.config_entries.async_update_entry(entry, data=new_data, title=title)
    if device_link_changed:
        hass.config_entries.async_schedule_reload(entry.entry_id)
    else:
        # The other open panels and cards: their subscription pushes on a
        # coordinator update, and this write is none — a rename showed there
        # after the next 5-minute refresh (bug audit 2026-10-16, W5).
        rd = get_runtime_data(hass, entry.entry_id)
        if rd is not None and rd.coordinator is not None:
            rd.coordinator.async_update_listeners()

    result: dict[str, Any] = {"success": True}
    if swap_report is not None:
        result["device_swap"] = swap_report.as_dict()
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/delete",
        vol.Required("entry_id"): ID_FIELD,
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
        vol.Required("entry_id"): ID_FIELD,
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
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    src_obj = entry.data.get(CONF_OBJECT, {})
    # There is ONE battery fleet: a copy carried the fleet flags on the object
    # and its task and ran a second fleet — double triggers and notifications
    # (bug audit 2026-09-27; task/duplicate refuses the fleet task alike).
    if src_obj.get(BATTERY_FLEET_OBJECT_FLAG):
        send_translated_error(connection, msg["id"], "invalid_input", "The battery fleet object cannot be duplicated", translation_key="fleet_not_duplicable")
        return
    new_obj = deepcopy(dict(src_obj))
    new_obj["id"] = uuid4().hex
    base_name = str(src_obj.get(CONF_OBJECT_NAME, "")).strip() or "Object"

    new_obj[CONF_OBJECT_NAME] = unique_object_name(hass, f"{base_name[: MAX_NAME_LENGTH - 7]} (copy)")
    # Serial number identifies one physical unit — never duplicate it.
    new_obj[CONF_OBJECT_SERIAL_NUMBER] = None
    new_obj["task_ids"] = []
    # A new unit: not archived, not paused, not part of a replacement chain
    # (the copy kept the pause and the "Replaces / Replaced by" links, BI5-A7).
    for key in ("archived_at", "paused_at", "paused_until", "predecessor_entry_id", "replaced_by_entry_id"):
        new_obj.pop(key, None)
    strip_object_reference(new_obj)

    # The parts shelf travels with fresh ids (like replace) and the task
    # links follow them. The copy used to carry the tasks' part links but no
    # parts: every completion of the copy raised a broken-part-link repair
    # (bug audit 2026-09-27). Stock does not travel — the copy is another
    # unit with its own shelf, untracked until counted.
    part_id_map, new_parts = _carry_parts_shelf(entry.data.get("parts"), keep_doc_links=False)

    new_tasks: dict[str, Any] = {}
    for src_task in entry.data.get(CONF_TASKS, {}).values():
        # Auto "buy" reminders belong to the reconciler of the SOURCE's parts.
        if src_task.get(PART_REF_FIELD):
            continue
        task = deepcopy(dict(src_task))
        task_id = uuid4().hex
        task["id"] = task_id
        task["object_id"] = new_obj["id"]
        strip_task_runtime_state(task)
        # The copy is the user's own task, not the duty / template task the
        # original was created as (2.95 fingerprint) — like task/duplicate.
        task.pop(ORIGIN_KEY, None)
        task = _remap_own_part_links(task, part_id_map, entry.entry_id)
        new_tasks[task_id] = task
        new_obj["task_ids"].append(task_id)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "websocket"},
        data={CONF_OBJECT: new_obj, CONF_TASKS: new_tasks, "parts": new_parts},
    )
    if result["type"] != "create_entry":
        connection.send_error(msg["id"], "duplicate_failed", result.get("reason", "unknown"))
        return
    connection.send_result(msg["id"], {"entry_id": result["result"].entry_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/from_template",
        vol.Required("template_id"): ID_FIELD,
        vol.Optional("name"): vol.Any(vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)), None),
        # v2.21.1: the caller's UI language — created object/task names are
        # localized (falls back to the server language).
        vol.Optional("language"): vol.All(str, vol.Length(max=10)),
        # #225: the new object goes inside this one (Add sub-object › From
        # a template).
        vol.Optional("parent_entry_id"): vol.Any(ID_FIELD, None),
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
    from ..templates import async_build_template_tasks, get_template_by_id, localize_template_text

    template = get_template_by_id(msg["template_id"])
    if template is None:
        connection.send_error(msg["id"], "not_found", "Template not found")
        return
    if not _validate_device_link(hass, connection, msg, self_entry_id=None):
        return

    lang = normalize_language_code(msg.get("language")) if msg.get("language") else normalize_language(hass)
    default_name = localize_template_text(template.name, lang) or template.name
    name = (msg.get("name") or default_name).strip() or default_name
    # Auto-number on collision: applying the same template twice (or owning
    # three litter boxes) must not fail with already_configured — the second
    # object becomes "Name 2", then "Name 3", …
    name = unique_object_name(hass, name)
    object_id = uuid4().hex
    new_obj: dict[str, Any] = {
        "id": object_id,
        CONF_OBJECT_NAME: name[:MAX_NAME_LENGTH],
        "task_ids": [],
        # 2.94: the gallery marks templates in use as "already set up".
        OBJECT_TEMPLATE_ID: template.id,
        **({"parent_entry_id": msg["parent_entry_id"]} if msg.get("parent_entry_id") else {}),
    }
    # Seasons follow the home's hemisphere and climate (helpers/climate.py).
    new_tasks = await async_build_template_tasks(hass, template, lang, object_id)
    new_obj["task_ids"] = list(new_tasks)

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
        vol.Required("entry_id"): ID_FIELD,
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
    new_data = _archived_entry_data(entry.data, now_iso, keep_task_ids=_live_pool_buy_tasks(hass, entry))
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Reload so the object's tasks' triggers tear down and entities go inert.
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True, "archived_at": now_iso})


def _live_pool_buy_tasks(hass: HomeAssistant, entry: Any) -> set[str]:
    """The object's buy reminders for parts OTHER live objects still borrow.

    Archiving the owner of a shared pool (#111) retires the owner, not the
    shelf — the borrowers keep consuming it, so its "Buy …" reminder must
    stay live (bug audit 2026-09-27; the buy-task reconcile keeps these
    parts, parts_runtime).
    """
    in_use = borrowed_part_ids(hass, entry.entry_id, active_only=True)
    if not in_use:
        return set()
    keep: set[str] = set()
    for tid, td in (entry.data.get(CONF_TASKS) or {}).items():
        ref = td.get(PART_REF_FIELD)
        if isinstance(ref, dict) and str(ref.get("part_id") or "") in in_use:
            keep.add(tid)
    return keep


def _archived_entry_data(entry_data: Any, now_iso: str, *, keep_task_ids: set[str] | None = None) -> dict[str, Any]:
    """New entry data with the object archived and active tasks cascaded.

    Shared by ``object/archive`` and the replace flow (which retires the
    predecessor with exactly the same semantics). ``keep_task_ids`` stay
    active (a shared pool's buy reminders, :func:`_live_pool_buy_tasks`).
    """
    obj = dict(entry_data.get(CONF_OBJECT, {}))
    obj["archived_at"] = now_iso
    # Archiving supersedes a seasonal pause — don't leave both markers.
    obj.pop("paused_at", None)
    obj.pop("paused_until", None)

    new_tasks: dict[str, Any] = {}
    for tid, td in dict(entry_data.get(CONF_TASKS, {})).items():
        td = dict(td)
        if td.get("archived_at") is None and tid not in (keep_task_ids or ()):  # cascade only to active tasks
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
        vol.Required("entry_id"): ID_FIELD,
        # The Undo of an archive / a pause just made: restore the task as it
        # was instead of starting a fresh cycle (bug audit 2026-10-16: the
        # Undo toast re-anchored the task to today, clearing overdue and
        # postponed dates).
        vol.Optional("undo", default=False): bool,
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
    ones get a fresh cycle (D2), except with ``undo`` (the Undo of the
    archive): then they keep their dates. Tasks archived manually or
    auto-archived keep their archived state — they were retired independently.
    """
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    obj = dict(entry.data.get(CONF_OBJECT, {}))
    if obj.get("archived_at") is None:
        connection.send_error(msg["id"], "not_archived", "Object is not archived")
        return
    obj.pop("archived_at", None)

    store = get_store(hass, entry.entry_id)
    today_iso = dt_util.now().date().isoformat()

    new_tasks: dict[str, Any] = {}
    for tid, td in entry.data.get(CONF_TASKS, {}).items():
        td = dict(td)
        if td.get("archived_reason") == ARCHIVE_REASON_OBJECT:
            td.pop("archived_at", None)
            td.pop("archived_reason", None)
            # Fresh cycle for recurring tasks (D2); last_performed is dynamic →
            # Store when present, else the static dict (legacy). Shared core so
            # this path can't drift from resume/task-unarchive.
            if not msg.get("undo") and wants_fresh_cycle(td):
                reanchor_recurring_task(tid, store=store, today_iso=today_iso, task_data=td)
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
        vol.Required("entry_id"): ID_FIELD,
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
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    obj = dict(entry.data.get(CONF_OBJECT, {}))
    if obj.get("archived_at") is not None:
        send_translated_error(connection, msg["id"], "archived", "An archived object cannot be paused", translation_key="archived_cannot_pause")
        return
    if obj.get("paused_at") is not None:
        connection.send_error(msg["id"], "already_paused", "Object already paused")
        return

    ok, until = _parse_pause_until(connection, msg["id"], msg.get("until"))
    if not ok:
        return

    now_iso = dt_util.now().isoformat()
    obj["paused_at"] = now_iso
    obj["paused_until"] = until

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
        vol.Required("entry_id"): ID_FIELD,
        # The Undo of an archive / a pause just made: restore the task as it
        # was instead of starting a fresh cycle (bug audit 2026-10-16: the
        # Undo toast re-anchored the task to today, clearing overdue and
        # postponed dates).
        vol.Optional("undo", default=False): bool,
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
    pump comes back with a clean slate, not five months overdue. With
    ``undo`` (the Undo of the pause) the tasks keep their dates.
    """
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    obj = entry.data.get(CONF_OBJECT, {})
    if obj.get("paused_at") is None:
        connection.send_error(msg["id"], "not_paused", "Object is not paused")
        return

    store = get_store(hass, entry.entry_id)
    new_data = build_resumed_entry_data(dict(entry.data), store, dt_util.now().date().isoformat(), fresh_cycle=not msg.get("undo"))
    hass.config_entries.async_update_entry(entry, data=new_data)
    if store is not None:
        await store.async_save()

    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/replace",
        vol.Required("entry_id"): ID_FIELD,
        vol.Optional("name"): vol.Any(vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)), None),
        # The new unit's device: omitted = the same device as the old unit
        # (a controller or smart plug that stays), an id = the new unit's own
        # device (the wiring follows it), null = none yet.
        vol.Optional("ha_device_id"): vol.Any(ID_FIELD, None),
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
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    src_obj = entry.data.get(CONF_OBJECT, {})
    if src_obj.get("archived_at") is not None:
        send_translated_error(connection, msg["id"], "archived", "An archived object cannot be replaced", translation_key="archived_cannot_replace")
        return
    # The one battery fleet: a replacement ran a second fleet whose parts no
    # fleet code reaches, while the fleet commands kept acting on the archived
    # predecessor (bug audit 2026-10-17, W-1; object/duplicate refuses alike).
    if src_obj.get(BATTERY_FLEET_OBJECT_FLAG):
        send_translated_error(connection, msg["id"], "invalid_input", "The battery fleet object cannot be replaced", translation_key="fleet_not_replaceable")
        return

    name = (msg.get("name") or "").strip() or str(src_obj.get(CONF_OBJECT_NAME, "")).strip() or "Object"
    if not _validate_device_link(hass, connection, msg, self_entry_id=None):
        return

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
    strip_object_reference(new_obj)

    # Carry the parts shelf — the spares don't change when the machine dies.
    # Fresh ids (like tasks); consumption links are remapped below and the
    # tracked stock is copied into the successor's store after creation.
    # Part manuals travel with the documents (part_id_map below).
    part_id_map, new_parts = _carry_parts_shelf(entry.data.get("parts"), keep_doc_links=True)

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
        strip_task_runtime_state(task)
        # Own-shelf links (task level AND per phase) follow the fresh part
        # ids; a pool owned by ANOTHER object (#111) is untouched by
        # replacing this one — carried verbatim, or the successor silently
        # stops consuming it.
        task = _remap_own_part_links(task, part_id_map, entry.entry_id)
        new_tasks[task_id] = task
        new_obj["task_ids"].append(task_id)

    # The new unit is usually a new device in Home Assistant, not the old
    # one: carried over verbatim, the successor kept watching the retired
    # machine's sensors and pressing its reset button.
    swap_report = None
    if "ha_device_id" in msg:
        new_device = msg["ha_device_id"]
        if new_device and new_device != src_obj.get("ha_device_id"):
            new_tasks, swap_report = move_tasks_to_device(
                hass, new_tasks, old_device_ids(src_obj, new_tasks.values(), new_device), new_device, user_id=connection.user.id
            )
        new_obj["ha_device_id"] = new_device

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
        src_store = get_store(hass, entry.entry_id)
        new_entry = hass.config_entries.async_get_entry(new_entry_id)
        new_store = get_store(hass, new_entry_id)
        if src_store is not None and new_store is not None:
            for old_pid, new_pid in part_id_map.items():
                stock = src_store.get_part_stock(old_pid)
                if stock is not None:
                    new_store.set_part_stock(new_pid, stock)
                    new_store.set_part_restoring(new_pid, src_store.get_part_restoring(old_pid))
            await new_store.async_save()
        # Objects BORROWING the predecessor's pool (#111) now draw on the
        # successor's shelf. They kept linking to the archived predecessor —
        # whose buy tasks the archive suppresses — so the pool silently split
        # in two (bug audit 2026-09-27).
        relink_borrowers(hass, entry.entry_id, new_entry_id, part_id_map)
        # Their history too: a later edit or delete of a completion put the
        # parts back on the archived predecessor's shelf (audit 2026-10-17, S-7).
        for other in get_object_entries(hass):
            if other.entry_id not in (entry.entry_id, new_entry_id):
                await async_relink_history(hass, other, entry.entry_id, new_entry_id, part_id_map)
        if new_entry is not None:
            schedule_buy_task_reconcile(hass, new_entry)

    # Retire the predecessor (archive cascade) with the successor pointer.
    now_iso = dt_util.now().isoformat()
    retired = _archived_entry_data(entry.data, now_iso)
    retired_obj = dict(retired[CONF_OBJECT])
    retired_obj["replaced_by_entry_id"] = new_entry_id
    retired[CONF_OBJECT] = retired_obj
    hass.config_entries.async_update_entry(entry, data=retired)
    await hass.config_entries.async_reload(entry.entry_id)

    reply: dict[str, Any] = {"entry_id": new_entry_id}
    if swap_report is not None:
        reply["device_swap"] = swap_report.as_dict()
    connection.send_result(msg["id"], reply)


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
    result = get_entity_attributes(hass, msg["entity_id"])
    connection.send_result(msg["id"], result)
