"""The trigger detail (#228): what a triggered task is about, in its own words.

A sensor trigger may name a ``detail_attribute``: an attribute of the
entity it watches whose value says what the trigger is about (which
medicine runs low, which room's window is open). While the trigger is
active, the value shows with the task in the panel and the card, rides on
its reminder and its row in the integration's to-do list, and is part of
the notification event (``trigger_detail``).

The value is read live from the entity's state each time, so a list that
grows or shrinks while the task waits shows as it is now. Lists read as
"a, b", a mapping as "key: value, …", whitespace collapses and the whole
text is capped. With more than one watched entity carrying the attribute,
each value is named after its entity.

A number reads as a person writes it: at most two decimals, no exponent,
the decimal mark of the language the text is for ("21,46" in a German
reminder). A text that is nothing but a long decimal ("21.456789", as
some integrations report a reading) is rounded the same way. Numbers
with a decimal comma are listed with "; " ("21,46; 0,5").

Who reads it decides the mark: a reminder the notification language, the
to-do list Home Assistant's. The notification event and the panel get a
point: an automation parses the event, and the panel writes the numbers
in its viewer's own format (it is told which ones they are).
"""

from __future__ import annotations

import re
from collections.abc import Mapping
from decimal import Decimal
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import CONF_TRIGGER_DETAIL_ATTRIBUTE
from .i18n import DECIMAL_COMMA_LANGUAGES, normalize_language, normalize_language_code, plain_number

MAX_DETAIL_LENGTH = 200
# A text that is one decimal number with three or more decimals: a reading
# reported as text. Shorter ones stay as written ("1.10" may be a version).
_LONG_DECIMAL = re.compile(r"[+-]?\d+\.\d{3,}")
_DECIMAL_COMMA = re.compile(r"\d,\d")


def _join(items: list[str], lang: str | None) -> str:
    """A list on one line. Where the decimal mark is a comma, numbers that
    have one are told apart by "; ": "21,46, 0,5, 3" does not read."""
    comma = bool(lang) and normalize_language_code(lang) in DECIMAL_COMMA_LANGUAGES
    return ("; " if comma and any(_DECIMAL_COMMA.search(item) for item in items) else ", ").join(items)


def _number(value: float, lang: str | None, numbers: list[str] | None) -> str:
    text = plain_number(value, lang)
    if numbers is not None and "." in text and text not in numbers:
        numbers.append(text)
    return text


def format_attribute_value(value: Any, lang: str | None = None, numbers: list[str] | None = None) -> str | None:
    """An attribute value as one line of text, or None when it says nothing.
    ``lang`` sets a number's decimal mark (a point without one).
    ``numbers`` collects the decimals written with a point, for a reader
    that puts them into its own number format (the panel)."""
    if value is None:
        return None
    if isinstance(value, bool):
        text = "yes" if value else "no"
    elif isinstance(value, (float, Decimal)):
        text = _number(float(value), lang, numbers)
    elif isinstance(value, str) and _LONG_DECIMAL.fullmatch(value.strip()):
        text = _number(float(value), lang, numbers)
    elif isinstance(value, (list, tuple, set, frozenset)):
        text = _join([t for t in (format_attribute_value(v, lang, numbers) for v in value) if t], lang)
    elif isinstance(value, Mapping):
        pairs = [(str(k), format_attribute_value(v, lang, numbers)) for k, v in value.items()]
        text = _join([f"{k}: {v}" for k, v in pairs if v], lang)
    else:
        text = str(value)
    text = " ".join(text.split())
    return text or None


def _cap(text: str) -> str:
    return text if len(text) <= MAX_DETAIL_LENGTH else text[: MAX_DETAIL_LENGTH - 1].rstrip() + "…"


def trigger_detail(
    hass: HomeAssistant, trigger_config: Mapping[str, Any] | None, lang: str | None = None, numbers: list[str] | None = None
) -> str | None:
    """The detail attribute's current value across the trigger's entities,
    or None when the trigger names none or no entity carries it. Numbers
    are written for ``lang`` (Home Assistant's when left out); ``numbers``
    as in :func:`format_attribute_value`."""
    from ..entity.triggers import normalize_entity_ids

    if not trigger_config:
        return None
    attribute = trigger_config.get(CONF_TRIGGER_DETAIL_ATTRIBUTE)
    if not isinstance(attribute, str) or not attribute:
        return None
    language = lang or normalize_language(hass)
    found: list[tuple[str, str]] = []
    for entity_id in normalize_entity_ids(dict(trigger_config)):
        state = hass.states.get(entity_id)
        if state is None:
            continue
        text = format_attribute_value(state.attributes.get(attribute), language, numbers)
        if text:
            found.append((state.name or entity_id, text))
    if not found:
        return None
    if len(found) == 1:
        return _cap(found[0][1])
    return _cap(" · ".join(f"{name}: {text}" for name, text in found))
