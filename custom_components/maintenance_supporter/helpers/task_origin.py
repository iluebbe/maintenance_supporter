"""Where a task came from — its fingerprint (2.95).

A task adopted from Suggested setups, from a problem sensor or created from
an object template records its origin in the top-level ``origin`` field::

    {"kind": "integration", "integration": "roborock",
     "duty": "Replace Main Brush", "direction": "duration_left",
     "device_id": "…", "entity_label": "Cyan"}      # label: per-entity duties
    {"kind": "problem_sensor", "entity_id": "binary_sensor.…"}
    {"kind": "template", "template": "robot_vacuum", "task": "Replace Filter"}

The name is not part of it, so a renamed task is still recognised: discovery
treats it as the duty it came from (no duplicate proposal, "already there"),
and it is offered its counter reset. Integration duties are keyed by
(integration, EN task name, direction) — the catalog's own identity; template
tasks by (template id, EN task name).

Tasks created before 2.95 get their origin once at setup when it is certain
(``backfill_origins``): named as the catalog duty (any language) and watching
an entity that duty matches, or named as a task of the object's stored
template. A renamed one is never guessed — the reset offer shows it unticked
as "renamed" and wiring it records the origin.

A copy made with "Duplicate" is the user's own task and does not inherit the
origin; moving, editing, export/import and replacing the object keep it.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

ORIGIN_KEY = "origin"

_KINDS = frozenset({"integration", "problem_sensor", "template"})
_FIELDS = frozenset({"kind", "integration", "duty", "direction", "device_id", "entity_label", "entity_id", "template", "task"})
_MAX_LEN = 255


def integration_origin(integration: str, duty: str, direction: str, device_id: str | None, entity_label: str | None = None) -> dict[str, str]:
    """The origin of a task adopted from a catalog duty."""
    origin = {"kind": "integration", "integration": integration, "duty": duty, "direction": direction}
    if device_id:
        origin["device_id"] = device_id
    if entity_label:
        origin["entity_label"] = entity_label
    return origin


def problem_sensor_origin(entity_id: str) -> dict[str, str]:
    """The origin of a task adopted from a problem sensor."""
    return {"kind": "problem_sensor", "entity_id": entity_id}


def template_origin(template_id: str, task_name: str) -> dict[str, str]:
    """The origin of a task created from an object template."""
    return {"kind": "template", "template": template_id, "task": task_name}


def sanitize_origin(value: Any) -> dict[str, str] | None:
    """A stored or imported origin reduced to known string fields, or None
    when it is not one (an import is untrusted input)."""
    if not isinstance(value, Mapping) or value.get("kind") not in _KINDS:
        return None
    return {k: v[:_MAX_LEN] for k, v in value.items() if k in _FIELDS and isinstance(v, str) and v}


def task_origin(task: Mapping[str, Any]) -> dict[str, str] | None:
    """The task's origin, if it has a valid one."""
    return sanitize_origin(task.get(ORIGIN_KEY))


def origin_is_duty(task: Mapping[str, Any], integration: str, duty: str, direction: str) -> bool:
    """Whether the task was adopted from exactly this catalog duty."""
    origin = task_origin(task)
    return (
        origin is not None
        and origin.get("kind") == "integration"
        and origin.get("integration") == integration
        and origin.get("duty") == duty
        and origin.get("direction") == direction
    )


def _catalog_duty_for(hass: HomeAssistant, task: Mapping[str, Any], ent_reg: er.EntityRegistry) -> dict[str, str] | None:
    """An integration origin for a pre-2.95 task that is CERTAINLY a catalog
    duty: named as the duty (any language, per-entity suffix allowed) and
    watching an entity that duty matches."""
    from ..entity.triggers import normalize_entity_ids
    from .signatures import SIGNATURES
    from .signatures._discovery import _matches_catalog_key
    from .signatures._model import PER_ENTITY_SEPARATOR, _entity_unit, _unit_compatible, catalog_base_name, task_name_variants

    tc = task.get("trigger_config")
    if not isinstance(tc, dict):
        return None
    name = str(task.get("name", ""))
    base = catalog_base_name(name.lower())
    label = name.split(PER_ENTITY_SEPARATOR, 1)[1] if PER_ENTITY_SEPARATOR in name else None
    for entity_id in normalize_entity_ids(tc):
        reg = ent_reg.async_get(entity_id)
        if reg is None:
            continue
        catalog = SIGNATURES.get(reg.platform)
        if catalog is None:
            continue
        keys = {k for s in catalog.tasks for k in s.keys}
        for sig in catalog.tasks:
            # A per-entity duty's suffix names the entity; one on a device with a
            # single such entity carries none (a mono printer's toner).
            if base not in task_name_variants(sig.task_name) or (label and not sig.per_entity):
                continue
            if sig.keys and not any(
                _matches_catalog_key(reg, key, keys, tk_authoritative=catalog.translation_keys_authoritative) for key in sig.keys
            ):
                continue
            if sig.entity_domain != reg.domain or not _unit_compatible(sig.direction, _entity_unit(hass, reg)):
                continue
            return integration_origin(reg.platform, sig.task_name, sig.direction, reg.device_id, label)
    return None


def _template_task_for(template_id: str, task: Mapping[str, Any]) -> dict[str, str] | None:
    """A template origin for a pre-2.95 task named as exactly one task of the
    object's stored template (any language)."""
    from ..templates import get_template_by_id
    from .signatures._model import task_name_variants

    template = get_template_by_id(template_id)
    if template is None:
        return None
    name = str(task.get("name", "")).lower()
    hits = [tt.name for tt in template.tasks if name in task_name_variants(tt.name)]
    return template_origin(template_id, hits[0]) if len(hits) == 1 else None


def backfill_origins(hass: HomeAssistant, data: Mapping[str, Any]) -> dict[str, Any] | None:
    """The entry data with origins recorded for tasks where they are certain,
    or None when nothing changed. Idempotent: a task with an origin is left
    alone."""
    from ..const import CONF_OBJECT, CONF_TASKS
    from .template_usage import OBJECT_TEMPLATE_ID

    tasks = data.get(CONF_TASKS)
    if not isinstance(tasks, Mapping):
        return None
    obj = data.get(CONF_OBJECT)
    template_id = obj.get(OBJECT_TEMPLATE_ID) if isinstance(obj, Mapping) else None
    ent_reg = er.async_get(hass)
    new_tasks: dict[str, Any] | None = None
    for task_id, task in tasks.items():
        if not isinstance(task, Mapping) or ORIGIN_KEY in task:
            continue
        origin = _catalog_duty_for(hass, task, ent_reg)
        if origin is None and isinstance(template_id, str) and template_id:
            origin = _template_task_for(template_id, task)
        if origin is None:
            continue
        if new_tasks is None:
            new_tasks = dict(tasks)
        new_tasks[task_id] = {**task, ORIGIN_KEY: origin}
    if new_tasks is None:
        return None
    return {**data, CONF_TASKS: new_tasks}
