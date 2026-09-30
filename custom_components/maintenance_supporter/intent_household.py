"""Assist intents for the rest of the household routine (voice package C).

``intent.py`` answers "what is due" and acts on one task. These cover what
people said to a voice satellite next, once they had that:

* ``MaintenanceSupporterRecordReading`` — *"the water meter reads 1234.5"*:
  a real completion carrying the value, like the panel's reading dialog;
* ``MaintenanceSupporterAddNote`` — *"add a note to the boiler saying the
  pressure was low"*: a dated line appended to the task's notes (never a
  replacement — voice cannot see what is already there);
* ``MaintenanceSupporterWhoseTurn`` — *"whose turn is it to mow the lawn?"*;
* ``MaintenanceSupporterShoppingList`` — *"what do we need to buy?"*: the
  spare parts at or below their reorder threshold;
* ``MaintenanceSupporterBoughtPart`` — *"I bought four water filters"*:
  completes the open buy task (restocking by that many) or adds to stock;
* ``MaintenanceSupporterLowBatteries`` — *"which batteries are low?"*;
* ``MaintenanceSupporterUndo`` — *"undo that"*: takes back the speaker's last
  voice action (``helpers/voice_undo``).
"""

from __future__ import annotations

import re
from typing import Any

import voluptuous as vol
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util

from .const import COMPLETION_PROVENANCE_NOTES, CONF_TASKS, MAX_TEXT_LENGTH
from .intent import (
    INTENT_ADD_NOTE,
    INTENT_BOUGHT_PART,
    INTENT_LOW_BATTERIES,
    INTENT_RECORD_READING,
    INTENT_SHOPPING_LIST,
    INTENT_UNDO,
    INTENT_WHOSE_TURN,
    _asking_user,
    _num,
    _part_snapshot,
    _refusal,
    _resolve_coordinator,
    _resolve_part,
    _resolve_single,
    _sp,
    _sp_n,
    _task_snapshot,
)

# Languages that write a decimal COMMA ("12,5"). Everything else here writes
# a point; the spoken answer follows the same convention.
_DECIMAL_COMMA = frozenset(
    {"de", "fr", "es", "it", "nl", "pt", "pt-br", "ru", "uk", "pl", "cs", "da", "fi", "nb", "sv", "tr", "hu"}
)
_NUMBER = re.compile(r"-?\d[\d\s.,'’]*")


def _lang(language: str | None) -> str:
    from .helpers.i18n import normalize_language_code

    return normalize_language_code(language)


def parse_spoken_number(text: str, language: str | None) -> float | None:
    """The number in a spoken value ("1.234,5 kWh", "12,5", "1 234").

    Speech-to-text writes digits with the language's own separators; which
    of "," and "." is the decimal mark depends on the language and, when both
    appear, on which comes last.
    """
    match = _NUMBER.search(str(text))
    if match is None:
        return None
    raw = re.sub(r"[\s'’]", "", match.group(0)).rstrip(".,")
    comma_decimal = _lang(language) in _DECIMAL_COMMA
    if "," in raw and "." in raw:
        decimal = "," if raw.rfind(",") > raw.rfind(".") else "."
        thousands = "." if decimal == "," else ","
        raw = raw.replace(thousands, "").replace(decimal, ".")
    elif "," in raw:
        head, _, tail = raw.rpartition(",")
        if raw.count(",") > 1:
            raw = raw.replace(",", "")  # "1,234,567"
        elif comma_decimal or len(tail) != 3:
            raw = f"{head}.{tail}"  # "12,5" — a decimal wherever it is written so
        else:
            raw = head + tail  # "1,234" in English is a thousand
    elif "." in raw:
        head, _, tail = raw.rpartition(".")
        if raw.count(".") > 1 or (comma_decimal and len(tail) == 3):
            raw = raw.replace(".", "")  # "12.500" in German is twelve thousand five hundred
    try:
        return float(raw)
    except ValueError:
        return None


def say_number(value: Any, language: str | None) -> str:
    """A number the way the language writes it back ("12,5" in German)."""
    text = str(_num(value))
    return text.replace(".", ",") if _lang(language) in _DECIMAL_COMMA else text


async def async_setup_household_intents(hass: Any) -> None:
    """Register the package-C intents (called from ``intent.async_setup_intents``)."""
    for handler in (
        RecordReadingIntent(),
        AddNoteIntent(),
        WhoseTurnIntent(),
        ShoppingListIntent(),
        BoughtPartIntent(),
        LowBatteriesIntent(),
        UndoIntent(),
    ):
        intent.async_register(hass, handler)


def _entry_and_static(hass: Any, target: dict[str, Any]) -> tuple[Any, dict[str, Any]]:
    entry = hass.config_entries.async_get_entry(target["entry_id"])
    static = dict(((entry.data.get(CONF_TASKS) or {}).get(target["task_id"]) or {}) if entry else {})
    return entry, static


class RecordReadingIntent(intent.IntentHandler):
    """Record a meter reading / measured value by voice."""

    intent_type = INTENT_RECORD_READING
    description = (
        "Records a reading (a meter value, a measured level) on a home-"
        "maintenance task of the 'reading' kind, matched by the task's name; "
        "this completes the task with that value, like the panel's reading "
        "dialog. value is the number as spoken (decimal comma or point). Use "
        "for 'the water meter reads 1234.5'. A task with several named "
        "readings cannot be recorded by voice."
    )
    slot_schema = {vol.Required("name"): cv.string, vol.Required("value"): cv.string}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        hass = intent_obj.hass
        slots = self.async_validate_slots(intent_obj.slots)
        name = str(slots["name"]["value"]).strip()
        spoken = str(slots["value"]["value"]).strip()
        lang = intent_obj.language

        target, err = _resolve_single(intent_obj, name, _task_snapshot(hass))
        if err is not None:
            return err
        assert target is not None
        response = intent_obj.create_response()
        entry, static = _entry_and_static(hass, target)

        from .helpers.reading_slots import resolve_reading_values, sanitize_reading_slots

        slots_def = sanitize_reading_slots(list(static.get("readings") or []))
        if len(slots_def) > 1:
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                _sp("reading_multi", lang, task=target["name"]),
            )
            return response
        if not slots_def and static.get("type") != "reading" and not static.get("reading_unit"):
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                _sp("reading_not_a_reading", lang, task=target["name"]),
            )
            return response

        value = parse_spoken_number(spoken, lang)
        if value is None or abs(value) > 1e12:
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                _sp("reading_unclear", lang, value=spoken),
            )
            return response

        coordinator, err = _resolve_coordinator(intent_obj, target, name)
        if err is not None:
            return err

        unit = static.get("reading_unit")
        kwargs: dict[str, Any] = {"reading_value": value}
        if slots_def:
            slot = slots_def[0]
            unit = slot.get("unit") or unit
            kwargs = {
                "reading_values": resolve_reading_values(
                    slots_def, {slot["id"]: value}, default_unit=static.get("reading_unit")
                )
            }

        from .helpers import voice_undo

        before = voice_undo.capture(hass, target["entry_id"], target["task_id"])
        try:
            await coordinator.complete_maintenance(
                task_id=target["task_id"],
                completed_by=_asking_user(intent_obj),
                notes=COMPLETION_PROVENANCE_NOTES["voice"],
                unattended=True,
                source="voice",
                **kwargs,
            )
        except ServiceValidationError as exc:
            response.async_set_error(intent.IntentResponseErrorCode.FAILED_TO_HANDLE, await _refusal(hass, exc, lang))
            return response
        voice_undo.remember(hass, intent_obj, "reading", before, task=target["name"], object=target["object_name"])
        response.async_set_speech(
            _sp(
                "reading_recorded",
                lang,
                value=say_number(value, lang),
                unit=f" {unit}" if unit else "",
                task=target["name"],
                object=target["object_name"],
            )
        )
        return response


class AddNoteIntent(intent.IntentHandler):
    """Append a dated note to a task."""

    intent_type = INTENT_ADD_NOTE
    description = (
        "Adds a note to a home-maintenance task, matched by its name: the text "
        "is appended to the task's notes as a new dated line (existing notes "
        "are kept). Use for 'add a note to the boiler saying the pressure was "
        "low'."
    )
    slot_schema = {vol.Required("name"): cv.string, vol.Required("note"): cv.string}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        hass = intent_obj.hass
        slots = self.async_validate_slots(intent_obj.slots)
        name = str(slots["name"]["value"]).strip()
        note = " ".join(str(slots["note"]["value"]).split())
        lang = intent_obj.language

        target, err = _resolve_single(intent_obj, name, _task_snapshot(hass))
        if err is not None:
            return err
        assert target is not None
        response = intent_obj.create_response()
        if not note:
            response.async_set_error(intent.IntentResponseErrorCode.FAILED_TO_HANDLE, _sp("note_empty", lang))
            return response

        entry, static = _entry_and_static(hass, target)
        coordinator, err = _resolve_coordinator(intent_obj, target, name)
        if err is not None:
            return err

        existing = str(static.get("notes") or "").rstrip()
        line = f"{dt_util.now().date().isoformat()}: {note}"
        combined = f"{existing}\n{line}" if existing else line
        if len(combined) > MAX_TEXT_LENGTH:
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE,
                _sp("note_too_long", lang, task=target["name"]),
            )
            return response

        from .helpers import voice_undo
        from .helpers.entry_tasks import write_task

        before = voice_undo.capture(hass, target["entry_id"], target["task_id"])
        write_task(hass, entry, target["task_id"], {**static, "notes": combined})
        await coordinator.async_refresh_now()
        voice_undo.remember(hass, intent_obj, "note", before, task=target["name"], object=target["object_name"])
        response.async_set_speech(_sp("note_added", lang, task=target["name"], object=target["object_name"]))
        return response


async def _person_name(hass: Any, user_id: str) -> str:
    """How the household calls a user: the person's name, else the login's."""
    for state in hass.states.async_all("person"):
        if state.attributes.get("user_id") == user_id:
            return str(state.name)
    user = await hass.auth.async_get_user(user_id)
    return str(user.name) if user is not None and user.name else user_id


class WhoseTurnIntent(intent.IntentHandler):
    """Say who is responsible for a task (the current turn on a rotation)."""

    intent_type = INTENT_WHOSE_TURN
    description = (
        "Tells who is responsible for a home-maintenance task, matched by its "
        "name — on a rotating chore, whose turn it is now. Use for 'whose turn "
        "is it to mow the lawn?'."
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
        response = intent_obj.create_response()
        fields = {"task": target["name"], "object": target["object_name"]}
        user_id = target.get("responsible_user_id")
        if not user_id:
            response.async_set_speech(_sp("turn_nobody", lang, **fields))
        elif user_id == _asking_user(intent_obj):
            response.async_set_speech(_sp("turn_you", lang, **fields))
        else:
            response.async_set_speech(_sp("turn_user", lang, user=await _person_name(hass, user_id), **fields))
        return response


class ShoppingListIntent(intent.IntentHandler):
    """Name the spare parts that are running low."""

    intent_type = INTENT_SHOPPING_LIST
    description = (
        "Lists the spare parts and consumables whose tracked stock is at or "
        "below their reorder threshold — what needs buying. Use for 'what do "
        "we need to buy?'. For low device batteries use the low-batteries tool."
    )
    slot_schema: dict[Any, Any] = {}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        from .helpers.parts import part_is_low

        lang = intent_obj.language
        response = intent_obj.create_response()
        low = sorted(
            (p for p in _part_snapshot(intent_obj.hass) if part_is_low(p, p["stock"])),
            key=lambda p: p["name"].casefold(),
        )
        if not low:
            response.async_set_speech(_sp("buy_none", lang))
            return response
        items = ", ".join(_sp("buy_item", lang, part=p["name"], stock=say_number(p["stock"], lang)) for p in low[:8])
        response.async_set_speech(_sp_n("buy_list", lang, len(low), count=len(low), items=items))
        return response


def _open_buy_task(hass: Any, part: dict[str, Any]) -> str | None:
    """The live buy task restocking *part*, if the shopping reminder is open."""
    from .helpers.parts import PART_REF_FIELD

    for row in _task_snapshot(hass):
        if row["entry_id"] != part["entry_id"]:
            continue
        entry = hass.config_entries.async_get_entry(row["entry_id"])
        static = ((entry.data.get(CONF_TASKS) or {}).get(row["task_id"]) or {}) if entry else {}
        ref = static.get(PART_REF_FIELD)
        if isinstance(ref, dict) and ref.get("part_id") == part["part_id"]:
            return str(row["task_id"])
    return None


class BoughtPartIntent(intent.IntentHandler):
    """Put bought spare parts into stock."""

    intent_type = INTENT_BOUGHT_PART
    description = (
        "Records that spare parts / consumables were bought, matched by the "
        "part's name: adds quantity to the tracked stock (the part's usual "
        "restock amount when no quantity is given) and closes its open buy "
        "reminder. Use for 'I bought four water filters'."
    )
    slot_schema = {
        vol.Required("name"): cv.string,
        vol.Optional("quantity"): vol.All(vol.Coerce(float), vol.Range(min=0.01, max=9999)),
    }

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        hass = intent_obj.hass
        slots = self.async_validate_slots(intent_obj.slots)
        name = str(slots["name"]["value"]).strip()
        lang = intent_obj.language

        part, err = _resolve_part(intent_obj, name)
        if err is not None:
            return err
        assert part is not None
        response = intent_obj.create_response()
        qty = slots.get("quantity", {}).get("value")
        quantity = float(qty) if qty else float(part.get("restock_quantity") or 1)

        from .helpers import voice_undo
        from .parts_runtime import async_change_part_stock

        entry = hass.config_entries.async_get_entry(part["entry_id"])
        if entry is None:
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE, _sp("part_not_found", lang, name=name)
            )
            return response
        buy_task = _open_buy_task(hass, part)
        before = voice_undo.capture(hass, part["entry_id"], buy_task)
        completed = False
        if buy_task is not None:
            rd = getattr(entry, "runtime_data", None)
            coordinator = getattr(rd, "coordinator", None) if rd else None
            if coordinator is not None:
                try:
                    # The buy task's completion restocks by exactly this much
                    # and leaves "bought" on its history.
                    await coordinator.complete_maintenance(
                        task_id=buy_task,
                        completed_by=_asking_user(intent_obj),
                        notes=COMPLETION_PROVENANCE_NOTES["voice"],
                        restock_quantity=quantity,
                        unattended=True,
                        source="voice",
                    )
                    completed = True
                except ServiceValidationError:
                    completed = False
        if not completed:
            await async_change_part_stock(hass, entry, part["part_id"], delta=quantity)
        voice_undo.remember(hass, intent_obj, "bought", before, part=part["name"], qty=say_number(quantity, lang))
        rd = getattr(entry, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        stock = store.get_part_stock(part["part_id"]) if store is not None else None
        response.async_set_speech(
            _sp(
                "bought",
                lang,
                qty=say_number(quantity, lang),
                part=part["name"],
                stock=say_number(stock if stock is not None else quantity, lang),
            )
        )
        return response


class LowBatteriesIntent(intent.IntentHandler):
    """Name the devices whose batteries are low (battery fleet)."""

    intent_type = INTENT_LOW_BATTERIES
    description = (
        "Lists the devices whose batteries are reported low (from Battery "
        "Notes and battery sensors), with the battery types to buy. Use for "
        "'which batteries are low?'."
    )
    slot_schema: dict[Any, Any] = {}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        from .helpers.battery_fleet import compute_overview

        lang = intent_obj.language
        response = intent_obj.create_response()
        overview = compute_overview(intent_obj.hass)
        if not overview.total:
            response.async_set_speech(_sp("batteries_unavailable", lang))
            return response
        if not overview.low:
            response.async_set_speech(_sp("batteries_none", lang))
            return response
        items = ", ".join(
            _sp("battery_item", lang, device=row["device_name"], type=row["battery_type"]) for row in overview.low[:8]
        )
        speech = _sp_n("batteries_low", lang, len(overview.low), count=len(overview.low), items=items)
        if overview.needs_now:
            needs = ", ".join(f"{qty} × {kind}" for kind, qty in overview.needs_now.items())
            speech += _sp("batteries_buy", lang, needs=needs)
        response.async_set_speech(speech)
        return response


_UNDONE_KEYS = {
    "completed": "undone_completed",
    "reading": "undone_reading",
    "skipped": "undone_skipped",
    "postponed": "undone_postponed",
    "snoozed": "undone_snoozed",
    "note": "undone_note",
    "bought": "undone_bought",
}


class UndoIntent(intent.IntentHandler):
    """Take back the speaker's last voice action."""

    intent_type = INTENT_UNDO
    description = (
        "Undoes the last home-maintenance action THIS person made by voice in "
        "the last 10 minutes (a completion, reading, skip, postponement, "
        "snooze, note or bought parts). Call it only when the user explicitly "
        "asks to undo or take back such an action."
    )
    slot_schema: dict[Any, Any] = {}

    async def async_handle(self, intent_obj: intent.Intent) -> intent.IntentResponse:
        """Handle the intent."""
        from .helpers import voice_undo

        hass = intent_obj.hass
        lang = intent_obj.language
        response = intent_obj.create_response()
        record = voice_undo.pop(hass, intent_obj)
        minutes = int(voice_undo.UNDO_WINDOW.total_seconds() // 60)
        if record is None:
            response.async_set_speech(_sp("undo_none", lang, minutes=minutes))
            return response
        label = record.speech.get("task") or record.speech.get("part") or ""
        if not voice_undo.unchanged_since(hass, record):
            response.async_set_error(
                intent.IntentResponseErrorCode.FAILED_TO_HANDLE, _sp("undo_changed", lang, task=label)
            )
            return response
        await voice_undo.async_restore(hass, record)
        response.async_set_speech(_sp(_UNDONE_KEYS[record.kind], lang, **record.speech))
        return response
