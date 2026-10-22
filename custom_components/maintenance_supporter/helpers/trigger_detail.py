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
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import CONF_TRIGGER_DETAIL_ATTRIBUTE

MAX_DETAIL_LENGTH = 200


def format_attribute_value(value: Any) -> str | None:
    """An attribute value as one line of text, or None when it says nothing."""
    if value is None:
        return None
    if isinstance(value, bool):
        text = "yes" if value else "no"
    elif isinstance(value, float):
        text = f"{value:g}"
    elif isinstance(value, (list, tuple, set, frozenset)):
        items = [t for t in (format_attribute_value(v) for v in value) if t]
        text = ", ".join(items)
    elif isinstance(value, Mapping):
        pairs = [(str(k), format_attribute_value(v)) for k, v in value.items()]
        text = ", ".join(f"{k}: {v}" for k, v in pairs if v)
    else:
        text = str(value)
    text = " ".join(text.split())
    return text or None


def _cap(text: str) -> str:
    return text if len(text) <= MAX_DETAIL_LENGTH else text[: MAX_DETAIL_LENGTH - 1].rstrip() + "…"


def trigger_detail(hass: HomeAssistant, trigger_config: Mapping[str, Any] | None) -> str | None:
    """The detail attribute's current value across the trigger's entities,
    or None when the trigger names none or no entity carries it."""
    from ..entity.triggers import normalize_entity_ids

    if not trigger_config:
        return None
    attribute = trigger_config.get(CONF_TRIGGER_DETAIL_ATTRIBUTE)
    if not isinstance(attribute, str) or not attribute:
        return None
    found: list[tuple[str, str]] = []
    for entity_id in normalize_entity_ids(dict(trigger_config)):
        state = hass.states.get(entity_id)
        if state is None:
            continue
        text = format_attribute_value(state.attributes.get(attribute))
        if text:
            found.append((state.name or entity_id, text))
    if not found:
        return None
    if len(found) == 1:
        return _cap(found[0][1])
    return _cap(" · ".join(f"{name}: {text}" for name, text in found))
