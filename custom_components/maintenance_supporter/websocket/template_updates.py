"""What an object's template has learned since (D#85): read and apply.

``template_updates`` lists, per task made from the template, the fields the
template would change now (helpers/template_updates.py says which are the
user's own), and the template's tasks that came after the object.
``template_updates/apply`` takes a decision per offer: yes writes the
template's value (one entry write, an ``updated`` history entry per task),
no remembers the declined value so it is not offered again. Offers are
recomputed here; the panel only says yes or no to them.
"""

from __future__ import annotations

from collections import Counter
from collections.abc import Mapping
from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import CONF_OBJECT, CONF_TASKS, HistoryEntryType
from ..helpers.aggregate import async_store_even_unloaded
from ..helpers.entry_tasks import insert_new_task
from ..helpers.i18n import normalize_language, normalize_language_code
from ..helpers.permissions import require_write
from ..helpers.sanitize import cap_task_fields
from ..helpers.schedule import normalize_task_storage
from ..helpers.task_origin import ORIGIN_KEY, task_origin, template_origin
from ..helpers.template_fingerprint import FIELDS, applied_fingerprints
from ..helpers.template_updates import (
    DECLINED_TASKS_KEY,
    FieldChange,
    Home,
    apply_recurrence,
    async_home,
    base_for,
    built_task,
    new_tasks,
    object_template,
    task_changes,
    task_language,
    template_task,
)
from ..templates import TaskTemplate, get_template_by_id, localize_template_text
from . import ID_FIELD, _load_object_entry

#: The English note of the history entry, localized by the panel
#: (helpers/history-note.ts) like every other generated note.
_FIELD_WORDS = {"name": "name", "notes": "notes", "recurrence": "recurrence", "warning_days": "warning days"}


def _changes(data: Mapping[str, Any], home: Home, lang: str) -> list[FieldChange]:
    changes: list[FieldChange] = []
    for task_id, task in (data.get(CONF_TASKS) or {}).items():
        if isinstance(task, Mapping):
            changes.extend(task_changes(task_id, task, home, lang))
    return changes


def _object_language(data: Mapping[str, Any], fallback: str) -> str:
    """The language the object's template tasks were made in (most of them)."""
    langs: Counter[str] = Counter()
    for task in (data.get(CONF_TASKS) or {}).values():
        found = template_task(task_origin(task)) if isinstance(task, Mapping) else None
        if found is not None:
            langs[task_language(task, found[1], fallback)] += 1
    return langs.most_common(1)[0][0] if langs else fallback


def _preview(tt: TaskTemplate, lang: str, home: Home) -> dict[str, Any]:
    built = normalize_task_storage(built_task(tt, lang, home))
    return {"key": tt.key, "name": built.get("name"), "notes": built.get("notes"), "schedule": built.get("schedule"), "warning_days": built.get("warning_days")}


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/template_updates",
        vol.Required("entry_id"): ID_FIELD,
        vol.Optional("language"): vol.All(str, vol.Length(max=16)),
    }
)
@websocket_api.async_response
async def ws_template_updates(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """What the object's template would change, and its later tasks."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return
    ui_lang = normalize_language_code(msg.get("language")) if msg.get("language") else normalize_language(hass)
    data = entry.data
    template_id = object_template(data)
    template = get_template_by_id(template_id) if template_id else None
    if template is None:
        connection.send_result(msg["id"], {"template_id": None, "template_name": None, "changes": [], "new_tasks": []})
        return
    home = await async_home(hass)
    server_lang = normalize_language(hass)
    tasks = data.get(CONF_TASKS) or {}
    lang = _object_language(data, server_lang)
    connection.send_result(
        msg["id"],
        {
            "template_id": template.id,
            "template_name": localize_template_text(template.name, ui_lang) or template.name,
            "changes": [
                {
                    "task_id": c.task_id,
                    "task_name": str((tasks.get(c.task_id) or {}).get("name") or ""),
                    "field": c.field,
                    "conflict": c.conflict,
                    "before": c.before,
                    "after": c.after,
                }
                for c in _changes(data, home, server_lang)
            ],
            "new_tasks": [_preview(tt, lang, home) for tt in new_tasks(data, home)],
        },
    )


def _set_field(task: dict[str, Any], field: str, value: Any) -> dict[str, Any]:
    if field == "recurrence":
        return apply_recurrence(task, value)
    if field == "notes" and not value:
        task.pop("notes", None)
        return task
    task[field] = value
    return task


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/template_updates/apply",
        vol.Required("entry_id"): ID_FIELD,
        vol.Optional("changes", default=[]): vol.All(
            [{vol.Required("task_id"): ID_FIELD, vol.Required("field"): vol.In(FIELDS), vol.Required("accept"): bool}],
            vol.Length(max=1000),
        ),
        vol.Optional("new_tasks", default=[]): vol.All(
            [{vol.Required("key"): vol.All(str, vol.Length(max=255)), vol.Required("accept"): bool}],
            vol.Length(max=200),
        ),
    }
)
@require_write
@websocket_api.async_response
async def ws_apply_template_updates(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Take the template's changes the user said yes to, remember the no's."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return
    home = await async_home(hass)
    server_lang = normalize_language(hass)
    data = entry.data
    offered = {(c.task_id, c.field): c for c in _changes(data, home, server_lang)}
    tasks = {tid: dict(t) for tid, t in (data.get(CONF_TASKS) or {}).items() if isinstance(t, Mapping)}
    accepted: dict[str, list[str]] = {}
    declined_count = 0
    for decision in msg.get("changes") or []:
        change = offered.get((decision["task_id"], decision["field"]))
        task = tasks.get(decision["task_id"])
        if change is None or task is None:
            continue  # gone since the panel asked, or never offered
        origin = dict(task.get(ORIGIN_KEY) or {})
        found = template_task(task_origin(task))
        if not isinstance(origin.get("applied"), Mapping) and found is not None:
            lang = task_language(task, found[1], server_lang)
            origin["applied"] = base_for(task, found[0], found[1], lang, home)
        applied = dict(origin.get("applied") or {})
        declined = dict(origin.get("declined") or {})
        if decision["accept"]:
            task = _set_field(task, change.field, change.after)
            applied[change.field] = change.after_fp
            declined.pop(change.field, None)
            accepted.setdefault(change.task_id, []).append(change.field)
        else:
            declined[change.field] = change.after_fp
            declined_count += 1
        origin["applied"] = applied
        if declined:
            origin["declined"] = declined
        else:
            origin.pop("declined", None)
        task[ORIGIN_KEY] = origin
        tasks[change.task_id] = cap_task_fields(task, keep_action_owner=True)

    template_id = object_template(data)
    later = {tt.key: tt for tt in new_tasks(data, home)}
    decided = msg.get("new_tasks") or []
    add = [later[d["key"]] for d in decided if d["accept"] and d["key"] in later]
    said_no = [d["key"] for d in decided if not d["accept"] and d["key"] in later]

    new_data = dict(data)
    new_data[CONF_TASKS] = {**(data.get(CONF_TASKS) or {}), **{tid: normalize_task_storage(t) for tid, t in tasks.items()}}
    if said_no:
        obj = dict(new_data.get(CONF_OBJECT) or {})
        obj[DECLINED_TASKS_KEY] = sorted({*(obj.get(DECLINED_TASKS_KEY) or []), *said_no})
        new_data[CONF_OBJECT] = obj
    hass.config_entries.async_update_entry(entry, data=new_data)

    lang = _object_language(new_data, server_lang)
    object_id = str((new_data.get(CONF_OBJECT) or {}).get("id") or "")
    today = dt_util.now().date().isoformat()
    for tt in add:
        built = built_task(tt, lang, home)
        task_id = uuid4().hex
        insert_new_task(
            hass,
            entry,
            cap_task_fields(
                {
                    "id": task_id,
                    "object_id": object_id,
                    **built,
                    "created_at": today,
                    ORIGIN_KEY: template_origin(str(template_id), tt.key, lang=lang, applied=applied_fingerprints(built)),
                }
            ),
        )

    store = await async_store_even_unloaded(hass, entry)
    if store is not None:
        now = dt_util.now().isoformat()
        for task_id, fields in accepted.items():
            words = ", ".join(_FIELD_WORDS[f] for f in FIELDS if f in fields)
            store.append_history(task_id, {"timestamp": now, "type": HistoryEntryType.UPDATED, "notes": f"From the template: {words}"})
        await store.async_save()
    await hass.config_entries.async_reload(entry.entry_id)
    connection.send_result(
        msg["id"],
        {
            "applied": sum(len(f) for f in accepted.values()),
            "declined": declined_count + len(said_no),
            "added": len(add),
        },
    )
