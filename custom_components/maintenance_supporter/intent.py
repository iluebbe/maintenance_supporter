"""Assist intents — query + complete maintenance tasks by voice / LLM agents.

Registered through HA's integration intent platform (``async_setup_intents``,
picked up automatically when the ``intent`` component loads — same mechanism as
shopping_list):

* ``MaintenanceSupporterListTasks`` — *"what maintenance is due?"* Speaks a
  snapshot of actionable tasks, optionally filtered by status.
* ``MaintenanceSupporterCompleteTask`` — *"complete the oil change"* — fuzzy-
  matches a task by its spoken name (the object name counts too, so "oil change
  on the car" works) and records a REAL completion through the coordinator —
  history, rotation, part consumption and on-complete actions all fire.
* ``MaintenanceSupporterTaskInstructions`` — *"how do I descale the coffee
  machine?"* — answers STRICTLY from what is stored on the task (notes,
  checklist, linked documents incl. per-task page hints, required spare parts,
  documentation link). When nothing is stored it says so and asks whether the
  user wants general, non-verified advice — grounded by design, never invented.
* ``MaintenanceSupporterTaskDue`` — *"when is the oil change due?"*
* ``MaintenanceSupporterSnoozeTask`` — *"snooze the oil change"* — suppresses
  the task's reminders for the configured snooze duration.
* ``MaintenanceSupporterPartStock`` — *"how many water filters do we have?"*

LLM-based Assist pipelines expose every registered intent handler as a tool
automatically (``helpers/llm``), in any language — no setup needed. The classic
sentence-matching agent additionally needs the copy-paste sentence files shipped
under ``assist/custom_sentences/`` (see FEATURES → Voice & Assist).
"""

from __future__ import annotations

import re
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import intent

from .const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

INTENT_LIST_TASKS = "MaintenanceSupporterListTasks"
INTENT_COMPLETE_TASK = "MaintenanceSupporterCompleteTask"
INTENT_TASK_INSTRUCTIONS = "MaintenanceSupporterTaskInstructions"
INTENT_TASK_DUE = "MaintenanceSupporterTaskDue"
INTENT_SNOOZE_TASK = "MaintenanceSupporterSnoozeTask"
INTENT_PART_STOCK = "MaintenanceSupporterPartStock"

_ACTIONABLE = ("due_soon", "overdue", "triggered")

# Spoken responses. The LLM path re-phrases in the user's language anyway; the
# classic sentence agent speaks these verbatim, so the languages we ship
# sentence files for (en, de) are fully localised here — others fall back to en.
_SPEECH: dict[str, dict[str, str]] = {
    "none_due": {
        "en": "Everything is OK — no maintenance needs attention.",
        "de": "Alles in Ordnung — keine Wartung fällig.",
    },
    "tasks_due": {
        "en": "{count} maintenance tasks need attention: {items}.",
        "de": "{count} Wartungsaufgaben brauchen Aufmerksamkeit: {items}.",
    },
    "task_due_one": {
        "en": "One maintenance task needs attention: {items}.",
        "de": "Eine Wartungsaufgabe braucht Aufmerksamkeit: {items}.",
    },
    "completed": {
        "en": "Completed '{task}' on {object}.",
        "de": "'{task}' an {object} als erledigt eingetragen.",
    },
    "not_found": {
        "en": "I couldn't find a maintenance task matching '{name}'.",
        "de": "Ich habe keine Wartungsaufgabe zu '{name}' gefunden.",
    },
    "ambiguous": {
        "en": "That matches several tasks: {candidates}. Please be more specific.",
        "de": "Das passt auf mehrere Aufgaben: {candidates}. Bitte formuliere genauer.",
    },
    "too_early": {
        "en": "'{task}' can only be completed closer to its due date.",
        "de": "'{task}' kann erst näher am Fälligkeitstermin erledigt werden.",
    },
    # status descriptors for list items
    "st_overdue": {"en": "{days} days overdue", "de": "seit {days} Tagen überfällig"},
    "st_due_today": {"en": "due today", "de": "heute fällig"},
    "st_due_in": {"en": "due in {days} days", "de": "fällig in {days} Tagen"},
    "st_triggered": {"en": "triggered", "de": "ausgelöst"},
    "item_on": {"en": "{task} on {object}", "de": "{task} an {object}"},
    # task due (single-task query)
    "due_date_suffix": {
        "en": " The next due date is {date}.",
        "de": " Der nächste Fälligkeitstermin ist der {date}.",
    },
    # grounded task guidance
    "guide_header": {
        "en": "Stored guidance for '{task}' on {object}: {segments}.",
        "de": "Hinterlegte Informationen zu '{task}' an {object}: {segments}.",
    },
    "guide_none": {
        "en": (
            "There are no stored instructions, documents or spare parts for "
            "'{task}' on {object}. I can offer general, non-verified advice "
            "instead — would you like that?"
        ),
        "de": (
            "Zu '{task}' an {object} sind keine Anleitungen, Dokumente oder "
            "Ersatzteile hinterlegt. Ich kann stattdessen allgemeine, "
            "ungeprüfte Hinweise geben — möchtest du das?"
        ),
    },
    "guide_notes": {"en": "notes: {notes}", "de": "Notizen: {notes}"},
    "guide_checklist": {
        "en": "{count} checklist steps: {steps}",
        "de": "{count} Checklisten-Schritte: {steps}",
    },
    "guide_doc": {"en": "linked document '{title}'", "de": "verknüpftes Dokument '{title}'"},
    "guide_doc_page": {
        "en": "linked document '{title}', page {page}",
        "de": "verknüpftes Dokument '{title}', Seite {page}",
    },
    "guide_url": {
        "en": "a documentation link is on file",
        "de": "ein Dokumentations-Link ist hinterlegt",
    },
    "guide_part": {
        "en": "{qty} × {part} needed{extras}",
        "de": "{qty} × {part} benötigt{extras}",
    },
    "guide_part_loc": {"en": "stored at {loc}", "de": "Lagerort {loc}"},
    "guide_part_stock": {"en": "{stock} in stock", "de": "{stock} auf Lager"},
    # snooze
    "snoozed": {
        "en": "Snoozed reminders for '{task}' on {object} for {hours} hours.",
        "de": "Erinnerungen für '{task}' an {object} für {hours} Stunden stummgeschaltet.",
    },
    "snooze_unavailable": {
        "en": "Notifications aren't configured, so there is nothing to snooze.",
        "de": "Benachrichtigungen sind nicht eingerichtet — es gibt nichts stummzuschalten.",
    },
    # part stock
    "stock_line": {
        "en": "{stock} × {part} in stock{loc}{low}.",
        "de": "{stock} × {part} auf Lager{loc}{low}.",
    },
    "stock_loc": {"en": " (stored at {loc})", "de": " (Lagerort: {loc})"},
    "stock_low": {
        "en": " — at or below the reorder threshold",
        "de": " — an oder unter der Nachbestellgrenze",
    },
    "stock_untracked": {
        "en": "Stock isn't tracked for {part}.",
        "de": "Für {part} wird kein Bestand geführt.",
    },
    "part_not_found": {
        "en": "I couldn't find a spare part matching '{name}'.",
        "de": "Ich habe kein Ersatzteil zu '{name}' gefunden.",
    },
}


def _sp(key: str, language: str | None, **fmt: Any) -> str:
    # Per-request language (intent_obj.language, e.g. "de-DE") → table key,
    # same normalization rule as helpers/i18n (which is hass-bound).
    from .helpers.i18n import normalize_language_code

    lang = normalize_language_code(language)
    table = _SPEECH[key]
    return table.get(lang, table["en"]).format(**fmt)


def _task_snapshot(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Live snapshot of every active (non-archived) task across all objects.

    Same shape/source as the ``list_tasks`` service: the coordinator's computed
    payload, so status/next_due reflect the Store, not stale entry data.
    """
    tasks: list[dict[str, Any]] = []
    for ce in hass.config_entries.async_entries(DOMAIN):
        if ce.unique_id == GLOBAL_UNIQUE_ID:
            continue
        rd = getattr(ce, "runtime_data", None)
        coordinator = getattr(rd, "coordinator", None) if rd else None
        if coordinator is None or not coordinator.data:
            continue
        object_name = ce.data.get(CONF_OBJECT, {}).get("name", ce.title)
        for task_id, task in coordinator.data.get(CONF_TASKS, {}).items():
            status = str(task.get("_status", ""))
            if status == "archived":
                continue
            tasks.append(
                {
                    "entry_id": ce.entry_id,
                    "task_id": task_id,
                    "object_name": object_name,
                    "name": str(task.get("name") or ""),
                    "status": status,
                    "days_until_due": task.get("_days_until_due"),
                    "next_due": task.get("_next_due"),
                }
            )
    return tasks


def _match_tasks(query: str, snapshot: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Fuzzy-match a spoken name against tasks (object name counts too).

    An exact task-name match wins outright; otherwise every ≥2-char query token
    must appear in "task name + object name" (case-insensitive substring).
    """
    q = query.strip().lower()
    if not q:
        return []
    exact = [t for t in snapshot if t["name"].lower() == q]
    if len(exact) == 1:
        return exact
    tokens = [tok for tok in re.split(r"[^a-z0-9äöüß]+", q) if len(tok) >= 2]
    if not tokens:
        return exact
    matches = []
    for t in snapshot:
        hay = f"{t['name']} {t['object_name']}".lower()
        if all(tok in hay for tok in tokens):
            matches.append(t)
    return exact or matches


def _describe(task: dict[str, Any], language: str | None) -> str:
    days = task.get("days_until_due")
    if task["status"] == "triggered":
        desc = _sp("st_triggered", language)
    elif isinstance(days, int) and days < 0:
        desc = _sp("st_overdue", language, days=-days)
    elif days == 0:
        desc = _sp("st_due_today", language)
    elif isinstance(days, int):
        desc = _sp("st_due_in", language, days=days)
    else:
        desc = task["status"]
    return f"{_sp('item_on', language, task=task['name'], object=task['object_name'])} ({desc})"


def _resolve_single(
    intent_obj: intent.Intent, name: str, snapshot: list[dict[str, Any]]
) -> tuple[dict[str, Any] | None, intent.IntentResponse | None]:
    """Match a spoken name to exactly ONE snapshot row.

    Returns ``(row, None)`` on success, ``(None, error_response)`` otherwise —
    the shared not-found / ambiguity contract of every name-taking intent.
    """
    lang = intent_obj.language
    response = intent_obj.create_response()
    matches = _match_tasks(name, snapshot)
    if not matches:
        response.async_set_error(
            intent.IntentResponseErrorCode.NO_VALID_TARGETS,
            _sp("not_found", lang, name=name),
        )
        return None, response
    if len(matches) > 1:
        candidates = ", ".join(
            _sp("item_on", lang, task=t["name"], object=t["object_name"]) for t in matches[:4]
        )
        response.async_set_error(
            intent.IntentResponseErrorCode.NO_VALID_TARGETS,
            _sp("ambiguous", lang, candidates=candidates),
        )
        return None, response
    return matches[0], None


async def async_setup_intents(hass: HomeAssistant) -> None:
    """Register the Maintenance Supporter intents."""
    intent.async_register(hass, ListTasksIntent())
    intent.async_register(hass, CompleteTaskIntent())
    intent.async_register(hass, TaskInstructionsIntent())
    intent.async_register(hass, TaskDueIntent())
    intent.async_register(hass, SnoozeTaskIntent())
    intent.async_register(hass, PartStockIntent())


class ListTasksIntent(intent.IntentHandler):
    """Speak which maintenance tasks need attention (optionally by status)."""

    intent_type = INTENT_LIST_TASKS
    description = (
        "Lists the user's home-maintenance tasks that need attention "
        "(overdue, due soon or sensor-triggered), or filtered by a status. "
        "Use for questions like 'what maintenance is due?'"
    )
    slot_schema = {vol.Optional("status"): vol.In(["ok", "due_soon", "overdue", "triggered"])}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        slots = self.async_validate_slots(intent_obj.slots)
        wanted = slots.get("status", {}).get("value")
        statuses = (wanted,) if wanted else _ACTIONABLE
        tasks = [t for t in _task_snapshot(intent_obj.hass) if t["status"] in statuses]
        # Most urgent first: overdue (most days) → due today → due soon.
        tasks.sort(key=lambda t: (t["days_until_due"] is None, t["days_until_due"] or 0))

        response = intent_obj.create_response()
        lang = intent_obj.language
        if not tasks:
            response.async_set_speech(_sp("none_due", lang))
            return response
        items = ", ".join(_describe(t, lang) for t in tasks[:8])
        key = "task_due_one" if len(tasks) == 1 else "tasks_due"
        response.async_set_speech(_sp(key, lang, count=len(tasks), items=items))
        return response


class CompleteTaskIntent(intent.IntentHandler):
    """Complete a maintenance task by its spoken name."""

    intent_type = INTENT_COMPLETE_TASK
    description = (
        "Marks a home-maintenance task as completed, matched by its name "
        "(the object/appliance name may be included, e.g. 'oil change on the car'). "
        "Records a real completion including history."
    )
    slot_schema = {vol.Required("name"): cv.string}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        hass = intent_obj.hass
        slots = self.async_validate_slots(intent_obj.slots)
        name = slots["name"]["value"].strip()
        lang = intent_obj.language

        target, err = _resolve_single(intent_obj, name, _task_snapshot(hass))
        if err is not None:
            return err
        assert target is not None
        response = intent_obj.create_response()
        entry = hass.config_entries.async_get_entry(target["entry_id"])
        rd = getattr(entry, "runtime_data", None)
        coordinator = getattr(rd, "coordinator", None) if rd else None
        if coordinator is None:
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                _sp("not_found", lang, name=name),
            )
            return response

        # Honour the completion window (earliest_completion_days) like the WS
        # and To-do paths do — voice must not bypass the contract.
        from .websocket.tasks_actions import _completion_blocked

        if _completion_blocked(rd, target["task_id"]):
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                _sp("too_early", lang, task=target["name"]),
            )
            return response

        try:
            await coordinator.complete_maintenance(
                task_id=target["task_id"], completed_by="assist", unattended=True
            )
        except ServiceValidationError as err:
            # The task demands details voice cannot capture (a photo, a cost).
            # Say so plainly instead of failing with a generic error.
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                str(err),
            )
            return response
        response.async_set_speech(
            _sp("completed", lang, task=target["name"], object=target["object_name"])
        )
        return response


class TaskInstructionsIntent(intent.IntentHandler):
    """Speak the STORED guidance for a task — grounded by design (roadmap)."""

    intent_type = INTENT_TASK_INSTRUCTIONS
    description = (
        "Returns the guidance STORED on a home-maintenance task: notes, checklist "
        "steps, linked manuals/documents (with a page hint), required spare parts "
        "(with storage location and stock) and whether a documentation link is on "
        "file. Use for 'how do I …' questions about maintenance tasks. IMPORTANT: "
        "this returns only verified, user-stored information — if it reports that "
        "nothing is stored, tell the user so and ask whether they want general "
        "advice before providing any; never present invented steps as the stored "
        "procedure."
    )
    slot_schema = {vol.Required("name"): cv.string}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        hass = intent_obj.hass
        slots = self.async_validate_slots(intent_obj.slots)
        name = slots["name"]["value"].strip()
        lang = intent_obj.language

        target, err = _resolve_single(intent_obj, name, _task_snapshot(hass))
        if err is not None:
            return err
        assert target is not None
        response = intent_obj.create_response()

        entry = hass.config_entries.async_get_entry(target["entry_id"])
        rd = getattr(entry, "runtime_data", None) if entry else None
        # Static fields (notes/checklist/url/consumes_parts) come from the entry
        # record — the system of record; the coordinator payload carries only a
        # computed subset (consumes_parts, for one, is not in it).
        task: dict[str, Any] = {}
        if entry is not None:
            task = entry.data.get(CONF_TASKS, {}).get(target["task_id"], {}) or {}

        segments: list[str] = []

        notes = task.get("notes")
        if isinstance(notes, str) and notes.strip():
            trimmed = notes.strip()
            if len(trimmed) > 240:
                trimmed = trimmed[:237] + "…"
            segments.append(_sp("guide_notes", lang, notes=trimmed))

        checklist = [s for s in (task.get("checklist") or []) if isinstance(s, str) and s.strip()]
        if checklist:
            segments.append(
                _sp("guide_checklist", lang, count=len(checklist), steps="; ".join(checklist[:8]))
            )

        # Documents linked to THIS task, with the per-task page hint when set.
        from . import DOCUMENT_STORE_KEY
        from .const import CONF_PARTS

        doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
        if doc_store is not None and entry is not None:
            object_id = entry.data.get(CONF_OBJECT, {}).get("id", "")
            for doc in doc_store.for_object(object_id):
                if target["task_id"] not in (doc.get("task_ids") or []):
                    continue
                title = doc.get("title") or doc.get("filename") or doc.get("url") or "document"
                page = (doc.get("task_pages") or {}).get(target["task_id"])
                if page:
                    segments.append(_sp("guide_doc_page", lang, title=title, page=page))
                else:
                    segments.append(_sp("guide_doc", lang, title=title))

        if isinstance(task.get("documentation_url"), str) and task["documentation_url"].strip():
            segments.append(_sp("guide_url", lang))

        # Required spare parts with storage location + live stock.
        parts = (entry.data.get(CONF_PARTS) or {}) if entry is not None else {}
        store = getattr(rd, "store", None) if rd else None
        for link in task.get("consumes_parts") or []:
            part = parts.get(link.get("part_id")) if isinstance(link, dict) else None
            if not isinstance(part, dict):
                continue
            extras: list[str] = []
            if part.get("storage_location"):
                extras.append(_sp("guide_part_loc", lang, loc=part["storage_location"]))
            stock = store.get_part_stock(link["part_id"]) if store is not None else None
            if stock is not None:
                extras.append(_sp("guide_part_stock", lang, stock=stock))
            segments.append(
                _sp(
                    "guide_part",
                    lang,
                    qty=link.get("quantity", 1),
                    part=part.get("name") or "part",
                    extras=f" ({', '.join(extras)})" if extras else "",
                )
            )

        if not segments:
            # Grounded contract: nothing stored → say so and ASK before any
            # general advice — the LLM relays the question instead of inventing.
            response.async_set_speech(
                _sp("guide_none", lang, task=target["name"], object=target["object_name"])
            )
            return response

        response.async_set_speech(
            _sp(
                "guide_header",
                lang,
                task=target["name"],
                object=target["object_name"],
                segments="; ".join(segments),
            )
        )
        return response


class TaskDueIntent(intent.IntentHandler):
    """Answer when a single task is due."""

    intent_type = INTENT_TASK_DUE
    description = (
        "Tells when a single home-maintenance task is due, matched by its name "
        "(the object/appliance name may be included). Use for questions like "
        "'when is the oil change due?'"
    )
    slot_schema = {vol.Required("name"): cv.string}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        slots = self.async_validate_slots(intent_obj.slots)
        name = slots["name"]["value"].strip()
        lang = intent_obj.language

        target, err = _resolve_single(intent_obj, name, _task_snapshot(intent_obj.hass))
        if err is not None:
            return err
        assert target is not None
        response = intent_obj.create_response()

        speech = _describe(target, lang) + "."
        next_due = target.get("next_due")
        if isinstance(next_due, str) and next_due:
            speech += _sp("due_date_suffix", lang, date=next_due.split("T")[0])
        response.async_set_speech(speech)
        return response


class SnoozeTaskIntent(intent.IntentHandler):
    """Snooze a task's reminders for the configured snooze duration."""

    intent_type = INTENT_SNOOZE_TASK
    description = (
        "Snoozes (mutes) the reminder notifications of a home-maintenance task "
        "for the configured snooze duration. Does NOT change the task's schedule "
        "or complete it."
    )
    slot_schema = {vol.Required("name"): cv.string}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        hass = intent_obj.hass
        slots = self.async_validate_slots(intent_obj.slots)
        name = slots["name"]["value"].strip()
        lang = intent_obj.language

        target, err = _resolve_single(intent_obj, name, _task_snapshot(hass))
        if err is not None:
            return err
        assert target is not None
        response = intent_obj.create_response()

        from . import NOTIFICATION_MANAGER_KEY
        from .const import CONF_SNOOZE_DURATION_HOURS, DEFAULT_SNOOZE_DURATION_HOURS
        from .helpers.global_options import get_global_options

        nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
        if nm is None:
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                _sp("snooze_unavailable", lang),
            )
            return response

        nm.snooze_task(target["entry_id"], target["task_id"])
        hours = get_global_options(hass).get(CONF_SNOOZE_DURATION_HOURS, DEFAULT_SNOOZE_DURATION_HOURS)
        if isinstance(hours, float) and hours.is_integer():
            hours = int(hours)  # "4 hours", not "4.0 hours"
        response.async_set_speech(
            _sp("snoozed", lang, task=target["name"], object=target["object_name"], hours=hours)
        )
        return response


def _part_snapshot(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Every spare part across all objects, in the _match_tasks row shape
    (``name`` + ``object_name``) so the same fuzzy matcher applies."""
    from .const import CONF_PARTS

    rows: list[dict[str, Any]] = []
    for ce in hass.config_entries.async_entries(DOMAIN):
        if ce.unique_id == GLOBAL_UNIQUE_ID:
            continue
        object_name = ce.data.get(CONF_OBJECT, {}).get("name", ce.title)
        rd = getattr(ce, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        for part_id, part in (ce.data.get(CONF_PARTS) or {}).items():
            if not isinstance(part, dict):
                continue
            rows.append(
                {
                    "name": str(part.get("name") or ""),
                    "object_name": object_name,
                    "storage_location": part.get("storage_location"),
                    "reorder_threshold": part.get("reorder_threshold"),
                    "stock": store.get_part_stock(part_id) if store is not None else None,
                }
            )
    return rows


class PartStockIntent(intent.IntentHandler):
    """Answer how many of a spare part are in stock."""

    intent_type = INTENT_PART_STOCK
    description = (
        "Tells how many of a spare part / consumable are in stock (with the "
        "storage location), matched by the part's name. Use for questions like "
        "'how many water filters do we have left?'"
    )
    slot_schema = {vol.Required("name"): cv.string}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        slots = self.async_validate_slots(intent_obj.slots)
        name = slots["name"]["value"].strip()
        lang = intent_obj.language
        response = intent_obj.create_response()

        matches = _match_tasks(name, _part_snapshot(intent_obj.hass))
        if not matches:
            response.async_set_error(
                intent.IntentResponseErrorCode.NO_VALID_TARGETS,
                _sp("part_not_found", lang, name=name),
            )
            return response
        if len(matches) > 1:
            candidates = ", ".join(
                _sp("item_on", lang, task=p["name"], object=p["object_name"]) for p in matches[:4]
            )
            response.async_set_error(
                intent.IntentResponseErrorCode.NO_VALID_TARGETS,
                _sp("ambiguous", lang, candidates=candidates),
            )
            return response

        part = matches[0]
        if part["stock"] is None:
            response.async_set_speech(_sp("stock_untracked", lang, part=part["name"]))
            return response

        loc = _sp("stock_loc", lang, loc=part["storage_location"]) if part.get("storage_location") else ""
        threshold = part.get("reorder_threshold")
        low = (
            _sp("stock_low", lang)
            if isinstance(threshold, int) and part["stock"] <= threshold
            else ""
        )
        response.async_set_speech(
            _sp("stock_line", lang, stock=part["stock"], part=part["name"], loc=loc, low=low)
        )
        return response
