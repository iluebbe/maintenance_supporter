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
    BATTERY_FLEET_DUE_WITHOUT_SENSOR,
    BATTERY_FLEET_EXCLUDED,
    BATTERY_FLEET_INCLUDED,
    BATTERY_FLEET_OBJECT_FLAG,
    BATTERY_FLEET_REMOVED_PARTS,
    BATTERY_FLEET_TASK_FLAG,
    BATTERY_FLEET_TRACK_SELF_CHARGING,
    CONF_OBJECT,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_TASKS,
    DOMAIN,
    MAX_ENTITY_SLUG_LENGTH,
    MAX_ID_LENGTH,
    MAX_IMPORT_PAYLOAD_BYTES,
    MAX_JSON_IMPORT_PAYLOAD_BYTES,
    MAX_VACATION_EXEMPT_TASKS,
)
from ..helpers.aggregate import object_name
from ..helpers.dates import normalize_hhmm, parse_iso_date
from ..helpers.global_options import get_default_warning_days
from ..helpers.history import finite_amount
from ..helpers.parts import PartValidationError, map_part_links, normalize_part
from ..helpers.phases import clamp_phase_cursor, sanitize_phase_defs, sanitize_phase_sequence
from ..helpers.qr_generator import (
    _ACTION_ICON_MAP,
    build_qr_url,
    generate_qr_svg,
    generate_qr_svg_data_uri,
)
from ..helpers.ws_errors import send_translated_error
from ..websocket.tasks import _check_nfc_tag_duplicate, _validate_trigger_config
from . import ID_FIELD, _get_object_entries, _load_object_entry, _load_object_task, _merge_global_options

_LOGGER = logging.getLogger(__name__)


def _ref_or_none(value: Any) -> int | None:
    """#170: a reference number / counter from a backup — positive int or nothing."""
    return value if isinstance(value, int) and not isinstance(value, bool) and value > 0 else None


def _iso_marker(value: Any) -> str | None:
    """Keep ``value`` only if it parses as an ISO date/datetime, else drop it.

    ``paused_at`` is a *marker* whose mere presence means "paused"; a garbage
    value imported from a hand-edited/foreign backup would otherwise freeze the
    object as paused forever (and a malformed ``paused_until`` means auto-resume
    never fires). Validate on import so only a real timestamp restores the state.
    """
    from datetime import datetime

    if not isinstance(value, str) or not value.strip():
        return None
    s = value.strip()
    try:
        datetime.fromisoformat(s.replace("Z", "+00:00"))
        return s
    except ValueError:
        return s if parse_iso_date(s) is not None else None


# The type each of these imported task fields must have (see the import loop).
_TASK_FIELD_TYPES: dict[str, type | tuple[type, ...]] = {
    "responsible_user_id": str,
    "assignee_pool": list,
    "adaptive_config": dict,
    "schedule": dict,
    "on_complete_action": dict,
    "quick_complete_defaults": dict,
    "checklist": list,
    "labels": list,
    "required_completion_fields": list,
    "mirror_todo_entities": list,
}


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
    dropped = 0
    for entry in history:
        if not isinstance(entry, dict):
            continue
        clean = dict(entry)
        # The timestamp is what every reader sorts, compares and parses as an
        # ISO string: a number (epoch) or junk from a hand-edited backup made
        # the next completion raise TypeError (bug audit 2026-09-27). A
        # numeric epoch is converted; an entry whose moment cannot be read at
        # all is dropped — junk text would also sort above every real date
        # and erase the anchor. An ABSENT timestamp stays as it was (readers
        # treat it as the empty string).
        if clean.get("timestamp") is not None:
            stamp = _history_timestamp(clean["timestamp"])
            if stamp is None:
                dropped += 1
                continue
            clean["timestamp"] = stamp
        # The type decides how every reader treats the entry; one that is no
        # text at all stopped the object's coordinator (bug audit
        # 2026-09-29). completed_by is looked up as a user id.
        if "type" in clean and not isinstance(clean["type"], str):
            dropped += 1
            continue
        if "completed_by" in clean and not isinstance(clean["completed_by"], str):
            clean.pop("completed_by")
        cost = clean.get("cost")
        if isinstance(cost, bool) or not isinstance(cost, (int, float)) or not math.isfinite(cost) or cost < 0:
            clean.pop("cost", None)
        # Readings (#83 / #161 phase 2): same NaN/Infinity hole — a poisoned
        # value would break every delta after it. Malformed slot snapshots
        # are dropped item-wise, the completion itself is kept.
        rv = clean.get("reading_value")
        if rv is not None and (isinstance(rv, bool) or not isinstance(rv, (int, float)) or not math.isfinite(rv)):
            clean.pop("reading_value", None)
        # Duration: text or NaN made the object's average-duration sum raise
        # on every refresh (bug audit 2026-09-26) — numeric text is kept as a
        # number, anything else dropped.
        if "duration" in clean:
            minutes = finite_amount(clean["duration"])
            if minutes is None:
                clean.pop("duration", None)
            else:
                clean["duration"] = int(minutes) if minutes.is_integer() else minutes
        if "reading_values" in clean:
            from ..helpers.reading_slots import history_reading_values

            snapshot = history_reading_values(clean)
            if snapshot:
                clean["reading_values"] = snapshot
            else:
                clean.pop("reading_values", None)
        out.append(clean)
    if dropped:
        _LOGGER.warning("Import: dropped %d history entr(y/ies) without a readable timestamp or type", dropped)
    return out


def _history_timestamp(value: Any) -> str | None:
    """An imported history ``timestamp`` as an ISO string, or None.

    ISO datetime / date strings are kept verbatim (live history mixes aware
    and naive values, and readers compare them as strings); an int / float
    is taken as a Unix epoch (seconds, or milliseconds when that large) and
    converted to UTC ISO; anything else is unreadable.
    """
    from datetime import UTC, datetime

    if isinstance(value, str):
        text = value.strip()
        if not text:
            return None
        try:
            datetime.fromisoformat(text.replace("Z", "+00:00"))
        except ValueError:
            return None
        return text
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    seconds = float(value)
    if seconds > 1e11:  # milliseconds
        seconds /= 1000
    try:
        return datetime.fromtimestamp(seconds, tz=UTC).isoformat()
    except (OverflowError, OSError, ValueError):
        return None


# ── Replace lineage + shared pools across an import (bug audit 2026-09-27) ──
#
# An import mints NEW entry ids, but objects refer to each other by entry id:
# a replacement's ``predecessor_entry_id`` (which also exempts it from the
# name rule — the successor usually keeps the old name), the retired object's
# ``replaced_by_entry_id``, a ``parent_entry_id`` and a task's part link into
# another object's pool (#111). Copied verbatim, every one of them pointed at
# the SOURCE instance's objects: a replaced pair restored onto a clean
# instance failed with "already_configured" for the active successor, and
# every shared-pool link was dropped. Objects are therefore created in
# dependency order and these ids remapped through an old→new map.

_LINEAGE_KEYS = ("predecessor_entry_id", "replaced_by_entry_id", "parent_entry_id")


def _object_dependencies(obj_entry: Any) -> set[str]:
    """Old entry ids an import payload object needs created BEFORE it: the
    object it replaced and the owners of the pools its tasks draw on."""
    from ..helpers.parts import iter_part_links

    deps: set[str] = set()
    if not isinstance(obj_entry, dict):
        return deps
    obj_data = obj_entry.get("object")
    pred = obj_data.get("predecessor_entry_id") if isinstance(obj_data, dict) else None
    if isinstance(pred, str) and pred:
        deps.add(pred)
    tasks = obj_entry.get("tasks")
    for task in tasks if isinstance(tasks, list) else []:
        if isinstance(task, dict):
            deps.update(str(link["entry_id"]) for link in iter_part_links(task) if link.get("entry_id"))
    deps.discard(str(obj_entry.get("entry_id") or ""))
    return deps


def _import_order(objects: list[Any]) -> list[int]:
    """Indexes of ``objects``, each after the payload objects it depends on
    (:func:`_object_dependencies`); otherwise the payload order. A cycle is
    broken where it closes (those references then fall back per key)."""
    by_old: dict[str, int] = {}
    for idx, obj_entry in enumerate(objects):
        old = obj_entry.get("entry_id") if isinstance(obj_entry, dict) else None
        if isinstance(old, str) and old:
            by_old.setdefault(old, idx)
    deps = [sorted(by_old[d] for d in _object_dependencies(o) if d in by_old) for o in objects]
    order: list[int] = []
    done: set[int] = set()
    for root in range(len(objects)):
        if root in done:
            continue
        on_stack = {root}
        stack = [(root, iter(deps[root]))]
        while stack:
            node, pending = stack[-1]
            nxt = next(pending, None)
            if nxt is None:
                stack.pop()
                on_stack.discard(node)
                done.add(node)
                order.append(node)
            elif nxt not in done and nxt not in on_stack:
                on_stack.add(nxt)
                stack.append((nxt, iter(deps[nxt])))
    return order


class _ImportLineage:
    """Old→new entry ids (and part ids) of one import run."""

    def __init__(self, hass: HomeAssistant, objects: list[Any]) -> None:
        self._hass = hass
        self.payload_ids = {
            str(o["entry_id"]) for o in objects if isinstance(o, dict) and isinstance(o.get("entry_id"), str) and o["entry_id"]
        }
        self.entry_ids: dict[str, str] = {}
        self.part_ids: dict[str, dict[str, str]] = {}
        self._pending: list[tuple[str, dict[str, str]]] = []

    def _live(self, entry_id: str) -> bool:
        return self._hass.config_entries.async_get_entry(entry_id) is not None

    def apply(self, import_obj: dict[str, Any], obj_data: dict[str, Any]) -> dict[str, str]:
        """Set the lineage ids on a new object dict; returns the references to
        a payload object that is not created yet (resolved by :meth:`finish`).

        An id outside the payload is kept verbatim (a same-instance partial
        restore keeps it valid; a stale one degrades gracefully at read
        time). A payload id maps to the object's new entry id; until that
        exists it falls back to a live object with the old id, else None.
        """
        pending: dict[str, str] = {}
        for key in _LINEAGE_KEYS:
            old = obj_data.get(key)
            if not isinstance(old, str) or not old:
                import_obj[key] = None
                continue
            if old not in self.payload_ids:
                import_obj[key] = old
                continue
            new = self.entry_ids.get(old)
            if new is None:
                pending[key] = old
                new = old if self._live(old) else None
            import_obj[key] = new
        return pending

    def created(self, old_entry_id: Any, new_entry_id: str, part_id_map: dict[str, str], pending: dict[str, str]) -> None:
        if isinstance(old_entry_id, str) and old_entry_id:
            self.entry_ids[old_entry_id] = new_entry_id
            self.part_ids[old_entry_id] = dict(part_id_map)
        if pending:
            self._pending.append((new_entry_id, pending))

    def link_rewriter(self, own_old_entry_id: str, part_id_map: dict[str, str]) -> Any:
        """The rewrite for one object's part links (helpers.parts.map_part_links):
        own links follow the fresh part ids, a pool link to a payload object
        follows that object's new ids, a link to a live object (a
        same-instance import) stays, the rest is dropped rather than left
        pointing nowhere."""

        def _rewrite(link: dict[str, Any]) -> dict[str, Any] | None:
            owner = str(link.get("entry_id") or "").strip()
            part_id = str(link.get("part_id") or "")
            if not owner or owner == own_old_entry_id:
                if part_id not in part_id_map:
                    return None
                return {"part_id": part_id_map[part_id], "quantity": link.get("quantity", 1)}
            new_owner = self.entry_ids.get(owner)
            owner_parts = self.part_ids.get(owner) or {}
            if new_owner is not None and part_id in owner_parts:
                return {**link, "entry_id": new_owner, "part_id": owner_parts[part_id]}
            return link if self._live(owner) else None

        return _rewrite

    def finish(self) -> None:
        """Point the references to objects created LATER at their new ids."""
        for new_entry_id, refs in self._pending:
            entry = self._hass.config_entries.async_get_entry(new_entry_id)
            if entry is None:
                continue
            obj = dict(entry.data.get(CONF_OBJECT) or {})
            changed = {key: self.entry_ids[old] for key, old in refs.items() if old in self.entry_ids}
            if not changed:
                continue
            obj.update(changed)
            self._hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_OBJECT: obj})
            if "parent_entry_id" in changed:
                # The via_device hierarchy is built when entities are added.
                self._hass.config_entries.async_schedule_reload(new_entry_id)
        # A retired object imported without its successor pointer (the CSV
        # carries only the predecessor) gets it back from the successor.
        created = set(self.entry_ids.values())
        for new_entry_id in created:
            successor = self._hass.config_entries.async_get_entry(new_entry_id)
            pred_id = (successor.data.get(CONF_OBJECT) or {}).get("predecessor_entry_id") if successor else None
            if pred_id not in created:
                continue
            pred = self._hass.config_entries.async_get_entry(pred_id)
            pred_obj = dict((pred.data.get(CONF_OBJECT) or {}) if pred else {})
            if pred is not None and not pred_obj.get("replaced_by_entry_id"):
                pred_obj["replaced_by_entry_id"] = new_entry_id
                self._hass.config_entries.async_update_entry(pred, data={**pred.data, CONF_OBJECT: pred_obj})


def _stamp_imported_action_owner(task_data: dict[str, Any], user_id: str | None) -> None:
    """A completion action restored from a file runs as the IMPORTING admin.

    The file's ``configured_by`` is never trusted — it could name any user,
    an admin included (json/import is admin-only, but the file may come from
    anywhere). Stamping the admin who imported it keeps the SEC-2 model
    ("every action runs as a real user") instead of silently falling back to
    system rights, and records who authorised it (bug audit 2026-09-27;
    docs/CONFIGURATION.md "Who the action runs as").
    """
    from ..helpers.sanitize import ACTION_OWNER_KEY

    action = task_data.get("on_complete_action")
    if not isinstance(action, dict):
        return
    action = {k: v for k, v in action.items() if k != ACTION_OWNER_KEY}
    if user_id:
        action[ACTION_OWNER_KEY] = user_id
    task_data["on_complete_action"] = action


def _future_last_performed(value: Any) -> bool:
    """A last-performed date after today — dropped on import with a warning
    (bug audit 2026-09-27: a year-9999 anchor overflowed the schedule math
    inside every refresh and kept the object in setup-retry)."""
    from homeassistant.util import dt as dt_util

    parsed = parse_iso_date(value) if isinstance(value, str) else None
    return parsed is not None and parsed > dt_util.now().date()


def _remap_document_refs(
    import_tasks: dict[str, dict[str, Any]],
    import_parts: dict[str, dict[str, Any]],
    doc_id_map: dict[str, str],
) -> None:
    """Re-point document references at the freshly minted doc ids.

    History entries carry completion photos (``photo_doc_ids``, or the
    pre-2.75 ``photo_doc_id`` scalar — folded into the list here) and spare
    parts carry a ``doc_id``. Ids the export did not carry (a hand-written
    file, a doc that vanished before the export) stay verbatim: a dangling
    reference renders as a missing picture, which is what it is.
    """
    from ..helpers.completion_photos import history_photo_ids

    for task_data in import_tasks.values():
        for hist_entry in task_data.get("history") or []:
            if not isinstance(hist_entry, dict):
                continue
            photos = history_photo_ids(hist_entry)
            if not photos:
                continue
            hist_entry.pop("photo_doc_id", None)
            hist_entry["photo_doc_ids"] = [doc_id_map.get(p, p) for p in photos]
    for part in import_parts.values():
        old = part.get("doc_id")
        if isinstance(old, str) and old in doc_id_map:
            part["doc_id"] = doc_id_map[old]


async def _drop_imported_documents(doc_store: Any, object_id: str) -> None:
    """Undo a pre-flow document import when the object never came to be.

    Documents are recreated BEFORE the entry flow (their fresh ids must be
    known to remap history photos and part doc_ids); if the flow then
    fails they would linger as orphans nobody can reach. ``object_id`` is
    freshly minted per import, so every doc under it is ours to drop.
    """
    if doc_store is None:
        return
    for orphan in list(doc_store.for_object(object_id)):
        await doc_store.async_remove(orphan["id"])


def _import_fleet_identity(
    hass: HomeAssistant,
    obj_data: dict[str, Any],
    import_obj: dict[str, Any],
    obj_name: str,
) -> bool:
    """Restore the battery-fleet markers onto ``import_obj``; True if it is the fleet.

    The exported flag is honoured only while this instance has NO fleet yet
    (``find_fleet_entry`` returns the FIRST flagged entry, so a second flagged
    object would silently shadow or be shadowed by the existing one). The
    exclude/include lists are re-validated like the live WS writes: entity
    ids only, deduped + sorted, capped at ``FLEET_LIST_CAP``.
    """
    if obj_data.get(BATTERY_FLEET_OBJECT_FLAG) is not True:
        return False

    from homeassistant.core import valid_entity_id

    from ..helpers.battery_fleet_setup import FLEET_LIST_CAP, find_fleet_entry

    if find_fleet_entry(hass) is not None:
        _LOGGER.warning(
            "JSON import: %r is flagged as the Battery Fleet but this instance already has one — importing it as a plain object",
            obj_name,
        )
        return False

    import_obj[BATTERY_FLEET_OBJECT_FLAG] = True
    for key in (BATTERY_FLEET_EXCLUDED, BATTERY_FLEET_INCLUDED):
        raw_list = obj_data.get(key)
        if not isinstance(raw_list, list):
            continue
        cleaned = sorted({e.strip() for e in raw_list if isinstance(e, str) and valid_entity_id(e.strip())})
        if cleaned:
            import_obj[key] = cleaned[:FLEET_LIST_CAP]
    if obj_data.get(BATTERY_FLEET_TRACK_SELF_CHARGING) is True:
        import_obj[BATTERY_FLEET_TRACK_SELF_CHARGING] = True
    if obj_data.get(BATTERY_FLEET_DUE_WITHOUT_SENSOR) is False:
        import_obj[BATTERY_FLEET_DUE_WITHOUT_SENSOR] = False
    # Deleted type-parts stay deleted after a restore too — same id rule as
    # _keep_fleet_part_id, so nothing but ``batt_<type>`` ids get through.
    raw_removed = obj_data.get(BATTERY_FLEET_REMOVED_PARTS)
    if isinstance(raw_removed, list):
        removed = sorted({p.strip() for p in raw_removed if isinstance(p, str) and _keep_fleet_part_id(True, p.strip())})
        if removed:
            import_obj[BATTERY_FLEET_REMOVED_PARTS] = removed[:FLEET_LIST_CAP]
    return True


def _keep_fleet_part_id(is_fleet: bool, old_id: str) -> bool:
    """Whether an imported part keeps its id instead of getting a fresh uuid.

    Only the fleet's deterministic type-part ids (``batt_<type>``, minted by
    battery_fleet_setup._type_part) — every other part id is re-minted so an
    import can never collide with or impersonate an existing part.
    """
    return is_fleet and old_id.startswith("batt_") and len(old_id) <= MAX_ID_LENGTH


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
    section needs the full list to render the toggles. v2.93 adds the home
    ``profile`` (dwelling, climate, country — all derived locally) and per
    template whether the gallery recommends it and why; 2.94 ``set_up`` —
    an active object already stands for it (helpers.template_usage), so it
    is not recommended again.
    """
    from ..helpers.home_profile import async_home_profile
    from ..helpers.i18n import normalize_language, normalize_language_code
    from ..helpers.template_usage import templates_in_use
    from ..templates import (
        TEMPLATE_CATEGORIES,
        TEMPLATES,
        get_disabled_template_ids,
        localize_template_text,
        recommend_template,
        task_interval,
        template_tasks,
    )

    disabled = get_disabled_template_ids(hass)
    profile = await async_home_profile(hass)
    in_use = templates_in_use(hass)
    lang = normalize_language_code(msg.get("language")) if msg.get("language") else normalize_language(hass)

    result = {
        "categories": {cat_id: {k: v for k, v in cat.items()} for cat_id, cat in TEMPLATE_CATEGORIES.items()},
        "profile": profile.as_dict(lang),
        "templates": [
            {
                "id": t.id,
                "name": localize_template_text(t.name, lang),
                "category": t.category,
                "disabled": t.id in disabled,
                **recommend_template(t, profile, set_up=t.id in in_use),
                "tasks": [
                    {
                        "name": localize_template_text(tt.name, lang),
                        "type": tt.type,
                        "schedule_type": tt.schedule_type,
                        "interval_days": task_interval(tt, profile.country, profile.region),
                        "warning_days": tt.warning_days,
                    }
                    # What creating it here makes: winter-only tasks left
                    # out without a cold season, the country's cycle.
                    for tt in template_tasks(t, has_winter=profile.has_winter, country=profile.country, region=profile.region)
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
        vol.Optional("entry_ids"): [ID_FIELD],
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

    # Phase 1: gather data on the event loop (accesses HA APIs); name the HA
    # users it points at so another instance can map them by name.
    from ..helpers.import_mapping import async_attach_move_hints

    data = await async_attach_move_hints(hass, build_export_data(hass, include_history=include_history, entry_ids=entry_ids))

    # Phase 2: serialize in executor (CPU-bound, no HA API calls)
    result = await hass.async_add_executor_job(serialize_export, data, fmt)

    connection.send_result(msg["id"], {"format": fmt, "data": result})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/csv/export",
        vol.Optional("entry_ids"): [ID_FIELD],
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
        vol.Optional("entry_ids"): [ID_FIELD],
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
        send_translated_error(connection, msg["id"], "too_large", "CSV content exceeds 1MB limit", translation_key="import_too_large", translation_placeholders={"limit": "1 MB"})
        return

    objects = import_objects_csv(csv_content, hass=hass)
    if len(objects) > 1000:
        send_translated_error(connection, msg["id"], "too_many", "CSV contains more than 1000 objects", translation_key="import_too_many", translation_placeholders={"max": "1000"})
        return

    if not objects:
        send_translated_error(connection, msg["id"], "empty_csv", "No valid objects found in CSV", translation_key="import_csv_no_objects")
        return

    created = []
    errors: list[dict[str, str]] = []
    # Rows are grouped by the source object (object_entry_id column), so a
    # replaced pair of the same name stays two objects; the pair's lineage
    # is remapped like the JSON import's (bug audit 2026-09-27).
    lineage = _ImportLineage(hass, objects)
    for idx in _import_order(objects):
        obj_data = objects[idx]
        pending = lineage.apply(obj_data["object"], obj_data["object"])
        # Check for NFC tag duplicates in CSV-imported tasks
        nfc_warnings: list[str] = list(obj_data.get("warnings") or [])
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
            lineage.created(obj_data.get("entry_id"), result["result"].entry_id, {}, pending)
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
    lineage.finish()

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
        vol.Required("type"): f"{DOMAIN}/settings/export",
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_export_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Export the global entry's settings as JSON.

    The objects export deliberately excludes the global scope (groups, saved
    views, vacation, notification/budget settings, feature toggles) — this is
    its second half. Import goes through the regular json/import command,
    which recognizes the ``global_settings`` section.
    """
    from ..export import build_settings_export
    from ..helpers.import_mapping import async_attach_move_hints

    data = await async_attach_move_hints(hass, build_settings_export(hass))
    connection.send_result(msg["id"], {"format": "json", "data": json_mod.dumps(data, indent=2)})


def _apply_settings_import(
    hass: HomeAssistant,
    raw: dict[str, Any],
    *,
    user_map: dict[str, str] | None = None,
    task_names: Any = None,
) -> list[str]:
    """Apply an imported ``global_settings`` payload; returns the applied keys.

    Scalar settings run through the SAME validation as the ``global/update``
    WS command (``sanitize_settings_input``); an invalid notify_service is
    dropped rather than failing the import. The structured sections reuse
    their own sanitizers: saved views via ``sanitize_view``, groups shape-
    checked here, vacation dates validated like ``vacation/update``. Group
    task_refs and vacation exempt ids may point at objects of the SOURCE
    instance: those that resolve nowhere are re-pointed by object + task
    name (``task_names``, the export's hints) when the objects are already
    here, and by the objects import's id map when they come later
    (helpers.import_mapping). A saved view's person follows ``user_map``.
    """
    from ..const import (
        CONF_GROUPS,
        CONF_SAVED_FILTER_VIEWS,
        CONF_VACATION_BUFFER_DAYS,
        CONF_VACATION_ENABLED,
        CONF_VACATION_END,
        CONF_VACATION_EXEMPT_TASK_IDS,
        CONF_VACATION_START,
        MAX_GROUP_TASK_REFS,
        MAX_NAME_LENGTH,
        MAX_SAVED_VIEWS,
    )
    from ..export import _NON_PORTABLE_SETTINGS
    from ..helpers.global_options import get_global_entry
    from ..helpers.saved_views import sanitize_view
    from ..helpers.settings_registry import ALLOWED_SETTING_KEYS
    from .dashboard import sanitize_settings_input, settings_error_field

    entry = get_global_entry(hass)
    if entry is None or not isinstance(raw, dict):
        return []

    scalars = {k: v for k, v in raw.items() if k in ALLOWED_SETTING_KEYS and k not in _NON_PORTABLE_SETTINGS}
    # The sanitizer stops at the FIRST invalid field and hands back what it
    # had so far. The import used to drop only notify_service after any error
    # — an invalid search template (javascript: included) or shopping list was
    # saved as-is and the later checks never ran (found 2026-09-26). Drop the
    # field each error names and validate the rest again.
    filtered: dict[str, Any] = {}
    for _ in range(len(scalars) + 1):
        filtered, error = sanitize_settings_input(scalars)
        if error is None:
            break
        bad = settings_error_field(error)
        _LOGGER.warning("Settings import: %s dropped (%s)", bad, error)
        if bad not in scalars:
            filtered = {}
            break
        scalars = {k: v for k, v in scalars.items() if k != bad}

    groups_in = raw.get(CONF_GROUPS)
    if isinstance(groups_in, dict):
        groups: dict[str, dict[str, Any]] = {}
        for gid, g in groups_in.items():
            if not isinstance(g, dict) or not str(g.get("name") or "").strip():
                continue
            refs = [
                {"entry_id": str(r["entry_id"]), "task_id": str(r["task_id"])}
                for r in (g.get("task_refs") or [])
                if isinstance(r, dict) and r.get("entry_id") and r.get("task_id")
            ][:MAX_GROUP_TASK_REFS]
            groups[str(gid)] = {
                "name": str(g["name"]).strip()[:MAX_NAME_LENGTH],
                "description": str(g.get("description") or "")[:MAX_NAME_LENGTH],
                "task_refs": refs,
            }
        if groups:
            filtered[CONF_GROUPS] = groups

    views_in = raw.get(CONF_SAVED_FILTER_VIEWS)
    if isinstance(views_in, list):
        views = []
        for v in views_in[:MAX_SAVED_VIEWS]:
            clean = sanitize_view(v, view_id=str(v.get("id")) if isinstance(v, dict) and v.get("id") else None)
            if clean is not None:
                views.append(clean)
        if views:
            from ..helpers.import_mapping import remap_view_users

            remap_view_users(views, user_map or {})
            filtered[CONF_SAVED_FILTER_VIEWS] = views

    if isinstance(raw.get(CONF_VACATION_ENABLED), bool):
        filtered[CONF_VACATION_ENABLED] = raw[CONF_VACATION_ENABLED]
    # Same bound as vacation/update: a date more than MAX_INTERVAL_DAYS out
    # is no vacation — 9999-12-31 overflowed the calendar inside every
    # object's refresh (bug audit 2026-09-27). Dropped with a warning.
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    from ..const import MAX_INTERVAL_DAYS

    latest_vacation_day = dt_util.now().date() + timedelta(days=MAX_INTERVAL_DAYS)
    for key in (CONF_VACATION_START, CONF_VACATION_END):
        val = raw.get(key)
        parsed_day = parse_iso_date(val) if isinstance(val, str) else None
        if parsed_day is None:
            continue
        if parsed_day > latest_vacation_day:
            _LOGGER.warning("Settings import: %s %s is more than %d days away — dropped", key, val, MAX_INTERVAL_DAYS)
            continue
        filtered[key] = val
    if isinstance(raw.get(CONF_VACATION_BUFFER_DAYS), int) and not isinstance(raw.get(CONF_VACATION_BUFFER_DAYS), bool):
        filtered[CONF_VACATION_BUFFER_DAYS] = raw[CONF_VACATION_BUFFER_DAYS]
    exempt = raw.get(CONF_VACATION_EXEMPT_TASK_IDS)
    if isinstance(exempt, list):
        cleaned = [t.strip() for t in exempt if isinstance(t, str) and t.strip()][:MAX_VACATION_EXEMPT_TASKS]
        filtered[CONF_VACATION_EXEMPT_TASK_IDS] = cleaned

    if not filtered:
        return []
    from ..helpers.import_mapping import resolve_task_refs_by_name

    resolve_task_refs_by_name(hass, filtered, task_names)
    _merge_global_options(hass, entry, filtered)
    _LOGGER.info("Settings import applied %d key(s)", len(filtered))
    return sorted(filtered)


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
    from ..templates import KNOWN_TEMPLATE_IDS

    raw = msg["json_content"]
    if len(raw) > MAX_JSON_IMPORT_PAYLOAD_BYTES:
        send_translated_error(connection, msg["id"], "too_large", "Content exceeds 10MB limit", translation_key="import_too_large", translation_placeholders={"limit": "10 MB"})
        return

    try:
        data = _parse_structured(raw)
    except ValueError:
        send_translated_error(connection, msg["id"], "invalid_format", "Content is not valid JSON or YAML", translation_key="import_not_json_yaml")
        return

    has_settings = isinstance(data, dict) and isinstance(data.get("global_settings"), dict)
    if not isinstance(data, dict) or ("objects" not in data and not has_settings):
        send_translated_error(connection, msg["id"], "invalid_format", "JSON must contain an 'objects' array", translation_key="import_no_objects_list")
        return

    # A settings export (see export.build_settings_export) may travel alone or
    # alongside an objects payload — apply it first either way.
    # HA user ids exist only on the instance that made them: the export names
    # them (``users``), and a move maps them onto this instance's people.
    from ..helpers.import_mapping import DEVICES_KEY, TASK_NAMES_KEY, USERS_KEY, async_user_map, device_map

    user_map, unmatched_users = await async_user_map(hass, data.get(USERS_KEY))
    # Device ids are minted per instance too: the same appliance, found by its
    # integration identifiers.
    dev_map = device_map(hass, data.get(DEVICES_KEY))

    settings_applied: list[str] = []
    if has_settings:
        settings_applied = _apply_settings_import(
            hass, data["global_settings"], user_map=user_map, task_names=data.get(TASK_NAMES_KEY)
        )

    objects = data.get("objects", [])
    if not isinstance(objects, list):
        send_translated_error(connection, msg["id"], "invalid_format", "'objects' must be an array", translation_key="import_no_objects_list")
        return

    if len(objects) > 1000:
        send_translated_error(connection, msg["id"], "too_many", "JSON contains more than 1000 objects", translation_key="import_too_many", translation_placeholders={"max": "1000"})
        return

    if not objects and not settings_applied:
        send_translated_error(connection, msg["id"], "empty", "No objects found in JSON", translation_key="import_no_objects")
        return

    created = []
    errors: list[dict[str, str]] = []
    importing_user = connection.user.id if connection.user else None
    lineage = _ImportLineage(hass, objects)
    # old task id → (new entry id, new task id), for the group members and
    # vacation exemptions that pointed at the exported tasks.
    moved_tasks: dict[str, tuple[str, str]] = {}
    for idx in _import_order(objects):
        obj_entry = objects[idx]
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
        doc_store = None
        # Everything read from the file for this object is shaped below; a
        # value of a type nothing expects (a list where an id belongs, a date
        # that does not exist) used to escape this loop and abort the whole
        # import after the first objects were created (bug audit 2026-09-29).
        # Such an object is reported and skipped; the others still import.
        try:
            import_obj: dict[str, Any] = {
                "id": obj_id,
                "name": obj_name,
                "manufacturer": obj_data.get("manufacturer"),
                "model": obj_data.get("model"),
                "serial_number": obj_data.get("serial_number"),
                # An id is looked up (device area, area filters): a list here made
                # every entity of the object fail to be added (bug audit 2026-09-29).
                "area_id": obj_data.get("area_id") if isinstance(obj_data.get("area_id"), str) else None,
                "installation_date": obj_data.get("installation_date"),
                "warranty_expiry": obj_data.get("warranty_expiry"),
                # Imported counterparts of the export fields above; length-capped by
                # cap_object_fields and the frontend only renders http(s) doc URLs.
                "documentation_url": obj_data.get("documentation_url"),
                "notes": obj_data.get("notes"),
                # 2.19: device link. Same-instance restores keep it valid; a
                # stale id degrades gracefully at read time. The parent and the
                # replace lineage are remapped just below (_ImportLineage).
                "ha_device_id": (
                    dev_map.get(raw_dev, raw_dev) if isinstance(raw_dev := obj_data.get("ha_device_id"), str) and raw_dev else None
                ),
                # 2.20: seasonal pause round-trips (a paused pool restored in
                # winter stays paused).
                "paused_at": _iso_marker(obj_data.get("paused_at")),
                "paused_until": _iso_marker(obj_data.get("paused_until")),
                # Object-level archive marker — same presence-means-archived
                # semantics as paused_at, so it gets the same ISO validation. Its
                # tasks carry their own archived_* pair (mirrored below).
                "archived_at": _iso_marker(obj_data.get("archived_at")),
                # #170: keep the numbers a backup carries (collisions are
                # renumbered by the setup pass); bool/negative junk is dropped.
                "ref_no": _ref_or_none(obj_data.get("ref_no")),
                "next_task_ref": _ref_or_none(obj_data.get("next_task_ref")),
                "task_ids": [],
            }
            # 2.94: the source template, when the backup names one we know.
            if obj_data.get("template_id") in KNOWN_TEMPLATE_IDS:
                import_obj["template_id"] = obj_data["template_id"]
            # parent / predecessor / replaced_by → the NEW entry ids.
            lineage_pending = lineage.apply(import_obj, obj_data)
            own_old_entry_id = str(obj_entry.get("entry_id") or "")

            # Battery fleet identity (object flag + exclude/include lists + the
            # self-charging opt-in). The fleet is ONE object by invariant
            # (find_fleet_entry returns the first flagged entry), so the flag is
            # only restored when this instance has no fleet yet — otherwise the
            # payload imports as a plain object (fresh part ids, no task flag).
            is_fleet = _import_fleet_identity(hass, obj_data, import_obj, obj_name)

            # Spare parts: regenerate ids (like tasks) and remember the mapping so
            # task-side links (consumes_parts / part_ref) can be rewritten below.
            # Stock is dynamic Store state — collected here, written after setup.
            # Fleet type-parts keep their deterministic ``batt_<type>`` ids: the
            # fleet reconcile / mark-replaced paths key on them, so a re-minted
            # uuid would orphan the whole battery-type ↔ part mapping.
            from uuid import uuid4 as _uuid4

            part_id_map: dict[str, str] = {}
            import_parts: dict[str, dict[str, Any]] = {}
            # Losses while importing parts, reported with the task warnings.
            part_warnings: list[str] = []
            parts_list = obj_entry.get("parts", [])
            if isinstance(parts_list, list):
                for part_entry in parts_list:
                    if not isinstance(part_entry, dict) or not (part_entry.get("name") or "").strip():
                        continue
                    old_id = str(part_entry.get("id") or "")
                    new_id = old_id if _keep_fleet_part_id(is_fleet, old_id) else _uuid4().hex
                    raw_part = dict(part_entry)
                    # Drop a non-http(s) product_url rather than the whole part —
                    # a crafted backup could carry a javascript: link.
                    _purl = raw_part.get("product_url")
                    if not (isinstance(_purl, str) and _purl.strip().lower().startswith(("http://", "https://"))):
                        raw_part.pop("product_url", None)
                    # The same validation as the part/create write path. The flow
                    # step validates parts too, but it drops a bad one without a
                    # word; checked here, the import names it in its result
                    # (round-trip audit 2026-09-29).
                    try:
                        pdata = normalize_part({**raw_part, "id": new_id})
                    except PartValidationError as err:
                        part_warnings.append(f"part {raw_part.get('name')!r} dropped — {err}")
                        continue
                    # The stock rides the part into entry.data and the fresh
                    # entry's first setup moves it into the Store — BEFORE the
                    # buy-task reconcile, which otherwise saw no stock, removed the
                    # imported buy task and made a new one (storage.
                    # async_migrate_to_store).
                    stock = part_entry.get("stock")
                    if isinstance(stock, (int, float)) and not isinstance(stock, bool) and stock >= 0:
                        pdata["stock"] = stock
                    import_parts[new_id] = pdata
                    if old_id:
                        part_id_map[old_id] = new_id

            import_tasks: dict[str, dict[str, Any]] = {}
            # old task id → new id, so document task-links (task_ids) can be
            # remapped onto the freshly generated tasks (mirrors part_id_map).
            task_id_map: dict[str, str] = {}
            fleet_task_seen = False
            # Per-task import losses (an invalid trigger is dropped, not fatal) —
            # reported next to the NFC warnings instead of vanishing silently.
            task_warnings: list[str] = []
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
                    "require_tag_scan",
                    "allow_skip",
                    "notify_enabled",
                    # #185: notification icon override (shape-checked below).
                    "notify_icon",
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
                    # D#183: mirror targets (shape-sanitized below).
                    "mirror_todo_entities",
                    "earliest_completion_days",
                    "ref_no",
                    "on_complete_action",
                    "quick_complete_defaults",
                    "assignee_pool",
                    "required_completion_fields",
                    "rotation_strategy",
                    "reading_unit",
                    "readings",
                    # spare parts (ids remapped below)
                    "consumes_parts",
                    "part_ref",
                ):
                    val = task_entry.get(key)
                    if val is not None:
                        task_data[key] = val

                # Fields that later code looks up or iterates as they are: a value
                # of another type (a list where a user id belongs, a number for the
                # rotation pool) is dropped and named, instead of skipping the
                # object or breaking it after the import (bug audit 2026-09-29;
                # tests/test_import_fuzz.py feeds every field every type).
                for key, expected in _TASK_FIELD_TYPES.items():
                    if key in task_data and not isinstance(task_data[key], expected):
                        task_data.pop(key)
                        task_warnings.append(f"{task_name}: {key} dropped — wrong type")

                # The fleet's single aggregate task keeps its marker (detail view
                # renders the battery section; the fleet reconcile repairs its
                # trigger). Only ONE task may carry it, and only on the fleet.
                if is_fleet and task_entry.get(BATTERY_FLEET_TASK_FLAG) is True and not fleet_task_seen:
                    task_data[BATTERY_FLEET_TASK_FLAG] = True
                    fleet_task_seen = True
                    # The replacement log (past swaps, the learned lifetimes and
                    # predicted dates build on it) and the low latch are the
                    # fleet task's Store state; they ride entry.data into the
                    # fresh entry's Store on its first setup (storage.
                    # _SPLIT_ONLY_TASK_FIELDS). A backup used to leave them behind.
                    from ..helpers.battery_fleet import LOW_LATCH_KEY, sanitize_low_latch
                    from ..helpers.battery_lifetime import REPLACEMENT_LOG_KEY, sanitize_replacement_log

                    if log := sanitize_replacement_log(task_entry.get(REPLACEMENT_LOG_KEY)):
                        task_data[REPLACEMENT_LOG_KEY] = log
                    if latch := sanitize_low_latch(task_entry.get(LOW_LATCH_KEY)):
                        task_data[LOW_LATCH_KEY] = latch

                # 2.95: the task's fingerprint (catalog duty / template task) —
                # shape-checked, it is untrusted input like everything imported.
                from ..helpers.task_origin import ORIGIN_KEY, sanitize_origin

                if (origin := sanitize_origin(task_entry.get(ORIGIN_KEY))) is not None:
                    task_data[ORIGIN_KEY] = origin

                # In-cycle checklist ticks: keyed by item TEXT so they survive the
                # id regeneration; keys are filtered against the imported checklist
                # exactly like the live checklist_progress WS write. Rides
                # entry.data until the fresh entry's first setup migrates it into
                # the Store (split-only field — storage._SPLIT_ONLY_TASK_FIELDS).
                raw_progress = task_entry.get("checklist_progress")
                if isinstance(raw_progress, dict):
                    items = set(task_data.get("checklist") or [])
                    progress = {k: bool(v) for k, v in raw_progress.items() if isinstance(k, str) and k in items}
                    if progress:
                        task_data["checklist_progress"] = progress

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

                # Task phases (#139): sanitize like the live WS write and clamp the
                # cursor to the imported sequence. The cursor rides entry.data
                # until the fresh entry's first setup migrates it into the Store
                # (dynamic field), so a restore resumes mid-cycle.
                raw_defs = task_entry.get("phases")
                raw_seq = task_entry.get("phase_sequence")
                if isinstance(raw_defs, dict) and isinstance(raw_seq, list):
                    defs = sanitize_phase_defs(raw_defs)
                    seq = sanitize_phase_sequence(raw_seq, defs)
                    if defs and seq:
                        task_data["phases"] = defs
                        task_data["phase_sequence"] = seq
                        task_data["phase_cursor"] = clamp_phase_cursor(task_entry.get("phase_cursor"), len(seq))

                # Part links — task level AND per phase (helpers.parts.
                # map_part_links, one rule for both): own links follow the
                # regenerated part ids; a pool of another object (#111) follows
                # that object's new ids when it is part of this import, stays
                # when the object lives in THIS instance, and is dropped rather
                # than restored pointing nowhere.
                if task_data.get("consumes_parts") is not None and not isinstance(task_data["consumes_parts"], list):
                    task_data.pop("consumes_parts", None)
                task_data, _links_changed = map_part_links(task_data, lineage.link_rewriter(own_old_entry_id, part_id_map))
                ref = task_data.get("part_ref")
                if isinstance(ref, dict) and ref.get("part_id") in part_id_map:
                    task_data["part_ref"] = {"part_id": part_id_map[ref["part_id"]]}
                elif ref is not None:
                    task_data.pop("part_ref", None)

                # A completion action runs as the importing admin — never as the
                # user a file names (bug audit 2026-09-27, SEC-2).
                _stamp_imported_action_owner(task_data, importing_user)

                # Sanitize critical fields from import data
                iv = task_data.get("interval_days")
                if iv is not None and (not isinstance(iv, int) or iv < 1):
                    task_data.pop("interval_days", None)
                lp = task_data.get("last_performed")
                if lp is not None and parse_iso_date(lp) is None:
                    task_data.pop("last_performed", None)
                elif _future_last_performed(lp):
                    task_data.pop("last_performed", None)
                    task_warnings.append(f"{task_name}: last performed date {lp} is in the future — dropped")
                wd = task_data.get("warning_days")
                if not isinstance(wd, int) or wd < 0 or wd > 365:
                    task_data["warning_days"] = get_default_warning_days(hass)
                # A rotation task must carry its effective assignee (imports from
                # pre-seeding exports may lack one) — same rule as create/update.
                from ..helpers.sanitize import seed_rotation_assignee

                seed_rotation_assignee(task_data)
                # checklist (strip + truncate + cap), reading slots and to-do
                # mirror targets are NOT re-sanitized here: the config flow's
                # websocket step runs cap_task_fields on every imported task —
                # the same code, and nothing in between reads them (DRY audit
                # 2026-09-26 B). The rotation seed above stays: it looks at the
                # raw strategy, which cap_task_fields would drop first.

                # #185: notify_icon — same shape rule as the WS write paths; a
                # malformed or empty value drops the override (type default).
                if "notify_icon" in task_data:
                    from ..helpers.notify_icons import normalize_icon

                    icon = normalize_icon(task_data["notify_icon"])
                    if icon:
                        task_data["notify_icon"] = icon
                    else:
                        task_data.pop("notify_icon", None)

                # schedule_time: canonical HH:MM. The options flow's TimeSelector
                # stores "HH:MM:SS" and the export writes it verbatim — that used
                # to be DROPPED here (strict HH:MM), so a backup lost the time.
                st = task_data.get("schedule_time")
                if st is not None:
                    normalized = normalize_hhmm(st)
                    if normalized is None:
                        task_data.pop("schedule_time", None)
                    else:
                        task_data["schedule_time"] = normalized

                # entity_slug: the WS create/update paths reject anything but
                # [a-z0-9_]+ (it becomes part of the entity_id); import copied the
                # value verbatim. Normalise to that alphabet (HA's slugify would
                # turn all-junk into "unknown"), drop it when nothing valid
                # remains, and say so — a changed slug changes the entity ids
                # (bug audit 2026-09-12).
                raw_slug = task_data.get("entity_slug")
                if raw_slug is not None:
                    slug = (
                        re.sub(r"[^a-z0-9_]+", "_", raw_slug.strip().lower()).strip("_")[:MAX_ENTITY_SLUG_LENGTH]
                        if isinstance(raw_slug, str)
                        else ""
                    )
                    if not slug:
                        task_data.pop("entity_slug", None)
                        task_warnings.append(f"{task_name}: entity_slug dropped — not [a-z0-9_]+")
                    elif slug != raw_slug:
                        task_data["entity_slug"] = slug
                        task_warnings.append(f"{task_name}: entity_slug normalised to {slug!r}")

                # Validate an imported trigger_config the same way the WS create/update
                # path does — strip unknown keys, normalize entity_ids, and drop it
                # entirely if invalid — so import isn't a hole around trigger validation.
                tc = task_data.get("trigger_config")
                if isinstance(tc, dict):
                    # The export carries the live per-entity trigger state
                    # (accumulated runtime hours, counter baseline, change count)
                    # merged in as ``_trigger_state``. The validator strips it as
                    # an unknown key, so a restore silently started every
                    # sensor trigger from zero (bug review 2026-09-04). Keep it
                    # aside and re-attach it: the fresh entry's first setup
                    # migrates it into the Store like any other dynamic field.
                    trigger_state = tc.pop("_trigger_state", None)
                    tc_errors, _warnings = _validate_trigger_config(hass, tc)
                    if tc_errors:
                        task_data.pop("trigger_config", None)
                        task_warnings.append(f"{task_name}: trigger dropped — {tc_errors[0]}")
                    elif isinstance(trigger_state, dict) and trigger_state:
                        tc["_trigger_state"] = trigger_state
                elif tc is not None:
                    task_data.pop("trigger_config", None)
                    task_warnings.append(f"{task_name}: trigger dropped — not a mapping")

                from ..helpers.import_mapping import remap_task_device, remap_task_users

                remap_task_users(task_data, user_map)
                remap_task_device(task_data, dev_map)
                # An archived object's tasks are archived with it (object/archive
                # cascades). A file that archives only the object — hand-written,
                # or from before the cascade — left them active: an "overdue"
                # task of a retired machine on the dashboard (seen on the demo,
                # 2026-09-29).
                if import_obj.get("archived_at") and not task_data.get("archived_at"):
                    from ..const import ARCHIVE_REASON_OBJECT

                    task_data["archived_at"] = import_obj["archived_at"]
                    task_data["archived_reason"] = ARCHIVE_REASON_OBJECT
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

            # (roadmap P6) recreate document metadata + web-links for the object
            # (blobs travel via the /config backup; a JSON-only import leaves
            # file docs dangling, which the storage-hygiene repair issue catches).
            # Done BEFORE the entry is created: the docs get fresh ids, and the
            # history entries (completion photos, #161) and spare parts (doc_id)
            # that point at them by id must be re-pointed before they are
            # persisted — the export carries the old ids for exactly this.
            doc_store = None
            import_docs = obj_entry.get("documents")
            if isinstance(import_docs, list) and import_docs:
                from .. import DOCUMENT_STORE_KEY

                doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
                if doc_store is not None:
                    doc_id_map: dict[str, str] = {}
                    # Outside the per-object try below on purpose (the docs must
                    # exist before the entry is created) — so a crash here used to
                    # abort the WHOLE import without a reply. The store skips
                    # malformed records itself; this backstop turns anything it
                    # still raises into a per-object warning (bug audit 2026-09-12).
                    try:
                        await doc_store.async_import_documents(
                            obj_id, import_docs, task_id_map=task_id_map, part_id_map=part_id_map, id_map=doc_id_map
                        )
                    except Exception:  # one object's documents must not sink the import
                        _LOGGER.exception("JSON import of %s: documents skipped", obj_name)
                        task_warnings.append("documents: skipped — malformed document records")
                        await _drop_imported_documents(doc_store, obj_id)
                        doc_id_map = {}
                    if doc_id_map:
                        _remap_document_refs(import_tasks, import_parts, doc_id_map)

        except Exception:  # one malformed object must not sink the import
            _LOGGER.exception("JSON import of %s: object skipped — malformed data", obj_name)
            errors.append({"name": obj_name, "reason": "malformed data"})
            await _drop_imported_documents(doc_store, obj_id)
            continue

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
            await _drop_imported_documents(doc_store, obj_id)
            continue
        if result["type"] == "create_entry":
            lineage.created(obj_entry.get("entry_id"), result["result"].entry_id, part_id_map, lineage_pending)
            for old_task_id, new_task_id in task_id_map.items():
                moved_tasks[old_task_id] = (result["result"].entry_id, new_task_id)
            entry_info: dict[str, Any] = {
                "entry_id": result["result"].entry_id,
                "name": obj_name,
                "task_count": len(import_tasks),
            }
            task_warnings = part_warnings + task_warnings
            if nfc_warnings or task_warnings:
                entry_info["warnings"] = nfc_warnings + task_warnings
            for warning in task_warnings:
                _LOGGER.warning("JSON import of %s: %s", obj_name, warning)
            created.append(entry_info)
            # Restored stocks (in the Store from the first setup, see above)
            # can sit below the reorder threshold: the entry's setup runs the
            # buy-task catch-up for every object with parts.
        else:
            errors.append({"name": obj_name, "reason": result.get("reason", "unknown")})
            await _drop_imported_documents(doc_store, obj_id)
    lineage.finish()
    if moved_tasks:
        from ..helpers.global_options import get_global_entry, get_global_options
        from ..helpers.import_mapping import repair_task_refs

        gentry = get_global_entry(hass)
        if gentry is not None and (changed := repair_task_refs(dict(get_global_options(hass)), hass, moved_tasks)):
            _merge_global_options(hass, gentry, changed)
    if created:
        # References to people that match nobody here are cleared now, with
        # the rules the boot-time sweep applies (a rotation below two members
        # dissolves) — and named in the result instead of vanishing at the
        # next restart.
        from .. import _check_task_responsible_user_orphans

        await _check_task_responsible_user_orphans(hass)

    resp: dict[str, Any] = {
        "imported": created,
        "total": len(objects),
        "created": len(created),
    }
    if settings_applied:
        resp["settings_applied"] = settings_applied
    if errors:
        resp["errors"] = errors
    if unmatched_users:
        resp["unmatched_users"] = unmatched_users
    connection.send_result(msg["id"], resp)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/qr/generate",
        vol.Required("entry_id"): ID_FIELD,
        vol.Optional("task_id"): ID_FIELD,
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
    task_id = msg.get("task_id")
    task_name = None

    if task_id:
        ctx = _load_object_task(hass, connection, msg)
        if ctx is None:
            return
        entry, _rd, task = ctx
        task_name = task.get("name", "")
    else:
        obj_entry = _load_object_entry(hass, connection, msg)
        if obj_entry is None:
            return
        entry = obj_entry

    obj_data = entry.data.get(CONF_OBJECT, {})

    action = msg.get("action", "view")
    url_mode = msg.get("url_mode", "server")
    base_url = msg.get("base_url")
    try:
        url = build_qr_url(
            hass,
            entry.entry_id,
            task_id=task_id,
            action=action,
            base_url_override=base_url,
            url_mode=url_mode,
        )
    except ValueError as err:
        send_translated_error(connection, msg["id"], "no_url", str(err), translation_key="qr_no_url")
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
                "object_name": object_name(entry),
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
            [ID_FIELD],
            vol.Length(max=1000),
        ),
        vol.Optional("task_ids"): vol.All(
            [ID_FIELD],
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
    all_entries = _get_object_entries(hass)
    entry_filter = msg.get("entry_ids")
    if entry_filter:
        wanted = set(entry_filter)
        entries = [e for e in all_entries if e.entry_id in wanted]
    else:
        entries = all_entries

    # Build the flat (entry_id, object_name, task_id, task_name) target list,
    # honouring the optional task_ids filter.
    task_filter = set(msg["task_ids"]) if msg.get("task_ids") else None
    targets: list[tuple[str, str, str, str, bool]] = []
    for entry in entries:
        obj_name = object_name(entry)
        tasks_data = entry.data.get(CONF_TASKS, {})
        for task_id, task_data in tasks_data.items():
            if task_filter is not None and task_id not in task_filter:
                continue
            has_quick = bool(task_data.get("quick_complete_defaults"))
            targets.append((entry.entry_id, obj_name, task_id, task_data.get("name", ""), has_quick))

    actions: list[str] = msg["actions"]
    # A quick-complete code only for tasks with quick-complete defaults — for
    # the others it would just open the complete dialog (#192).
    pairs = [(target, action) for target in targets for action in actions if action != "quick_complete" or target[4]]
    total = len(pairs)
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
    for (entry_id, obj_name, task_id, task_name, _has_quick), action in pairs:
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
