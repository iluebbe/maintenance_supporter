"""Assist intents — query + complete maintenance tasks by voice / LLM agents.

Registered through HA's integration intent platform (``async_setup_intents``,
picked up automatically when the ``intent`` component loads — same mechanism as
shopping_list):

* ``MaintenanceSupporterListTasks`` — *"what maintenance is due?"* Speaks a
  snapshot of actionable tasks, optionally filtered by status.
* ``MaintenanceSupporterCompleteTask`` — *"I did the oil change"* — matches a
  task by its spoken name (the object name counts too, so "oil change on the
  car" works — see ``helpers/intent_match``) and records a REAL completion through the coordinator —
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
* ``MaintenanceSupporterPostponeTask`` / ``MaintenanceSupporterSkipTask`` —
  move or skip the current occurrence.

The household intents (readings, notes, whose turn, shopping, batteries,
undo) live in ``intent_household.py``.

LLM-based Assist pipelines expose every registered intent handler as a tool
automatically (``helpers/llm``), in any language — no setup needed. The classic
sentence-matching agent additionally needs the sentence files shipped under
``assist_sentences/``, which the "Install Assist sentences" setting copies into
``config/custom_sentences/`` (see FEATURES → Voice & Assist).
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import intent

from .const import COMPLETION_PROVENANCE_NOTES, CONF_OBJECT, CONF_TASKS, DOMAIN, NOTIFIABLE_STATUSES
from .helpers.aggregate import get_object_entries, iter_live_tasks, priority_rank
from .helpers.aggregate import object_name as aggregate_object_name

INTENT_LIST_TASKS = "MaintenanceSupporterListTasks"
INTENT_COMPLETE_TASK = "MaintenanceSupporterCompleteTask"
INTENT_TASK_INSTRUCTIONS = "MaintenanceSupporterTaskInstructions"
INTENT_TASK_DUE = "MaintenanceSupporterTaskDue"
INTENT_SNOOZE_TASK = "MaintenanceSupporterSnoozeTask"
INTENT_PART_STOCK = "MaintenanceSupporterPartStock"
INTENT_POSTPONE_TASK = "MaintenanceSupporterPostponeTask"
INTENT_SKIP_TASK = "MaintenanceSupporterSkipTask"
# Voice package C (2026-09-30) — handlers in intent_household.py.
INTENT_RECORD_READING = "MaintenanceSupporterRecordReading"
INTENT_ADD_NOTE = "MaintenanceSupporterAddNote"
INTENT_WHOSE_TURN = "MaintenanceSupporterWhoseTurn"
INTENT_SHOPPING_LIST = "MaintenanceSupporterShoppingList"
INTENT_BOUGHT_PART = "MaintenanceSupporterBoughtPart"
INTENT_LOW_BATTERIES = "MaintenanceSupporterLowBatteries"
INTENT_UNDO = "MaintenanceSupporterUndo"

# "What needs attention" = the statuses a reminder can be about (the shared
# const set; this module spelled its own tuple — DRY audit 2026-09-26 B).
_ACTIONABLE = NOTIFIABLE_STATUSES

# Spoken responses live in assist_sentences/responses/<lang>.json — 38 keys
# across 22 languages is far too much to read past on the way to the
# handlers, and a translator should not have to edit Python. The loader and
# the English-per-key fallback live in helpers/intent_speech.


def _sp(key: str, language: str | None, **fmt: Any) -> str:
    """Spoken text for *key*, in the requesting language.

    Thin seam on purpose: every handler already calls ``_sp``, so the move
    to per-language files needed no changes at the call sites.
    """
    from .helpers.intent_speech import speak

    return speak(key, language, **fmt)


async def _refusal(hass: HomeAssistant, err: HomeAssistantError, language: str | None) -> str:
    """A coordinator's refusal in the spoken language (``str(err)`` is
    always English — see :func:`.helpers.intent_speech.async_refusal`)."""
    from .helpers.intent_speech import async_refusal

    return await async_refusal(hass, err, language)


def _task_snapshot(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Live snapshot of every active (non-archived) task across all objects.

    Same shape/source as the ``list_tasks`` service — both walk
    :func:`~.helpers.aggregate.iter_live_tasks`: the coordinator's computed
    payload, so status/next_due reflect the Store, not stale entry data.
    """
    from .helpers.phases import current_phase

    tasks: list[dict[str, Any]] = []
    for ce, task_id, task in iter_live_tasks(hass):
        obj = ce.data.get(CONF_OBJECT) or {}
        # Cycle phases (#139): name the step currently due, so answers
        # say WHICH work is meant ("Mower blades — next step: replace").
        phase = current_phase(task)
        tasks.append(
            {
                "entry_id": ce.entry_id,
                "task_id": task_id,
                # The shared display-name rule (an empty name falls back to
                # the entry title — this copy kept "", unlike list_tasks).
                "object_name": aggregate_object_name(ce),
                # The object's room, so a satellite can answer for where it
                # is standing rather than for the whole house.
                "area_id": obj.get("area_id") or None,
                "name": str(task.get("name") or ""),
                # Whose turn it is — for a rotation this is the current duty.
                "responsible_user_id": task.get("responsible_user_id") or None,
                "status": str(task.get("_status", "")),
                "days_until_due": task.get("_days_until_due"),
                "next_due": task.get("_next_due"),
                "phase": str(phase["name"]) if phase else None,
                # #134: high-priority work is named as such and listed first
                # within the same urgency bucket.
                "priority": str(task.get("priority") or "normal"),
            }
        )
    return tasks


def _asking_area(intent_obj: intent.Intent) -> str | None:
    """Which area the request came from, or None if we cannot tell.

    Home Assistant hands the handler both the device that captured the speech
    and (for voice satellites) the satellite entity. Either can carry the area:
    an entity's own area override wins, otherwise its device's.
    """
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    hass = intent_obj.hass

    satellite_id = getattr(intent_obj, "satellite_id", None)
    if satellite_id:
        entry = er.async_get(hass).async_get(satellite_id)
        if entry is not None:
            if entry.area_id:
                return entry.area_id
            if entry.device_id:
                device = dr.async_get(hass).async_get(entry.device_id)
                if device is not None and device.area_id:
                    return device.area_id

    if intent_obj.device_id:
        device = dr.async_get(hass).async_get(intent_obj.device_id)
        if device is not None and device.area_id:
            return device.area_id

    return None


def _area_id_for_name(hass: HomeAssistant, name: str) -> str | None:
    """The area a spoken name (or alias) refers to.

    The classic agent fills ``{area}`` from Home Assistant's own area list,
    so the value is a name or an alias; an LLM agent may pass either, or the
    id itself.
    """
    from homeassistant.helpers import area_registry as ar

    from .helpers.intent_match import fold

    registry = ar.async_get(hass)
    if registry.async_get_area(name) is not None:
        return name
    wanted = fold(name)
    for area in registry.async_list_areas():
        if fold(area.name) == wanted or any(fold(alias) == wanted for alias in area.aliases):
            return area.id
    return None


def _is_classic_agent(intent_obj: intent.Intent) -> bool:
    """Whether Home Assistant's own sentence-matching agent is asking — it
    answers once and cannot follow up, unlike an LLM agent."""
    return getattr(intent_obj, "conversation_agent_id", None) == "conversation.home_assistant"


def _asking_user(intent_obj: intent.Intent) -> str | None:
    """The Home Assistant user who spoke, when the pipeline knows one."""
    context = getattr(intent_obj, "context", None)
    return getattr(context, "user_id", None) if context else None


def _match_tasks(
    query: str, snapshot: list[dict[str, Any]], language: str | None = None
) -> list[dict[str, Any]]:
    """Match a spoken name against tasks (object name counts too) — the rules
    live in :mod:`.helpers.intent_match`."""
    from .helpers.intent_match import match_rows

    return match_rows(query, snapshot, language)


def _sp_n(key: str, language: str | None, number: int, **fmt: Any) -> str:
    """:func:`_sp` for a text carrying a number — picks the number form."""
    from .helpers.intent_speech import speak_count

    return speak_count(key, language, number, **fmt)


# A task with no due day at all (manual schedule, a sensor task not yet
# triggered) is described by its status — in words, not the raw status id
# the first version spoke ("due_soon", "paused").
_UNDATED_STATUS_KEYS = {"overdue": "st_overdue_plain", "due_soon": "st_due_soon_plain"}


def _describe(task: dict[str, Any], language: str | None) -> str:
    days = task.get("days_until_due")
    if task["status"] == "triggered":
        desc = _sp("st_triggered", language)
    elif isinstance(days, int) and days < 0:
        # "1 days overdue" was shipped in English and German alike; a single
        # string cannot inflect, so the number form is chosen per language
        # (Czech, Polish, Russian and Ukrainian have a form for 2-4 as well).
        desc = _sp_n("st_overdue", language, -days, days=-days)
    elif days == 0:
        desc = _sp("st_due_today", language)
    elif isinstance(days, int):
        desc = _sp_n("st_due_in", language, days, days=days)
    else:
        desc = _sp(_UNDATED_STATUS_KEYS.get(task["status"], "st_no_date"), language)
    if task.get("priority") == "high":
        desc = f"{desc}{_sp('st_priority', language)}"
    line = f"{_sp('item_on', language, task=task['name'], object=task['object_name'])} ({desc})"
    if task.get("phase"):
        line = f"{line}{_sp('st_phase', language, phase=task['phase'])}"
    return line


def _resolve_single(
    intent_obj: intent.Intent, name: str, snapshot: list[dict[str, Any]]
) -> tuple[dict[str, Any] | None, intent.IntentResponse | None]:
    """Match a spoken name to exactly ONE snapshot row.

    Returns ``(row, None)`` on success, ``(None, error_response)`` otherwise —
    the shared not-found / ambiguity contract of every name-taking intent.
    """
    lang = intent_obj.language
    response = intent_obj.create_response()
    matches = _match_tasks(name, snapshot, lang)
    if not matches:
        response.async_set_error(
            intent.IntentResponseErrorCode.NO_VALID_TARGETS,
            _sp("not_found", lang, name=name),
        )
        return None, response
    if len(matches) > 1:
        # Before giving up, let the room decide. "Complete the filter change"
        # spoken at the utility-room satellite means the one in the utility
        # room — and getting this right matters more than convenience, because
        # a voice completion writes real history through the coordinator.
        area = _asking_area(intent_obj)
        if area:
            local = [t for t in matches if t.get("area_id") == area]
            if len(local) == 1:
                return local[0], None
        response.async_set_error(
            intent.IntentResponseErrorCode.NO_VALID_TARGETS,
            _ambiguity(matches, "ambiguous", lang),
        )
        return None, response
    return matches[0], None


def _ambiguity(matches: list[dict[str, Any]], key: str, lang: str | None) -> str:
    """"That matches several …" — with the phrasing that picks one.

    The bare "please be more specific" left people guessing what more there
    was to say (voice audit 2026-09-30). The example is the first candidate
    said the way the matcher resolves it: task on object.
    """
    labels = [_sp("item_on", lang, task=t["name"], object=t["object_name"]) for t in matches[:4]]
    return _sp(key, lang, candidates=", ".join(labels), example=labels[0])


async def async_setup_intents(hass: HomeAssistant) -> None:
    """Register the Maintenance Supporter intents."""
    # Read the response texts now, in the executor: a handler answering a
    # spoken question must not block the event loop on disk.
    from .helpers.intent_speech import async_load

    await async_load(hass)

    intent.async_register(hass, ListTasksIntent())
    intent.async_register(hass, CompleteTaskIntent())
    intent.async_register(hass, TaskInstructionsIntent())
    intent.async_register(hass, TaskDueIntent())
    intent.async_register(hass, SnoozeTaskIntent())
    intent.async_register(hass, PartStockIntent())
    intent.async_register(hass, PostponeTaskIntent())
    intent.async_register(hass, SkipTaskIntent())

    from .intent_household import async_setup_household_intents

    await async_setup_household_intents(hass)


class ListTasksIntent(intent.IntentHandler):
    """Speak which maintenance tasks need attention (optionally by status)."""

    intent_type = INTENT_LIST_TASKS
    description = (
        "Lists the user's home-maintenance tasks that need attention "
        "(overdue, due soon or sensor-triggered), optionally filtered by a "
        "status. Use for questions like 'what maintenance is due?'. Set scope "
        "to 'mine' for the tasks assigned to the person asking (including "
        "whose turn it is on a rotating chore), or 'here' for the tasks "
        "belonging to the room the request came from. Set area to a Home "
        "Assistant area name for 'what is due in the kitchen?', and "
        "within_days for a time window ('what is due this week?' = 7, "
        "'today' = 0): then every task due within that many days is listed, "
        "including overdue ones."
    )
    slot_schema = {
        vol.Optional("status"): vol.In(["ok", "due_soon", "overdue", "triggered"]),
        vol.Optional("scope"): vol.In(["all", "mine", "here"]),
        vol.Optional("area"): cv.string,
        vol.Optional("within_days"): vol.All(vol.Coerce(int), vol.Range(min=0, max=366)),
    }

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        slots = self.async_validate_slots(intent_obj.slots)
        wanted = slots.get("status", {}).get("value")
        scope = slots.get("scope", {}).get("value") or "all"
        area_name = slots.get("area", {}).get("value")
        within = slots.get("within_days", {}).get("value")
        statuses = (wanted,) if wanted else _ACTIONABLE
        snapshot = _task_snapshot(intent_obj.hass)
        if within is not None and not wanted:
            # A window asks "what comes up", not "what needs attention": a
            # task due in five days is in "this week" whatever its status
            # (due-soon starts at each task's own warning days).
            tasks = [
                t
                for t in snapshot
                if t["status"] in _ACTIONABLE
                or (isinstance(t["days_until_due"], int) and t["days_until_due"] <= int(within))
            ]
        else:
            tasks = [t for t in snapshot if t["status"] in statuses]

        response = intent_obj.create_response()
        lang = intent_obj.language

        if area_name:
            area_id = _area_id_for_name(intent_obj.hass, str(area_name))
            if area_id is None:
                response.async_set_error(
                    intent.IntentResponseErrorCode.NO_VALID_TARGETS,
                    _sp("unknown_area_name", lang, area=area_name),
                )
                return response
            tasks = [t for t in tasks if t.get("area_id") == area_id]

        # A scope we cannot resolve is answered honestly rather than silently
        # widened: "everything in the house" is a plausible-sounding wrong
        # answer to "what needs doing in here?".
        if scope == "mine":
            user_id = _asking_user(intent_obj)
            if not user_id:
                response.async_set_error(
                    intent.IntentResponseErrorCode.NO_VALID_TARGETS,
                    _sp("unknown_user", lang),
                )
                return response
            tasks = [t for t in tasks if t.get("responsible_user_id") == user_id]
        elif scope == "here":
            area = _asking_area(intent_obj)
            if not area:
                response.async_set_error(
                    intent.IntentResponseErrorCode.NO_VALID_TARGETS,
                    _sp("unknown_area", lang),
                )
                return response
            tasks = [t for t in tasks if t.get("area_id") == area]

        # Most urgent first: overdue (most days) → due today → due soon.
        # Within the same due day, high-priority work is named first (#134).
        tasks.sort(
            key=lambda t: (
                t["days_until_due"] is None,
                t["days_until_due"] or 0,
                priority_rank(t.get("priority")),
            )
        )

        if not tasks:
            if area_name:
                response.async_set_speech(_sp("none_due_area", lang, area=area_name))
            elif within is not None:
                response.async_set_speech(_sp("none_due_window", lang))
            else:
                empty = {"mine": "none_due_mine", "here": "none_due_here"}.get(scope, "none_due")
                response.async_set_speech(_sp(empty, lang))
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

        # Cycle phases (#139): remember the step this completion performs, so
        # the confirmation can say what was DONE and what comes next.
        done_phase = target.get("phase")

        from .helpers import voice_undo

        before = voice_undo.capture(hass, target["entry_id"], target["task_id"])
        try:
            await coordinator.complete_maintenance(
                task_id=target["task_id"],
                # The speaking user when the pipeline knows one; "assist" was a
                # sentinel that never matched a pool member (bug audit 2026-08-29).
                completed_by=intent_obj.context.user_id if intent_obj.context else None,
                notes=COMPLETION_PROVENANCE_NOTES["voice"],
                unattended=True,
                source="voice",
            )
        except ServiceValidationError as exc:
            # The task demands details voice cannot capture (a photo, a cost).
            # Say so plainly — in the language that was spoken.
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                await _refusal(hass, exc, lang),
            )
            return response
        voice_undo.remember(
            hass, intent_obj, "completed", before, task=target["name"], object=target["object_name"]
        )

        if done_phase:
            from .helpers.phases import current_phase

            next_task = (coordinator.data or {}).get(CONF_TASKS, {}).get(target["task_id"]) or {}
            next_phase = current_phase(next_task)
            response.async_set_speech(
                _sp(
                    "completed_phase",
                    lang,
                    task=target["name"],
                    object=target["object_name"],
                    phase=done_phase,
                    next=str(next_phase["name"]) if next_phase else done_phase,
                )
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
            task = dict(entry.data.get(CONF_TASKS, {}).get(target["task_id"], {}) or {})

        # Cycle phases (#139): the guidance must describe the step currently
        # DUE. Static defs live in entry.data; the cursor is Store state —
        # splice it in so current_phase/effective_field resolve like every
        # other surface. Falls through untouched for phase-less tasks.
        from .helpers.phases import current_phase, effective_field

        store = getattr(rd, "store", None) if rd else None
        if store is not None and task.get("phases"):
            task["phase_cursor"] = store.get_task_state(target["task_id"]).get("phase_cursor", 0)
        phase = current_phase(task)

        segments: list[str] = []

        if phase:
            segments.append(
                _sp(
                    "guide_phase",
                    lang,
                    phase=str(phase["name"]),
                    index=int(phase["index"]) + 1,
                    count=int(phase["count"]),
                )
            )

        notes = task.get("notes")
        if isinstance(notes, str) and notes.strip():
            trimmed = notes.strip()
            if len(trimmed) > 240:
                trimmed = trimmed[:237] + "…"
            segments.append(_sp("guide_notes", lang, notes=trimmed))

        checklist = [
            s
            for s in (effective_field(task, "checklist") or [])
            if isinstance(s, str) and s.strip()
        ]
        if checklist:
            segments.append(
                _sp_n("guide_checklist", lang, len(checklist), count=len(checklist), steps="; ".join(checklist[:8]))
            )

        # Documents linked to THIS task, with the per-task page hint when set.
        from . import DOCUMENT_STORE_KEY

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

        # Required spare parts with storage location + live stock. A link may
        # name another object's pool (#111): resolved through the one shared
        # resolver, which reads that pool's own parts and stock — the entry-
        # local lookup this used to do left pooled parts out of the answer.
        from .parts_runtime import resolve_part_link

        links = effective_field(task, "consumes_parts") or []
        for link in links if entry is not None else []:
            if not isinstance(link, dict) or entry is None:
                continue
            _owner, part, part_store = resolve_part_link(hass, entry, link)
            if not isinstance(part, dict):
                continue
            extras: list[str] = []
            if part.get("storage_location"):
                extras.append(_sp("guide_part_loc", lang, loc=part["storage_location"]))
            stock = part_store.get_part_stock(str(link.get("part_id"))) if part_store is not None else None
            if stock is not None:
                extras.append(_sp("guide_part_stock", lang, stock=_num(stock)))
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
            # The classic agent cannot hold a follow-up, so asking it "would
            # you like that?" invited a "yes" nobody would answer.
            key = "guide_none_plain" if _is_classic_agent(intent_obj) else "guide_none"
            response.async_set_speech(_sp(key, lang, task=target["name"], object=target["object_name"]))
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

        from .helpers.intent_speech import spoken_iso_date

        speech = _describe(target, lang) + "."
        # Said the way a date is said ("October 3"), not read out as ISO.
        when = spoken_iso_date(target.get("next_due"), lang)
        if when:
            speech += _sp("due_date_suffix", lang, date=when)
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
        from .const import CONF_SNOOZE_DURATION_HOURS
        from .helpers.global_options import global_option

        nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
        if nm is None:
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                _sp("snooze_unavailable", lang),
            )
            return response

        from .helpers import voice_undo

        before = voice_undo.capture(hass, target["entry_id"], target["task_id"])
        nm.snooze_task(target["entry_id"], target["task_id"])
        voice_undo.remember(hass, intent_obj, "snoozed", before, task=target["name"], object=target["object_name"])
        hours = global_option(hass, CONF_SNOOZE_DURATION_HOURS)
        if isinstance(hours, float) and hours.is_integer():
            hours = int(hours)  # "4 hours", not "4.0 hours"
        # The number form only for a whole number; "1.5 hours" is plural.
        count = hours if isinstance(hours, int) else 0
        response.async_set_speech(
            _sp_n("snoozed", lang, count, task=target["name"], object=target["object_name"], hours=hours)
        )
        return response


def _part_snapshot(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Every spare part across all objects, in the _match_tasks row shape
    (``name`` + ``object_name``) so the same fuzzy matcher applies."""
    from .const import CONF_PARTS

    rows: list[dict[str, Any]] = []
    for ce in get_object_entries(hass):
        object_name = aggregate_object_name(ce)
        rd = getattr(ce, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        for part_id, part in (ce.data.get(CONF_PARTS) or {}).items():
            if not isinstance(part, dict):
                continue
            rows.append(
                {
                    "entry_id": ce.entry_id,
                    "part_id": part_id,
                    "name": str(part.get("name") or ""),
                    "object_name": object_name,
                    "storage_location": part.get("storage_location"),
                    "reorder_threshold": part.get("reorder_threshold"),
                    "restock_quantity": part.get("restock_quantity"),
                    "stock": store.get_part_stock(part_id) if store is not None else None,
                }
            )
    return rows


def _resolve_part(
    intent_obj: intent.Intent, name: str
) -> tuple[dict[str, Any] | None, intent.IntentResponse | None]:
    """Match a spoken part name to exactly ONE spare part (the parts
    counterpart of :func:`_resolve_single`)."""
    lang = intent_obj.language
    matches = _match_tasks(name, _part_snapshot(intent_obj.hass), lang)
    if len(matches) == 1:
        return matches[0], None
    response = intent_obj.create_response()
    if not matches:
        response.async_set_error(
            intent.IntentResponseErrorCode.NO_VALID_TARGETS,
            _sp("part_not_found", lang, name=name),
        )
    else:
        response.async_set_error(
            intent.IntentResponseErrorCode.NO_VALID_TARGETS,
            _ambiguity(matches, "part_ambiguous", lang),
        )
    return None, response


def _num(value: Any) -> Any:
    """A stock or reading as it is said: "4", not "4.0"."""
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return value


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

        part, err = _resolve_part(intent_obj, name)
        if err is not None:
            return err
        assert part is not None

        if part["stock"] is None:
            response.async_set_speech(_sp("stock_untracked", lang, part=part["name"]))
            return response

        from .helpers.parts import part_is_low

        loc = _sp("stock_loc", lang, loc=part["storage_location"]) if part.get("storage_location") else ""
        # The shared stock rule: a decimal threshold ("0.5 bags") counts too —
        # the int-only check here never warned for one.
        low = _sp("stock_low", lang) if part_is_low(part, part["stock"]) else ""
        response.async_set_speech(
            _sp("stock_line", lang, stock=_num(part["stock"]), part=part["name"], loc=loc, low=low)
        )
        return response


def _resolve_coordinator(
    intent_obj: intent.Intent, target: dict[str, Any], name: str
) -> tuple[Any, intent.IntentResponse | None]:
    """The coordinator behind a matched task, or a spoken failure."""
    entry = intent_obj.hass.config_entries.async_get_entry(target["entry_id"])
    rd = getattr(entry, "runtime_data", None)
    coordinator = getattr(rd, "coordinator", None) if rd else None
    if coordinator is None:
        response = intent_obj.create_response()
        response.async_set_error(
            intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
            _sp("not_found", intent_obj.language, name=name),
        )
        return None, response
    return coordinator, None


class PostponeTaskIntent(intent.IntentHandler):
    """Defer just this occurrence of a task, spoken."""

    intent_type = INTENT_POSTPONE_TASK
    description = (
        "Postpones the CURRENT occurrence of a home-maintenance task to a later "
        "date without completing it; the recurring cadence is untouched. Give "
        "either days (how many days to push it back) or date (YYYY-MM-DD). Use "
        "for 'postpone the oil change by a week'. This is not the same as "
        "snoozing, which only mutes reminders."
    )
    slot_schema = {
        vol.Required("name"): cv.string,
        vol.Optional("days"): vol.Coerce(int),
        vol.Optional("date"): cv.string,
    }

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        from datetime import date as date_cls
        from datetime import timedelta

        from homeassistant.util import dt as dt_util

        hass = intent_obj.hass
        slots = self.async_validate_slots(intent_obj.slots)
        name = str(slots["name"]["value"]).strip()
        lang = intent_obj.language

        target, err = _resolve_single(intent_obj, name, _task_snapshot(hass))
        if err is not None:
            return err
        assert target is not None
        response = intent_obj.create_response()

        today = dt_util.now().date()
        spoken_date = slots.get("date", {}).get("value")
        days = slots.get("days", {}).get("value")

        if spoken_date:
            try:
                until = date_cls.fromisoformat(str(spoken_date))
            except ValueError:
                response.async_set_error(
                    intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                    _sp("postpone_needs_when", lang),
                )
                return response
        elif days is not None:
            # Counted from the due date, or from today when that has already
            # passed: "postpone by three days" on a task that went overdue last
            # month must not land on a date that is still in the past.
            base = today
            next_due = target.get("next_due")
            if next_due:
                try:
                    base = max(date_cls.fromisoformat(str(next_due)[:10]), today)
                except ValueError:
                    base = today
            # Capped just past the longest interval: the coordinator refuses
            # that with its own reason, and a huge number from an LLM tool
            # call cannot overflow the date arithmetic first.
            from .const import MAX_INTERVAL_DAYS

            until = base + timedelta(days=min(int(days), MAX_INTERVAL_DAYS + 1))
        else:
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                _sp("postpone_needs_when", lang),
            )
            return response

        if until <= today:
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                _sp("postpone_past", lang, task=target["name"]),
            )
            return response

        coordinator, err = _resolve_coordinator(intent_obj, target, name)
        if err is not None:
            return err

        from .helpers import voice_undo
        from .helpers.intent_speech import spoken_date

        before = voice_undo.capture(hass, target["entry_id"], target["task_id"])
        try:
            await coordinator.async_postpone_task(target["task_id"], until)
        except ServiceValidationError as exc:
            # An archived / disabled / paused task, or a date beyond the
            # longest interval: say so, in the language that was spoken.
            response.async_set_error(intent.IntentResponseErrorCode.FAILED_TO_HANDLE, await _refusal(hass, exc, lang))
            return response
        voice_undo.remember(hass, intent_obj, "postponed", before, task=target["name"], object=target["object_name"])
        response.async_set_speech(
            _sp(
                "postponed",
                lang,
                task=target["name"],
                object=target["object_name"],
                date=spoken_date(until, lang),
            )
        )
        return response


class SkipTaskIntent(intent.IntentHandler):
    """Skip the current cycle of a task, spoken."""

    intent_type = INTENT_SKIP_TASK
    description = (
        "Skips the CURRENT cycle of a home-maintenance task: the task is not "
        "recorded as done, and the schedule moves on to the next occurrence. "
        "Use for 'skip the lawn mowing this time'."
    )
    slot_schema = {vol.Required("name"): cv.string}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        hass = intent_obj.hass
        slots = self.async_validate_slots(intent_obj.slots)
        name = str(slots["name"]["value"]).strip()
        lang = intent_obj.language

        target, err = _resolve_single(intent_obj, name, _task_snapshot(hass))
        if err is not None:
            return err
        assert target is not None

        coordinator, err = _resolve_coordinator(intent_obj, target, name)
        if err is not None:
            return err

        from .helpers import voice_undo

        before = voice_undo.capture(hass, target["entry_id"], target["task_id"])
        try:
            await coordinator.skip_maintenance(target["task_id"])
        except ServiceValidationError as exc:
            response = intent_obj.create_response()
            if getattr(exc, "translation_key", None) == "skip_disabled":
                # #150: the task carries a skip lock — say so instead of failing.
                response.async_set_speech(_sp("skip_disabled", lang, task=target["name"]))
            else:
                # An archived / disabled / paused task: its own reason, like
                # Complete and Postpone — every refusal used to be announced
                # as the skip lock (audit 2026-09-29).
                response.async_set_error(
                    intent.IntentResponseErrorCode.FAILED_TO_HANDLE, await _refusal(hass, exc, lang)
                )
            return response
        voice_undo.remember(hass, intent_obj, "skipped", before, task=target["name"], object=target["object_name"])

        # Read the new due date back so the answer says what actually happened
        # rather than just acknowledging the command.
        fresh = next(
            (
                t
                for t in _task_snapshot(hass)
                if t["entry_id"] == target["entry_id"] and t["task_id"] == target["task_id"]
            ),
            None,
        )
        from .helpers.intent_speech import spoken_iso_date

        due = spoken_iso_date((fresh or {}).get("next_due"), lang)
        response = intent_obj.create_response()
        # A task with no next date (manual schedule) is not told "due ?".
        if due:
            speech = _sp("skipped", lang, task=target["name"], object=target["object_name"], date=due)
        else:
            speech = _sp("skipped_no_date", lang, task=target["name"], object=target["object_name"])
        response.async_set_speech(speech)
        return response
