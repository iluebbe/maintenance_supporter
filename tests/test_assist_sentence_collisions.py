"""Our Assist sentences must never steal Home Assistant's own commands.

Home Assistant's default agent ranks a CUSTOM sentence above every built-in
one whenever both match (``recognize_best`` with ``METADATA_CUSTOM_SENTENCE``).
So a sentence made of a common verb and a free-text name — "skip {name}",
"(mute|pause) {name}" — did not merely compete with "skip this song" or
"Radio stummschalten": it won. The voice audit of 2026-09-30 heard "skip to
the next song", "überspringe dieses Lied", "mets la télé en pause", "silencia
la radio", "metti in pausa il timer" and "sla dit nummer over" all answered
with "I couldn't find a maintenance task …" — and a matching task name would
have been skipped or snoozed for real.

Nothing caught it because no test ran our sentences next to the built-in
ones. This module does: it samples every built-in sentence template of each
language we ship (so that every alternative and optional of a template is
spoken at least once) and asserts that none of those texts matches ANY of our
sentences. The built-in sentences come from the ``home-assistant-intents``
package of the core under test, so a new built-in command in a future core
fails here before it is hijacked at somebody's home.

It also holds the positive side — the phrases people actually say still land
on the right intent with the right slots — and the merge hazards: our list
and expansion-rule names are merged into Home Assistant's, so a clash would
REPLACE a built-in list or rule.
"""

from __future__ import annotations

import os
from importlib import metadata
from pathlib import Path
from typing import Any

import pytest
import yaml

try:
    import home_assistant_intents as intents_pkg
    from hassil import Intents, recognize_all
    from hassil.expression import (
        Alternative,
        ListReference,
        Permutation,
        RuleReference,
        Sequence,
        TextChunk,
    )
    from hassil.intents import RangeSlotList, TextSlotList
    from hassil.util import normalize_whitespace
except ImportError:
    # CI installs both (they are the conversation component's requirements);
    # there a missing package must fail, not quietly skip the whole module.
    if os.environ.get("CI"):
        raise
    pytest.skip("hassil / home-assistant-intents not installed", allow_module_level=True)

_SENTENCES = Path(__file__).parent.parent / "custom_components" / "maintenance_supporter" / "assist_sentences"
_LANGUAGES = sorted(p.name for p in _SENTENCES.iterdir() if (p / "maintenance_supporter.yaml").is_file())

# hassil before 3.10 matches wildcards ~15x slower: the full sweep takes
# minutes there. The CI legs on current cores run it; the minimum-core leg
# (older hassil) says so instead of silently passing.
_HASSIL_VERSION = tuple(int(p) for p in metadata.version("hassil").split(".")[:2])
_slow_hassil = pytest.mark.skipif(
    _HASSIL_VERSION < (3, 10),
    reason=f"hassil {metadata.version('hassil')} is too slow for the full sweep; the current-core CI legs run it",
)

# Stand-in values for Home Assistant's runtime lists ({name}, {area}, …) —
# what they are does not matter, only that the built-in sentence is spoken
# with SOMETHING where a device or room name goes.
_FILL = "Radio"


def _ours(language: str) -> Intents:
    return Intents.from_dict(
        yaml.safe_load((_SENTENCES / language / "maintenance_supporter.yaml").read_text(encoding="utf-8"))
    )


def _our_runtime_lists() -> dict[str, Any]:
    return {"area": TextSlotList.from_strings([_FILL, "kitchen", "Küche", "cuisine", "cocina", "cucina", "keuken"], name="area")}


def _cover(exp: Any, lists: dict[str, Any], rules: dict[str, Any], depth: int = 0) -> list[str]:
    """Texts that speak every alternative of *exp* at least once.

    ``hassil.sample`` enumerates the full cross product — millions for some
    built-in templates — and taking its first N covers only the last group's
    alternatives. Pairing the groups' alternatives in lock-step (forwards and
    backwards) covers each one with a handful of texts, including "every
    optional present" and "every optional absent".
    """
    if depth > 40:
        return [_FILL]
    if isinstance(exp, TextChunk):
        return [exp.original_text if exp.original_text is not None else exp.text]
    if isinstance(exp, Alternative):
        out: list[str] = []
        for item in exp.items:
            out.extend(_cover(item, lists, rules, depth + 1))
        return list(dict.fromkeys(out))
    if isinstance(exp, Permutation):
        out = []
        for order in (exp.items, list(reversed(exp.items))):
            spaced: list[Any] = []
            for i, item in enumerate(order):
                if i:
                    spaced.append(TextChunk(" "))
                spaced.append(item)
            out.extend(_cover(Sequence(items=spaced), lists, rules, depth + 1))
        return list(dict.fromkeys(out))
    if isinstance(exp, Sequence):
        parts = [_cover(item, lists, rules, depth + 1) for item in exp.items]
        width = max((len(p) for p in parts), default=1)
        out = []
        for j in range(width):
            out.append(normalize_whitespace("".join(p[j % len(p)] for p in parts)))
            out.append(normalize_whitespace("".join(p[-1 - (j % len(p))] for p in parts)))
        return list(dict.fromkeys(out))
    if isinstance(exp, ListReference):
        slot_list = lists.get(exp.list_name)
        if isinstance(slot_list, TextSlotList) and slot_list.values:
            out = []
            for value in slot_list.values[:3]:
                out.extend(_cover(value.text_in, lists, rules, depth + 1))
            return out
        if isinstance(slot_list, RangeSlotList):
            return [str(slot_list.start)]
        return [_FILL]
    if isinstance(exp, RuleReference):
        rule = rules.get(exp.rule_name)
        return _cover(rule.expression, lists, rules, depth + 1) if rule else [_FILL]
    raise TypeError(f"unexpected hassil expression {exp!r}")


def _builtin_texts(language: str) -> list[tuple[str, str]]:
    builtin = Intents.from_dict(intents_pkg.get_intents(language))
    texts: list[tuple[str, str]] = []
    for intent_name, intent_def in builtin.intents.items():
        for data in intent_def.data:
            rules = {**builtin.expansion_rules, **data.expansion_rules}
            for sentence in data.sentences:
                for text in _cover(sentence.expression, builtin.slot_lists, rules):
                    if text.strip():
                        texts.append((intent_name, text.strip()))
    return texts


# ─── the hijack ───────────────────────────────────────────────────────────


@_slow_hassil
@pytest.mark.parametrize("language", _LANGUAGES)
def test_no_builtin_command_matches_any_of_our_sentences(language: str) -> None:
    ours = _ours(language)
    lists = _our_runtime_lists()
    stolen: dict[str, list[str]] = {}
    texts = _builtin_texts(language)
    assert len(texts) > 500, f"{language}: suspiciously few built-in samples ({len(texts)})"
    for intent_name, text in texts:
        for result in recognize_all(text, ours, slot_lists=lists, language=language):
            stolen.setdefault(f"{result.intent.name} ← {intent_name}", []).append(text)
            break
    report = "; ".join(f"{k}: {v[:3]}" for k, v in stolen.items())
    assert not stolen, f"{language}: our sentences would win over Home Assistant's own commands — {report}"


def test_the_audit_phrases_no_longer_match() -> None:
    """The exact phrases the live audit heard answered by us (2026-09-30).

    Independent of hassil's speed, so it runs on every leg."""
    heard = {
        "en": ["skip this song", "skip to the next song", "pause the radio", "mute the TV", "complete milk off the list"],
        "de": ["Radio stummschalten", "überspringe dieses Lied", "pausiere die Musik"],
        "fr": ["mets la télé en pause", "passe à la chanson suivante"],
        "es": ["silencia la radio", "salta esta canción", "pausa la música"],
        "it": ["metti in pausa il timer", "salta questa canzone", "quanti gradi ci sono"],
        "nl": ["sla dit nummer over", "zet de muziek op stil", "markeer melk op het boodschappenlijstje als klaar"],
    }
    lists = _our_runtime_lists()
    for language, phrases in heard.items():
        ours = _ours(language)
        for phrase in phrases:
            hits = [r.intent.name for r in recognize_all(phrase, ours, slot_lists=lists, language=language)]
            assert not hits, f"{language}: {phrase!r} is still taken by {hits}"


# ─── what people say still lands ──────────────────────────────────────────

_SAYS: dict[str, list[tuple[str, str, dict[str, Any]]]] = {
    "en": [
        ("what maintenance is due", "ListTasks", {}),
        ("what is overdue", "ListTasks", {"status": "overdue"}),
        ("what is due this week", "ListTasks", {"within_days": 7}),
        ("what is due in the kitchen", "ListTasks", {"area": "kitchen"}),
        ("I did the oil change on the car", "CompleteTask", {"name": "oil change on the car"}),
        ("the water filter is done", "CompleteTask", {"name": "water filter"}),
        ("mark the descaling as done", "CompleteTask", {"name": "descaling"}),
        ("skip the lawn mowing this time", "SkipTask", {"name": "lawn mowing"}),
        ("skip the gutter cleaning task", "SkipTask", {"name": "gutter cleaning"}),
        ("snooze the reminders for the water filter", "SnoozeTask", {"name": "water filter"}),
        ("postpone the oil change by 5 days", "PostponeTask", {"name": "oil change", "days": 5}),
        ("how many water filters do we have", "PartStock", {"name": "water filters"}),
        ("the water meter reads 1234.5", "RecordReading", {"name": "water meter", "value": "1234.5"}),
        ("add a note to the boiler saying pressure was low", "AddNote", {"name": "boiler", "note": "pressure was low"}),
        ("whose turn is it to do the lawn mowing", "WhoseTurn", {"name": "lawn mowing"}),
        ("what do we need to buy", "ShoppingList", {}),
        ("I bought 4 water filters", "BoughtPart", {"name": "water filters", "quantity": 4}),
        ("which batteries are low", "LowBatteries", {}),
        ("undo that", "Undo", {}),
    ],
    "de": [
        ("was ist überfällig", "ListTasks", {"status": "overdue"}),
        ("was ist diese Woche fällig", "ListTasks", {"within_days": 7}),
        ("was ist in der Küche fällig", "ListTasks", {"area": "Küche"}),
        ("erledige den Ölwechsel", "CompleteTask", {"name": "Ölwechsel"}),
        ("Wasserfilter erledigt", "CompleteTask", {"name": "Wasserfilter"}),
        ("ich habe den Ölwechsel am Auto gemacht", "CompleteTask", {"name": "Ölwechsel am Auto"}),
        ("wann ist das Entkalken fällig", "TaskDue", {"name": "Entkalken"}),
        ("überspringe das Rasenmähen diesmal", "SkipTask", {"name": "Rasenmähen"}),
        ("verschiebe den Ölwechsel um 3 Tage", "PostponeTask", {"name": "Ölwechsel", "days": 3}),
        ("der Stromzähler steht auf 12345,6", "RecordReading", {"name": "Stromzähler", "value": "12345,6"}),
        ("notiere beim Kessel dass der Druck niedrig war", "AddNote", {"name": "Kessel", "note": "der Druck niedrig war"}),
        ("wer ist beim Rasenmähen dran", "WhoseTurn", {"name": "Rasenmähen"}),
        ("was müssen wir kaufen", "ShoppingList", {}),
        ("ich habe 4 Wasserfilter gekauft", "BoughtPart", {"name": "Wasserfilter", "quantity": 4}),
        ("welche Batterien sind leer", "LowBatteries", {}),
        ("mach das rückgängig", "Undo", {}),
    ],
    "fr": [
        ("qu'est-ce qui est en retard", "ListTasks", {"status": "overdue"}),
        ("j'ai fait la vidange", "CompleteTask", {"name": "vidange"}),
        ("saute la tonte cette fois", "SkipTask", {"name": "tonte"}),
        ("qui doit faire la tonte", "WhoseTurn", {"name": "tonte"}),
        ("annule ça", "Undo", {}),
    ],
    "es": [
        ("qué toca esta semana", "ListTasks", {"within_days": 7}),
        ("ya he hecho el cambio de aceite", "CompleteTask", {"name": "cambio de aceite"}),
        ("salta la poda esta vez", "SkipTask", {"name": "poda"}),
        ("qué tenemos que comprar", "ShoppingList", {}),
    ],
    "it": [
        ("cosa è in ritardo", "ListTasks", {"status": "overdue"}),
        ("ho fatto il cambio olio", "CompleteTask", {"name": "cambio olio"}),
        ("salta il taglio dell'erba per questa volta", "SkipTask", {"name": "taglio dell'erba"}),
        ("quali batterie sono scariche", "LowBatteries", {}),
    ],
    "nl": [
        ("wat is te laat", "ListTasks", {"status": "overdue"}),
        ("ik heb de olie verversen gedaan", "CompleteTask", {"name": "olie verversen"}),
        ("sla het gras maaien deze keer over", "SkipTask", {"name": "gras maaien"}),
        ("maak dat ongedaan", "Undo", {}),
    ],
}


def _said(value: Any) -> str:
    """A slot value as text; newer hassil hands range values over as floats."""
    if isinstance(value, float) and value.is_integer():
        value = int(value)
    return str(value).strip()


@pytest.mark.parametrize("language", sorted(_SAYS))
def test_what_people_say_lands_on_the_right_intent(language: str) -> None:
    ours = _ours(language)
    lists = _our_runtime_lists()
    wrong: list[str] = []
    for phrase, expected, slots in _SAYS[language]:
        results = list(recognize_all(phrase, ours, slot_lists=lists, language=language))
        names = {r.intent.name for r in results}
        if names != {f"MaintenanceSupporter{expected}"}:
            wrong.append(f"{phrase!r} → {sorted(names) or 'nothing'}")
            continue
        # A wildcard may be read with or without a neighbouring optional word
        # ("the" in the name or not); one reading must give exactly the slots.
        readings = [{k: _said(v.value) for k, v in r.entities.items()} for r in results]
        if not any(all(got.get(k) == str(v) for k, v in slots.items()) for got in readings):
            wrong.append(f"{phrase!r}: slots {readings}, expected {slots}")
    assert not wrong, f"{language}: " + "; ".join(wrong)


# ─── merge hazards ────────────────────────────────────────────────────────


@pytest.mark.parametrize("language", _LANGUAGES)
def test_our_list_and_rule_names_never_replace_builtin_ones(language: str) -> None:
    """Home Assistant MERGES a custom sentence file into its own intents
    (``merge_dict``): a list or expansion rule of ours with a built-in name
    would silently replace the built-in one — French already has rules called
    ``le`` and ``de``. Ours carry an ``ms_`` prefix or a name no core uses."""
    ours = yaml.safe_load((_SENTENCES / language / "maintenance_supporter.yaml").read_text(encoding="utf-8"))
    builtin = intents_pkg.get_intents(language)
    clash_lists = sorted(set(ours.get("lists", {})) & set(builtin.get("lists", {})))
    clash_rules = sorted(set(ours.get("expansion_rules", {})) & set(builtin.get("expansion_rules", {})))
    assert not clash_lists, f"{language}: lists shadow built-in ones: {clash_lists}"
    assert not clash_rules, f"{language}: expansion rules shadow built-in ones: {clash_rules}"
