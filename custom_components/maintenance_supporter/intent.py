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
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import intent

from .const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

INTENT_LIST_TASKS = "MaintenanceSupporterListTasks"
INTENT_COMPLETE_TASK = "MaintenanceSupporterCompleteTask"

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
}


def _sp(key: str, language: str | None, **fmt: Any) -> str:
    # Per-request language (intent_obj.language, e.g. "de-DE") → bare 2-letter
    # key, same normalization rule as helpers/i18n (which is hass-bound).
    lang = (language or "en")[:2].lower()
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


async def async_setup_intents(hass: HomeAssistant) -> None:
    """Register the Maintenance Supporter intents."""
    intent.async_register(hass, ListTasksIntent())
    intent.async_register(hass, CompleteTaskIntent())


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
        response = intent_obj.create_response()

        matches = _match_tasks(name, _task_snapshot(hass))
        if not matches:
            response.async_set_error(
                intent.IntentResponseErrorCode.NO_VALID_TARGETS,
                _sp("not_found", lang, name=name),
            )
            return response
        if len(matches) > 1:
            candidates = ", ".join(
                _sp("item_on", lang, task=t["name"], object=t["object_name"]) for t in matches[:4]
            )
            response.async_set_error(
                intent.IntentResponseErrorCode.NO_VALID_TARGETS,
                _sp("ambiguous", lang, candidates=candidates),
            )
            return response

        target = matches[0]
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

        await coordinator.complete_maintenance(task_id=target["task_id"], completed_by="assist")
        response.async_set_speech(
            _sp("completed", lang, task=target["name"], object=target["object_name"])
        )
        return response
