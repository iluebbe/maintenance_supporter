"""Which templates this home already uses — "already set up" (v2.94).

The template gallery and the config flow's template step mark a template the
user already has an object for, and the "Recommended for your home" block
leaves it out: recommending the pool to a home that tracks its pool is noise.

An object created from a template remembers it (``template_id`` on the object,
since 2.94). Objects from before carry no id, so they are matched the way a
person would recognise them: the object still has the template's name in any
of the 22 languages (the gallery names new objects after the template, "Pool 2"
when the name is taken), or it holds most of the template's tasks under their
template names. Archived objects do not count — an archived pool is no longer
maintained, so the pool may be recommended again.
"""

from __future__ import annotations

import re
from collections.abc import Iterable
from functools import lru_cache
from typing import TYPE_CHECKING, Any

from ..const import CONF_OBJECT, CONF_TASKS

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

OBJECT_TEMPLATE_ID = "template_id"

# "Pool 2" — the auto-number the gallery appends when a name is taken.
_AUTO_NUMBER = re.compile(r"\s+\d{1,2}$")


def _norm(text: str) -> str:
    return " ".join(text.casefold().split())


def _localizations(text_en: str) -> set[str]:
    """``text_en`` in every language the template table carries, normalised."""
    from ..templates_i18n import _T

    return {_norm(text_en), *(_norm(v) for v in _T.get(text_en, {}).values() if v)}


@lru_cache(maxsize=1)
def _index() -> tuple[dict[str, str | None], dict[str, list[set[str]]]]:
    """(localized template name → template id, None when two templates share
    it; template id → one set of localized names per task)."""
    from ..templates import TEMPLATES

    names: dict[str, str | None] = {}
    tasks: dict[str, list[set[str]]] = {}
    for template in TEMPLATES:
        for name in _localizations(template.name):
            names[name] = template.id if names.get(name, template.id) == template.id else None
        tasks[template.id] = [_localizations(tt.name) for tt in template.tasks]
    return names, tasks


def match_template(object_name: Any, task_names: Iterable[Any]) -> str | None:
    """The template an object without a stored ``template_id`` was most likely
    made from, or None.

    By name first (exact, auto-number stripped, any language). Else by tasks
    present under their template names: three of them, or two that make up at
    least half of the template. One shared task ("Replace Filter") proves
    nothing, single-task templates are only matched by name, and an object
    from an older, shorter version of a template (the car gained tasks in
    2.93) still counts. Two templates matching equally well → no match.
    """
    names, task_index = _index()
    if isinstance(object_name, str) and object_name.strip():
        key = _AUTO_NUMBER.sub("", _norm(object_name))
        by_name = names.get(key)
        if by_name:
            return by_name
    have = {_norm(n) for n in task_names if isinstance(n, str) and n.strip()}
    if len(have) < 2:
        return None
    # More matching tasks first, then the larger share of the template.
    best: tuple[int, float] = (0, 0.0)
    best_id: str | None = None
    tie = False
    for template_id, wanted in task_index.items():
        if len(wanted) < 2:
            continue
        hits = sum(1 for variants in wanted if variants & have)
        if hits < 3 and (hits < 2 or hits * 2 < len(wanted)):
            continue
        score = (hits, hits / len(wanted))
        if score > best:
            best, best_id, tie = score, template_id, False
        elif score == best:
            tie = True
    return None if tie else best_id


def object_template_id(obj_data: dict[str, Any], tasks: dict[str, Any] | None) -> str | None:
    """The template an object comes from: the stored id, else the match."""
    from ..templates import KNOWN_TEMPLATE_IDS

    stored = obj_data.get(OBJECT_TEMPLATE_ID)
    if isinstance(stored, str) and stored in KNOWN_TEMPLATE_IDS:
        return stored
    task_names = [t.get("name") for t in (tasks or {}).values() if isinstance(t, dict)]
    return match_template(obj_data.get("name"), task_names)


def templates_in_use(hass: HomeAssistant) -> set[str]:
    """Ids of the templates an active (not archived) object stands for."""
    from .aggregate import get_object_entries

    used: set[str] = set()
    for entry in get_object_entries(hass):
        obj_data = entry.data.get(CONF_OBJECT) or {}
        if obj_data.get("archived_at") is not None:
            continue
        template_id = object_template_id(obj_data, entry.data.get(CONF_TASKS))
        if template_id:
            used.add(template_id)
    return used
