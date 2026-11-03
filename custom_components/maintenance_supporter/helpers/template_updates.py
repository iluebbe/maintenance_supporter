"""What a template has learned since a task was made from it (D#85).

A task made from an object template keeps its ``origin`` (helpers/task_origin)
and, since 2.118, a fingerprint of what the template gave it per managed field
(``origin["applied"]``) plus the language it was made in (``origin["lang"]``).
Three values per field tell the cases apart:

- the task still holds what the template gave it and the template now says
  something else: an **update**, offered ticked;
- the user changed it and the template did not: the user's, left alone;
- both changed: a **conflict**, offered unticked ("you changed this").

A task made before 2.118 gets its fingerprints once at setup
(:func:`sync_bases`): a field holding anything the template ever said, in any
language (templates_history.py), counts as the template's; any other value is
the user's own (its base is then the template's current value, so it is never
offered over).

The managed fields are the name, the notes, the recurrence (the part of the
schedule a template sets: kind, interval, unit, season window, calendar days
and months; the anchor, a finite end and a business-day roll stay the
user's) and the warning days.

An object made from a template is also offered the template's tasks that came
after it: a task first appeared in the template after the object's oldest
template task was created. A task the user deleted, or left out when creating
the object, is never offered again.

A declined change is remembered as the template value said no to (the task's
``origin["declined"]``, the object's ``template_declined`` for new tasks), so
a later, different change is offered again. History is never touched; an
applied change adds an ``updated`` entry naming the fields.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from functools import lru_cache
from typing import Any, Final

from homeassistant.core import HomeAssistant

from ..const import CONF_OBJECT, CONF_TASKS
from ..templates import TaskTemplate, build_template_task, get_template_by_id, template_tasks
from ..templates_history import HISTORY
from ..templates_i18n import _T, localize_template_text
from .home_profile import async_climate, async_home_place
from .schedule import Schedule, normalize_task_storage
from .task_origin import ORIGIN_KEY, task_origin
from .template_fingerprint import FIELDS, MANAGED_SCHEDULE_KEYS, fingerprint, fingerprints, task_values
from .template_usage import OBJECT_TEMPLATE_ID

#: Object field: template task keys the user said no to.
DECLINED_TASKS_KEY: Final = "template_declined"


@lru_cache(maxsize=1)
def template_languages() -> tuple[str, ...]:
    """English plus every language the template table carries."""
    return ("en", *sorted({lang for values in _T.values() for lang in values}))


@dataclass(frozen=True)
class Home:
    """What a template task is built for: the home's seasons and place."""

    hemisphere: str = "north"
    has_winter: bool = True
    country: str | None = None
    region: str | None = None


async def async_home(hass: HomeAssistant) -> Home:
    """This home, as :func:`templates.async_build_template_tasks` sees it."""
    climate = await async_climate(hass)
    country, region = await async_home_place(hass)
    return Home(
        hemisphere=climate.hemisphere if climate else "north",
        has_winter=climate.has_winter if climate else True,
        country=country,
        region=region,
    )


def built_task(tt: TaskTemplate, lang: str, home: Home) -> dict[str, Any]:
    """The task ``tt`` creates today in this home and language."""
    return build_template_task(tt, lang, hemisphere=home.hemisphere, has_winter=home.has_winter, country=home.country, region=home.region)


def template_task(origin: Mapping[str, Any] | None) -> tuple[str, TaskTemplate] | None:
    """(template id, template task) a template origin points to."""
    if not origin or origin.get("kind") != "template":
        return None
    template = get_template_by_id(str(origin.get("template") or ""))
    if template is None:
        return None
    key = origin.get("task")
    for tt in template.tasks:
        if tt.key == key:
            return template.id, tt
    return None


def _past(template_id: str, tt: TaskTemplate, home: Home) -> dict[str, set[str]]:
    """Fingerprints of everything ``tt`` ever gave a task in this home, any
    language (templates_history.py)."""
    rec = HISTORY.get(template_id, {}).get(tt.key)
    if not rec:
        return {f: set() for f in FIELDS}
    recurrences: set[str] = set()
    for raw in rec["recurrence"]:
        old = TaskTemplate(
            name=tt.name,
            type=tt.type,
            schedule_type=raw.get("schedule_type") or tt.schedule_type,
            interval_days=raw.get("interval_days"),
            season_months=tuple(raw.get("season_months") or ()),
            schedule=raw.get("schedule") or None,
            country_intervals=raw.get("country_intervals") or None,
        )
        built = built_task(old, "en", home)
        if built.get("interval_days") == 0:  # no such duty here then
            continue
        recurrences.add(fingerprint(task_values(built)["recurrence"]))
    return {
        "name": set(rec["names"].split()),
        "notes": set(rec["notes"].split()),
        "recurrence": recurrences,
        "warning_days": {fingerprint(v) for v in rec["warning_days"]},
    }


def task_language(task: Mapping[str, Any], tt: TaskTemplate, fallback: str) -> str:
    """The language a task was made in: recorded, else the language its name
    (or its notes) is in, else ``fallback``."""
    origin = task_origin(task) or {}
    if (lang := origin.get("lang")) in template_languages():
        return str(lang)
    name = str(task.get("name") or "").strip()
    by_name = [lang for lang in template_languages() if name in {localize_template_text(t, lang) for t in (tt.name, tt.key)}]
    if by_name:
        return fallback if fallback in by_name else by_name[0]
    notes = str(task.get("notes") or "").strip()
    if notes and tt.notes:
        by_notes = [lang for lang in template_languages() if notes.startswith(localize_template_text(tt.notes, lang) or tt.notes)]
        if by_notes:
            return fallback if fallback in by_notes else by_notes[0]
    return fallback


def base_for(task: Mapping[str, Any], template_id: str, tt: TaskTemplate, lang: str, home: Home) -> dict[str, str]:
    """The fingerprints a task made before 2.118 is given: what it holds
    where the template ever said so, else the template's value today (a
    field the user changed is theirs)."""
    mine = fingerprints(task_values(task))
    now = fingerprints(task_values(built_task(tt, lang, home)))
    past = _past(template_id, tt, home)
    return {f: mine[f] if mine[f] == now[f] or mine[f] in past[f] else now[f] for f in FIELDS}


def has_template_tasks(data: Mapping[str, Any]) -> bool:
    """Whether any task of the entry was made from a template."""
    return any(
        isinstance(task, Mapping) and (task_origin(task) or {}).get("kind") == "template" for task in (data.get(CONF_TASKS) or {}).values()
    )


def sync_bases(data: Mapping[str, Any], home: Home, fallback_lang: str) -> dict[str, Any] | None:
    """The entry data with every template task's base in place, or None when
    nothing changed. Records the base and language of tasks made before
    2.118, and moves a base on where the user made the template's change
    themselves (task = template), so the next change compares right."""
    tasks = data.get(CONF_TASKS)
    if not isinstance(tasks, Mapping):
        return None
    new_tasks: dict[str, Any] | None = None
    for task_id, task in tasks.items():
        if not isinstance(task, Mapping):
            continue
        raw = task.get(ORIGIN_KEY)
        found = template_task(task_origin(task))
        if found is None or not isinstance(raw, Mapping):
            continue
        template_id, tt = found
        lang = task_language(task, tt, fallback_lang)
        applied = raw.get("applied") if isinstance(raw.get("applied"), Mapping) else None
        if applied is None:
            new_origin = {**raw, "lang": lang, "applied": base_for(task, template_id, tt, lang, home)}
        else:
            mine = fingerprints(task_values(task))
            theirs = fingerprints(task_values(built_task(tt, lang, home)))
            moved = {f: theirs[f] for f in FIELDS if mine[f] == theirs[f] and applied.get(f) != theirs[f]}
            if not moved and raw.get("lang") == lang:
                continue
            new_origin = {**raw, "lang": lang, "applied": {**applied, **moved}}
        if new_origin == raw:
            continue
        if new_tasks is None:
            new_tasks = dict(tasks)
        new_tasks[task_id] = {**task, ORIGIN_KEY: new_origin}
    if new_tasks is None:
        return None
    return {**data, CONF_TASKS: new_tasks}


@dataclass(frozen=True)
class FieldChange:
    """One field the template would change."""

    task_id: str
    field: str
    conflict: bool  # the user changed it too
    before: Any
    after: Any
    after_fp: str


def task_changes(task_id: str, task: Mapping[str, Any], home: Home, fallback_lang: str) -> list[FieldChange]:
    """What the template would change on one task (nothing for a task not
    made from a template, or whose template task is gone)."""
    origin = task_origin(task)
    found = template_task(origin)
    if found is None or origin is None:
        return []
    template_id, tt = found
    lang = task_language(task, tt, fallback_lang)
    applied = origin.get("applied")
    base = dict(applied) if isinstance(applied, Mapping) else base_for(task, template_id, tt, lang, home)
    raw_declined = origin.get("declined")
    declined: Mapping[str, Any] = raw_declined if isinstance(raw_declined, Mapping) else {}
    mine_values = task_values(task)
    theirs_values = task_values(built_task(tt, lang, home))
    changes: list[FieldChange] = []
    for f in FIELDS:
        mine, theirs = fingerprint(mine_values[f]), fingerprint(theirs_values[f])
        if mine == theirs or theirs == base.get(f) or declined.get(f) == theirs:
            continue
        changes.append(FieldChange(task_id, f, mine != base.get(f), mine_values[f], theirs_values[f], theirs))
    return changes


def object_template(data: Mapping[str, Any]) -> str | None:
    """The template an object was made from: stored, else the one its
    template tasks come from."""
    obj = data.get(CONF_OBJECT) or {}
    stored = obj.get(OBJECT_TEMPLATE_ID) if isinstance(obj, Mapping) else None
    if isinstance(stored, str) and get_template_by_id(stored) is not None:
        return stored
    for task in (data.get(CONF_TASKS) or {}).values():
        found = template_task(task_origin(task)) if isinstance(task, Mapping) else None
        if found is not None:
            return found[0]
    return None


def made_on(data: Mapping[str, Any], template_id: str) -> str | None:
    """The day the object got its tasks from the template (its oldest
    template task's creation day), or None when unknown."""
    days = []
    for task in (data.get(CONF_TASKS) or {}).values():
        if not isinstance(task, Mapping):
            continue
        origin = task_origin(task) or {}
        created = task.get("created_at")
        if origin.get("kind") == "template" and origin.get("template") == template_id and isinstance(created, str) and created:
            days.append(created[:10])
    return min(days) if days else None


def task_added(template_id: str, tt: TaskTemplate) -> str | None:
    """The day a template task first appeared."""
    if tt.added:
        return tt.added
    rec = HISTORY.get(template_id, {}).get(tt.key)
    return str(rec["added"]) if rec else None


def new_tasks(data: Mapping[str, Any], home: Home) -> list[TaskTemplate]:
    """Template tasks that came after the object was made and that it has
    not got (nor declined)."""
    template_id = object_template(data)
    template = get_template_by_id(template_id) if template_id else None
    since = made_on(data, template_id) if template_id else None
    if template is None or template_id is None or since is None:
        return []
    have = set()
    for task in (data.get(CONF_TASKS) or {}).values():
        origin = task_origin(task) if isinstance(task, Mapping) else None
        if origin and origin.get("kind") == "template" and origin.get("template") == template_id:
            have.add(origin.get("task"))
    obj = data.get(CONF_OBJECT) or {}
    declined = set(obj.get(DECLINED_TASKS_KEY) or []) if isinstance(obj, Mapping) else set()
    offered = []
    for tt in template_tasks(template, has_winter=home.has_winter, country=home.country, region=home.region):
        added = task_added(template_id, tt)
        if tt.key in have or tt.key in declined or added is None or added <= since:
            continue
        offered.append(tt)
    return offered


def apply_recurrence(task: Mapping[str, Any], managed: Mapping[str, Any]) -> dict[str, Any]:
    """``task`` with the template's recurrence: the managed keys replaced,
    the user's extras (anchor, end, business-day roll) kept while the kind
    stays the same."""
    stored = normalize_task_storage(task)
    raw = stored.get("schedule")
    current: Mapping[str, Any] = raw if isinstance(raw, Mapping) else {}
    if current.get("kind") == managed.get("kind"):
        schedule = {**{k: v for k, v in current.items() if k not in MANAGED_SCHEDULE_KEYS}, **managed}
    else:
        schedule = dict(managed)
    return {**stored, "schedule": Schedule.from_dict(schedule).to_dict()}
